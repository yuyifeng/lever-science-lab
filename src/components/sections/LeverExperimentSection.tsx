import { FlaskConical } from "lucide-react";

import { ExperimentBoard } from "@/components/experiment/ExperimentBoard";
import { ExperimentControls } from "@/components/experiment/ExperimentControls";
import { ExperimentEvidence } from "@/components/experiment/ExperimentEvidence";
import type { LeverExperimentModel } from "@/hooks/useLeverExperiment";

interface LeverExperimentSectionProps {
  experiment: LeverExperimentModel;
}

export function LeverExperimentSection({
  experiment,
}: LeverExperimentSectionProps) {
  return (
    <section id="experiment" className="border-y border-ink/10 bg-[#edf1ea] py-12 tablet:py-16">
      <div className="container">
        <div className="max-w-3xl">
          <span className="eyebrow">
            <FlaskConical aria-hidden="true" className="size-4" />
            02 · 动手实验
          </span>
          <h2 className="section-title mt-5">先猜想，再用证据验证</h2>
          <p className="body-copy mt-4">
            直接拖动实验台上的三个位置，并在作用点旁调整力的大小。先猜想，再运行实验，让力矩证据告诉你结果。
          </p>
        </div>

        <div className="mt-8 grid items-start gap-5 desktop:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.72fr)]">
          <ExperimentBoard
            parameters={experiment.parameters}
            calculation={experiment.calculation}
            hasRun={experiment.hasRun}
            onParameterChange={experiment.updateParameter}
          />
          <div className="space-y-5">
            <ExperimentControls experiment={experiment} />
            <ExperimentEvidence experiment={experiment} />
          </div>
        </div>
      </div>
    </section>
  );
}
