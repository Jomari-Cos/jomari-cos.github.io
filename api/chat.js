import { OpenAI } from 'openai';

// Initialize OpenAI with API key from environment variable
const openai = new OpenAI({
  apiKey: process.env.chatbot_portfolio,
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if API key is configured
  if (!process.env.chatbot_portfolio) {
    console.error('OpenAI API key is not set. Please set the chatbot_portfolio environment variable.');
    return res.status(500).json({ error: 'Server is not configured correctly. Please try again later.' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Add system prompt for context
    const systemPrompt = {
      role: 'system',
      content: `You are a helpful assistant for Jomari Cos's portfolio.
      Jomari is an AI Automation Developer & Student Innovator.
      His skills: Python, JavaScript, HTML/CSS, SQL, Flask, Selenium, Playwright, Supabase, Make, Google Apps Script.
      His projects: EduTrack (academic management), SMART SOFT COPY (grading automation), Photo Album Web App, Data Analysis internship at Digital Agile Ventures.
      Be concise, professional, and enthusiastic. If unsure, say you can connect visitors with Jomari via the contact form.`
    };

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [systemPrompt, ...messages],
      max_tokens: 512,
    });

    const reply = completion.choices[0].message.content;

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}