import React, { useState, useEffect } from 'react';
import { X, Gamepad2, Clock } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import MemoryMinigame from './minigames/MemoryMinigame';
import QuizMinigame from './minigames/QuizMinigame';
import SortingMinigame from './minigames/SortingMinigame';

const MinigameModal: React.FC = () => {
  const { state, skipMinigame, completeMinigame } = useGame();
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds

  // Timer effect
  useEffect(() => {
    if (!state.showMinigame) {
      setTimeLeft(60);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up, close minigame
          completeMinigame({ completed: false, skipped: true });
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.showMinigame, completeMinigame]);

  if (!state.showMinigame) return null;

  const handleComplete = () => {
    completeMinigame({ completed: true, skipped: false });
  };

  const handleSkip = () => {
    skipMinigame();
  };

  const renderMinigame = () => {
    switch (state.currentMinigameId) {
      case 'memory':
        return <MemoryMinigame onComplete={handleComplete} />;
      case 'quiz':
        return <QuizMinigame onComplete={handleComplete} />;
      case 'sorting':
        return <SortingMinigame onComplete={handleComplete} />;
      default:
        return <MemoryMinigame onComplete={handleComplete} />;
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const isWarning = timeLeft <= 30;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={handleSkip}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg mx-4 animate-scale-in">
        <div className="game-card">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Even pauze! 🎮
                </h2>
                <p className="text-sm text-muted-foreground">
                  Dit is gewoon voor de lol
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkip}
              className="rounded-full hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Timer */}
          <div className={`mb-4 p-3 rounded-lg flex items-center justify-center gap-2 ${isWarning ? 'bg-red-50 border border-red-200' : 'bg-primary/5 border border-primary/20'}`}>
            <Clock className={`w-4 h-4 ${isWarning ? 'text-red-600' : 'text-primary'}`} />
            <span className={`font-mono font-semibold text-lg ${isWarning ? 'text-red-600' : 'text-primary'}`}>
              {timeDisplay}
            </span>
          </div>

          {/* Game Content */}
          <div className="min-h-[300px]">
            {renderMinigame()}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                💡 Dit beïnvloedt je privacy-score niet
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSkip}
                className="rounded-full"
              >
                Overslaan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinigameModal;
