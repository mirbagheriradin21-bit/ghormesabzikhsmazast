import { useEffect, useState } from "react";
import { CupSoda, RotateCcw } from "lucide-react";
import { RoleSelect } from "@/components/coca/RoleSelect";
import { GuestOrder } from "@/components/coca/GuestOrder";
import { HostDashboard } from "@/components/coca/HostDashboard";
import { JoinParty } from "@/components/coca/JoinParty";
import { useRoom } from "@/hooks/useRoom";
import { coca, EASE } from "@/components/coca/theme";

type Role = "host" | "guest" | null;

export default function CocaColaOrder() {
  const [role, setRole] = useState<Role>(null);
  const { roomId, status, createAndJoinRoom, joinRoom } = useRoom();

  useEffect(() => {
    if (role === "host" && !roomId && status === "idle") {
      createAndJoinRoom();
    }
  }, [role, roomId, status, createAndJoinRoom]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: coca.bg }}>
      {role === null && <RoleSelect onSelect={setRole} />}

      {role === "host" && (
        <>
          {!roomId && status === "creating" && <Loading text="Setting up your party" />}
          {!roomId && status === "error" && (
            <ErrorScreen onRetry={createAndJoinRoom} onBack={() => setRole(null)} />
          )}
          {roomId && <HostDashboard roomId={roomId} onBack={() => setRole(null)} />}
        </>
      )}

      {role === "guest" && (
        <>
          {!roomId && <JoinParty onJoin={joinRoom} onBack={() => setRole(null)} />}
          {roomId && <GuestOrder roomId={roomId} onBack={() => setRole(null)} />}
        </>
      )}
    </div>
  );
}

function Loading({ text }: { text: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full animate-pulse"
        style={{ backgroundColor: coca.raised, color: coca.textSecondary }}
      >
        <CupSoda size={22} strokeWidth={1.75} />
      </div>
      <p className="font-coca text-base font-medium" style={{ color: coca.textPrimary }}>
        {text}
      </p>
    </div>
  );
}

function ErrorScreen({ onRetry, onBack }: { onRetry: () => void; onBack: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-5 text-center">
      <p className="max-w-xs text-sm" style={{ color: coca.textSecondary }}>
        Couldn't set up the party. Check your connection and try again.
      </p>
      <div className="flex gap-2">
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-white active:scale-[0.98]"
          style={{ backgroundColor: coca.accent, transition: `transform 150ms ${EASE}` }}
        >
          <RotateCcw size={14} strokeWidth={2} />
          Try again
        </button>
        <button
          onClick={onBack}
          className="rounded-xl px-4 py-2.5 text-sm font-medium"
          style={{ backgroundColor: coca.raised, color: coca.textPrimary }}
        >
          Back
        </button>
      </div>
    </div>
  );
}
