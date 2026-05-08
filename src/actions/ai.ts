"use server";

import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

export async function getAiConfig() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('ai_config')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
    console.error('Error fetching AI config:', error);
  }
  return data;
}

export async function saveAiConfig(config: {
  provider: 'gemini' | 'openai' | 'claude';
  model_name: string;
  api_key: string;
  token_limit?: number;
}) {
  const supabase = await createClient();
  
  // Deactivate others first (global active provider)
  await supabase
    .from('ai_config')
    .update({ is_active: false })
    .neq('provider', 'invalid'); // target all

  const { data, error } = await supabase
    .from('ai_config')
    .upsert({
      ...config,
      is_active: true,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getStrategyAdvice(taskTitle: string, taskDescription: string) {
  const config = await getAiConfig();
  
  if (!config) {
    return {
      summary: "AI Configuration missing. Please configure an API key in System Intelligence.",
      approach: ["N/A"],
      resource: "N/A"
    };
  }

  const prompt = `
    As a strategic executive advisor, analyze the following task and provide high-level advice.
    Task Title: ${taskTitle}
    Task Description: ${taskDescription}

    Format your response as a JSON object with the following structure:
    {
      "summary": "A concise executive summary of the task importance and potential impact.",
      "approach": ["A list of 3-4 tactical steps to tackle the task effectively."],
      "resource": "A recommendation for which type of assistant or resource should handle this."
    }
  `;

  try {
    if (config.provider === 'gemini') {
      const genAI = new GoogleGenerativeAI(config.api_key);
      const model = genAI.getGenerativeModel({ model: config.model_name });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      // Clean potential markdown code blocks
      const cleanJson = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } 
    
    if (config.provider === 'openai') {
      const openai = new OpenAI({ apiKey: config.api_key });
      const response = await openai.chat.completions.create({
        model: config.model_name,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      return JSON.parse(response.choices[0].message.content || '{}');
    }

    if (config.provider === 'claude') {
      const anthropic = new Anthropic({ apiKey: config.api_key });
      const response = await anthropic.messages.create({
        model: config.model_name,
        max_tokens: config.token_limit || 1024,
        messages: [{ role: "user", content: prompt }]
      });
      // Claude doesn't strictly support response_format: json_object in the same way, so we parse content
      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      const cleanJson = content.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    }

    throw new Error(`Provider ${config.provider} not supported.`);
  } catch (error) {
    console.error('AI Strategy Advice Error:', error);
    return {
      summary: "Error generating strategic advice. Please check your API key and model selection.",
      approach: ["Manual review required."],
      resource: "Consult executive team."
    };
  }
}

export async function getWeeklySummary(tasks: any[], weekNumber: number) {
  const config = await getAiConfig();
  
  if (!config) return null;

  const taskList = tasks.map(t => `- ${t.title} (${t.status}, ${t.priority})`).join('\n');

  const prompt = `
    As an AI Chief of Staff, analyze this week's task list for Week ${weekNumber}.
    Tasks:
    ${taskList}

    Provide a strategic overview in JSON format:
    {
      "strategicLoad": "One sentence about the focus and density of work this week.",
      "efficiencyForecast": "One sentence about the likelihood of completion and team performance.",
      "recommendation": "One specific actionable recommendation for the CEO."
    }
  `;

  try {
    let content = "";
    if (config.provider === 'gemini') {
      const genAI = new GoogleGenerativeAI(config.api_key);
      const model = genAI.getGenerativeModel({ model: config.model_name });
      const result = await model.generateContent(prompt);
      content = result.response.text();
    } else if (config.provider === 'openai') {
      const openai = new OpenAI({ apiKey: config.api_key });
      const response = await openai.chat.completions.create({
        model: config.model_name,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      content = response.choices[0].message.content || '{}';
    } else if (config.provider === 'claude') {
      const anthropic = new Anthropic({ apiKey: config.api_key });
      const response = await anthropic.messages.create({
        model: config.model_name,
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }]
      });
      content = response.content[0].type === 'text' ? response.content[0].text : '';
    }

    const cleanJson = content.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Weekly Summary Error:', error);
    return null;
  }
}
