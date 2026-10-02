import { useMemo, useRef, useState } from "react";

import {
  calculateLever,
  DEFAULT_LEVER_PARAMETERS,
  normalizeLeverParameters,
  type LeverOutcome,
  type LeverParameters,
} from "@/lib/leverPhysics";
import { useLearningStore } from "@/store/useLearningStore";

export type ExperimentPrediction = LeverOutcome;

export function useLeverExperiment() {
  const completeActivity = useLearningStore(
    (state) => state.completeActivity,
  );
  const [parameters, setParameters] = useState(DEFAULT_LEVER_PARAMETERS);
  const [prediction, setPrediction] = useState<ExperimentPrediction | null>(
    null,
  );
  const [hasRun, setHasRun] = useState(false);
  const parametersRef = useRef(DEFAULT_LEVER_PARAMETERS);
  const calculation = useMemo(
    () => calculateLever(parameters),
    [parameters],
  );

  const applyParameters = (next: LeverParameters) => {
    const normalized = normalizeLeverParameters(next);
    const changed = Object.keys(normalized).some(
      (key) =>
        normalized[key as keyof LeverParameters] !==
        parametersRef.current[key as keyof LeverParameters],
    );
    if (!changed) return;

    parametersRef.current = normalized;
    setParameters(normalized);
    setPrediction(null);
    setHasRun(false);
  };

  const updateParameter = (
    key: keyof LeverParameters,
    value: number,
  ) => {
    applyParameters({ ...parametersRef.current, [key]: value });
  };

  const loadPreset = (preset: LeverParameters) => {
    applyParameters(preset);
  };

  const reset = () => {
    parametersRef.current = DEFAULT_LEVER_PARAMETERS;
    setParameters(DEFAULT_LEVER_PARAMETERS);
    setPrediction(null);
    setHasRun(false);
  };

  const run = () => {
    if (!prediction) return;
    setHasRun(true);
    completeActivity("experiment");
  };

  return {
    parameters,
    calculation,
    prediction,
    hasRun,
    setPrediction,
    updateParameter,
    loadPreset,
    run,
    reset,
  };
}

export type LeverExperimentModel = ReturnType<typeof useLeverExperiment>;
