import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Splash } from "./pages/Splash";
import { Welcome } from "./pages/Welcome";
import { Login } from "./pages/Login";
import { DefaultPIN } from "./pages/DefaultPIN";
import { ChangePIN } from "./pages/ChangePIN";
import { Dashboard } from "./pages/Dashboard";
import { Products } from "./pages/Products";
import { AddProduct } from "./pages/AddProduct";
import { NewSale } from "./pages/NewSale";
import { Payment } from "./pages/Payment";
import { Receipt } from "./pages/Receipt";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { CashManagement } from "./pages/CashManagement";
import { Refunds } from "./pages/Refunds";
import { Customers } from "./pages/Customers";
import { CustomerDetails } from "./pages/CustomerDetails";
import { AddCustomer } from "./pages/AddCustomer";
import { SystemStatus } from "./pages/SystemStatus";
import { ActivityLogs } from "./pages/ActivityLogs";
import { Onboarding } from "./pages/Onboarding";
import { StockReceiving } from "./pages/StockReceiving";
import { HardwareSetup } from "./pages/HardwareSetup";
import { BusinessRegistration } from "./pages/subscription/BusinessRegistration";
import { SubscriptionPlans } from "./pages/subscription/SubscriptionPlans";
import { SubscriptionPayment } from "./pages/subscription/SubscriptionPayment";
import { SubscriptionConfirmation } from "./pages/subscription/SubscriptionConfirmation";
import { SubscriptionExpired } from "./pages/subscription/SubscriptionExpired";
import { UserLimitWarning } from "./pages/subscription/UserLimitWarning";
import { SyncSubscriptionStatus } from "./pages/subscription/SyncSubscriptionStatus";
import { UserProfile } from "./pages/settings/UserProfile";
import { SecurityPIN } from "./pages/settings/SecurityPIN";
import { Notifications } from "./pages/settings/Notifications";
import { BusinessDetails } from "./pages/settings/BusinessDetails";
import { ReceiptSettings } from "./pages/settings/ReceiptSettings";
import { SyncStatus } from "./pages/settings/SyncStatus";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Splash },
      { path: "welcome", Component: Welcome },
      { path: "login", Component: Login },
      { path: "default-pin", Component: DefaultPIN },
      { path: "change-pin", Component: ChangePIN },
      { path: "onboarding", Component: Onboarding },
      { path: "dashboard", Component: Dashboard },
      { path: "products", Component: Products },
      { path: "products/add", Component: AddProduct },
      { path: "products/:productId/edit", Component: AddProduct },
      { path: "stock-receiving", Component: StockReceiving },
      { path: "new-sale", Component: NewSale },
      { path: "payment", Component: Payment },
      { path: "receipt", Component: Receipt },
      { path: "reports", Component: Reports },
      { path: "customers", Component: Customers },
      { path: "customers/add", Component: AddCustomer },
      { path: "customers/:customerId", Component: CustomerDetails },
      { path: "customers/:customerId/edit", Component: AddCustomer },
      { path: "settings", Component: Settings },
      { path: "settings/user-profile", Component: UserProfile },
      { path: "settings/security-pin", Component: SecurityPIN },
      { path: "settings/notifications", Component: Notifications },
      { path: "settings/business-details", Component: BusinessDetails },
      { path: "settings/receipt-settings", Component: ReceiptSettings },
      { path: "settings/sync-status", Component: SyncStatus },
      { path: "system-status", Component: SystemStatus },
      { path: "activity-logs", Component: ActivityLogs },
      { path: "hardware-setup", Component: HardwareSetup },
      { path: "cash-management", Component: CashManagement },
      { path: "refunds", Component: Refunds },
      { path: "subscription/register", Component: BusinessRegistration },
      { path: "subscription/plans", Component: SubscriptionPlans },
      { path: "subscription/payment", Component: SubscriptionPayment },
      { path: "subscription/confirmation", Component: SubscriptionConfirmation },
      { path: "subscription/expired", Component: SubscriptionExpired },
      { path: "subscription/user-limit", Component: UserLimitWarning },
      { path: "subscription/sync-status", Component: SyncSubscriptionStatus },
    ],
  },
]);
