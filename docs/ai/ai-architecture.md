# AI Assistant Architecture

> The AI Assistant (BR33) is implemented as a **deterministic mock** today:
> `frontend/src/services/ai.ts` classifies intent by keyword and returns canned,
> role-aware answers through `features/assistant/assistant-widget.tsx`. This
> document records that shape plus the intended hosted architecture so a real
> provider can be dropped in without UI changes.

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

`askAssistant` is the only integration point. It currently resolves after a short
delay with a keyword-matched answer and role-aware suggestions. To use a real
provider, replace the function body with a call to a backend AI endpoint using the
user's access token — the UI never holds an LLM/provider key.

## Backend — planned `ai` module

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
