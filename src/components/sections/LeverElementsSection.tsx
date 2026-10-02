import { Shapes } from "lucide-react";

import { ElementPractice } from "@/components/elements/ElementPractice";
import { LeverElementDiagram } from "@/components/elements/LeverElementDiagram";

export function LeverElementsSection() {
  return (
    <section
      id="intro"
      className="container pb-12 tablet:pb-16"
      aria-labelledby="elements-title"
    >
      <div className="mb-7 max-w-2xl">
        <span className="eyebrow">
          <Shapes aria-hidden="true" className="size-4" />
          01 · 认识杠杆
        </span>
        <h2 id="elements-title" className="section-title mt-5">
          先认识杠杆的五个要素
        </h2>
        <p className="body-copy mt-4">
          找准支点、用力点和阻力点，再量出用力臂与阻力臂，才能读懂杠杆怎样工作。
        </p>
      </div>

      <div className="grid items-start gap-5 desktop:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.65fr)]">
        <LeverElementDiagram />
        <ElementPractice />
      </div>
    </section>
  );
}
