# Mental Scrapbook — Design System

> Source of truth for the visual language. The implementation lives in `constants/theme.ts` and `components/ui/**`. If you find yourself reaching for a literal value or hand-rolling a primitive, pull from this doc first.

---

## 1. Voice

Mental Scrapbook is a **calm, editorial journal that listens.** Every screen should feel:

- **Quiet.** Generous whitespace, a single focal element per view, no decoration that doesn't earn its place.
- **Warm.** Off-white paper, near-black ink, soft pastel accents — never cold gray-on-white.
- **Tactile.** Pill tab bar, rounded continuous corners, subtle haptics on every meaningful press.
- **Honest in copy.** Plain English, no jargon, no technical terms surfaced to the user (`OAuth`, `token`, `endpoint`, env vars, etc. never appear in UI strings).

If a screen feels busy, the fix is almost always **remove**, not redesign.

---

## 2. Color (light theme)

All colors are defined in `Colors.light` in `constants/theme.ts`. **Never inline a hex code in a screen or component** — pull from `Colors`.

### Neutrals (the page)

| Token                  | Hex       | Use                                                                         |
| ---------------------- | --------- | --------------------------------------------------------------------------- |
| `background`           | `#faf9f7` | The paper. Root of every screen. Slight warmth — never `#fff`.              |
| `surface`              | `#ffffff` | Cards, input fields, the tab bar pill, settings rows. Sits on `background`. |
| `surfaceContainer`     | `#efeeec` | Quiet wells — icon bubbles, perk row icons, search fields.                  |
| `surfaceContainerHigh` | `#e9e8e6` | Slightly louder fills — chat user bubble, profile avatar, section badges.   |

### Ink

| Token                        | Hex       | Use                                                                           |
| ---------------------------- | --------- | ----------------------------------------------------------------------------- |
| `onBackground` / `onSurface` | `#1a1c1b` | Primary text. Headlines, body, button labels on light fills.                  |
| `onSurfaceVariant`           | `#474741` | Muted text — captions, helper copy, inactive icons, "muted" prop on `<Text>`. |
| `outline`                    | `#c8c7bf` | All borders by default. 1px hairline on cards, inputs, day cells.             |
| `outlineStrong`              | `#777770` | Reserved — use when `outline` disappears against a colored fill.              |

### Primary (ink + voice)

| Token              | Hex       | Use                                                                                        |
| ------------------ | --------- | ------------------------------------------------------------------------------------------ |
| `primary`          | `#181916` | Filled buttons, active tab pill, selected calendar day, check badges. The "ink" CTA color. |
| `onPrimary`        | `#ffffff` | Text/icons on `primary` fills.                                                             |
| `primaryContainer` | `#2d2d2a` | Tonal step for elements that need to read primary-adjacent without going full black.       |
| `inverseSurface`   | `#2f3130` | Reserved for inverted/dark transient surfaces (toasts, overlays — not used yet).           |
| `inverseOnSurface` | `#f1f1ef` | Text on `inverseSurface`.                                                                  |

### Accent triad (the only colors)

Soft, dusty pastels. Use them **as a single dot, small chip, or thin accent** — never as a card fill, never as a CTA.

| Token            | Hex       | When                                                                  |
| ---------------- | --------- | --------------------------------------------------------------------- |
| `accentSage`     | `#98a895` | Voice "thinking" pulse, neutral chips, calm confirmations.            |
| `accentLavender` | `#a7a5c6` | General-todo chip dots, mic idle halo. The default decorative accent. |
| `accentBlue`     | `#9bb2c0` | Voice "speaking" pulse, sync/connection visuals, orb glow.            |

The accents rotate through the **Pulse** indicator during AI streaming — sage → lavender → blue. This is the only place all three appear together.

### Status

| Token   | Hex       | Use                                                                                                                                    |
| ------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `error` | `#ba1a1a` | Destructive labels (Sign Out, Disconnect tone), error banners, the left accent bar on **Important** todos. The only red in the system. |

### Specials

| Token                             | Use                                                        |
| --------------------------------- | ---------------------------------------------------------- |
| `glass` (`rgba(255,255,255,0.7)`) | Tint base for `<BlurView>` panes (orb stage, glass cards). |
| `tabActive` / `tabInactive`       | Resolved against the pill tab bar — don't reuse elsewhere. |
| `signUpHero` / `signUpCard`       | Reserved for the auth experience.                          |

