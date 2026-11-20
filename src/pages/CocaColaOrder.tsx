import { useState } from "react";
import { RoleSelect } from "@/components/coca/RoleSelect";
import { GuestOrder } from "@/components/coca/GuestOrder";
import { HostDashboard } from "@/components/coca/HostDashboard";
import { ROOM_ID } from "@/components/coca/room";
import { coca } from "@/components/coca/theme";

type Role = "host" | "guest" | null;

export default function CocaColaOrder() {
  const [role, setRole] = useState<Role>(null);

  return (
    <div className="min-h-screen" style={{ backgroundColor: coca.bg }}>
      {role === null && <RoleSelect onSelect={setRole} />}
      {role === "host" && <HostDashboard roomId={ROOM_ID} onBack={() => setRole(null)} />}
      {role === "guest" && <GuestOrder roomId={ROOM_ID} onBack={() => setRole(null)} />}
    </div>
  );
}
