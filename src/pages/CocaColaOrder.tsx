import { useEffect, useState } from "react";
import { RoleSelect } from "@/components/coca/RoleSelect";
import { GuestOrder } from "@/components/coca/GuestOrder";
import { HostDashboard } from "@/components/coca/HostDashboard";
import { JoinParty } from "@/components/coca/JoinParty";
import { useRoom } from "@/hooks/useRoom";

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
    <div className="min-h-screen bg-gradient-to-b from-red-600 via-red-500 to-red-600">
      {role === null && <RoleSelect onSelect={setRole} />}

      {role === "host" && (
        <>
          {!roomId && status === "creating" && <Loading text="Setting up your party..." />}
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <div className="text-5xl animate-bounce">🥤</div>
      <p className="font-kid text-2xl font-extrabold text-white drop-shadow-md">{text}</p>
    </div>
  );
}

function ErrorScreen({ onRetry, onBack }: { onRetry: () => void; onBack: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-kid text-2xl font-extrabold text-white drop-shadow-md">
        Oops! Couldn't set up the party. Check your internet and try again.
      </p>
      <div className="flex gap-3">
        <button onClick={onRetry} className="rounded-full bg-yellow-400 px-6 py-3 font-bold text-red-700 shadow-lg">
          Try Again
        </button>
        <button onClick={onBack} className="rounded-full bg-white px-6 py-3 font-bold text-red-700 shadow-lg">
          Back
        </button>
      </div>
    </div>
  );
}
