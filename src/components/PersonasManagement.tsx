import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Users, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Persona {
  id: string;
  personaName: string;
  displayName: string;
  styleGuide: string;
  recentPosts: string[];
}

export function PersonasManagement() {
  const { toast } = useToast();
  const [personas, setPersonas] = useState<Persona[]>([
    {
      id: '1',
      personaName: 'luna',
      displayName: 'ルナ',
      styleGuide: '丁寧でやわらかい口調。恋愛やライフスタイルに特化。語尾は「です・ます」調で親しみやすく。絵文字は控えめに使用。',
      recentPosts: [
        '今日の夕焼けが本当に美しくて、思わず写真を撮ってしまいました ✨',
        'お気に入りのカフェで読書中。静かな時間が心を落ち着かせてくれます',
        '新しいヨガクラスに参加してきました！身体も心もリフレッシュ 🧘‍♀️'
      ]
    },
    {
      id: '2',
      personaName: 'tech_expert',
      displayName: 'テックエキスパート',
      styleGuide: '技術的で正確性を重視。プログラミングやテクノロジー分野に特化。専門用語を使いつつも、分かりやすい説明を心がける。',
      recentPosts: [
        'React 19の新機能について詳しく調べています。特にServer Componentsの改善が興味深い',
        'TypeScriptの型安全性がプロジェクトの品質向上に大きく貢献していることを実感',
        'CI/CDパイプラインの最適化により、デプロイ時間が50%短縮されました'
      ]
    },
    {
      id: '3',
      personaName: 'casual_friend',
      displayName: 'カジュアルフレンド',
      styleGuide: 'フレンドリーでカジュアル。親近感のある口調で、絵文字や感嘆符を多用。日常的な話題が得意。',
      recentPosts: [
        'おはよう！今日もいい天気だね〜 ☀️ みんなはどんな一日にする予定？',
        'ランチに作った手作りサンドイッチが美味しすぎた！！レシピシェアしようかな 🥪',
        '週末の映画、めちゃくちゃよかった〜！感動して泣いちゃった 😭'
      ]
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);
  const [formData, setFormData] = useState({
    personaName: '',
    displayName: '',
    styleGuide: '',
    recentPosts: ['', '', '']
  });

  const resetForm = () => {
    setFormData({
      personaName: '',
      displayName: '',
      styleGuide: '',
      recentPosts: ['', '', '']
    });
    setEditingPersona(null);
  };

  const openDialog = (persona?: Persona) => {
    if (persona) {
      setEditingPersona(persona);
      setFormData({
        personaName: persona.personaName,
        displayName: persona.displayName,
        styleGuide: persona.styleGuide,
        recentPosts: [...persona.recentPosts, '', '', ''].slice(0, 3)
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filteredPosts = formData.recentPosts.filter(post => post.trim() !== '');
    
    if (editingPersona) {
      setPersonas(personas.map(persona => 
        persona.id === editingPersona.id 
          ? { ...persona, ...formData, recentPosts: filteredPosts }
          : persona
      ));
      toast({
        title: "ペルソナを更新しました",
        description: `「${formData.displayName}」が正常に更新されました。`,
      });
    } else {
      const newPersona: Persona = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        recentPosts: filteredPosts
      };
      setPersonas([...personas, newPersona]);
      toast({
        title: "新しいペルソナを作成しました",
        description: `「${formData.displayName}」が正常に作成されました。`,
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const deletePersona = (id: string) => {
    const persona = personas.find(p => p.id === id);
    setPersonas(personas.filter(persona => persona.id !== id));
    toast({
      title: "ペルソナを削除しました",
      description: `「${persona?.displayName}」が削除されました。`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ペルソナ管理</h1>
          <p className="text-muted-foreground">
            AI自動返信で使用する文体とキャラクターを設定・管理します
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              新しいペルソナ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPersona ? 'ペルソナを編集' : '新しいペルソナを作成'}
              </DialogTitle>
              <DialogDescription>
                AI返信時の文体やキャラクター設定を定義してください
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="personaName">ペルソナ名（英数字）</Label>
                  <Input
                    id="personaName"
                    value={formData.personaName}
                    onChange={(e) => setFormData({...formData, personaName: e.target.value})}
                    placeholder="例: luna"
                    pattern="[a-zA-Z0-9_]+"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="displayName">表示名</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    placeholder="例: ルナ"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="styleGuide">文体ガイド</Label>
                <Textarea
                  id="styleGuide"
                  value={formData.styleGuide}
                  onChange={(e) => setFormData({...formData, styleGuide: e.target.value})}
                  placeholder="このペルソナの話し方、特徴、専門分野、口調などを詳しく説明してください"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label>最近の投稿例（AIの学習用）</Label>
                <div className="space-y-2">
                  {formData.recentPosts.map((post, index) => (
                    <div key={index}>
                      <Textarea
                        value={post}
                        onChange={(e) => {
                          const newPosts = [...formData.recentPosts];
                          newPosts[index] = e.target.value;
                          setFormData({...formData, recentPosts: newPosts});
                        }}
                        placeholder={`投稿例 ${index + 1}（このペルソナらしい投稿内容）`}
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  このペルソナの文体を学習するための投稿例を入力してください
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button type="submit">
                  {editingPersona ? '更新' : '作成'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Personas Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {personas.map((persona) => (
          <Card key={persona.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>{persona.displayName}</span>
                  </CardTitle>
                  <Badge variant="outline" className="mt-1">
                    {persona.personaName}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDialog(persona)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePersona(persona.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">文体ガイド</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {persona.styleGuide}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    投稿例 ({persona.recentPosts.length}件)
                  </h4>
                  <div className="space-y-2">
                    {persona.recentPosts.slice(0, 2).map((post, index) => (
                      <div key={index} className="p-2 bg-muted/30 rounded text-xs">
                        {post.length > 80 ? `${post.substring(0, 80)}...` : post}
                      </div>
                    ))}
                    {persona.recentPosts.length > 2 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{persona.recentPosts.length - 2} 件の投稿例
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Info */}
      <Card>
        <CardHeader>
          <CardTitle>ペルソナの使用方法</CardTitle>
          <CardDescription>
            ペルソナを効果的に活用するためのガイド
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">設定方法</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• システム設定でデフォルトペルソナを選択</li>
                <li>• 文体ガイドは具体的に記述</li>
                <li>• 投稿例は実際の文体に近いものを入力</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">活用のコツ</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 専門分野に特化したペルソナを作成</li>
                <li>• 口調や語尾の特徴を明確化</li>
                <li>• 定期的に投稿例を更新</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}