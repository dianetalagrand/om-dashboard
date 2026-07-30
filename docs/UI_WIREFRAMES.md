# OM Catalog — UI Wireframes

## Page: Dashboard (Main)

```
┌────────────────────────────────────────────────────────────────┐
│ HEADER (sticky) — no login, visible to anyone on the network   │
│ OM GOVERNANCE PORTAL | v0.1 MVP                                │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ TABS                                                            │
│ [ACTIVE (2026)] [ARCHIVE (History)]                            │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ FILTER BAR (sticky, below tabs)                                │
│                                                                │
│ 🔍 Search streams...  |  Cluster: [All ▼]  | OutputType: [...]│
│ Status: [□] New [□] In Progress [□] Paused [□] Closed         │
│ Markets: [FR ▼] [Multi-select]                                │
│ Completeness: [0 ■━━━━━━━━━■ 100]                            │
│ [Apply Filters] [Reset]                                        │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ MAIN CONTENT AREA                                              │
│                                                                │
│ CLUSTER: OM Compliance-Evolution                              │
│ OUTPUT: Business Evolution | COMPLETENESS: ████░░ 65%         │
│ ─────────────────────────────────────────────────────────────── │
│                                                                │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │ 🚀 [OMG-12] Invoicing in PT (INIT-997)                │   │
│ │ ├─ Status: [In Progress]  Priority: [Urgent]           │   │
│ │ ├─ Markets: PT, ES, FR    Completeness: ████░░ 75%     │   │
│ │ ├─ Requester: Business    Updated: 26 Jul 2026         │   │
│ │ └─ [📋 Market Details ▼] [🔗 OM Log]                   │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                                │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │ 🚀 [OMG-X] Apertura Newco Romania (INIT-1004)          │   │
│ │ ├─ Status: [In Progress]  Priority: [Urgent]           │   │
│ │ ├─ Markets: RO (Tier 2)   Completeness: ███░░░░░░░ 40% │   │
│ │ ├─ Requester: Corporate   Updated: 20 Jul 2026         │   │
│ │ └─ [📋 Market Details ▼] [🔗 OM Log]                   │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                                │
│ CLUSTER: OM Compliance-Continuity                             │
│ OUTPUT: Corporate Compliance | COMPLETENESS: ██████░░░░ 60%   │
│ ─────────────────────────────────────────────────────────────── │
│                                                                │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │ ⚖️ [OMG-8] Osservanza Leggi FR (no INIT)               │   │
│ │ ├─ Status: [New]          Priority: [Normal]            │   │
│ │ ├─ Markets: FR            Completeness: ██░░░░░░░░ 20% │   │
│ │ ├─ Requester: OM Governance Updated: 10 Jul 2026       │   │
│ │ └─ [📋 Market Details ▼] [🔗 OM Log]                   │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                                │
│ [Load More Streams] or [Infinite scroll]                      │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Note**: this is the public view (anyone on the lastminute network, no login). The `[+ NEW STREAM]` and `[EDIT]` buttons appear **only** in Diane and Nathan's separate access — they're not visible here. There's no delete button: streams are never deleted, only transitioned to Closed when obsolete or done.

---

## Interaction: Create New Stream

**Trigger**: Click "[+ NEW STREAM]" button (top-right corner)

```
┌────────────────────────────────────────────────────────────────┐
│ MODAL DIALOG: NEW STREAM                                       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ Stream Name *                                                  │
│ [_________________ "Invoicing in PT"]                          │
│                                                                │
│ Init Code (optional)                                           │
│ [_________________ "INIT-997"]                                 │
│                                                                │
│ Cluster *                [OM Compliance-Evolution ▼]          │
│ Output Type * (multi-select)                                   │
│ [✓] Business Evolution  [ ] Market Expansion                   │
│ Status *                 [New ▼]                              │
│ Priority *               [Urgent ▼]                           │
│                                                                │
│ Requester *              [Business ▼]                         │
│ Markets * (multi-select)                                       │
│ [✓] FR  [✓] PT  [ ] ES  [ ] NL  [ ] IT  [ ] DE  [...]       │
│                                                                │
│ Completeness % *         [████░░░░░░ 40%]                     │
│                                                                │
│ Description (optional)                                         │
│ [________________________________________________]             │
│ [________________________________________________]             │
│ (max 500 chars)                                               │
│                                                                │
│ [SAVE STREAM] [CANCEL]                                        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Validation on submit**:
- Name: required, min 5 chars
- Cluster + OutputType: required
- Markets: min 1 selected
- If validation fails: highlight fields in red + show error message

