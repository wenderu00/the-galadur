import { createLucideIcon, type IconNode } from "lucide-react";

const iconNode: IconNode = [
  ["path", { d: "M6 3c6 3 9 6 9 9s-3 6-9 9", key: "0" }],
  ["line", { x1: "6", y1: "3", x2: "6", y2: "21", key: "1" }],
  ["path", { d: "M3 12h18", key: "2" }],
  ["path", { d: "m18 9 3 3-3 3", key: "3" }],
];

export const Archer = createLucideIcon("archer", iconNode);
