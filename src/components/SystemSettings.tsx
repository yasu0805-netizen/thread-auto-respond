import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useSecureForm, securityUtils } from '@/hooks/useSecureForm';
import { 
  threadsApiSchema, 
  aiSettingsSchema, 
  webhookSettingsSchema, 
  systemSettingsSchema
} from '@/lib/validations';
import { 
  Settings, 
  Key, 
  Webhook, 
  Brain, 
  Clock, 
  Mail,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Shield
} from 'lucide-react';

export function SystemSettings() {
  const { toast } = useToast();
  
  // セキュアフォーム設定
  const threadsApiForm = useSecureForm({
    schema: threadsApiSchema,
    defaultValues: {
      appId: '',
      appSecret: '',
      accessToken: '',
      botUserId: '',
      username: ''
    },
    onSubmit: async (data) => {
      console.log('Threads API設定:', { ...data, appSecret: securityUtils.maskSecret(data.appSecret) });
      toast({
        title: "Threads API設定を保存しました",
        description: "設定が正常に保存されました。",
      });
    }
  });

  const aiSettingsForm = useSecureForm({
    schema: aiSettingsSchema,
    defaultValues: {
      aiAutoReplyEnabled: false,
      aiEngine: 'gemini' as const,
      geminiApiKey: '',
      geminiModel: 'gemini-1.5-pro-002',
      openaiApiKey: '',
      openaiModel: 'gpt-4',
      defaultPersona: ''
    },
    onSubmit: async (data) => {
      console.log('AI設定:', { 
        ...data, 
        geminiApiKey: data.geminiApiKey ? securityUtils.maskSecret(data.geminiApiKey) : '',
        openaiApiKey: data.openaiApiKey ? securityUtils.maskSecret(data.openaiApiKey) : ''
      });
      toast({
        title: "AI設定を保存しました",
        description: "設定が正常に保存されました。",
      });
    }
  });

  const webhookSettingsForm = useSecureForm({
    schema: webhookSettingsSchema,
    defaultValues: {
      webhookUrl: '',
      verifyToken: ''
    },
    onSubmit: async (data) => {
      console.log('Webhook設定:', { ...data, verifyToken: securityUtils.maskSecret(data.verifyToken) });
      toast({
        title: "Webhook設定を保存しました",
        description: "設定が正常に保存されました。",
      });
    }
  });

  const systemSettingsForm = useSecureForm({
    schema: systemSettingsSchema,
    defaultValues: {
      pollingInterval: 300,
      maxLogRows: 10000,
      errorNotificationEmail: ''
    },
    onSubmit: async (data) => {
      console.log('システム設定:', data);
      toast({
        title: "システム設定を保存しました",
        description: "設定が正常に保存されました。",
      });
    }
  });

  // 接続テスト関数（セキュリティ強化）
  const handleTestConnection = async () => {
    const apiData = threadsApiForm.form.getValues();
    
    if (!apiData.appId || !apiData.appSecret) {
      toast({
        title: "入力エラー",
        description: "App IDとApp Secretを入力してください。",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "接続テスト中...",
      description: "Threads APIとの接続をテストしています。",
    });
  };

  const handleAuthorize = () => {
    const appId = threadsApiForm.form.getValues('appId');
    if (!appId) {
      toast({
        title: "エラー",
        description: "App IDを入力してください。",
        variant: "destructive"
      });
      return;
    }

    const state = securityUtils.generateSecureToken(32);
    localStorage.setItem('oauth_state', state);
    
    const params = new URLSearchParams({
      client_id: appId,
      redirect_uri: window.location.origin + '/oauth/callback',
      scope: 'threads_basic,threads_content_publish',
      response_type: 'code',
      state: state
    });
    
    window.open(`https://threads.net/oauth/authorize?${params}`, '_blank');
  };

  const getStatusBadge = (isValid: boolean) => {
    return isValid ? (
      <Badge variant="default" className="bg-success text-success-foreground">
        <CheckCircle className="h-3 w-3 mr-1" />
        正常
      </Badge>
    ) : (
      <Badge variant="destructive">
        <AlertTriangle className="h-3 w-3 mr-1" />
        要設定
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">システム設定</h1>
        <p className="text-muted-foreground">
          Threads Auto-Replyシステムの詳細設定（セキュリティ強化版）
        </p>
      </div>

      <Tabs defaultValue="api" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="api">API設定</TabsTrigger>
          <TabsTrigger value="ai">AI設定</TabsTrigger>
          <TabsTrigger value="webhook">Webhook</TabsTrigger>
          <TabsTrigger value="system">システム</TabsTrigger>
        </TabsList>

        {/* API Settings */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>Threads API設定</span>
                <Shield className="h-4 w-4 text-muted-foreground" />
                {getStatusBadge(threadsApiForm.isValid)}
              </CardTitle>
              <CardDescription>
                Threads APIへの接続とアカウント認証の設定（セキュア入力検証付き）
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...threadsApiForm.form}>
                <form onSubmit={threadsApiForm.handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={threadsApiForm.form.control}
                      name="appId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>App ID</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Threads App ID" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={threadsApiForm.form.control}
                      name="appSecret"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>App Secret</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="Threads App Secret" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={threadsApiForm.form.control}
                      name="botUserId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bot User ID</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Bot運用アカウントのUser ID" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={threadsApiForm.form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bot Username</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="@username" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" disabled={threadsApiForm.isSubmitting || !threadsApiForm.isValid}>
                      設定を保存
                    </Button>
                    <Button type="button" variant="outline" onClick={handleTestConnection}>
                      接続テスト
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleAuthorize}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Threads認証
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Settings */}
        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>AI自動返信設定</span>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
              <CardDescription>
                AI エンジンの設定とペルソナの管理（セキュアAPIキー管理）
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...aiSettingsForm.form}>
                <form onSubmit={aiSettingsForm.handleSubmit} className="space-y-4">
                  <FormField
                    control={aiSettingsForm.form.control}
                    name="aiAutoReplyEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>AI自動返信を有効にする</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={aiSettingsForm.form.control}
                    name="aiEngine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AIエンジン</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="gemini">Google Gemini</SelectItem>
                            <SelectItem value="openai">OpenAI</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {aiSettingsForm.form.watch('aiEngine') === 'gemini' && (
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-medium">Gemini設定</h4>
                      <FormField
                        control={aiSettingsForm.form.control}
                        name="geminiApiKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gemini API Key</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" placeholder="AIzaSy..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={aiSettingsForm.form.control}
                        name="geminiModel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>モデルID</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="gemini-1.5-pro-002">gemini-1.5-pro-002</SelectItem>
                                <SelectItem value="gemini-1.5-flash-002">gemini-1.5-flash-002</SelectItem>
                                <SelectItem value="gemini-pro">gemini-pro</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {aiSettingsForm.form.watch('aiEngine') === 'openai' && (
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-medium">OpenAI設定</h4>
                      <FormField
                        control={aiSettingsForm.form.control}
                        name="openaiApiKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>OpenAI API Key</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" placeholder="sk-..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={aiSettingsForm.form.control}
                        name="openaiModel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>モデル名</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="gpt-4" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <FormField
                    control={aiSettingsForm.form.control}
                    name="defaultPersona"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>デフォルトペルソナ</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="luna" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={aiSettingsForm.isSubmitting}>
                    AI設定を保存
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhook Settings */}
        <TabsContent value="webhook" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Webhook className="h-5 w-5" />
                <span>Webhook設定</span>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
              <CardDescription>
                リアルタイム通知の受信設定（セキュアトークン管理）
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...webhookSettingsForm.form}>
                <form onSubmit={webhookSettingsForm.handleSubmit} className="space-y-4">
                  <FormField
                    control={webhookSettingsForm.form.control}
                    name="webhookUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Webhook URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://script.google.com/macros/s/.../exec" />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          GASのWebアプリ公開URLを設定してください
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={webhookSettingsForm.form.control}
                    name="verifyToken"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verify Token</FormLabel>
                        <div className="flex space-x-2">
                          <FormControl>
                            <Input {...field} placeholder="ランダムな文字列" />
                          </FormControl>
                          <Button 
                            type="button"
                            variant="outline" 
                            size="sm"
                            onClick={() => field.onChange(securityUtils.generateSecureToken(32))}
                          >
                            生成
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Webhook受信時の検証に使用される秘密のトークン
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={webhookSettingsForm.isSubmitting}>
                    Webhook設定を保存
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>システム設定</span>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
              <CardDescription>
                システム動作の詳細設定（検証済み入力）
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...systemSettingsForm.form}>
                <form onSubmit={systemSettingsForm.handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={systemSettingsForm.form.control}
                      name="pollingInterval"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>ポーリング間隔（秒）</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number"
                              min="10"
                              max="3600"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={systemSettingsForm.form.control}
                      name="maxLogRows"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>最大ログ行数</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number"
                              min="100"
                              max="10000"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={systemSettingsForm.form.control}
                    name="errorNotificationEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>エラー通知メール</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="admin@example.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={systemSettingsForm.isSubmitting}>
                    システム設定を保存
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}