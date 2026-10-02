import { Link2, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";

import type { MatchingQuestion as MatchingQuestionData } from "@/data/practiceQuestions";
import { cn } from "@/lib/utils";
import type { PracticeAnswer } from "@/lib/practiceAssessment";

interface MatchingQuestionProps {
  question: MatchingQuestionData;
  answer?: PracticeAnswer;
  onChange: (answer: PracticeAnswer) => void;
  disabled?: boolean;
}

export function MatchingQuestion({
  question,
  answer,
  onChange,
  disabled = false,
}: MatchingQuestionProps) {
  const [activeLeftId, setActiveLeftId] = useState<string | null>(null);
  const pairs = answer?.type === "matching" ? answer.pairs : {};

  useEffect(() => {
    setActiveLeftId(null);
  }, [question.id]);

  const connect = (rightId: string) => {
    if (!activeLeftId || disabled) return;

    const nextPairs = Object.fromEntries(
      Object.entries(pairs).filter(
        ([leftId, pairedRightId]) =>
          leftId === activeLeftId || pairedRightId !== rightId,
      ),
    );
    nextPairs[activeLeftId] = rightId;
    onChange({ type: "matching", pairs: nextPairs });
    setActiveLeftId(null);
  };

  const clearPair = (leftId: string) => {
    if (disabled) return;
    const nextPairs = { ...pairs };
    delete nextPairs[leftId];
    onChange({ type: "matching", pairs: nextPairs });
  };

  return (
    <div>
      <p className="mb-4 text-sm font-semibold text-muted">
        先选择左侧项目，再选择右侧答案。
      </p>
      <div className="grid gap-4 tablet:grid-cols-2">
        <div className="space-y-2" aria-label="待配对项目">
          {question.leftItems.map((item, index) => {
            const selected = activeLeftId === item.id;
            const paired = pairs[item.id];

            return (
              <button
                key={item.id}
                type="button"
                disabled={disabled}
                aria-pressed={selected}
                onClick={() => setActiveLeftId(item.id)}
                className={cn(
                  "flex min-h-12 w-full items-center gap-3 rounded-lg border-2 bg-white px-3 py-2 text-left text-sm font-bold",
                  selected
                    ? "border-action bg-action/10"
                    : paired
                      ? "border-science/50"
                      : "border-ink/15",
                )}
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-xs text-white">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">{item.label}</span>
                {paired && (
                  <span className="text-xs text-science-dark">已连接</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="space-y-2" aria-label="可选答案">
          {question.rightItems.map((item) => {
            const pairedEntry = Object.entries(pairs).find(
              ([, rightId]) => rightId === item.id,
            );
            const pairNumber = pairedEntry
              ? question.leftItems.findIndex(
                  (left) => left.id === pairedEntry[0],
                ) + 1
              : null;

            return (
              <button
                key={item.id}
                type="button"
                disabled={disabled || !activeLeftId}
                onClick={() => connect(item.id)}
                className={cn(
                  "flex min-h-12 w-full items-center gap-3 rounded-lg border-2 bg-white px-3 py-2 text-left text-sm font-bold",
                  pairNumber
                    ? "border-science/50 text-science-dark"
                    : "border-ink/15",
                  activeLeftId && !disabled && "hover:border-action",
                )}
              >
                <Link2 aria-hidden="true" className="size-4 shrink-0" />
                <span className="min-w-0 flex-1">{item.label}</span>
                {pairNumber && (
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-science text-xs text-white">
                    {pairNumber}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {!disabled && Object.keys(pairs).length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {question.leftItems
            .filter((item) => pairs[item.id])
            .map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => clearPair(item.id)}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-ink/15 bg-white px-3 py-2 text-xs font-bold text-muted"
                aria-label={`取消${item.label}的配对`}
              >
                <X aria-hidden="true" className="size-4" />
                取消 {item.label}
              </button>
            ))}
          <button
            type="button"
            onClick={() => {
              setActiveLeftId(null);
              onChange({ type: "matching", pairs: {} });
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-ink/15 bg-white px-3 py-2 text-xs font-bold text-muted"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            全部重置
          </button>
        </div>
      )}
    </div>
  );
}
