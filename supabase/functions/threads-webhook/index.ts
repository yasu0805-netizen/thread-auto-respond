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
    // This function can be called without authentication for webhook processing
    const contentType = req.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      // Handle webhook from Threads
      const payload = await req.json();
      return await handleThreadsWebhook(payload, req);
    } else {
      // Handle webhook setup verification
      const url = new URL(req.url);
      const hubChallenge = url.searchParams.get('hub.challenge');
      const hubVerifyToken = url.searchParams.get('hub.verify_token');
      
      if (hubChallenge && hubVerifyToken) {
        return handleWebhookVerification(hubChallenge, hubVerifyToken);
      }
    }

    return new Response(
      JSON.stringify({ error: 'Invalid request' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in threads-webhook function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function handleWebhookVerification(challenge: string, verifyToken: string) {
  // In a real implementation, you'd verify the token against your stored verification token
  console.log('Webhook verification requested with token:', verifyToken);
  
  return new Response(challenge, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      ...corsHeaders
    }
  });
}

async function handleThreadsWebhook(payload: any, req: Request) {
  console.log('Received Threads webhook:', JSON.stringify(payload, null, 2));

  // Verify webhook signature (in production)
  const signature = req.headers.get('x-hub-signature-256');
  
  // Process the webhook payload
  if (payload.object === 'thread' && payload.entry) {
    for (const entry of payload.entry) {
      if (entry.changes) {
        for (const change of entry.changes) {
          await processThreadChange(change);
        }
      }
    }
  }

  return new Response('OK', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      ...corsHeaders
    }
  });
}

async function processThreadChange(change: any) {
  const { field, value } = change;
  
  console.log(`Processing thread change: ${field}`, value);
  
  if (field === 'mentions' && value.media_id) {
    await handleMention(value);
  } else if (field === 'replies' && value.media_id) {
    await handleReply(value);
  }
}

async function handleMention(mentionData: any) {
  try {
    const { media_id, text, timestamp } = mentionData;
    
    console.log('Processing mention:', { media_id, text, timestamp });
    
    // Get the post details using Threads API
    const threadsAccessToken = Deno.env.get('THREADS_ACCESS_TOKEN');
    if (!threadsAccessToken) {
      console.error('Threads access token not configured');
      return;
    }

    const response = await fetch(`https://graph.threads.net/${media_id}?fields=id,text,username,timestamp&access_token=${threadsAccessToken}`);
    
    if (!response.ok) {
      console.error('Failed to fetch post details:', await response.text());
      return;
    }

    const postData = await response.json();
    
    // Log the mention
    await supabase.from('gas_logs').insert({
      user_id: '00000000-0000-0000-0000-000000000000', // System user for webhooks
      event_id: `mention_${media_id}`,
      status: 'received',
      text: postData.text,
      thread_id: media_id,
      target_user_id: postData.username,
      metadata: {
        action: 'mention_received',
        original_data: mentionData,
        post_data: postData
      }
    });

    // Here you would implement auto-reply logic
    await processAutoReply(postData);

  } catch (error) {
    console.error('Error handling mention:', error);
    
    await supabase.from('gas_logs').insert({
      user_id: '00000000-0000-0000-0000-000000000000',
      event_id: `mention_error_${Date.now()}`,
      status: 'error',
      error_message: error instanceof Error ? error.message : String(error),
      metadata: {
        action: 'handle_mention',
        mention_data: mentionData
      }
    });
  }
}

async function handleReply(replyData: any) {
  try {
    const { media_id, text, timestamp } = replyData;
    
    console.log('Processing reply:', { media_id, text, timestamp });
    
    // Similar to mention handling but for replies
    await supabase.from('gas_logs').insert({
      user_id: '00000000-0000-0000-0000-000000000000',
      event_id: `reply_${media_id}`,
      status: 'received',
      text: text,
      thread_id: media_id,
      metadata: {
        action: 'reply_received',
        original_data: replyData
      }
    });

  } catch (error) {
    console.error('Error handling reply:', error);
  }
}

async function processAutoReply(postData: any) {
  try {
    // Get active auto-reply rules
    const { data: rules, error } = await supabase
      .from('gas_rules')
      .select('*')
      .eq('rule_key', 'auto_reply')
      .eq('rule_value', 'enabled');

    if (error || !rules || rules.length === 0) {
      console.log('No active auto-reply rules found');
      return;
    }

    // Process each rule
    for (const rule of rules) {
      // Get user's personas and templates
      const { data: personas } = await supabase
        .from('gas_personas')
        .select('*')
        .eq('user_id', rule.user_id)
        .eq('active', true);

      if (personas && personas.length > 0) {
        // Use the first active persona for auto-reply
        const persona = personas[0];
        
        // Generate and post reply using AI
        await generateAndPostReply(postData, persona, rule.user_id);
      }
    }

  } catch (error) {
    console.error('Error processing auto-reply:', error);
  }
}

async function generateAndPostReply(postData: any, persona: any, userId: string) {
  try {
    // This would integrate with the AI reply generator
    // For now, just log the attempt
    await supabase.from('gas_logs').insert({
      user_id: userId,
      event_id: `auto_reply_${Date.now()}`,
      status: 'processing',
      text: postData.text,
      persona: persona.name,
      thread_id: postData.id,
      target_user_id: postData.username,
      metadata: {
        action: 'auto_reply_generated',
        persona_used: persona.name
      }
    });

    console.log(`Auto-reply generated for user ${userId} using persona ${persona.name}`);

  } catch (error) {
    console.error('Error generating auto-reply:', error);
  }
}