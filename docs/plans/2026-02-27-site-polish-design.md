# Drishya — Site Polish Design
**Date:** 2026-02-27

## Scope
Six targeted changes to the existing single-page site.

## 1. Navbar Font +20%
- Desktop nav links currently use `.label` class (`font-size: 0.65rem`)
- Override to `0.78rem` on the nav `<a>` elements only (not global label class)
- CTA button in navbar gets same treatment
- Mobile drawer items already use `text-2xl` — leave unchanged

## 2. Fix Broken Links
- Footer "Portfolio" anchor: `#portfolio` → `#gallery` (section uses `id="gallery"`)
- Footer Privacy Policy: `href="#"` → triggers PrivacyModal
- Footer Terms of Service: `href="#"` → triggers TermsModal

## 3. Gallery — Hover-Video Structure
**Default state:** static poster image (architectural placeholder via picsum.photos, seeded per project)
**Hover state:** `<video autoPlay muted loop playsInline>` fades in over the poster
- Video src set to `/videos/{project-id}.mp4` with a clear `{/* swap: real splat recording */}` comment
- `<video>` element only renders if the browser is not on a touch device (no hover on mobile — poster stays)
- Graceful degradation: if video file is absent the poster stays visible (no broken element)
- Video `poster` attribute set to the same placeholder image URL
- Structure ready for when real splat screen-recordings are dropped into `public/videos/`

## 4. Stats Strip
- Thin strip between Hero and Services
- Data already in `en.json`: `25+ Properties`, `20+ Clients`, `3 Cities`
- Three columns, minimal typographic treatment, `var(--bg-2)` background
- Animated count-up on scroll-into-view (framer-motion viewport trigger)

## 5. Privacy Policy Modal
- Triggered by Footer "Privacy Policy" link
- Full-screen overlay, slide-up animation (framer-motion)
- Close on ✕ button, Escape key, or backdrop click
- Content: data collected, usage, WhatsApp third-party, retention, contact
- Content in `en.json` under `privacy.*` keys (not hardcoded)

## 6. Terms of Service Modal
- Same modal pattern as Privacy
- Triggered by Footer "Terms of Service" link
- Content: service scope, payment, revisions, hosting, cancellation, liability
- Content in `en.json` under `terms.*` keys

## Files Affected
- `src/components/layout/Navbar.jsx` — font size
- `src/components/layout/Footer.jsx` — fix links, add modal triggers
- `src/components/sections/Gallery.jsx` — hover-video structure + picsum posters
- `src/components/sections/Stats.jsx` — new component
- `src/components/ui/LegalModal.jsx` — new shared modal (Privacy + Terms use same shell)
- `src/App.jsx` — add Stats, add modal state + LegalModal instances
- `src/i18n/locales/en.json` — add privacy.*, terms.*, stats already present
- `src/i18n/locales/te.json` — mirror additions
- `src/i18n/locales/hi.json` — mirror additions (if exists)

## Out of Scope
- React Router (modals cover Privacy/Terms without routing)
- Real property images or splat files (placeholders only)
- Portfolio.jsx (unused, leave as-is)
