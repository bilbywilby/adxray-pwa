import { Hono } from "hono";
import { Env, getAppController, registerSession } from "./core-utils";
import OpenAI from "openai";
import { AD_ANALYST_PROMPT } from "../src/lib/agent-prompts";
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
  // Keeping existing chat routing for compatibility
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.post('/api/ad-analyze', async (c) => {
    try {
      const { imageB64 } = await c.req.json();
      if (!imageB64) return c.json({ success: false, error: 'No image data' }, 400);
      const openai = new OpenAI({
        baseURL: c.env.CF_AI_BASE_URL,
        apiKey: c.env.CF_AI_API_KEY,
      });
      const response = await openai.chat.completions.create({
        model: "google-ai-studio/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: AD_ANALYST_PROMPT },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${imageB64}` }
              }
            ]
          }
        ],
        max_tokens: 2000,
        response_format: { type: "json_object" }
      });
      const content = response.choices[0]?.message?.content || "{}";
      const sessionId = crypto.randomUUID();
      await registerSession(c.env, sessionId, `Scan ${new Date().toLocaleDateString()}`);
      return c.json({ success: true, data: JSON.parse(content) });
    } catch (error: any) {
      console.error('Vision API Error:', error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });
  app.get('/api/sessions', async (c) => {
    const controller = getAppController(c.env);
    const sessions = await controller.listSessions();
    return c.json({ success: true, data: sessions });
  });
}