import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, RotateCcw, Shield, AlertTriangle } from 'lucide-react';

interface SortingMinigameProps {
  onComplete: () => void;
}

interface DataItem {
  id: string;
  text: string;
  isSensitive: boolean;
}

const allDataItems: DataItem[] = [
  { id: '1', text: 'Je favoriete kleur', isSensitive: false },
  { id: '2', text: 'Je BSN-nummer', isSensitive: true },
  { id: '3', text: 'Je huisadres', isSensitive: true },
  { id: '4', text: 'Je hobby\'s', isSensitive: false },
  { id: '5', text: 'Je wachtwoord', isSensitive: true },
  { id: '6', text: 'Je lievelingsfilm', isSensitive: false },
  { id: '7', text: 'Je bankgegevens', isSensitive: true },
  { id: '8', text: 'Je geboortedatum', isSensitive: true },
];

const SortingMinigame: React.FC<SortingMinigameProps> = ({ onComplete }) => {
  const [items, setItems] = useState<DataItem[]>([]);
  const [sortedItems, setSortedItems] = useState<{ safe: string[]; sensitive: string[] }>({
    safe: [],
    sensitive: [],
  });
  const [feedback, setFeedback] = useState<{ id: string; correct: boolean } | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffled = [...allDataItems]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
    setItems(shuffled);
    setSortedItems({ safe: [], sensitive: [] });
    setFeedback(null);
    setIsComplete(false);
    setScore({ correct: 0, total: 0 });
  };

  const handleSort = (item: DataItem, category: 'safe' | 'sensitive') => {
    const isCorrect = (category === 'sensitive') === item.isSensitive;
    
    setFeedback({ id: item.id, correct: isCorrect });
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    setTimeout(() => {
      setItems(prev => prev.filter(i => i.id !== item.id));
      setSortedItems(prev => ({
        ...prev,
        [category]: [...prev[category], item.id],
      }));
      setFeedback(null);

      if (items.length === 1) {
        setIsComplete(true);
      }
    }, 800);
  };

  if (isComplete) {
    const percentage = Math.round((score.correct / score.total) * 100);
    
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="text-5xl mb-4">
          {percentage >= 80 ? '🎯' : percentage >= 60 ? '👍' : '💪'}
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Sorteer-spel voltooid!
        </h3>
        <p className="text-muted-foreground mb-6">
          {score.correct} van {score.total} goed gesorteerd ({percentage}%)
        </p>
        <Button onClick={onComplete} className="rounded-full">
          <Check className="w-4 h-4 mr-2" />
          Doorgaan met spelen
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Sorteer de gegevens: wat is gevoelig en wat niet?
        </p>
      </div>

      {/* Drop zones */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-success/10 border-2 border-dashed border-success/30 text-center">
          <Shield className="w-6 h-6 text-success mx-auto mb-2" />
          <span className="text-sm font-medium text-success">Mag gedeeld worden</span>
          <div className="mt-2 text-xs text-muted-foreground">
            {sortedItems.safe.length} items
          </div>
        </div>
        <div className="p-4 rounded-xl bg-warning/10 border-2 border-dashed border-warning/30 text-center">
          <AlertTriangle className="w-6 h-6 text-warning mx-auto mb-2" />
          <span className="text-sm font-medium text-warning">Gevoelige gegevens</span>
          <div className="mt-2 text-xs text-muted-foreground">
            {sortedItems.sensitive.length} items
          </div>
        </div>
      </div>

      {/* Current item */}
      {items.length > 0 && (
        <div className="space-y-4">
          <div 
            className={`
              p-6 rounded-xl bg-card border-2 text-center transition-all
              ${feedback?.id === items[0].id 
                ? feedback.correct 
                  ? 'border-success bg-success/5' 
                  : 'border-destructive bg-destructive/5'
                : 'border-border'
              }
            `}
          >
            <p className="text-lg font-medium text-foreground">
              {items[0].text}
            </p>
            {feedback?.id === items[0].id && (
              <p className="text-sm mt-2 animate-fade-in">
                {feedback.correct ? (
                  <span className="text-success">✓ Correct!</span>
                ) : (
                  <span className="text-destructive">✗ Niet helemaal...</span>
                )}
              </p>
            )}
          </div>

          {!feedback && (
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSort(items[0], 'safe')}
                className="rounded-xl py-6 border-success/50 hover:bg-success/10 hover:border-success"
              >
                Mag gedeeld
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSort(items[0], 'sensitive')}
                className="rounded-xl py-6 border-warning/50 hover:bg-warning/10 hover:border-warning"
              >
                Gevoelig
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Nog {items.length} over
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={initializeGame}
          className="rounded-full"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Opnieuw
        </Button>
      </div>
    </div>
  );
};

export default SortingMinigame;
