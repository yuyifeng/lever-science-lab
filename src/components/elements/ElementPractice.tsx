import {
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import {
  elementPractice,
  leverElements,
  type LeverElementId,
} from "@/data/leverElements";
import { cn } from "@/lib/utils";
import { useLearningStore } from "@/store/useLearningStore";

const practiceTarget = 3;

export function ElementPractice() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<LeverElementId | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const answeredQuestions = useLearningStore(
    (state) => state.answeredElementQuestions,
  );
  const answerQuestion = useLearningStore(
    (state) => state.answerElementQuestion,
  );
  const question = elementPractice[questionIndex];
  const isCorrect = selected === question.answer;

  const refreshQuestion = () => {
    const unseenQuestions = elementPractice
      .map((_, index) => index)
      .filter(
        (index) =>
          index !== questionIndex && !answeredQuestions.includes(index),
      );
    const otherQuestions = elementPractice
      .map((_, index) => index)
      .filter((index) => index !== questionIndex);
    const candidates =
      unseenQuestions.length > 0 ? unseenQuestions : otherQuestions;
    const nextIndex =
      candidates[Math.floor(Math.random() * candidates.length)];

    setQuestionIndex(nextIndex ?? 0);
    setSelected(null);
    setSubmitted(false);
  };

  return (
    <aside className="paper-card p-5 tablet:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-action/20 text-action">
            <CircleHelp aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-muted">
              即时练习 · 已完成{" "}
              {Math.min(answeredQuestions.length, practiceTarget)}/
              {practiceTarget}
            </p>
            <h3 className="text-lg font-extrabold">找出正确要素</h3>
          </div>
        </div>
        <button
          type="button"
          onClick={refreshQuestion}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border-2 border-ink/20 bg-white px-3 py-2 text-sm font-bold text-ink transition-colors hover:border-science/50 hover:text-science-dark"
          aria-label="刷新并更换一道题"
          title="刷新题目"
        >
          <RefreshCw aria-hidden="true" className="size-4" />
          刷新题目
        </button>
      </div>

      <fieldset className="mt-6">
        <legend className="text-base font-bold leading-7 text-ink">
          {question.prompt}
        </legend>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {leverElements.map((element) => (
            <label
              key={element.id}
              className={cn(
                "flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border-2 px-3 py-2 text-sm font-bold",
                selected === element.id
                  ? "border-science bg-science/10 text-science-dark"
                  : "border-ink/10 bg-white/60 text-muted hover:border-science/40",
              )}
            >
              <input
                type="radio"
                name={`element-question-${questionIndex}`}
                value={element.id}
                checked={selected === element.id}
                disabled={submitted}
                onChange={() => setSelected(element.id)}
                className="size-4 accent-science"
              />
              {element.name}
            </label>
          ))}
        </div>
      </fieldset>

      {!submitted ? (
        <button
          type="button"
          disabled={!selected}
          onClick={() => {
            setSubmitted(true);
            answerQuestion(questionIndex, practiceTarget);
          }}
          className="mt-5 min-h-11 w-full rounded-lg bg-ink px-4 py-2 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          提交答案
        </button>
      ) : (
        <div
          className={cn(
            "mt-5 rounded-lg border-2 p-4",
            isCorrect
              ? "border-resistance/30 bg-resistance/10"
              : "border-effort/30 bg-effort/10",
          )}
          role="status"
        >
          <div className="flex items-center gap-2 font-extrabold">
            {isCorrect ? (
              <CheckCircle2 aria-hidden="true" className="size-5 text-resistance" />
            ) : (
              <XCircle aria-hidden="true" className="size-5 text-effort" />
            )}
            {isCorrect
              ? "回答正确"
              : `正确答案：${leverElements.find((item) => item.id === question.answer)?.name}`}
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">
            {question.explanation}
          </p>
          <button
            type="button"
            onClick={refreshQuestion}
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-ink"
          >
            <ArrowRight aria-hidden="true" className="size-4" />
            换一道题
          </button>
        </div>
      )}
    </aside>
  );
}
