export type LeverTypeId = "forceSaving" | "distanceSaving" | "equalArm";

export interface LeverExample {
  name: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  illustration?: "balance" | "seesaw";
}

export interface LeverTypeLesson {
  id: LeverTypeId;
  name: string;
  relation: string;
  feature: string;
  purpose: string;
  examples: LeverExample[];
  preset: {
    fulcrum: number;
    effortPoint: number;
    resistancePoint: number;
  };
}

const imageUrl = (prompt: string) =>
  `https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=landscape_4_3`;

export const leverTypes: LeverTypeLesson[] = [
  {
    id: "forceSaving",
    name: "省力杠杆",
    relation: "用力臂 > 阻力臂",
    feature: "用较小的力克服较大的阻力，但用力点移动得更远。",
    purpose: "适合撬动、夹碎或打开较重的物体。",
    examples: [
      {
        name: "开瓶器",
        description: "手柄形成较长的用力臂，瓶盖靠近支点，轻轻一抬就能打开。",
        imageUrl: imageUrl(
          "Realistic educational photograph of a metal bottle opener lifting a crown cap from a glass soda bottle, side view, full lever mechanism visible, clean bright science classroom desk, no brand, no text, child-safe demonstration",
        ),
        imageAlt: "开瓶器利用长手柄撬起瓶盖",
      },
      {
        name: "核桃夹",
        description: "核桃靠近支点，双手在长柄末端用力，可以放大夹碎核桃的力量。",
        imageUrl: imageUrl(
          "Realistic educational photograph of a hinged metal nutcracker holding a walnut near its pivot, long handles clearly visible, side view on a clean pale tabletop, no text, no logo, suitable for elementary science",
        ),
        imageAlt: "核桃夹夹住靠近转轴的核桃",
      },
    ],
    preset: { fulcrum: 5, effortPoint: 0, resistancePoint: 7 },
  },
  {
    id: "distanceSaving",
    name: "费力杠杆",
    relation: "用力臂 < 阻力臂",
    feature: "需要较大的力，却能让阻力点移动得更远或更灵活。",
    purpose: "适合精细、快速或扩大移动距离的操作。",
    examples: [
      {
        name: "镊子",
        description: "手在中间按压，尖端离固定端更远，能准确夹取细小物体。",
        imageUrl: imageUrl(
          "Realistic macro educational photograph of blunt-tip metal tweezers picking up a small green craft bead, side view on a clean white science desk, joined end on left, fingers pressing near the middle and tips on right, full tweezers visible, no spider, no medical scene, no text, suitable for children",
        ),
        imageAlt: "钝头镊子夹起绿色小珠，连接端、手指和镊尖清晰可见",
      },
      {
        name: "筷子",
        description: "手指在中间用力，筷子尖移动距离更大，方便灵活夹取食物。",
        imageUrl: imageUrl(
          "Realistic educational photograph of a hand using wooden chopsticks to pick up one black bean from a white dish, side angle, chopstick ends in hand on left and tips on right, entire lever action visible, clean dining setting, no text, no logo, suitable for children",
        ),
        imageAlt: "筷子夹起黑豆，手指位置和筷尖清晰可见",
      },
    ],
    preset: { fulcrum: 2, effortPoint: 4, resistancePoint: 9 },
  },
  {
    id: "equalArm",
    name: "等臂杠杆",
    relation: "用力臂 = 阻力臂",
    feature: "不省力也不费力，常用来比较两边力的大小。",
    purpose: "适合平衡、称量或公平比较。",
    examples: [
      {
        name: "天平",
        description: "支点在横梁中央，两边托盘距离相等，可以比较物体的重量。",
        imageUrl: imageUrl(
          "Realistic educational photograph of a classic two-pan balance scale in equilibrium, front view, central pivot and equal horizontal arms clearly visible, clean elementary science classroom, no text, no logo",
        ),
        imageAlt: "两盘天平保持水平平衡",
        illustration: "balance",
      },
      {
        name: "跷跷板",
        description: "座位到中央支点的距离相等，两边重量接近时就能保持平衡。",
        imageUrl: imageUrl(
          "Realistic educational photograph of a balanced playground seesaw with two equal empty seats, side view, central pivot clearly visible, safe school playground in daylight, no text, no logo",
        ),
        imageAlt: "中央支点两侧等长的跷跷板",
        illustration: "seesaw",
      },
    ],
    preset: { fulcrum: 5, effortPoint: 1, resistancePoint: 9 },
  },
];

export function classifyLeverType(
  effortArm: number,
  resistanceArm: number,
): LeverTypeId {
  if (effortArm > resistanceArm) return "forceSaving";
  if (effortArm < resistanceArm) return "distanceSaving";
  return "equalArm";
}
