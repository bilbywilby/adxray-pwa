# Cloudflare AI Chat Agent Template

[![Deploy to Cloudflare]([cloudflarebutton])](https://deploy.workers.cloudflare.com)

A production-ready template for building AI-powered chat applications using Cloudflare Workers, Durable Objects, and Agents SDK. Features multi-session conversations, tool calling (web search, weather, MCP integration), Cloudflare AI Gateway integration, and a modern React frontend with shadcn/ui.

## ✨ Features

- **Multi-Session Chat**: Persistent conversations stored in Durable Objects with session management (list, create, delete, rename).
- **AI Integration**: Seamless integration with Cloudflare AI Gateway (supports Gemini models out-of-the-box).
- **Tool Calling**: Built-in tools for web search (SerpAPI), weather, and extensible MCP (Model Context Protocol) server integration.
- **Streaming Responses**: Real-time streaming for natural chat experience.
- **Modern UI**: React 18 + TypeScript + Tailwind CSS + shadcn/ui components.
- **Session Management APIs**: RESTful endpoints for managing chats (`/api/sessions`).
- **Dark Mode & Responsive**: Full theming support with Tailwind v4.
- **Production-Ready**: CORS, error handling, logging, health checks, and Cloudflare Observability.

## 🛠 Tech Stack

- **Backend**: Cloudflare Workers, Hono, Agents SDK (`@cloudflare/agents`), Durable Objects, OpenAI SDK.
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Lucide React, TanStack Query.
- **AI**: Cloudflare AI Gateway, Gemini models (configurable).
- **Tools**: SerpAPI, MCP SDK.
- **Build Tools**: Bun, Wrangler, Vite.
- **UI Libraries**: Radix UI, Framer Motion, Sonner (toasts), Sidebar components.

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed.
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-update/) installed (`npm i -g wrangler`).
- Cloudflare account with Workers enabled.
- Cloudflare AI Gateway credentials (Account ID, Gateway ID, API Key).
- Optional: SerpAPI key for web search.

### Installation

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   bun install
   ```
3. Configure environment variables in `wrangler.jsonc`:
   ```json
   "vars": {
     "CF_AI_BASE_URL": "https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai",
     "CF_AI_API_KEY": "your-cloudflare-api-key",
     "SERPAPI_KEY": "your-serpapi-key" // Optional
   }
   ```
4. Generate Worker types:
   ```bash
   bun run cf-typegen
   ```

### Development

Start the development server:
```bash
bun dev
```

- Frontend: Available at `http://localhost:3000` (or `${PORT:-3000}`).
- Worker APIs: Automatically proxied (e.g., `/api/chat/:sessionId`).

Hot reload works for both frontend and Worker code.

### Production Build

```bash
bun run build
```

## 📖 Usage

### Chat Sessions

- **Create Session**: `POST /api/sessions` with `{ title, sessionId?, firstMessage }`.
- **List Sessions**: `GET /api/sessions`.
- **Delete Session**: `DELETE /api/sessions/:sessionId`.
- **Chat**: `POST /api/chat/:sessionId/chat` with `{ message, model?, stream? }`.
- **Get Messages**: `GET /api/chat/:sessionId/messages`.
- **Clear Chat**: `DELETE /api/chat/:sessionId/clear`.
- **Change Model**: `POST /api/chat/:sessionId/model` with `{ model }`.

Available models: `google-ai-studio/gemini-2.5-flash`, `google-ai-studio/gemini-2.5-pro`, etc.

### Tools

AI automatically calls tools like:
- `get_weather`: `{ location: "New York" }`.
- `web_search`: `{ query: "Cloudflare Workers" }` or `{ url: "https://example.com" }`.

Extend by adding MCP servers in `worker/mcp-client.ts`.

### Frontend Customization

- Edit `src/pages/HomePage.tsx` for main UI.
- Use `src/lib/chat.ts` for API integration.
- shadcn/ui components available in `src/components/ui/*`.

## ☁️ Deployment

1. Ensure `wrangler.jsonc` is configured.
2. Login to Cloudflare:
   ```bash
   wrangler login
   ```
3. Deploy:
   ```bash
   bun run deploy
   ```
   Or use the button: [![Deploy to Cloudflare]([cloudflarebutton])](https://deploy.workers.cloudflare.com)

- Assets served as SPA (single-page application).
- Durable Objects auto-migrate via `migrations`.
- Custom domain: `wrangler deploy --name your-app`.

**Environment Variables**: Set via Wrangler dashboard or CLI (`wrangler secret put SERPAPI_KEY`).

## 🤝 Contributing

1. Fork and create a PR.
2. Use `bun lint` before committing.
3. Test locally with `bun dev`.

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/)
- Issues: Open a GitHub issue.

Built with ❤️ for the Cloudflare developer community.