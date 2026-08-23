# Yaari Social Cafe — Website Design & Build Specification

## 1. Project Goal

Build a **cozy, premium, aesthetic, social-first cafe website** for **Yaari Social** using:

- **React.js**
- **Tailwind CSS**
- **Framer Motion** for component/scroll animations
- Optional **GSAP + ScrollTrigger** only for complex cinematic sequences
- Optional **Lenis** for smooth scrolling
- **Lucide React** for clean icons

The final website must feel like a real premium independent cafe website — **not a generic AI-generated template**.

The visual identity should be derived from the supplied **Yaari Social logo** and physical menu:

- warm ivory / off-white
- charcoal / soft black
- muted taupe / stone
- warm coffee brown as a restrained accent
- subtle paper/grain texture
- rounded but not overly “SaaS-like”
- editorial typography
- intimate cafe photography
- understated premium motion

The emotional direction is:

> **“Your cozy corner for coffee, conversations, food and late-evening yaari.”**

The website should constantly feel alive, but animation must remain elegant and intentional. Almost every viewport should have **some movement**, such as soft image breathing, parallax, text reveal, marquee motion, ambient grain, hover response, floating labels, masked video reveals, or subtle background transforms.

---

# 2. Brand Direction

## Brand Personality

Yaari Social should feel:

- Warm
- Relaxed
- Friendly
- Intimate
- Youthful
- Stylish
- Premium but accessible
- Social without being loud
- Cozy rather than luxury-hotel formal
- Instagram-friendly without looking manufactured

Avoid:

- neon gaming aesthetics
- over-saturated gradients
- glassmorphism everywhere
- tech/SaaS UI patterns
- large glowing CTA buttons
- random 3D blobs
- cartoon cafe graphics
- excessive beige with no contrast
- generic AI-generated coffee stock imagery
- heavy animation that hurts readability

---

# 3. Visual Theme

## Primary Color Palette

Use colors inspired by the current monochrome/cream Yaari Social logo and menu.

```js
colors: {
  ivory: {
    50:  "#FBF8F2",
    100: "#F5F0E6",
    200: "#E9E0D2"
  },

  charcoal: {
    700: "#393531",
    800: "#282522",
    900: "#181614"
  },

  taupe: {
    300: "#CFC4B7",
    400: "#B4A697",
    500: "#958576"
  },

  coffee: {
    400: "#9B7557",
    500: "#7E5B42",
    600: "#624431"
  },

  burgundy: {
    500: "#6E4542",
    600: "#563533"
  }
}
```

### Usage Ratio

- 65% warm ivory / parchment
- 20% charcoal
- 10% taupe / coffee
- 5% burgundy or deeper brown accent

Do not use the accent color on everything.

---

# 4. Typography

The typography should resemble the elegant serif personality of the Yaari Social logo, paired with a modern, friendly sans-serif.

## Recommended Fonts

### Display / Headings
Use one of:

1. **Cormorant Garamond**
2. **DM Serif Display**
3. **Libre Baskerville**
4. **Bodoni Moda** for a more editorial look

Preferred:

```txt
Cormorant Garamond
```

### Body / Navigation / Menu
Use:

```txt
Manrope
```

or

```txt
DM Sans
```

Preferred:

```txt
Manrope
```

### Typography Rules

Hero heading:
- 64–92px desktop
- 48–64px tablet
- 40–50px mobile
- line-height around 0.95–1.05
- slightly negative letter-spacing

Section titles:
- serif
- 48–68px desktop
- 34–46px mobile

Body:
- 15–18px
- generous line-height
- warm charcoal rather than pure black

Small labels:
- uppercase
- 10–12px
- tracking 0.14em–0.2em

Menu item names:
- medium sans
- 14–16px
- price aligned consistently

---

# 5. Texture & Surface Style

The website should not use a perfectly flat digital background.

Add a very subtle global texture:

```css
opacity: 0.02 – 0.045
mix-blend-mode: multiply
pointer-events: none
```

Possible treatment:

- scanned paper grain
- very soft noise
- faint cafe menu paper texture

Do not make it visibly dirty.

Use subtle 1px borders:

```txt
rgba(40, 37, 34, 0.12)
```

