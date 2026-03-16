# Site Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix broken links, increase nav font 20%, add gallery hover-video structure, stats strip, and Privacy/Terms modals.

**Architecture:** Single-page scroll site (no router). All sections are lazy-loaded in App.jsx. Modals managed via Zustand store. Gallery tiles get a `<video>` overlay that plays on hover, with picsum.photos poster images as placeholders. Stats strip is a new section inserted between Hero and Services.

**Tech Stack:** React 18, Vite 5, Framer Motion 11, react-i18next, Zustand 4, Tailwind CSS 3.4, CSS custom properties for theming.

---

### Task 1: i18n — add stats, privacy, and terms keys

**Files:**
- Modify: `src/i18n/locales/en.json`
- Modify: `src/i18n/locales/te.json`
- Modify: `src/i18n/locales/hi.json`

**Step 1: Add to `en.json`** (stats keys already exist — add privacy + terms)

Add after the `"footer"` block:

```json
  "privacy": {
    "title": "Privacy Policy",
    "updated": "Last updated: January 2025",
    "s1_title": "Information We Collect",
    "s1_body": "When you fill in our contact form, we collect your name, WhatsApp number, city, and property details. This information is submitted directly to us via WhatsApp and is not stored on our servers.",
    "s2_title": "How We Use It",
    "s2_body": "Your details are used solely to respond to your enquiry, provide quotes, and deliver the services you request. We do not sell, rent, or share your information with third parties.",
    "s3_title": "WhatsApp",
    "s3_body": "Our contact form opens WhatsApp with your details pre-filled. By submitting, you consent to this message being sent via WhatsApp (Meta Platforms, Inc.). WhatsApp's own privacy policy applies to messages sent on their platform.",
    "s4_title": "Cookies",
    "s4_body": "We use only essential browser storage (localStorage) to remember your theme and language preference. No tracking cookies, no analytics.",
    "s5_title": "Contact",
    "s5_body": "For any privacy questions, message us on WhatsApp or email us at hello@drishyam.in"
  },
  "terms": {
    "title": "Terms of Service",
    "updated": "Last updated: January 2025",
    "s1_title": "Services",
    "s1_body": "Drishya provides 3D virtual tours, VR experiences, and cinematic video production for real estate properties. All services are subject to a written agreement or WhatsApp confirmation before work begins.",
    "s2_title": "Payment",
    "s2_body": "50% advance payment is required before the capture visit. The remaining 50% is due before delivery of final assets. All prices are in INR. Custom projects require a signed scope document.",
    "s3_title": "Revisions",
    "s3_body": "Sparsha package includes 1 revision. Darshana and Sampurna packages include unlimited revisions within 30 days of delivery. Revisions are changes to colour grading, framing, or labels — not re-captures.",
    "s4_title": "Hosting",
    "s4_body": "Hosted links are active for the period specified in your package. After expiry, assets are archived for 60 days before deletion. Extended hosting is available at ₹3,000/year.",
    "s5_title": "Cancellation",
    "s5_body": "Cancellations before the capture visit receive a full refund of the advance. Cancellations after the visit forfeit the advance payment. Completed work is non-refundable.",
    "s6_title": "Limitation of Liability",
    "s6_body": "Drishya is not liable for delays caused by property access issues, adverse weather, or client unavailability. Our total liability is limited to the amount paid for the specific project."
  }
```

**Step 2: Add matching keys to `te.json`**

