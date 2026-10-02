import {
  diagnosticQuestions,
  knowledgePointOrder,
  type KnowledgePointId,
  type PracticeQuestion,
  type QuestionDifficulty,
} from "@/data/practiceQuestions";

const elementChoiceScenarios = [
  ["用羊角锤拔钉子时，锤头贴住木板的位置", "支点"],
  ["用开瓶器撬瓶盖时，手向上提拉的位置", "用力点"],
  ["用核桃夹夹核桃时，核桃与夹口接触的位置", "阻力点"],
  ["用剪刀剪布时，手指按压手柄的位置", "用力点"],
  ["用钳子夹铁丝时，中间的转轴位置", "支点"],
  ["用撬棍撬石块时，撬棍下方垫着的小石块位置", "支点"],
  ["使用镊子夹物品时，镊子尖端接触物品的位置", "阻力点"],
  ["用订书机装订纸张时，手向下按压上盖的位置", "用力点"],
  ["用跷跷板时，座板与底座连接的位置", "支点"],
  ["用筷子夹菜时，筷子接触菜的位置", "阻力点"],
  ["用钢丝钳剪铁丝时，铁丝与钳口接触的位置", "阻力点"],
  ["用手推车运货时，车轮轴所在的位置", "支点"],
] as const;

const armChoiceConfigs = [
  [3, 1, 7],
  [4, 1, 8],
  [5, 2, 9],
  [6, 1, 8],
  [7, 3, 9],
  [8, 2, 11],
  [4, 0, 7],
  [5, 0, 8],
  [6, 2, 10],
  [7, 1, 10],
  [8, 3, 12],
  [9, 4, 11],
  [5, 3, 10],
  [6, 4, 11],
  [7, 2, 12],
  [8, 5, 13],
] as const;

const principleChoiceConfigs = [
  [2, 2, 1, 4],
  [3, 2, 2, 2],
  [1, 5, 2, 3],
  [4, 2, 2, 4],
  [2, 5, 3, 3],
  [3, 3, 1, 6],
  [5, 1, 2, 3],
  [2, 4, 4, 1],
  [3, 4, 2, 5],
  [4, 3, 3, 4],
  [1, 6, 2, 2],
  [2, 6, 3, 4],
  [5, 2, 3, 3],
  [3, 5, 5, 2],
  [4, 4, 2, 7],
  [2, 7, 4, 3],
] as const;

const typeChoiceItems = [
  ["用力臂长于阻力臂", "省力杠杆"],
  ["用力臂短于阻力臂", "费力杠杆"],
  ["用力臂等于阻力臂", "等臂杠杆"],
  ["瓶盖起子", "省力杠杆"],
  ["食品夹", "费力杠杆"],
  ["天平", "等臂杠杆"],
  ["羊角锤拔钉子", "省力杠杆"],
  ["钓鱼竿", "费力杠杆"],
  ["跷跷板支点位于正中央", "等臂杠杆"],
  ["独轮手推车", "省力杠杆"],
] as const;

const elementBooleanItems = [
  ["杠杆转动时，支点的位置一定是杠杆的正中央。", false],
  ["手对杠杆施加动力的位置叫用力点。", true],
  ["阻碍杠杆转动的力作用在阻力点。", true],
  ["一根杠杆只有支点、用力点和阻力点三个要素。", false],
  ["用力臂和阻力臂都要从支点量起。", true],
  ["剪刀的转轴是用力点。", false],
  ["使用开瓶器时，瓶盖受到作用的位置是阻力点。", true],
  ["同一个杠杆的支点和用力点一定重合。", false],
] as const;

const armBooleanConfigs = [
  [4, 1, 7, "两条力臂相等", true],
  [5, 1, 8, "用力臂更长", true],
  [6, 2, 9, "阻力臂更长", false],
  [7, 4, 11, "阻力臂更长", true],
  [8, 3, 12, "用力臂更长", true],
  [5, 2, 9, "两条力臂相等", false],
  [6, 1, 8, "用力臂更长", true],
  [7, 2, 10, "阻力臂更长", false],
  [8, 4, 13, "阻力臂更长", true],
  [9, 3, 14, "两条力臂相等", false],
] as const;

