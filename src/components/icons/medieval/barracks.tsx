import { createLucideIcon, type IconNode } from "lucide-react";

const iconNode: IconNode = [
  ["path", { d: "M2 20h20", key: "0" }],
  ["path", { d: "M3.5 20 12 7l8.5 13", key: "1" }],
  ["path", { d: "m12 13-3 7", key: "2" }],
  ["path", { d: "m12 13 3 7", key: "3" }],
  ["path", { d: "M12 7V2l4 2-4 2", key: "4" }],
];

export const Barracks = createLucideIcon("barracks", iconNode);