Card shadows should be minimal:

```txt
0 18px 50px rgba(28, 22, 18, 0.08)
```

---

# 6. Site Structure

Recommended route structure:

```txt
/
├── Home
├── Menu
├── Jamming
├── Gallery
├── About
└── Contact
```

For the first version, a polished **single-page experience** is preferred with anchor navigation:

```txt
Home
Menu
Jamming
Moments
About
Visit Us
```

Optional standalone `/menu` route can be added later.

---

# 7. Navigation

## Desktop Navbar

Floating nav or slim top nav.

### Style

- transparent over hero initially
- on scroll changes to warm ivory with backdrop blur
- thin bottom border
- Yaari Social logo on left
- menu links centered/right
- Instagram icon
- compact CTA: **“Visit Yaari”**

Navigation items:

```txt
Home
Menu
Jamming
Moments
About
Visit
```

### Motion

On load:
- nav fades down from `y: -16`
- 0.7s duration
- subtle stagger

On scroll:
- background opacity changes smoothly
- logo slightly reduces scale
- nav height reduces around 8–12px

Hover:
- tiny horizontal line expands beneath link
- no giant pill hover

---

# 8. Hero Section

The hero must immediately communicate the Yaari Social atmosphere.

## Layout Option — Recommended

Full viewport cinematic hero:

```txt
[large cafe video/image]
        ↓
centered Yaari Social logo / text
small editorial label
large serif heading
compact supporting line
two text-style CTAs
```

Suggested copy:

```txt
A little coffee.
A lot of yaari.
```

Supporting copy:

```txt
Coffee, comfort food, conversations and evenings worth staying for.
```

CTA:

```txt
Explore the Menu
See Our Vibe
```

## Background Media

Priority:

1. Best cafe video from Instagram dataset
2. Best interior/lifestyle still
3. Fallback branded textured composition

Do not use external random stock media when authentic Yaari Social content exists.

### Video Hero Rules

- muted
- autoplay
- loop
- playsInline
- no visible native controls
- use 6–15 second loop
- object-cover
- overlay:

```txt
linear-gradient(
  to bottom,
  rgba(18,16,14,.12),
  rgba(18,16,14,.25),
  rgba(18,16,14,.52)
)
```

### Hero Motion

- background image/video starts at scale `1.06`
- slowly settles to `1.00` over 8–12 seconds
- heading reveals line-by-line with masked upward motion
- subtitle fades in after heading
- CTA appears after 500–700ms
- a tiny “Scroll to explore” indicator moves vertically

Important: motion should feel **cinematic**, not bouncy.

---

# 9. Ambient Motion System

The site should never feel static.

Use a combination of:

### A. Slow Image Breathing

For selected images:

```txt
scale: 1.00 → 1.04 → 1.00
duration: 12–18s
ease: easeInOut
repeat: infinite
```

### B. Scroll Parallax

Foreground media:

```txt
translateY: -4% to +4%
```

Background texture:

```txt
translateY: -1.5% to +1.5%
```

### C. Masked Reveal

When an image enters viewport:

```txt
clip-path:
inset(12% 0 0 0)
→
inset(0 0 0 0)
```

paired with scale:

```txt
1.08 → 1.00
```

### D. Editorial Text Reveal

Reveal each line with:

```txt
y: 34px → 0
opacity: 0 → 1
```

### E. Hover Image Zoom

Cards:

```txt
image scale: 1 → 1.045
duration: 700ms
```

### F. Marquee

Use only 1–2 marquees on the whole website.

Suggested marquee text:

```txt
COFFEE • CONVERSATIONS • FOOD • MUSIC • YAARI •
```

Make it slow and understated.

### G. Cursor Interaction — Desktop Only

Optional:
- custom 10–14px soft ring cursor
- grows over media
- text changes to “View” on gallery items

Do not implement if it negatively affects usability.

---

# 10. “The Yaari Feeling” Intro Section

Directly below hero.

## Layout

Two-column editorial layout:

Left:
- oversized serif statement

Right:
- short paragraph
- small image/video tile

Suggested text:

```txt
Not just a table.
A place to stay a little longer.
```

Body:

