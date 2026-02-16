# Figma → ZimPOS App Reference

Single source of truth for building the Expo/React Native app UI from the Figma design export.

---

## 1. Design tokens

Use these values in the app so the UI matches Figma. The app already has `constants/theme.ts`; align or extend it with the following.

### Colors (Figma design system per ZIMPOS_DOCUMENTATION)

| Token        | Light (hex) | Dark (hex) | Notes                    |
|-------------|-------------|------------|--------------------------|
| Primary     | `#10b981`   | `#34d399`  | Emerald (brand)          |
| Primary alt | `#14b8a6`   | `#2dd4bf`  | Teal (gradient end)      |
| Success     | Green       | Green      | Confirmations, success   |
| Warning     | Amber       | Amber      | Expired, user limit      |
| Error       | Red         | Red        | Errors, destructive      |
| Info        | Blue        | Blue       | Informational            |

### Colors (from Figma theme.css – raw variables)

- **Light:** `--background: #ffffff`, `--foreground: oklch(0.145 0 0)`, `--primary: #030213`, `--muted: #ececf0`, `--muted-foreground: #717182`, `--destructive: #d4183d`, `--border: rgba(0,0,0,0.1)`, `--input-background: #f3f3f5`
- **Dark:** background/foreground invert; primary becomes light for contrast.
- **Recommendation:** Use the doc system (Emerald/Teal) for brand; use theme.css for neutrals (background, surface, text, border, muted) if you want pixel match.

### Spacing & layout

| Token   | Value   | Usage              |
|--------|---------|--------------------|
| Base   | 16px    | Default font-size   |
| Spacing| 16–24px | Between sections   |
| Radius | 12–20px | Cards, buttons     |
| Tap min| 44px    | Min touch target    |
| Max width | ~430px | Mobile-first width  |

### Typography

- **Font:** Sans-serif; strong numeric readability.
- **Weights:** 400 (normal), 500 (medium).
- **Hierarchy:** h1 (2xl/medium), h2 (xl/medium), h3 (lg/medium), h4 (base/medium); labels and buttons base/medium; input base/normal.
- **Line height:** 1.5.

### App theme alignment

Current `constants/theme.ts` already uses emerald/teal and spacing. When building screens:

- Use `colors.light` / `colors.dark` from theme (and `useColors()` / `useTheme()`).
- Add any missing tokens (e.g. `muted`, `inputBackground`, `destructive`) to theme if Figma uses them.
- Keep border radius in the 12–20px range; app has `borderRadius.md: 10` — consider increasing to 12 for cards.

---

## 2. Screen map: Figma → Expo app route

| # | Figma screen / doc name     | App route (expo-router)        | App file path |
|---|-----------------------------|---------------------------------|---------------|
| 1 | Splash                      | `/`                             | `app/index.tsx` |
| 2 | Welcome                     | `/welcome`                      | `app/welcome.tsx` |
| 3 | Login                       | `/(auth)/login`                  | `app/(auth)/login.tsx` |
| 4 | Default PIN                 | `/(auth)/default-pin`           | `app/(auth)/default-pin.tsx` |
| 5 | Change PIN                  | `/(auth)/set-pin`               | `app/(auth)/set-pin.tsx` |
| 6 | Business Registration       | `/(auth)/register-business`     | `app/(auth)/register-business.tsx` |
| 7 | Subscription Plans          | `/(auth)/plans`                  | `app/(auth)/plans.tsx` |
| 8 | Subscription Payment        | `/(auth)/payment-subscription`   | `app/(auth)/payment-subscription.tsx` |
| 9 | Subscription Confirmation   | `/(auth)/subscription-confirm`  | `app/(auth)/subscription-confirm.tsx` |
|10 | Subscription Expired        | `/(auth)/subscription-expired`  | `app/(auth)/subscription-expired.tsx` |
|11 | User Limit Warning          | *(no dedicated route)*          | Consider modal or `/(auth)/` screen |
|12 | Sync Subscription Status    | *(no dedicated route)*          | Can merge into `/(main)/settings/sync-status` |
|13 | Onboarding                  | `/(auth)/onboarding`            | `app/(auth)/onboarding.tsx` |
|14 | Dashboard                   | `/(main)/dashboard`              | `app/(main)/dashboard.tsx` |
|15 | Products List               | `/(main)/products`               | `app/(main)/products/index.tsx` |
|16 | Add/Edit Product            | `/(main)/products/add`, `/(main)/products/[id]` | `app/(main)/products/add.tsx`, `app/(main)/products/[id].tsx` |
|17 | Stock Receiving             | `/(main)/stock`                  | `app/(main)/stock/index.tsx` |
|18 | New Sale                    | `/(main)/sale`                   | `app/(main)/sale/index.tsx` |
|19 | Payment                     | `/(main)/sale/payment`           | `app/(main)/sale/payment.tsx` |
|20 | Receipt                     | `/(main)/sale/receipt`           | `app/(main)/sale/receipt.tsx` |
|21 | Customers List              | `/(main)/customers`              | `app/(main)/customers/index.tsx` |
|22 | Customer Details            | `/(main)/customers/[id]`         | `app/(main)/customers/[id].tsx` |
|23 | Add/Edit Customer           | `/(main)/customers/add`, `/(main)/customers/[id]/edit` | `app/(main)/customers/add.tsx`, `app/(main)/customers/[id]/edit.tsx` |
|24 | Reports                     | `/(main)/reports`                | `app/(main)/reports/index.tsx` |
|25 | Cash Management             | `/(main)/cash`                   | `app/(main)/cash/index.tsx` |
|26 | Refunds                     | `/(main)/refunds`                | `app/(main)/refunds/index.tsx` |
|27 | System Status               | `/(main)/system-status`         | `app/(main)/system-status.tsx` |
|28 | Activity Logs               | `/(main)/activity-logs`         | `app/(main)/activity-logs.tsx` |
|29 | Hardware Setup              | `/(main)/hardware-setup`         | `app/(main)/hardware-setup.tsx` |
|30 | Settings Home               | `/(main)/settings`               | `app/(main)/settings/index.tsx` |
|31 | User Profile                | `/(main)/settings/user-profile`  | `app/(main)/settings/user-profile.tsx` |
|32 | Security & PIN              | `/(main)/settings/security-pin`  | `app/(main)/settings/security-pin.tsx` |
|33 | Notifications               | `/(main)/settings/notifications` | `app/(main)/settings/notifications.tsx` |
|34 | Business Details            | `/(main)/settings/business-details` | `app/(main)/settings/business-details.tsx` |
|35 | Receipt Settings            | `/(main)/settings/receipt-settings` | `app/(main)/settings/receipt-settings.tsx` |
|36 | Sync Status                 | `/(main)/settings/sync-status`   | `app/(main)/settings/sync-status.tsx` |
|— | Backup Data                 | `/(main)/settings/backup-data`   | `app/(main)/settings/backup-data.tsx` |

