import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, MessageSquare, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Rule {
  id: string;
  name: string;
  postUrl: string;
  keywords: string;
  reply: string;
  status: 'ACTIVE' | 'PAUSED';
  lastChecked: string;
  lastReplyId: string;
}

export function RulesManagement() {
  const { toast } = useToast();
  const [rules, setRules] = useState<Rule[]>([
    {
      id: '1',
      name: '基本QA',
      postUrl: '',
      keywords: '料金,価格,値段,支払い,コース',
      reply: '{{user}}さん、料金のご質問ありがとうございます。詳しくは固定プロフィールからご案内しています。',
      status: 'ACTIVE',
      lastChecked: '2025-09-28T10:00:00+02:00',
      lastReplyId: ''
    },
    {
      id: '2',
      name: 'サポート対応',
      postUrl: 'https://threads.net/@example/post/123',
      keywords: 'サポート,問い合わせ,ヘルプ',
      reply: 'サポートが必要でしたら、DMにてお気軽にお声がけください！',
      status: 'ACTIVE',
      lastChecked: '2025-09-28T09:30:00+02:00',
      lastReplyId: 'reply_456'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    postUrl: string;
    keywords: string;
    reply: string;
    status: 'ACTIVE' | 'PAUSED';
  }>({
    name: '',
    postUrl: '',
    keywords: '',
    reply: '',
    status: 'ACTIVE'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      postUrl: '',
      keywords: '',
      reply: '',
      status: 'ACTIVE'
    });
    setEditingRule(null);
  };

  const openDialog = (rule?: Rule) => {
    if (rule) {
      setEditingRule(rule);
      setFormData({
        name: rule.name,
        postUrl: rule.postUrl,
        keywords: rule.keywords,
        reply: rule.reply,
        status: rule.status
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRule) {
      // Update existing rule
      setRules(rules.map(rule => 
        rule.id === editingRule.id 
          ? { ...rule, ...formData, lastChecked: new Date().toISOString() }
          : rule
      ));
      toast({
        title: "ルールを更新しました",
        description: `「${formData.name}」が正常に更新されました。`,
      });
    } else {
      // Create new rule
      const newRule: Rule = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        lastChecked: new Date().toISOString(),
        lastReplyId: ''
      };
      setRules([...rules, newRule]);
      toast({
        title: "新しいルールを作成しました",
        description: `「${formData.name}」が正常に作成されました。`,
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const toggleRuleStatus = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id 
        ? { ...rule, status: rule.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' }
        : rule
    ));
  };

  const deleteRule = (id: string) => {
    const rule = rules.find(r => r.id === id);
    setRules(rules.filter(rule => rule.id !== id));
    toast({
      title: "ルールを削除しました",
      description: `「${rule?.name}」が削除されました。`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">自動返信ルール管理</h1>
          <p className="text-muted-foreground">
            キーワードベースの自動返信ルールを設定・管理します
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              新しいルール
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRule ? 'ルールを編集' : '新しいルールを作成'}
              </DialogTitle>
              <DialogDescription>
                キーワードにマッチした場合の自動返信ルールを設定してください
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">ルール名</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="例: 基本QA"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">ステータス</Label>
                  <Select value={formData.status} onValueChange={(value: 'ACTIVE' | 'PAUSED') => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">アクティブ</SelectItem>
                      <SelectItem value="PAUSED">一時停止</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="postUrl">対象投稿URL（空の場合は全投稿対象）</Label>
                <Input
                  id="postUrl"
                  value={formData.postUrl}
                  onChange={(e) => setFormData({...formData, postUrl: e.target.value})}
                  placeholder="https://threads.net/@username/post/..."
                />
              </div>
              <div>
                <Label htmlFor="keywords">キーワード（カンマ区切り）</Label>
                <Input
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                  placeholder="料金,価格,値段"
                  required
                />
              </div>
              <div>
                <Label htmlFor="reply">返信内容</Label>
                <Textarea
                  id="reply"
                  value={formData.reply}
                  onChange={(e) => setFormData({...formData, reply: e.target.value})}
                  placeholder="{{user}}さん、お問い合わせありがとうございます。"
                  rows={3}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {`{{user}}、{{keyword}} などの変数が使用できます`}
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button type="submit">
                  {editingRule ? '更新' : '作成'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rules Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>自動返信ルール一覧</span>
          </CardTitle>
          <CardDescription>
            設定されている自動返信ルールの一覧と管理
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ルール名</TableHead>
                <TableHead>キーワード</TableHead>
                <TableHead>対象投稿</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>最終チェック</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {rule.keywords.split(',').slice(0, 3).map((keyword, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {keyword.trim()}
                        </Badge>
                      ))}
                      {rule.keywords.split(',').length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{rule.keywords.split(',').length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {rule.postUrl ? (
                      <a href={rule.postUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        特定投稿
                      </a>
                    ) : (
                      <span className="text-muted-foreground">全投稿対象</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={rule.status === 'ACTIVE'}
                        onCheckedChange={() => toggleRuleStatus(rule.id)}
                      />
                      <Badge variant={rule.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {rule.status === 'ACTIVE' ? 'アクティブ' : '一時停止'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(rule.lastChecked).toLocaleString('ja-JP')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog(rule)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}