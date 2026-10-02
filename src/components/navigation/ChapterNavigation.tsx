import { Check } from "lucide-react";

import { chapters, type ChapterId } from "@/data/chapters";
import { cn } from "@/lib/utils";
import {
  getCompletedChapters,
  useLearningStore,
} from "@/store/useLearningStore";

interface ChapterNavigationProps {
  activeChapter: ChapterId;
  onChapterChange: (chapter: ChapterId) => void;
}

export function ChapterNavigation({
  activeChapter,
  onChapterChange,
}: ChapterNavigationProps) {
  const completedActivities = useLearningStore(
    (state) => state.completedActivities,
  );
  const completedChapters = getCompletedChapters(completedActivities);

  return (
    <nav aria-label="课程章节" className="overflow-x-auto">
      <ul className="flex min-w-max items-center gap-1 p-1">
        {chapters.map((chapter) => {
          const Icon = chapter.icon;
          const isActive = activeChapter === chapter.id;

          return (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => onChapterChange(chapter.id)}
                className={cn(
                  "group flex min-h-11 items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-semibold transition-colors tablet:gap-2 tablet:px-3",
                  isActive
                    ? "bg-ink text-white ring-2 ring-ink ring-offset-2 ring-offset-paper"
                    : "text-muted hover:bg-science/10 hover:text-science-dark",
                )}
              >
                <Icon aria-hidden="true" className="size-4" strokeWidth={2.4} />
                <span className="tablet:hidden">{chapter.shortLabel}</span>
                <span className="hidden tablet:inline">{chapter.label}</span>
                {completedChapters.includes(chapter.id) && (
                  <Check aria-label="已完成" className="size-3.5" />
                )}
                {isActive && <span className="sr-only">当前章节</span>}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
