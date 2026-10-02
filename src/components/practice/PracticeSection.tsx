import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  RotateCcw,
  Send,
} from "lucide-react";
import { useEffect } from "react";

import { PracticeHistory } from "@/components/practice/PracticeHistory";
import { PracticeQuestionRenderer } from "@/components/practice/PracticeQuestionRenderer";
import { PracticeReport } from "@/components/practice/PracticeReport";
import { ReinforcementPractice } from "@/components/practice/ReinforcementPractice";
import {
  knowledgePoints,
  reinforcementQuestions,
} from "@/data/practiceQuestions";
import {
  diagnosticQuestionBank,
  getDiagnosticQuestions,
} from "@/data/practiceQuestionBank";
import { cn } from "@/lib/utils";
import {
  getAnswerText,
  getCorrectAnswerText,
  getQuestionTypeLabel,
  isAnswerComplete,
} from "@/lib/practiceAssessment";
import { useLearningStore } from "@/store/useLearningStore";
import { usePracticeStore } from "@/store/usePracticeStore";

export function PracticeSection() {
  const phase = usePracticeStore((state) => state.phase);
  const currentQuestionIndex = usePracticeStore(
    (state) => state.currentQuestionIndex,
  );
  const diagnosticQuestionIds = usePracticeStore(
    (state) => state.diagnosticQuestionIds,
  );
  const answers = usePracticeStore((state) => state.diagnosticAnswers);
  const report = usePracticeStore((state) => state.diagnosticReport);
  const reinforcementQuestionIds = usePracticeStore(
    (state) => state.reinforcementQuestionIds,
  );
  const reinforcementAnswers = usePracticeStore(
    (state) => state.reinforcementAnswers,
  );
  const reinforcementResult = usePracticeStore(
    (state) => state.reinforcementResult,
  );
  const storageAvailable = usePracticeStore(
    (state) => state.storageAvailable,
  );
  const startDiagnostic = usePracticeStore((state) => state.startDiagnostic);
  const setCurrentQuestionIndex = usePracticeStore(
    (state) => state.setCurrentQuestionIndex,
  );
  const saveAnswer = usePracticeStore(
    (state) => state.saveDiagnosticAnswer,
  );
  const submitDiagnostic = usePracticeStore(
    (state) => state.submitDiagnostic,
  );
  const startReinforcement = usePracticeStore(
    (state) => state.startReinforcement,
  );
  const restartPractice = usePracticeStore(
    (state) => state.restartPractice,
  );
  const completeActivity = useLearningStore(
    (state) => state.completeActivity,
  );

  useEffect(() => {
    if (phase === "complete") {
      completeActivity("comprehensivePractice");
    }
  }, [completeActivity, phase]);

  const diagnosticQuestions = getDiagnosticQuestions(diagnosticQuestionIds);
  const safeIndex = Math.min(
    currentQuestionIndex,
    Math.max(0, diagnosticQuestions.length - 1),
  );
  const question =
    diagnosticQuestions[safeIndex] ?? diagnosticQuestionBank[0];
  const answeredCount = diagnosticQuestions.filter((item) =>
    isAnswerComplete(item, answers[item.id]),
  ).length;
  const unansweredNumbers = diagnosticQuestions
    .map((item, index) =>
      isAnswerComplete(item, answers[item.id]) ? null : index + 1,
    )
    .filter((number): number is number => number !== null);

  return (
    <section
      id="practice"
      aria-labelledby="practice-title"
      className="border-t border-ink/10 bg-[#eef3f1] py-12 tablet:py-16"
    >
      <div className="container">
        <div className="max-w-3xl">
          <span className="eyebrow">
            <ClipboardCheck aria-hidden="true" className="size-4" />
            04 · 综合练习
          </span>
          <h2 id="practice-title" className="section-title mt-5">
            完成诊断，巩固薄弱知识点
          </h2>
          <p className="body-copy mt-4">
            每次从 100 道题库中随机抽取选择题和判断题，提交后查看逐题分析，再完成系统为你选择的巩固题。
          </p>
        </div>

        {!storageAvailable && (
          <p
            role="status"
            className="mt-6 rounded-lg border-2 border-action/30 bg-action/10 p-4 text-sm font-bold"
          >
            浏览器无法保存练习记录，本次练习仍可继续。
          </p>
        )}

        <div className="paper-card mt-8 p-5 tablet:p-7">
          {phase === "intro" && (
            <PracticeIntro onStart={startDiagnostic} />
          )}

          {phase === "diagnostic" && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold tracking-[0.14em] text-science-dark">
                    诊断练习 · 第 {safeIndex + 1}/{diagnosticQuestions.length} 题
                  </p>
                  <p className="mt-1 text-sm font-bold text-muted">
                    {getQuestionTypeLabel(question.type)} ·{" "}
                    {knowledgePoints[question.knowledgePoint].name}
                  </p>
                </div>
                <span className="text-sm font-extrabold">
                  已完成 {answeredCount}/{diagnosticQuestions.length}
                </span>
              </div>

              <div
                className="mt-4 grid grid-cols-10 gap-1"
                aria-label="诊断答题进度"
              >
                {diagnosticQuestions.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentQuestionIndex(index)}
                    aria-label={`前往第${index + 1}题${
                      isAnswerComplete(item, answers[item.id])
                        ? "，已作答"
                        : "，未作答"
                    }`}
                    className={cn(
                      "h-3 rounded-full",
                      index === safeIndex
                        ? "bg-action"
                        : isAnswerComplete(item, answers[item.id])
                          ? "bg-resistance"
                          : "bg-ink/10",
                    )}
                  />
                ))}
              </div>

              <h3 className="mt-7 text-xl font-extrabold leading-8">
                {question.prompt}
              </h3>
              <div className="mt-5">
                <PracticeQuestionRenderer
                  question={question}
                  answer={answers[question.id]}
                  onChange={(answer) => saveAnswer(question.id, answer)}
                />
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink/10 pt-5">
                <button
                  type="button"
                  disabled={safeIndex === 0}
                  onClick={() => setCurrentQuestionIndex(safeIndex - 1)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border-2 border-ink/15 bg-white px-4 py-2 text-sm font-bold disabled:opacity-35"
                >
                  <ArrowLeft aria-hidden="true" className="size-4" />
                  上一题
                </button>

                {safeIndex < diagnosticQuestions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex(safeIndex + 1)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-ink px-5 py-2 text-sm font-extrabold text-white"
                  >
                    下一题
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={unansweredNumbers.length > 0}
                    onClick={submitDiagnostic}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-action px-5 py-2 text-sm font-extrabold text-ink disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send aria-hidden="true" className="size-4" />
                    提交诊断
                  </button>
                )}
              </div>

              {safeIndex === diagnosticQuestions.length - 1 &&
                unansweredNumbers.length > 0 && (
                  <p role="status" className="mt-3 text-right text-xs font-bold text-effort">
                    还需完成第 {unansweredNumbers.join("、")} 题
                  </p>
                )}
            </div>
          )}

          {phase === "report" && report && (
            <PracticeReport
              assessment={report}
              answers={answers}
              questions={diagnosticQuestions}
              onStartReinforcement={startReinforcement}
            />
          )}

          {phase === "reinforcement" && <ReinforcementPractice />}

          {phase === "complete" && report && reinforcementResult && (
            <PracticeComplete
              diagnosticScore={report.score}
              reinforcementScore={reinforcementResult.assessment.score}
              questionIds={reinforcementQuestionIds}
              answers={reinforcementAnswers}
              onRestart={restartPractice}
            />
          )}

          {(phase === "intro" ||
            phase === "report" ||
            phase === "complete") && <PracticeHistory />}
        </div>
      </div>
    </section>
  );
}

