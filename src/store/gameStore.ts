import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameState {
  completedNumbers: number[];
  correctAnswers: Record<number, number>;

  // Actions
  markQuestionAsCompleted: (
    questionNumber: number,
    answerIndex: number
  ) => void;
  resetGame: () => void;
  isQuestionCompleted: (questionNumber: number) => boolean;
  getCorrectAnswerIndex: (questionNumber: number) => number | null;
}

// Using persist middleware to save game state to localStorage
export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      completedNumbers: [],
      correctAnswers: {},

      markQuestionAsCompleted: (
        questionNumber: number,
        answerIndex: number
      ) => {
        set((state) => {
          // Only add if not already in the list
          if (!state.completedNumbers.includes(questionNumber)) {
            return {
              completedNumbers: [...state.completedNumbers, questionNumber],
              correctAnswers: {
                ...state.correctAnswers,
                [questionNumber]: answerIndex,
              },
            };
          }
          return state;
        });
      },

      resetGame: () => {
        set({
          completedNumbers: [],
          correctAnswers: {},
        });
      },

      isQuestionCompleted: (questionNumber: number) => {
        return get().completedNumbers.includes(questionNumber);
      },

      getCorrectAnswerIndex: (questionNumber: number) => {
        return get().correctAnswers[questionNumber] ?? null;
      },
    }),
    {
      name: "quiz-game-storage", // unique name for localStorage
    }
  )
);
