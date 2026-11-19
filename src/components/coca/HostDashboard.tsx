import { useState } from "react";
import { ArrowLeft, Check, CheckCircle2, Copy, Minus, Plus, Trash2, Wifi, WifiOff } from "lucide-react";
import { CocaLogo } from "./CocaLogo";
import { useCocaOrders } from "@/hooks/useCocaOrders";
import { DRINKS } from "./drinks";
import { coca, EASE } from "./theme";

interface HostDashboardProps {
  roomId: string;
  onBack: () => void;
}

function timeAgo(ts: number) {
  const seconds = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
}

export function HostDashboard({ roomId, onBack }: HostDashboardProps) {
  const { orders, addOrder, removeOrder, clearOrders, synced } = useCocaOrders(roomId);
  const [drink, setDrink] = useState(DRINKS[0]);
  const [quantity, setQuantity] = useState(5);
  const [copied, setCopied] = useState(false);

  const shareLink = `${window.location.origin}${window.location.pathname}?party=${roomId}`;
  const ticketCount = orders.length;

  const handleHostOrder = () => {
    addOrder("Host", coca.accent, drink.name, drink.color, quantity);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard may be unavailable; the link is still visible to copy manually
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-5 py-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-medium"
          style={{ color: coca.textSecondary }}
        >
          <ArrowLeft size={16} strokeWidth={1.75} />
          Back
        </button>
        <CocaLogo size="sm" />
      </div>

      <h1 className="font-coca text-2xl font-medium" style={{ color: coca.textPrimary }}>
        Host dashboard
      </h1>

      <section
        className="rounded-2xl p-5"
        style={{ backgroundColor: coca.card, border: `1px solid ${coca.hairline}` }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium" style={{ color: coca.textPrimary }}>
            Invite guests
          </h2>
          <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: synced ? coca.positive : coca.warning }}>
            {synced ? <Wifi size={14} strokeWidth={2} /> : <WifiOff size={14} strokeWidth={2} />}
            {synced ? "Live" : "Connecting"}
          </div>
        </div>
        <p className="mt-1 text-sm" style={{ color: coca.textSecondary }}>
          Share this link so guests can join
        </p>

        <div
          className="mt-3 break-all rounded-xl px-3.5 py-2.5 text-xs"
          style={{ backgroundColor: coca.raised, color: coca.textSecondary, fontFamily: "'JetBrains Mono', monospace" }}
        >
          {shareLink}
        </div>

        <button
          onClick={handleCopy}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white active:scale-[0.98]"
          style={{ backgroundColor: coca.accent, transition: `transform 150ms ${EASE}` }}
        >
          {copied ? <Check size={15} strokeWidth={2} /> : <Copy size={15} strokeWidth={2} />}
          {copied ? "Copied" : "Copy link"}
        </button>

        <p
          className="mt-3 text-xs tabular-nums"
          style={{ color: coca.textMuted, fontFamily: "'JetBrains Mono', monospace" }}
        >
          Party code {roomId}
        </p>
      </section>

      <section
        className="rounded-2xl p-5"
        style={{ backgroundColor: coca.card, border: `1px solid ${coca.hairline}` }}
      >
        <h2 className="text-sm font-medium" style={{ color: coca.textPrimary }}>
          Place an order
        </h2>

        <div className="mt-3 flex flex-col gap-2">
          {DRINKS.map((d) => {
            const selected = drink.id === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setDrink(d)}
                className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium"
                style={{
                  backgroundColor: selected ? coca.raised : "transparent",
                  border: `1px solid ${selected ? d.color : coca.hairline}`,
                  color: coca.textPrimary,
                  transition: `background-color 150ms ${EASE}, border-color 150ms ${EASE}`,
                }}
              >
                <span className="flex items-center gap-2.5">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </span>
                {selected && <Check size={16} strokeWidth={2} color={d.color} />}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm" style={{ color: coca.textSecondary }}>
            Quantity
          </span>
          <div className="flex items-center gap-3">
            <StepButton onClick={() => setQuantity((q) => Math.max(1, q - 1))} label="Decrease quantity">
              <Minus size={16} strokeWidth={2} />
            </StepButton>
            <div className="w-6 text-center font-coca text-base tabular-nums" style={{ color: coca.textPrimary }}>
              {quantity}
            </div>
            <StepButton onClick={() => setQuantity((q) => Math.min(20, q + 1))} label="Increase quantity">
              <Plus size={16} strokeWidth={2} />
            </StepButton>
          </div>
        </div>

        <button
          onClick={handleHostOrder}
          className="mt-4 w-full rounded-xl py-2.5 text-sm font-medium active:scale-[0.98]"
          style={{
            backgroundColor: coca.raised,
            color: coca.textPrimary,
            border: `1px solid ${coca.hairline}`,
            transition: `transform 150ms ${EASE}`,
          }}
        >
          Add order
        </button>
      </section>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium" style={{ color: coca.textPrimary }}>
          {ticketCount === 0 ? "No orders yet" : `${ticketCount} order${ticketCount > 1 ? "s" : ""} waiting`}
        </h2>
        {ticketCount > 0 && (
          <button
            onClick={clearOrders}
            className="flex items-center gap-1.5 text-xs font-medium"
            style={{ color: coca.textMuted }}
          >
            <Trash2 size={13} strokeWidth={1.75} />
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {orders.map((order, index) => {
          const ticketNumber = ticketCount - index;
          return (
            <div
              key={order.id}
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ backgroundColor: coca.card, border: `1px solid ${coca.hairline}` }}
            >
              <div
                className="w-8 shrink-0 text-right font-coca text-xs tabular-nums"
                style={{ color: coca.textMuted }}
              >
                #{String(ticketNumber).padStart(2, "0")}
              </div>
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: order.avatar }}
              >
                {order.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium" style={{ color: coca.textPrimary }}>
                  {order.name}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs" style={{ color: coca.textSecondary }}>
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: order.drinkColor }} />
                  {order.quantity} × {order.drinkName}
                  <span style={{ color: coca.textMuted }}>· {timeAgo(order.time)}</span>
                </div>
              </div>
              <button
                onClick={() => removeOrder(order.id)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium active:scale-[0.97]"
                style={{
                  backgroundColor: coca.raised,
                  color: coca.positive,
                  transition: `transform 150ms ${EASE}`,
                }}
              >
                <CheckCircle2 size={14} strokeWidth={2} />
                Served
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full active:scale-[0.97]"
      style={{
        backgroundColor: coca.raised,
        color: coca.textPrimary,
        transition: `transform 150ms ${EASE}`,
      }}
    >
      {children}
    </button>
  );
}
