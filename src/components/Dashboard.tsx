import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { useDataManager } from '@/hooks/useDataManager';
import { useState } from 'react';

export const Dashboard = () => {
  const { personas, rules, logs, loading } = useRealtimeData();
  const { testThreadsConnection } = useDataManager();
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const [testing, setTesting] = useState(false);

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const result = await testThreadsConnection();
      setConnectionStatus(result.status === 'connected' ? 'connected' : 'disconnected');
    } catch (error) {
      setConnectionStatus('disconnected');
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disconnected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const recentLogs = logs.slice(0, 5);
  const activePersonas = personas.filter(p => p.active);
  const activeRules = rules.filter(r => r.rule_value === 'enabled');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Activity className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ダッシュボード</h1>
          <p className="text-muted-foreground">
            Threads自動返信システムの状況
          </p>
        </div>
        <Button 
          onClick={handleTestConnection}
          disabled={testing}
          variant="outline"
        >
          {testing && <Activity className="mr-2 h-4 w-4 animate-spin" />}
          接続テスト
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threads API接続</CardTitle>
            {getStatusIcon(connectionStatus)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {connectionStatus === 'connected' ? '接続中' : 
               connectionStatus === 'disconnected' ? '未接続' : '不明'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">アクティブなペルソナ</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePersonas.length}</div>
            <p className="text-xs text-muted-foreground">
              合計 {personas.length} ペルソナ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">有効なルール</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRules.length}</div>
            <p className="text-xs text-muted-foreground">
              合計 {rules.length} ルール
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日のログ</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.filter(log => {
                const today = new Date().toDateString();
                const logDate = new Date(log.created_at).toDateString();
                return today === logDate;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              合計 {logs.length} ログ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>最新のアクティビティ</CardTitle>
            <CardDescription>
              システムの最新の動作状況
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLogs.length > 0 ? (
                recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={log.status === 'success' ? 'default' : log.status === 'error' ? 'destructive' : 'secondary'}>
                          {log.status}
                        </Badge>
                        <span className="text-sm">
                          {log.metadata?.action || 'アクション'}
                        </span>
                      </div>
                      {log.text && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {log.text}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleTimeString('ja-JP')}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  まだアクティビティがありません
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>クイックアクション</CardTitle>
            <CardDescription>
              よく使う機能へのショートカット
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.href = '/personas'}
              >
                新しいペルソナを作成
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.href = '/rules'}
              >
                自動返信ルールを設定
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.href = '/integration'}
              >
                Threads連携を設定
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.href = '/logs'}
              >
                ログを確認
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};