import { createLucideIcon, type IconNode } from "lucide-react";

const iconNode: IconNode = [
  ["path", { d: "M4 17 6 9l5-4 6 2 3 7-3 4H7z", key: "0" }],
  ["path", { d: "m11 5 1 6 5 3", key: "1" }],
];

export const Stone = createLucideIcon("stone", iconNode);