**On success**:
- Modal closes
- Stream appears in list (top, highlighted in yellow for 3 seconds)
- Toast: "Stream OMG-999 created ✅"

---

## Interaction: Edit Stream

**Trigger**: Click "[EDIT]" on stream card

```
┌────────────────────────────────────────────────────────────────┐
│ SIDE PANEL: EDIT STREAM OMG-12                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ [Invoicing in PT]                                             │
│ ⚠️ Last edited by Diane on 26 Jul 2026 at 15:30               │
│                                                                │
│ ─────────────────────────────────────────────────────────────── │
│                                                                │
│ Status *                 [In Progress ▼]                      │
│ Priority *               [Urgent ▼]                           │
│ Completeness % *         [████░░░░░░ 75%]                     │
│                                                                │
│ Markets (editable)                                            │
│ [✓] PT [✓] ES [✓] FR [ ] NL [ ] IT                           │
│                                                                │
│ Description                                                   │
│ [________________________________________________]             │
│                                                                │
│ [SAVE CHANGES] [DISCARD] [HISTORY]                            │
│                                                                │
│ ─────────────────────────────────────────────────────────────── │
│ Version History:                                              │
│                                                                │
│ ✓ 2026-07-27 15:30 - Diane: Status In Progress → ...         │
│ ✓ 2026-07-26 10:24 - Diane: Created                          │
│                                                                │
│ [Close Panel]                                                 │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**On save**:
- Validation same as CREATE
- If success: "Stream updated ✅" + side panel closes
- Change log entry added: "Diane: Status In Progress → Closed (27 Jul 2026 16:00)"
- Notifications sent (Slack, email if configured)

**Click [HISTORY]** (read-only, no restore):
```
┌────────────────────────────────────────────────────────────────┐
│ VERSION HISTORY: OMG-12                                       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ 2026-07-27 15:30 - Diane                                     │
│ Status: In Progress → Closed                                  │
│ Completeness: 75% → 100%                                     │
│                                                                │
│ ────────────────────────────────────────────────────────────  │
│                                                                │
│ 2026-07-26 10:24 - Diane                                     │
│ CREATE: Invoicing in PT (INIT-997)                            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Interaction: Market Details Panel

**Trigger**: Click "[📋 Market Details]" on stream card