```txt
Yaari Social is built around the simple things we keep coming back for —
good coffee, comforting food, music, and people we enjoy sharing time with.
```

Visual:
- use a candid photo extracted from the Instagram media
- slightly rotated by 1–2 degrees
- off-white border
- subtle paper shadow

Motion:
- title stagger
- image parallax
- tiny decorative line draw animation

---

# 11. Jamming Section

This section should make Yaari Social feel social and experiential rather than only “a cafe menu website”.

## Content Source

Use the supplied **Instagram scraped dataset**.

The coding agent must inspect the project folder recursively and locate files such as:

```txt
*.json
*.jsonl
*.csv
*.xlsx
*.txt
*.html
media/
images/
videos/
reels/
posts/
```

Possible fields to detect:

```txt
display_url
thumbnail_url
video_url
videoUrl
media_url
mediaUrl
url
src
type
media_type
is_video
caption
timestamp
date
shortcode
post_url
```

If the dataset references media URLs but media is not downloaded:

1. Parse the dataset.
2. Extract media URLs.
3. Download media only when legally/technically accessible from the supplied scrape.
4. Save them to:

```txt
/public/media/instagram/images/
/public/media/instagram/videos/
```

5. Generate a normalized manifest:

```txt
/src/data/instagramMedia.js
```

Example:

```js
export const instagramMedia = [
  {
    id: "ig-001",
    type: "video",
    src: "/media/instagram/videos/001.mp4",
    thumbnail: "/media/instagram/images/001-cover.jpg",
    caption: "...",
    section: "jamming"
  }
]
```

Do not hard-code URLs that expire.

## Jamming Section Layout

Use a visually asymmetric editorial grid:

```txt
┌──────────────────────┬───────────────┐
│                      │   photo       │
│      BIG VIDEO       ├───────────────┤
│                      │ small video   │
├──────────────┬───────┴───────────────┤
│ photo        │ text / event caption  │
└──────────────┴───────────────────────┘
```

Section heading:

```txt
Jamming at Yaari
```

Subheading:

```txt
Some evenings are better with music, coffee and your people.
```

### Motion

Large video:
- reveal using clip mask
- autoplay only when 50%+ in viewport
- pause when out of viewport

Small cards:
- stagger 90–140ms
- images gently zoom
- optional 1px floating motion

Add a large slow background word:

```txt
JAMMING
```

with opacity around 0.03–0.05.

---

# 12. Video / Reels Section

Create a separate immersive section using vertical reels/videos from the Instagram dataset.

Section title:

```txt
Press play on the vibe.
```

## Desktop Layout

Horizontal scroll rail containing 9:16 video cards.

Card width:

```txt
260–320px
```

Cards:
- 9:16
- 18–24px border radius
- muted preview loop
- caption overlay
- small play indicator

Horizontal rail should move slowly as user scrolls vertically OR use draggable native horizontal scrolling.

Do not hijack scrolling aggressively.

### Hover

- video card scale `1 → 1.025`
- play icon opacity increase
- thumbnail darkens slightly
- caption slides up 6px

### Mobile

Use swipeable horizontal cards.

Do not load all videos immediately.

Use:

```txt
preload="metadata"
```

and Intersection Observer.

---

# 13. Menu Section — Core Requirement

The menu must include:

1. A polished, searchable/filterable **digital menu**
2. The original uploaded menu photographs available as **“View Original Menu”**
3. Every visible item and price from the supplied menu images

Do not simply place the two photographs and call it done.

## Menu Visual Direction

Background:
- warm parchment

Header:
- serif

Category filters:
- horizontally scrollable on mobile
- understated text buttons rather than giant pills

Example:

```txt
All
Coffee
Cold Coffee
Chai
Shakes
Refreshments
Buns
Breads
Sandwiches
Burgers
Pasta
Fries
Maggi
```

## Menu Interaction

Desktop:
- 2 or 3 columns depending on category
- item name left
- dotted/solid faint rule
- price right

Mobile:
- single column
- category accordions optional

Hover:
- row shifts `x: 4px`
- price changes from charcoal to coffee accent
- tiny decorative dot appears

Search:
- optional “Find something…” field
- fuzzy/simple string search

