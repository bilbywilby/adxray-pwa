import { Hono } from "hono";
import { Env, getAppController } from "./core-utils";
import OpenAI from "openai";
import { AD_ANALYST_PROMPT } from "../src/lib/agent-prompts";
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/sessions', async (c) => {
    const controller = getAppController(c.env);
    const sessions = await controller.listSessions();
    return c.json({ success: true, data: sessions });
  });
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.post('/api/analyze-ad', async (c) => {
    try {
      const { image, apiKey } = await c.req.json();
      if (!image) return c.json({ success: false, error: 'NO_IMAGE_DATA' }, 400);
      // Use the provided user API key or fallback to environment key
      const client = new OpenAI({
        baseURL: c.env.CF_AI_BASE_URL,
        apiKey: apiKey || c.env.CF_AI_API_KEY,
      });
      const response = await client.chat.completions.create({
        model: "google-ai-studio/gemini-2.5-flash",
        messages: [
          { role: "system", content: AD_ANALYST_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this advertisement." },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${image}` } }
            ]
          }
        ],
        response_format: { type: "json_object" }
      });
      const content = response.choices[0]?.message?.content || "{}";
      return c.json({ success: true, data: JSON.parse(content) });
    } catch (error: any) {
      console.error('Vision API Error:', error);
      return c.json({ success: false, error: error.message || 'AI_ANALYSIS_FAILED' }, 500);
    }
  });
}