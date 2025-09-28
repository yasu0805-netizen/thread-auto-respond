import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Webhook, 
  Shield, 
  Key, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  ExternalLink,
  Copy,
  Globe,
  Zap,
  Settings
} from 'lucide-react';

export function ThreadsIntegration() {
  const { toast } = useToast();
  
  const [connectionStatus, setConnectionStatus] = useState({
    api: 'UNAUTHORIZED', // 'AUTHORIZED' | 'UNAUTHORIZED' | 'ERROR'
    webhook: 'NOT_CONFIGURED', // 'CONFIGURED' | 'NOT_CONFIGURED' | 'ERROR'
    permissions: [] as string[]
  });

  const [webhookSettings, setWebhookSettings] = useState({
    url: '',
    verifyToken: '',
    isConfigured: false
  });

  const [testResults, setTestResults] = useState({
    lastTest: '',
    apiConnectivity: '',
    webhookDelivery: '',
    permissions: ''
  });

  // GAS WebアプリのURL（実際の実装では環境変数から取得）
  const gasWebappUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

  const handleApiTest = async () => {
    try {
      // 実際の実装では GAS バックエンドに接続テストを依頼
      const response = await fetch(`${gasWebappUrl}?action=testThreadsApi`);
      const result = await response.json();
      
      setTestResults(prev => ({
        ...prev,
        lastTest: new Date().toLocaleString('ja-JP'),
        apiConnectivity: result.success ? 'OK' : 'ERROR'
      }));

      toast({
        title: result.success ? "API接続テスト成功" : "API接続テスト失敗",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "接続テストエラー",
        description: "GASバックエンドとの通信に失敗しました",
        variant: "destructive"
      });
    }
  };

  const handleWebhookTest = async () => {
    try {
      // Webhook配信テスト
      const response = await fetch(`${gasWebappUrl}?action=testWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      });
      
      const result = await response.json();
      
      setTestResults(prev => ({
        ...prev,
        webhookDelivery: result.success ? 'OK' : 'ERROR'
      }));

      toast({
        title: result.success ? "Webhook配信テスト成功" : "Webhook配信テスト失敗",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Webhookテストエラー",
        description: "配信テストに失敗しました",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "クリップボードにコピーしました",
      description: "URLがコピーされました"
    });
  };

  const generateVerifyToken = () => {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setWebhookSettings(prev => ({ ...prev, verifyToken: token }));
  };

  const startOAuthFlow = () => {
    // 実際の実装では GAS から OAuth URL を取得
    const authUrl = `${gasWebappUrl}?action=getAuthUrl`;
    window.open(authUrl, '_blank', 'width=600,height=600');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AUTHORIZED':
      case 'CONFIGURED':
      case 'OK':
        return <Badge className="bg-success text-success-foreground">
          <CheckCircle className="w-3 h-3 mr-1" />
          正常
        </Badge>;
      case 'UNAUTHORIZED':
      case 'NOT_CONFIGURED':
      case 'ERROR':
        return <Badge variant="destructive">
          <AlertTriangle className="w-3 h-3 mr-1" />
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
        <h1 className="text-3xl font-bold tracking-tight">Threads API 連携</h1>
        <p className="text-muted-foreground">
          Threads APIとの接続設定と認証管理
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span>API認証</span>
              </div>
              {getStatusBadge(connectionStatus.api)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Threads APIへのアクセス権限
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Webhook className="h-4 w-4" />
                <span>Webhook</span>
              </div>
              {getStatusBadge(connectionStatus.webhook)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              リアルタイム通知の受信設定
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>権限</span>
              </div>
              <Badge variant="outline">{connectionStatus.permissions.length}件</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              取得済みAPI権限スコープ
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="oauth" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="oauth">OAuth認証</TabsTrigger>
          <TabsTrigger value="webhook">Webhook設定</TabsTrigger>
          <TabsTrigger value="test">接続テスト</TabsTrigger>
        </TabsList>

        {/* OAuth Authentication */}
        <TabsContent value="oauth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>OAuth認証設定</span>
              </CardTitle>
              <CardDescription>
                Threads APIへの認証とアクセス権限の取得
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  認証には有効なThreads開発者アカウントと、Threads API Client IDが必要です。
                  Facebook for Developersでアプリケーションを作成してください。
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input
                    id="clientId"
                    placeholder="Threads API Client ID"
                    disabled
                    value="システム設定で設定済み"
                  />
                </div>
                <div>
                  <Label htmlFor="redirectUri">リダイレクトURI</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="redirectUri"
                      value={gasWebappUrl}
                      readOnly
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(gasWebappUrl)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    このURLをThreads APIの設定に登録してください
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">必要な権限スコープ</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">threads_basic</Badge>
                  <Badge variant="outline">threads_content_publish</Badge>
                  <Badge variant="outline">threads_manage_insights</Badge>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={startOAuthFlow} className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4" />
                  <span>Threads認証を開始</span>
                </Button>
                <Button variant="outline" onClick={handleApiTest}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  接続確認
                </Button>
              </div>

              {connectionStatus.permissions.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">取得済み権限</h4>
                  <div className="space-y-2">
                    {connectionStatus.permissions.map((permission, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm">{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhook Configuration */}
        <TabsContent value="webhook" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Webhook className="h-5 w-5" />
                <span>Webhook設定</span>
              </CardTitle>
              <CardDescription>
                リアルタイム通知の受信とセキュリティ設定
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="webhookUrl"
                    value={gasWebappUrl}
                    readOnly
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(gasWebappUrl)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  この URL を Threads API の Webhook 設定に登録してください
                </p>
              </div>

              <div>
                <Label htmlFor="verifyToken">Verify Token</Label>
                <div className="flex space-x-2">
                  <Input
                    id="verifyToken"
                    value={webhookSettings.verifyToken}
                    onChange={(e) => setWebhookSettings(prev => ({ ...prev, verifyToken: e.target.value }))}
                    placeholder="Webhook検証用トークン"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={generateVerifyToken}
                  >
                    <Zap className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Webhook受信時の検証に使用される秘密のトークン
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">購読イベント</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">メンション（@username）</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">投稿へのリプライ</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">DM（ダイレクトメッセージ）</span>
                  </div>
                </div>
              </div>

              <Button onClick={handleWebhookTest}>
                配信テストを実行
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Connection Testing */}
        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>接続テスト</span>
              </CardTitle>
              <CardDescription>
                Threads APIとの接続状況を診断
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-3">API接続テスト</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API疎通確認</span>
                      {testResults.apiConnectivity ? (
                        <Badge variant={testResults.apiConnectivity === 'OK' ? 'default' : 'destructive'}>
                          {testResults.apiConnectivity}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">未実行</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">認証状態</span>
                      {getStatusBadge(connectionStatus.api)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">権限確認</span>
                      <Badge variant="outline">{connectionStatus.permissions.length}件</Badge>
                    </div>
                  </div>
                  <Button onClick={handleApiTest} className="mt-3 w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    API接続テスト
                  </Button>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Webhook配信テスト</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">配信確認</span>
                      {testResults.webhookDelivery ? (
                        <Badge variant={testResults.webhookDelivery === 'OK' ? 'default' : 'destructive'}>
                          {testResults.webhookDelivery}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">未実行</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">設定状態</span>
                      {getStatusBadge(connectionStatus.webhook)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">検証トークン</span>
                      <Badge variant={webhookSettings.verifyToken ? 'default' : 'secondary'}>
                        {webhookSettings.verifyToken ? '設定済み' : '未設定'}
                      </Badge>
                    </div>
                  </div>
                  <Button onClick={handleWebhookTest} className="mt-3 w-full">
                    <Webhook className="h-4 w-4 mr-2" />
                    Webhook配信テスト
                  </Button>
                </div>
              </div>

              {testResults.lastTest && (
                <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">最終テスト実行:</span> {testResults.lastTest}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}