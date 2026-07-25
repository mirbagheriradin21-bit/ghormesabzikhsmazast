import { CocaLogo } from "./CocaLogo";

interface RoleSelectProps {
  onSelect: (role: "host" | "guest") => void;
}

export function RoleSelect({ onSelect }: RoleSelectProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-10 text-center">
      <CocaLogo />
      <div>
        <h1 className="font-kid text-4xl font-extrabold text-white drop-shadow-md sm:text-5xl">
          Coca-Cola Order Land! 🥤
        </h1>
        <p className="mt-3 text-lg font-semibold text-white/90 sm:text-xl">
          Are you the Host or a Guest today?
        </p>
      </div>

      <div className="flex w-full max-w-md flex-col gap-5 sm:flex-row">
        <button
          onClick={() => onSelect("host")}
          className="flex-1 rounded-3xl bg-yellow-400 px-6 py-8 text-2xl font-extrabold text-red-700 shadow-[0_8px_0_0_#b8860b] transition active:translate-y-2 active:shadow-none"
        >
          🧑‍✈️ I'm the Host
          <div className="mt-1 text-sm font-semibold text-red-800/80">See all orders</div>
        </button>

        <button
          onClick={() => onSelect("guest")}
          className="flex-1 rounded-3xl bg-white px-6 py-8 text-2xl font-extrabold text-red-600 shadow-[0_8px_0_0_#c0392b] transition active:translate-y-2 active:shadow-none"
        >
          🎈 I'm a Guest
          <div className="mt-1 text-sm font-semibold text-red-500/80">Order a Coke!</div>
        </button>
      </div>
    </div>
  );
}