---

# 14. Menu Data

Create:

```txt
/src/data/menu.js
```

Use this exact structured content from the supplied menu photographs.

```js
export const menu = [
  {
    category: "Served Hot",
    items: [
      { name: "Hot Coffee", price: 20 },
      { name: "Strong Coffee", price: 25 },
      { name: "Black Coffee", price: 30 },
      { name: "Hot Chocolate Coffee", price: 40 },
      { name: "Strong Chocolate Coffee", price: 50 },
      { name: "DavidOff Hot Coffee", price: 60 },
      { name: "Cappuccino", price: 60 },
      { name: "Hot Chocolate", price: 100 }
    ]
  },

  {
    category: "Served Cold",
    items: [
      { name: "Bournvita", price: 60 },
      { name: "Plain Cold Coffee", price: 80 },
      { name: "Iced Americano", price: 80 },
      { name: "Iced Coffee", price: 100 },
      { name: "Strong Cold Coffee", price: 100 },
      { name: "Chocolate Cold Coffee", price: 120 },
      { name: "DavidOff Cold Coffee", price: 150 },
      { name: "Irish Coffee", price: 180 }
    ]
  },

  {
    category: "Chai",
    items: [
      { name: "Classic", price: 15 },
      { name: "Adrak", price: 20 },
      { name: "Elaichi", price: 20 },
      { name: "Adrak Elaichi Mix", price: 30 },
      { name: "Lemon", price: 30 },
      { name: "Masala", price: 40 }
    ]
  },

  {
    category: "Shakes",
    items: [
      { name: "Chocolate", price: 80 },
      { name: "Vanilla", price: 80 },
      { name: "Cadbury", price: 100 },
      { name: "Kit Kat", price: 120 },
      { name: "Oreo", price: 140 }
    ]
  },

  {
    category: "Refreshments",
    items: [
      { name: "Sweet Lemonade", price: 50 },
      { name: "Salt Lemonade", price: 50 },
      { name: "Masala Lemonade", price: 60 },
      { name: "Lemon Iced Tea", price: 100 },
      { name: "Mojito", price: 120 }
    ]
  },

  {
    category: "Beverages",
    items: [
      { name: "Thums Up", price: 25 },
      { name: "Coke", price: 25 },
      { name: "Sprite", price: 25 },
      { name: "Fanta", price: 25 },
      { name: "Diet Coke", price: 50 },
      { name: "Redbull", price: 135 }
    ]
  },

  {
    category: "Buns",
    items: [
      { name: "Bun Maska", price: 40 },
      { name: "Bun Jam Maska", price: 50 },
      { name: "Nutella Bun Maska", price: 70 },
      { name: "Nutella Choco Bun Maska", price: 90 }
    ]
  },

  {
    category: "Breads",
    items: [
      { name: "Bread Butter", price: 25 },
      { name: "Bread Butter Jam", price: 30 },
      { name: "Bread Simple Toast", price: 40 },
      { name: "Toasted Butter Jam", price: 50 },
      { name: "Garlic Bread", price: 60 },
      { name: "Spicy Garlic Bread", price: 70 },
      { name: "Peri Peri Garlic Bread", price: 80 },
      { name: "Cheese Garlic Bread", price: 120 },
      { name: "Corn Cheese Garlic Bread", price: 140 }
    ]
  },

  {
    category: "Pastas",
    items: [
      { name: "Red Sauce Pasta", price: 180 },
      { name: "Tandoori Sauce Pasta", price: 180 },
      { name: "White Sauce Pasta", price: 200 }
    ]
  },

  {
    category: "Fries",
    items: [
      { name: "Plain Salted", price: 60 },
      { name: "Peri Peri", price: 80 },
      { name: "Mayo", price: 100 },
      { name: "Cheesy", price: 120 }
    ]
  },

  {
    category: "Sandwiches",
    items: [
      { name: "Masala", price: 50 },
      { name: "Chilli Chatpata", price: 70 },
      { name: "Bombay Kaccha", price: 80 },
      { name: "Bombay Cheese Grilled", price: 100 },
      { name: "Corn Cheese Grilled", price: 120 },
      { name: "Cheese Achari Grilled", price: 120 },
      { name: "Chocolate", price: 140 },
      { name: "Paneer Corn Cheese Grilled", price: 150 }
    ]
  },

  {
    category: "Potato Twisters",
    items: [
      { name: "Classic", price: 70 },
      { name: "Peri Peri", price: 80 },
      { name: "Peri Peri Mayo", price: 100 },
      { name: "Cheesy Mayo", price: 120 }
    ]
  },

  {
    category: "Burgers",
    items: [
      { name: "Classic Aloo Tikki", price: 60 },
      { name: "Tandoori Veggie", price: 70 },
      { name: "Cheese Aloo Tikki", price: 80 },
      { name: "Cheese Tandoori", price: 90 },
      { name: "Double Cheese", price: 100 },
      { name: "Yaari Maharaja", price: 130 }
    ]
  },

  {
    category: "Maggi",
    items: [
      { name: "Classic", price: 60 },
      { name: "Double Masala", price: 70 },
      { name: "Peri Peri Masala", price: 80 },
      { name: "Veggie Maggi", price: 90 },
      { name: "Cheesy Maggi", price: 100 },
      { name: "Tandoori Masala Maggi", price: 110 }
    ]
  }
]
```

