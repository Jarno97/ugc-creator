# UGC Creator — Progress

## Status: In progress

---

## Completed

- [x] Project setup (Vite + React + Tailwind CSS v4)
- [x] GitHub repo created: https://github.com/Jarno97/ugc-creator
- [x] State machine with `useReducer` (idle → configuring → generating → complete → error)
- [x] InputScreen — product URL input, image preview, drag & drop upload via imgbb
- [x] ConfigScreen — 6 influencer style cards (auto, gen-z, fitness, tech, luxury, professional)
- [x] GeneratingScreen — 3-step progress stepper with real-time progress bars, rotating tips
- [x] ResultScreen — hero image, thumbnails, lightbox, download button, regenerate
- [x] ErrorScreen — retry + start over
- [x] n8n webhook integration with AbortController (5-min timeout)
- [x] Mock mode (`VITE_MOCK_MODE=true`) for testing without n8n
- [x] Deployed to Vercel

---

## Backlog

### Features
- [ ] Style preview images on ConfigScreen (show example UGC per style)
- [ ] Share button — copy image link or open native share sheet
- [ ] History — save past generations to localStorage, accessible via a sidebar or modal
- [ ] Multiple images — request a batch of 3-4 variants in one generation
- [ ] Caption generator — AI-generated social media captions for the UGC photo
- [ ] Platform presets — crop/resize output for Instagram, TikTok, etc.

### UX / Polish
- [ ] Smooth fade transitions between screens
- [ ] Mobile layout QA pass
- [ ] Better empty state when imgbb key is missing (hide upload zone gracefully)
- [ ] Toast notification on successful download

### Infrastructure
- [ ] Custom domain
- [ ] Error monitoring (Sentry or similar)