---

## 3. Figma export folder structure (reference)

Design source lives in:

```
Design/Figma Export Zim Pos/
├── INDEX.md              → Navigation hub, route list
├── SCREEN_SUMMARY.md     → Copy-paste friendly screen descriptions
├── ZIMPOS_DOCUMENTATION.md → Full design system & 36 screens
├── src/
│   ├── styles/
│   │   ├── theme.css     → CSS variables (colors, radius, typography)
│   │   ├── mobile.css    → Touch, scroll, 16px input
│   │   └── ...
│   └── app/
│       ├── pages/        → One TSX per screen (web/React)
│       │   ├── Splash.tsx, Login.tsx, Dashboard.tsx, ...
│       │   ├── subscription/  → BusinessRegistration, Plans, Payment, ...
│       │   └── settings/      → UserProfile, SecurityPIN, SyncStatus, ...
│       └── components/
│           ├── ui/       → shadcn-style components (reference only)
│           └── figma/    → ImageWithFallback, etc.
```

Use **pages/** as layout and content reference only; do not copy web code into the RN app. Use **theme.css** and **ZIMPOS_DOCUMENTATION.md** for tokens and behavior.

---

## 4. Build order (recommended)

Implement in this order so the app stays runnable and flows make sense:

1. **Theme** – Add any missing tokens to `constants/theme.ts` (no screen changes yet).
2. **Auth flow** – Splash → Welcome → Login → Default PIN → Set PIN (then onboarding if needed).
3. **Subscription flow** – Register business → Plans → Payment → Confirmation (and Expired when needed).
4. **Main shell** – Dashboard with correct layout and nav to Sale, Products, Customers, Reports, Cash, Refunds, Stock, Activity, System, Hardware, Settings.
5. **Sale flow** – New Sale → Payment → Receipt.
6. **Products** – List, Add, Edit (and product detail if separate).
7. **Customers** – List, Add, Detail, Edit.
8. **Reports, Cash, Refunds, Stock** – One by one.
9. **Settings** – Settings home then each sub-screen (Profile, Security, Notifications, Business, Receipt, Sync, Backup).

---

## 5. Component mapping (Figma → React Native)

Use a small set of RN components so all screens match the design system:

| Figma / design element | React Native approach |
|------------------------|------------------------|
| Primary button         | `TouchableOpacity` + theme `primary` bg, `primaryText`, min height 44, radius 12 |
| Secondary / outline btn | Same with border, transparent bg |
| Input / text field     | `TextInput` with `inputBackground` (or surface), border, padding 16 |
| Card                   | `View` with `surface` bg, border, radius 12–20, padding 16–24 |
| List row               | `TouchableOpacity` with flex row, 44 min height, border bottom |
| Badge / chip           | Small `View` + `Text`, radius full or 8, muted or primary tint |
| Toggle / switch        | RN `Switch` or custom; use `primary` for on state |
| Screen container       | `View` flex 1, `theme.background`; safe area; optional ScrollView |
| Section title          | `Text` with theme `text`, font size 18–20, weight 600 |

Keep these in a single place (e.g. `components/ui/` or `components/design/`) and reuse so the app stays consistent with Figma.

---

## 6. Mobile UX notes (from Figma mobile.css)

- Prevent zoom on input focus (e.g. 16px font on inputs).
- Touch feedback: active opacity 0.7 or scale 0.98.
- No text selection on buttons.
- Smooth scrolling where lists exist.
- Hide scrollbars for a cleaner look where appropriate.

---

## 7. Where to look for each screen

For each app route, open the matching file under `Design/Figma Export Zim Pos/src/app/pages/` (or `pages/subscription/`, `pages/settings/`) to see layout, sections, and copy. Use **SCREEN_SUMMARY.md** for short descriptions and **ZIMPOS_DOCUMENTATION.md** for full behavior (validation, states, Zimbabwe payments, etc.).

---

*Last updated from Figma export and app structure. Use this doc as the single reference when building or refactoring UI.*
