import { Lightbulb, Play, RotateCcw } from "lucide-react";

import type {
  ExperimentPrediction,
  LeverExperimentModel,
} from "@/hooks/useLeverExperiment";
import { cn } from "@/lib/utils";

interface ExperimentControlsProps {
  experiment: LeverExperimentModel;
}

const predictions: { id: ExperimentPrediction; label: string }[] = [
  { id: "left", label: "左边下沉" },
  { id: "balanced", label: "保持平衡" },
  { id: "right", label: "右边下沉" },
];

export function ExperimentControls({
  experiment,
}: ExperimentControlsProps) {
  const { prediction, hasRun } = experiment;

  return (
    <aside className="paper-card p-5 tablet:p-6">
      <div className="flex items-center gap-3">
        <Lightbulb aria-hidden="true" className="size-5 text-action" />
        <div>
          <p className="text-xs font-bold tracking-[0.15em] text-muted">
            先观察实验台
          </p>
          <h3 className="text-lg font-extrabold">猜想与验证</h3>
        </div>
      </div>

      <fieldset className="mt-6 border-l-2 border-action/30 pl-4">
        <legend className="flex items-center gap-2 text-xs font-extrabold tracking-[0.15em] text-action">
          2 · 作出猜想
        </legend>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {predictions.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={hasRun}
              aria-pressed={prediction === item.id}
              onClick={() => experiment.setPrediction(item.id)}
              className={cn(
                "min-h-12 rounded-lg border-2 px-2 py-2 text-xs font-extrabold disabled:cursor-not-allowed",
                prediction === item.id
                  ? "border-action bg-action text-white"
                  : "border-ink/10 bg-white text-muted hover:border-action/50",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 border-l-2 border-resistance/30 pl-4">
        <p className="text-xs font-extrabold tracking-[0.15em] text-resistance">
          3 · 运行实验
        </p>
        <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
          <button
            type="button"
            disabled={!prediction || hasRun}
            onClick={experiment.run}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-resistance px-4 py-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Play aria-hidden="true" className="size-4 fill-current" />
            {hasRun ? "实验已运行" : "运行实验"}
          </button>
          <button
            type="button"
            onClick={experiment.reset}
            className="grid min-h-12 min-w-12 place-items-center rounded-lg border-2 border-ink/10 bg-white text-muted hover:text-ink"
            aria-label="重置实验"
            title="重置实验"
          >
            <RotateCcw aria-hidden="true" className="size-5" />
          </button>
        </div>
        {!prediction && (
          <p className="mt-2 text-xs font-semibold text-muted">
            先选择一个猜想，才能运行实验。
          </p>
        )}
      </div>
    </aside>
  );
}
