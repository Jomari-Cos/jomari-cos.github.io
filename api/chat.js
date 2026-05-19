import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.gemini_api_key ||
  process.env.chatbot_portfolio ||
  process.env.CHATBOT_PORTFOLIO;

// Gate client creation on key presence — avoids Gemini constructor throwing
// at module-load time when the env var is missing/empty.
let genAI;
if (GEMINI_KEY) {
  genAI = new GoogleGenerativeAI({ apiKey: GEMINI_KEY });
} else {
  console.error(
    'GEMINI_API_KEY is not set. Add it in Vercel project settings (Production + Preview scope).'
  );
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if API key is configured
  if (!GEMINI_KEY) {
    console.error('GEMINI_API_KEY is not set.');
    return res
      .status(500)
      .json({ error: 'Server is not configured correctly. Please try again later.' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: `You are a helpful assistant for Jomari Cos's portfolio.
Jomari is an AI Automation Developer & Student Innovator.
His skills: Python, JavaScript, HTML/CSS, SQL, Flask, Selenium, Playwright, Supabase, Make, Google Apps Script.
His projects: EduTrack (academic management), SMART SOFT COPY (grading automation), Photo Album Web App, Data Analysis internship at Digital Agile Ventures.
Be concise, professional, and enthusiastic. If unsure, say you can connect visitors with Jomari via the contact form.`,
    });

    // Map messages to Gemini contents format
    const contents = messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const result = await model.generateContent({ contents });
    const reply = result.response.text();

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Gemini API error:', error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}
