import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useRealtimeData = () => {
  const { user } = useAuth();
  const [personas, setPersonas] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch all user data
        const [personasData, rulesData, settingsData, logsData] = await Promise.all([
          supabase.from('gas_personas').select('*').eq('user_id', user.id),
          supabase.from('gas_rules').select('*').eq('user_id', user.id),
          supabase.from('gas_settings').select('*').eq('user_id', user.id),
          supabase.from('gas_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(100)
        ]);

        setPersonas(personasData.data || []);
        setRules(rulesData.data || []);
        setSettings(settingsData.data || []);
        setLogs(logsData.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscriptions
    const personasChannel = supabase
      .channel('personas-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'gas_personas',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPersonas(prev => [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setPersonas(prev => prev.map(p => p.id === payload.new.id ? payload.new : p));
          } else if (payload.eventType === 'DELETE') {
            setPersonas(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    const rulesChannel = supabase
      .channel('rules-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'gas_rules',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setRules(prev => [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setRules(prev => prev.map(r => r.id === payload.new.id ? payload.new : r));
          } else if (payload.eventType === 'DELETE') {
            setRules(prev => prev.filter(r => r.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    const logsChannel = supabase
      .channel('logs-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'gas_logs',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          setLogs(prev => [payload.new, ...prev.slice(0, 99)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(personasChannel);
      supabase.removeChannel(rulesChannel);
      supabase.removeChannel(logsChannel);
    };
  }, [user]);

  return {
    personas,
    rules,
    settings,
    logs,
    loading,
    refetch: () => {
      // Trigger a manual refetch if needed
      if (user) {
        setLoading(true);
        // Re-run the fetch logic
      }
    }
  };
};