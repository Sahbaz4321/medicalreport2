const { GoogleGenAI } = require('@google/genai');

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

let geminiClient = null;

function getProvider() {
  const explicit = (process.env.AI_PROVIDER || '').toLowerCase();
  if (explicit) return explicit; // 'openai' or 'gemini'

  // Convenience: auto-pick a provider if only one key is present.
  if (process.env.GEMINI_API_KEY) return 'gemini';
  if (process.env.OPENAI_API_KEY) return 'openai';
  return '';
}

function getProviderInfo() {
  const provider = getProvider();
  if (provider === 'openai') {
    return { provider, model: process.env.OPENAI_MODEL || 'gpt-4o-mini' };
  }
  if (provider === 'gemini') {
    return { provider, model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' };
  }
  return { provider: provider || 'none', model: null };
}

function getGeminiClient() {
  if (geminiClient) return geminiClient;
  // SDK reads GEMINI_API_KEY from env automatically when omitted,
  // but we keep explicit to be clear.
  geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return geminiClient;
}

/**
 * Call a hosted LLM (OpenAI or Gemini) to generate a short, patient-friendly explanation.
 * Returns null if provider or API key is not configured, or if the request fails.
 */
async function generateAiText({ systemInstruction, userPrompt, responseMimeType }) {
  try {
    const provider = getProvider();

    if (provider === 'openai' && process.env.OPENAI_API_KEY) {
      return await callOpenAi(systemInstruction, userPrompt);
    }

    if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
      return await callGemini(systemInstruction, userPrompt, responseMimeType);
    }

    return null;
  } catch (err) {
    console.error('LLM error:', err.message);
    return null;
  }
}

/**
 * Same as generateAiText, but returns debug info for UI.
 * Never include the API key in errors.
 */
async function generateAiTextDetailed({ systemInstruction, userPrompt, responseMimeType }) {
  const provider = getProvider();

  if (provider === 'openai' && !process.env.OPENAI_API_KEY) {
    return { text: null, error: 'OPENAI_API_KEY is missing' };
  }
  if (provider === 'gemini' && !process.env.GEMINI_API_KEY) {
    return { text: null, error: 'GEMINI_API_KEY is missing' };
  }
  if (!provider) {
    return { text: null, error: 'AI provider is not configured (set AI_PROVIDER or an API key)' };
  }

  try {
    const text = await generateAiText({ systemInstruction, userPrompt, responseMimeType });
    if (!text) {
      return { text: null, error: 'AI request returned empty output' };
    }
    return { text, error: null };
  } catch (err) {
    return { text: null, error: err?.message || 'AI request failed' };
  }
}

async function callOpenAi(systemInstruction, userPrompt) {
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const res = await fetch(OPENAI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 400,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const choice = data.choices && data.choices[0];
  return choice && choice.message && choice.message.content
    ? choice.message.content.trim()
    : null;
}

async function callGemini(systemInstruction, userPrompt, responseMimeType) {
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: 'user',
        parts: [{ text: systemInstruction + '\n\n' + userPrompt }],
      },
    ],
    generationConfig: responseMimeType ? { responseMimeType } : undefined,
  });

  // SDK provides `.text` as a convenience
  return response && response.text ? response.text.trim() : null;
}

module.exports = {
  generateAiText,
  generateAiTextDetailed,
  getProviderInfo,
};

