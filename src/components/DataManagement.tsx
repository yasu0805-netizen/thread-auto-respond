import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  Database, 
  RefreshCw, 
  Download, 
  Upload, 
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  Info,
  Settings,
  Key,
  Clock,
  Shield
} from 'lucide-react';

interface SpreadsheetConnection {
  id: string;
  url: string;
  lastSync: string;
  status: 'CONNECTED' | 'ERROR' | 'SYNCING';
  sheets: string[];
}

interface SettingsData {
  key: string;
  value: string;
  category: string;
  description: string;
}

export function DataManagement() {
  const { toast } = useToast();
  
  const [connection, setConnection] = useState<SpreadsheetConnection>({
    id: 'main-spreadsheet',
    url: '',
    lastSync: '',
    status: 'ERROR',
    sheets: ['Settings', 'Reservation Input', 'Execution Log', 'Personas']
  });

  const [gasWebAppUrl, setGasWebAppUrl] = useState('');

  const [settingsData, setSettingsData] = useState<SettingsData[]>([
    // API設定
    { key: 'THREADS_CLIENT_ID', value: '***', category: 'API設定', description: 'Threads API認証用' },
    { key: 'THREADS_CLIENT_SECRET', value: '***', category: 'API設定', description: 'Threads API認証用' },
    { key: 'AUTH_STATUS', value: 'AUTHORIZED', category: 'API設定', description: '認可状態' },
    { key: 'LAST_AUTH_CHECK', value: '2025-09-28T10:30:00+02:00', category: 'API設定', description: '最終認可チェック日時' },
    { key: 'THREADS_USER_ID_OF_BOT', value: '12345678', category: 'API設定', description: 'BotアカウントのユーザーID' },
    { key: 'THREADS_BOT_USERNAME', value: '@autobot', category: 'API設定', description: 'Botの表示名' },
    
    // Webhook設定
    { key: 'WEBHOOK_URL', value: 'https://script.google.com/macros/s/.../exec', category: 'Webhook設定', description: 'GASのWebアプリURL' },
    { key: 'WEBHOOK_VERIFY_TOKEN', value: '***', category: 'Webhook設定', description: 'Webhook検証用トークン' },
    
    // AI自動返信設定
    { key: 'ENABLE_GEMINI_AUTO_REPLY', value: 'TRUE', category: 'AI自動返信設定', description: 'Gemini自動返信有効化' },
    { key: 'OPENAI_API_KEY', value: '***', category: 'AI自動返信設定', description: 'OpenAIキー' },
    { key: 'AI_ENGINE', value: 'gemini', category: 'AI自動返信設定', description: 'AIエンジン選択' },
    { key: 'DEFAULT_PERSONA_NAME', value: 'luna', category: 'AI自動返信設定', description: '既定のペルソナ名' },
    { key: 'GEMINI_API_KEY', value: '***', category: 'AI自動返信設定', description: 'Gemini利用キー' },
    { key: 'GEMINI_MODEL_ID', value: 'gemini-1.5-pro-002', category: 'AI自動返信設定', description: 'Geminiモデル指定' },
    
    // システム設定
    { key: 'POLLING_INTERVAL', value: '5', category: 'システム設定', description: 'ポーリング間隔（分）' },
    { key: 'ERROR_NOTIFICATION_EMAIL', value: 'admin@example.com', category: 'システム設定', description: 'エラー通知先' },
    { key: 'GOOGLE_DRIVE_FOLDER_ID', value: '1A2B3C...', category: 'システム設定', description: '保存先フォルダID' },
    { key: 'MAX_LOG_ROWS', value: '10000', category: 'システム設定', description: 'ログ最大行数' },
    
    // ステータス情報
    { key: 'LAST_POLLING_CHECK', value: '2025-09-28T10:32:00+02:00', category: 'ステータス情報', description: '最終ポーリング実行' },
    { key: 'LAST_SCHEDULER_RUN', value: '2025-09-28T10:30:00+02:00', category: 'ステータス情報', description: '最終スケジューラー実行' },
    { key: 'SYSTEM_STATUS', value: 'OK', category: 'ステータス情報', description: 'システム状態' }
  ]);

  const [newSetting, setNewSetting] = useState({
    key: '',
    value: '',
    category: 'システム設定',
    description: ''
  });

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (!gasWebAppUrl) {
      toast({
        title: "設定エラー",
        description: "GAS WebApp URLを設定してください",
        variant: "destructive"
      });
      return;
    }

    setIsSyncing(true);
    setConnection(prev => ({ ...prev, status: 'SYNCING' }));
    
    try {
      // GAS WebApp API でデータ取得
      const response = await fetch(`${gasWebAppUrl}?action=getSettings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // スプレッドシートからのデータで更新
        if (data.settings) {
          setSettingsData(data.settings);
        }
        
        setConnection(prev => ({
          ...prev,
          lastSync: new Date().toISOString(),
          status: 'CONNECTED',
          url: data.spreadsheetUrl || prev.url
        }));
        
        toast({
          title: "同期完了",
          description: "Google スプレッドシートとの同期が完了しました"
        });
      } else {
        throw new Error(data.error || '同期処理でエラーが発生しました');
      }
    } catch (error: any) {
      setConnection(prev => ({ ...prev, status: 'ERROR' }));
      toast({
        title: "同期エラー",
        description: `スプレッドシートとの同期に失敗しました: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Key', 'Value', 'Category', 'Description'],
      ...settingsData.map(setting => [
        setting.key,
        setting.value.includes('***') ? '[MASKED]' : setting.value,
        setting.category,
        setting.description
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `settings_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleAddSetting = async () => {
    if (!newSetting.key || !newSetting.value) {
      toast({
        title: "入力エラー",
        description: "キーと値は必須項目です",
        variant: "destructive"
      });
      return;
    }

    if (!gasWebAppUrl) {
      toast({
        title: "設定エラー",
        description: "GAS WebApp URLを設定してください",
        variant: "destructive"
      });
      return;
    }

    try {
      // GAS WebApp API で設定保存
      const response = await fetch(gasWebAppUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'saveSetting',
          setting: newSetting
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const existingSetting = settingsData.find(s => s.key === newSetting.key);
        if (existingSetting) {
          // 更新
          setSettingsData(prev => prev.map(s => 
            s.key === newSetting.key ? { ...s, ...newSetting } : s
          ));
          toast({
            title: "設定を更新しました",
            description: `「${newSetting.key}」の値をスプレッドシートに保存しました`
          });
        } else {
          // 新規追加
          setSettingsData(prev => [...prev, newSetting]);
          toast({
            title: "設定を追加しました",
            description: `「${newSetting.key}」をスプレッドシートに保存しました`
          });
        }

        setNewSetting({ key: '', value: '', category: 'システム設定', description: '' });
      } else {
        throw new Error(data.error || '設定の保存に失敗しました');
      }
    } catch (error: any) {
      toast({
        title: "保存エラー",
        description: `設定の保存に失敗しました: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'ERROR':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'SYNCING':
        return <RefreshCw className="h-4 w-4 text-primary animate-spin" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return <Badge className="bg-success text-success-foreground">接続済み</Badge>;
      case 'ERROR':
        return <Badge variant="destructive">エラー</Badge>;
      case 'SYNCING':
        return <Badge variant="secondary">同期中</Badge>;
      default:
        return <Badge variant="secondary">不明</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'API設定':
        return <Key className="h-4 w-4" />;
      case 'Webhook設定':
        return <Database className="h-4 w-4" />;
      case 'AI自動返信設定':
        return <Settings className="h-4 w-4" />;
      case 'システム設定':
        return <Settings className="h-4 w-4" />;
      case 'ステータス情報':
        return <Clock className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const groupedSettings = settingsData.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, SettingsData[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">データ管理</h1>
          <p className="text-muted-foreground">
            Google スプレッドシートとの連携とデータ同期
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            エクスポート
          </Button>
          <Button onClick={handleSync} disabled={isSyncing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? '同期中...' : '同期'}
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="h-5 w-5" />
              <span>スプレッドシート接続</span>
            </div>
            {getStatusBadge(connection.status)}
          </CardTitle>
          <CardDescription>
            Google スプレッドシートとの接続状況
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>GAS WebApp URL</Label>
              <Input 
                value={gasWebAppUrl} 
                onChange={(e) => setGasWebAppUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
              />
            </div>
            
            <div>
              <Label>スプレッドシートURL</Label>
              <Input 
                value={connection.url} 
                readOnly 
                placeholder="同期後に自動設定されます"
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>最終同期</Label>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusIcon(connection.status)}
                  <span className="text-sm text-muted-foreground">
                    {new Date(connection.lastSync).toLocaleString('ja-JP')}
                  </span>
                </div>
              </div>
              <div>
                <Label>管理シート</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {connection.sheets.map(sheet => (
                    <Badge key={sheet} variant="outline">{sheet}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {connection.status === 'ERROR' && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Google スプレッドシートとの接続に問題があります。GAS WebApp URLを正しく設定し、GASのデプロイ状況とアクセス権限を確認してください。
                </AlertDescription>
              </Alert>
            )}

            {!gasWebAppUrl && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  GAS WebApp URLを設定すると、Google スプレッドシートとの双方向同期が有効になります。
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">設定管理</TabsTrigger>
          <TabsTrigger value="add">設定追加</TabsTrigger>
        </TabsList>

        {/* Settings Management */}
        <TabsContent value="settings" className="space-y-4">
          {Object.entries(groupedSettings).map(([category, settings]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getCategoryIcon(category)}
                  <span>{category}</span>
                  <Badge variant="outline">{settings.length}件</Badge>
                </CardTitle>
                <CardDescription>
                  {category}に関連する設定項目
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>キー</TableHead>
                      <TableHead>値</TableHead>
                      <TableHead>説明</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {settings.map((setting) => (
                      <TableRow key={setting.key}>
                        <TableCell className="font-medium">{setting.key}</TableCell>
                        <TableCell>
                          {setting.value.includes('***') ? (
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">秘匿情報</span>
                            </div>
                          ) : (
                            <span className="text-sm">{setting.value}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {setting.description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Add Settings */}
        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>新しい設定項目を追加</CardTitle>
              <CardDescription>
                システム設定に新しいキー・値ペアを追加します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="settingKey">キー</Label>
                  <Input
                    id="settingKey"
                    value={newSetting.key}
                    onChange={(e) => setNewSetting(prev => ({ ...prev, key: e.target.value }))}
                    placeholder="SETTING_NAME"
                  />
                </div>
                <div>
                  <Label htmlFor="settingCategory">カテゴリ</Label>
                  <select
                    id="settingCategory"
                    value={newSetting.category}
                    onChange={(e) => setNewSetting(prev => ({ ...prev, category: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="API設定">API設定</option>
                    <option value="Webhook設定">Webhook設定</option>
                    <option value="AI自動返信設定">AI自動返信設定</option>
                    <option value="システム設定">システム設定</option>
                    <option value="ステータス情報">ステータス情報</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="settingValue">値</Label>
                <Input
                  id="settingValue"
                  value={newSetting.value}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="設定値を入力"
                />
              </div>

              <div>
                <Label htmlFor="settingDescription">説明</Label>
                <Textarea
                  id="settingDescription"
                  value={newSetting.description}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="この設定項目の説明を入力"
                  rows={2}
                />
              </div>

              <Button onClick={handleAddSetting}>
                設定を追加
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}