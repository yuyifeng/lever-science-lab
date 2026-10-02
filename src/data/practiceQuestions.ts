export type KnowledgePointId =
  | "leverElements"
  | "armComparison"
  | "leverPrinciple"
  | "leverTypes";

export type PracticeQuestionType =
  | "choice"
  | "boolean"
  | "matching"
  | "wordBank";

export type QuestionDifficulty = "foundation" | "challenge";

interface PracticeQuestionBase {
  id: string;
  type: PracticeQuestionType;
  knowledgePoint: KnowledgePointId;
  prompt: string;
  explanation: string;
  difficulty: QuestionDifficulty;
}

export interface QuestionOption {
  id: string;
  label: string;
}

export interface ChoiceQuestion extends PracticeQuestionBase {
  type: "choice";
  options: QuestionOption[];
  correctOptionId: string;
}

export interface BooleanQuestion extends PracticeQuestionBase {
  type: "boolean";
  correctValue: boolean;
}

export interface MatchingQuestion extends PracticeQuestionBase {
  type: "matching";
  leftItems: QuestionOption[];
  rightItems: QuestionOption[];
  correctPairs: Record<string, string>;
}

export interface WordBankQuestion extends PracticeQuestionBase {
  type: "wordBank";
  context: string;
  sentenceParts: string[];
  words: QuestionOption[];
  correctWordIds: string[];
}

export type PracticeQuestion =
  | ChoiceQuestion
  | BooleanQuestion
  | MatchingQuestion
  | WordBankQuestion;

export const knowledgePointOrder: KnowledgePointId[] = [
  "leverElements",
  "armComparison",
  "leverPrinciple",
  "leverTypes",
];

export const knowledgePoints: Record<
  KnowledgePointId,
  { name: string; shortName: string; advice: string }
> = {
  leverElements: {
    name: "杠杆五要素",
    shortName: "五要素",
    advice: "继续练习从支点出发，准确找出两个作用点和两条力臂。",
  },
  armComparison: {
    name: "力臂测量与比较",
    shortName: "力臂比较",
    advice: "先找到支点，再比较支点到用力点、阻力点的距离。",
  },
  leverPrinciple: {
    name: "力矩与平衡",
    shortName: "力矩平衡",
    advice: "分别计算力与力臂的乘积，再比较两侧力矩。",
  },
  leverTypes: {
    name: "杠杆类型与实例",
    shortName: "杠杆类型",
    advice: "用用力臂和阻力臂的长短关系判断杠杆类型。",
  },
};