### Color rules

1. **One primary fill per screen.** A screen has at most one black filled button.
2. **Accents are punctuation, not paragraphs.** A dot, a stroke, a tiny pulse — never a card background.
3. **Borders before shadows.** A 1px `outline` separator beats a drop shadow nine times out of ten.
4. **No system blue.** iOS link blue, Material blue 500, etc. are banned. If something looks linky, restyle it — don't recolor it.

---

## 3. Typography

Two families, loaded once in the root layout:

- **`Playfair Display`** — editorial / display. Used for headlines, the brand wordmark, and **numerals** (calendar day numbers, schedule times). Adds the "journal" warmth.
- **`Hanken Grotesk`** — UI / body. Used for everything else. Quiet, legible, slightly humanist.

### Type scale (`Typography` in `constants/theme.ts`)

Use the `<Text variant="…">` prop. Never set `fontSize`/`fontFamily` directly in a component.

| Variant     | Family / weight       | Size / line                       | Use                                                              |
| ----------- | --------------------- | --------------------------------- | ---------------------------------------------------------------- |
| `display`   | Playfair 600 SemiBold | 32 / 38, -0.5 tracking            | The screen brand wordmark ("Mental Scrapbook"). One per screen.  |
| `headline`  | Playfair 500 Medium   | 24 / 32                           | Page titles, screen hero titles, profile name.                   |
| `title`     | Playfair 500 Medium   | 20 / 28                           | Section headers (Important, Schedule, General).                  |
| `body`      | Hanken 400 Regular    | 16 / 26                           | Default copy. Cards, settings rows, chat bubbles.                |
| `bodySmall` | Hanken 400 Regular    | 14 / 20                           | Helper copy, captions, "muted" body, error banners.              |
| `label`     | Hanken 500 Medium     | 12 / 16, +0.6 tracking, UPPERCASE | Calendar weekday, settings section title, small metadata labels. |
| `button`    | Hanken 600 SemiBold   | 14 / 18, +1.2 tracking, UPPERCASE | All button labels. Never use anywhere else.                      |

### Type rules

- **Brand uses italic Playfair display** on the sign-in card (the only italic in the app).
- **Numerals are Playfair** even inside Hanken contexts (calendar day, schedule time, large counters). Use `fontFamily: 'PlayfairDisplay_500Medium'` explicitly on those `<Text>`s.
- **Muted means `onSurfaceVariant`**, set via `<Text muted>` — never hand-roll the color.
- **`selectable` is default** on the `<Text>` primitive. Don't disable it without reason — users copy quotes, todos, and emails.
- **Counter/timer numbers** get `fontVariant: ['tabular-nums']` to prevent jitter.
- **Truncate long titles** with `numberOfLines={1}` on chips and `numberOfLines={2}` on cards. Never let a card grow unbounded.

---

## 4. Spacing & layout

```ts
Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, screenPadding: 24 }
```

8-unit base. Prefer multiples of 8 — use `xs (4)` only for icon-tight gaps and pill internals.

### Layout rules

- **Every screen** sets `paddingHorizontal: Spacing.screenPadding` (24) on the scroll content. The tab bar gets its own horizontal inset.
- **Vertical rhythm between sections** is `Spacing.xl` (32). Between rows inside a section, `Spacing.sm`–`md`.
- **Card internal padding**: `Spacing.lg` (24) for prominent cards (status, perks); `Spacing.md` (16) for compact cards (priority, schedule).
- **List + chip gap**: `Spacing.sm + 2` (10) — slightly looser than `sm` to feel airy on narrow widths.
- **Bottom padding for scrollables** is 120–140 to clear the floating tab bar. Always.
- **Safe area**: rely on `useSafeAreaInsets()` for the tab bar and Capture dock. Headers can usually rely on `contentInsetAdjustmentBehavior="automatic"`.
- **Keyboard**: Capture wraps in `<KeyboardAvoidingView behavior="padding">` and listens to `keyboardWill(Show|Hide)` so the dock detaches from the tab bar when typing.

---

