import { z } from 'zod';

// Common validation patterns
const urlPattern = /^https?:\/\/.+/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// System Settings validation schemas
export const threadsApiSchema = z.object({
  appId: z.string()
    .trim()
    .min(1, "App IDは必須です")
    .max(100, "App IDは100文字以内で入力してください"),
  appSecret: z.string()
    .trim()
    .min(1, "App Secretは必須です")
    .max(200, "App Secretは200文字以内で入力してください"),
  accessToken: z.string()
    .trim()
    .min(1, "Access Tokenは必須です")
    .max(500, "Access Tokenは500文字以内で入力してください"),
  botUserId: z.string()
    .trim()
    .min(1, "Bot User IDは必須です")
    .max(50, "Bot User IDは50文字以内で入力してください"),
  username: z.string()
    .trim()
    .min(1, "ユーザー名は必須です")
    .max(30, "ユーザー名は30文字以内で入力してください")
    .regex(/^[a-zA-Z0-9._]+$/, "ユーザー名は英数字、ピリオド、アンダースコアのみ使用可能です")
});

export const aiSettingsSchema = z.object({
  aiAutoReplyEnabled: z.boolean(),
  aiEngine: z.enum(['gemini', 'openai'], {
    errorMap: () => ({ message: "AIエンジンはGeminiまたはOpenAIを選択してください" })
  }),
  geminiApiKey: z.string()
    .trim()
    .max(200, "Gemini API Keyは200文字以内で入力してください")
    .optional()
    .or(z.literal('')),
  geminiModel: z.string()
    .trim()
    .max(50, "Geminiモデル名は50文字以内で入力してください")
    .optional()
    .or(z.literal('')),
  openaiApiKey: z.string()
    .trim()
    .max(200, "OpenAI API Keyは200文字以内で入力してください")
    .optional()
    .or(z.literal('')),
  openaiModel: z.string()
    .trim()
    .max(50, "OpenAIモデル名は50文字以内で入力してください")
    .optional()
    .or(z.literal('')),
  defaultPersona: z.string()
    .trim()
    .max(100, "デフォルトペルソナは100文字以内で入力してください")
    .optional()
    .or(z.literal(''))
});

export const webhookSettingsSchema = z.object({
  webhookUrl: z.string()
    .trim()
    .max(500, "Webhook URLは500文字以内で入力してください")
    .refine(
      (url) => url === '' || urlPattern.test(url),
      "有効なHTTPS URLを入力してください"
    )
    .optional()
    .or(z.literal('')),
  verifyToken: z.string()
    .trim()
    .min(1, "Verify Tokenは必須です")
    .max(100, "Verify Tokenは100文字以内で入力してください")
    .regex(/^[a-zA-Z0-9_-]+$/, "Verify Tokenは英数字、ハイフン、アンダースコアのみ使用可能です")
});

export const systemSettingsSchema = z.object({
  pollingInterval: z.number()
    .min(10, "ポーリング間隔は10秒以上にしてください")
    .max(3600, "ポーリング間隔は3600秒以下にしてください"),
  maxLogRows: z.number()
    .min(100, "最大ログ行数は100以上にしてください")
    .max(10000, "最大ログ行数は10000以下にしてください"),
  errorNotificationEmail: z.string()
    .trim()
    .max(254, "メールアドレスは254文字以内で入力してください")
    .refine(
      (email) => email === '' || emailPattern.test(email),
      "有効なメールアドレスを入力してください"
    )
    .optional()
    .or(z.literal(''))
});

// Rules Management validation schema
export const ruleSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "ルール名は必須です")
    .max(100, "ルール名は100文字以内で入力してください"),
  postUrl: z.string()
    .trim()
    .min(1, "投稿URLは必須です")
    .max(500, "投稿URLは500文字以内で入力してください")
    .refine(
      (url) => urlPattern.test(url),
      "有効なHTTPS URLを入力してください"
    ),
  keywords: z.string()
    .trim()
    .min(1, "キーワードは必須です")
    .max(500, "キーワードは500文字以内で入力してください")
    .refine(
      (keywords) => keywords.split(',').every(k => k.trim().length > 0),
      "各キーワードは空白文字のみにできません"
    ),
  reply: z.string()
    .trim()
    .min(1, "返信内容は必須です")
    .max(2000, "返信内容は2000文字以内で入力してください")
});

// Personas Management validation schema
export const personaSchema = z.object({
  personaName: z.string()
    .trim()
    .min(1, "ペルソナ名は必須です")
    .max(50, "ペルソナ名は50文字以内で入力してください")
    .regex(/^[a-zA-Z0-9_-]+$/, "ペルソナ名は英数字、ハイフン、アンダースコアのみ使用可能です"),
  displayName: z.string()
    .trim()
    .min(1, "表示名は必須です")
    .max(100, "表示名は100文字以内で入力してください"),
  styleGuide: z.string()
    .trim()
    .min(1, "スタイルガイドは必須です")
    .max(2000, "スタイルガイドは2000文字以内で入力してください"),
  recentPosts: z.string()
    .trim()
    .max(5000, "最近の投稿は5000文字以内で入力してください")
    .optional()
    .or(z.literal(''))
});

// Threads Integration validation schema
export const threadsIntegrationSchema = z.object({
  webhookUrl: z.string()
    .trim()
    .max(500, "Webhook URLは500文字以内で入力してください")
    .refine(
      (url) => url === '' || urlPattern.test(url),
      "有効なHTTPS URLを入力してください"
    )
    .optional()
    .or(z.literal('')),
  verifyToken: z.string()
    .trim()
    .min(1, "Verify Tokenは必須です")
    .max(100, "Verify Tokenは100文字以内で入力してください")
    .regex(/^[a-zA-Z0-9_-]+$/, "Verify Tokenは英数字、ハイフン、アンダースコアのみ使用可能です")
});

// Type exports for components
export type ThreadsApiFormData = z.infer<typeof threadsApiSchema>;
export type AiSettingsFormData = z.infer<typeof aiSettingsSchema>;
export type WebhookSettingsFormData = z.infer<typeof webhookSettingsSchema>;
export type SystemSettingsFormData = z.infer<typeof systemSettingsSchema>;
export type RuleFormData = z.infer<typeof ruleSchema>;
export type PersonaFormData = z.infer<typeof personaSchema>;
export type ThreadsIntegrationFormData = z.infer<typeof threadsIntegrationSchema>;