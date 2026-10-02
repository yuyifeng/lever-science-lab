import { ArrowDown, BookOpenCheck, Sparkles } from "lucide-react";

import { LearningProgress } from "@/components/progress/LearningProgress";
import { LeverPreview } from "@/components/sections/LeverPreview";
import { chapters } from "@/data/chapters";

interface HeroSectionProps {
  onStart: () => void;
}

export function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <section
      id="course-start"
      className="container pb-12 pt-8 tablet:pb-16 tablet:pt-12"
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="h-px w-10 bg-action" />
        <p className="text-xs font-extrabold tracking-[0.22em] text-science-dark">
          小学科学 · 互动探究课
        </p>
      </div>

      <div className="grid items-start gap-8 desktop:grid-cols-[minmax(0,0.88fr)_minmax(520px,1.12fr)]">
        <div className="pt-2">
          <div className="eyebrow">
            <Sparkles aria-hidden="true" className="size-4" />
            今天的探究问题
          </div>
          <h1 className="mt-6 font-display text-6xl leading-[0.98] text-ink tablet:text-7xl desktop:text-8xl">
            杠杆
            <span className="mt-2 block text-science">实验室</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg font-semibold leading-8 text-ink/80">
            为什么一根小木棒能撬动重物？先观察，再猜想，最后用实验找出答案。
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex min-h-12 items-center gap-3 rounded-lg bg-action px-6 py-3 text-base font-extrabold text-white shadow-[0_5px_0_#b95c23] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
            >
              开始探索
              <ArrowDown aria-hidden="true" className="size-5" />
            </button>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted">
              <BookOpenCheck aria-hidden="true" className="size-5 text-science" />
              共 {chapters.length} 个学习章节
            </span>
          </div>

          <div className="mt-10 max-w-xl">
            <LearningProgress />
          </div>
        </div>

        <LeverPreview />
      </div>
    </section>
  );
}
