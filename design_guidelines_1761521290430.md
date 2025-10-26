# Design Guidelines: Aplicação de Gerenciamento Pessoal

## Design Approach

**Selected Framework**: Linear + Notion Hybrid System  
Modern productivity application design focusing on clean data presentation, efficient workflows, and contextual AI assistance. Emphasis on clarity, hierarchy, and rapid information access.

**Core Principles**:
- Information density without clutter
- Instant access to all modules
- Contextual bot assistance omnipresence
- Data visualization clarity
- Mobile-responsive layouts

---

## Typography System

**Font Families**:
- Primary: Inter (via Google Fonts CDN)
- Monospace: JetBrains Mono (for numbers, data, code in estudos section)

**Type Scale**:
- Hero/Module Headers: text-4xl, font-bold (36px)
- Section Titles: text-2xl, font-semibold (24px)
- Card Headers: text-lg, font-medium (18px)
- Body Text: text-base, font-normal (16px)
- Secondary/Meta: text-sm, font-normal (14px)
- Data Labels: text-xs, font-medium, uppercase, tracking-wide (12px)

**Emphasis Patterns**:
- Numbers/Metrics: font-semibold, text-2xl to text-4xl (JetBrains Mono)
- Button Text: font-medium, text-sm
- Navigation: font-medium, text-sm

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16  
(p-2, m-4, gap-6, space-y-8, py-12, mt-16)

**Container Strategy**:
- Sidebar: Fixed width 280px (w-70)
- Main Content: max-w-7xl with px-6 md:px-8
- Module Cards: max-w-6xl
- Forms: max-w-2xl
- Bot Panel: Fixed 360px (w-90) when expanded

**Grid Patterns**:
- Dashboard Overview: grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-6
- Data Tables: Full width with horizontal scroll
- Calendar Views: Full width 7-column grid
- Study Materials: grid-cols-1 lg:grid-cols-2, gap-8

**Vertical Rhythm**:
- Section spacing: space-y-8
- Card internal padding: p-6
- Form field spacing: space-y-4
- List item spacing: space-y-2

---

## Navigation & Layout Structure

**Primary Navigation**: Left sidebar (desktop) / Bottom tab bar (mobile)
- Logo/App Name at top
- User profile section with avatar
- Module icons with labels: Dashboard, Treinos, Dieta, Finanças, Agenda, Estudos
- Settings at bottom
- Sidebar collapses to icon-only on tablet

**Bot Assistant**: Floating button (bottom-right) + expandable panel
- Persistent across all pages
- Toggle button: 56px circle with chat icon
- Expanded panel: Slides from right, 360px width, full height
- Panel includes: contextual greeting, chat history, input field, quick actions
- Position: fixed, bottom-8, right-8

**Header Bar** (top of main content):
- Breadcrumb navigation (Home > Module > Subpage)
- Search bar (global, center-aligned)
- Notifications icon
- Quick add button (+ icon with dropdown for common actions)

---

## Component Library

### Form Components
- Dialog overlays for create/edit actions
- Label above input: text-sm, font-medium, mb-2
- Input fields: h-12, px-4, rounded-lg, border
- Focus states: ring treatment
- Error states: border treatment + text-sm error message below
- Multi-column forms: grid-cols-2 gap-6 on desktop
- Submit buttons: Primary CTA, full-width on mobile

### Dashboard & Metric Cards
- Elevated card style with rounded-2xl borders
- Large number display: text-2xl to text-4xl, font-bold, JetBrains Mono
- Icon in top-right corner (24px, colored)
- Padding: p-6
- Grid layout: 3 columns desktop, 2 tablet, 1 mobile

### Data Tables & Lists
- Sticky header row
- Alternating row treatment for readability
- Action buttons at row end (icon buttons)
- Responsive: horizontal scroll or card-based view on mobile

### Calculator Components
- Prominent positioning with two-column layout
- Input form on left, results display on right
- Large calculated values: text-4xl to text-5xl, JetBrains Mono
- Breakdown tables below main result
- Calculate button: Primary CTA

### Calendar Components
- Monthly view: 7-column grid, day cells h-24, p-2
- Current day: Bold border treatment
- Event indicators: Colored dots or mini-badges
- Timeline view: Vertical with hour markers
- Event cards: Time range, title, category badge

### Study Material Cards
- Image/icon at top (120px height)
- Title: text-lg, font-semibold, line-clamp-2
- Category badge: small pill shape
- Meta info: difficulty level, duration
- CTA button at bottom: "Acessar Conteúdo"
- Hover effect: subtle elevation

### Bot Chat Interface
- User messages: rounded-2xl, right-aligned, max-w-80%
- Bot messages: rounded-2xl, left-aligned, max-w-80%
- Avatar: 32px circle (user photo vs bot icon)
- Timestamp: text-xs below each message
- Multi-line textarea input: min-h-12, max-h-32

---

## Responsive Breakpoints

**Mobile** (< 768px):
- Sidebar hidden, bottom tab navigation (5 icons)
- Bot panel: Full-screen overlay
- Single column layouts
- Tables: Card-based view
- Metrics: 2 columns maximum

**Tablet** (768px - 1024px):
- Sidebar: Icon-only (64px wide)
- 2-column grids
- Bot panel: 320px width
- Reduced padding: px-6

**Desktop** (> 1024px):
- Full sidebar with labels
- 3-column grids where applicable
- Bot panel: 360px width
- Standard padding: px-8

---

## Microinteractions (Minimal Use)

**Essential Only**:
- Button hover: subtle scale (scale-105) - 150ms
- Card hover: slight shadow increase - 200ms
- Input focus: ring appearance - instant
- Navigation active state: indicator slide - 300ms
- Panel slide animations: 300ms ease-out

**Loading States**:
- Skeleton screens for data tables and cards
- Spinner for form submissions (inside button)
- Shimmer effect for card loading

---

## Accessibility

- All interactive elements: min-h-12 touch target
- Form labels: explicitly associated with inputs
- Icon buttons: aria-label attributes
- Keyboard navigation: visible focus states throughout
- Screen reader: semantic HTML, ARIA landmarks
- Contrast ratios: maintain WCAG AA minimum
- Skip to main content link at top

---

## Images

**Dashboard Module Cards**: 24px Heroicons for each section (outline style)  
**Study Material Thumbnails**: 16:9 placeholder images for courses/videos (120px height)  
**User Avatar**: 40px circle in sidebar, 32px in bot messages  
**Empty States**: Simple SVG illustrations for empty lists (max 200px width)  

**No large hero images** - this is a data-focused productivity application prioritizing information density and functionality over marketing aesthetics.