```json
  "privacy": {
    "title": "గోప్యతా విధానం",
    "updated": "చివరిగా నవీకరించబడింది: జనవరి 2025",
    "s1_title": "మేము సేకరించే సమాచారం",
    "s1_body": "మీరు మా సంప్రదింపు ఫారమ్ పూరించినప్పుడు, మేము మీ పేరు, WhatsApp నంబర్, నగరం మరియు ఆస్తి వివరాలను సేకరిస్తాం. ఈ సమాచారం నేరుగా WhatsApp ద్వారా మాకు పంపబడుతుంది మరియు మా సర్వర్‌లలో నిల్వ చేయబడదు.",
    "s2_title": "మేము దాన్ని ఎలా ఉపయోగిస్తాం",
    "s2_body": "మీ వివరాలు మీ విచారణకు స్పందించడానికి మాత్రమే ఉపయోగించబడతాయి. మేము మీ సమాచారాన్ని మూడవ పక్షాలకు విక్రయించము లేదా పంచుకోము.",
    "s3_title": "WhatsApp",
    "s3_body": "మా సంప్రదింపు ఫారమ్ మీ వివరాలతో WhatsApp తెరుస్తుంది. సమర్పించడం ద్వారా, మీరు WhatsApp ద్వారా ఈ సందేశం పంపబడటానికి అంగీకరిస్తున్నారు.",
    "s4_title": "కుకీలు",
    "s4_body": "మేము మీ థీమ్ మరియు భాషా ప్రాధాన్యతను గుర్తుంచుకోవడానికి మాత్రమే localStorage ఉపయోగిస్తాం. ట్రాకింగ్ కుకీలు లేవు.",
    "s5_title": "సంప్రదింపు",
    "s5_body": "గోప్యతా ప్రశ్నల కోసం, WhatsApp లో లేదా hello@drishyam.in కు మెయిల్ చేయండి"
  },
  "terms": {
    "title": "సేవా నిబంధనలు",
    "updated": "చివరిగా నవీకరించబడింది: జనవరి 2025",
    "s1_title": "సేవలు",
    "s1_body": "దృశ్య రియల్ ఎస్టేట్ కోసం 3D వర్చువల్ టూర్లు, VR అనుభవాలు మరియు సినిమాటిక్ వీడియో నిర్మాణం అందిస్తుంది.",
    "s2_title": "చెల్లింపు",
    "s2_body": "క్యాప్చర్ విజిట్ కు ముందు 50% అడ్వాన్స్ అవసరం. మిగిలిన 50% డెలివరీకి ముందు చెల్లించాలి.",
    "s3_title": "సవరణలు",
    "s3_body": "స్పర్శ ప్యాకేజీలో 1 సవరణ ఉంటుంది. దర్శన మరియు సంపూర్ణ ప్యాకేజీలలో డెలివరీ నుండి 30 రోజులలో అపరిమిత సవరణలు ఉన్నాయి.",
    "s4_title": "హోస్టింగ్",
    "s4_body": "హోస్ట్ చేయబడిన లింక్‌లు మీ ప్యాకేజీలో పేర్కొన్న వ్యవధికి చురుకుగా ఉంటాయి.",
    "s5_title": "రద్దు",
    "s5_body": "క్యాప్చర్ విజిట్ కు ముందు రద్దులు పూర్తి రీఫండ్ పొందుతాయి. విజిట్ తర్వాత రద్దులు అడ్వాన్స్ చెల్లింపు కోల్పోతాయి.",
    "s6_title": "బాధ్యత పరిమితి",
    "s6_body": "ఆస్తి యాక్సెస్ సమస్యలు లేదా వాతావరణం వల్ల జాప్యాలకు దృశ్య బాధ్యత వహించదు."
  }
```

**Step 3: Add matching keys to `hi.json`**

```json
  "privacy": {
    "title": "गोपनीयता नीति",
    "updated": "अंतिम अपडेट: जनवरी 2025",
    "s1_title": "हम क्या जानकारी एकत्र करते हैं",
    "s1_body": "जब आप हमारा संपर्क फ़ॉर्म भरते हैं, तो हम आपका नाम, WhatsApp नंबर, शहर और संपत्ति विवरण एकत्र करते हैं। यह जानकारी सीधे WhatsApp के माध्यम से हमें भेजी जाती है और हमारे सर्वर पर संग्रहीत नहीं होती।",
    "s2_title": "हम इसका उपयोग कैसे करते हैं",
    "s2_body": "आपके विवरण का उपयोग केवल आपकी जांच का जवाब देने के लिए किया जाता है। हम आपकी जानकारी किसी तीसरे पक्ष को नहीं बेचते।",
    "s3_title": "WhatsApp",
    "s3_body": "हमारा संपर्क फ़ॉर्म आपके विवरण के साथ WhatsApp खोलता है। सबमिट करके, आप WhatsApp के माध्यम से यह संदेश भेजने की सहमति देते हैं।",
    "s4_title": "कुकीज़",
    "s4_body": "हम केवल आपकी थीम और भाषा प्राथमिकता याद रखने के लिए localStorage का उपयोग करते हैं। कोई ट्रैकिंग कुकीज़ नहीं।",
    "s5_title": "संपर्क",
    "s5_body": "किसी भी गोपनीयता प्रश्न के लिए, WhatsApp पर या hello@drishyam.in पर ईमेल करें।"
  },
  "terms": {
    "title": "सेवा की शर्तें",
    "updated": "अंतिम अपडेट: जनवरी 2025",
    "s1_title": "सेवाएं",
    "s1_body": "दृश्य रियल एस्टेट संपत्तियों के लिए 3D वर्चुअल टूर, VR अनुभव और सिनेमाई वीडियो उत्पादन प्रदान करता है।",
    "s2_title": "भुगतान",
    "s2_body": "कैप्चर विज़िट से पहले 50% अग्रिम भुगतान आवश्यक है। शेष 50% डिलीवरी से पहले देय है।",
    "s3_title": "संशोधन",
    "s3_body": "स्पर्श पैकेज में 1 संशोधन शामिल है। दर्शन और संपूर्ण पैकेज में डिलीवरी के 30 दिनों के भीतर असीमित संशोधन शामिल हैं।",
    "s4_title": "होस्टिंग",
    "s4_body": "होस्ट किए गए लिंक आपके पैकेज में निर्दिष्ट अवधि के लिए सक्रिय रहते हैं।",
    "s5_title": "रद्दीकरण",
    "s5_body": "कैप्चर विज़िट से पहले रद्दीकरण पर पूर्ण वापसी होती है। विज़िट के बाद रद्दीकरण पर अग्रिम भुगतान जब्त होता है।",
    "s6_title": "देयता की सीमा",
    "s6_body": "संपत्ति पहुंच समस्याओं या मौसम के कारण देरी के लिए दृश्य उत्तरदायी नहीं है।"
  }
```

