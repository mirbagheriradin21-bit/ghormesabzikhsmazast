import { User, Users } from "lucide-react";
import { CocaLogo } from "./CocaLogo";
import { coca, EASE } from "./theme";

interface RoleSelectProps {
  onSelect: (role: "host" | "guest") => void;
}

export function RoleSelect({ onSelect }: RoleSelectProps) {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-10 px-5 py-10">
      <CocaLogo />

      <div>
        <h1 className="font-coca text-2xl font-medium" style={{ color: coca.textPrimary }}>
          Order drinks for the party
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: coca.textSecondary }}>
          Are you hosting, or ordering?
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <RoleCard
          icon={<Users size={20} strokeWidth={1.75} />}
          title="Host"
          subtitle="See every order come in"
          onClick={() => onSelect("host")}
          primary
        />
        <RoleCard
          icon={<User size={20} strokeWidth={1.75} />}
          title="Guest"
          subtitle="Order a drink"
          onClick={() => onSelect("guest")}
        />
      </div>
    </div>
  );
}

function RoleCard({
  icon,
  title,
  subtitle,
  onClick,
  primary,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 rounded-2xl px-5 py-4 text-left active:scale-[0.99]"
      style={{
        backgroundColor: primary ? coca.accent : coca.card,
        border: `1px solid ${primary ? coca.accent : coca.hairline}`,
        transition: `transform 150ms ${EASE}`,
      }}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: primary ? "rgba(255,255,255,0.16)" : coca.raised,
          color: primary ? "#ffffff" : coca.textSecondary,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          className="text-sm font-medium"
          style={{ color: primary ? "#ffffff" : coca.textPrimary }}
        >
          {title}
        </div>
        <div
          className="mt-0.5 text-xs"
          style={{ color: primary ? "rgba(255,255,255,0.75)" : coca.textSecondary }}
        >
          {subtitle}
        </div>
      </div>
    </button>
  );
}
