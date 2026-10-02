import { Activity } from "lucide-react";

import { SiteHeader } from "@/components/layout/SiteHeader";
import { PracticeSection } from "@/components/practice/PracticeSection";
import { LearningSummary } from "@/components/progress/LearningSummary";
import { HeroSection } from "@/components/sections/HeroSection";
import { LeverElementsSection } from "@/components/sections/LeverElementsSection";
import { LeverExperimentSection } from "@/components/sections/LeverExperimentSection";
import { LeverTypesSection } from "@/components/sections/LeverTypesSection";
import { useActiveChapter } from "@/hooks/useActiveChapter";
import { useLeverExperiment } from "@/hooks/useLeverExperiment";
import { useLearningStore } from "@/store/useLearningStore";
import { usePracticeStore } from "@/store/usePracticeStore";

export default function Home() {
  const { activeChapter, goToChapter } = useActiveChapter();
  const experiment = useLeverExperiment();
  const practiceRevision = useLearningStore(
    (state) => state.practiceRevision,
  );
  const restartExperiment = useLearningStore(
    (state) => state.restartExperiment,
  );
  const restartPractices = useLearningStore(
    (state) => state.restartPractices,
  );
  const restartComprehensivePractice = usePracticeStore(
    (state) => state.restartPractice,
  );

  return (
    <div className="min-h-screen">
      <SiteHeader
        activeChapter={activeChapter}
        onChapterChange={goToChapter}
      />

      <main>
        <HeroSection
          onStart={() => goToChapter("intro")}
        />
        <LeverElementsSection key={`elements-${practiceRevision}`} />
        <LeverExperimentSection experiment={experiment} />
        <LeverTypesSection key={`types-${practiceRevision}`} />
        <PracticeSection />
        <LearningSummary
          onRestartExperiment={() => {
            restartExperiment();
            experiment.reset();
            goToChapter("experiment");
          }}
          onRestartPractices={() => {
            restartPractices();
            restartComprehensivePractice();
            goToChapter("intro");
          }}
          onRestartComprehensivePractice={() => {
            restartComprehensivePractice();
            goToChapter("practice");
          }}
        />
      </main>

      <footer className="border-t border-ink/10 bg-ink py-8 text-white">
        <div className="container flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
          <div className="flex items-center gap-2 font-display text-2xl">
            <Activity aria-hidden="true" className="size-5 text-action" />
            杠杆实验室
          </div>
          <p className="text-xs font-semibold text-white/60">
            观察 · 猜想 · 实验 · 用证据说话
          </p>
        </div>
      </footer>
    </div>
  );
}
