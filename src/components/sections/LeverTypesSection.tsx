import { Wrench } from "lucide-react";

import { LeverTypeLesson } from "@/components/types/LeverTypeLesson";

export function LeverTypesSection() {
  return (
    <section id="types" className="container py-12 tablet:py-16" aria-labelledby="types-title">
      <div className="max-w-3xl">
        <span className="eyebrow">
          <Wrench aria-hidden="true" className="size-4" />
          03 · 杠杆类型
        </span>
        <h2 id="types-title" className="section-title mt-5">
          比较力臂，认出三类杠杆
        </h2>
        <p className="body-copy mt-4">
          拖动支点、用力点和阻力点，自由改变两条力臂。观察长度变化，页面会直接判断杠杆类型。
        </p>
      </div>

      <div className="mt-8">
        <LeverTypeLesson />
      </div>
    </section>
  );
}
