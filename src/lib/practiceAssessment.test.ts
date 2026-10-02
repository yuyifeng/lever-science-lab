import { describe, expect, it } from "vitest";

import {
  diagnosticQuestions,
  reinforcementQuestions,
  type PracticeQuestion,
} from "@/data/practiceQuestions";
import {
  createDiagnosticSet,
  diagnosticQuestionBank,
  getDiagnosticQuestions,
} from "@/data/practiceQuestionBank";
import {
  assessDiagnostic,
  getMasteryLevel,
  limitPracticeHistory,
  scoreQuestion,
  selectReinforcementQuestions,
  type PracticeAnswers,
  type PracticeHistoryRecord,
} from "@/lib/practiceAssessment";
import { sanitizePersistedState } from "@/store/usePracticeStore";

describe("practice assessment", () => {
  it("scores choice and boolean questions", () => {
    const choice = diagnosticQuestions.find(
      (question) => question.type === "choice",
    );
    const boolean = diagnosticQuestions.find(
      (question) => question.type === "boolean",
    );

    expect(choice).toBeDefined();
    expect(boolean).toBeDefined();
    if (!choice || choice.type !== "choice") return;
    if (!boolean || boolean.type !== "boolean") return;

    expect(
      scoreQuestion(choice, {
        type: "choice",
        optionId: choice.correctOptionId,
      }).score,
    ).toBe(1);
    expect(
      scoreQuestion(choice, { type: "choice", optionId: "wrong" }).score,
    ).toBe(0);
    expect(
      scoreQuestion(boolean, {
        type: "boolean",
        value: boolean.correctValue,
      }).status,
    ).toBe("correct");
  });

  it("contains exactly six choices and four true-false questions", () => {
    expect(diagnosticQuestions).toHaveLength(10);
    expect(
      diagnosticQuestions.filter((question) => question.type === "choice"),
    ).toHaveLength(6);
    expect(
      diagnosticQuestions.filter((question) => question.type === "boolean"),
    ).toHaveLength(4);
    expect(
      diagnosticQuestions.every((question) =>
        ["choice", "boolean"].includes(question.type),
      ),
    ).toBe(true);
  });

  it("builds a 100-question diagnostic bank", () => {
    expect(diagnosticQuestionBank).toHaveLength(100);
    expect(new Set(diagnosticQuestionBank.map((question) => question.id)).size)
      .toBe(100);
    expect(
      diagnosticQuestionBank.filter((question) => question.type === "choice"),
    ).toHaveLength(60);
    expect(
      diagnosticQuestionBank.filter((question) => question.type === "boolean"),
    ).toHaveLength(40);
  });

  it("randomly selects ten unique questions with the required type mix", () => {
    const questions = createDiagnosticSet(() => 0.37);

    expect(questions).toHaveLength(10);
    expect(new Set(questions.map((question) => question.id)).size).toBe(10);
    expect(
      questions.filter((question) => question.type === "choice"),
    ).toHaveLength(6);
    expect(
      questions.filter((question) => question.type === "boolean"),
    ).toHaveLength(4);
    expect(new Set(questions.map((question) => question.knowledgePoint)).size)
      .toBe(4);
    expect(getDiagnosticQuestions(questions.map((question) => question.id)))
      .toEqual(questions);
  });

  it("uses the 60 and 80 percent mastery boundaries", () => {
    expect(getMasteryLevel(59)).toBe("weak");
    expect(getMasteryLevel(60)).toBe("reinforce");
    expect(getMasteryLevel(79)).toBe("reinforce");
    expect(getMasteryLevel(80)).toBe("mastered");
  });

  it("aggregates all four diagnostic knowledge points", () => {
    const answers = createCorrectAnswers(diagnosticQuestions);
    const firstElementsQuestion = diagnosticQuestions.find(
      (question) => question.knowledgePoint === "leverElements",
    );
    expect(firstElementsQuestion).toBeDefined();
    if (!firstElementsQuestion) return;

    answers[firstElementsQuestion.id] = incorrectAnswer(firstElementsQuestion);
    const assessment = assessDiagnostic(answers);

    expect(assessment.knowledgeResults).toHaveLength(4);
    expect(
      assessment.knowledgeResults.find(
        (result) => result.id === "leverElements",
      )?.percentage,
    ).toBe(67);
    expect(
      assessment.knowledgeResults
        .filter((result) => result.id !== "leverElements")
        .every((result) => result.percentage === 100),
    ).toBe(true);
  });

  it("selects three unique questions from weak points with mixed types", () => {
    const answers = createCorrectAnswers(diagnosticQuestions);
    diagnosticQuestions
      .filter((question) =>
        ["leverElements", "leverTypes"].includes(question.knowledgePoint),
      )
      .forEach((question) => {
        answers[question.id] = incorrectAnswer(question);
      });

    const selected = selectReinforcementQuestions(
      assessDiagnostic(answers),
    );

    expect(selected).toHaveLength(3);
    expect(new Set(selected.map((question) => question.id)).size).toBe(3);
    expect(
      selected.every((question) =>
        ["leverElements", "leverTypes"].includes(question.knowledgePoint),
      ),
    ).toBe(true);
    expect(new Set(selected.map((question) => question.type)).size).toBeGreaterThan(
      1,
    );
    expect(
      selected.every((question) =>
        ["choice", "boolean"].includes(question.type),
      ),
    ).toBe(true);
  });

  it("uses challenge questions from the lowest point when all are mastered", () => {
    const assessment = assessDiagnostic(
      createCorrectAnswers(diagnosticQuestions),
    );
    const selected = selectReinforcementQuestions(assessment);

    expect(selected).toHaveLength(3);
    expect(
      selected.every(
        (question) =>
          question.knowledgePoint === "leverElements" &&
          question.difficulty === "challenge",
      ),
    ).toBe(true);
  });

  it("keeps only the latest ten history records", () => {
    const records = Array.from({ length: 11 }, (_, index) =>
      createHistoryRecord(index),
    );

    expect(limitPracticeHistory(records)).toHaveLength(10);
    expect(limitPracticeHistory(records)[0].id).toBe("record-0");
    expect(limitPracticeHistory(records)[9].id).toBe("record-9");
  });

  it("falls back safely when persisted state is damaged", () => {
    expect(sanitizePersistedState("broken")).toMatchObject({
      phase: "intro",
      diagnosticQuestionIds: [],
      diagnosticAnswers: {},
      reinforcementQuestionIds: [],
      history: [],
    });

    expect(
      sanitizePersistedState({
        phase: "unknown",
        history: [{ bad: true }],
        reinforcementQuestionIds: ["missing-question"],
      }),
    ).toMatchObject({
      phase: "intro",
      reinforcementQuestionIds: [],
      history: [],
    });
  });

  it("contains at least four reinforcement questions per knowledge point", () => {
    const counts = reinforcementQuestions.reduce<Record<string, number>>(
      (result, question) => ({
        ...result,
        [question.knowledgePoint]:
          (result[question.knowledgePoint] ?? 0) + 1,
      }),
      {},
    );

    expect(Object.values(counts).every((count) => count >= 4)).toBe(true);
  });
});

