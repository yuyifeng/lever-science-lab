import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";

import {
  knowledgePointOrder,
  reinforcementQuestions,
  type KnowledgePointId,
  type PracticeQuestion,
} from "@/data/practiceQuestions";
import {
  createDiagnosticSet,
  diagnosticQuestionBank,
  getDiagnosticQuestions,
} from "@/data/practiceQuestionBank";
import {
  assessDiagnostic,
  assessPractice,
  createHistoryRecord,
  isAnswerComplete,
  limitPracticeHistory,
  selectReinforcementQuestions,
  type PracticeAnswer,
  type PracticeAnswers,
  type PracticeAssessment,
  type PracticeHistoryRecord,
  type ReinforcementResult,
} from "@/lib/practiceAssessment";

export type PracticePhase =
  | "intro"
  | "diagnostic"
  | "report"
  | "reinforcement"
  | "complete";

interface PracticeState {
  phase: PracticePhase;
  currentQuestionIndex: number;
  diagnosticQuestionIds: string[];
  diagnosticAnswers: PracticeAnswers;
  diagnosticReport: PracticeAssessment | null;
  reinforcementQuestionIds: string[];
  reinforcementAnswers: PracticeAnswers;
  submittedReinforcementIds: string[];
  reinforcementResult: ReinforcementResult | null;
  history: PracticeHistoryRecord[];
  storageAvailable: boolean;
  startDiagnostic: () => void;
  setCurrentQuestionIndex: (index: number) => void;
  saveDiagnosticAnswer: (questionId: string, answer: PracticeAnswer) => void;
  submitDiagnostic: () => boolean;
  startReinforcement: () => void;
  saveReinforcementAnswer: (
    questionId: string,
    answer: PracticeAnswer,
  ) => void;
  submitReinforcementQuestion: (questionId: string) => boolean;
  restartPractice: () => void;
  clearHistory: () => void;
}

const initialSession = {
  phase: "intro" as PracticePhase,
  currentQuestionIndex: 0,
  diagnosticQuestionIds: [] as string[],
  diagnosticAnswers: {} as PracticeAnswers,
  diagnosticReport: null as PracticeAssessment | null,
  reinforcementQuestionIds: [] as string[],
  reinforcementAnswers: {} as PracticeAnswers,
  submittedReinforcementIds: [] as string[],
  reinforcementResult: null as ReinforcementResult | null,
};

let storageAvailable = true;
let reportStorageUnavailable: (() => void) | undefined;

const setStorageUnavailable = () => {
  storageAvailable = false;
  reportStorageUnavailable?.();
};

const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return window.localStorage.getItem(name);
    } catch {
      setStorageUnavailable();
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      setStorageUnavailable();
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name);
    } catch {
      setStorageUnavailable();
    }
  },
};

