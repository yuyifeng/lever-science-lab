import {
  diagnosticQuestions,
  knowledgePointOrder,
  knowledgePoints,
  reinforcementQuestions,
  type KnowledgePointId,
  type PracticeQuestion,
  type PracticeQuestionType,
} from "@/data/practiceQuestions";

export type PracticeAnswer =
  | { type: "choice"; optionId: string }
  | { type: "boolean"; value: boolean }
  | { type: "matching"; pairs: Record<string, string> }
  | { type: "wordBank"; wordIds: (string | null)[] };

export type PracticeAnswers = Record<string, PracticeAnswer>;
export type AnswerStatus = "correct" | "partial" | "incorrect";
export type MasteryLevel = "mastered" | "reinforce" | "weak";

export interface QuestionResult {
  questionId: string;
  knowledgePoint: KnowledgePointId;
  score: number;
  status: AnswerStatus;
  answer?: PracticeAnswer;
}

export interface KnowledgePointResult {
  id: KnowledgePointId;
  name: string;
  score: number;
  percentage: number;
  level: MasteryLevel;
  advice: string;
}

export interface PracticeAssessment {
  score: number;
  earnedPoints: number;
  totalPoints: number;
  correctCount: number;
  questionResults: QuestionResult[];
  knowledgeResults: KnowledgePointResult[];
}

export interface ReinforcementResult {
  assessment: PracticeAssessment;
  completedCount: number;
}

export interface PracticeHistoryRecord {
  id: string;
  completedAt: string;
  diagnosticScore: number;
  knowledgeScores: Record<KnowledgePointId, number>;
  weakestKnowledgePoint: KnowledgePointId;
  reinforcementScore: number | null;
  reinforcementCompleted: boolean;
}

export function isAnswerComplete(
  question: PracticeQuestion,
  answer?: PracticeAnswer,
) {
  if (!answer || answer.type !== question.type) return false;

  switch (question.type) {
    case "choice":
      return answer.type === "choice" && answer.optionId.length > 0;
    case "boolean":
      return answer.type === "boolean";
    case "matching":
      return (
        answer.type === "matching" &&
        question.leftItems.every((item) => Boolean(answer.pairs[item.id]))
      );
    case "wordBank":
      return (
        answer.type === "wordBank" &&
        answer.wordIds.length === question.correctWordIds.length &&
        answer.wordIds.every((wordId) => wordId !== null)
      );
  }
}

export function scoreQuestion(
  question: PracticeQuestion,
  answer?: PracticeAnswer,
): QuestionResult {
  let score = 0;

  if (answer?.type === question.type) {
    switch (question.type) {
      case "choice":
        score =
          answer.type === "choice" &&
          answer.optionId === question.correctOptionId
            ? 1
            : 0;
        break;
      case "boolean":
        score =
          answer.type === "boolean" &&
          answer.value === question.correctValue
            ? 1
            : 0;
        break;
      case "matching": {
        if (answer.type !== "matching") break;
        const correctPairs = question.leftItems.filter(
          (item) =>
            answer.pairs[item.id] === question.correctPairs[item.id],
        ).length;
        score = correctPairs / question.leftItems.length;
        break;
      }
      case "wordBank": {
        if (answer.type !== "wordBank") break;
        const correctBlanks = question.correctWordIds.filter(
          (wordId, index) => answer.wordIds[index] === wordId,
        ).length;
        score = correctBlanks / question.correctWordIds.length;
        break;
      }
    }
  }

  return {
    questionId: question.id,
    knowledgePoint: question.knowledgePoint,
    score,
    status: getAnswerStatus(score),
    answer,
  };
}

export function getMasteryLevel(percentage: number): MasteryLevel {
  if (percentage >= 80) return "mastered";
  if (percentage >= 60) return "reinforce";
  return "weak";
}

export function assessPractice(
  questions: PracticeQuestion[],
  answers: PracticeAnswers,
): PracticeAssessment {
  const questionResults = questions.map((question) =>
    scoreQuestion(question, answers[question.id]),
  );
  const earnedPoints = questionResults.reduce(
    (total, result) => total + result.score,
    0,
  );
  const totalPoints = questions.length;
  const score =
    totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100);

  const knowledgeResults = knowledgePointOrder.map((id) => {
    const matchingResults = questionResults.filter(
      (result) => result.knowledgePoint === id,
    );
    const pointScore =
      matchingResults.length === 0
        ? 0
        : matchingResults.reduce(
            (total, result) => total + result.score,
            0,
          ) / matchingResults.length;
    const percentage = Math.round(pointScore * 100);

    return {
      id,
      name: knowledgePoints[id].name,
      score: pointScore,
      percentage,
      level: getMasteryLevel(percentage),
      advice: knowledgePoints[id].advice,
    };
  });

  return {
    score,
    earnedPoints,
    totalPoints,
    correctCount: questionResults.filter(
      (result) => result.status === "correct",
    ).length,
    questionResults,
    knowledgeResults,
  };
}

