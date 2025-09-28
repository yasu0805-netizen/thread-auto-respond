import { useState } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Settings,
  MessageSquare,
  FileText,
  Users,
  Activity,
  Zap,
  CheckCircle,
  AlertTriangle,
  Bot,
  Database
} from 'lucide-react';

const navigationItems = [
  {
    title: 'ダッシュボード',
    url: '/',
    icon: LayoutDashboard,
    description: 'システム概要と統計'
  },
  {
    title: '自動返信ルール',
    url: '/rules',
    icon: MessageSquare,
    description: 'キーワードベースルール管理'
  },
  {
    title: 'ペルソナ管理',
    url: '/personas',
    icon: Users,
    description: 'AI文体とキャラクター設定'
  },
  {
    title: 'API連携',
    url: '/integration',
    icon: Zap,
    description: 'Threads API接続設定'
  },
  {
    title: 'データ管理',
    url: '/data',
    icon: Database,
    description: 'スプレッドシート連携'
  },
  {
    title: 'システム設定',
    url: '/settings',
    icon: Settings,
    description: 'API・AI・Webhook設定'
  },
  {
    title: '実行ログ',
    url: '/logs',
    icon: FileText,
    description: '動作履歴とデバッグ情報'
  },
  {
    title: 'システムステータス',
    url: '/status',
    icon: Activity,
    description: '稼働状況とパフォーマンス'
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  // Mock system status - 実際の実装では GAS バックエンドから取得
  const [systemStatus] = useState({
    overall: 'OK', // 'OK' | 'DEGRADED' | 'ERROR'
    authStatus: 'AUTHORIZED', // 'AUTHORIZED' | 'UNAUTHORIZED'
    activeRules: 8,
    totalReplies: 1247
  });

  const isActive = (path: string) => currentPath === path;
  const isExpanded = navigationItems.some((item) => isActive(item.url));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OK':
      case 'AUTHORIZED':
        return CheckCircle;
      case 'DEGRADED':
      case 'ERROR':
      case 'UNAUTHORIZED':
        return AlertTriangle;
      default:
        return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK':
      case 'AUTHORIZED':
        return 'text-success';
      case 'DEGRADED':
        return 'text-warning';
      case 'ERROR':
      case 'UNAUTHORIZED':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const SystemStatusIcon = getStatusIcon(systemStatus.overall);
  const AuthStatusIcon = getStatusIcon(systemStatus.authStatus);

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-72'}>
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bot className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Threads Auto-Reply</h1>
              <p className="text-xs text-muted-foreground">管理ダッシュボード</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Status Overview */}
        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>システム状況</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2 px-2">
                <div className="flex items-center justify-between text-sm">
                  <span>システム</span>
                  <div className="flex items-center space-x-1">
                    <SystemStatusIcon className={`h-3 w-3 ${getStatusColor(systemStatus.overall)}`} />
                    <span className="text-xs">{systemStatus.overall}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>認証</span>
                  <div className="flex items-center space-x-1">
                    <AuthStatusIcon className={`h-3 w-3 ${getStatusColor(systemStatus.authStatus)}`} />
                    <span className="text-xs">{systemStatus.authStatus}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>アクティブルール</span>
                  <Badge variant="outline" className="text-xs">{systemStatus.activeRules}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>総返信数</span>
                  <Badge variant="outline" className="text-xs">{systemStatus.totalReplies}</Badge>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>メニュー</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-muted/50'
                      }
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && (
                        <div className="flex-1">
                          <span>{item.title}</span>
                          {item.description && (
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          )}
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>クイックアクション</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/rules" className="hover:bg-muted/50">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>新しいルール作成</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/personas" className="hover:bg-muted/50">
                      <Users className="mr-2 h-4 w-4" />
                      <span>ペルソナ追加</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/logs" className="hover:bg-muted/50">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>ログ確認</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        {!collapsed && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Google スプレッドシート</span>
            </div>
            <div className="text-xs text-muted-foreground">
              <div>タイムゾーン: Europe/Berlin</div>
              <div className="mt-1">バージョン: v1.0.0</div>
              <div className="mt-1">最終更新: {new Date().toLocaleTimeString('ja-JP')}</div>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}