## 5. Radii & corners

```ts
Radii = { sm: 4, md: 12, lg: 16, xl: 24, pill: 9999 }
```

- **`sm`** — almost never; reserved for tiny inline shapes.
- **`md` (12)** — inputs, small cards (schedule item, todo chip), error banners.
- **`lg` (16)** — primary cards (priority, settings, status), calendar day cells, chat user bubble.
- **`xl` (24)** — the sign-in card and other hero surfaces.
- **`pill`** — buttons, the tab bar, calendar Today/Selected pills, status badges.

**Always set `borderCurve: 'continuous'`** on anything that isn't pill-shaped. The iOS continuous curve is the difference between "designed" and "default RN".

---

## 6. Elevation

We don't drop shadows. We use:

```ts
Shadows = {
    ambient: '0 12px 40px rgba(20, 20, 20, 0.04)',
    orb: '0 24px 64px rgba(155, 178, 192, 0.25)'
}
```

- **`Shadows.ambient`** — a soft, almost-imperceptible glow under floating surfaces (calendar pills, settings section card, priority card). Applied via the `boxShadow` CSS string — never `shadowOffset`/`elevation`.
- **`Shadows.orb`** — only the mic button uses a custom blue-cast shadow; the orb itself is shadow-less to stay weightless on the page.
- **Glass** — frosted panes use `<BlurView intensity={20–40} tint="light">` over a pastel gradient. Used on the Capture orb and the optional glass-pane wrapper. Not used for solid cards.

If a card needs more separation, add a **1px `outline` border** — don't crank the shadow.

---

## 7. Iconography

- **One icon set** — `Ionicons` from `@expo/vector-icons`. Use `-outline` variants by default; fall back to filled only for active states (active mic, check badge).
- **Sizes**: 13 (pill inline), 16 (badge), 18 (chevrons, inline meta), 20 (settings row, input toggle), 22 (tab bar, checkbox), 28 (hero icon bubble).
- **Color** is always a theme token — `onBackground` (active), `onSurfaceVariant` (muted), `onPrimary` (on dark fills), `error` (destructive).
- **Icon bubble** pattern (used for hero icons and perk rows): circle of `surfaceContainer`, icon centered in `onSurfaceVariant` or `primary`.

---

## 8. Motion

- **Reanimated** for everything visual. No `Animated` from RN.
- **Capture orb** — slow vertical float (-10 → 10, 2.4s sine in/out) + 18s linear rotation. Both `withRepeat(..., -1)`. Set once on mount, no dependency thrash.
- **Mic halo** — pulse scale + fade. Two states: idle (gentle, 2.4s) and active (fast and louder, 0.8s, brighter coral). Halo color swaps with state.
- **Press feedback** — `transform: [{ scale: 0.94 }]` on mic, `opacity: 0.88` on buttons. Subtle. The haptic does the heavy lifting.
- **Entering/exiting** — for now, rely on Expo Router defaults. When adding custom transitions, use Reanimated layout animations (`FadeIn`, `SlideInDown`) not LayoutAnimation.
- **No spinners on buttons.** Disable the button and swap the label to `Connecting…` / `Disconnecting…` / `Signing in…`. Use `<ActivityIndicator>` only for full-screen loading states.

---

## 9. Haptics (`lib/infrastructure/haptics.ts`)

Polish, never required. Use only `tap(tone)`:

| Tone        | When                                           |
| ----------- | ---------------------------------------------- |
| `light`     | Text send, secondary tap, mic release.         |
| `medium`    | Primary CTA press, mic press-in.               |
| `selection` | Tab switch, settings row, calendar day select. |
| `success`   | Sign-in success, action confirmed.             |
| `warning`   | Destructive intent (Sign Out before confirm).  |
| `error`     | Request failure, mic failure.                  |

Never `await` it. Never throw from it.

---

## 10. Component library

All primitives live in `components/ui/**`. Composed pieces live in feature folders (`components/capture/`, `components/insights/`, `components/profile/`, `components/layout/`).

### Primitives (`components/ui/`)

