import { createLucideIcon, type IconNode } from "lucide-react";

const iconNode: IconNode = [
  ["path", { d: "M2 21h20", key: "0" }],
  ["path", { d: "M4 21V10l8-6 8 6v11", key: "1" }],
  ["path", { d: "M9 21v-6h6v6", key: "2" }],
  ["path", { d: "m9 15 6 6", key: "3" }],
  ["path", { d: "m15 15-6 6", key: "4" }],
];

export const Farm = createLucideIcon("farm", iconNode);