### Menu Source Note

Some text in the physical menu photographs is partly obscured by glare. The digital menu above is the intended transcription from the readable content. During implementation, preserve the original menu photos in the “View Original Menu” lightbox so the owner can compare the structured entries before publishing.

---

# 15. Original Menu Image Experience

Use the supplied menu images:

```txt
menu1.png
menu2.png
```

Recommended final project path:

```txt
/public/images/menu/menu-food.png
/public/images/menu/menu-drinks.png
```

Do not show the raw photos immediately at full size.

Create a stylish CTA:

```txt
View Original Menu
```

When clicked:

- open full-screen modal/lightbox
- warm charcoal backdrop
- two-page swipe/carousel
- pinch/zoom on mobile if library supports it
- smooth zoom-in entry
- close icon top right

Animation:

```txt
modal opacity 0 → 1
image scale .94 → 1
duration 400–500ms
```

---

# 16. Signature Picks

Between menu and gallery, create a visual “signature picks” band.

Only use real items if matching images exist in the Instagram media.

Potential labels:

```txt
Cold Coffee
Yaari Maharaja
Cheese Garlic Bread
Peri Peri Twister
White Sauce Pasta
```

If exact dish mapping cannot be verified, do not falsely label random images.

Instead use generic copy like:

```txt
Cafe favourites
```

and keep captions neutral.

---

# 17. Gallery / “Moments” Section

Heading:

```txt
Little moments at Yaari.
```

Use authentic images from Instagram.

Layout:

- editorial masonry
- mix portrait and landscape
- deliberate whitespace
- avoid Pinterest-like 20-card overload

Recommended:
- 7–10 strong pieces on desktop
- 5–7 on mobile

Motion:
- alternate image parallax directions
- masked reveals
- subtle zoom
- hover dark overlay with post date/caption excerpt

Do not display long raw Instagram captions.

---

# 18. Horizontal Statement Section

Create a high-contrast charcoal section:

Background:

```txt
#181614
```

Text:

```txt
Come for the coffee.
Stay for the yaari.
```

Large ivory serif typography.

Behind it:
- very slow moving grain
- giant outline circle inspired by the round Yaari Social logo
- circle rotates only 3–6 degrees over a long scroll distance

This can become one of the main visual identity moments.

---

# 19. About Section

Keep it human and brief.

Suggested content:

```txt
Yaari Social is a neighbourhood cafe made for unhurried conversations,
comfort food, coffee breaks, music and the kind of plans that become memories.
```

Visual:
- candid cafe photo or behind-the-counter moment

Layout:
- image left
- text right
- small “Eat • Sip • Socialise” label

Use circular line motif based on the logo border.

---

# 20. Visit / Contact Section

This section should answer:

- Where is Yaari Social?
- When is it open?
- How do I contact the cafe?
- How do I reach Instagram?
- How do I get directions?

Do not invent address, hours or phone number.

