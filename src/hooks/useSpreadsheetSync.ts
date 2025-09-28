import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SpreadsheetData {
  settings: Array<{
    key: string;
    value: string;
    category: string;
    description: string;
  }>;
  personas: Array<{
    name: string;
    displayName: string;
    style: string;
    recentPosts: string[];
  }>;
  rules: Array<{
    ruleKey: string;
    ruleValue: string;
    description: string;
  }>;
  logs: Array<{
    timestamp: string;
    level: string;
    type: string;
    message: string;
    metadata: any;
  }>;
}

export const useSpreadsheetSync = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const callGASWebApp = useCallback(async (gasWebAppUrl: string, action: string, data?: any) => {
    if (!gasWebAppUrl) {
      throw new Error('GAS WebApp URLが設定されていません');
    }

    const requestBody = {
      action,
      ...data
    };

    const response = await fetch(gasWebAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'GAS WebApp API でエラーが発生しました');
    }

    return result;
  }, []);

  const syncFromSpreadsheet = useCallback(async (gasWebAppUrl: string): Promise<SpreadsheetData> => {
    setIsLoading(true);
    try {
      const result = await callGASWebApp(gasWebAppUrl, 'getAllData');
      
      toast({
        title: "同期完了",
        description: "スプレッドシートからデータを取得しました"
      });

      return result.data;
    } catch (error: any) {
      toast({
        title: "同期エラー",
        description: `データ取得に失敗しました: ${error.message}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [callGASWebApp, toast]);

  const saveToSpreadsheet = useCallback(async (
    gasWebAppUrl: string, 
    dataType: 'setting' | 'persona' | 'rule' | 'log',
    data: any
  ) => {
    setIsLoading(true);
    try {
      const actionMap = {
        setting: 'saveSetting',
        persona: 'savePersona',
        rule: 'saveRule',
        log: 'saveLog'
      };

      const result = await callGASWebApp(gasWebAppUrl, actionMap[dataType], { [dataType]: data });
      
      toast({
        title: "保存完了",
        description: `${dataType}をスプレッドシートに保存しました`
      });

      return result;
    } catch (error: any) {
      toast({
        title: "保存エラー",
        description: `保存に失敗しました: ${error.message}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [callGASWebApp, toast]);

  const getSpreadsheetInfo = useCallback(async (gasWebAppUrl: string) => {
    setIsLoading(true);
    try {
      const result = await callGASWebApp(gasWebAppUrl, 'getSpreadsheetInfo');
      return result.data;
    } catch (error: any) {
      toast({
        title: "情報取得エラー",
        description: `スプレッドシート情報の取得に失敗しました: ${error.message}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [callGASWebApp, toast]);

  const testConnection = useCallback(async (gasWebAppUrl: string) => {
    setIsLoading(true);
    try {
      const result = await callGASWebApp(gasWebAppUrl, 'testConnection');
      
      toast({
        title: "接続テスト成功",
        description: "GAS WebApp への接続が確認できました"
      });

      return result;
    } catch (error: any) {
      toast({
        title: "接続テスト失敗",
        description: `接続テストに失敗しました: ${error.message}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [callGASWebApp, toast]);

  return {
    isLoading,
    syncFromSpreadsheet,
    saveToSpreadsheet,
    getSpreadsheetInfo,
    testConnection,
    callGASWebApp
  };
};