export const diagnosticQuestions: PracticeQuestion[] = [
  {
    id: "diagnostic-elements-choice",
    type: "choice",
    knowledgePoint: "leverElements",
    prompt: "杠杆转动时，始终围绕哪个点转动？",
    explanation: "杠杆围绕支点转动，支点是判断其他位置和力臂的起点。",
    difficulty: "foundation",
    options: [
      { id: "fulcrum", label: "支点" },
      { id: "effort", label: "用力点" },
      { id: "resistance", label: "阻力点" },
      { id: "arm", label: "用力臂" },
    ],
    correctOptionId: "fulcrum",
  },
  {
    id: "diagnostic-arm-choice",
    type: "choice",
    knowledgePoint: "armComparison",
    prompt: "支点在刻度 4，用力点在刻度 1，阻力点在刻度 6。哪条力臂更长？",
    explanation: "用力臂是 4-1=3 格，阻力臂是 6-4=2 格，所以用力臂更长。",
    difficulty: "foundation",
    options: [
      { id: "effort", label: "用力臂更长" },
      { id: "resistance", label: "阻力臂更长" },
      { id: "equal", label: "两条一样长" },
      { id: "unknown", label: "无法判断" },
    ],
    correctOptionId: "effort",
  },
  {
    id: "diagnostic-principle-boolean",
    type: "boolean",
    knowledgePoint: "leverPrinciple",
    prompt: "两侧的力矩相等时，杠杆可以保持平衡。",
    explanation: "力矩等于力乘以力臂，两侧力矩相等时杠杆平衡。",
    difficulty: "foundation",
    correctValue: true,
  },
  {
    id: "diagnostic-types-boolean",
    type: "boolean",
    knowledgePoint: "leverTypes",
    prompt: "筷子的用力臂比阻力臂长，所以筷子是省力杠杆。",
    explanation: "筷子的用力臂比阻力臂短，是费力杠杆，但能让手部动作更灵活。",
    difficulty: "foundation",
    correctValue: false,
  },
  {
    id: "diagnostic-elements-choice-2",
    type: "choice",
    knowledgePoint: "leverElements",
    prompt: "使用剪刀剪纸时，纸片受到剪刀作用的位置是什么？",
    explanation: "纸片阻碍剪刀运动，刀刃接触纸片的位置就是阻力点。",
    difficulty: "foundation",
    options: [
      { id: "resistancePoint", label: "阻力点" },
      { id: "effortPoint", label: "用力点" },
      { id: "fulcrum", label: "支点" },
      { id: "effortArm", label: "用力臂" },
    ],
    correctOptionId: "resistancePoint",
  },
  {
    id: "diagnostic-types-choice",
    type: "choice",
    knowledgePoint: "leverTypes",
    prompt: "下面哪一种生活工具通常属于等臂杠杆？",
    explanation: "跷跷板的支点通常在中央，两侧力臂相等，属于等臂杠杆。",
    difficulty: "foundation",
    options: [
      { id: "seesaw", label: "跷跷板" },
      { id: "opener", label: "开瓶器" },
      { id: "chopsticks", label: "筷子" },
      { id: "tweezers", label: "镊子" },
    ],
    correctOptionId: "seesaw",
  },
  {
    id: "diagnostic-arm-choice-2",
    type: "choice",
    knowledgePoint: "armComparison",
    prompt: "支点在刻度 5，用力点在刻度 1，阻力点在刻度 7。用力臂长多少格？",
    explanation: "力臂是支点到作用点的距离。本题用力臂 4 格，阻力臂 2 格。",
    difficulty: "foundation",
    options: [
      { id: "four", label: "4 格" },
      { id: "two", label: "2 格" },
      { id: "five", label: "5 格" },
      { id: "six", label: "6 格" },
    ],
    correctOptionId: "four",
  },
  {
    id: "diagnostic-principle-choice",
    type: "choice",
    knowledgePoint: "leverPrinciple",
    prompt: "左侧施力 2 牛、力臂 3 格；右侧施力 3 牛、力臂 2 格。杠杆会怎样？",
    explanation: "左侧力矩为 2×3=6，右侧力矩为 3×2=6，两侧相等，所以杠杆平衡。",
    difficulty: "foundation",
    options: [
      { id: "balanced", label: "保持平衡" },
      { id: "left", label: "向左倾斜" },
      { id: "right", label: "向右倾斜" },
      { id: "unknown", label: "无法判断" },
    ],
    correctOptionId: "balanced",
  },
  {
    id: "diagnostic-elements-boolean",
    type: "boolean",
    knowledgePoint: "leverElements",
    prompt: "用力臂是支点到用力点之间的距离。",
    explanation: "力臂都从支点量起，用力臂连接支点和用力点。",
    difficulty: "foundation",
    correctValue: true,
  },
  {
    id: "diagnostic-arm-boolean",
    type: "boolean",
    knowledgePoint: "armComparison",
    prompt: "移动支点时，用力臂和阻力臂的长度都不会改变。",
    explanation: "两条力臂都以支点为起点，移动支点通常会改变两条力臂的长度。",
    difficulty: "foundation",
    correctValue: false,
  },
];

