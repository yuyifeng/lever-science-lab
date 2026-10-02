import { create } from "zustand";

import type { ChapterId } from "@/data/chapters";
import type { LeverElementId } from "@/data/leverElements";

export type LearningActivityId =
  | "elements"
  | "elementPractice"
  | "experiment"
  | "types"
  | "comprehensivePractice";

export const learningActivities: {
  id: LearningActivityId;
  label: string;
  chapter: ChapterId;
}[] = [
  { id: "elements", label: "认识五要素", chapter: "intro" },
  { id: "elementPractice", label: "完成要素练习", chapter: "intro" },
  { id: "experiment", label: "用力矩做实验", chapter: "experiment" },
  { id: "types", label: "辨别三种杠杆", chapter: "types" },
  {
    id: "comprehensivePractice",
    label: "完成综合练习",
    chapter: "practice",
  },
];

interface LearningState {
  activeChapter: ChapterId;
  completedActivities: LearningActivityId[];
  exploredElements: LeverElementId[];
  answeredElementQuestions: number[];
  practiceRevision: number;
  setActiveChapter: (chapter: ChapterId) => void;
  completeActivity: (activity: LearningActivityId) => void;
  exploreElement: (element: LeverElementId, total: number) => void;
  answerElementQuestion: (index: number, total: number) => void;
  restartExperiment: () => void;
  restartPractices: () => void;
}

const appendUnique = <T,>(items: T[], item: T) =>
  items.includes(item) ? items : [...items, item];

const complete = (
  activities: LearningActivityId[],
  activity: LearningActivityId,
) => appendUnique(activities, activity);

export const useLearningStore = create<LearningState>((set) => ({
  activeChapter: "intro",
  completedActivities: [],
  exploredElements: [],
  answeredElementQuestions: [],
  practiceRevision: 0,
  setActiveChapter: (activeChapter) => set({ activeChapter }),
  completeActivity: (activity) =>
    set((state) => ({
      completedActivities: complete(state.completedActivities, activity),
    })),
  exploreElement: (element, total) =>
    set((state) => {
      const exploredElements = appendUnique(state.exploredElements, element);
      return {
        exploredElements,
        completedActivities:
          exploredElements.length >= total
            ? complete(state.completedActivities, "elements")
            : state.completedActivities,
      };
    }),
  answerElementQuestion: (index, total) =>
    set((state) => {
      const answeredElementQuestions = appendUnique(
        state.answeredElementQuestions,
        index,
      );
      return {
        answeredElementQuestions,
        completedActivities:
          answeredElementQuestions.length >= total
            ? complete(state.completedActivities, "elementPractice")
            : state.completedActivities,
      };
    }),
  restartExperiment: () =>
    set((state) => ({
      completedActivities: state.completedActivities.filter(
        (activity) => activity !== "experiment",
      ),
    })),
  restartPractices: () =>
    set((state) => ({
      completedActivities: state.completedActivities.filter(
        (activity) =>
          activity !== "elementPractice" &&
          activity !== "types" &&
          activity !== "comprehensivePractice",
      ),
      answeredElementQuestions: [],
      practiceRevision: state.practiceRevision + 1,
    })),
}));

export function getCompletedChapters(
  completedActivities: LearningActivityId[],
) {
  return (["intro", "experiment", "types", "practice"] as ChapterId[]).filter(
    (chapter) =>
      learningActivities
        .filter((activity) => activity.chapter === chapter)
        .every((activity) => completedActivities.includes(activity.id)),
  );
}
