import { Check, GripHorizontal, Ruler } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import {
  classifyLeverType,
  leverTypes,
  type LeverTypeId,
} from "@/data/leverTypes";
import { cn } from "@/lib/utils";
import { useLearningStore } from "@/store/useLearningStore";
import { LeverTypeExamples } from "./LeverTypeExamples";

type PointKey = "fulcrum" | "effortPoint" | "resistancePoint";

interface PointPositions {
  fulcrum: number;
  effortPoint: number;
  resistancePoint: number;
}

const xForPosition = (position: number) => 50 + position * 70;

export function LeverTypeLesson() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [positions, setPositions] = useState<PointPositions>(
    leverTypes[0].preset,
  );
  const [draggedPoint, setDraggedPoint] = useState<PointKey | null>(null);
  const [seenTypes, setSeenTypes] = useState<LeverTypeId[]>([
    "forceSaving",
  ]);
  const completeActivity = useLearningStore(
    (state) => state.completeActivity,
  );

  const effortArm = Math.abs(positions.effortPoint - positions.fulcrum);
  const resistanceArm = Math.abs(
    positions.resistancePoint - positions.fulcrum,
  );
  const activeId = classifyLeverType(effortArm, resistanceArm);
  const lesson = leverTypes.find((item) => item.id === activeId)!;

  useEffect(() => {
    if (seenTypes.length === leverTypes.length) completeActivity("types");
  }, [completeActivity, seenTypes.length]);

  const applyPositions = (nextPositions: PointPositions) => {
    const nextEffortArm = Math.abs(
      nextPositions.effortPoint - nextPositions.fulcrum,
    );
    const nextResistanceArm = Math.abs(
      nextPositions.resistancePoint - nextPositions.fulcrum,
    );
    const nextType = classifyLeverType(nextEffortArm, nextResistanceArm);

    setPositions(nextPositions);
    setSeenTypes((current) =>
      current.includes(nextType) ? current : [...current, nextType],
    );
  };

  const updatePoint = (key: PointKey, value: number) => {
    const nextValue = Math.min(10, Math.max(0, Math.round(value)));
    const overlapsAnotherPoint = Object.entries(positions).some(
      ([pointKey, position]) => pointKey !== key && position === nextValue,
    );
    if (overlapsAnotherPoint) return;
    applyPositions({ ...positions, [key]: nextValue });
  };

  const updateFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    if (!draggedPoint || !svgRef.current) return;
    const bounds = svgRef.current.getBoundingClientRect();
    const localX = ((event.clientX - bounds.left) / bounds.width) * 800;
    updatePoint(draggedPoint, (localX - 50) / 70);
  };

  const startDragging = (
    key: PointKey,
    event: PointerEvent<SVGElement>,
  ) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggedPoint(key);
  };

  const adjustWithKeyboard = (
    key: PointKey,
    event: KeyboardEvent<SVGElement>,
  ) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    updatePoint(key, positions[key] + (event.key === "ArrowRight" ? 1 : -1));
  };

  const interactiveProps = (key: PointKey, label: string) => ({
    role: "slider" as const,
    tabIndex: 0,
    "aria-label": `拖动${label}`,
    "aria-valuemin": 0,
    "aria-valuemax": 10,
    "aria-valuenow": positions[key],
    "aria-valuetext":
      key === "fulcrum"
        ? `位置 ${positions[key]}`
        : `距离支点 ${Math.abs(positions[key] - positions.fulcrum)} 格`,
    onPointerDown: (event: PointerEvent<SVGElement>) =>
      startDragging(key, event),
    onKeyDown: (event: KeyboardEvent<SVGElement>) =>
      adjustWithKeyboard(key, event),
  });

  const fulcrumX = xForPosition(positions.fulcrum);
  const effortX = xForPosition(positions.effortPoint);
  const resistanceX = xForPosition(positions.resistancePoint);

  return (
    <div>
      <div className="flex flex-wrap gap-2" aria-label="加载三种杠杆示例布局">
        {leverTypes.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => applyPositions(item.preset)}
            className={cn(
              "inline-flex min-h-11 items-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-extrabold",
              activeId === item.id
                ? "border-ink bg-ink text-white"
                : "border-ink/20 bg-white text-muted hover:border-science/50",
            )}
          >
            {activeId === item.id && (
              <Check aria-hidden="true" className="size-4" />
            )}
            {item.name}
          </button>
        ))}
      </div>

      <div className="mt-5 grid items-start gap-6 desktop:grid-cols-[1.25fr_0.75fr]">
        <div className="overflow-hidden rounded-lg border-2 border-ink/20 bg-[#e8f1ed]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 bg-white/70 px-5 py-4">
            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-muted">
                拖动三个位置，比较两条力臂
              </p>
              <h3 className="mt-1 text-xl font-extrabold">杠杆类型判断器</h3>
            </div>
            <span className="rounded-full bg-science/10 px-3 py-1 text-xs font-bold text-science-dark">
              已发现 {seenTypes.length}/3
            </span>
          </div>

          <svg
            ref={svgRef}
            viewBox="0 0 800 340"
            className="h-auto min-h-[300px] w-full touch-none select-none"
            role="group"
            aria-label={`可拖动杠杆，用力臂 ${effortArm} 格，阻力臂 ${resistanceArm} 格，判断为${lesson.name}`}
            onPointerMove={updateFromPointer}
            onPointerUp={() => setDraggedPoint(null)}
            onPointerCancel={() => setDraggedPoint(null)}
          >
            <line
              x1={fulcrumX}
              y1="205"
              x2={effortX}
              y2="205"
              stroke="#d85545"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <line
              x1={fulcrumX}
              y1="225"
              x2={resistanceX}
              y2="225"
              stroke="#287a68"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <rect x="35" y="150" width="730" height="28" rx="5" fill="#d9a85d" stroke="#17324d" strokeWidth="4" />

            {Array.from({ length: 11 }, (_, position) => {
              const x = xForPosition(position);
              return (
                <g key={position}>
                  <line x1={x} y1="152" x2={x} y2="170" stroke="#17324d" strokeWidth="2" />
                  <text x={x} y="285" textAnchor="middle" fontSize="15" fill="#607184">
                    {Math.abs(position - positions.fulcrum)}
                  </text>
                </g>
              );
            })}

            <circle
              cx={effortX}
              cy="164"
              r="25"
              fill="#d85545"
              stroke="white"
              strokeWidth="6"
              className="cursor-grab outline-none focus-visible:stroke-action active:cursor-grabbing"
              {...interactiveProps("effortPoint", "用力点")}
            />
            <text x={effortX} y="120" textAnchor="middle" fontSize="16" fontWeight="700" fill="#b33f34">
              用力点
            </text>

            <rect
              x={resistanceX - 25}
              y="139"
              width="50"
              height="50"
              rx="5"
              fill="#287a68"
              stroke="white"
              strokeWidth="6"
              className="cursor-grab outline-none focus-visible:stroke-action active:cursor-grabbing"
              {...interactiveProps("resistancePoint", "阻力点")}
            />
            <text x={resistanceX} y="120" textAnchor="middle" fontSize="16" fontWeight="700" fill="#236b5c">
              阻力点
            </text>

            <path
              d={`M ${fulcrumX} 178 L ${fulcrumX - 38} 260 L ${fulcrumX + 38} 260 Z`}
              fill="#1f7196"
              stroke="#17324d"
              strokeWidth="3"
            />
            <rect
              x={fulcrumX - 30}
              y="178"
              width="60"
              height="85"
              rx="5"
              fill="transparent"
              stroke="transparent"
              strokeWidth="4"
              className="cursor-grab outline-none focus-visible:stroke-action active:cursor-grabbing"
              {...interactiveProps("fulcrum", "支点")}
            />
            <text x={fulcrumX} y="312" textAnchor="middle" fontSize="16" fontWeight="700" fill="#15536f">
              支点 · 0
            </text>
          </svg>

          <div className="grid gap-2 border-t border-ink/10 bg-white/70 p-4 tablet:grid-cols-2">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-effort">
              <Ruler aria-hidden="true" className="size-4" />
              用力臂：{effortArm} 格
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-resistance tablet:justify-end">
              <Ruler aria-hidden="true" className="size-4" />
              阻力臂：{resistanceArm} 格
            </span>
            <p className="flex items-center gap-2 text-xs font-semibold text-muted tablet:col-span-2">
              <GripHorizontal aria-hidden="true" className="size-4" />
              三个标记都能拖动，也可聚焦后按左右方向键调整。
            </p>
          </div>
        </div>

        <aside className="border-l-4 border-action bg-white/75 p-5">
          <p className="text-xs font-extrabold tracking-[0.16em] text-action">
            实时判断 · {lesson.relation}
          </p>
          <h3 className="mt-2 text-3xl font-extrabold text-ink">
            {lesson.name}
          </h3>
          <p className="mt-4 text-sm font-semibold leading-7 text-ink">
            {lesson.feature}
          </p>
          <p className="mt-2 text-sm leading-7 text-muted">
            {lesson.purpose}
          </p>
        </aside>
      </div>

      <div className="mt-8">
        <p className="mb-4 text-xs font-extrabold tracking-[0.16em] text-science-dark">
          生活中的{lesson.name}
        </p>
        <LeverTypeExamples examples={lesson.examples} />
      </div>
    </div>
  );
}
