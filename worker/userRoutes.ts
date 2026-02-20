import { Hono } from "hono";
import { Env, registerSession, getAppController } from "./core-utils";
import OpenAI from "openai";
import { getExtractionPrompt } from "../src/lib/pdf-schema";
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/sessions', async (c) => {
    try {
      const controller = getAppController(c.env);
      const sessions = await controller.listSessions();
      return c.json({ success: true, data: sessions });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  });
  app.delete('/api/sessions/:id', async (c) => {
    try {
      const id = c.req.param('id');
      const controller = getAppController(c.env);
      const success = await controller.removeSession(id);
      return c.json({ success });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  });
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
      const prompt = getExtractionPrompt();
      const response = await openai.chat.completions.create({
        model: "google-ai-studio/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a high-performance document extraction agent. Extract structured data into JSON precisely as requested. Use a cynical, detective-like tone in text summaries. Output ONLY raw JSON."
          },
          {
            role: "user",
            content: `${prompt}\n\nDOCUMENT TEXT SOURCE:\n${rawText}`
          }
        ],
        max_tokens: 4000,
        response_format: { type: "json_object" }
      });
      const content = response.choices[0]?.message?.content || "{}";
      const parsedData = JSON.parse(content);
      const sessionId = crypto.randomUUID();
      const title = parsedData.applicantName || parsedData.policyNumber || `Extraction ${new Date().toLocaleDateString()}`;
      await registerSession(c.env, sessionId, title);
      return c.json({
        success: true,
        data: parsedData
      });
    } catch (error: any) {
      console.error('Extraction API Error:', error);
      return c.json({ success: false, error: `EXTRACTION_ENGINE_ERROR: ${error.message}` }, 500);
    }
  });
}