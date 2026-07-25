import { useState } from "react";
import { CocaLogo } from "./CocaLogo";
import { useCocaOrders } from "@/hooks/useCocaOrders";

const AVATARS = ["🦄", "🐯", "🐸", "🦁", "🐵", "🐶", "🐱", "🦊"];

interface GuestOrderProps {
  onBack: () => void;
}

export function GuestOrder({ onBack }: GuestOrderProps) {
  const { addOrder } = useCocaOrders();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(AVATARS[0]);
  const [justOrdered, setJustOrdered] = useState(false);

  const handleOrder = () => {
    addOrder(name, emoji);
    setJustOrdered(true);
    setTimeout(() => setJustOrdered(false), 1800);
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 px-6 py-8 text-center">
      <button onClick={onBack} className="self-start text-lg font-bold text-white/90">
        ⬅ Back
      </button>

      <CocaLogo size="sm" />

      <h1 className="font-kid text-3xl font-extrabold text-white drop-shadow-md sm:text-4xl">
        Pick your avatar!
      </h1>

      <div className="grid grid-cols-4 gap-3">
        {AVATARS.map((a) => (
          <button
            key={a}
            onClick={() => setEmoji(a)}
            className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl transition ${
              emoji === a ? "bg-yellow-400 scale-110 shadow-lg" : "bg-white/80"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your fun name (optional)"
        maxLength={20}
        className="w-full max-w-xs rounded-2xl border-4 border-yellow-400 px-4 py-3 text-center text-lg font-bold text-red-700 outline-none"
      />

      <button
        onClick={handleOrder}
        className="mt-4 w-full max-w-xs rounded-full bg-yellow-400 px-8 py-6 text-2xl font-extrabold text-red-700 shadow-[0_8px_0_0_#b8860b] transition active:translate-y-2 active:shadow-none"
      >
        🥤 Order a Coca-Cola!
      </button>

      {justOrdered && (
        <div className="animate-bounce rounded-2xl bg-white px-6 py-4 text-xl font-extrabold text-red-600 shadow-lg">
          🎉 Yay! Your Coke is on the way!
        </div>
      )}

      <p className="text-white/80 font-semibold">You can order as many times as you like!</p>
    </div>
  );
}
