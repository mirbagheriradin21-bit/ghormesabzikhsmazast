import { useState } from "react";
import { ArrowLeft, Ticket } from "lucide-react";
import { CocaLogo } from "./CocaLogo";
import { coca, EASE } from "./theme";

interface JoinPartyProps {
  onJoin: (code: string) => void;
  onBack: () => void;
}

export function JoinParty({ onJoin, onBack }: JoinPartyProps) {
  const [code, setCode] = useState("");

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-8 px-5 py-10">
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

      <div className="flex flex-col items-start gap-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: coca.raised, color: coca.textSecondary }}
        >
          <Ticket size={18} strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="font-coca text-xl font-medium" style={{ color: coca.textPrimary }}>
            Enter the party code
          </h1>
          <p className="mt-1 text-sm" style={{ color: coca.textSecondary }}>
            Ask your host for their code
          </p>
        </div>
      </div>

      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Party code"
        className="rounded-xl px-4 py-3 text-sm outline-none"
        style={{
          backgroundColor: coca.card,
          color: coca.textPrimary,
          border: `1px solid ${coca.hairline}`,
        }}
      />

      <button
        onClick={() => onJoin(code)}
        disabled={!code.trim()}
        className="rounded-xl py-3.5 text-sm font-medium text-white disabled:opacity-40"
        style={{ backgroundColor: coca.accent, transition: `opacity 150ms ${EASE}` }}
      >
        Join party
      </button>
    </div>
  );
}