const principleBooleanConfigs = [
  [2, 3, 3, 2, "保持平衡", true],
  [3, 2, 2, 4, "向右侧倾斜", true],
  [4, 2, 3, 3, "向左侧倾斜", false],
  [2, 5, 5, 2, "保持平衡", true],
  [1, 6, 2, 4, "向右侧倾斜", true],
  [3, 4, 2, 5, "向左侧倾斜", true],
  [5, 2, 2, 6, "向右侧倾斜", true],
  [4, 3, 3, 4, "保持平衡", true],
  [2, 4, 3, 3, "向左侧倾斜", false],
  [3, 5, 4, 3, "向左侧倾斜", true],
] as const;

const typeBooleanItems = [
  ["省力杠杆的用力臂通常比阻力臂长。", true],
  ["费力杠杆虽然费力，但可能省距离或让操作更灵活。", true],
  ["等臂杠杆的两条力臂长度相等。", true],
  ["开瓶器通常属于费力杠杆。", false],
  ["镊子通常属于费力杠杆。", true],
  ["天平横梁平衡时，可以看作等臂杠杆。", true],
  ["只要杠杆能省力，它就一定也能省距离。", false],
  ["筷子是省力杠杆。", false],
] as const;

const generatedChoiceQuestions: PracticeQuestion[] = [
  ...elementChoiceScenarios.map(([scenario, answer], index) =>
    createChoiceQuestion(
      `bank-elements-choice-${index + 1}`,
      "leverElements",
      `${scenario}属于杠杆的哪个要素？`,
      `${scenario}是${answer}。判断杠杆要素时，应先找支点，再找两个作用点。`,
      ["支点", "用力点", "阻力点", "阻力臂"],
      answer,
    ),
  ),
  ...armChoiceConfigs.map(([fulcrum, effort, resistance], index) => {
    const effortArm = Math.abs(fulcrum - effort);
    const resistanceArm = Math.abs(resistance - fulcrum);
    return createChoiceQuestion(
      `bank-arm-choice-${index + 1}`,
      "armComparison",
      `支点在刻度 ${fulcrum}，用力点在刻度 ${effort}，阻力点在刻度 ${resistance}。用力臂长多少格？`,
      `用力臂是支点到用力点的距离：|${fulcrum}-${effort}|=${effortArm} 格；阻力臂为 ${resistanceArm} 格。`,
      uniqueNumberOptions(effortArm, resistanceArm),
      `${effortArm} 格`,
    );
  }),
  ...principleChoiceConfigs.map(
    ([leftForce, leftArm, rightForce, rightArm], index) => {
      const leftMoment = leftForce * leftArm;
      const rightMoment = rightForce * rightArm;
      const answer =
        leftMoment === rightMoment
          ? "保持平衡"
          : leftMoment > rightMoment
            ? "向左侧倾斜"
            : "向右侧倾斜";
      return createChoiceQuestion(
        `bank-principle-choice-${index + 1}`,
        "leverPrinciple",
        `左侧施力 ${leftForce} 牛、力臂 ${leftArm} 格；右侧施力 ${rightForce} 牛、力臂 ${rightArm} 格。杠杆会怎样？`,
        `左侧力矩为 ${leftForce}×${leftArm}=${leftMoment}，右侧力矩为 ${rightForce}×${rightArm}=${rightMoment}，所以杠杆${answer}。`,
        ["向左侧倾斜", "向右侧倾斜", "保持平衡", "无法判断"],
        answer,
      );
    },
  ),
  ...typeChoiceItems.map(([description, answer], index) =>
    createChoiceQuestion(
      `bank-types-choice-${index + 1}`,
      "leverTypes",
      `“${description}”通常对应哪一类杠杆？`,
      `${description}通常对应${answer}，分类依据是用力臂与阻力臂的长短关系。`,
      ["省力杠杆", "费力杠杆", "等臂杠杆", "不能确定"],
      answer,
    ),
  ),
];

