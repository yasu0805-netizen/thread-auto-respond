import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, RefreshCw, Shield, CheckCircle, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  // Mock status - in real implementation, this would come from your GAS backend
  const systemStatus = 'OK'; // 'OK' | 'DEGRADED' | 'ERROR'
  const authStatus = 'AUTHORIZED'; // 'AUTHORIZED' | 'UNAUTHORIZED'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK':
      case 'AUTHORIZED':
        return 'success';
      case 'DEGRADED':
        return 'warning';
      case 'ERROR':
      case 'UNAUTHORIZED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

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
        return Shield;
    }
  };

  const SystemIcon = getStatusIcon(systemStatus);
  const AuthIcon = getStatusIcon(authStatus);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Badge variant={getStatusColor(systemStatus) as any} className="flex items-center space-x-1">
              <SystemIcon className="h-3 w-3" />
              <span>システム: {systemStatus}</span>
            </Badge>
            <Badge variant={getStatusColor(authStatus) as any} className="flex items-center space-x-1">
              <AuthIcon className="h-3 w-3" />
              <span>認証: {authStatus}</span>
            </Badge>
          </div>

          <Button variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}