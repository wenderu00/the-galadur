import { createLucideIcon, type IconNode } from "lucide-react";

const iconNode: IconNode = [
  ["line", { x1: "4", y1: "4", x2: "15", y2: "15", key: "0" }],
  ["line", { x1: "13", y1: "17", x2: "17", y2: "13", key: "1" }],
  ["line", { x1: "16", y1: "16", x2: "20", y2: "20", key: "2" }],
  ["line", { x1: "20", y1: "4", x2: "9", y2: "15", key: "3" }],
  ["line", { x1: "7", y1: "13", x2: "11", y2: "17", key: "4" }],
  ["line", { x1: "8", y1: "16", x2: "4", y2: "20", key: "5" }],
];

export const CrossedSwords = createLucideIcon("crossed-swords", iconNode);
