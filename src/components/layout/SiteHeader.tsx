import { Atom } from "lucide-react";

import { ChapterNavigation } from "@/components/navigation/ChapterNavigation";
import { LearningProgress } from "@/components/progress/LearningProgress";
import type { ChapterId } from "@/data/chapters";

interface SiteHeaderProps {
  activeChapter: ChapterId;
  onChapterChange: (chapter: ChapterId) => void;
}

export function SiteHeader({
  activeChapter,
  onChapterChange,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur-xl">
      <div className="container flex min-h-16 items-center gap-4 py-2">
        <a
          href="#course-start"
          className="flex shrink-0 items-center gap-2 rounded-lg text-left"
          aria-label="返回课程开始"
        >
          <span className="grid size-10 place-items-center rounded-lg bg-science text-white shadow-card">
            <Atom aria-hidden="true" className="size-6" />
          </span>
          <span className="hidden xl:block">
            <strong className="block font-display text-xl leading-none text-ink">
              杠杆实验室
            </strong>
            <small className="text-[10px] font-bold tracking-[0.2em] text-muted">
              SCIENCE NOTEBOOK
            </small>
          </span>
        </a>

        <div className="min-w-0 flex-1">
          <ChapterNavigation
            activeChapter={activeChapter}
            onChapterChange={onChapterChange}
          />
        </div>

        <LearningProgress compact />
      </div>
    </header>
  );
}
