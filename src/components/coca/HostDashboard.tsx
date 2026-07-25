import { CocaLogo } from "./CocaLogo";
import { useCocaOrders } from "@/hooks/useCocaOrders";

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
  const { orders, removeOrder, clearOrders } = useCocaOrders();

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 px-6 py-8 text-center">
      <button onClick={onBack} className="self-start text-lg font-bold text-white/90">
        ⬅ Back
      </button>

      <CocaLogo size="sm" />

      <h1 className="font-kid text-3xl font-extrabold text-white drop-shadow-md sm:text-4xl">
        Host Dashboard 🧑‍✈️
      </h1>
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
                <div className="text-sm font-semibold text-red-500/70">wants a 🥤 · {timeAgo(order.time)}</div>
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
