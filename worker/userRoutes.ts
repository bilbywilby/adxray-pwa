import { Hono } from "hono";
import { Env, registerSession } from "./core-utils";
import OpenAI from "openai";
import { getExtractionPrompt } from "../src/lib/pdf-schema";
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
  // Existing core routes...
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.post('/api/extract-fields', async (c) => {
    try {
      const { rawText } = await c.req.json();
      if (!rawText) return c.json({ success: false, error: 'No document text received' }, 400);
      const openai = new OpenAI({
        baseURL: c.env.CF_AI_BASE_URL,
        apiKey: c.env.CF_AI_API_KEY,
      });
      const response = await openai.chat.completions.create({
        model: "google-ai-studio/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a high-performance document extraction agent. Extract structured data into JSON precisely as requested. No conversational filler."
          },
          {
            role: "user",
            content: `${getExtractionPrompt()}\n\nDOCUMENT TEXT:\n${rawText}`
          }
        ],
        max_tokens: 3000,
        response_format: { type: "json_object" }
      });
      const content = response.choices[0]?.message?.content || "{}";
      const sessionId = crypto.randomUUID();
      await registerSession(c.env, sessionId, `Extraction ${new Date().toLocaleDateString()}`);
      return c.json({ 
        success: true, 
        data: JSON.parse(content) 
      });
    } catch (error: any) {
      console.error('Extraction API Error:', error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });
  // Keep existing routes
  app.get('/api/sessions', async (c) => {
    // Session listing logic...
    return c.json({ success: true, data: [] });
  });
}