import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Target,
} from "lucide-react";

import {
  knowledgePoints,
  type PracticeQuestion,
} from "@/data/practiceQuestions";
import { cn } from "@/lib/utils";
import {
  getAnswerText,
  getCorrectAnswerText,
  type MasteryLevel,
  type PracticeAnswers,
  type PracticeAssessment,
} from "@/lib/practiceAssessment";

interface PracticeReportProps {
  assessment: PracticeAssessment;
  answers: PracticeAnswers;
  questions: PracticeQuestion[];
  onStartReinforcement?: () => void;
}

const masteryLabels: Record<MasteryLevel, string> = {
  mastered: "已掌握",
  reinforce: "需巩固",
  weak: "薄弱",
};

export function PracticeReport({
  assessment,
  answers,
  questions,
  onStartReinforcement,
}: PracticeReportProps) {
  const needsWork = assessment.knowledgeResults.filter(
    (result) => result.level !== "mastered",
  );

  return (
    <div>
      <div className="grid gap-5 border-b-2 border-ink/10 pb-7 tablet:grid-cols-[220px_1fr]">
        <div className="flex min-h-44 flex-col items-center justify-center rounded-lg bg-ink p-5 text-center text-white">
          <span className="text-sm font-bold text-white/70">诊断总分</span>
          <strong className="mt-1 font-display text-6xl">{assessment.score}</strong>
          <span className="mt-1 text-sm font-bold">
            {assessment.correctCount}/{assessment.totalPoints} 题完全正确
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            {needsWork.length > 0 ? (
              <Target aria-hidden="true" className="size-6 text-action" />
            ) : (
              <CheckCircle2
                aria-hidden="true"
                className="size-6 text-resistance"
              />
            )}
            <h3 className="text-xl font-extrabold">
              {needsWork.length > 0
                ? "已找到需要重点巩固的内容"
                : "四个知识点都已掌握"}
            </h3>
          </div>
          <p className="mt-3 text-sm leading-7 text-muted">
            {needsWork.length > 0
              ? `优先练习：${needsWork
                  .sort((a, b) => a.percentage - b.percentage)
                  .map((item) => item.name)
                  .join("、")}。系统已准备 3 道针对性题目。`
              : "系统会从相对得分最低的知识点中选择进阶题，继续挑战。"}
          </p>
          {onStartReinforcement && (
            <button
              type="button"
              onClick={onStartReinforcement}
              className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-action px-5 py-3 text-sm font-extrabold text-ink"
            >
              <Target aria-hidden="true" className="size-5" />
              {needsWork.length > 0 ? "开始针对性巩固" : "继续进阶挑战"}
            </button>
          )}
        </div>
      </div>

      <section className="border-b-2 border-ink/10 py-7" aria-labelledby="mastery-title">
        <h3 id="mastery-title" className="text-xl font-extrabold">
          知识点掌握情况
        </h3>
        <div className="mt-5 grid gap-5 tablet:grid-cols-2">
          {assessment.knowledgeResults.map((result) => (
            <div key={result.id}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-extrabold">{result.name}</span>
                <span
                  className={cn(
                    "font-bold",
                    result.level === "mastered" && "text-resistance",
                    result.level === "reinforce" && "text-action",
                    result.level === "weak" && "text-effort",
                  )}
                >
                  {result.percentage}% · {masteryLabels[result.level]}
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={`${result.name}掌握度 ${result.percentage}%`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={result.percentage}
                className="mt-2 h-3 overflow-hidden rounded-full bg-ink/10"
              >
                <div
                  className={cn(
                    "h-full rounded-full",
                    result.level === "mastered" && "bg-resistance",
                    result.level === "reinforce" && "bg-action",
                    result.level === "weak" && "bg-effort",
                  )}
                  style={{ width: `${result.percentage}%` }}
                />
              </div>
              <p className="mt-2 text-xs leading-5 text-muted">
                {result.advice}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="pt-7" aria-labelledby="answers-title">
        <h3 id="answers-title" className="text-xl font-extrabold">
          逐题分析
        </h3>
        <div className="mt-4 divide-y-2 divide-ink/10 border-y-2 border-ink/10">
          {questions.map((question, index) => {
            const result = assessment.questionResults[index];

            return (
              <details key={question.id} className="group py-1">
                <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 py-3 text-sm font-bold">
                  {result.status === "correct" ? (
                    <CheckCircle2
                      aria-hidden="true"
                      className="size-5 shrink-0 text-resistance"
                    />
                  ) : (
                    <AlertTriangle
                      aria-hidden="true"
                      className="size-5 shrink-0 text-effort"
                    />
                  )}
                  <span className="min-w-0 flex-1">
                    第 {index + 1} 题 · {question.prompt}
                  </span>
                  <span className="shrink-0 text-xs text-muted">
                    {result.status === "correct"
                      ? "正确"
                      : result.status === "partial"
                        ? "部分正确"
                        : "错误"}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className="size-4 shrink-0 transition-transform group-open:rotate-180"
                  />
                </summary>
                <div className="pb-5 pl-8 text-sm leading-7">
                  <p>
                    <strong>你的答案：</strong>
                    {getAnswerText(question, answers[question.id])}
                  </p>
                  <p>
                    <strong>正确答案：</strong>
                    {getCorrectAnswerText(question)}
                  </p>
                  <p className="mt-2 text-muted">{question.explanation}</p>
                  <p className="mt-2 text-xs font-bold text-science-dark">
                    知识点：{knowledgePoints[question.knowledgePoint].name}
                  </p>
                </div>
              </details>
            );
          })}
        </div>
      </section>
    </div>
  );
}