**Step 4: Verify build**
```bash
cd /d/Claude\ Code/3dgs_realestate && npm run build 2>&1 | tail -5
```
Expected: clean build, no errors.

**Step 5: Commit**
```bash
git add src/i18n/locales/
git commit -m "feat: add privacy and terms i18n keys (EN/TE/HI)"
```

---

### Task 2: Navbar font size +20%

**Files:**
- Modify: `src/components/layout/Navbar.jsx`

**Step 1: Locate the desktop nav links** (line 48–56)
The `<a>` elements use `className="label ..."`. The `.label` class has `font-size: 0.65rem`. 20% larger = `0.78rem`.

**Step 2: Add `text-[0.78rem]` to desktop nav `<a>` elements**

Find:
```jsx
className="label text-[var(--text-2)] hover:text-[var(--text)] transition-colors"
```
Replace with:
```jsx
className="label text-[0.78rem] text-[var(--text-2)] hover:text-[var(--text)] transition-colors"
```

**Step 3: Add same override to the CTA "Get Started" link** (line 63–68)

Find:
```jsx
className="hidden md:block label text-[var(--text)] hover:text-[var(--text-2)] transition-colors pb-px border-b border-[var(--line-2)] hover:border-[var(--text-2)]"
```
Replace with:
```jsx
className="hidden md:block label text-[0.78rem] text-[var(--text)] hover:text-[var(--text-2)] transition-colors pb-px border-b border-[var(--line-2)] hover:border-[var(--text-2)]"
```

**Step 4: Verify in browser** — nav labels should feel slightly larger but still compact.

**Step 5: Commit**
```bash
git add src/components/layout/Navbar.jsx
git commit -m "style: increase navbar link font 20% (0.65rem → 0.78rem)"
```

---

### Task 3: Zustand store — add modal state

**Files:**
- Modify: `src/store/useStore.js`

**Step 1: Read current store**
```bash
cat src/store/useStore.js
```

**Step 2: Add `legalModal` state** — `null | 'privacy' | 'terms'`

Add to the store object:
```js
legalModal: null,
setLegalModal: (modal) => set({ legalModal: modal }),
```

**Step 3: Commit**
```bash
git add src/store/useStore.js
git commit -m "feat: add legalModal state to store"
```

---

### Task 4: LegalModal component

**Files:**
- Create: `src/components/ui/LegalModal.jsx`

**Step 1: Create the component**

