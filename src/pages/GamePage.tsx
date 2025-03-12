import { useState, useEffect, useRef } from "react";
import NumberGrid from "../components/game/NumberGrid";
import QuestionCard from "../components/game/QuestionCard";
import CountdownTimer from "../components/game/CountdownTimer";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import useSound from "use-sound";
import { useGameStore } from "../store/gameStore";
import { questionsData } from "../data/questions";
import { ResultDialog } from "../components/ui/dialog";

function GamePage() {
  const navigate = useNavigate();

  // Create refs for audio elements
  const successSoundRef = useRef<HTMLAudioElement | null>(null);
  const errorSoundRef = useRef<HTMLAudioElement | null>(null);
  const timerSoundRef = useRef<HTMLAudioElement | null>(null);

  // Global state from Zustand
  const { completedNumbers, markQuestionAsCompleted, isQuestionCompleted } =
    useGameStore();

  // Local UI state
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isQuestionVisible, setIsQuestionVisible] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null
  );
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showTimeUpMessage, setShowTimeUpMessage] = useState(false);
  const [isPreviouslyAnswered, setIsPreviouslyAnswered] = useState(false);
  const [soundsLoaded, setSoundsLoaded] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);

  // Track loaded sounds
  const [successSoundLoaded, setSuccessSoundLoaded] = useState(false);
  const [errorSoundLoaded, setErrorSoundLoaded] = useState(false);
  const [timerSoundLoaded, setTimerSoundLoaded] = useState(false);

  // Use sound hooks with volume and onload callbacks
  const [playSuccess] = useSound("/sounds/success.mp3", {
    volume: 0.5,
    onload: () => setSuccessSoundLoaded(true),
  });

  const [playError] = useSound("/sounds/error.mp3", {
    volume: 0.5,
    onload: () => setErrorSoundLoaded(true),
  });

  const [playTimerSound] = useSound("/sounds/timer.wav", {
    volume: 0.3,
    onload: () => setTimerSoundLoaded(true),
  });

  // Initialize audio elements on component mount
  useEffect(() => {
    // Create audio elements
    successSoundRef.current = new Audio("/sounds/success.mp3");
    errorSoundRef.current = new Audio("/sounds/error.mp3");
    timerSoundRef.current = new Audio("/sounds/timer.wav");

    // Set volume
    if (successSoundRef.current) successSoundRef.current.volume = 0.5;
    if (errorSoundRef.current) errorSoundRef.current.volume = 0.5;
    if (timerSoundRef.current) timerSoundRef.current.volume = 0.3;

    // Set up load event listeners
    if (successSoundRef.current) {
      successSoundRef.current.addEventListener("canplaythrough", () =>
        setSuccessSoundLoaded(true)
      );
      successSoundRef.current.load();
    }

    if (errorSoundRef.current) {
      errorSoundRef.current.addEventListener("canplaythrough", () =>
        setErrorSoundLoaded(true)
      );
      errorSoundRef.current.load();
    }

    if (timerSoundRef.current) {
      timerSoundRef.current.addEventListener("canplaythrough", () =>
        setTimerSoundLoaded(true)
      );
      timerSoundRef.current.load();
    }

    // Cleanup function
    return () => {
      if (successSoundRef.current) {
        successSoundRef.current.pause();
        successSoundRef.current.removeEventListener("canplaythrough", () =>
          setSuccessSoundLoaded(true)
        );
      }

      if (errorSoundRef.current) {
        errorSoundRef.current.pause();
        errorSoundRef.current.removeEventListener("canplaythrough", () =>
          setErrorSoundLoaded(true)
        );
      }

      if (timerSoundRef.current) {
        timerSoundRef.current.pause();
        timerSoundRef.current.removeEventListener("canplaythrough", () =>
          setTimerSoundLoaded(true)
        );
      }
    };
  }, []);

  // Helper functions to play sounds directly
  const playSuccessSound = () => {
    if (successSoundRef.current) {
      successSoundRef.current.currentTime = 0;
      successSoundRef.current
        .play()
        .catch((e) => console.error("Error playing success sound:", e));
    } else {
      playSuccess();
    }
  };

  const playErrorSound = () => {
    if (errorSoundRef.current) {
      errorSoundRef.current.currentTime = 0;
      errorSoundRef.current
        .play()
        .catch((e) => console.error("Error playing error sound:", e));
    } else {
      playError();
    }
  };

  const playTimerSoundDirect = () => {
    if (timerSoundRef.current) {
      timerSoundRef.current.currentTime = 0;
      timerSoundRef.current
        .play()
        .catch((e) => console.error("Error playing timer sound:", e));
    } else {
      playTimerSound();
    }
  };

  const stopTimerSound = () => {
    if (timerSoundRef.current) {
      timerSoundRef.current.pause();
      timerSoundRef.current.currentTime = 0;
    }
  };

  // Check when all sounds are loaded
  useEffect(() => {
    if (successSoundLoaded && errorSoundLoaded && timerSoundLoaded) {
      setSoundsLoaded(true);
    }
  }, [successSoundLoaded, errorSoundLoaded, timerSoundLoaded]);

  // Set a fallback timeout to ensure the app is usable even if sounds fail to load
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSoundsLoaded(true);
      console.log("Fallback: assuming sounds are loaded after timeout");
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  // Function to handle number selection
  const handleNumberSelect = (number: number) => {
    const wasAnsweredBefore = isQuestionCompleted(number);
    setIsPreviouslyAnswered(wasAnsweredBefore);

    setSelectedNumber(number);
    setIsQuestionVisible(true);

    if (wasAnsweredBefore) {
      // For previously answered questions, pre-fill with correct answer
      setIsAnswered(true);
      setSelectedAnswerIndex(questionsData[number - 1].correctAnswer);
      setIsCorrect(true);
    } else {
      // For new questions, reset state
      setIsAnswered(false);
      setSelectedAnswerIndex(null);
      setIsCorrect(null);
    }

    // Not starting timer automatically
    setTimerRunning(false);
    setShowTimeUpMessage(false);

    // Stop any playing timer sound
    stopTimerSound();
  };

  // Function to handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;

    // Stop the timer when answer is selected
    setTimerRunning(false);
    stopTimerSound();

    const currentQuestion = questionsData[selectedNumber! - 1];
    const isAnswerCorrect = answerIndex === currentQuestion.correctAnswer;

    setSelectedAnswerIndex(answerIndex);
    setIsCorrect(isAnswerCorrect);
    setIsAnswered(true);

    if (isAnswerCorrect) {
      playSuccessSound();
      // Update global state with Zustand
      markQuestionAsCompleted(selectedNumber!, answerIndex);
    } else {
      playErrorSound();
    }

    // Show the result dialog
    setShowResultDialog(true);
  };

  // Function to reveal the answer without selection
  const handleRevealAnswer = () => {
    if (isAnswered) return;

    // Stop the timer when revealing answer
    setTimerRunning(false);
    stopTimerSound();

    const currentQuestion = questionsData[selectedNumber! - 1];
    const correctAnswerIndex = currentQuestion.correctAnswer;

    setIsAnswered(true);
    setIsCorrect(false);
    setSelectedAnswerIndex(correctAnswerIndex);
    playErrorSound();

    // Show the result dialog
    setShowResultDialog(true);
  };

  // Function to handle timer controls
  const handleTimerStart = () => setTimerRunning(true);
  const handleTimerStop = () => {
    setTimerRunning(false);
    stopTimerSound();
  };
  const handleTimerReset = () => {
    setTimerRunning(false);
    stopTimerSound();
    setShowTimeUpMessage(false);
  };

  // Function to handle time up
  const handleTimeUp = () => {
    setTimerRunning(false);
    stopTimerSound();
    setShowTimeUpMessage(true);
    setIsAnswered(true);
    playErrorSound();
    setShowResultDialog(true);
  };

  // Function to close question and return to grid
  const handleCloseQuestion = () => {
    setIsQuestionVisible(false);
    setSelectedNumber(null);
    setIsPreviouslyAnswered(false);
    stopTimerSound();
  };

  // Function to go back to home
  const handleBackToHome = () => {
    stopTimerSound();
    navigate("/");
  };

  // Function to close result dialog
  const handleCloseResultDialog = () => {
    setShowResultDialog(false);
  };

  // Helper function to get the correct answer text
  const getCorrectAnswerText = (questionNumber: number) => {
    const question = questionsData[questionNumber - 1];
    return question.options[question.correctAnswer];
  };

  // If sounds aren't loaded yet, show a loading indicator
  if (!soundsLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-blue-900">
            Loading game resources...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-12">
      {/* Result Dialog - never show the correct answer */}
      {selectedNumber && (
        <ResultDialog
          isOpen={showResultDialog}
          onClose={handleCloseResultDialog}
          isCorrect={isCorrect === true}
        />
      )}

      <div className="container mx-auto mw-full">
        {/* Back navigation button - only shown on grid view */}
        {!isQuestionVisible && (
          <div className="mb-6">
            <Button
              variant="outline"
              className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2"
              onClick={handleBackToHome}
            >
              ← Back to Home
            </Button>
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-8">
          የጥያቄ ዝርዝር
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 w-full">
          {!isQuestionVisible ? (
            <div className="space-y-8">
              <p className="text-gray-700 text-2xl text-center">
                በየካ ብልፅግና ፓርቲ ቅርንጫፍ ጽ/ቤት የፖለቲካ አቅም ግንባታ ዘርፍ ለመሰረታዊ ድርጅት የተዘጋጀ
                የጥያቄና መልስ ውድድር መድረክ (የተዘጋጁ ጥያቄዎች)
              </p>

              <NumberGrid
                totalNumbers={9}
                onSelectNumber={handleNumberSelect}
                completedNumbers={completedNumbers}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCloseQuestion}
                  className="bg-white text-gray-700 hover:bg-gray-50"
                >
                  ← Back to Grid
                </Button>

                <div>
                  <h2 className="text-xl font-semibold text-blue-900 text-right">
                    Question {selectedNumber}
                  </h2>
                  {isPreviouslyAnswered && (
                    <div className="text-sm text-green-600 font-medium mt-1 text-right">
                      You've already answered this question correctly!
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="bg-white rounded-lg">
                  <QuestionCard
                    question={questionsData[selectedNumber! - 1]}
                    selectedAnswerIndex={selectedAnswerIndex}
                    isAnswered={isAnswered}
                    onSelectAnswer={handleAnswerSelect}
                  />

                  {!isAnswered && !isPreviouslyAnswered && (
                    <div className="flex justify-center mt-6">
                      <Button
                        variant="secondary"
                        className="bg-amber-100 hover:bg-amber-200 text-amber-800 border-2 border-amber-300 text-lg py-5 px-8 font-medium shadow-md w-full hover:shadow-lg transition-all"
                        onClick={handleRevealAnswer}
                      >
                        Reveal Answer
                      </Button>
                    </div>
                  )}

                  {showTimeUpMessage && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-center font-medium">
                      Time's up! You didn't answer in time.
                    </div>
                  )}

                  {/* Show the answer in the question UI when answered incorrectly */}
                  {isAnswered &&
                    isCorrect === false &&
                    !isPreviouslyAnswered && (
                      <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-center font-medium">
                        Incorrect. The correct answer is:{" "}
                        {getCorrectAnswerText(selectedNumber!)}
                      </div>
                    )}

                  {/* Show success message when answered correctly */}
                  {isAnswered &&
                    isCorrect === true &&
                    !isPreviouslyAnswered && (
                      <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-md text-center font-medium">
                        Correct! Well done!
                      </div>
                    )}
                </div>

                <div>
                  {!isPreviouslyAnswered && (
                    <CountdownTimer
                      isRunning={timerRunning}
                      onTimeUp={handleTimeUp}
                      onStart={handleTimerStart}
                      onStop={handleTimerStop}
                      onReset={handleTimerReset}
                      playTimerSound={playTimerSoundDirect}
                      stopTimerSound={stopTimerSound}
                    />
                  )}
                  {isPreviouslyAnswered && (
                    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
                      <div className="text-center py-6">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-8 h-8 text-green-600"
                          >
                            <path
                              fillRule="evenodd"
                              d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          Already Completed
                        </h3>
                        <p className="text-gray-600">
                          You've already answered this question correctly!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GamePage;
