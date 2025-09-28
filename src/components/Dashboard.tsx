import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  MessageSquare,
  Users,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  BarChart3
} from 'lucide-react';

export function Dashboard() {
  // Mock data - in real implementation, this would come from your GAS backend
  const stats = {
    totalReplies: 145,
    activeRules: 8,
    personas: 3,
    successRate: 94.5,
    lastHour: 12,
    todayReplies: 45,
  };

  const recentActivity = [
    {
      id: 1,
      type: 'REPLY',
      message: 'AI返信を送信しました',
      user: '@user123',
      time: '2分前',
      status: 'success'
    },
    {
      id: 2,
      type: 'MATCH',
      message: 'キーワードルールにマッチしました',
      rule: '基本QA',
      time: '5分前',
      status: 'info'
    },
    {
      id: 3,
      type: 'ERROR',
      message: 'API制限に達しました',
      time: '15分前',
      status: 'error'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return CheckCircle;
      case 'error':
        return AlertTriangle;
      default:
        return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-success';
      case 'error':
        return 'text-destructive';
      default:
        return 'text-info';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ダッシュボード</h1>
        <p className="text-muted-foreground">
          Threads自動返信システムの概要と統計情報
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総返信数</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReplies}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.todayReplies} 今日
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">アクティブルール</CardTitle>
            <Zap className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeRules}</div>
            <p className="text-xs text-muted-foreground">
              自動返信ルール
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ペルソナ数</CardTitle>
            <Users className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.personas}</div>
            <p className="text-xs text-muted-foreground">
              AI応答パターン
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">成功率</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <Progress value={stats.successRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>最近のアクティビティ</span>
            </CardTitle>
            <CardDescription>
              システムの最新実行ログ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const StatusIcon = getStatusIcon(activity.status);
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <StatusIcon className={`h-4 w-4 mt-0.5 ${getStatusColor(activity.status)}`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        {activity.user && <span>{activity.user}</span>}
                        {activity.rule && <Badge variant="outline" className="text-xs">{activity.rule}</Badge>}
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>クイックアクション</CardTitle>
            <CardDescription>
              よく使用される操作
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              新しい自動返信ルールを作成
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              ペルソナを追加
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              システム設定を変更
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              詳細なログを表示
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}