import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useDataManager = () => {
  const { session } = useAuth();
  const { toast } = useToast();

  const callEdgeFunction = async (functionName: string, data: any) => {
    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }

    const { data: result, error } = await supabase.functions.invoke(functionName, {
      body: data,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      throw error;
    }

    return result;
  };

  const savePersona = async (personaData: any) => {
    try {
      const result = await callEdgeFunction('data-management', {
        action: 'save_persona',
        ...personaData,
      });

      toast({
        title: "ペルソナ保存完了",
        description: "ペルソナが正常に保存されました。",
      });

      return result;
    } catch (error: any) {
      toast({
        title: "ペルソナ保存エラー",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const saveRule = async (ruleData: any) => {
    try {
      const result = await callEdgeFunction('data-management', {
        action: 'save_rule',
        ...ruleData,
      });

      toast({
        title: "ルール保存完了",
        description: "ルールが正常に保存されました。",
      });

      return result;
    } catch (error: any) {
      toast({
        title: "ルール保存エラー",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const saveSettings = async (settingsData: any) => {
    try {
      const result = await callEdgeFunction('data-management', {
        action: 'save_settings',
        ...settingsData,
      });

      toast({
        title: "設定保存完了",
        description: "設定が正常に保存されました。",
      });

      return result;
    } catch (error: any) {
      toast({
        title: "設定保存エラー",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const saveWebhookConfig = async (webhookData: any) => {
    try {
      const result = await callEdgeFunction('data-management', {
        action: 'save_webhook_config',
        ...webhookData,
      });

      toast({
        title: "Webhook設定保存完了",
        description: "Webhook設定が正常に保存されました。",
      });

      return result;
    } catch (error: any) {
      toast({
        title: "Webhook設定保存エラー",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const testThreadsConnection = async () => {
    try {
      const result = await callEdgeFunction('data-management', {
        action: 'test_threads_connection',
      });

      if (result.success) {
        toast({
          title: "接続テスト成功",
          description: "Threads APIへの接続が確認できました。",
        });
      }

      return result;
    } catch (error: any) {
      toast({
        title: "接続テストエラー",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const generateAIReply = async (text: string, personaId: string, templateId?: string) => {
    try {
      const result = await callEdgeFunction('ai-reply-generator', {
        text,
        persona_id: personaId,
        template_id: templateId,
      });

      toast({
        title: "AI返信生成完了",
        description: "AI返信が正常に生成されました。",
      });

      return result;
    } catch (error: any) {
      toast({
        title: "AI返信生成エラー",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    savePersona,
    saveRule,
    saveSettings,
    saveWebhookConfig,
    testThreadsConnection,
    generateAIReply,
  };
};