Read these from:
- Instagram dataset/profile metadata
- supplied project files
- contact information provided later

If not available, create data placeholders in:

```txt
/src/data/site.js
```

Example:

```js
export const site = {
  cafeName: "Yaari Social",
  address: "",
  phone: "",
  instagramUrl: "",
  openingHours: []
}
```

Render incomplete values only when populated.

CTA ideas:

```txt
Get Directions
Call Yaari
Open Instagram
```

---

# 21. Footer

Minimal editorial footer.

Left:
- logo

Center:
- navigation

Right:
- Instagram
- contact

Bottom:

```txt
Yaari Social
Coffee • Food • Conversations
```

Add a very slow marquee above the footer:

```txt
SEE YOU AT YAARI • SEE YOU AT YAARI • SEE YOU AT YAARI •
```

---

# 22. Logo Usage

Use the supplied `logo.png`.

Recommended project location:

```txt
/public/brand/yaari-social-logo.png
```

Because the existing logo includes a white/cream circular area, support:

- normal light-background version
- optional CSS multiply treatment if appropriate
- optional carefully cropped transparent version only if created without damaging the original typography

Do not redraw the logo using a random font.

Use the circular double-border motif as a recurring design language:

- section-number circles
- hover rings
- gallery cursor
- footer decoration
- loading animation

Do not repeat it on every card.

---

# 23. Loading Experience

Use a short premium intro loader only if it stays under ~1.2–1.8s.

Concept:

```txt
thin circle draws itself
“Yaari Social” fades in
circle expands softly
page reveals
```

Respect returning visitors:

- optionally show full loader only once per session
- skip/reduce on repeat navigation

---

# 24. Page Transition

For single-page:
- no page-transition library needed

If routes are added:
- use short fade + vertical masked reveal
- 300–550ms

Avoid dramatic 3D flips.

---

# 25. Component Architecture

Suggested:

```txt
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── SectionShell.jsx
│   │
│   ├── hero/
│   │   └── Hero.jsx
│   │
│   ├── menu/
│   │   ├── MenuSection.jsx
│   │   ├── MenuCategory.jsx
│   │   ├── MenuItem.jsx
│   │   ├── MenuFilters.jsx
│   │   └── MenuLightbox.jsx
│   │
│   ├── media/
│   │   ├── JammingSection.jsx
│   │   ├── VideoRail.jsx
│   │   ├── VideoCard.jsx
│   │   ├── Gallery.jsx
│   │   └── LazyVideo.jsx
│   │
│   ├── motion/
│   │   ├── RevealText.jsx
│   │   ├── RevealMedia.jsx
│   │   ├── MagneticLink.jsx
│   │   └── Marquee.jsx
│   │
│   └── ui/
│       ├── Button.jsx
│       ├── SectionLabel.jsx
│       └── Modal.jsx
│
├── data/
│   ├── menu.js
│   ├── site.js
│   └── instagramMedia.js
│
├── hooks/
│   ├── useInViewVideo.js
│   ├── useReducedMotion.js
│   └── useMediaQuery.js
│
├── pages/
│   └── Home.jsx
│
├── styles/
│   └── globals.css
│
└── App.jsx
```

---

# 26. Instagram Dataset Extraction Architecture

Create a small preprocessing script:

```txt
/scripts/extract-instagram-media.mjs
```

Responsibilities:

1. Recursively scan a configured folder.
2. Detect Instagram scrape files.
3. Parse JSON/JSONL/CSV safely.
4. Normalize post records.
5. Distinguish:
   - image
   - carousel
   - reel/video
6. Generate stable filenames.
7. Copy or download media into `/public/media/instagram`.
8. Generate `instagramMedia.js`.
9. Deduplicate using:
   - shortcode
   - source URL
   - checksum
10. Prefer higher-resolution media.
11. Skip broken files without crashing the build.

Pseudo-normalized type:

```ts
type InstagramMedia = {
  id: string
  type: "image" | "video"
  src: string
  thumbnail?: string
  caption?: string
  timestamp?: string
  shortcode?: string
  sourcePost?: string
  width?: number
  height?: number
}
```

### Media Ranking

Automatically rank/select website assets using simple rules:

