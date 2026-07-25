import { useState } from "react";
import { CocaLogo } from "./CocaLogo";

interface JoinPartyProps {
  onJoin: (code: string) => void;
  onBack: () => void;
}

export function JoinParty({ onJoin, onBack }: JoinPartyProps) {
  const [code, setCode] = useState("");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-10 text-center">
      <button onClick={onBack} className="self-start text-lg font-bold text-white/90">
        ⬅ Back
      </button>

      <CocaLogo size="sm" />

      <h1 className="font-kid text-3xl font-extrabold text-white drop-shadow-md sm:text-4xl">
        Enter the Party Code! 🎟️
      </h1>
      <p className="text-white/90 font-semibold">Ask your host for the code they were given.</p>

      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Party code"
        className="w-full max-w-xs rounded-2xl border-4 border-yellow-400 px-4 py-3 text-center text-lg font-bold text-red-700 outline-none"
      />

      <button
        onClick={() => onJoin(code)}
        disabled={!code.trim()}
        className="w-full max-w-xs rounded-full bg-yellow-400 px-8 py-4 text-xl font-extrabold text-red-700 shadow-[0_6px_0_0_#b8860b] transition active:translate-y-1 active:shadow-none disabled:opacity-50"
      >
        Join the Party! 🎉
      </button>
    </div>
  );
}