export const usePracticeStore = create<PracticeState>()(
  persist(
    (set, get) => ({
      ...initialSession,
      history: [],
      storageAvailable,
      startDiagnostic: () => {
        const diagnosticQuestionIds = createDiagnosticSet().map(
          (question) => question.id,
        );
        set({
          ...initialSession,
          phase: "diagnostic",
          diagnosticQuestionIds,
        });
      },
      setCurrentQuestionIndex: (index) => {
        const questionCount = get().diagnosticQuestionIds.length;
        set({
          currentQuestionIndex: Math.min(
            Math.max(index, 0),
            Math.max(0, questionCount - 1),
          ),
        });
      },
      saveDiagnosticAnswer: (questionId, answer) =>
        set((state) => ({
          diagnosticAnswers: {
            ...state.diagnosticAnswers,
            [questionId]: answer,
          },
        })),
      submitDiagnostic: () => {
        const { diagnosticAnswers, diagnosticQuestionIds } = get();
        const diagnosticQuestions = getDiagnosticQuestions(
          diagnosticQuestionIds,
        );
        if (diagnosticQuestions.length !== 10) return false;

        const allComplete = diagnosticQuestions.every((question) =>
          isAnswerComplete(question, diagnosticAnswers[question.id]),
        );
        if (!allComplete) return false;

        const diagnosticReport = assessDiagnostic(
          diagnosticAnswers,
          diagnosticQuestions,
        );
        const reinforcementQuestionIds = selectReinforcementQuestions(
          diagnosticReport,
        ).map((question) => question.id);
        set({
          phase: "report",
          diagnosticReport,
          reinforcementQuestionIds,
          currentQuestionIndex: 0,
        });
        return true;
      },
      startReinforcement: () =>
        set({ phase: "reinforcement", currentQuestionIndex: 0 }),
      saveReinforcementAnswer: (questionId, answer) =>
        set((state) => ({
          reinforcementAnswers: {
            ...state.reinforcementAnswers,
            [questionId]: answer,
          },
        })),
      submitReinforcementQuestion: (questionId) => {
        const state = get();
        const question = reinforcementQuestions.find(
          (item) => item.id === questionId,
        );
        const answer = state.reinforcementAnswers[questionId];
        if (!question || !isAnswerComplete(question, answer)) return false;

        const submittedReinforcementIds = state.submittedReinforcementIds.includes(
          questionId,
        )
          ? state.submittedReinforcementIds
          : [...state.submittedReinforcementIds, questionId];
        const selectedQuestions = getSelectedReinforcementQuestions(
          state.reinforcementQuestionIds,
        );
        const isComplete = selectedQuestions.every((item) =>
          submittedReinforcementIds.includes(item.id),
        );

        if (!isComplete) {
          set({ submittedReinforcementIds });
          return true;
        }

        const diagnosticReport =
          state.diagnosticReport ??
          assessDiagnostic(
            state.diagnosticAnswers,
            getDiagnosticQuestions(state.diagnosticQuestionIds),
          );
        const reinforcementResult = {
          assessment: assessPractice(
            selectedQuestions,
            state.reinforcementAnswers,
          ),
          completedCount: selectedQuestions.length,
        };
        const record = createHistoryRecord(
          diagnosticReport,
          reinforcementResult,
        );

        set({
          phase: "complete",
          submittedReinforcementIds,
          diagnosticReport,
          reinforcementResult,
          history: limitPracticeHistory([record, ...state.history]),
        });
        return true;
      },
      restartPractice: () => set(initialSession),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "lever-practice-history-v1",
      version: 3,
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        phase: state.phase,
        currentQuestionIndex: state.currentQuestionIndex,
        diagnosticQuestionIds: state.diagnosticQuestionIds,
        diagnosticAnswers: state.diagnosticAnswers,
        reinforcementQuestionIds: state.reinforcementQuestionIds,
        reinforcementAnswers: state.reinforcementAnswers,
        submittedReinforcementIds: state.submittedReinforcementIds,
        history: state.history,
      }),
      migrate: (persistedState, version) => {
        const sanitized = sanitizePersistedState(persistedState);
        if (version < 3) {
          return {
            ...initialSession,
            history: sanitized.history,
          };
        }
        return sanitized;
      },
      merge: (persistedState, currentState) => {
        const persisted = sanitizePersistedState(persistedState);
        const diagnosticQuestions = getDiagnosticQuestions(
          persisted.diagnosticQuestionIds,
        );
        const diagnosticReport =
          persisted.phase === "intro"
            ? null
            : assessDiagnostic(
                persisted.diagnosticAnswers,
                diagnosticQuestions,
              );
        const selectedQuestions = getSelectedReinforcementQuestions(
          persisted.reinforcementQuestionIds,
        );
        const reinforcementResult =
          persisted.phase === "complete" && selectedQuestions.length > 0
            ? {
                assessment: assessPractice(
                  selectedQuestions,
                  persisted.reinforcementAnswers,
                ),
                completedCount: selectedQuestions.length,
              }
            : null;

        return {
          ...currentState,
          ...persisted,
          diagnosticReport,
          reinforcementResult,
          storageAvailable,
        };
      },
    },
  ),
);