```jsx
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import useStore from '../../store/useStore.js'

/* Sections config per modal type */
const SECTIONS = {
  privacy: ['s1','s2','s3','s4','s5'],
  terms:   ['s1','s2','s3','s4','s5','s6'],
}

export default function LegalModal() {
  const { legalModal, setLegalModal } = useStore()
  const { t } = useTranslation()
  const isOpen = legalModal !== null
  const type   = legalModal  // 'privacy' | 'terms' | null

  /* Close on Escape */
  useEffect(() => {
    if (!isOpen) return
    const fn = (e) => { if (e.key === 'Escape') setLegalModal(null) }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [isOpen, setLegalModal])

  /* Lock body scroll while open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && type && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLegalModal(null)}
          />

          {/* Panel — slides up from bottom */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[90] bg-[var(--bg-2)] max-h-[90dvh] overflow-y-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 40 }}
            role="dialog"
            aria-modal="true"
            aria-label={t(`${type}.title`)}
          >
            {/* Header */}
            <div className="sticky top-0 bg-[var(--bg-2)] border-b border-[var(--line)] px-6 sm:px-10 py-5 flex items-center justify-between z-10">
              <div>
                <p className="label text-[var(--text-3)]">Legal</p>
                <h2 className="font-display font-light text-2xl text-[var(--text)] mt-0.5">
                  {t(`${type}.title`)}
                </h2>
              </div>
              <button
                onClick={() => setLegalModal(null)}
                className="label text-[var(--text-3)] hover:text-[var(--text)] transition-colors p-2"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="px-6 sm:px-10 py-10 max-w-2xl">
              <p className="label text-[var(--text-3)] mb-10">{t(`${type}.updated`)}</p>

              {SECTIONS[type].map((s) => (
                <div key={s} className="mb-8">
                  <h3 className="font-display font-light text-lg text-[var(--text)] mb-3">
                    {t(`${type}.${s}_title`)}
                  </h3>
                  <p className="text-sm text-[var(--text-2)] font-light leading-relaxed">
                    {t(`${type}.${s}_body`)}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

**Step 2: Commit**
```bash
git add src/components/ui/LegalModal.jsx
git commit -m "feat: LegalModal slide-up overlay for privacy/terms"
```

---

### Task 5: Wire LegalModal into App + Footer

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/layout/Footer.jsx`

**Step 1: Import and render LegalModal in App.jsx**

Add import at top:
```jsx
import LegalModal from './components/ui/LegalModal.jsx'
```

Add before closing `</div>` (after `<WhatsAppButton />`):
```jsx
<LegalModal />
```

**Step 2: Fix Footer links**

In `src/components/layout/Footer.jsx`:

Add import:
```jsx
import useStore from '../../store/useStore.js'
```

Inside the component, destructure:
```jsx
const { setLegalModal } = useStore()
```

Fix the footer Company "Portfolio" link — find:
```jsx
[['nav.portfolio','#portfolio'],['nav.process','#process'],['nav.pricing','#pricing'],['nav.contact','#contact']]
```
Replace with:
```jsx
[['nav.portfolio','#gallery'],['nav.process','#process'],['nav.pricing','#pricing'],['nav.contact','#contact']]
```

Replace the Privacy and Terms `<a href="#">` links — find:
```jsx
<a href="#" className="text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors font-light">{t('footer.privacy')}</a>
<a href="#" className="text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors font-light">{t('footer.terms')}</a>
```
Replace with:
```jsx
<button onClick={() => setLegalModal('privacy')} className="text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors font-light">
  {t('footer.privacy')}
</button>
<button onClick={() => setLegalModal('terms')} className="text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors font-light">
  {t('footer.terms')}
</button>
```

**Step 3: Verify build**
```bash
npm run build 2>&1 | tail -5
```

**Step 4: Commit**
```bash
git add src/App.jsx src/components/layout/Footer.jsx
git commit -m "feat: wire LegalModal to footer, fix #portfolio anchor"
```

---

### Task 6: Stats strip component

**Files:**
- Create: `src/components/sections/Stats.jsx`
- Modify: `src/App.jsx`

**Step 1: Create Stats.jsx**

