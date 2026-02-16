import { Outlet } from "react-router";
import { MobileStatusBar } from "../components/MobileStatusBar";
import { ScreenNavigation } from "../components/ScreenNavigation";
import { ThemeProvider } from "../contexts/ThemeContext";

export function Root() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-900">
        {/* Mobile App Container - Max width 430px (iPhone 14 Pro Max width) */}
        <div className="max-w-[430px] mx-auto min-h-screen bg-white dark:bg-gray-900 relative overflow-hidden">
          {/* Mobile Status Bar */}
          <MobileStatusBar />
          
          {/* App Content */}
          <div className="h-[calc(100vh-28px)] overflow-y-auto">
            <Outlet />
          </div>
          
          {/* Demo Navigation Helper */}
          <ScreenNavigation />
        </div>
      </div>
    </ThemeProvider>
  );
}