Hero candidate:
- landscape video preferred
- width >= 1280 where available
- not excessively shaky
- bright enough
- cafe/interior/people/action
- avoid text-heavy promotional posts

Jamming:
- music/performance/crowd/video
- detect relevant captions containing words such as:

```txt
jam
jamming
music
live
acoustic
night
gig
song
event
```

Gallery:
- high-resolution images
- interior
- drinks
- food
- candid people
- details

If automated caption matching is uncertain, include the item in the general gallery instead of claiming it is a jamming event.

---

# 27. Motion Technical Rules

Use Framer Motion as primary.

Example timing tokens:

```js
export const motion = {
  fast: 0.28,
  normal: 0.55,
  slow: 0.9,
  cinematic: 1.25
}
```

Recommended ease:

```js
[0.22, 1, 0.36, 1]
```

Text stagger:

```txt
0.04–0.10s
```

Card stagger:

```txt
0.07–0.14s
```

Never use:
- spring bounce on section headings
- exaggerated elastic easing
- endless spinning decorative elements
- animations faster than users can read

---

# 28. Reduced Motion

Honor:

```css
@media (prefers-reduced-motion: reduce)
```

When enabled:
- disable parallax
- stop auto marquee
- remove continuous breathing animation
- use simple fades
- retain functionality

---

# 29. Performance Requirements

Target:

```txt
Lighthouse Performance: 90+
Accessibility: 95+
Best Practices: 95+
SEO: 95+
```

Requirements:

- lazy-load below-the-fold images
- use responsive `srcSet`
- serve WebP/AVIF when possible
- poster image for every video
- preload only the hero media
- pause videos outside viewport
- do not autoplay 8 videos simultaneously
- avoid huge uncompressed scraped reels
- compress background video to a sensible web bitrate
- split non-critical sections
- avoid unnecessary animation libraries

For Instagram videos:
- generate optimized web copies if source is huge
- target H.264 MP4 for broad compatibility
- muted loop previews

---

# 30. Responsive Design

## Desktop > 1280px

- immersive whitespace
- cinematic imagery
- asymmetric layouts
- max content width ~1280–1440px

## Tablet 768–1279px

- reduce hero typography
- jamming grid simplifies
- menu becomes 2 columns
- video rail remains horizontal

## Mobile < 768px

Primary concern: preserve vibe without overwhelming.

- hero full screen
- heading 42–52px
- one strong hero media
- menu single column
- horizontal category filters
- Jamming becomes stacked media
- Reels horizontal swipe
- avoid fixed cursor
- reduce parallax
- maintain 16–24px side padding

---

# 31. Accessibility

- all images require meaningful alt text
- decorative images use empty alt
- menu prices must be readable by screen readers
- buttons must be actual `<button>` or `<a>`
- maintain 4.5:1 text contrast
- video sections must not depend on autoplay audio
- support keyboard control in menu lightbox
- Escape closes modal
- visible focus state
- do not hide content behind hover-only interactions

---

# 32. SEO

Title example:

```txt
Yaari Social | Coffee, Food & Conversations
```

Description:

```txt
Discover Yaari Social — a cozy cafe for coffee, comfort food, conversations,
music and memorable evenings.
```

Add:

- OpenGraph image
- favicon using logo mark
- LocalBusiness / CafeOrCoffeeShop schema when address/hours are known
- menu structured content where practical
- semantic headings
- descriptive media filenames

---

# 33. Suggested Home Page Order

Final recommended flow:

```txt
01  Navbar
02  Hero Video
03  The Yaari Feeling
04  Slow Brand Marquee
05  Jamming at Yaari
06  Reels / Video Rail
07  Digital Menu
08  Signature Picks / Food Imagery
09  Dark Statement Section
10  Little Moments Gallery
11  About Yaari
12  Visit / Contact
13  Footer
```

This order balances:
- brand
- atmosphere
- entertainment
- menu intent
- social proof
- conversion

---

# 34. Micro-Interactions

Add premium micro-interactions throughout:

### Buttons
- slight icon movement
- underline animation
- no oversized scale bounce

### Menu Items
- subtle horizontal shift
- line becomes slightly darker

### Gallery
- hover zoom
- tiny “View” cursor