```jsx
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const STATS = [
  { valKey: 'stats.projects_val', labelKey: 'stats.projects' },
  { valKey: 'stats.clients_val',  labelKey: 'stats.clients'  },
  { valKey: 'stats.cities_val',   labelKey: 'stats.cities'   },
]

export default function Stats() {
  const { t } = useTranslation()

  return (
    <section className="border-y border-[var(--line)] bg-[var(--bg-2)]">
      <div className="wrap">
        <div className="grid grid-cols-3 divide-x divide-[var(--line)]">
          {STATS.map(({ valKey, labelKey }, i) => (
            <motion.div
              key={valKey}
              className="py-10 px-6 text-center"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <p className="font-display font-light text-[var(--text)] leading-none mb-2"
                 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                {t(valKey)}
              </p>
              <p className="label text-[var(--text-3)]">{t(labelKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Add Stats to App.jsx** between HeroSection and Services lazy import

Add import (not lazy — it's tiny):
```jsx
import Stats from './components/sections/Stats.jsx'
```

In JSX, insert after `<HeroSection />`:
```jsx
<Stats />
```

**Step 3: Commit**
```bash
git add src/components/sections/Stats.jsx src/App.jsx
git commit -m "feat: stats strip — 25+ properties, 20+ clients, 3 cities"
```

---

### Task 7: Gallery hover-video structure

**Files:**
- Modify: `src/components/sections/Gallery.jsx`

This is the most involved task. We:
1. Add a `picsum.photos` poster URL to each project (seeded = consistent image per project)
2. Add a `videoSrc` path per project pointing to `/videos/{id}.mp4`
3. In `GalleryTile`, add a `<video>` element that plays on hover and is hidden otherwise
4. Detect touch device to skip video on mobile

**Step 1: Update GALLERY_PROJECTS data** — replace the existing array:

```js
export const GALLERY_PROJECTS = [
  {
    id:          'villa-guntur-01',
    title:       'Villa at Nallapadu',
    titleTe:     'నల్లపాడు విల్లా',
    location:    'Guntur',
    type:        '3D Walkthrough',
    typeTe:      '3D వాక్‌త్రూ',
    year:        '2024',
    /* swap: real property photo */
    placeholder: 'https://picsum.photos/seed/villa-guntur/800/600',
    /* swap: screen-recording of splat orbit (3–5s silent loop) */
    videoSrc:    '/videos/villa-guntur-01.mp4',
    shade:       '#0e0e0e',
    aspect:      'landscape',
  },
  {
    id:          'apartment-vijayawada-01',
    title:       'Riverside Apartments',
    titleTe:     'రివర్‌సైడ్ అపార్ట్‌మెంట్లు',
    location:    'Vijayawada',
    type:        'VR Experience',
    typeTe:      'VR అనుభవం',
    year:        '2024',
    placeholder: 'https://picsum.photos/seed/apartment-vijay/800/1000',
    videoSrc:    '/videos/apartment-vijayawada-01.mp4',
    shade:       '#0c0c0c',
    aspect:      'portrait',
  },
  {
    id:          'commercial-mangalagiri-01',
    title:       'Commercial Complex',
    titleTe:     'వాణిజ్య సముదాయం',
    location:    'Mangalagiri',
    type:        'Marketing Video',
    typeTe:      'మార్కెటింగ్ వీడియో',
    year:        '2024',
    placeholder: 'https://picsum.photos/seed/commercial-manga/800/600',
    videoSrc:    '/videos/commercial-mangalagiri-01.mp4',
    shade:       '#111111',
    aspect:      'landscape',
  },
  {
    id:          'penthouse-amaravati-01',
    title:       'Penthouse at Capital',
    titleTe:     'క్యాపిటల్ పెంట్‌హౌస్',
    location:    'Amaravati',
    type:        'VR + Video',
    typeTe:      'VR + వీడియో',
    year:        '2025',
    placeholder: 'https://picsum.photos/seed/penthouse-amara/800/1000',
    videoSrc:    '/videos/penthouse-amaravati-01.mp4',
    shade:       '#0d0d0d',
    aspect:      'portrait',
  },
  {
    id:          'gated-narasaraopet-01',
    title:       'Gated Community',
    titleTe:     'గేటెడ్ కమ్యూనిటీ',
    location:    'Narasaraopet',
    type:        'Full Package',
    typeTe:      'పూర్తి ప్యాకేజీ',
    year:        '2025',
    placeholder: 'https://picsum.photos/seed/gated-naras/800/600',
    videoSrc:    '/videos/gated-narasaraopet-01.mp4',
    shade:       '#0f0f0f',
    aspect:      'landscape',
  },
  {
    id:          'house-tenali-01',
    title:       'Heritage House',
    titleTe:     'హెరిటేజ్ నివాసం',
    location:    'Tenali',
    type:        '3D Walkthrough',
    typeTe:      '3D వాక్‌త్రూ',
    year:        '2025',
    placeholder: 'https://picsum.photos/seed/heritage-tenali/800/600',
    videoSrc:    '/videos/house-tenali-01.mp4',
    shade:       '#101010',
    aspect:      'landscape',
  },
]
```

**Step 2: Update GalleryTile component** — replace the existing component:

```jsx
/* Detect touch device once (outside component — stable) */
const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