```
┌────────────────────────────────────────────────────────────────┐
│ MARKET DETAILS: Invoicing in PT                               │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ [Select market: [PT ▼] ES  FR]                                │
│                                                                │
│ ─────────────────────────────────────────────────────────────── │
│ PORTUGAL (PT) MARKET ARCHITECTURE                             │
│                                                                │
│ 📊 DISTRIBUTION CHAIN                                         │
│    [Screenshot from OM Market Architecture PPT]              │
│    (embedded image, clickable to expand)                      │
│                                                                │
│ 👤 DATA CONTROLLER                                            │
│    Name: LMNext PT Unipessoal Lda.                            │
│    Role: Data Controller for B2C operations                   │
│    Email: dataprotection@lmnext.pt                            │
│                                                                │
│ 📋 CONSENT & PROCESSING BY TOUCHPOINT                         │
│    [Matrix showing GDPR compliance per touchpoint]            │
│    • Web Navigation: ✅ Legal basis  ❌ Newsletter           │
│    • Basket & Personalization: ✅ All                        │
│    • Purchase & Interaction: ✅ All                          │
│                                                                │
│ 💼 MARKET ARCHITECTURE                                        │
│    Product Category: Flight & Train, Hotel, Tour Operator    │
│    Selling Company: Viaggiare S.r.l., LMNext PT S.r.l.      │
│    Revenue Model: Commission-based                            │
│    VAT Regime: PT Standard (23%)                             │
│    Liability Model: Commercial agent                          │
│                                                                │
│ 📄 LINKS                                                      │
│    • Full OM Log entry [link to Google Doc]                 │
│    • Jira ticket OMG-12 [link to Jira]                      │
│    • Market Architecture PPT [link to Google Drive]          │
│                                                                │
│ [Close Panel]                                                 │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Responsiveness**:
- Panel scrollable on desktop (max-height: 80vh)
- On mobile: full-screen modal (landscape: side-by-side, portrait: full)

---

## Page: Archive (History)

**Trigger**: Click "[ARCHIVE (History)]" tab

```
┌────────────────────────────────────────────────────────────────┐
│ TABS                                                            │
│ [ACTIVE (2026)] [ARCHIVE (History)]  ← YOU ARE HERE           │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ ARCHIVE: CLOSED STREAMS                                       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ 2026 CLOSED STREAMS (3 total)                                │
│ ─────────────────────────────────────────────────────────────── │
│ OM Compliance-Evolution: 1 completed                          │
│ OM Compliance-Continuity: 2 completed                         │
│ OM Compliance-Efficiency: 0 completed                         │
│                                                                │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │ 🚀 [OMG-7] Acquiring Service Evolution                 │   │
│ │ ├─ Status: ✓ CLOSED  Completed: 26 Jun 2026            │   │
│ │ ├─ Duration: 5 months  Init: LEG-891067                 │   │
│ │ └─ Markets: NL, IT, ES  Completeness: 100%              │   │
│ │                                                          │   │
│ │ [VIEW DETAILS]                                           │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                                │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │ ⚖️ [OMG-10] LMNext UK Asset Transfer                   │   │
│ │ ├─ Status: ✓ CLOSED  Completed: 31 May 2026            │   │
│ │ ├─ Duration: 3 months  Init: null                       │   │
│ │ └─ Markets: UK         Completeness: 100%               │   │
│ │                                                          │   │
│ │ [VIEW DETAILS]                                           │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                                │
│ ────────────────────────────────────────────────────────────── │
│                                                                │
│ 2025 CLOSED STREAMS (5 total)                                │
│ ─────────────────────────────────────────────────────────────── │
│ [... older closed streams ...]                               │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Page: Login

Doesn't exist — no login page. Anyone on the lastminute.com network opens the URL and sees the dashboard immediately, read-only. Diane and Nathan's editing access is a separate, simpler path (exact mechanism to be defined in Sprint 1), not a sign-in page with email/password/SSO.

---

## Mobile Responsiveness (Key breakpoints)

| Breakpoint | Layout | Notes |
|------------|--------|-------|
| **Desktop (≥1024px)** | 2-column (filters left sidebar, main content right) | Primary design |
| **Tablet (768-1023px)** | 1-column (filters above, content below) | Vertical stacking |
| **Mobile (<768px)** | 1-column, full-width | Hamburger menu for filters, market panel → full-screen modal |

---

## Accessibility

- **Keyboard navigation**: Tab, Enter, Arrow keys for all interactive elements
- **Screen reader**: Semantic HTML (h1, h2, button, input labels)
- **Color contrast**: WCAG AA (4.5:1 for text)
- **Focus indicator**: Clear blue outline on all focusable elements
- **Aria labels**: On icons, buttons without text

---

## Design System

**Colors**:
```
Primary: #2ABEB9 (Teal) — Evolution
Secondary: #F2007D (Pink) — Continuity
Tertiary: #4a86e8 (Blue) — Efficiency

Status colors:
  New: #FFC107 (Yellow)
  In Progress: #2196F3 (Blue)
  Paused: #FF9800 (Orange)
  Closed: #4CAF50 (Green)

Text: #1a1a1a (dark) on #ffffff (white)
Muted: #6b7280 (gray)
```

**Typography**:
```
Body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto (default sans-serif)
Size: 13px base
Weight: 400 normal, 600 bold, 700 extra-bold
Line height: 1.5
```

**Spacing**:
```
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 24px
```

**Shadows**:
```
sm: 0 1px 3px rgba(0,0,0,0.04)
md: 0 3px 12px rgba(0,0,0,0.09)
```

---

## Animations

- **Transitions**: 0.15s ease-in-out (hover, focus)
- **Loading spinner**: CSS rotation, 0.7s linear infinite
- **Toast notification**: Slide in from bottom (200ms), slide out after 3s
- **Modal open/close**: Fade (200ms)
- **List item add**: Highlight yellow for 3s, fade out

---

## Dark Mode (Future)

Post-MVP feature. Color scheme ready in design tokens but not implemented in v0.1.
