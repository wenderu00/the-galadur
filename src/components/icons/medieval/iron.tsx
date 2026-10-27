import { createLucideIcon, type IconNode } from "lucide-react";

const iconNode: IconNode = [
  ["path", { d: "M3 18h18l-3-6H6z", key: "0" }],
  ["path", { d: "M8 12 9.5 8h5l1.5 4", key: "1" }],
];

export const Iron = createLucideIcon("iron", iconNode);
