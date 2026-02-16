import { Battery, Signal, Wifi } from "lucide-react";

export function MobileStatusBar() {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="bg-black text-white px-6 py-2 flex items-center justify-between text-xs">
      <span className="font-semibold">{time}</span>
      <div className="flex items-center gap-2">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <Battery className="w-4 h-4" />
      </div>
    </div>
  );
}
