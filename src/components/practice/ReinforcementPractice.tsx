import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Send,
  XCircle,
} from "lucide-react";

import {
  knowledgePoints,
  reinforcementQuestions,
} from "@/data/practiceQuestions";
import { cn } from "@/lib/utils";
import {
  getCorrectAnswerText,
  getQuestionTypeLabel,
  isAnswerComplete,
  scoreQuestion,
} from "@/lib/practiceAssessment";
import { usePracticeStore } from "@/store/usePracticeStore";

import { PracticeQuestionRenderer } from "./PracticeQuestionRenderer";

export function ReinforcementPractice() {
  const currentQuestionIndex = usePracticeStore(
    (state) => state.currentQuestionIndex,
  );
  const questionIds = usePracticeStore(
    (state) => state.reinforcementQuestionIds,
  );
  const answers = usePracticeStore((state) => state.reinforcementAnswers);
  const submittedIds = usePracticeStore(
    (state) => state.submittedReinforcementIds,
  );
  const setCurrentQuestionIndex = usePracticeStore(
    (state) => state.setCurrentQuestionIndex,
  );
  const saveAnswer = usePracticeStore(
    (state) => state.saveReinforcementAnswer,
  );
  const submitAnswer = usePracticeStore(
    (state) => state.submitReinforcementQuestion,
  );
  const questions = questionIds
    .map((id) => reinforcementQuestions.find((item) => item.id === id))
    .filter((question): question is (typeof reinforcementQuestions)[number] =>
      Boolean(question),
    );
  const safeIndex = Math.min(currentQuestionIndex, questions.length - 1);
  const question = questions[safeIndex];

  if (!question) {
    return (
      <p role="alert" className="text-sm font-bold text-effort">
        未能读取巩固题，请返回并重新开始练习。
      </p>
    );
  }

  const answer = answers[question.id];
  const submitted = submittedIds.includes(question.id);
  const result = submitted ? scoreQuestion(question, answer) : null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-science-dark">
            针对性巩固 · {safeIndex + 1}/{questions.length}
          </p>
          <p className="mt-1 text-sm font-bold text-muted">
            {getQuestionTypeLabel(question.type)} ·{" "}
            {knowledgePoints[question.knowledgePoint].name}
          </p>
        </div>
        <div className="flex gap-1" aria-label="巩固题进度">
          {questions.map((item, index) => (
            <span
              key={item.id}
              className={cn(
                "h-2 w-10 rounded-full",
                submittedIds.includes(item.id)
                  ? "bg-resistance"
                  : index === safeIndex
                    ? "bg-action"
                    : "bg-ink/10",
              )}
            />
          ))}
        </div>
      </div>

      <h3 className="mt-6 text-xl font-extrabold leading-8">
        {question.prompt}
      </h3>
      <div className="mt-5">
        <PracticeQuestionRenderer
          question={question}
          answer={answer}
          disabled={submitted}
          onChange={(nextAnswer) => saveAnswer(question.id, nextAnswer)}
        />
      </div>

      {result && (
        <div
          role="status"
          className={cn(
            "mt-6 rounded-lg border-2 p-4",
            result.status === "correct"
              ? "border-resistance/30 bg-resistance/10"
              : "border-effort/30 bg-effort/10",
          )}
        >
          <p className="flex items-center gap-2 font-extrabold">
            {result.status === "correct" ? (
              <CheckCircle2
                aria-hidden="true"
                className="size-5 text-resistance"
              />
            ) : (
              <XCircle aria-hidden="true" className="size-5 text-effort" />
            )}
            {result.status === "correct"
              ? "回答正确"
              : result.status === "partial"
                ? "部分正确"
                : "回答错误"}
          </p>
          <p className="mt-2 text-sm font-bold">
            正确答案：{getCorrectAnswerText(question)}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            {question.explanation}
          </p>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-3 border-t-2 border-ink/10 pt-5">
        <button
          type="button"
          disabled={safeIndex === 0}
          onClick={() => setCurrentQuestionIndex(safeIndex - 1)}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border-2 border-ink/15 bg-white px-4 py-2 text-sm font-bold disabled:opacity-35"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          上一题
        </button>

        {!submitted ? (
          <button
            type="button"
            disabled={!isAnswerComplete(question, answer)}
            onClick={() => submitAnswer(question.id)}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-ink px-5 py-2 text-sm font-extrabold text-white disabled:opacity-35"
          >
            <Send aria-hidden="true" className="size-4" />
            提交本题
          </button>
        ) : safeIndex < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentQuestionIndex(safeIndex + 1)}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-action px-5 py-2 text-sm font-extrabold text-ink"
          >
            下一题
            <ArrowRight aria-hidden="true" className="size-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
