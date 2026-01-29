import { useState } from 'react';

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
  { id: '4', text: "Je hobby's", isSensitive: false },
  { id: '5', text: 'Je wachtwoord', isSensitive: true },
  { id: '6', text: 'Je lievelingsfilm', isSensitive: false },
  { id: '7', text: 'Je bankgegevens', isSensitive: true },
  { id: '8', text: 'Je geboortedatum', isSensitive: true },
];

function getInitialItems() {
  return [...allDataItems].sort(() => Math.random() - 0.5).slice(0, 6);
}

function SortingMinigame({ onComplete }: SortingMinigameProps) {
  const [items, setItems] = useState<DataItem[]>(getInitialItems);
  const [feedback, setFeedback] = useState<{ id: string; correct: boolean } | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const handleSort = (item: DataItem, category: 'safe' | 'sensitive') => {
    const isCorrect = (category === 'sensitive' && item.isSensitive) || 
                      (category === 'safe' && !item.isSensitive);

    setFeedback({ id: item.id, correct: isCorrect });
    
    setTimeout(() => {
      setItems(items.filter(i => i.id !== item.id));
      setScore(prev => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1
      }));
      setFeedback(null);

      if (items.length === 1) {
        setIsComplete(true);
        setTimeout(() => {
          onComplete();
        }, 1500);
      }
    }, 800);
  };

  if (isComplete) {
    const percentage = Math.round((score.correct / score.total) * 100);
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">
          {percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '💪'}
        </div>
        <h3 className="text-2xl font-bold text-primary mb-2">Sorteer Spel Voltooid!</h3>
        <p className="text-muted-foreground mb-4">
          Je hebt {score.correct} van de {score.total} items correct gesorteerd!
        </p>
        <div className="inline-block px-6 py-2 bg-primary/10 text-primary rounded-full font-semibold border border-primary/30">
          Score: {percentage}% ✓
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground text-center">
          Sorteer de gegevens in de juiste categorie
        </p>
        <div className="flex justify-center gap-4 mt-2">
          <span className="text-xs px-3 py-1 bg-success/10 text-success rounded-full border border-success/30">
            ✓ {score.correct} correct
          </span>
          <span className="text-xs px-3 py-1 bg-muted text-foreground rounded-full border border-border">
            {items.length} over
          </span>
        </div>
      </div>

      {items.length > 0 && (
        <div className="mb-6">
          <div className="bg-card border-2 border-border rounded-lg p-4 mb-4">
            <p className="text-center font-semibold text-lg">
              {items[0].text}
            </p>
          </div>

          {feedback && (
            <div className={`p-3 rounded-lg mb-4 text-center font-semibold ${
              feedback.correct
                ? 'bg-success/10 text-success border border-success/30'
                : 'bg-destructive/10 text-destructive border border-destructive/30'
            }`}>
              {feedback.correct ? '✓ Correct!' : '✗ Onjuist'}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSort(items[0], 'safe')}
              disabled={feedback !== null}
              className="p-4 border-2 border-success/40 rounded-lg hover:bg-success/10 transition-colors disabled:opacity-50"
            >
              <div className="text-3xl mb-2">✓</div>
              <div className="font-semibold text-success">Niet Gevoelig</div>
              <div className="text-xs text-muted-foreground mt-1">
                Mag gedeeld worden
              </div>
            </button>

            <button
              onClick={() => handleSort(items[0], 'sensitive')}
              disabled={feedback !== null}
              className="p-4 border-2 border-destructive/40 rounded-lg hover:bg-destructive/10 transition-colors disabled:opacity-50"
            >
              <div className="text-3xl mb-2">🔒</div>
              <div className="font-semibold text-destructive">Gevoelig</div>
              <div className="text-xs text-muted-foreground mt-1">
                Moet beschermd worden
              </div>
            </button>
          </div>
        </div>
      )}

      <div className="text-center text-xs text-muted-foreground mt-4">
        💡 Tip: Persoonsgegevens zoals BSN, adres en bankgegevens zijn gevoelig
      </div>
    </div>
  );
}

export default SortingMinigame;
