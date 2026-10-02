import { Check, Circle } from "lucide-react";

import {
  learningActivities,
  useLearningStore,
} from "@/store/useLearningStore";

interface LearningProgressProps {
  compact?: boolean;
}

export function LearningProgress({
  compact = false,
}: LearningProgressProps) {
  const completedActivities = useLearningStore(
    (state) => state.completedActivities,
  );
  const completedCount = completedActivities.length;
  const progress = Math.round(
    (completedCount / learningActivities.length) * 100,
  );

  if (compact) {
    return (
      <div
        aria-label={`学习进度 ${progress}%`}
        className="hidden min-w-36 items-center gap-3 desktop:flex"
      >
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10">
          <div
            className="h-full rounded-full bg-action transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="whitespace-nowrap text-xs font-bold text-ink">
          {completedCount}/{learningActivities.length}
        </span>
      </div>
    );
  }

  return (
    <aside className="paper-card relative overflow-hidden p-5 tablet:p-6">
      <div className="absolute -right-8 -top-8 size-32 rounded-full bg-action/10" />
      <div className="relative">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-science-dark">
              学习记录
            </p>
            <p className="mt-2 text-2xl font-extrabold text-ink">
              {completedCount} / {learningActivities.length} 项
            </p>
          </div>
          <span className="font-display text-4xl text-action">{progress}%</span>
        </div>

        <div
          className="mt-4 h-3 overflow-hidden rounded-full border border-ink/10 bg-paper"
          role="progressbar"
          aria-label="课程完成进度"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className="h-full rounded-full bg-action transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <ul className="mt-5 grid grid-cols-2 gap-3">
          {learningActivities.map((activity) => {
            const isComplete = completedActivities.includes(activity.id);
            const StatusIcon = isComplete ? Check : Circle;

            return (
              <li
                key={activity.id}
                className="flex items-center gap-2 text-xs font-semibold text-muted"
              >
                <StatusIcon
                  aria-hidden="true"
                  className={isComplete ? "size-4 text-resistance" : "size-4"}
                />
                {activity.label}
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
