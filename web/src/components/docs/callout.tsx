import { cn } from "@/lib/utils";
import { Info, Lightbulb, AlertTriangle, OctagonAlert } from "lucide-react";

interface CalloutProps {
  type: "note" | "tip" | "warning" | "danger";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const calloutConfig = {
  note: {
    icon: Info,
    label: "Note",
    container: "bg-blue-50 border-blue-200 text-blue-900",
    iconColor: "text-blue-600",
  },
  tip: {
    icon: Lightbulb,
    label: "Tip",
    container: "bg-green-50 border-green-200 text-green-900",
    iconColor: "text-green-600",
  },
  warning: {
    icon: AlertTriangle,
    label: "Warning",
    container: "bg-yellow-50 border-yellow-200 text-yellow-900",
    iconColor: "text-yellow-600",
  },
  danger: {
    icon: OctagonAlert,
    label: "Danger",
    container: "bg-red-50 border-red-200 text-red-900",
    iconColor: "text-red-600",
  },
};

export function Callout({ type, title, children, className }: CalloutProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn("rounded-lg border p-4 my-6", config.container, className)} role="alert">
      <div className="flex gap-3">
        <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", config.iconColor)} aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold mb-1">{title || config.label}</p>
          <div className="text-sm leading-relaxed opacity-90">{children}</div>
        </div>
      </div>
    </div>
  );
}