reportStorageUnavailable = () => {
  if (!usePracticeStore.getState().storageAvailable) return;
  usePracticeStore.setState({ storageAvailable: false });
};
if (!storageAvailable) reportStorageUnavailable();

interface PersistedPracticeState {
  phase: PracticePhase;
  currentQuestionIndex: number;
  diagnosticQuestionIds: string[];
  diagnosticAnswers: PracticeAnswers;
  reinforcementQuestionIds: string[];
  reinforcementAnswers: PracticeAnswers;
  submittedReinforcementIds: string[];
  history: PracticeHistoryRecord[];
}

export function sanitizePersistedState(
  value: unknown,
): PersistedPracticeState {
  if (!isRecord(value)) {
    return {
      ...initialSession,
      history: [],
    };
  }

  const validPhases: PracticePhase[] = [
    "intro",
    "diagnostic",
    "report",
    "reinforcement",
    "complete",
  ];
  const requestedPhase = validPhases.includes(value.phase as PracticePhase)
    ? (value.phase as PracticePhase)
    : "intro";
  const diagnosticQuestionIds = isStringArray(value.diagnosticQuestionIds)
    ? value.diagnosticQuestionIds.filter((id) =>
        diagnosticQuestionBank.some((question) => question.id === id),
      )
    : [];
  const diagnosticQuestions = getDiagnosticQuestions(diagnosticQuestionIds);
  const hasValidDiagnosticSet =
    diagnosticQuestionIds.length === 10 &&
    new Set(diagnosticQuestionIds).size === diagnosticQuestionIds.length &&
    diagnosticQuestions.filter((question) => question.type === "choice")
      .length === 6 &&
    diagnosticQuestions.filter((question) => question.type === "boolean")
      .length === 4 &&
    knowledgePointOrder.every((knowledgePoint) =>
      diagnosticQuestions.some(
        (question) => question.knowledgePoint === knowledgePoint,
      ),
    );

  if (requestedPhase !== "intro" && !hasValidDiagnosticSet) {
    return {
      ...initialSession,
      history: Array.isArray(value.history)
        ? limitPracticeHistory(value.history.filter(isPracticeHistoryRecord))
        : [],
    };
  }

  const reinforcementQuestionIds = isStringArray(
    value.reinforcementQuestionIds,
  )
    ? value.reinforcementQuestionIds.filter((id) =>
        reinforcementQuestions.some((question) => question.id === id),
      )
    : [];
  const selectedReinforcementQuestions = getSelectedReinforcementQuestions(
    reinforcementQuestionIds,
  );
  const diagnosticAnswers = sanitizeAnswers(
    value.diagnosticAnswers,
    diagnosticQuestions,
  );
  const reinforcementAnswers = sanitizeAnswers(
    value.reinforcementAnswers,
    selectedReinforcementQuestions,
  );
  const submittedReinforcementIds = isStringArray(
    value.submittedReinforcementIds,
  )
    ? [
        ...new Set(
          value.submittedReinforcementIds.filter((id) =>
            reinforcementQuestionIds.includes(id),
          ),
        ),
      ]
    : [];
  const hasCompleteDiagnostic = diagnosticQuestions.every((question) =>
    isAnswerComplete(question, diagnosticAnswers[question.id]),
  );
  const hasValidReinforcementSet =
    reinforcementQuestionIds.length === 3 &&
    new Set(reinforcementQuestionIds).size ===
      reinforcementQuestionIds.length;
  const hasCompleteReinforcement =
    hasValidReinforcementSet &&
    selectedReinforcementQuestions.every(
      (question) =>
        submittedReinforcementIds.includes(question.id) &&
        isAnswerComplete(question, reinforcementAnswers[question.id]),
    );
  let phase = requestedPhase;
  if (phase !== "intro" && phase !== "diagnostic" && !hasCompleteDiagnostic) {
    phase = "diagnostic";
  } else if (
    (phase === "report" ||
      phase === "reinforcement" ||
      phase === "complete") &&
    !hasValidReinforcementSet
  ) {
    phase = "intro";
  } else if (phase === "reinforcement" && hasCompleteReinforcement) {
    phase = "complete";
  } else if (phase === "complete" && !hasCompleteReinforcement) {
    phase = "reinforcement";
  }

  return {
    phase,
    currentQuestionIndex:
      typeof value.currentQuestionIndex === "number"
        ? Math.max(0, Math.floor(value.currentQuestionIndex))
        : 0,
    diagnosticQuestionIds,
    diagnosticAnswers,
    reinforcementQuestionIds,
    reinforcementAnswers,
    submittedReinforcementIds,
    history: Array.isArray(value.history)
      ? limitPracticeHistory(
          value.history.filter(isPracticeHistoryRecord),
        )
      : [],
  };
}

