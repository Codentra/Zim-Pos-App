# ZimPOS Engagement Flow

Reference for the full user journey and interface architecture.

## Entry Flow

1. **Splash** (/) – Boot checks, 2–3s, then route
2. **Welcome** (/welcome) – Register New Business | Login to Existing Business
3. **Register** → Business info → Plans (Trial/Starter/Business) → Subscription confirm
4. **Login** – PIN keypad, default PIN 1234 for new owners
5. **Default PIN notice** → **Set PIN** (mandatory for new)
6. **Onboarding wizard** – Add product, payment methods, opening cash, finish
7. **Dashboard** – Main POS

## Dev testing

- Default PIN: `1234`
- After Register: business + owner created, redirect to Login
- Enter 1234 → Default PIN notice → Set PIN → Onboarding → Dashboard
- Existing DBs: migration v4 creates default business for legacy installs
