import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
  Webhook,
  Database,
  Brain,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Server,
  Wifi,
  Shield
} from 'lucide-react';

interface SystemStatus {
  overall: 'OK' | 'DEGRADED' | 'ERROR';
  components: {
    threadsApi: 'OK' | 'ERROR' | 'UNAUTHORIZED';
    webhook: 'OK' | 'ERROR';
    polling: 'OK' | 'DELAYED' | 'ERROR';
    aiEngine: 'OK' | 'ERROR' | 'DISABLED';
    database: 'OK' | 'ERROR';
  };
  metrics: {
    uptime: number;
    lastUpdate: string;
    totalReplies: number;
    successRate: number;
    avgResponseTime: number;
  };
}

export function StatusMonitoring() {
  const [status, setStatus] = useState<SystemStatus>({
    overall: 'OK',
    components: {
      threadsApi: 'OK',
      webhook: 'OK',
      polling: 'OK',
      aiEngine: 'OK',
      database: 'OK'
    },
    metrics: {
      uptime: 99.2,
      lastUpdate: new Date().toISOString(),
      totalReplies: 1247,
      successRate: 94.8,
      avgResponseTime: 1.8
    }
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Mock status updates
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          lastUpdate: new Date().toISOString(),
          totalReplies: prev.metrics.totalReplies + Math.floor(Math.random() * 3),
          avgResponseTime: 1.5 + Math.random() * 1
        }
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const refreshStatus = async () => {
    setIsRefreshing(true);
    // In real implementation, this would call your GAS backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OK':
        return CheckCircle;
      case 'DEGRADED':
      case 'DELAYED':
        return AlertTriangle;
      case 'ERROR':
      case 'UNAUTHORIZED':
        return AlertCircle;
      default:
        return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK':
        return 'text-success';
      case 'DEGRADED':
      case 'DELAYED':
        return 'text-warning';
      case 'ERROR':
      case 'UNAUTHORIZED':
        return 'text-destructive';
      case 'DISABLED':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OK':
        return <Badge variant="default" className="bg-success text-success-foreground">正常</Badge>;
      case 'DEGRADED':
        return <Badge variant="warning">低下</Badge>;
      case 'DELAYED':
        return <Badge variant="warning">遅延</Badge>;
      case 'ERROR':
        return <Badge variant="destructive">エラー</Badge>;
      case 'UNAUTHORIZED':
        return <Badge variant="destructive">未認証</Badge>;
      case 'DISABLED':
        return <Badge variant="secondary">無効</Badge>;
      default:
        return <Badge variant="secondary">不明</Badge>;
    }
  };

  const componentStatuses = [
    {
      name: 'Threads API',
      key: 'threadsApi',
      icon: Wifi,
      description: 'Threads APIとの接続状態'
    },
    {
      name: 'Webhook',
      key: 'webhook',
      icon: Webhook,
      description: 'リアルタイム通知の受信'
    },
    {
      name: 'ポーリング',
      key: 'polling',
      icon: Clock,
      description: '定期的なメンション確認'
    },
    {
      name: 'AIエンジン',
      key: 'aiEngine',
      icon: Brain,
      description: 'AI自動返信機能'
    },
    {
      name: 'データベース',
      key: 'database',
      icon: Database,
      description: 'Google スプレッドシート'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">システムステータス</h1>
          <p className="text-muted-foreground">
            Threads Auto-Replyシステムの稼働状況とパフォーマンス
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={refreshStatus}
          disabled={isRefreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          更新
        </Button>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>総合ステータス</span>
            </div>
            {getStatusBadge(status.overall)}
          </CardTitle>
          <CardDescription>
            最終更新: {new Date(status.metrics.lastUpdate).toLocaleString('ja-JP')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{status.metrics.uptime}%</div>
              <div className="text-sm text-muted-foreground">稼働率</div>
              <Progress value={status.metrics.uptime} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{status.metrics.totalReplies}</div>
              <div className="text-sm text-muted-foreground">総返信数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{status.metrics.successRate}%</div>
              <div className="text-sm text-muted-foreground">成功率</div>
              <Progress value={status.metrics.successRate} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-info">{status.metrics.avgResponseTime.toFixed(1)}s</div>
              <div className="text-sm text-muted-foreground">平均応答時間</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {componentStatuses.map((component) => {
          const ComponentIcon = component.icon;
          const componentStatus = status.components[component.key as keyof typeof status.components];
          const StatusIcon = getStatusIcon(componentStatus);
          const statusColor = getStatusColor(componentStatus);

          return (
            <Card key={component.key}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center space-x-2">
                    <ComponentIcon className="h-4 w-4 text-primary" />
                    <span>{component.name}</span>
                  </div>
                  <StatusIcon className={`h-4 w-4 ${statusColor}`} />
                </CardTitle>
                <CardDescription className="text-sm">
                  {component.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {getStatusBadge(componentStatus)}
                  <div className="text-xs text-muted-foreground">
                    {new Date().toLocaleTimeString('ja-JP')}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>パフォーマンス指標</span>
            </CardTitle>
            <CardDescription>
              過去24時間の主要指標
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API応答時間</span>
                <span className="text-sm text-muted-foreground">1.2s 平均</span>
              </div>
              <Progress value={75} />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">メモリ使用量</span>
                <span className="text-sm text-muted-foreground">45%</span>
              </div>
              <Progress value={45} />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">実行成功率</span>
                <span className="text-sm text-muted-foreground">94.8%</span>
              </div>
              <Progress value={94.8} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>最近のアクティビティ</span>
            </CardTitle>
            <CardDescription>
              システムの最新動作状況
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 mt-0.5 text-success" />
                <div className="flex-1">
                  <p className="text-sm font-medium">ポーリング正常実行</p>
                  <p className="text-xs text-muted-foreground">2分前 - 新着メンション3件を処理</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 mt-0.5 text-success" />
                <div className="flex-1">
                  <p className="text-sm font-medium">AI返信送信完了</p>
                  <p className="text-xs text-muted-foreground">5分前 - Gemini APIで生成・送信</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Webhook className="h-4 w-4 mt-0.5 text-info" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Webhook受信</p>
                  <p className="text-xs text-muted-foreground">8分前 - メンション通知を受信</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-4 w-4 mt-0.5 text-warning" />
                <div className="flex-1">
                  <p className="text-sm font-medium">APIレート制限警告</p>
                  <p className="text-xs text-muted-foreground">15分前 - 制限の80%に到達</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Checks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>ヘルスチェック</span>
          </CardTitle>
          <CardDescription>
            システム各機能の動作確認結果
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-3">接続テスト</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Threads API</span>
                  <Badge variant="default" className="bg-success text-success-foreground">OK</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Gemini API</span>
                  <Badge variant="default" className="bg-success text-success-foreground">OK</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Google スプレッドシート</span>
                  <Badge variant="default" className="bg-success text-success-foreground">OK</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">機能テスト</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>自動返信ルール</span>
                  <Badge variant="default" className="bg-success text-success-foreground">OK</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>AI生成機能</span>
                  <Badge variant="default" className="bg-success text-success-foreground">OK</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>ログ出力</span>
                  <Badge variant="default" className="bg-success text-success-foreground">OK</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}