function getSelectedReinforcementQuestions(ids: string[]) {
  return ids
    .map((id) => reinforcementQuestions.find((question) => question.id === id))
    .filter(
      (question): question is (typeof reinforcementQuestions)[number] =>
        Boolean(question),
    );
}

function sanitizeAnswers(
  value: unknown,
  questions: PracticeQuestion[],
): PracticeAnswers {
  if (!isRecord(value)) return {};

  return Object.fromEntries(
    questions.flatMap((question) => {
      const answer = value[question.id];
      return isPracticeAnswer(question, answer)
        ? [[question.id, answer] as const]
        : [];
    }),
  );
}

function isPracticeAnswer(
  question: PracticeQuestion,
  value: unknown,
): value is PracticeAnswer {
  if (!isRecord(value) || value.type !== question.type) return false;

  switch (question.type) {
    case "choice":
      return (
        typeof value.optionId === "string" &&
        question.options.some((option) => option.id === value.optionId)
      );
    case "boolean":
      return typeof value.value === "boolean";
    case "matching":
      return (
        isRecord(value.pairs) &&
        Object.entries(value.pairs).every(
          ([leftId, rightId]) =>
            typeof rightId === "string" &&
            question.leftItems.some((item) => item.id === leftId) &&
            question.rightItems.some((item) => item.id === rightId),
        )
      );
    case "wordBank":
      return (
        Array.isArray(value.wordIds) &&
        value.wordIds.length === question.correctWordIds.length &&
        value.wordIds.every(
          (wordId) =>
            wordId === null ||
            (typeof wordId === "string" &&
              question.words.some((word) => word.id === wordId)),
        )
      );
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isPracticeHistoryRecord(
  value: unknown,
): value is PracticeHistoryRecord {
  if (!isRecord(value)) return false;

  const hasValidReinforcementResult =
    (value.reinforcementCompleted === true &&
      isScore(value.reinforcementScore)) ||
    (value.reinforcementCompleted === false &&
      value.reinforcementScore === null);

  return (
    typeof value.id === "string" &&
    typeof value.completedAt === "string" &&
    isScore(value.diagnosticScore) &&
    isKnowledgeScores(value.knowledgeScores) &&
    isKnowledgePointId(value.weakestKnowledgePoint) &&
    hasValidReinforcementResult
  );
}

function isKnowledgePointId(value: unknown): value is KnowledgePointId {
  return (
    typeof value === "string" &&
    knowledgePointOrder.includes(value as KnowledgePointId)
  );
}

function isKnowledgeScores(
  value: unknown,
): value is Record<KnowledgePointId, number> {
  return (
    isRecord(value) &&
    knowledgePointOrder.every((id) => isScore(value[id]))
  );
}

function isScore(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 100
  );
}
