import { createLucideIcon, type IconNode } from "lucide-react";

const iconNode: IconNode = [
  ["path", { d: "M2 21h20", key: "0" }],
  ["path", { d: "M4 21V5h3v2h2V5h2v2h2V5h2v2h2V5h3v16", key: "1" }],
  ["path", { d: "M10 21v-4a2 2 0 0 1 4 0v4", key: "2" }],
];

export const Castle = createLucideIcon("castle", iconNode);
