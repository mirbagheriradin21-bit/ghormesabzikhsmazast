interface CocaLogoProps {
  size?: "sm" | "lg";
}

export function CocaLogo({ size = "lg" }: CocaLogoProps) {
  const isLarge = size === "lg";

  return (
    <div className="flex flex-col items-center select-none">
      <svg
        width={isLarge ? 220 : 120}
        height={isLarge ? 220 : 120}
        viewBox="0 0 220 220"
        className="drop-shadow-[0_6px_10px_rgba(0,0,0,0.25)]"
      >
        <circle cx="110" cy="110" r="105" fill="#E30613" stroke="#FFFFFF" strokeWidth="8" />
        <circle cx="110" cy="110" r="105" fill="none" stroke="#FFD400" strokeWidth="4" strokeDasharray="6 8" />
        <text
          x="110"
          y="86"
          textAnchor="middle"
          fontFamily="'Baloo 2', cursive"
          fontWeight={800}
          fontSize="30"
          fill="#FFFFFF"
        >
          Dayan &amp;
        </text>
        <text
          x="110"
          y="118"
          textAnchor="middle"
          fontFamily="'Baloo 2', cursive"
          fontWeight={800}
          fontSize="30"
          fill="#FFD400"
        >
          Shahan
        </text>
        <text
          x="110"
          y="146"
          textAnchor="middle"
          fontFamily="'Baloo 2', cursive"
          fontWeight={700}
          fontSize="15"
          fill="#FFFFFF"
        >
          DELIVERY CO.
        </text>
        <text x="110" y="182" textAnchor="middle" fontSize="34">
          🥤🚴
        </text>
      </svg>
    </div>
  );
}