- **`<Text variant muted selectable>`** — the only way to render text. Wraps RN `<Text>` with the type scale.
- **`<Button label variant="primary" | "ghost">`** — pill, `Spacing.md/lg` padding, uppercase `button` label. Primary is `primary`/`onPrimary`; ghost is transparent with `outline` border. Medium haptic baked in.
- **`<Input label error secureTextEntry>`** — label above, 1px `outline`, `Radii.md`, eye toggle when `secureTextEntry`. Optional error below in `error` color.
- **`<PillTabBar />`** — custom `tabBar` for the `<Tabs>` navigator. Floating, 24px from each edge, `surface` pill with active tab swapping to a `primary` pill inside.
- **`<GlassPane />`** — wrapper that adds a `BlurView` behind children. Use sparingly.

### Capture (`components/capture/`)

- **`<CaptureOrb />`** — 220px circle, multi-stop pastel `LinearGradient` (sky-blue → mint → lavender → dusk-blue), `BlurView intensity={40}` overlay, two absolutely-positioned highlight blobs. Floating + rotating Reanimated style. **No shadow** on the orb itself.
- **`<MicButton active onPressIn onPressOut />`** — 48px circle, pastel gradient (idle: blue→lavender; active: coral→red), pulsing halo behind. Press scales to 0.94. Coral-tinted shadow.
- **`<VoiceInputBar value onChangeText onMicPressIn onMicPressOut onSubmit statusMessage disabled recording />`** — 1px `outline` rounded input on the left, mic on the right. Send button (`primary` circle, 36px, arrow-up) appears inside the input when text is present. Status message below in centered muted `bodySmall`.
- **`<TranscriptStream messages />`** — ChatGPT-style transcript. User messages: right-aligned `surfaceContainerHigh` bubble, max 88% width. Assistant messages: full-width markdown render, no bubble.

### Insights (`components/insights/`)

- **`<CalendarStrip />`** — horizontal scrolling strip of 91 days (45 before/45 after today). Each day is a 56px-wide rounded card with weekday label + Playfair day number. Today: `primary` border + small dot. Selected: filled `primary`. Month label updates on scroll; **floating Today / Selected pills** appear (in that order) when the relevant day scrolls > 60% off-center.
- **`<SectionHeader title count />`** — Playfair `title` left, optional count badge right (pill, `surfaceContainerHigh` fill, muted Hanken Medium 12).
- **`<PriorityCard title notes timeLabel />`** — `surface`, `Radii.lg`, ambient shadow. **Left edge has a 4px `error` accent bar** (the one place red appears in lists). Hollow circle checkbox, body in Hanken Medium, optional meta line with clock icon + muted `bodySmall`.
- **`<ScheduleTimeline items />`** — vertical timeline. Subtle 1px `outline` line on the left, each row gets a small primary-outlined dot marker. Time label in Playfair, title in Hanken Medium. Items in `Radii.md` cards.
- **`<TodoChip title />`** — `surface`, `Radii.md`, single row with a small `accentLavender` dot. Truncates to one line.

### Profile (`components/profile/`)

- **`<SettingsSection title>{rows}</SettingsSection>`** — uppercase `label` muted title outside, rounded `surface` card with ambient shadow as the container. Rows stack inside.
- **`<SettingsRow label icon onPress destructive />`** — icon, label, right chevron. Destructive uses `error` color for icon + label and a warning haptic.

### Layout (`components/layout/`)

- **`<ScreenHeader />`** — center-aligned 28px Playfair "Mental Scrapbook" wordmark. One per top-level tab screen.

---

## 11. Screen patterns

### Auth (`app/(auth)/`)

- Centered, single-column. Brand wordmark in italic Playfair at the top. White `Radii.xl` card houses a scaled-down `CaptureOrb` as visual anchor, then the form, then the secondary link.
- Forms: stacked `Input`s + a single primary `Button`. Errors render inline above the button. No social auth buttons.

### Capture (`app/(app)/index.tsx`)

- The hero. `ScreenHeader` → `CaptureOrb` → `TranscriptStream` (only renders when messages exist). The orb is the focal point of an empty state — no text, no instructions.
- `VoiceInputBar` docks at the bottom, offset above the tab bar. When the keyboard opens, the dock detaches and rides the keyboard.
- Status message updates as Capture state transitions: `Your mind is clear.` → `Listening…` → `Thinking…` → `Speaking…`.

