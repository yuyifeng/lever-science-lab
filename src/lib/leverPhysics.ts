export const LEVER_MIN_POSITION = 0;
export const LEVER_MAX_POSITION = 10;
export const LEVER_MIN_FORCE = 1;
export const LEVER_MAX_FORCE = 10;

export interface LeverParameters {
  fulcrum: number;
  effortPoint: number;
  resistancePoint: number;
  effortForce: number;
  resistanceForce: number;
}

export type LeverOutcome = "left" | "balanced" | "right";

export interface LeverCalculation {
  effortArm: number;
  resistanceArm: number;
  effortMoment: number;
  resistanceMoment: number;
  difference: number;
  outcome: LeverOutcome;
}

export const DEFAULT_LEVER_PARAMETERS: LeverParameters = {
  fulcrum: 5,
  effortPoint: 2,
  resistancePoint: 8,
  effortForce: 3,
  resistanceForce: 3,
};

export function calculateLever(
  parameters: LeverParameters,
): LeverCalculation {
  const effortArm = parameters.fulcrum - parameters.effortPoint;
  const resistanceArm = parameters.resistancePoint - parameters.fulcrum;
  const effortMoment = parameters.effortForce * effortArm;
  const resistanceMoment = parameters.resistanceForce * resistanceArm;
  const difference = Math.abs(effortMoment - resistanceMoment);

  let outcome: LeverOutcome = "balanced";
  if (effortMoment > resistanceMoment) outcome = "left";
  if (effortMoment < resistanceMoment) outcome = "right";

  return {
    effortArm,
    resistanceArm,
    effortMoment,
    resistanceMoment,
    difference,
    outcome,
  };
}

export function normalizeLeverParameters(
  parameters: LeverParameters,
): LeverParameters {
  const fulcrum = clamp(
    Math.round(parameters.fulcrum),
    LEVER_MIN_POSITION + 1,
    LEVER_MAX_POSITION - 1,
  );

  return {
    fulcrum,
    effortPoint: clamp(
      Math.round(parameters.effortPoint),
      LEVER_MIN_POSITION,
      fulcrum - 1,
    ),
    resistancePoint: clamp(
      Math.round(parameters.resistancePoint),
      fulcrum + 1,
      LEVER_MAX_POSITION,
    ),
    effortForce: clamp(
      Math.round(parameters.effortForce),
      LEVER_MIN_FORCE,
      LEVER_MAX_FORCE,
    ),
    resistanceForce: clamp(
      Math.round(parameters.resistanceForce),
      LEVER_MIN_FORCE,
      LEVER_MAX_FORCE,
    ),
  };
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}
