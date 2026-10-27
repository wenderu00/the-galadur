import { createLucideIcon, type IconNode } from "lucide-react";

const iconNode: IconNode = [
  ["line", { x1: "18", y1: "5", x2: "18", y2: "22", key: "0" }],
  ["path", { d: "m16 5 2-3 2 3z", key: "1" }],
  ["path", { d: "M4 9h9v5c0 3-2 5.2-4.5 6.5C6 19.2 4 17 4 14z", key: "2" }],
];

export const Spearman = createLucideIcon("spearman", iconNode);
