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

    const { text, persona_id, template_id } = await req.json();

    // Get AI API key
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'AI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get persona details
    const { data: persona, error: personaError } = await supabase
      .from('gas_personas')
      .select('*')
      .eq('id', persona_id)
      .eq('user_id', user.id)
      .single();

    if (personaError || !persona) {
      return new Response(
        JSON.stringify({ error: 'Persona not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get template if provided
    let template = null;
    if (template_id) {
      const { data: templateData, error: templateError } = await supabase
        .from('gas_templates')
        .select('*')
        .eq('template_id', template_id)
        .eq('user_id', user.id)
        .single();

      if (!templateError && templateData) {
        template = templateData;
      }
    }

    // Generate reply using Gemini AI
    const aiResponse = await generateAIReply(text, persona, template, geminiApiKey);

    // Log the generation
    await supabase.from('gas_logs').insert({
      user_id: user.id,
      event_id: `ai_reply_${Date.now()}`,
      status: 'success',
      text: text,
      reply: aiResponse.reply,
      persona: persona.name,
      template_id: template_id,
      metadata: {
        action: 'generate_reply',
        persona_name: persona.name,
        template_used: template?.template_id || null
      }
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        reply: aiResponse.reply,
        metadata: aiResponse.metadata
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-reply-generator function:', error);

    // Log error
    try {
      const authHeader = req.headers.get('Authorization')?.replace('Bearer ', '');
      if (authHeader) {
        const { data: { user } } = await supabase.auth.getUser(authHeader);
        if (user) {
          await supabase.from('gas_logs').insert({
            user_id: user.id,
            event_id: `ai_reply_error_${Date.now()}`,
            status: 'error',
            error_message: error instanceof Error ? error.message : String(error),
            metadata: {
              action: 'generate_reply'
            }
          });
        }
      }
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateAIReply(originalText: string, persona: any, template: any, apiKey: string) {
  const prompt = buildPrompt(originalText, persona, template);

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }]
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Gemini API error: ${errorData}`);
  }

  const data = await response.json();
  const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!generatedText) {
    throw new Error('No response generated from AI');
  }

  return {
    reply: generatedText.trim(),
    metadata: {
      model: 'gemini-pro',
      persona_used: persona.name,
      template_used: template?.template_id || null
    }
  };
}

function buildPrompt(originalText: string, persona: any, template: any): string {
  let prompt = `元の投稿: "${originalText}"\n\n`;

  prompt += `ペルソナ: ${persona.display_name}\n`;
  prompt += `スタイル: ${persona.style}\n\n`;

  if (persona.recent_posts && persona.recent_posts.length > 0) {
    prompt += `過去の投稿例:\n`;
    persona.recent_posts.forEach((post: string, index: number) => {
      prompt += `${index + 1}. ${post}\n`;
    });
    prompt += `\n`;
  }

  if (template) {
    prompt += `テンプレート: ${template.body}\n`;
    if (template.intent) {
      prompt += `意図: ${template.intent}\n`;
    }
    if (template.cta) {
      prompt += `CTA: ${template.cta}\n`;
    }
    if (template.min_len || template.max_len) {
      prompt += `文字数制限: ${template.min_len || 0}文字〜${template.max_len || 500}文字\n`;
    }
    prompt += `\n`;
  }

  prompt += `上記のペルソナとスタイルに基づいて、元の投稿に対する自然で魅力的な返信を生成してください。`;
  prompt += `日本語で返信し、ペルソナの特徴を反映した口調と内容にしてください。`;

  return prompt;
}