export function selectReinforcementQuestions(
  assessment: PracticeAssessment,
  count = 3,
  pool: PracticeQuestion[] = reinforcementQuestions,
) {
  if (count <= 0) return [];

  const ranked = [...assessment.knowledgeResults].sort(
    (a, b) =>
      a.percentage - b.percentage ||
      knowledgePointOrder.indexOf(a.id) - knowledgePointOrder.indexOf(b.id),
  );
  const weakTargets = ranked.filter((result) => result.percentage < 60);
  const reinforceTargets = ranked.filter(
    (result) => result.percentage >= 60 && result.percentage < 80,
  );
  const allMastered =
    weakTargets.length === 0 && reinforceTargets.length === 0;
  const targetTiers = allMastered
    ? [ranked.slice(0, 1)]
    : [weakTargets, reinforceTargets].filter((tier) => tier.length > 0);
  const selected: PracticeQuestion[] = [];

  for (const targets of targetTiers) {
    let addedQuestion = true;
    while (selected.length < count && addedQuestion) {
      addedQuestion = false;
      for (const target of targets) {
        const candidates = pool.filter(
          (question) =>
            question.knowledgePoint === target.id &&
            !selected.some((item) => item.id === question.id) &&
            (!allMastered || question.difficulty === "challenge"),
        );
        const preferred = candidates.find(
          (question) =>
            selected.length === 0 ||
            !selected.some((item) => item.type === question.type),
        );
        const next = preferred ?? candidates[0];
        if (next) {
          selected.push(next);
          addedQuestion = true;
        }
        if (selected.length >= count) break;
      }
    }
    if (selected.length >= count) break;
  }

  if (selected.length < count) {
    const fallback = pool
      .filter((question) => !selected.some((item) => item.id === question.id))
      .sort(
        (a, b) =>
          ranked.findIndex((result) => result.id === a.knowledgePoint) -
          ranked.findIndex((result) => result.id === b.knowledgePoint),
      );

    for (const question of fallback) {
      if (selected.length >= count) break;
      selected.push(question);
    }
  }

  ensureTypeVariety(
    selected,
    pool,
    [...new Set(selected.map((question) => question.knowledgePoint))],
  );
  return selected.slice(0, count);
}

export function createHistoryRecord(
  diagnostic: PracticeAssessment,
  reinforcement?: ReinforcementResult,
  completedAt = new Date().toISOString(),
): PracticeHistoryRecord {
  const ranked = [...diagnostic.knowledgeResults].sort(
    (a, b) => a.percentage - b.percentage,
  );
  const knowledgeScores = Object.fromEntries(
    diagnostic.knowledgeResults.map((result) => [
      result.id,
      result.percentage,
    ]),
  ) as Record<KnowledgePointId, number>;

  return {
    id: `${completedAt}-${Math.random().toString(36).slice(2, 9)}`,
    completedAt,
    diagnosticScore: diagnostic.score,
    knowledgeScores,
    weakestKnowledgePoint: ranked[0]?.id ?? "leverElements",
    reinforcementScore: reinforcement?.assessment.score ?? null,
    reinforcementCompleted: Boolean(reinforcement),
  };
}

export function limitPracticeHistory(
  records: PracticeHistoryRecord[],
  maximum = 10,
) {
  return records.slice(0, Math.max(0, maximum));
}

export function assessDiagnostic(
  answers: PracticeAnswers,
  questions: PracticeQuestion[] = diagnosticQuestions,
) {
  return assessPractice(questions, answers);
}

export function getCorrectAnswerText(question: PracticeQuestion) {
  switch (question.type) {
    case "choice":
      return (
        question.options.find(
          (option) => option.id === question.correctOptionId,
        )?.label ?? ""
      );
    case "boolean":
      return question.correctValue ? "正确" : "错误";
    case "matching":
      return question.leftItems
        .map((left) => {
          const rightId = question.correctPairs[left.id];
          const right = question.rightItems.find(
            (item) => item.id === rightId,
          );
          return `${left.label} → ${right?.label ?? ""}`;
        })
        .join("；");
    case "wordBank":
      return question.correctWordIds
        .map(
          (wordId) =>
            question.words.find((word) => word.id === wordId)?.label ?? "",
        )
        .join("、");
  }
}

export function getAnswerText(
  question: PracticeQuestion,
  answer?: PracticeAnswer,
) {
  if (!answer || answer.type !== question.type) return "未作答";

  switch (question.type) {
    case "choice":
      return answer.type === "choice"
        ? question.options.find((option) => option.id === answer.optionId)
            ?.label ?? "未作答"
        : "未作答";
    case "boolean":
      return answer.type === "boolean"
        ? answer.value
          ? "正确"
          : "错误"
        : "未作答";
    case "matching":
      return answer.type === "matching"
        ? question.leftItems
            .map((left) => {
              const right = question.rightItems.find(
                (item) => item.id === answer.pairs[left.id],
              );
              return `${left.label} → ${right?.label ?? "未配对"}`;
            })
            .join("；")
        : "未作答";
    case "wordBank":
      return answer.type === "wordBank"
        ? answer.wordIds
            .map(
              (wordId) =>
                question.words.find((word) => word.id === wordId)?.label ??
                "未填写",
            )
            .join("、")
        : "未作答";
  }
}

function getAnswerStatus(score: number): AnswerStatus {
  if (score === 1) return "correct";
  if (score > 0) return "partial";
  return "incorrect";
}

function ensureTypeVariety(
  selected: PracticeQuestion[],
  pool: PracticeQuestion[],
  targetIds: KnowledgePointId[],
) {
  if (selected.length < 2 || new Set(selected.map((item) => item.type)).size > 1) {
    return;
  }

  const usedType = selected[0].type;
  const replacement = pool.find(
    (question) =>
      targetIds.includes(question.knowledgePoint) &&
      question.type !== usedType &&
      !selected.some((item) => item.id === question.id),
  );

  if (replacement) selected[selected.length - 1] = replacement;
}

export function getQuestionTypeLabel(type: PracticeQuestionType) {
  const labels: Record<PracticeQuestionType, string> = {
    choice: "选择题",
    boolean: "判断题",
    matching: "连线题",
    wordBank: "实验探究题",
  };
  return labels[type];
}
