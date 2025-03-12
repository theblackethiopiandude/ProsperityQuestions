import { FC } from "react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuestionCardProps {
  question: Question;
  selectedAnswerIndex: number | null;
  isAnswered: boolean;
  onSelectAnswer: (answerIndex: number) => void;
}

const QuestionCard: FC<QuestionCardProps> = ({
  question,
  selectedAnswerIndex,
  isAnswered,
  onSelectAnswer,
}) => {
  // Function to determine option styling based on state
  const getOptionStyle = (index: number) => {
    if (!isAnswered) {
      return "bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50";
    }

    if (index === question.correctAnswer) {
      return "bg-green-100 border-2 border-green-500 text-green-700";
    }

    if (index === selectedAnswerIndex && index !== question.correctAnswer) {
      return "bg-red-100 border-2 border-red-500 text-red-700";
    }

    return "bg-white border-2 border-gray-200 opacity-70";
  };

  // Amharic characters for option labels
  const getAmharicLabel = (index: number): string => {
    const amharicLabels = ["ሀ", "ለ", "ሐ", "መ", "ሠ", "ረ", "ሰ", "ሸ", "ቀ", "በ"];
    return amharicLabels[index] || String.fromCharCode(65 + index);
  };

  return (
    <div className="space-y-8">
      <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center mb-8 leading-relaxed">
        {question.question}
      </h3>

      <div className="grid grid-cols-1 gap-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !isAnswered && onSelectAnswer(index)}
            disabled={isAnswered}
            className={`
              p-5 rounded-lg text-left transition-colors h-full
              ${getOptionStyle(index)}
              ${selectedAnswerIndex === index ? "ring-2 ring-blue-500" : ""}
            `}
          >
            <div className="flex items-start">
              <span className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium mr-4 text-xl shrink-0">
                {getAmharicLabel(index)}
              </span>
              <span className="font-medium text-lg md:text-xl leading-relaxed pt-1">
                {option}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
