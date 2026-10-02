import { Check } from "lucide-react";

import type {
  BooleanQuestion,
  ChoiceQuestion as ChoiceQuestionData,
  QuestionOption,
} from "@/data/practiceQuestions";
import { cn } from "@/lib/utils";
import type { PracticeAnswer } from "@/lib/practiceAssessment";

interface ChoiceQuestionProps {
  question: ChoiceQuestionData | BooleanQuestion;
  answer?: PracticeAnswer;
  onChange: (answer: PracticeAnswer) => void;
  disabled?: boolean;
}

export function ChoiceQuestion({
  question,
  answer,
  onChange,
  disabled = false,
}: ChoiceQuestionProps) {
  const options: QuestionOption[] =
    question.type === "boolean"
      ? [
          { id: "true", label: "正确" },
          { id: "false", label: "错误" },
        ]
      : question.options;
  const selectedId =
    question.type === "boolean"
      ? answer?.type === "boolean"
        ? String(answer.value)
        : null
      : answer?.type === "choice"
        ? answer.optionId
        : null;

  return (
    <div role="radiogroup" aria-label={question.prompt}>
      <div className="grid gap-3 tablet:grid-cols-2">
        {options.map((option) => {
          const selected = selectedId === option.id;

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() =>
                onChange(
                  question.type === "boolean"
                    ? { type: "boolean", value: option.id === "true" }
                    : { type: "choice", optionId: option.id },
                )
              }
              className={cn(
                "flex min-h-12 items-center gap-3 rounded-lg border-2 bg-white px-4 py-3 text-left text-sm font-bold transition-colors",
                selected
                  ? "border-science bg-science/10 text-science-dark"
                  : "border-ink/15 text-ink hover:border-science/50",
                disabled && "cursor-default",
              )}
            >
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full border-2",
                  selected
                    ? "border-science bg-science text-white"
                    : "border-ink/25",
                )}
              >
                {selected && <Check aria-hidden="true" className="size-4" />}
              </span>
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