function createCorrectAnswers(questions: PracticeQuestion[]) {
  return Object.fromEntries(
    questions.map((question) => [question.id, correctAnswer(question)]),
  ) as PracticeAnswers;
}

function correctAnswer(question: PracticeQuestion) {
  switch (question.type) {
    case "choice":
      return { type: "choice" as const, optionId: question.correctOptionId };
    case "boolean":
      return { type: "boolean" as const, value: question.correctValue };
    case "matching":
      return { type: "matching" as const, pairs: question.correctPairs };
    case "wordBank":
      return {
        type: "wordBank" as const,
        wordIds: question.correctWordIds,
      };
  }
}

function incorrectAnswer(question: PracticeQuestion) {
  switch (question.type) {
    case "choice":
      return { type: "choice" as const, optionId: "wrong" };
    case "boolean":
      return { type: "boolean" as const, value: !question.correctValue };
    case "matching":
      return {
        type: "matching" as const,
        pairs: Object.fromEntries(
          question.leftItems.map((item) => [item.id, "wrong"]),
        ),
      };
    case "wordBank":
      return {
        type: "wordBank" as const,
        wordIds: question.correctWordIds.map(() => "wrong"),
      };
  }
}

function createHistoryRecord(index: number): PracticeHistoryRecord {
  return {
    id: `record-${index}`,
    completedAt: new Date(2026, 0, index + 1).toISOString(),
    diagnosticScore: 50,
    knowledgeScores: {
      leverElements: 50,
      armComparison: 50,
      leverPrinciple: 50,
      leverTypes: 50,
    },
    weakestKnowledgePoint: "leverElements",
    reinforcementScore: 67,
    reinforcementCompleted: true,
  };
}
