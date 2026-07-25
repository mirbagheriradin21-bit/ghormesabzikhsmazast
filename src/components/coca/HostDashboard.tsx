import { useState } from "react";
import { CocaLogo } from "./CocaLogo";
import { useCocaOrders } from "@/hooks/useCocaOrders";
import { DRINKS } from "./drinks";

interface HostDashboardProps {
  onBack: () => void;
}

function timeAgo(ts: number) {
  const seconds = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
}

export function HostDashboard({ onBack }: HostDashboardProps) {
  const { orders, addOrder, removeOrder, clearOrders } = useCocaOrders();
  const [drink, setDrink] = useState(DRINKS[0]);
  const [quantity, setQuantity] = useState(5);

  const handleHostOrder = () => {
    addOrder("Host", "🧑‍✈️", drink.name, drink.emoji, quantity);
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 px-6 py-8 text-center">
      <button onClick={onBack} className="self-start text-lg font-bold text-white/90">
        ⬅ Back
      </button>

      <CocaLogo size="sm" />

      <h1 className="font-kid text-3xl font-extrabold text-white drop-shadow-md sm:text-4xl">
        Host Dashboard 🧑‍✈️
      </h1>

      <div className="w-full max-w-xs rounded-3xl bg-white/95 p-5 shadow-lg">
        <h2 className="font-kid text-xl font-extrabold text-red-700">Place a host order</h2>

        <div className="mt-3 flex flex-col gap-2">
          {DRINKS.map((d) => (
            <button
              key={d.id}
              onClick={() => setDrink(d)}
              style={{ backgroundColor: d.color, color: d.textColor }}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-base font-extrabold transition ${
                drink.id === d.id ? "ring-4 ring-yellow-400 scale-105" : "opacity-90"
              }`}
            >
              <span className="text-xl">{d.emoji}</span> {d.name}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-center gap-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-2xl font-extrabold text-red-600"
          >
            −
          </button>
          <div className="w-10 text-2xl font-extrabold text-red-700">{quantity}</div>
          <button
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-2xl font-extrabold text-red-600"
          >
            +
          </button>
        </div>

        <button
          onClick={handleHostOrder}
          className="mt-4 w-full rounded-full bg-yellow-400 px-6 py-3 text-lg font-extrabold text-red-700 shadow-[0_5px_0_0_#b8860b] transition active:translate-y-1 active:shadow-none"
        >
          {drink.emoji} Add Order
        </button>
      </div>

      <p className="text-lg font-semibold text-white/90">
        {orders.length === 0 ? "No orders yet... waiting for guests! 🕒" : `${orders.length} order(s) waiting 🥤`}
      </p>

      {orders.length > 0 && (
        <button
          onClick={clearOrders}
          className="rounded-full bg-white/90 px-5 py-2 text-sm font-bold text-red-600 shadow"
        >
          Clear all orders
        </button>
      )}

      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between gap-3 rounded-3xl bg-white px-5 py-4 shadow-lg"
          >
            <div className="flex items-center gap-3 text-left">
              <span className="text-4xl">{order.emoji}</span>
              <div>
                <div className="text-lg font-extrabold text-red-700">{order.name}</div>
                <div className="text-sm font-semibold text-red-500/70">
                  wants {order.quantity} × {order.drinkEmoji} {order.drinkName} · {timeAgo(order.time)}
                </div>
              </div>
            </div>
            <button
              onClick={() => removeOrder(order.id)}
              className="rounded-full bg-green-500 px-4 py-2 text-sm font-extrabold text-white shadow-[0_4px_0_0_#166534] active:translate-y-1 active:shadow-none"
            >
              ✅ Served
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
