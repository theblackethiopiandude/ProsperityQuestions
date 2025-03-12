import { FC, useEffect, useState, useRef } from "react";
import { Button } from "../ui/button";

interface CountdownTimerProps {
  isRunning: boolean;
  onTimeUp: () => void;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  initialTime?: number;
  playTimerSound?: () => void;
  stopTimerSound?: () => void;
}

const CountdownTimer: FC<CountdownTimerProps> = ({
  isRunning,
  onTimeUp,
  onStart,
  onStop,
  onReset,
  initialTime = 30, // Default 30 seconds
  playTimerSound,
  stopTimerSound,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [hasStarted, setHasStarted] = useState(false);
  const timerIdRef = useRef<number | undefined>(undefined);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Create a direct reference to an audio element for better control
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    // Create the audio element once
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/timer.wav");
      audioRef.current.volume = 0.3;
      audioRef.current.loop = true; // Make the sound loop

      // Preload the audio
      audioRef.current.load();

      // Add event listeners for audio state
      audioRef.current.addEventListener("play", () => setIsAudioPlaying(true));
      audioRef.current.addEventListener("pause", () =>
        setIsAudioPlaying(false)
      );
      audioRef.current.addEventListener("ended", () =>
        setIsAudioPlaying(false)
      );
    }

    return () => {
      // Cleanup on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("play", () =>
          setIsAudioPlaying(true)
        );
        audioRef.current.removeEventListener("pause", () =>
          setIsAudioPlaying(false)
        );
        audioRef.current.removeEventListener("ended", () =>
          setIsAudioPlaying(false)
        );
        audioRef.current = null;
      }
    };
  }, []);

  // Reset timer when stopped and reset
  useEffect(() => {
    if (!isRunning && !hasStarted) {
      setTimeRemaining(initialTime);
    }
  }, [isRunning, hasStarted, initialTime]);

  // Handle direct play of tick sound
  const playTick = () => {
    if (audioRef.current) {
      // Only restart if not already playing
      if (!isAudioPlaying) {
        const playPromise = audioRef.current.play();

        // Handle the play promise (required for modern browsers)
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Audio play prevented by browser:", error);
          });
        }
      }
    } else if (playTimerSound) {
      // Fallback to provided sound function if audio element not available
      playTimerSound();
    }
  };

  // Handle stopping the timer sound
  const stopTick = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    } else if (stopTimerSound) {
      // Use the provided stop function if audio element is not available
      stopTimerSound();
    }
  };

  // Start the countdown when isRunning is true
  useEffect(() => {
    // Clear existing interval if there is one
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = undefined;
    }

    if (isRunning) {
      setHasStarted(true);

      // Play sound on start - play it as a continuous sound
      playTick();

      timerIdRef.current = window.setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            if (timerIdRef.current) {
              clearInterval(timerIdRef.current);
              timerIdRef.current = undefined;
            }
            stopTick();
            onTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      // Stop any playing audio when timer is paused
      stopTick();
    }

    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = undefined;
      }

      // Stop any playing audio when effect is cleaned up
      stopTick();
    };
  }, [isRunning, onTimeUp, initialTime]);

  // Format time as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Reset timer
  const handleReset = () => {
    // Clear any existing timer
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = undefined;
    }

    // Stop any playing audio
    stopTick();

    setHasStarted(false);
    setTimeRemaining(initialTime);
    onReset();
  };

  // Handle start with sound
  const handleStart = () => {
    playTick();
    onStart();
  };

  // Handle pause
  const handlePause = () => {
    // Clear the interval to stop countdown
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = undefined;
    }

    // Stop any playing audio
    stopTick();

    onStop();
  };

  // Calculate progress percentage for the circle
  const progressPercentage = (timeRemaining / initialTime) * 100;

  // Calculate the SVG parameters for the circular progress
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (progressPercentage / 100) * circumference;

  // Get the stroke color based on time remaining
  const getStrokeColor = () => {
    if (timeRemaining < initialTime * 0.25) return "#ef4444"; // red-500
    if (timeRemaining < initialTime * 0.5) return "#eab308"; // yellow-500
    return "#3b82f6"; // blue-500
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center h-full">
      <h2 className="text-2xl font-semibold text-blue-900 mb-6 self-start">
        Timer
      </h2>

      <div className="relative w-56 h-56 mb-8">
        {/* Background circle */}
        <svg className="w-full h-full" viewBox="0 0 170 170">
          <circle
            cx="85"
            cy="85"
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="12"
          />

          {/* Progress circle */}
          <circle
            cx="85"
            cy="85"
            r={radius}
            fill="none"
            stroke={getStrokeColor()}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
            transform="rotate(-90 85 85)"
          />
        </svg>

        {/* Timer text in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-bold text-blue-900 font-mono">
            {formatTime()}
          </span>
        </div>
      </div>

      <div className="flex space-x-4 mb-6 w-full justify-center">
        {!isRunning ? (
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8 flex items-center gap-2"
            onClick={handleStart}
            disabled={timeRemaining === 0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
            Start Timer
          </Button>
        ) : (
          <Button
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 text-lg py-6 px-8 border-2 flex items-center gap-2"
            onClick={handlePause}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                clipRule="evenodd"
              />
            </svg>
            Pause Timer
          </Button>
        )}

        <Button
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50 text-lg py-6 px-8 border-2 flex items-center gap-2"
          onClick={handleReset}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
              clipRule="evenodd"
            />
          </svg>
          Reset
        </Button>
      </div>

      <p className="text-lg text-gray-600 text-center">
        {isRunning
          ? "Timer is running."
          : hasStarted
          ? "Timer is paused."
          : "Timer is ready to start."}
        {timeRemaining === 0 && " Time's up!"}
      </p>

      {/* Audio indicator */}
      <div
        className={`mt-4 flex items-center gap-2 ${
          isAudioPlaying ? "text-blue-600" : "text-gray-400"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
          <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
        </svg>
        <span className="text-sm font-medium">
          {isAudioPlaying ? "Sound On" : "Sound Off"}
        </span>
      </div>
    </div>
  );
};

export default CountdownTimer;