function GalleryTile({ project, index, language }) {
  const ref        = useRef(null)
  const videoRef   = useRef(null)
  const [hovered, setHovered] = useState(false)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 200, damping: 30 })
  const sy = useSpring(my, { stiffness: 200, damping: 30 })

  const title     = language === 'te' ? project.titleTe  : project.title
  const typeLabel = language === 'te' ? project.typeTe   : project.type

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    mx.set(((e.clientX - rect.left) / rect.width  - 0.5) * 12)
    my.set(((e.clientY - rect.top)  / rect.height - 0.5) * 12)
  }

  const handleMouseEnter = () => {
    setHovered(true)
    /* Play the splat preview video if available */
    if (!isTouchDevice && videoRef.current) {
      videoRef.current.play().catch(() => {/* autoplay blocked — silently ignore */})
    }
  }

  const handleMouseLeave = () => {
    mx.set(0)
    my.set(0)
    setHovered(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden group cursor-pointer ${
        project.aspect === 'portrait' ? 'row-span-2' : ''
      }`}
      style={{ background: project.shade }}
    >
      {/* Static poster image */}
      <motion.img
        src={project.placeholder}
        alt={title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ x: sx, y: sy }}
      />

      {/*
        Splat screen-recording preview — plays on hover (desktop only).
        SWAP: record a 3–5s silent orbit of the Gaussian Splat in SuperSplat
        or any viewer, export as MP4 or WebM, drop into public/videos/.
        The poster attribute ensures no flash while loading.
      */}
      {!isTouchDevice && (
        <video
          ref={videoRef}
          src={project.videoSrc}
          poster={project.placeholder}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: hovered ? 1 : 0 }}
          aria-hidden="true"
        />
      )}

      {/* Always-visible bottom label */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent z-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/35 mb-1"
               style={{ fontSize:'0.6rem', letterSpacing:'0.15em', textTransform:'uppercase', fontFamily:'"DM Sans"' }}>
              {project.location} · {project.year}
            </p>
            <h3 className="font-display font-light text-white text-xl leading-tight">{title}</h3>
          </div>
          <span className="text-white/25 shrink-0 ml-4"
                style={{ fontSize:'0.6rem', letterSpacing:'0.12em', textTransform:'uppercase', fontFamily:'"DM Sans"' }}>
            {typeLabel}
          </span>
        </div>
      </div>

      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end p-6 z-20"
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(2px)' }}
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-white/40 mb-3"
           style={{ fontSize:'0.6rem', letterSpacing:'0.15em', textTransform:'uppercase', fontFamily:'"DM Sans"' }}>
          {project.location} · {typeLabel} · {project.year}
        </p>
        <h3 className="font-display font-light text-white text-2xl leading-tight mb-5">{title}</h3>
        <div className="h-px bg-white/10 mb-5" />
        <div className="flex items-center gap-5">
          <a
            href={buildWaLink(`I'd like to see the ${project.title} project demo.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors"
            style={{ fontSize:'0.65rem', letterSpacing:'0.15em', textTransform:'uppercase', fontFamily:'"DM Sans"' }}
            onClick={(e) => e.stopPropagation()}
          >
            Request Demo →
          </a>
          <span className="text-white/30"
                style={{ fontSize:'0.65rem', letterSpacing:'0.12em', textTransform:'uppercase', fontFamily:'"DM Sans"' }}>
            {/* Shows when video is playing */}
            {hovered && !isTouchDevice ? '▶ Splat Preview' : ''}
          </span>
        </div>
      </motion.div>
    </motion.article>
  )
}
```

**Step 3: Verify build**
```bash
npm run build 2>&1 | tail -5
```

**Step 4: Commit**
```bash
git add src/components/sections/Gallery.jsx
git commit -m "feat: gallery hover-video structure — picsum posters, splat video slots"
```

---

### Task 8: Final build + smoke test

**Step 1: Full build**
```bash
npm run build
```
Expected: clean, zero errors or warnings.

**Step 2: Preview**
```bash
npm run preview
```
Open `http://localhost:4173` and verify:
- [ ] Nav links are visibly larger
- [ ] Scrolling to "Portfolio" in footer goes to the gallery section
- [ ] Privacy / Terms buttons in footer open slide-up modals
- [ ] Escape key closes modals
- [ ] Gallery tiles show picsum images (may take a moment to load)
- [ ] Hovering a gallery tile shows the hover overlay (video won't play — no files yet)
- [ ] Stats strip shows "25+", "20+", "3" between Hero and Services
- [ ] Light mode toggle still works across all sections
- [ ] TE / HI language switch still works

**Step 3: Final commit**
```bash
git add -A
git commit -m "chore: final polish — nav font, gallery, stats, legal modals, link fixes"
```
