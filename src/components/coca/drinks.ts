export interface Drink {
  id: string;
  name: string;
  emoji: string;
  color: string;
  textColor: string;
}

export const DRINKS: Drink[] = [
  { id: "coca-cola", name: "Coca-Cola", emoji: "🥤", color: "#E30613", textColor: "#FFFFFF" },
  { id: "fanta-orange", name: "Fanta Orange", emoji: "🍊", color: "#F58220", textColor: "#FFFFFF" },
  { id: "thums-up", name: "Thums Up", emoji: "👍", color: "#131E3A", textColor: "#FFFFFF" },
];
