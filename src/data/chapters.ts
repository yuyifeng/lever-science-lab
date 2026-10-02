import {
  ClipboardCheck,
  FlaskConical,
  Shapes,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type ChapterId = "intro" | "experiment" | "types" | "practice";

export interface Chapter {
  id: ChapterId;
  label: string;
  shortLabel: string;
  description: string;
  number: string;
  icon: LucideIcon;
}

export const chapters: Chapter[] = [
  {
    id: "intro",
    label: "认识杠杆",
    shortLabel: "认识",
    description: "找出支点、用力点和阻力点",
    number: "01",
    icon: Shapes,
  },
  {
    id: "experiment",
    label: "动手实验",
    shortLabel: "实验",
    description: "先猜想，再用力矩验证",
    number: "02",
    icon: FlaskConical,
  },
  {
    id: "types",
    label: "杠杆类型",
    shortLabel: "类型",
    description: "分辨省力、费力和等臂杠杆",
    number: "03",
    icon: Wrench,
  },
  {
    id: "practice",
    label: "综合练习",
    shortLabel: "练习",
    description: "诊断掌握情况，针对薄弱点巩固",
    number: "04",
    icon: ClipboardCheck,
  },
];
