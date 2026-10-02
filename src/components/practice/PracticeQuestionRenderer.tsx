import type { PracticeQuestion } from "@/data/practiceQuestions";
import type { PracticeAnswer } from "@/lib/practiceAssessment";

import { ChoiceQuestion } from "./ChoiceQuestion";
import { MatchingQuestion } from "./MatchingQuestion";
import { WordBankQuestion } from "./WordBankQuestion";

interface PracticeQuestionRendererProps {
  question: PracticeQuestion;
  answer?: PracticeAnswer;
  onChange: (answer: PracticeAnswer) => void;
  disabled?: boolean;
}

export function PracticeQuestionRenderer({
  question,
  answer,
  onChange,
  disabled = false,
}: PracticeQuestionRendererProps) {
  switch (question.type) {
    case "choice":
    case "boolean":
      return (
        <ChoiceQuestion
          question={question}
          answer={answer}
          onChange={onChange}
          disabled={disabled}
        />
      );
    case "matching":
      return (
        <MatchingQuestion
          question={question}
          answer={answer}
          onChange={onChange}
          disabled={disabled}
        />
      );
    case "wordBank":
      return (
        <WordBankQuestion
          question={question}
          answer={answer}
          onChange={onChange}
          disabled={disabled}
        />
      );
  }
}
