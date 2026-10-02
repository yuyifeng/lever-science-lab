import { describe, expect, it } from "vitest";

import {
  calculateLever,
  DEFAULT_LEVER_PARAMETERS,
  LEVER_MAX_FORCE,
  LEVER_MAX_POSITION,
  LEVER_MIN_FORCE,
  LEVER_MIN_POSITION,
  normalizeLeverParameters,
  type LeverParameters,
} from "./leverPhysics";

describe("calculateLever", () => {
  it("calculates both arms and moments for the default balanced setup", () => {
    expect(calculateLever(DEFAULT_LEVER_PARAMETERS)).toEqual({
      effortArm: 3,
      resistanceArm: 3,
      effortMoment: 9,
      resistanceMoment: 9,
      difference: 0,
      outcome: "balanced",
    });
  });

  it("reports left when the effort moment is greater", () => {
    expect(
      calculateLever({
        fulcrum: 5,
        effortPoint: 0,
        resistancePoint: 9,
        effortForce: 2,
        resistanceForce: 2,
      }),
    ).toMatchObject({
      effortMoment: 10,
      resistanceMoment: 8,
      difference: 2,
      outcome: "left",
    });
  });

  it("reports right when the resistance moment is greater", () => {
    expect(
      calculateLever({
        fulcrum: 5,
        effortPoint: 2,
        resistancePoint: 8,
        effortForce: 2,
        resistanceForce: 3,
      }),
    ).toMatchObject({
      effortMoment: 6,
      resistanceMoment: 9,
      difference: 3,
      outcome: "right",
    });
  });

  it("handles the smallest and largest legal arms and forces", () => {
    expect(
      calculateLever({
        fulcrum: LEVER_MIN_POSITION + 1,
        effortPoint: LEVER_MIN_POSITION,
        resistancePoint: LEVER_MAX_POSITION,
        effortForce: LEVER_MIN_FORCE,
        resistanceForce: LEVER_MAX_FORCE,
      }),
    ).toEqual({
      effortArm: 1,
      resistanceArm: 9,
      effortMoment: 1,
      resistanceMoment: 90,
      difference: 89,
      outcome: "right",
    });
  });
});

describe("normalizeLeverParameters", () => {
  it("clamps values below and above their legal ranges", () => {
    expect(
      normalizeLeverParameters({
        fulcrum: -4,
        effortPoint: -3,
        resistancePoint: 20,
        effortForce: 0,
        resistanceForce: 11,
      }),
    ).toEqual({
      fulcrum: 1,
      effortPoint: 0,
      resistancePoint: 10,
      effortForce: 1,
      resistanceForce: 10,
    });
  });

  it("keeps the fulcrum inside the beam at both boundaries", () => {
    expect(
      normalizeLeverParameters({
        fulcrum: LEVER_MIN_POSITION,
        effortPoint: 0,
        resistancePoint: 10,
        effortForce: 1,
        resistanceForce: 1,
      }).fulcrum,
    ).toBe(1);

    expect(
      normalizeLeverParameters({
        fulcrum: LEVER_MAX_POSITION,
        effortPoint: 0,
        resistancePoint: 10,
        effortForce: 10,
        resistanceForce: 10,
      }).fulcrum,
    ).toBe(9);
  });

  it("moves points away from the fulcrum when they overlap it", () => {
    expect(
      normalizeLeverParameters({
        fulcrum: 5,
        effortPoint: 5,
        resistancePoint: 5,
        effortForce: 3,
        resistanceForce: 3,
      }),
    ).toMatchObject({
      effortPoint: 4,
      fulcrum: 5,
      resistancePoint: 6,
    });
  });

  it("keeps effort left and resistance right when positions cross", () => {
    expect(
      normalizeLeverParameters({
        fulcrum: 5,
        effortPoint: 9,
        resistancePoint: 1,
        effortForce: 3,
        resistanceForce: 3,
      }),
    ).toMatchObject({
      effortPoint: 4,
      fulcrum: 5,
      resistancePoint: 6,
    });
  });

  it("rounds fractional input before enforcing the constraints", () => {
    expect(
      normalizeLeverParameters({
        fulcrum: 4.6,
        effortPoint: 3.6,
        resistancePoint: 5.4,
        effortForce: 1.4,
        resistanceForce: 9.6,
      }),
    ).toEqual({
      fulcrum: 5,
      effortPoint: 4,
      resistancePoint: 6,
      effortForce: 1,
      resistanceForce: 10,
    });
  });

  it("does not mutate the supplied parameters", () => {
    const parameters: LeverParameters = {
      fulcrum: 5,
      effortPoint: 5,
      resistancePoint: 5,
      effortForce: 0,
      resistanceForce: 11,
    };
    const original = { ...parameters };

    normalizeLeverParameters(parameters);

    expect(parameters).toEqual(original);
  });
});