### Insights (`app/(app)/insights.tsx`)

- `ScreenHeader` → `CalendarStrip` → three sections (`Important`, `Schedule`, `General`), each with `SectionHeader` + content (or muted empty state).
- Sections are separated by `Spacing.xl`. Each section follows its own component pattern (cards / timeline / chips).
- Empty states are single muted sentences — never illustrations.

### Profile (`app/(app)/profile/`)

- Tab root: avatar (96px `surfaceContainerHigh` circle, initial in `headline`), name, muted streak line, then `SettingsSection`s grouped by **Account → Preferences → Session**.
- Sub-screens are pushed onto a profile stack with the native back button. Each starts with a single muted intro `bodySmall`, then content. No tab bar visible on sub-screens.
- **Connection screens** (Sync Gmail) follow a three-part pattern:
    1. Hero block — circular icon bubble, headline, one-line muted body. Headline swaps between disconnected / connected.
    2. Content card — perks list (disconnected) or status card with check badge + email (connected).
    3. Single CTA — `Connect …` / `Disconnect …` with progress label.

### Tab bar

- Floats above content, 24px from each edge. `surface` pill, 4px internal padding. Active tab swaps to a filled `primary` inner pill. Order: **Insights · Capture · Profile** — Capture is the default tab.

---

## 12. Copy

Plain, second-person, never apologetic.

- **Calm headlines.** "Connect your Gmail." not "Let's get you set up with Gmail!". Period, not exclamation.
- **Single-sentence sub-copy.** If you need a paragraph, you've described too much.
- **Map errors to friendly strings.** Components catch raw errors and render mapped messages from a `friendlyError()` helper. The UI never shows `OAuth response was incomplete`, `EXPO_PUBLIC_…`, or stack traces.
- **Status, not technical state.** "Connecting…" not "Exchanging authorization code…". "Listening…" not "Recording PCM at 16kHz…".
- **Empty states are quiet.** "Nothing important for this day." — one muted line, no illustration, no CTA.
- **Sentence case** for buttons and titles. Exceptions: the `label` and `button` variants, which are deliberately UPPERCASE for tiny labels.

---

## 13. Accessibility

- **`accessibilityLabel`** on every icon-only Pressable (mic, send button, password reveal, tab bar buttons).
- **`accessibilityRole`** when it isn't obvious (`button` on password reveal toggle).
- **`accessibilityState={{ busy, disabled }}`** on the mic during recording / disabled.
- **Hit targets** ≥ 44pt for any standalone tappable. Use `hitSlop={8}` on small icon buttons (password toggle).
- **Contrast**: `onSurfaceVariant` on `background` and `surface` passes WCAG AA. Don't push muted text lighter than `onSurfaceVariant`.
- **`selectable` default** on `<Text>` makes copy/paste work out of the box.

---

## 14. What's not in the system

If you find yourself wanting one, stop and ask before adding it.

- **Drop shadows.** Use `Shadows.ambient` or a border.
- **System blue / Material colors / iOS link blue.** All foreign.
- **A third typeface.** Two families is the limit.
- **Card fills in accent colors.** Accents are dots and strokes, not surfaces.
- **Illustrations or stickers.** The orb is the only decorative shape.
- **Skeleton loaders.** Use a centered `ActivityIndicator` or a muted "Loading…" line.
- **Tooltips, modals over modals, accordions.** Push a new screen or split the content.
- **More than one primary button per screen.** If you need two, one becomes `ghost`.

---

## 15. When adding a new screen

1. Drop in `ScreenHeader` if it's a tab root; otherwise rely on the stack header.
2. Define the hero — a single sentence or a single element. If you can't name it in one phrase, the screen is doing too much.
3. Compose from existing primitives. If you need a new variant, add it to `components/ui/**` (not inline in the screen).
4. All values come from `Colors`, `Spacing`, `Radii`, `Shadows`, `Typography`. **No literals.**
5. Map every async state: loading (`ActivityIndicator` or muted line), empty (one muted sentence), error (friendly string in an error banner), success (the happy UI).
6. Add haptics on every meaningful press via `tap(tone)`.
7. Read the screen aloud. If a sentence sounds like a developer wrote it, rewrite it.
