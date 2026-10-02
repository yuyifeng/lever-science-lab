import { useEffect } from "react";

import { chapters, type ChapterId } from "@/data/chapters";
import { useLearningStore } from "@/store/useLearningStore";

export function useActiveChapter() {
  const activeChapter = useLearningStore((state) => state.activeChapter);
  const setActiveChapter = useLearningStore(
    (state) => state.setActiveChapter,
  );

  useEffect(() => {
    const sections = chapters
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveChapter(visibleEntry.target.id as ChapterId);
        }
      },
      {
        rootMargin: "-35% 0px -50% 0px",
        threshold: [0, 0.2, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [setActiveChapter]);

  const goToChapter = (chapter: ChapterId) => {
    setActiveChapter(chapter);
    const section = document.getElementById(chapter);
    if (!section) return;

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("scrollBehavior" in document.documentElement.style)) {
      section.scrollIntoView();
      return;
    }

    section.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return { activeChapter, goToChapter };
}
