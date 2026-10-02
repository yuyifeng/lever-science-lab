export type LeverElementId =
  | "fulcrum"
  | "effortPoint"
  | "resistancePoint"
  | "effortArm"
  | "resistanceArm";

export interface LeverElement {
  id: LeverElementId;
  name: string;
  shortDefinition: string;
  clue: string;
  tone: "blue" | "red" | "green" | "orange" | "purple";
}

export const leverElements: LeverElement[] = [
  {
    id: "fulcrum",
    name: "支点",
    shortDefinition: "杠杆转动时围绕的固定位置。",
    clue: "它像跷跷板中间的支架，是整根杠杆转动的中心。",
    tone: "blue",
  },
  {
    id: "effortPoint",
    name: "用力点",
    shortDefinition: "我们把力作用在杠杆上的位置。",
    clue: "手按、拉或推杠杆的位置，就是用力点。",
    tone: "red",
  },
  {
    id: "resistancePoint",
    name: "阻力点",
    shortDefinition: "重物或阻力作用在杠杆上的位置。",
    clue: "杠杆托住重物的位置，就是阻力点。",
    tone: "green",
  },
  {
    id: "effortArm",
    name: "用力臂",
    shortDefinition: "从支点到用力点的距离。",
    clue: "比较力臂时，要从支点量到用力点。",
    tone: "orange",
  },
  {
    id: "resistanceArm",
    name: "阻力臂",
    shortDefinition: "从支点到阻力点的距离。",
    clue: "比较力臂时，要从支点量到阻力点。",
    tone: "purple",
  },
];

export const elementPractice = [
  {
    prompt: "杠杆转动时围绕哪个要素？",
    answer: "fulcrum" as const,
    explanation: "支点是杠杆转动的中心。",
  },
  {
    prompt: "从支点到用力点的距离叫什么？",
    answer: "effortArm" as const,
    explanation: "用力臂连接支点和用力点，表示它们之间的距离。",
  },
  {
    prompt: "重物作用在杠杆上的位置叫什么？",
    answer: "resistancePoint" as const,
    explanation: "重物产生阻力，它作用的位置就是阻力点。",
  },
  {
    prompt: "用开瓶器时，手握住并向上抬的位置叫什么？",
    answer: "effortPoint" as const,
    explanation: "手把力作用在开瓶器上的位置，就是用力点。",
  },
  {
    prompt: "从支点到瓶盖接触处的距离叫什么？",
    answer: "resistanceArm" as const,
    explanation: "瓶盖接触处是阻力点，支点到阻力点的距离叫阻力臂。",
  },
  {
    prompt: "跷跷板中间固定、让木板能够转动的位置叫什么？",
    answer: "fulcrum" as const,
    explanation: "跷跷板围绕中间的支架转动，这个位置就是支点。",
  },
  {
    prompt: "使用剪刀时，手指施力的位置叫什么？",
    answer: "effortPoint" as const,
    explanation: "手指通过剪刀柄施加力，手指施力的位置就是用力点。",
  },
  {
    prompt: "从剪刀转轴到手指施力处的距离叫什么？",
    answer: "effortArm" as const,
    explanation: "剪刀转轴是支点，支点到手指施力处的距离就是用力臂。",
  },
  {
    prompt: "核桃被核桃夹挤压的位置叫什么？",
    answer: "resistancePoint" as const,
    explanation: "核桃对夹子产生阻力，它与夹子接触的位置就是阻力点。",
  },
  {
    prompt: "从跷跷板中间支架到小朋友坐的位置，这段距离叫什么？",
    answer: "resistanceArm" as const,
    explanation: "把小朋友看作阻力时，从支点到他所在位置的距离就是阻力臂。",
  },
];
