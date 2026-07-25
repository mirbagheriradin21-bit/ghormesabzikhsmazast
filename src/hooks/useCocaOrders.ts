import { useCallback, useEffect, useState } from "react";

export interface CocaOrder {
  id: string;
  name: string;
  emoji: string;
  drinkName: string;
  drinkEmoji: string;
  quantity: number;
  time: number;
}

const STORAGE_KEY = "ds-coca-orders";
const CHANNEL_NAME = "ds-coca-channel";

function readOrders(): CocaOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CocaOrder[]) : [];
  } catch {
    return [];
  }
}

function writeOrders(orders: CocaOrder[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function useCocaOrders() {
  const [orders, setOrders] = useState<CocaOrder[]>(() => readOrders());

  useEffect(() => {
    const channel = "BroadcastChannel" in window ? new BroadcastChannel(CHANNEL_NAME) : null;

    const onMessage = () => setOrders(readOrders());
    channel?.addEventListener("message", onMessage);

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setOrders(readOrders());
    };
    window.addEventListener("storage", onStorage);

    return () => {
      channel?.removeEventListener("message", onMessage);
      channel?.close();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const addOrder = useCallback(
    (name: string, emoji: string, drinkName: string, drinkEmoji: string, quantity: number) => {
      const newOrder: CocaOrder = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: name.trim() || "Guest",
        emoji,
        drinkName,
        drinkEmoji,
        quantity,
        time: Date.now(),
      };
      const next = [newOrder, ...readOrders()];
      writeOrders(next);
      setOrders(next);
      new BroadcastChannel(CHANNEL_NAME).postMessage("update");
      return newOrder;
    },
    [],
  );

  const removeOrder = useCallback((id: string) => {
    const next = readOrders().filter((o) => o.id !== id);
    writeOrders(next);
    setOrders(next);
    new BroadcastChannel(CHANNEL_NAME).postMessage("update");
  }, []);

  const clearOrders = useCallback(() => {
    writeOrders([]);
    setOrders([]);
    new BroadcastChannel(CHANNEL_NAME).postMessage("update");
  }, []);

  return { orders, addOrder, removeOrder, clearOrders };
}
