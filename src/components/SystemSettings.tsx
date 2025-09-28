import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Key, 
  Webhook, 
  Brain, 
  Clock, 
  Mail,
  CheckCircle,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

export function SystemSettings() {
  const { toast } = useToast();
  
  // Mock data - in real implementation, this would come from your GAS backend
  const [settings, setSettings] = useState({
    // API Settings
    threadsClientId: '',
    threadsClientSecret: '',
    threadsUserId: '',
    threadsUsername: '',
    authStatus: 'UNAUTHORIZED',
    
    // Webhook Settings
    webhookUrl: 'https://script.google.com/macros/s/your-script-id/exec',
    webhookVerifyToken: '',
    
    // AI Settings
    aiEngine: 'gemini',
    enableGeminiAutoReply: true,
    geminiApiKey: '',
    geminiModelId: 'gemini-1.5-pro-002',
    openaiApiKey: '',
    defaultPersonaName: 'luna',
    
    // System Settings
    pollingInterval: '5',
    errorNotificationEmail: '',
    maxLogRows: '10000',
    systemStatus: 'OK'
  });

  const handleSave = (section: string) => {
    // In real implementation, this would call your GAS backend
    toast({
      title: "設定を保存しました",
      description: `${section}の設定が正常に保存されました。`,
    });
  };

  const handleTestConnection = () => {
    // In real implementation, this would test the Threads API connection
    toast({
      title: "接続テスト中...",
      description: "Threads APIとの接続をテストしています。",
    });
  };

  const handleAuthorize = () => {
    // In real implementation, this would redirect to Threads OAuth
    window.open('https://threads.net/oauth/authorize?client_id=...', '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AUTHORIZED':
      case 'OK':
        return <Badge variant="default" className="bg-success text-success-foreground">
          <CheckCircle className="h-3 w-3 mr-1" />
          正常
        </Badge>;
      case 'UNAUTHORIZED':
      case 'ERROR':
        return <Badge variant="destructive">
          <AlertTriangle className="h-3 w-3 mr-1" />
          要設定
        </Badge>;
      default:
        return <Badge variant="secondary">不明</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">システム設定</h1>
        <p className="text-muted-foreground">
          Threads Auto-Replyシステムの詳細設定
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
                {getStatusBadge(settings.authStatus)}
              </CardTitle>
              <CardDescription>
                Threads APIへの接続とアカウント認証の設定
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input
                    id="clientId"
                    value={settings.threadsClientId}
                    onChange={(e) => setSettings({...settings, threadsClientId: e.target.value})}
                    placeholder="Threads Client ID"
                  />
                </div>
                <div>
                  <Label htmlFor="clientSecret">Client Secret</Label>
                  <Input
                    id="clientSecret"
                    type="password"
                    value={settings.threadsClientSecret}
                    onChange={(e) => setSettings({...settings, threadsClientSecret: e.target.value})}
                    placeholder="Threads Client Secret"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="userId">Bot User ID</Label>
                  <Input
                    id="userId"
                    value={settings.threadsUserId}
                    onChange={(e) => setSettings({...settings, threadsUserId: e.target.value})}
                    placeholder="Bot運用アカウントのUser ID"
                  />
                </div>
                <div>
                  <Label htmlFor="username">Bot Username</Label>
                  <Input
                    id="username"
                    value={settings.threadsUsername}
                    onChange={(e) => setSettings({...settings, threadsUsername: e.target.value})}
                    placeholder="@username"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={() => handleSave('API')}>
                  設定を保存
                </Button>
                <Button variant="outline" onClick={handleTestConnection}>
                  接続テスト
                </Button>
                <Button variant="secondary" onClick={handleAuthorize}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Threads認証
                </Button>
              </div>
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
              </CardTitle>
              <CardDescription>
                AI エンジンの設定とペルソナの管理
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.enableGeminiAutoReply}
                  onCheckedChange={(checked) => setSettings({...settings, enableGeminiAutoReply: checked})}
                />
                <Label>AI自動返信を有効にする</Label>
              </div>

              <div>
                <Label htmlFor="aiEngine">AIエンジン</Label>
                <Select value={settings.aiEngine} onValueChange={(value) => setSettings({...settings, aiEngine: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="off">無効</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {settings.aiEngine === 'gemini' && (
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium">Gemini設定</h4>
                  <div>
                    <Label htmlFor="geminiKey">Gemini API Key</Label>
                    <Input
                      id="geminiKey"
                      type="password"
                      value={settings.geminiApiKey}
                      onChange={(e) => setSettings({...settings, geminiApiKey: e.target.value})}
                      placeholder="AIzaSy..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="geminiModel">モデルID</Label>
                    <Select value={settings.geminiModelId} onValueChange={(value) => setSettings({...settings, geminiModelId: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini-1.5-pro-002">gemini-1.5-pro-002</SelectItem>
                        <SelectItem value="gemini-1.5-flash-002">gemini-1.5-flash-002</SelectItem>
                        <SelectItem value="gemini-pro">gemini-pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {settings.aiEngine === 'openai' && (
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium">OpenAI設定</h4>
                  <div>
                    <Label htmlFor="openaiKey">OpenAI API Key</Label>
                    <Input
                      id="openaiKey"
                      type="password"
                      value={settings.openaiApiKey}
                      onChange={(e) => setSettings({...settings, openaiApiKey: e.target.value})}
                      placeholder="sk-..."
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="defaultPersona">デフォルトペルソナ</Label>
                <Input
                  id="defaultPersona"
                  value={settings.defaultPersonaName}
                  onChange={(e) => setSettings({...settings, defaultPersonaName: e.target.value})}
                  placeholder="luna"
                />
              </div>

              <Button onClick={() => handleSave('AI')}>
                AI設定を保存
              </Button>
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
              </CardTitle>
              <CardDescription>
                リアルタイム通知の受信設定
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  value={settings.webhookUrl}
                  onChange={(e) => setSettings({...settings, webhookUrl: e.target.value})}
                  placeholder="https://script.google.com/macros/s/.../exec"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  GASのWebアプリ公開URLを設定してください
                </p>
              </div>

              <div>
                <Label htmlFor="verifyToken">Verify Token</Label>
                <Input
                  id="verifyToken"
                  value={settings.webhookVerifyToken}
                  onChange={(e) => setSettings({...settings, webhookVerifyToken: e.target.value})}
                  placeholder="ランダムな文字列"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Webhook受信時の検証に使用される秘密のトークン
                </p>
              </div>

              <Button onClick={() => handleSave('Webhook')}>
                Webhook設定を保存
              </Button>
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
                {getStatusBadge(settings.systemStatus)}
              </CardTitle>
              <CardDescription>
                システム動作の詳細設定
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pollingInterval" className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>ポーリング間隔（分）</span>
                  </Label>
                  <Input
                    id="pollingInterval"
                    type="number"
                    min="1"
                    max="60"
                    value={settings.pollingInterval}
                    onChange={(e) => setSettings({...settings, pollingInterval: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="maxLogRows">最大ログ行数</Label>
                  <Input
                    id="maxLogRows"
                    type="number"
                    value={settings.maxLogRows}
                    onChange={(e) => setSettings({...settings, maxLogRows: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notificationEmail" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>エラー通知メール</span>
                </Label>
                <Input
                  id="notificationEmail"
                  type="email"
                  value={settings.errorNotificationEmail}
                  onChange={(e) => setSettings({...settings, errorNotificationEmail: e.target.value})}
                  placeholder="admin@example.com"
                />
              </div>

              <Button onClick={() => handleSave('システム')}>
                システム設定を保存
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}