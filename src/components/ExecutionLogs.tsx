import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  MessageSquare,
  Webhook,
  Clock,
  Zap,
  Bug
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'AUTH' | 'WEBHOOK' | 'POLLING' | 'MATCH' | 'AI' | 'REPLY' | 'ERROR' | 'SYSTEM';
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  message: string;
  detail: string;
}

const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: '2025-09-28T10:32:12+02:00',
    type: 'REPLY',
    level: 'INFO',
    message: 'AI返信を送信しました',
    detail: JSON.stringify({postId: 'thread_123', user: '@user456', source: 'gemini', personaUsed: 'luna'})
  },
  {
    id: '2',
    timestamp: '2025-09-28T10:30:45+02:00',
    type: 'MATCH',
    level: 'INFO',
    message: 'キーワードルールにマッチしました',
    detail: JSON.stringify({ruleId: 'rule_001', ruleName: '基本QA', keyword: '料金', user: '@user123'})
  },
  {
    id: '3',
    timestamp: '2025-09-28T10:28:33+02:00',
    type: 'AI',
    level: 'INFO',
    message: 'Gemini APIで返信を生成しました',
    detail: JSON.stringify({model: 'gemini-1.5-pro-002', tokens: 145, responseTime: '1.2s'})
  },
  {
    id: '4',
    timestamp: '2025-09-28T10:25:15+02:00',
    type: 'ERROR',
    level: 'ERROR',
    message: 'API制限に達しました',
    detail: JSON.stringify({error: 'Rate limit exceeded', retryAfter: 60, endpoint: '/v1/posts'})
  },
  {
    id: '5',
    timestamp: '2025-09-28T10:20:00+02:00',
    type: 'WEBHOOK',
    level: 'INFO',
    message: 'Webhookイベントを受信しました',
    detail: JSON.stringify({eventType: 'mention', postId: 'thread_789', verified: true})
  },
  {
    id: '6',
    timestamp: '2025-09-28T10:15:22+02:00',
    type: 'POLLING',
    level: 'INFO',
    message: 'ポーリングでメンションを確認しました',
    detail: JSON.stringify({newMentions: 3, processed: 2, skipped: 1})
  },
  {
    id: '7',
    timestamp: '2025-09-28T10:10:11+02:00',
    type: 'AUTH',
    level: 'INFO',
    message: 'アクセストークンを更新しました',
    detail: JSON.stringify({tokenExpiry: '2025-10-28T10:10:11+02:00', scope: 'threads_basic,threads_content_publish'})
  },
  {
    id: '8',
    timestamp: '2025-09-28T10:05:33+02:00',
    type: 'SYSTEM',
    level: 'WARN',
    message: 'ログ行数が上限に近づいています',
    detail: JSON.stringify({currentRows: 9800, maxRows: 10000, action: 'cleanup_scheduled'})
  }
];

export function ExecutionLogs() {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(mockLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 20;

  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.detail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(log => log.type === typeFilter);
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  }, [logs, searchTerm, typeFilter, levelFilter]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'REPLY': return MessageSquare;
      case 'WEBHOOK': return Webhook;
      case 'POLLING': return Clock;
      case 'AI': return Zap;
      case 'ERROR': return AlertTriangle;
      case 'AUTH': return CheckCircle;
      case 'SYSTEM': return Info;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'REPLY': return 'text-success';
      case 'WEBHOOK': return 'text-info';
      case 'POLLING': return 'text-primary';
      case 'AI': return 'text-accent';
      case 'ERROR': return 'text-destructive';
      case 'AUTH': return 'text-success';
      case 'SYSTEM': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'ERROR':
        return <Badge variant="destructive">ERROR</Badge>;
      case 'WARN':
        return <Badge variant="warning">WARN</Badge>;
      case 'INFO':
        return <Badge variant="default">INFO</Badge>;
      case 'DEBUG':
        return <Badge variant="secondary">DEBUG</Badge>;
      default:
        return <Badge variant="secondary">{level}</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDetail = (detail: string) => {
    try {
      const parsed = JSON.parse(detail);
      return Object.entries(parsed).map(([key, value]) => (
        <div key={key} className="text-xs">
          <span className="font-medium">{key}:</span> {String(value)}
        </div>
      ));
    } catch {
      return <div className="text-xs">{detail}</div>;
    }
  };

  const refreshLogs = () => {
    // In real implementation, this would fetch from GAS backend
    console.log('Refreshing logs...');
  };

  const exportLogs = () => {
    const csvContent = [
      ['タイムスタンプ', 'タイプ', 'レベル', 'メッセージ', '詳細'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.type,
        log.level,
        log.message,
        log.detail
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `execution_logs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * logsPerPage,
    currentPage * logsPerPage
  );

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">実行ログ</h1>
          <p className="text-muted-foreground">
            システムの実行履歴とデバッグ情報
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={refreshLogs}>
            <RefreshCw className="mr-2 h-4 w-4" />
            更新
          </Button>
          <Button variant="outline" onClick={exportLogs}>
            <Download className="mr-2 h-4 w-4" />
            CSV出力
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>フィルター</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="メッセージまたは詳細で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="タイプを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべてのタイプ</SelectItem>
                  <SelectItem value="REPLY">返信</SelectItem>
                  <SelectItem value="WEBHOOK">Webhook</SelectItem>
                  <SelectItem value="POLLING">ポーリング</SelectItem>
                  <SelectItem value="AI">AI</SelectItem>
                  <SelectItem value="MATCH">マッチ</SelectItem>
                  <SelectItem value="AUTH">認証</SelectItem>
                  <SelectItem value="ERROR">エラー</SelectItem>
                  <SelectItem value="SYSTEM">システム</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="レベルを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべてのレベル</SelectItem>
                  <SelectItem value="ERROR">ERROR</SelectItem>
                  <SelectItem value="WARN">WARN</SelectItem>
                  <SelectItem value="INFO">INFO</SelectItem>
                  <SelectItem value="DEBUG">DEBUG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>実行ログ一覧</span>
            </div>
            <Badge variant="outline">
              {filteredLogs.length} / {logs.length} 件
            </Badge>
          </CardTitle>
          <CardDescription>
            システムの動作ログとエラー情報
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">タイムスタンプ</TableHead>
                <TableHead className="w-[120px]">タイプ</TableHead>
                <TableHead className="w-[100px]">レベル</TableHead>
                <TableHead>メッセージ</TableHead>
                <TableHead className="w-[300px]">詳細</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.map((log) => {
                const TypeIcon = getTypeIcon(log.type);
                const typeColor = getTypeColor(log.type);
                
                return (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatTimestamp(log.timestamp)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <TypeIcon className={`h-4 w-4 ${typeColor}`} />
                        <span className="text-sm font-medium">{log.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getLevelBadge(log.level)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.message}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[300px] text-muted-foreground">
                        {formatDetail(log.detail)}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                {((currentPage - 1) * logsPerPage) + 1} - {Math.min(currentPage * logsPerPage, filteredLogs.length)} / {filteredLogs.length} 件
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  前へ
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  次へ
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}