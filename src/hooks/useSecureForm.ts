import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

interface UseSecureFormOptions<T extends z.ZodType> {
  schema: T;
  defaultValues?: z.infer<T>;
  onSubmit: (data: z.infer<T>) => void | Promise<void>;
  onError?: (errors: any) => void;
}

export function useSecureForm<T extends z.ZodType>({
  schema,
  defaultValues,
  onSubmit,
  onError
}: UseSecureFormOptions<T>) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange' // リアルタイムバリデーション
  });

  const handleSubmit = form.handleSubmit(
    async (data) => {
      try {
        // データのサニタイゼーション（追加の安全対策）
        const sanitizedData = sanitizeFormData(data);
        await onSubmit(sanitizedData);
      } catch (error) {
        console.error('Form submission error:', error);
        toast({
          title: "エラー",
          description: "データの保存中にエラーが発生しました。",
          variant: "destructive"
        });
      }
    },
    (errors) => {
      console.error('Form validation errors:', errors);
      toast({
        title: "入力エラー",
        description: "入力内容を確認してください。",
        variant: "destructive"
      });
      onError?.(errors);
    }
  );

  return {
    form,
    handleSubmit,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors
  };
}

// データサニタイゼーション関数
function sanitizeFormData<T>(data: T): T {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sanitized = { ...data };
  
  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'string') {
      // HTMLタグの除去とエスケープ
      (sanitized as any)[key] = value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // script除去
        .replace(/<[^>]*>/g, '') // HTMLタグ除去
        .trim();
    } else if (typeof value === 'object' && value !== null) {
      (sanitized as any)[key] = sanitizeFormData(value);
    }
  }

  return sanitized;
}

// セキュリティヘルパー関数
export const securityUtils = {
  // URLの安全性検証
  isSecureUrl: (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'https:' && 
             !['localhost', '127.0.0.1', '0.0.0.0'].includes(parsedUrl.hostname);
    } catch {
      return false;
    }
  },

  // APIキーの形式検証（実際の値は検証しない）
  isValidApiKeyFormat: (key: string): boolean => {
    return key.length >= 20 && key.length <= 200 && /^[A-Za-z0-9._-]+$/.test(key);
  },

  // 機密情報のマスク
  maskSecret: (secret: string): string => {
    if (secret.length <= 8) return '****';
    return secret.substring(0, 4) + '*'.repeat(secret.length - 8) + secret.substring(secret.length - 4);
  },

  // 安全な文字列生成（トークン等）
  generateSecureToken: (length: number = 32): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let result = '';
    const randomArray = new Uint8Array(length);
    crypto.getRandomValues(randomArray);
    
    for (let i = 0; i < length; i++) {
      result += chars[randomArray[i] % chars.length];
    }
    return result;
  }
};