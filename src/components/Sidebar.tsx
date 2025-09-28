import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  MessageSquare,
  FileText,
  Users,
  X,
  Activity,
  Zap
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navigation = [
  { name: 'ダッシュボード', href: '/', icon: LayoutDashboard },
  { name: '自動返信設定', href: '/rules', icon: MessageSquare },
  { name: 'システム設定', href: '/settings', icon: Settings },
  { name: 'ペルソナ管理', href: '/personas', icon: Users },
  { name: '実行ログ', href: '/logs', icon: FileText },
  { name: 'ステータス', href: '/status', icon: Activity },
];

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-border px-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-primary" />
              <h1 className="text-lg font-semibold text-foreground">
                Threads Auto-Reply
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    isActive && 'bg-primary/10 text-primary hover:bg-primary/15'
                  )}
                  onClick={() => {
                    navigate(item.href);
                    onOpenChange(false);
                  }}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <div className="text-xs text-muted-foreground">
              <div>Europe/Berlin タイムゾーン</div>
              <div className="mt-1">v1.0.0</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}