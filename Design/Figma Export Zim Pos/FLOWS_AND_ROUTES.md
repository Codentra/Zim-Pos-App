# ZimPOS flows and routes (for app implementation)

Quick reference by **user flow**. Use with **Design/FIGMA_TO_APP.md** for exact app file paths.

---

## 🔐 Auth flow

1. **Splash** → `app/index.tsx`
2. **Welcome** → `app/welcome.tsx`
3. **Login** → `app/(auth)/login.tsx`
4. **Default PIN** → `app/(auth)/default-pin.tsx`
5. **Set/Change PIN** → `app/(auth)/set-pin.tsx`

---

## 💳 Subscription flow (new business)

6. **Register business** → `app/(auth)/register-business.tsx`
7. **Plans** → `app/(auth)/plans.tsx`
8. **Payment** → `app/(auth)/payment-subscription.tsx`
9. **Confirmation** → `app/(auth)/subscription-confirm.tsx`

**Other:** Expired → `app/(auth)/subscription-expired.tsx`. User limit / sync subscription: no dedicated route; use modal or settings/sync screen.

---

## 🏠 First-time and main home

10. **Onboarding** → `app/(auth)/onboarding.tsx`
11. **Dashboard** → `app/(main)/dashboard.tsx`

---

## 💰 Sale flow

12. **New sale** → `app/(main)/sale/index.tsx`
13. **Payment** → `app/(main)/sale/payment.tsx`
14. **Receipt** → `app/(main)/sale/receipt.tsx`

---

## 📦 Products

15. **List** → `app/(main)/products/index.tsx`
16. **Add** → `app/(main)/products/add.tsx`
17. **Detail/Edit** → `app/(main)/products/[id].tsx`, `app/(main)/products/[id]/edit.tsx` (if separate)
18. **Stock** → `app/(main)/stock/index.tsx`

---

## 👥 Customers

19. **List** → `app/(main)/customers/index.tsx`
20. **Add** → `app/(main)/customers/add.tsx`
21. **Detail** → `app/(main)/customers/[id].tsx`
22. **Edit** → `app/(main)/customers/[id]/edit.tsx`

---

## 📊 Reports, cash, refunds

23. **Reports** → `app/(main)/reports/index.tsx`
24. **Cash** → `app/(main)/cash/index.tsx`
25. **Refunds** → `app/(main)/refunds/index.tsx`

---

## 🔧 System and settings

26. **System status** → `app/(main)/system-status.tsx`
27. **Activity logs** → `app/(main)/activity-logs.tsx`
28. **Hardware setup** → `app/(main)/hardware-setup.tsx`
29. **Settings home** → `app/(main)/settings/index.tsx`
30. **User profile** → `app/(main)/settings/user-profile.tsx`
31. **Security & PIN** → `app/(main)/settings/security-pin.tsx`
32. **Notifications** → `app/(main)/settings/notifications.tsx`
33. **Business details** → `app/(main)/settings/business-details.tsx`
34. **Receipt settings** → `app/(main)/settings/receipt-settings.tsx`
35. **Sync status** → `app/(main)/settings/sync-status.tsx`
36. **Backup data** → `app/(main)/settings/backup-data.tsx`

---

Figma page names and screen numbers match **INDEX.md** and **SCREEN_SUMMARY.md** in this folder.
