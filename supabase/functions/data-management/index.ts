import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user from auth header
    const authHeader = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user } } = await supabase.auth.getUser(authHeader);
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, ...requestData } = await req.json();

    switch (action) {
      case 'save_persona':
        return await savePersona(user.id, requestData);
      case 'save_rule':
        return await saveRule(user.id, requestData);
      case 'save_settings':
        return await saveSettings(user.id, requestData);
      case 'save_webhook_config':
        return await saveWebhookConfig(user.id, requestData);
      case 'test_threads_connection':
        return await testThreadsConnection(user.id);
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in data-management function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function savePersona(userId: string, data: any) {
  const { data: result, error } = await supabase
    .from('gas_personas')
    .upsert({
      id: data.id || undefined,
      user_id: userId,
      name: data.name,
      display_name: data.display_name,
      style: data.style,
      recent_posts: data.recent_posts || [],
      active: data.active ?? true
    })
    .select();

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true, data: result }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function saveRule(userId: string, data: any) {
  const { data: result, error } = await supabase
    .from('gas_rules')
    .upsert({
      id: data.id || undefined,
      user_id: userId,
      rule_key: data.rule_key,
      rule_value: data.rule_value,
      description: data.description
    })
    .select();

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true, data: result }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function saveSettings(userId: string, data: any) {
  const { data: result, error } = await supabase
    .from('gas_settings')
    .upsert({
      id: data.id || undefined,
      user_id: userId,
      setting_key: data.setting_key,
      setting_value: data.setting_value,
      setting_type: data.setting_type || 'string'
    })
    .select();

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true, data: result }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function saveWebhookConfig(userId: string, data: any) {
  const { data: result, error } = await supabase
    .from('gas_webhook_config')
    .upsert({
      id: data.id || undefined,
      user_id: userId,
      app_id: data.app_id,
      gas_webapp_url: data.gas_webapp_url,
      hmac_secret: data.hmac_secret,
      is_active: data.is_active ?? true
    })
    .select();

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true, data: result }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function testThreadsConnection(userId: string) {
  try {
    const threadsAppId = Deno.env.get('THREADS_APP_ID');
    const threadsAppSecret = Deno.env.get('THREADS_APP_SECRET');
    const threadsAccessToken = Deno.env.get('THREADS_ACCESS_TOKEN');

    if (!threadsAppId || !threadsAppSecret || !threadsAccessToken) {
      return new Response(
        JSON.stringify({ 
          error: 'Threads API credentials not configured',
          status: 'disconnected' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Test the Threads API connection
    const response = await fetch(`https://graph.threads.net/me?access_token=${threadsAccessToken}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const userData = await response.json();
      
      // Log successful connection
      await supabase.from('gas_logs').insert({
        user_id: userId,
        event_id: `test_connection_${Date.now()}`,
        status: 'success',
        metadata: { 
          action: 'test_connection',
          threads_user: userData
        }
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          status: 'connected',
          user_data: userData
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      const errorData = await response.text();
      
      // Log failed connection
      await supabase.from('gas_logs').insert({
        user_id: userId,
        event_id: `test_connection_${Date.now()}`,
        status: 'error',
        error_message: errorData,
        metadata: { 
          action: 'test_connection',
          status_code: response.status
        }
      });

      return new Response(
        JSON.stringify({ 
          error: 'Failed to connect to Threads API',
          status: 'disconnected',
          details: errorData
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error testing Threads connection:', error);
    
    // Log error
    await supabase.from('gas_logs').insert({
      user_id: userId,
      event_id: `test_connection_${Date.now()}`,
      status: 'error',
      error_message: error instanceof Error ? error.message : String(error),
      metadata: { 
        action: 'test_connection'
      }
    });

    return new Response(
      JSON.stringify({ 
        error: 'Connection test failed',
        status: 'disconnected',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}