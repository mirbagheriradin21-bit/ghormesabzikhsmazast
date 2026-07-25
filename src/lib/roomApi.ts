import type { CocaOrder } from "@/hooks/useCocaOrders";

const BASE = "https://jsonblob.com/api/jsonBlob";

interface RoomData {
  orders: CocaOrder[];
}

export async function createRoom(): Promise<string> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orders: [] } satisfies RoomData),
  });
  if (!res.ok) throw new Error("Could not create a party room");
  const location = res.headers.get("Location") ?? res.headers.get("location");
  const fromHeader = location?.split("/").pop();
  if (fromHeader) return fromHeader;
  const body = (await res.json().catch(() => null)) as { id?: string } | null;
  if (body?.id) return body.id;
  throw new Error("Could not read new room id");
}

export async function fetchRoomOrders(roomId: string): Promise<CocaOrder[]> {
  const res = await fetch(`${BASE}/${roomId}`);
  if (!res.ok) throw new Error("Room not found");
  const data = (await res.json()) as RoomData;
  return data.orders ?? [];
}

export async function saveRoomOrders(roomId: string, orders: CocaOrder[]): Promise<void> {
  const res = await fetch(`${BASE}/${roomId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orders } satisfies RoomData),
  });
  if (!res.ok) throw new Error("Could not save order");
}