### Section Labels
- dot pulses very softly every 4–6s

### Logo
- nav logo can rotate max 1–2 degrees on hover or gently scale
- never spin

### Footer
- Instagram arrow slides 3–5px on hover

---

# 35. Copy Style

Avoid generic phrases like:

```txt
“Indulge in a symphony of flavours”
“Where every sip tells a story”
“Experience culinary excellence”
```

Use natural, human copy.

Preferred tone:

```txt
Coffee for the catch-ups.
Food for the long conversations.
Music for the evenings that stretch a little further.
```

Short, casual and editorial.

---

# 36. Empty-State / Missing Data Rules

The website must remain polished even if some Instagram media fails.

If no jamming videos:
- use strongest lifestyle images
- label section “Evenings at Yaari”
- do not invent events

If no address:
- hide Directions CTA

If no phone:
- hide Call CTA

If no opening hours:
- omit hours block

Never publish fake placeholders such as:

```txt
123 Cafe Street
+91 99999 99999
```

---

# 37. Implementation Priority

## Phase 1 — Foundation

1. React + Vite setup
2. Tailwind setup
3. fonts
4. color tokens
5. global texture
6. navigation
7. footer

## Phase 2 — Assets

1. place logo
2. place menu images
3. inspect Instagram dataset
4. extract media
5. optimize images/videos
6. generate media manifest

## Phase 3 — Core Sections

1. hero
2. intro
3. jamming
4. video rail
5. menu
6. gallery
7. about
8. visit

## Phase 4 — Motion

1. reveal system
2. parallax
3. image zoom
4. marquee
5. modal transitions
6. video viewport playback

## Phase 5 — Polish

1. mobile refinement
2. accessibility
3. performance
4. SEO
5. image/video compression
6. final spacing and animation audit

---

# 38. Final Design Quality Checklist

Before calling the website finished, verify:

- [ ] The site visually matches Yaari Social’s logo rather than a random coffee template.
- [ ] Real Yaari Social images/videos are used wherever possible.
- [ ] Instagram media is extracted from the supplied scrape/dataset.
- [ ] Jamming content uses relevant media instead of unrelated random posts.
- [ ] Video previews pause outside the viewport.
- [ ] Hero feels cinematic and premium.
- [ ] Every major viewport contains tasteful motion.
- [ ] The website does not feel over-animated.
- [ ] The menu includes every transcribed item and price.
- [ ] Original menu photos are viewable in a lightbox.
- [ ] Menu works well on mobile.
- [ ] Typography feels editorial and cafe-focused.
- [ ] Ivory/charcoal palette remains consistent.
- [ ] No neon or generic SaaS styling appears.
- [ ] No fake address, hours, reviews or testimonials are invented.
- [ ] Instagram links/content come from real supplied data.
- [ ] The site maintains strong contrast and accessibility.
- [ ] Mobile video performance is acceptable.
- [ ] Motion respects `prefers-reduced-motion`.
- [ ] Image cropping never hides important faces/food.
- [ ] The website feels handcrafted rather than AI-generated.

---

# 39. Final Creative Direction

The design should feel like a blend of:

- a cozy independent coffee bar
- a small editorial lifestyle magazine
- an intimate social space
- a premium Instagram feed brought to life

The strongest design idea is **contrast between calm typography and living media**:

- static serif composition
- slow video
- subtle grain
- warm light
- images that breathe
- elegant scroll reveals
- music/jamming content with energy
- a menu that still feels like the printed cafe menu

The result should be **cozy first, premium second, animated third**.

Animation exists to make the cafe feel alive — never to show off the animation library.

---

# 40. One-Line Build Instruction for the Coding Agent

> Build Yaari Social as a highly polished React + Tailwind cafe website using the supplied logo, menu photographs and Instagram scrape as the source of truth; create a warm ivory/charcoal editorial visual identity, extract and optimize authentic Instagram images/videos for the hero, Jamming, reels and gallery sections, implement the complete digital menu from this specification, and use refined Framer Motion interactions, scroll reveals, parallax, image breathing and cinematic video behavior so the website always feels subtly alive without becoming distracting or looking AI-generated.
