import { LucideIcon } from "lucide-react";

interface StatusBadgeProps {
  icon: LucideIcon;
  label: string;
  variant?: "success" | "warning" | "error" | "neutral";
}

export function StatusBadge({
  icon: Icon,
  label,
  variant = "neutral",
}: StatusBadgeProps) {
  const variants = {
    success: "bg-emerald-100 text-emerald-700 border-emerald-200",
    warning: "bg-amber-100 text-amber-700 border-amber-200",
    error: "bg-red-100 text-red-700 border-red-200",
    neutral: "bg-white/20 text-white border-white/30",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${variants[variant]}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
    </div>
  );
}
