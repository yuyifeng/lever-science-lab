import { RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";

import type { WordBankQuestion as WordBankQuestionData } from "@/data/practiceQuestions";
import { cn } from "@/lib/utils";
import type { PracticeAnswer } from "@/lib/practiceAssessment";

interface WordBankQuestionProps {
  question: WordBankQuestionData;
  answer?: PracticeAnswer;
  onChange: (answer: PracticeAnswer) => void;
  disabled?: boolean;
}

export function WordBankQuestion({
  question,
  answer,
  onChange,
  disabled = false,
}: WordBankQuestionProps) {
  const [activeBlank, setActiveBlank] = useState(0);
  const wordIds =
    answer?.type === "wordBank"
      ? answer.wordIds
      : Array<string | null>(question.correctWordIds.length).fill(null);

  useEffect(() => {
    setActiveBlank(0);
  }, [question.id]);

  const fillBlank = (wordId: string) => {
    if (disabled) return;
    const next = [...wordIds];
    const priorIndex = next.indexOf(wordId);
    if (priorIndex >= 0) next[priorIndex] = null;
    next[activeBlank] = wordId;
    onChange({ type: "wordBank", wordIds: next });

    const nextEmpty = next.findIndex(
      (item, index) => item === null && index > activeBlank,
    );
    if (nextEmpty >= 0) setActiveBlank(nextEmpty);
  };

  const clearBlank = (index: number) => {
    if (disabled) return;
    const next = [...wordIds];
    next[index] = null;
    onChange({ type: "wordBank", wordIds: next });
    setActiveBlank(index);
  };

  return (
    <div>
      <div className="rounded-lg border-l-4 border-science bg-science/10 px-4 py-3 text-sm font-semibold leading-6">
        {question.context}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-3 text-sm font-bold leading-10">
        {question.sentenceParts.map((part, index) => (
          <span key={`${question.id}-part-${index}`} className="contents">
            <span>{part}</span>
            {index < question.correctWordIds.length && (
              <button
                type="button"
                disabled={disabled}
                aria-label={`第${index + 1}个空格${
                  wordIds[index] ? "，点击清除" : "，点击选择"
                }`}
                aria-pressed={activeBlank === index}
                onClick={() =>
                  wordIds[index]
                    ? clearBlank(index)
                    : setActiveBlank(index)
                }
                className={cn(
                  "inline-flex min-h-11 min-w-24 items-center justify-center gap-2 rounded-lg border-2 border-dashed px-3",
                  activeBlank === index
                    ? "border-action bg-action/10"
                    : "border-science/40 bg-white",
                )}
              >
                {wordIds[index]
                  ? question.words.find((word) => word.id === wordIds[index])
                      ?.label
                  : `空格 ${index + 1}`}
                {wordIds[index] && !disabled && (
                  <X aria-hidden="true" className="size-4" />
                )}
              </button>
            )}
          </span>
        ))}
      </div>

      {!disabled && (
        <>
          <p className="mt-5 text-xs font-bold tracking-[0.12em] text-muted">
            词卡
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {question.words.map((word) => {
              const used = wordIds.includes(word.id);
              return (
                <button
                  key={word.id}
                  type="button"
                  disabled={used}
                  onClick={() => fillBlank(word.id)}
                  className={cn(
                    "min-h-11 rounded-lg border-2 px-4 py-2 text-sm font-bold",
                    used
                      ? "border-ink/10 bg-ink/5 text-muted/60"
                      : "border-science/30 bg-white text-science-dark hover:border-science",
                  )}
                >
                  {word.label}
                  {used && " · 已使用"}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setActiveBlank(0);
                onChange({
                  type: "wordBank",
                  wordIds: Array<string | null>(
                    question.correctWordIds.length,
                  ).fill(null),
                });
              }}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border-2 border-ink/15 bg-white px-3 py-2 text-sm font-bold text-muted"
            >
              <RotateCcw aria-hidden="true" className="size-4" />
              重置
            </button>
          </div>
        </>
      )}
    </div>
  );
}
