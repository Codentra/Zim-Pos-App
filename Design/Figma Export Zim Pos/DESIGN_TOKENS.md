# ZimPOS Design Tokens (quick reference)

Extracted from `src/styles/theme.css`, `ZIMPOS_DOCUMENTATION.md`, and `INDEX.md` for use when building the Expo app. See **Design/FIGMA_TO_APP.md** for full mapping and usage.

---

## Colors (brand – use in app)

| Name      | Light     | Dark      |
|-----------|-----------|-----------|
| Primary   | `#10b981` | `#34d399` |
| Teal      | `#14b8a6` | `#2dd4bf` |
| Success   | Green     | Green     |
| Warning   | Amber     | Amber     |
| Error     | Red       | Red       |

## Colors (theme.css variables)

**Light (`:root`)**  
`--background: #ffffff` · `--foreground: oklch(0.145 0 0)` · `--primary: #030213` · `--muted: #ececf0` · `--muted-foreground: #717182` · `--destructive: #d4183d` · `--border: rgba(0,0,0,0.1)` · `--input-background: #f3f3f5`

**Dark (`.dark`)**  
Background/foreground inverted; primary light; muted and border adjusted for dark.

## Radius

`--radius: 0.625rem` (10px) · sm: −4px · md: −2px · lg: 10px · xl: +4px  
Design doc: **12–20px** for cards and buttons.

## Typography

- Base font-size: **16px**
- Weights: **400** (normal), **500** (medium)
- Line height: **1.5**
- Labels/buttons: base, medium · Input: base, normal

## Layout & touch

- Spacing: **16–24px**
- Min tap target: **44px**
- Max width: **~430px** (mobile-first)

## Mobile (mobile.css)

- Input/select/textarea: **16px** (prevent zoom)
- Touch feedback: opacity **0.7**, scale **0.98** on active
- Buttons: no text selection, no tap highlight