export const reinforcementQuestions: PracticeQuestion[] = [
  {
    id: "reinforce-elements-choice-1",
    type: "choice",
    knowledgePoint: "leverElements",
    prompt: "使用剪刀时，手指施力的位置属于什么？",
    explanation: "手指在剪刀柄上施力，这个位置就是用力点。",
    difficulty: "foundation",
    options: [
      { id: "effortPoint", label: "用力点" },
      { id: "resistancePoint", label: "阻力点" },
      { id: "fulcrum", label: "支点" },
    ],
    correctOptionId: "effortPoint",
  },
  {
    id: "reinforce-elements-boolean-1",
    type: "boolean",
    knowledgePoint: "leverElements",
    prompt: "阻力臂是支点到阻力点之间的距离。",
    explanation: "两条力臂都从支点量起，阻力臂连接支点和阻力点。",
    difficulty: "challenge",
    correctValue: true,
  },
  {
    id: "reinforce-elements-choice-2",
    type: "choice",
    knowledgePoint: "leverElements",
    prompt: "剪刀上的转轴属于哪个杠杆要素？",
    explanation: "剪刀轴是支点，手柄是用力点，刀刃剪物体处是阻力点。",
    difficulty: "challenge",
    options: [
      { id: "fulcrum", label: "支点" },
      { id: "effort", label: "用力点" },
      { id: "resistance", label: "阻力点" },
      { id: "arm", label: "阻力臂" },
    ],
    correctOptionId: "fulcrum",
  },
  {
    id: "reinforce-elements-boolean-2",
    type: "boolean",
    knowledgePoint: "leverElements",
    prompt: "观察陌生杠杆时，可以先找支点，再确定两个作用点和两条力臂。",
    explanation: "先找支点，再确定两个作用点，最后从支点量出两条力臂。",
    difficulty: "challenge",
    correctValue: true,
  },
  {
    id: "reinforce-arm-choice-1",
    type: "choice",
    knowledgePoint: "armComparison",
    prompt: "支点在刻度 6，用力点在刻度 2，用力臂长多少格？",
    explanation: "用力臂是支点到用力点的距离：6-2=4 格。",
    difficulty: "foundation",
    options: [
      { id: "two", label: "2 格" },
      { id: "four", label: "4 格" },
      { id: "six", label: "6 格" },
      { id: "eight", label: "8 格" },
    ],
    correctOptionId: "four",
  },
  {
    id: "reinforce-arm-boolean-1",
    type: "boolean",
    knowledgePoint: "armComparison",
    prompt: "移动支点可能同时改变用力臂和阻力臂。",
    explanation: "两条力臂都以支点为起点，移动支点会改变它到两个作用点的距离。",
    difficulty: "challenge",
    correctValue: true,
  },
  {
    id: "reinforce-arm-choice-2",
    type: "choice",
    knowledgePoint: "armComparison",
    prompt: "支点在刻度 5、用力点在刻度 1，用力臂长多少格？",
    explanation: "用支点刻度与作用点刻度之差求力臂长度。",
    difficulty: "challenge",
    options: [
      { id: "four", label: "4 格" },
      { id: "three", label: "3 格" },
      { id: "two", label: "2 格" },
      { id: "six", label: "6 格" },
    ],
    correctOptionId: "four",
  },
  {
    id: "reinforce-arm-boolean-2",
    type: "boolean",
    knowledgePoint: "armComparison",
    prompt: "支点在刻度 4、用力点在刻度 1、阻力点在刻度 8，此时阻力臂更长。",
    explanation: "用力臂为 3 格，阻力臂为 4 格，因此阻力臂更长。",
    difficulty: "challenge",
    correctValue: true,
  },
  {
    id: "reinforce-principle-choice-1",
    type: "choice",
    knowledgePoint: "leverPrinciple",
    prompt: "左侧力矩是 8，右侧力矩是 5，杠杆会怎样？",
    explanation: "左侧力矩更大，杠杆会向左侧倾斜。",
    difficulty: "foundation",
    options: [
      { id: "left", label: "向左侧倾斜" },
      { id: "right", label: "向右侧倾斜" },
      { id: "balanced", label: "保持平衡" },
    ],
    correctOptionId: "left",
  },
  {
    id: "reinforce-principle-boolean-1",
    type: "boolean",
    knowledgePoint: "leverPrinciple",
    prompt: "只比较两侧力的大小，就一定能判断杠杆向哪边倾斜。",
    explanation: "还要考虑力臂，应该比较两侧的力矩，而不只是力的大小。",
    difficulty: "challenge",
    correctValue: false,
  },
  {
    id: "reinforce-principle-choice-2",
    type: "choice",
    knowledgePoint: "leverPrinciple",
    prompt: "右侧力矩大于左侧力矩时，杠杆会怎样？",
    explanation: "哪侧力矩大就向哪侧倾斜，两侧相等则平衡。",
    difficulty: "challenge",
    options: [
      { id: "left", label: "向左倾斜" },
      { id: "balanced", label: "保持平衡" },
      { id: "right", label: "向右倾斜" },
      { id: "unknown", label: "无法判断" },
    ],
    correctOptionId: "right",
  },
  {
    id: "reinforce-principle-boolean-2",
    type: "boolean",
    knowledgePoint: "leverPrinciple",
    prompt: "左侧施力 3 牛、力臂 2 格，右侧施力 2 牛、力臂 4 格，杠杆会向右侧倾斜。",
    explanation: "左侧 3×2=6，右侧 2×4=8，右侧力矩更大。",
    difficulty: "challenge",
    correctValue: true,
  },
  {
    id: "reinforce-types-choice-1",
    type: "choice",
    knowledgePoint: "leverTypes",
    prompt: "用力臂比阻力臂长的杠杆属于哪一类？",
    explanation: "用力臂长于阻力臂时，可以用较小的力克服较大的阻力，是省力杠杆。",
    difficulty: "foundation",
    options: [
      { id: "saving", label: "省力杠杆" },
      { id: "speed", label: "费力杠杆" },
      { id: "equal", label: "等臂杠杆" },
    ],
    correctOptionId: "saving",
  },
  {
    id: "reinforce-types-boolean-1",
    type: "boolean",
    knowledgePoint: "leverTypes",
    prompt: "镊子通常是费力杠杆。",
    explanation: "镊子的用力点靠近支点，用力臂较短，通常属于费力杠杆。",
    difficulty: "challenge",
    correctValue: true,
  },
  {
    id: "reinforce-types-choice-2",
    type: "choice",
    knowledgePoint: "leverTypes",
    prompt: "哪种力臂关系对应等臂杠杆？",
    explanation: "用力臂长则省力，短则费力，相等时为等臂杠杆。",
    difficulty: "challenge",
    options: [
      { id: "long", label: "用力臂更长" },
      { id: "short", label: "用力臂更短" },
      { id: "same", label: "两条力臂相等" },
      { id: "unknown", label: "只看力臂无法判断" },
    ],
    correctOptionId: "same",
  },
  {
    id: "reinforce-types-boolean-2",
    type: "boolean",
    knowledgePoint: "leverTypes",
    prompt: "某工具的用力臂为 2 格、阻力臂为 5 格，它属于费力杠杆。",
    explanation: "用力臂 2 格，小于阻力臂 5 格，所以是费力杠杆。",
    difficulty: "challenge",
    correctValue: true,
  },
];
