import { CupSoda } from "lucide-react";
import { coca } from "./theme";

interface CocaLogoProps {
  size?: "sm" | "lg";
}

export function CocaLogo({ size = "lg" }: CocaLogoProps) {
  const isLarge = size === "lg";
  const badge = isLarge ? 56 : 40;
  const icon = isLarge ? 28 : 20;

  return (
    <div className="flex items-center gap-3 select-none">
      <div
        className="flex shrink-0 items-center justify-center rounded-xl"
        style={{ width: badge, height: badge, backgroundColor: coca.accent }}
      >
        <CupSoda size={icon} color="#ffffff" strokeWidth={1.75} />
      </div>
      <div className="text-left">
        <div
          className={`font-coca font-medium leading-none ${isLarge ? "text-xl" : "text-base"}`}
          style={{ color: coca.textPrimary }}
        >
          Dayan &amp; Shahan
        </div>
        <div
          className={`mt-0.5 font-normal ${isLarge ? "text-xs" : "text-[11px]"}`}
          style={{ color: coca.textMuted }}
        >
          Delivery Co.
        </div>
      </div>
    </div>
  );
}