const generatedBooleanQuestions: PracticeQuestion[] = [
  ...elementBooleanItems.map(([prompt, correctValue], index) =>
    createBooleanQuestion(
      `bank-elements-boolean-${index + 1}`,
      "leverElements",
      prompt,
      correctValue,
      correctValue
        ? "这个说法正确，符合杠杆五要素的定义。"
        : "这个说法错误，应根据支点、作用点和力臂的定义判断。",
    ),
  ),
  ...armBooleanConfigs.map(
    ([fulcrum, effort, resistance, conclusion, correctValue], index) => {
      const effortArm = Math.abs(fulcrum - effort);
      const resistanceArm = Math.abs(resistance - fulcrum);
      return createBooleanQuestion(
        `bank-arm-boolean-${index + 1}`,
        "armComparison",
        `支点在刻度 ${fulcrum}、用力点在刻度 ${effort}、阻力点在刻度 ${resistance}，此时${conclusion}。`,
        correctValue,
        `用力臂为 ${effortArm} 格，阻力臂为 ${resistanceArm} 格，据此比较两条力臂。`,
      );
    },
  ),
  ...principleBooleanConfigs.map(
    (
      [leftForce, leftArm, rightForce, rightArm, conclusion, correctValue],
      index,
    ) => {
      const leftMoment = leftForce * leftArm;
      const rightMoment = rightForce * rightArm;
      return createBooleanQuestion(
        `bank-principle-boolean-${index + 1}`,
        "leverPrinciple",
        `左侧施力 ${leftForce} 牛、力臂 ${leftArm} 格，右侧施力 ${rightForce} 牛、力臂 ${rightArm} 格，杠杆会${conclusion}。`,
        correctValue,
        `左侧力矩为 ${leftMoment}，右侧力矩为 ${rightMoment}，比较两侧力矩即可判断。`,
      );
    },
  ),
  ...typeBooleanItems.map(([prompt, correctValue], index) =>
    createBooleanQuestion(
      `bank-types-boolean-${index + 1}`,
      "leverTypes",
      prompt,
      correctValue,
      correctValue
        ? "这个说法正确，符合用力臂与阻力臂的分类关系。"
        : "这个说法错误，应比较用力臂与阻力臂后再分类。",
    ),
  ),
];

export const diagnosticQuestionBank: PracticeQuestion[] = [
  ...diagnosticQuestions,
  ...generatedChoiceQuestions,
  ...generatedBooleanQuestions,
];

export function createDiagnosticSet(random: () => number = Math.random) {
  const choicePool = diagnosticQuestionBank.filter(
    (question) => question.type === "choice",
  );
  const booleanPool = diagnosticQuestionBank.filter(
    (question) => question.type === "boolean",
  );
  const requiredChoices = knowledgePointOrder.map(
    (knowledgePoint) =>
      shuffle(
        choicePool.filter(
          (question) => question.knowledgePoint === knowledgePoint,
        ),
        random,
      )[0],
  );
  const requiredBooleans = knowledgePointOrder.map(
    (knowledgePoint) =>
      shuffle(
        booleanPool.filter(
          (question) => question.knowledgePoint === knowledgePoint,
        ),
        random,
      )[0],
  );
  const requiredChoiceIds = new Set(
    requiredChoices.map((question) => question.id),
  );
  const extraChoices = shuffle(
    choicePool.filter((question) => !requiredChoiceIds.has(question.id)),
    random,
  ).slice(0, 2);

  return shuffle(
    [...requiredChoices, ...extraChoices, ...requiredBooleans],
    random,
  );
}

export function getDiagnosticQuestions(ids: string[]) {
  const questionById = new Map(
    diagnosticQuestionBank.map((question) => [question.id, question]),
  );
  return ids
    .map((id) => questionById.get(id))
    .filter((question): question is PracticeQuestion => Boolean(question));
}

function createChoiceQuestion(
  id: string,
  knowledgePoint: KnowledgePointId,
  prompt: string,
  explanation: string,
  labels: string[],
  correctLabel: string,
  difficulty: QuestionDifficulty = "foundation",
): PracticeQuestion {
  const options = labels.map((label, index) => ({
    id: `option-${index + 1}`,
    label,
  }));
  const correctOption = options.find((option) => option.label === correctLabel);

  if (!correctOption) {
    throw new Error(`Missing correct option for question ${id}`);
  }

  return {
    id,
    type: "choice",
    knowledgePoint,
    prompt,
    explanation,
    difficulty,
    options,
    correctOptionId: correctOption.id,
  };
}

function createBooleanQuestion(
  id: string,
  knowledgePoint: KnowledgePointId,
  prompt: string,
  correctValue: boolean,
  explanation: string,
  difficulty: QuestionDifficulty = "foundation",
): PracticeQuestion {
  return {
    id,
    type: "boolean",
    knowledgePoint,
    prompt,
    explanation,
    difficulty,
    correctValue,
  };
}

function uniqueNumberOptions(answer: number, secondary: number) {
  const values = [answer, secondary, answer + 1, Math.max(1, answer - 1)];
  let candidate = 1;

  while (new Set(values).size < 4) {
    if (!values.includes(candidate)) values.push(candidate);
    candidate += 1;
  }

  return [...new Set(values)]
    .slice(0, 4)
    .map((value) => `${value} 格`);
}

function shuffle<T>(items: T[], random: () => number) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}
