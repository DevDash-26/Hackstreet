# AI Assistant Architecture

> The AI Assistant (BR33) has a two-tier implementation:
>
> 1. **Live provider path** — the frontend calls `POST /api/v1/assistant`, which
>    the backend forwards to a configurable OpenAI-compatible chat-completions
>    endpoint. The API key stays server-side.
> 2. **Deterministic mock fallback** — when the backend has no key configured or is
>    unreachable, `frontend/src/services/ai.ts` classifies intent by keyword and
>    returns canned, role-aware answers.
>
> The UI (`features/assistant/assistant-widget.tsx`) never changes between the two.

## Goals

- Answer questions from university content stored in Supabase.
- Respect the caller's permissions — the assistant must never expose content the
  user cannot access.
- Cite sources for every retrieved claim.

## Frontend — `features/assistant` + `services/ai.ts`

```
features/assistant/
├── assistant-widget.tsx   Floating chat UI mounted in the portal shell + login
app/store/chat.ts          Persisted conversation store
services/ai.ts             askAssistant({ message, role, section }) — provider seam
```

`askAssistant` is the only integration point. It first attempts
`API_PREFIX + '/assistant'` with an 8s timeout; on any non-OK / failure it falls
back to a local keyword-matched answer after a short delay. The UI never holds an
LLM/provider key.

## Backend — `routes/ai.ts` + `services/ai-provider.ts`

```
src/
├── routes/ai.ts                  POST /assistant — validate body, stream to provider
└── services/
    ├── ai-provider.ts            OpenAI-compatible /chat/completions client (fetch)
    └── ai-prompt.ts              System prompt: role + portal features + campus floor map
```

### Request / response

```jsonc
POST /api/v1/assistant
{ "message": "wherez the libary", "role": "student", "section": "campus" }

200 { "reply": "The library is on the 1st floor…", "provider": "llama-3.3-70b-versatile", "configured": true }
503 { "error": "AI assistant is not configured on the server", "provider": "unconfigured" }  // no AI_API_KEY
502 { "error": "<provider message>", "provider": "unavailable" }                              // upstream failure
400 { "error": "Invalid request", "details": … }                                              // bad body
```

### Configuration (backend env)

| Variable           | Default                                   |
| ------------------ | ----------------------------------------- |
| `AI_API_KEY`       | `''` (empty → mock fallback)              |
| `AI_PROVIDER_URL`  | `https://api.groq.com/openai/v1`          |
| `AI_MODEL`         | `llama-3.3-70b-versatile` (Groq free tier)|
| `AI_TIMEOUT_MS`    | `15000`                                   |

Any OpenAI-compatible base URL works (Groq, OpenAI, Google Gemini in OpenAI mode,
Ollama, LM Studio…). System prompt grounds the model in the portal feature list
and the University College Sri Lanka floor map, so misspelled free-text questions
still get in-context replies.

## Backend — planned `ai` module (retrieval + citations)

```
ai/
├── ai.controller.ts
├── ai.routes.ts
├── ai.service.ts
├── ai.types.ts
├── ai.prompts.ts
├── retrieval.service.ts
└── citation.service.ts
```

### Pipeline

1. `ai.controller` receives a question + auth token.
2. `ai.service` determines the actor's role/permissions (reusing the actor data
   layer) and builds a permission-scoped retrieval query.
3. `retrieval.service` fetches candidate content from Supabase (content, FAQ,
   announcements, events, documents in Supabase Storage via pgvector embeddings)
   restricted by the caller's access level.
4. `ai.prompts` compiles the system prompt with the retrieved context.
5. Citation data flows back through `citation.service`, which attaches the source
   rows to each generated claim.

### Permissions

- Retrieval is filtered by the same RBAC model as the rest of the portal.
- No content the user cannot read is ever included in the prompt context.
- RLS remains enabled; the AI pipeline runs with service-role access but applies a
  permission filter explicitly.

### Key management

- Provider keys (e.g. OpenAI/Anthropic) live in the backend environment only —
  never in the frontend or client bundles.
