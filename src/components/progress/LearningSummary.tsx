import {
  CheckCircle2,
  ClipboardCheck,
  FlaskConical,
  RotateCcw,
  Trophy,
} from "lucide-react";

import {
  learningActivities,
  useLearningStore,
} from "@/store/useLearningStore";

interface LearningSummaryProps {
  onRestartExperiment: () => void;
  onRestartPractices: () => void;
  onRestartComprehensivePractice: () => void;
}

const achievements = [
  "认识五要素",
  "会用力矩判断",
  "能辨别三种杠杆",
  "完成诊断并巩固薄弱点",
];

export function LearningSummary({
  onRestartExperiment,
  onRestartPractices,
  onRestartComprehensivePractice,
}: LearningSummaryProps) {
  const completedActivities = useLearningStore(
    (state) => state.completedActivities,
  );
  const isComplete =
    completedActivities.length === learningActivities.length;

  if (!isComplete) return null;

  return (
    <section
      id="summary"
      aria-labelledby="summary-title"
      className="border-t border-ink/10 bg-[#e5eee7] py-12 tablet:py-16"
    >
      <div className="container">
        <div className="border-2 border-resistance/30 bg-white/75 p-6 shadow-card tablet:p-8">
          <div className="flex flex-col gap-6 tablet:flex-row tablet:items-center tablet:justify-between">
            <div>
              <span className="eyebrow">
                <Trophy aria-hidden="true" className="size-4" />
                全部完成
              </span>
              <h2 id="summary-title" className="mt-4 text-3xl font-extrabold">
                你已经会用杠杆的眼光观察世界
              </h2>
              <ul className="mt-5 grid gap-3 tablet:grid-cols-2">
                {achievements.map((achievement) => (
                  <li
                    key={achievement}
                    className="flex items-center gap-2 text-sm font-bold"
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className="size-5 text-resistance"
                    />
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex shrink-0 flex-col gap-3">
              <button
                type="button"
                onClick={onRestartComprehensivePractice}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-action px-5 py-3 text-sm font-extrabold text-ink"
              >
                <ClipboardCheck aria-hidden="true" className="size-4" />
                再做综合练习
              </button>
              <button
                type="button"
                onClick={onRestartExperiment}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-extrabold text-white"
              >
                <FlaskConical aria-hidden="true" className="size-4" />
                重新挑战实验
              </button>
              <button
                type="button"
                onClick={onRestartPractices}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border-2 border-ink/20 bg-white px-5 py-3 text-sm font-extrabold text-ink"
              >
                <RotateCcw aria-hidden="true" className="size-4" />
                重新练习
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
