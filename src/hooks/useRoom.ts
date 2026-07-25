import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createRoom } from "@/lib/roomApi";

type RoomStatus = "idle" | "creating" | "ready" | "error";

export function useRoom() {
  const [searchParams, setSearchParams] = useSearchParams();
  const roomId = searchParams.get("party");
  const [status, setStatus] = useState<RoomStatus>(roomId ? "ready" : "idle");

  const createAndJoinRoom = useCallback(async () => {
    setStatus("creating");
    try {
      const newRoomId = await createRoom();
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("party", newRoomId);
        return next;
      });
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [setSearchParams]);

  const joinRoom = useCallback(
    (code: string) => {
      const trimmed = code.trim();
      if (!trimmed) return;
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("party", trimmed);
        return next;
      });
      setStatus("ready");
    },
    [setSearchParams],
  );

  useEffect(() => {
    if (roomId) setStatus("ready");
  }, [roomId]);

  return { roomId, status, createAndJoinRoom, joinRoom };
}