function PracticeIntro({ onStart }: { onStart: () => void }) {
  return (
    <div>
      <div className="grid gap-6 tablet:grid-cols-[1fr_auto] tablet:items-center">
        <div>
          <h3 className="text-2xl font-extrabold">准备好了吗？</h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            系统将从 100 道题库中随机抽取 10 题，包含 6 道选择题和 4 道判断题，同一轮不会重复。诊断过程中可以返回修改，全部提交后统一查看答案。
          </p>
          <ul className="mt-5 grid gap-2 text-sm font-bold tablet:grid-cols-2">
            <li>选择题 6 道</li>
            <li>判断题 4 道</li>
          </ul>
        </div>
        <button
          type="button"
          onClick={onStart}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-action px-6 py-3 text-sm font-extrabold text-ink"
        >
          <ClipboardCheck aria-hidden="true" className="size-5" />
          开始诊断
        </button>
      </div>
    </div>
  );
}

interface PracticeCompleteProps {
  diagnosticScore: number;
  reinforcementScore: number;
  questionIds: string[];
  answers: ReturnType<typeof usePracticeStore.getState>["reinforcementAnswers"];
  onRestart: () => void;
}

function PracticeComplete({
  diagnosticScore,
  reinforcementScore,
  questionIds,
  answers,
  onRestart,
}: PracticeCompleteProps) {
  const questions = questionIds
    .map((id) => reinforcementQuestions.find((item) => item.id === id))
    .filter((question): question is (typeof reinforcementQuestions)[number] =>
      Boolean(question),
    );

  return (
    <div>
      <div className="flex flex-col gap-5 border-b-2 border-ink/10 pb-7 tablet:flex-row tablet:items-center tablet:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 text-sm font-extrabold text-resistance">
            <CheckCircle2 aria-hidden="true" className="size-5" />
            本次练习已完成
          </span>
          <h3 className="mt-2 text-2xl font-extrabold">巩固结果对比</h3>
        </div>
        <div className="flex gap-3">
          <ScoreBlock label="诊断" score={diagnosticScore} />
          <ScoreBlock label="巩固" score={reinforcementScore} emphasized />
        </div>
      </div>

      <section className="py-7" aria-labelledby="reinforcement-review-title">
        <h3 id="reinforcement-review-title" className="text-xl font-extrabold">
          巩固题解析
        </h3>
        <div className="mt-4 divide-y-2 divide-ink/10 border-y-2 border-ink/10">
          {questions.map((question, index) => (
            <div key={question.id} className="py-4 text-sm leading-7">
              <p className="font-extrabold">
                第 {index + 1} 题 · {question.prompt}
              </p>
              <p className="mt-2">
                <strong>你的答案：</strong>
                {getAnswerText(question, answers[question.id])}
              </p>
              <p>
                <strong>正确答案：</strong>
                {getCorrectAnswerText(question)}
              </p>
              <p className="mt-1 text-muted">{question.explanation}</p>
            </div>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={onRestart}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-extrabold text-white"
      >
        <RotateCcw aria-hidden="true" className="size-5" />
        再练一次
      </button>
    </div>
  );
}

function ScoreBlock({
  label,
  score,
  emphasized = false,
}: {
  label: string;
  score: number;
  emphasized?: boolean;
}) {
  return (
    <div
      className={cn(
        "min-w-24 rounded-lg border-2 px-4 py-3 text-center",
        emphasized
          ? "border-resistance/30 bg-resistance/10"
          : "border-ink/10 bg-white",
      )}
    >
      <span className="block text-xs font-bold text-muted">{label}</span>
      <strong className="mt-1 block text-2xl font-extrabold">{score} 分</strong>
    </div>
  );
}
