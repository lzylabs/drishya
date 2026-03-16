# Drishyam — Session Log & Handoff

## Live
- URL: https://drishya-vercel.vercel.app
- GitHub: github.com/lzylabs/drishya
- Vercel project: `drishya-vercel` (lzylabs-projects)

---

## Session: 2026-03-16 (Session 2)

### Done this session
- [x] **Product pivot** — reframed entire pitch: "Film your flat with your phone → get a 3D tour back in 48 hours"
- [x] **Website copy overhaul** (`src/i18n/locales/en.json`):
  - Brand tagline: "Film it. We build it."
  - Hero: "Film your flat. Get a 3D tour back." + phone → 48hr pitch
  - Process: "You Film → You Send → We Build → You Share" (replaced "We Visit")
  - Services: 3DGS-first framing, all three cards updated
  - FAQ: New Q1 = "Do I need special equipment?" (answer: any phone)
  - Footer + contact subtitle updated
- [x] **WhatsApp number set**: `+91 89856 21250` in `WhatsAppButton.jsx` + all 3 locales (EN/HI/TE)
- [x] **Gyroscope — Android**: DeviceOrientationAbsolute + DeviceOrientation dual listener, lerp smoothing, touch-drag fallback. **Confirmed working.**
- [x] **Gyroscope — iOS**: "Enable tilt" button (top-right, appears on iOS only, disappears after permission granted)
- [x] **ViewerControls mobile**: compact horizontal scrollable strip + "Tune" pill toggle (was a large vertical panel)
- [x] **Hero text visibility**: stronger vignette (0.65 center opacity) + frosted glass backdrop on text block
- [x] **Outreach lists built**:
  - `docs/guntur-outreach-leads.md` — 26 curated leads with scripts
  - `docs/outreach-master-list.md` — 102 leads across Guntur/Vijayawada/Amaravati with phones

---

## 🔴 Priority Next Session

### 1. Hero text — confirm visibility on phone
- Check https://drishya-vercel.vercel.app on phone after hard-refresh
- "Drishya" should be clearly readable over the splat
- If still invisible: increase `rgba(0,0,0,X)` in the text block backdrop in `HeroSection.jsx` line ~188

### 2. Outreach — start sending
- **Easiest first**: Instagram DM to `@gunturpropertiess` (62K) and `@sweethomeproperties9` (Kalyan Ram)
- **Script**: "Hey! We do 3D property walkthroughs built from a phone video — 48 hours, no camera crew. Offering one free 3D tour for any active listing. Your buyers can explore it on any device. Want to try?"
- **High-priority phones** (WhatsApp voice note): Siribhoomi +91 7999555666, Sun Siri +91 9934121212, Pioneer Realtors 9848133033
- Full list: `docs/outreach-master-list.md`

### 3. Site polish backlog (unchanged)
| # | Task | Status |
|---|------|--------|
| 1 | i18n keys — privacy + terms (EN/TE/HI) | ⬜ pending |
| 2 | Navbar font size +20% | ⬜ pending |
| 3 | Zustand store — add legalModal state | ⬜ pending |
| 4 | LegalModal component (slide-up overlay) | ⬜ pending |
| 5 | Wire LegalModal into App + Footer | ⬜ pending |
| 6 | Stats strip (25+ properties, 20+ clients, 3 cities) | ⬜ pending |
| 7 | Gallery hover-video structure | ⬜ pending |
| 8 | Final build + smoke test | ⬜ pending |

### 4. Splat comparison (still pending from session 1)
- Locally swap `VITE_SPLAT_URL=/splat/iskcon-temple.splat` in `.env.local`
- Run `npm run dev` → compare with `iskcon-cleaned.splat`
- If temple looks better: commit it, update Vercel env var, redeploy

---

## Key Files
| File | What it does |
|------|-------------|
| `src/components/hero/HeroSection.jsx` | Hero layout, gyroscope logic, text overlay |
| `src/components/hero/CameraController.jsx` | Three.js camera orbit (reads mouseRef) |
| `src/components/hero/ViewerControls.jsx` | Slider panel — mobile horizontal, desktop vertical |
| `src/components/ui/WhatsAppButton.jsx` | WhatsApp number (`WHATSAPP_NUMBER`) + link builder |
| `src/i18n/locales/en.json` | All English copy |
| `docs/outreach-master-list.md` | 102 real estate leads with phones |
| `docs/guntur-outreach-leads.md` | 26 curated leads + outreach scripts |

## Splat Files
| File | Size | Status |
|------|------|--------|
| `public/splat/iskcon-cleaned.splat` | 17MB | ✅ in repo, live on Vercel |
| `public/splat/iskcon-temple.splat` | 17MB | git-ignored (local only) |
| `public/splat/krishna-chariot.splat` | 40MB | git-ignored (local only) |

## Dev Commands
```bash
npm run dev        # localhost:5173
npm run build      # production build
npm run preview    # preview build at localhost:4173
```
