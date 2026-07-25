import { useState } from "react";
import { CocaLogo } from "./CocaLogo";
import { useCocaOrders } from "@/hooks/useCocaOrders";
import { DRINKS } from "./drinks";

const AVATARS = ["🦄", "🐯", "🐸", "🦁", "🐵", "🐶", "🐱", "🦊"];

interface GuestOrderProps {
  onBack: () => void;
}

export function GuestOrder({ onBack }: GuestOrderProps) {
  const { addOrder } = useCocaOrders();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(AVATARS[0]);
  const [drink, setDrink] = useState(DRINKS[0]);
  const [quantity, setQuantity] = useState(1);
  const [justOrdered, setJustOrdered] = useState(false);

  const handleOrder = () => {
    addOrder(name, emoji, drink.name, drink.emoji, quantity);
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

      <h2 className="font-kid text-2xl font-extrabold text-white drop-shadow-md">Pick your drink!</h2>

      <div className="flex w-full max-w-xs flex-col gap-3">
        {DRINKS.map((d) => (
          <button
            key={d.id}
            onClick={() => setDrink(d)}
            style={{ backgroundColor: d.color, color: d.textColor }}
            className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-xl font-extrabold transition ${
              drink.id === d.id ? "ring-4 ring-yellow-400 scale-105" : "opacity-90"
            }`}
          >
            <span className="text-2xl">{d.emoji}</span> {d.name}
          </button>
        ))}
      </div>

      <h2 className="font-kid text-2xl font-extrabold text-white drop-shadow-md">How many?</h2>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-3xl font-extrabold text-red-600 shadow-lg"
        >
          −
        </button>
        <div className="w-16 text-4xl font-extrabold text-white drop-shadow-md">{quantity}</div>
        <button
          onClick={() => setQuantity((q) => Math.min(20, q + 1))}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-3xl font-extrabold text-red-600 shadow-lg"
        >
          +
        </button>
      </div>

      <button
        onClick={handleOrder}
        className="mt-4 w-full max-w-xs rounded-full bg-yellow-400 px-8 py-6 text-2xl font-extrabold text-red-700 shadow-[0_8px_0_0_#b8860b] transition active:translate-y-2 active:shadow-none"
      >
        {drink.emoji} Order {quantity > 1 ? `${quantity} ` : ""}
        {drink.name}
        {quantity > 1 ? "s" : ""}!
      </button>

      {justOrdered && (
        <div className="animate-bounce rounded-2xl bg-white px-6 py-4 text-xl font-extrabold text-red-600 shadow-lg">
          🎉 Yay! Your order is on the way!
        </div>
      )}

      <p className="text-white/80 font-semibold">You can order as many times as you like!</p>
    </div>
  );
}
