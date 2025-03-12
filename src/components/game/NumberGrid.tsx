import { FC } from "react";

interface NumberGridProps {
  totalNumbers: number;
  onSelectNumber: (number: number) => void;
  completedNumbers: number[];
}

const NumberGrid: FC<NumberGridProps> = ({
  totalNumbers,
  onSelectNumber,
  completedNumbers,
}) => {
  // Generate numbers array from 1 to totalNumbers
  const numbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);

  // Determine grid columns based on totalNumbers
  const getGridCols = () => {
    return "grid-cols-3 md:grid-cols-5";
  };

  return (
    <div className={`grid ${getGridCols()} gap-5 w-full mx-auto`}>
      {numbers.map((number, index) => {
        const isCompleted = completedNumbers.includes(number);
        // Add a staggered animation delay based on the index
        const animationDelay = `${index * 0.1}s`;

        return (
          <button
            key={number}
            onClick={() => onSelectNumber(number)}
            style={{ animationDelay }}
            className={`
              aspect-square text-3xl font-bold rounded-lg shadow-sm transition-all
              ${
                isCompleted
                  ? "bg-green-100 text-green-700 border-2 border-green-500 hover:bg-green-200"
                  : "bg-gray-100 border border-gray-200 text-blue-900 hover:bg-gray-200 hover:shadow-md"
              }
              relative
              animate-fade-in hover:scale-105 active:scale-95
            `}
            aria-label={`Question ${number}${
              isCompleted ? " (completed)" : ""
            }`}
          >
            {number}
            {isCompleted && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white w-7 h-7 rounded-full text-sm flex items-center justify-center animate-bounce">
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default NumberGrid;
