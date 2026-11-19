import { useState } from "react";
import { ArrowLeft, Check, Minus, Plus } from "lucide-react";
import { CocaLogo } from "./CocaLogo";
import { useCocaOrders } from "@/hooks/useCocaOrders";
import { DRINKS } from "./drinks";
import { coca, EASE } from "./theme";

const AVATAR_COLORS = ["#b45309", "#c2410c", "#4d7c0f", "#15803d", "#0f766e", "#475569"];

interface GuestOrderProps {
  roomId: string;
  onBack: () => void;
}

export function GuestOrder({ roomId, onBack }: GuestOrderProps) {
  const { addOrder } = useCocaOrders(roomId);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATAR_COLORS[0]);
  const [drink, setDrink] = useState(DRINKS[0]);
  const [quantity, setQuantity] = useState(1);
  const [justOrdered, setJustOrdered] = useState(false);

  const initial = (name.trim() || "G").charAt(0).toUpperCase();

  const handleOrder = () => {
    addOrder(name, avatar, drink.name, drink.color, quantity);
    setJustOrdered(true);
    setTimeout(() => setJustOrdered(false), 2200);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-5 py-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-medium"
          style={{ color: coca.textSecondary, transition: `color 150ms ${EASE}` }}
        >
          <ArrowLeft size={16} strokeWidth={1.75} />
          Back
        </button>
        <CocaLogo size="sm" />
      </div>

      <div>
        <h1 className="font-coca text-2xl font-medium" style={{ color: coca.textPrimary }}>
          Your order
        </h1>
        <p className="mt-1 text-sm" style={{ color: coca.textSecondary }}>
          Pick a color, a drink and how many
        </p>
      </div>

      <section
        className="rounded-2xl p-5"
        style={{ backgroundColor: coca.card, border: `1px solid ${coca.hairline}` }}
      >
        <h2 className="text-sm font-medium" style={{ color: coca.textPrimary }}>
          Your tag
        </h2>

        <div className="mt-3 flex items-center gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-medium text-white"
            style={{ backgroundColor: avatar }}
          >
            {initial}
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={20}
            className="min-w-0 flex-1 rounded-xl px-3 py-2.5 text-sm outline-none"
            style={{
              backgroundColor: coca.raised,
              color: coca.textPrimary,
              border: `1px solid ${coca.hairline}`,
            }}
          />
        </div>

        <div className="mt-3 flex gap-2">
          {AVATAR_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setAvatar(c)}
              aria-label="Choose tag color"
              className="h-7 w-7 rounded-full"
              style={{
                backgroundColor: c,
                boxShadow: avatar === c ? `0 0 0 2px ${coca.card}, 0 0 0 4px ${c}` : "none",
                transition: `box-shadow 150ms ${EASE}`,
              }}
            />
          ))}
        </div>
      </section>

      <section
        className="rounded-2xl p-5"
        style={{ backgroundColor: coca.card, border: `1px solid ${coca.hairline}` }}
      >
        <h2 className="text-sm font-medium" style={{ color: coca.textPrimary }}>
          Drink
        </h2>

        <div className="mt-3 flex flex-col gap-2">
          {DRINKS.map((d) => {
            const selected = drink.id === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setDrink(d)}
                className="flex items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-medium"
                style={{
                  backgroundColor: selected ? coca.raised : "transparent",
                  border: `1px solid ${selected ? d.color : coca.hairline}`,
                  color: coca.textPrimary,
                  transition: `background-color 150ms ${EASE}, border-color 150ms ${EASE}`,
                }}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  {d.name}
                </span>
                {selected && <Check size={16} strokeWidth={2} color={d.color} />}
              </button>
            );
          })}
        </div>
      </section>

      <section
        className="flex items-center justify-between rounded-2xl p-5"
        style={{ backgroundColor: coca.card, border: `1px solid ${coca.hairline}` }}
      >
        <h2 className="text-sm font-medium" style={{ color: coca.textPrimary }}>
          Quantity
        </h2>
        <div className="flex items-center gap-3">
          <StepButton onClick={() => setQuantity((q) => Math.max(1, q - 1))} label="Decrease quantity">
            <Minus size={16} strokeWidth={2} />
          </StepButton>
          <div
            className="w-6 text-center font-coca text-lg tabular-nums"
            style={{ color: coca.textPrimary }}
          >
            {quantity}
          </div>
          <StepButton onClick={() => setQuantity((q) => Math.min(20, q + 1))} label="Increase quantity">
            <Plus size={16} strokeWidth={2} />
          </StepButton>
        </div>
      </section>

      <button
        onClick={handleOrder}
        className="rounded-xl py-3.5 text-sm font-medium text-white active:scale-[0.98]"
        style={{ backgroundColor: coca.accent, transition: `transform 150ms ${EASE}` }}
      >
        Order {quantity > 1 ? `${quantity} ` : ""}
        {drink.name}
        {quantity > 1 ? "s" : ""}
      </button>

      {justOrdered && (
        <div
          className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium"
          style={{ backgroundColor: coca.raised, color: coca.positive }}
        >
          <Check size={16} strokeWidth={2} />
          Order sent — on its way
        </div>
      )}

      <p className="text-center text-xs" style={{ color: coca.textMuted }}>
        You can order again anytime
      </p>
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
      className="flex h-9 w-9 items-center justify-center rounded-full active:scale-[0.97]"
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
