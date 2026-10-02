import { useState } from "react";

import {
  leverElements,
  type LeverElementId,
} from "@/data/leverElements";
import { cn } from "@/lib/utils";
import { useLearningStore } from "@/store/useLearningStore";

const positions: Record<LeverElementId, string> = {
  effortPoint: "left-[8%] top-[8%]",
  fulcrum: "left-1/2 bottom-[2%] -translate-x-1/2",
  resistancePoint: "right-[6%] top-[8%]",
  effortArm: "left-[18%] bottom-[22%]",
  resistanceArm: "right-[15%] bottom-[22%]",
};

const toneClasses = {
  blue: "border-science bg-science text-white",
  red: "border-effort bg-effort text-white",
  green: "border-resistance bg-resistance text-white",
  orange: "border-action bg-action text-white",
  purple: "border-[#76559b] bg-[#76559b] text-white",
};

export function LeverElementDiagram() {
  const [activeId, setActiveId] = useState<LeverElementId>("fulcrum");
  const exploredElements = useLearningStore((state) => state.exploredElements);
  const exploreElement = useLearningStore((state) => state.exploreElement);
  const active = leverElements.find((item) => item.id === activeId)!;

  const selectElement = (element: LeverElementId) => {
    setActiveId(element);
    exploreElement(element, leverElements.length);
  };

  return (
    <div className="paper-card overflow-hidden">
      <div className="border-b border-ink/10 px-5 py-4 tablet:px-6">
        <p className="text-xs font-bold tracking-[0.18em] text-muted">
          点击、悬停或用 Tab 探索 · 已发现 {exploredElements.length}/
          {leverElements.length}
        </p>
        <h3 className="mt-1 text-xl font-extrabold">一根杠杆，五个要素</h3>
      </div>

      <div className="relative min-h-[330px] bg-[#edf4ef] px-3 py-5 tablet:min-h-[390px]">
        <svg
          viewBox="0 0 800 360"
          className="absolute inset-0 size-full"
          role="img"
          aria-label="标有支点、用力点、阻力点、用力臂和阻力臂的杠杆结构图"
        >
          <line
            x1="110"
            y1="180"
            x2="690"
            y2="180"
            stroke="#17324d"
            strokeWidth="24"
            strokeLinecap="round"
          />
          <line
            x1="110"
            y1="180"
            x2="400"
            y2="180"
            stroke="#d85545"
            strokeWidth={activeId === "effortArm" ? 15 : 7}
            strokeDasharray="12 10"
          />
          <line
            x1="400"
            y1="180"
            x2="690"
            y2="180"
            stroke="#76559b"
            strokeWidth={activeId === "resistanceArm" ? 15 : 7}
            strokeDasharray="12 10"
          />
          <path
            d="M 400 182 L 350 290 L 450 290 Z"
            fill="#1f7196"
            stroke="#17324d"
            strokeWidth={activeId === "fulcrum" ? 8 : 3}
          />
          <circle
            cx="110"
            cy="180"
            r={activeId === "effortPoint" ? 24 : 17}
            fill="#d85545"
            stroke="white"
            strokeWidth="7"
          />
          <rect
            x="669"
            y="159"
            width={activeId === "resistancePoint" ? 42 : 34}
            height={activeId === "resistancePoint" ? 42 : 34}
            rx="4"
            fill="#287a68"
            stroke="white"
            strokeWidth="7"
          />
          <path d="M110 68 V140" stroke="#d85545" strokeWidth="8" />
          <path d="M94 122 L110 142 L126 122" fill="#d85545" />
          <path d="M690 68 V140" stroke="#287a68" strokeWidth="8" />
          <path d="M674 122 L690 142 L706 122" fill="#287a68" />
        </svg>

        {leverElements.map((element) => (
          <button
            key={element.id}
            type="button"
            aria-pressed={activeId === element.id}
            onClick={() => selectElement(element.id)}
            onMouseEnter={() => selectElement(element.id)}
            onFocus={() => selectElement(element.id)}
            className={cn(
              "absolute z-10 min-h-11 rounded-lg border-2 px-3 py-2 text-xs font-extrabold shadow-card transition-transform hover:-translate-y-0.5",
              positions[element.id],
              activeId === element.id
                ? toneClasses[element.tone]
                : "border-ink/20 bg-white text-ink",
            )}
          >
            {element.name}
          </button>
        ))}
      </div>

      <div className="min-h-36 border-t border-ink/10 bg-white/70 p-5 tablet:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className={cn("rounded px-3 py-1 text-sm font-extrabold", toneClasses[active.tone])}>
            {active.name}
          </span>
          <p className="text-base font-bold text-ink">{active.shortDefinition}</p>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">{active.clue}</p>
      </div>
    </div>
  );
}
