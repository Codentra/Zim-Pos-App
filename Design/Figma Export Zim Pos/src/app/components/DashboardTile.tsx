import { LucideIcon } from "lucide-react";

interface DashboardTileProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "primary" | "default";
  badge?: string;
}

export function DashboardTile({
  icon: Icon,
  label,
  onClick,
  variant = "default",
  badge,
}: DashboardTileProps) {
  const isPrimary = variant === "primary";

  return (
    <button
      onClick={onClick}
      className={`relative p-6 rounded-2xl shadow-md border transition-all active:scale-95 ${
        isPrimary
          ? "bg-gradient-to-br from-emerald-600 to-teal-600 border-emerald-500 text-white"
          : "bg-white border-gray-200 text-gray-800 hover:border-emerald-300"
      }`}
    >
      {badge && (
        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <Icon className={`w-8 h-8 mb-3 ${isPrimary ? "" : "text-emerald-600"}`} />
      <p className={`font-semibold ${isPrimary ? "" : "text-gray-800"}`}>
        {label}
      </p>
    </button>
  );
}
