import { useState } from "react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { ConfirmationDialog } from "../components/ui/dialog";

function HomePage() {
  const { resetGame } = useGameStore();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleResetConfirm = () => {
    resetGame();
    setIsResetDialogOpen(false);
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col">
      {/* Reset Progress Dialog */}
      <ConfirmationDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        title="Reset Progress"
        message="Are you sure you want to reset all your progress? This action cannot be undone."
        confirmLabel="Reset Progress"
        cancelLabel="Cancel"
        onConfirm={handleResetConfirm}
        variant="danger"
      />

      {/* Hero Section */}
      <section className="flex-grow flex items-center justify-center py-8 px-4">
        <div className="container mx-auto relative">
          {/* Floating Elements */}
          <div className="absolute -top-20 left-1/4 w-32 h-32 rounded-full bg-blue-100 opacity-70 animate-pulse"></div>
          <div className="absolute top-60 right-1/4 w-24 h-24 rounded-full bg-blue-200 opacity-60 animate-pulse delay-300"></div>
          <div className="absolute bottom-20 left-20 w-36 h-36 rounded-full bg-blue-100 opacity-50 animate-pulse delay-700"></div>

          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-blue-900 mb-8">
              በየካ ብልፅግና ፓርቲ ቅርንጫፍ ጽ/ቤት የፖለቲካ አቅም ግንባታ ዘርፍ ለመሰረታዊ ድርጅት የተዘጋጀ
              የጥያቄና መልስ ውድድር መድረክ (የተዘጋጁ ጥያቄዎች)
            </h1>

            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8 justify-center">
              <Link to="/game" className="block">
                <Button
                  variant="outline"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-12 py-8 text-3xl rounded-full shadow-lg hover:shadow-xl transition-all w-full"
                >
                  ጨዋታዉን ጀምር
                </Button>
              </Link>
            </div>

            <button
              onClick={() => setIsResetDialogOpen(true)}
              className="mt-8 text-red-600 hover:text-red-800 transition-colors text-lg underline underline-offset-4"
            >
              Reset Progress
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
    </div>
  );
}

export default HomePage;
