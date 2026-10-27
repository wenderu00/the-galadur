import { createLucideIcon, type IconNode } from "lucide-react";

const iconNode: IconNode = [
  ["path", { d: "M17 8H7a4 4 0 0 0 0 8h10", key: "0" }],
  ["circle", { cx: "17", cy: "12", r: "4", key: "1" }],
  ["circle", { cx: "17", cy: "12", r: "1", key: "2" }],
];

export const Wood = createLucideIcon("wood", iconNode);
