import { useState } from "react";
import { RoleSelect } from "@/components/coca/RoleSelect";
import { GuestOrder } from "@/components/coca/GuestOrder";
import { HostDashboard } from "@/components/coca/HostDashboard";

type Role = "host" | "guest" | null;

export default function CocaColaOrder() {
  const [role, setRole] = useState<Role>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 via-red-500 to-red-600">
      {role === null && <RoleSelect onSelect={setRole} />}
      {role === "guest" && <GuestOrder onBack={() => setRole(null)} />}
      {role === "host" && <HostDashboard onBack={() => setRole(null)} />}
    </div>
  );
}
