import { CheckCircle2, ClipboardList, Eye, XCircle } from "lucide-react";

import type { LeverExperimentModel } from "@/hooks/useLeverExperiment";

interface ExperimentEvidenceProps {
  experiment: LeverExperimentModel;
}

const outcomeLabels = {
  left: "左边下沉",
  balanced: "保持平衡",
  right: "右边下沉",
};

export function ExperimentEvidence({
  experiment,
}: ExperimentEvidenceProps) {
  const { hasRun, prediction, calculation, parameters } = experiment;

  if (!hasRun || !prediction) {
    return (
      <div className="paper-card grid min-h-52 place-items-center border-dashed p-6 text-center">
        <div>
          <Eye aria-hidden="true" className="mx-auto size-9 text-science" />
          <p className="mt-3 text-sm font-extrabold text-ink">4 · 查看证据</p>
          <p className="mt-2 text-xs leading-6 text-muted">
            运行实验后，这里才会显示力臂、力矩和结论。
          </p>
        </div>
      </div>
    );
  }

  const isCorrect = prediction === calculation.outcome;
  const conclusion =
    calculation.outcome === "balanced"
      ? "两侧力矩相等，所以杠杆保持平衡。"
      : calculation.outcome === "left"
        ? `用力侧力矩更大，大 ${calculation.difference} N·格，所以左边下沉。`
        : `阻力侧力矩更大，大 ${calculation.difference} N·格，所以右边下沉。`;

  return (
    <div className="space-y-3" aria-live="polite">
      <div className="flex items-center gap-3 border-b-2 border-ink/20 pb-3">
        <ClipboardList aria-hidden="true" className="size-5 text-science" />
        <h3 className="text-lg font-extrabold">4 · 查看证据</h3>
      </div>

      <div className="grid gap-3 tablet:grid-cols-2">
        <div className="rounded-lg border-2 border-effort/20 bg-effort/5 p-4">
          <p className="text-xs font-extrabold text-effort">用力侧</p>
          <p className="mt-2 text-sm font-bold">
            用力臂：{parameters.fulcrum} - {parameters.effortPoint} = {calculation.effortArm} 格
          </p>
          <p className="mt-1 text-sm font-bold">
            力矩：{parameters.effortForce} N × {calculation.effortArm} 格 = {calculation.effortMoment} N·格
          </p>
        </div>
        <div className="rounded-lg border-2 border-resistance/20 bg-resistance/5 p-4">
          <p className="text-xs font-extrabold text-resistance">阻力侧</p>
          <p className="mt-2 text-sm font-bold">
            阻力臂：{parameters.resistancePoint} - {parameters.fulcrum} = {calculation.resistanceArm} 格
          </p>
          <p className="mt-1 text-sm font-bold">
            力矩：{parameters.resistanceForce} N × {calculation.resistanceArm} 格 = {calculation.resistanceMoment} N·格
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-ink p-4 text-white">
        <p className="text-xs font-bold tracking-[0.14em] text-white/60">
          实验证据
        </p>
        <p className="mt-2 text-sm font-bold leading-6">{conclusion}</p>
      </div>

      <div className="flex items-start gap-3 border-l-4 border-ink/20 bg-white/60 p-4">
        {isCorrect ? (
          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-resistance" />
        ) : (
          <XCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-effort" />
        )}
        <p className="text-sm font-bold leading-6">
          {isCorrect
            ? `猜想正确：${outcomeLabels[prediction]}。`
            : `这次猜想是“${outcomeLabels[prediction]}”，实际是“${outcomeLabels[calculation.outcome]}”。`}
        </p>
      </div>
    </div>
  );
}
