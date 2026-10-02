import { GripHorizontal, Minus, Plus, Scale } from "lucide-react";
import {
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import type { LeverCalculation, LeverParameters } from "@/lib/leverPhysics";

interface ExperimentBoardProps {
  parameters: LeverParameters;
  calculation: LeverCalculation;
  hasRun: boolean;
  onParameterChange: (key: keyof LeverParameters, value: number) => void;
}

type PositionKey = "fulcrum" | "effortPoint" | "resistancePoint";
type ForceKey = "effortForce" | "resistanceForce";

const xForPosition = (position: number) => 60 + position * 68;

export function ExperimentBoard({
  parameters,
  calculation,
  hasRun,
  onParameterChange,
}: ExperimentBoardProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggedPoint, setDraggedPoint] = useState<PositionKey | null>(null);
  const fulcrumX = xForPosition(parameters.fulcrum);
  const effortX = xForPosition(parameters.effortPoint);
  const resistanceX = xForPosition(parameters.resistancePoint);
  const angle = !hasRun
    ? 0
    : calculation.outcome === "left"
      ? -7
      : calculation.outcome === "right"
        ? 7
        : 0;

  const status = !hasRun
    ? "等待运行"
    : calculation.outcome === "balanced"
      ? "保持平衡"
      : calculation.outcome === "left"
        ? "左边下沉"
        : "右边下沉";

  const updatePositionFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    if (!draggedPoint || !svgRef.current) return;
    const bounds = svgRef.current.getBoundingClientRect();
    const localX = ((event.clientX - bounds.left) / bounds.width) * 800;
    const position = Math.round((localX - 60) / 68);
    onParameterChange(draggedPoint, position);
  };

  const startDragging = (
    key: PositionKey,
    event: PointerEvent<SVGElement>,
  ) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggedPoint(key);
  };

  const adjustWithKeyboard = (
    key: PositionKey,
    event: KeyboardEvent<SVGElement>,
  ) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    onParameterChange(key, parameters[key] + (event.key === "ArrowRight" ? 1 : -1));
  };

  const adjustForce = (key: ForceKey, delta: number) => {
    onParameterChange(key, parameters[key] + delta);
  };

  const forceControl = (
    key: ForceKey,
    label: string,
    value: number,
    tone: "effort" | "resistance",
  ) => (
    <div className="rounded-lg border-2 border-ink/10 bg-white/95 p-2 text-center shadow-card">
      <p
        className={`text-xs font-extrabold ${
          tone === "effort" ? "text-effort" : "text-resistance"
        }`}
      >
        {label}
      </p>
      <div className="mt-1 grid grid-cols-[32px_1fr_32px] items-center gap-1">
        <button
          type="button"
          onClick={() => adjustForce(key, -1)}
          disabled={value <= 1}
          className="grid size-8 place-items-center rounded border border-ink/20 bg-paper text-ink disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`减小${label}`}
        >
          <Minus aria-hidden="true" className="size-4" />
        </button>
        <output className="text-sm font-extrabold text-ink">{value} N</output>
        <button
          type="button"
          onClick={() => adjustForce(key, 1)}
          disabled={value >= 10}
          className="grid size-8 place-items-center rounded border border-ink/20 bg-paper text-ink disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`增大${label}`}
        >
          <Plus aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="paper-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 px-5 py-4 tablet:px-6">
        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-muted">
            1 · 直接拖动设置条件
          </p>
          <h3 className="mt-1 text-xl font-extrabold">杠杆实验台</h3>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-ink/5 px-3 py-1 text-xs font-bold text-ink">
          <Scale aria-hidden="true" className="size-4" />
          {status}
        </span>
      </div>

      <div className="relative min-h-[430px] overflow-hidden bg-[#e8f1ed]">
        <div className="absolute inset-x-3 top-4 z-10 grid grid-cols-2 gap-3 tablet:inset-x-5">
          {forceControl(
            "effortForce",
            "用力大小",
            parameters.effortForce,
            "effort",
          )}
          {forceControl(
            "resistanceForce",
            "阻力大小",
            parameters.resistanceForce,
            "resistance",
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(90deg,rgba(23,50,77,0.08)_1px,transparent_1px)] bg-[length:24px_24px]" />
        <svg
          ref={svgRef}
          viewBox="0 0 800 390"
          className="absolute inset-x-0 bottom-0 h-[390px] w-full touch-none select-none"
          role="group"
          aria-label={`可操作的杠杆实验图，支点在刻度 ${parameters.fulcrum}，用力点在刻度 ${parameters.effortPoint}，阻力点在刻度 ${parameters.resistancePoint}`}
          onPointerMove={updatePositionFromPointer}
          onPointerUp={() => setDraggedPoint(null)}
          onPointerCancel={() => setDraggedPoint(null)}
        >
          <g className="text-ink/60">
            {Array.from({ length: 11 }, (_, position) => {
              const x = xForPosition(position);
              return (
                <g key={position}>
                  <line x1={x} y1="308" x2={x} y2="320" stroke="currentColor" />
                  <text x={x} y="340" textAnchor="middle" fontSize="15" fill="currentColor">
                    {Math.abs(position - parameters.fulcrum)}
                  </text>
                </g>
              );
            })}
          </g>

          <path
            d={`M ${fulcrumX} 190 L ${fulcrumX - 45} 300 L ${fulcrumX + 45} 300 Z`}
            fill="#1f7196"
            stroke="#17324d"
            strokeWidth="3"
          />
          <rect
            x={fulcrumX - 30}
            y="195"
            width="60"
            height="110"
            rx="6"
            fill="transparent"
            role="slider"
            tabIndex={0}
            aria-label="拖动支点"
            aria-valuemin={1}
            aria-valuemax={9}
            aria-valuenow={parameters.fulcrum}
            onPointerDown={(event) => startDragging("fulcrum", event)}
            onKeyDown={(event) => adjustWithKeyboard("fulcrum", event)}
            className="cursor-grab outline-none focus-visible:stroke-action active:cursor-grabbing"
            stroke="transparent"
            strokeWidth="4"
          />
          <text x={fulcrumX} y="326" textAnchor="middle" fontSize="16" fontWeight="700" fill="#15536f">
            支点
          </text>

          <g
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: `${fulcrumX}px 180px`,
              transition: "transform 700ms cubic-bezier(.2,.8,.2,1)",
            }}
          >
            <rect x="45" y="166" width="710" height="28" rx="5" fill="#d9a85d" stroke="#17324d" strokeWidth="4" />
            {Array.from({ length: 11 }, (_, position) => (
              <line
                key={position}
                x1={xForPosition(position)}
                y1="168"
                x2={xForPosition(position)}
                y2={position % 5 === 0 ? 188 : 182}
                stroke="#17324d"
                strokeWidth="2"
              />
            ))}
            <circle
              cx={effortX}
              cy="180"
              r="24"
              fill="#d85545"
              stroke="white"
              strokeWidth="6"
              role="slider"
              tabIndex={0}
              aria-label="拖动用力点"
              aria-valuemin={0}
              aria-valuemax={parameters.fulcrum - 1}
              aria-valuenow={parameters.effortPoint}
              onPointerDown={(event) => startDragging("effortPoint", event)}
              onKeyDown={(event) => adjustWithKeyboard("effortPoint", event)}
              className="cursor-grab outline-none focus-visible:stroke-action active:cursor-grabbing"
            />
            <rect
              x={resistanceX - 24}
              y="156"
              width="48"
              height="48"
              rx="5"
              fill="#287a68"
              stroke="white"
              strokeWidth="6"
              role="slider"
              tabIndex={0}
              aria-label="拖动阻力点"
              aria-valuemin={parameters.fulcrum + 1}
              aria-valuemax={10}
              aria-valuenow={parameters.resistancePoint}
              onPointerDown={(event) => startDragging("resistancePoint", event)}
              onKeyDown={(event) => adjustWithKeyboard("resistancePoint", event)}
              className="cursor-grab outline-none focus-visible:stroke-action active:cursor-grabbing"
            />
          </g>
        </svg>

        <p className="absolute inset-x-4 bottom-5 flex items-center justify-center gap-2 text-center text-xs font-semibold text-muted">
          <GripHorizontal aria-hidden="true" className="size-4" />
          支点刻度为 0；拖动支点、红色圆点或绿色方块调整位置
        </p>
      </div>
    </div>
  );
}
