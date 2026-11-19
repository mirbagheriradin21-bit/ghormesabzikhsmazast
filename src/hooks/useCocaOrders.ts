import { useCallback, useEffect, useRef, useState } from "react";
import { fetchRoomOrders, saveRoomOrders } from "@/lib/roomApi";

export interface CocaOrder {
  id: string;
  name: string;
  avatar: string;
  drinkName: string;
  drinkColor: string;
  quantity: number;
  time: number;
}

const POLL_INTERVAL_MS = 3000;

export function useCocaOrders(roomId: string | null) {
  const [orders, setOrders] = useState<CocaOrder[]>([]);
  const [synced, setSynced] = useState(false);
  const ordersRef = useRef<CocaOrder[]>([]);
  ordersRef.current = orders;

  useEffect(() => {
    if (!roomId) return;
    let cancelled = false;

    const poll = async () => {
      try {
        const remote = await fetchRoomOrders(roomId);
        if (!cancelled) {
          setOrders(remote);
          setSynced(true);
        }
      } catch {
        if (!cancelled) setSynced(false);
      }
    };

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [roomId]);

  const persist = useCallback(
    (next: CocaOrder[]) => {
      setOrders(next);
      if (!roomId) return;
      saveRoomOrders(roomId, next)
        .then(() => setSynced(true))
        .catch(() => setSynced(false));
    },
    [roomId],
  );

  const addOrder = useCallback(
    (name: string, avatar: string, drinkName: string, drinkColor: string, quantity: number) => {
      const newOrder: CocaOrder = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: name.trim() || "Guest",
        avatar,
        drinkName,
        drinkColor,
        quantity,
        time: Date.now(),
      };
      persist([newOrder, ...ordersRef.current]);
      return newOrder;
    },
    [persist],
  );

  const removeOrder = useCallback(
    (id: string) => {
      persist(ordersRef.current.filter((o) => o.id !== id));
    },
    [persist],
  );

  const clearOrders = useCallback(() => {
    persist([]);
  }, [persist]);

  return { orders, addOrder, removeOrder, clearOrders, synced };
}
