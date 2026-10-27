import { createLucideIcon, type IconNode } from "lucide-react";

const iconNode: IconNode = [
  ["circle", { cx: "12", cy: "12", r: "9", key: "0" }],
  ["circle", { cx: "12", cy: "12", r: "5", key: "1" }],
];

export const Coin = createLucideIcon("coin", iconNode);
