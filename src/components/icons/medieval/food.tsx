import { createLucideIcon, type IconNode } from "lucide-react";

const iconNode: IconNode = [
  ["path", { d: "M5 18h14a2 2 0 0 0 2-2v-3a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v3a2 2 0 0 0 2 2z", key: "0" }],
  ["path", { d: "m9 9-1 3", key: "1" }],
  ["path", { d: "m13 9-1 3", key: "2" }],
  ["path", { d: "m17 10-1 2", key: "3" }],
];

export const Food = createLucideIcon("food", iconNode);
