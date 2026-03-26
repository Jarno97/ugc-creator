# UGC Creator — Build spec

React + Vite + Tailwind CSS single-page app. No router, no backend, no auth.

---

## What it does

User provides a product image URL + description → app calls an n8n webhook → waits 2-4 min → gets back AI-generated "influencer holding product" UGC photos.

## n8n webhook contract

```
POST {VITE_N8N_WEBHOOK_URL}
Content-Type: application/json

{
  "productUrl": "https://...",
  "productDescription": "...",
  "influencerStyle": "auto" | "gen-z" | "fitness" | "tech" | "luxury" | "professional"
}
```

Response (arrives after 2-4 min — single long-running request):

```json
{
  "success": true,
  "ugcImage": "https://...",
  "characterImage": "https://...",
  "characterSheet": "https://..."
}
```

Or `{ "success": false, "error": "..." }` on failure.

---

## Screen flow

```
idle → configuring → generating → complete
 ↑         ↑                         |
 |         └─── (back) ──────────────|
 └──────── (reset) ──────────────────┘
```

Plus an `error` screen reachable from `generating`.

### 1. InputScreen (`idle`)

- Centered card, max-w-xl
- Text input: product image URL. On valid URL, show `<img>` preview thumbnail below it (handle `onError`)
- Textarea: product description (max 500 chars, show counter)
- "Continue" button — disabled until both fields filled and image preview loaded
- Optional: drag-and-drop image upload via imgbb API (`POST https://api.imgbb.com/1/upload?key={VITE_IMGBB_API_KEY}`, send base64 as form field `image`, use returned `data.url`)

### 2. ConfigScreen (`configuring`)

- Back arrow → return to idle (preserve inputs)
- Grid of 6 selectable style cards (1 col mobile, 2 sm, 3 md):

| id | name | description |
|----|------|-------------|
| auto | Auto-detect | Let AI pick the best match |
| gen-z | Gen-Z lifestyle | Trendy, casual, social-first |
| fitness | Fitness & wellness | Athletic, health-focused |
| tech | Tech reviewer | Gadget-savvy, analytical |
| luxury | Luxury & premium | Refined, aspirational |
| professional | Professional | Corporate, trustworthy |

- Single-select, defaults to `auto`, visual highlight on selected card
- "Generate" button fires webhook and transitions to generating

### 3. GeneratingScreen (`generating`)

This is the critical UX screen — user waits 2-4 minutes.

- No back/cancel button
- Small product thumbnail as reminder
- **3-step vertical progress stepper** with simulated timing:
  - Step 1: "Designing your influencer" (~45s)
  - Step 2: "Building character reference" (~60s)
  - Step 3: "Creating UGC photo" (~60s)
  - Active step: animated spinner/pulse. Completed: green check. Future: grayed out.
- Rotating fun tips below stepper (swap every 10s with fade transition)
- **Critical edge case**: if webhook responds before timer finishes → jump to result immediately. If timer finishes but webhook hasn't responded → keep step 3 spinning (never show fake completion).

### 4. ResultScreen (`complete`)

- Hero image: final UGC photo, large, centered (max-w-lg), click opens full-size
- Row of smaller clickable thumbnails: character photo + character sheet (click swaps into hero)
- Buttons: "Download" (fetch as blob → create `<a download>`), "Regenerate" (same inputs, new run), "Start over" (full reset)
- Metadata line: "Generated in Xs"

### 5. ErrorScreen (`error`)

- Error message from webhook or generic fallback
- "Try again" (retry same inputs) + "Start over" (reset)

---

## Architecture

State management with `useReducer` at the App level. Actions: `SET_INPUT`, `GO_TO_CONFIG`, `GO_TO_IDLE`, `SET_STYLE`, `START_GENERATION`, `GENERATION_COMPLETE`, `GENERATION_ERROR`, `RESET`. Screens rendered conditionally based on `state.screen`.

The webhook call lives in a separate `api/webhook.js` module. Use `AbortController` with a 5-minute timeout. The `handleGenerate` function dispatches `START_GENERATION`, awaits the webhook, then dispatches either `GENERATION_COMPLETE` or `GENERATION_ERROR`.

Progress simulation lives in a custom `useGenerationTimer` hook — interval-based, tracks `currentStage` (0-2) and `stageProgress` (0-1).

## Env vars

```
VITE_N8N_WEBHOOK_URL=...
VITE_IMGBB_API_KEY=...
VITE_MOCK_MODE=true|false
```

When `VITE_MOCK_MODE=true`, the webhook function should skip the real call, wait ~8 seconds, and return placeholder images (use picsum.photos or similar).

## Design

Clean, modern, spacious. Light gray page bg, white cards, indigo-600 accent. System font stack. Rounded-xl cards, rounded-lg buttons. Subtle shadows. Mobile-first responsive. Simple fade transitions between screens. Result image gets a satisfying scale-in reveal.

## Out of scope

No auth, no database, no batch mode, no image editor, no backend proxy, no modifications to the n8n workflow.
