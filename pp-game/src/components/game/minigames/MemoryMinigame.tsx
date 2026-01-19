import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, RotateCcw } from 'lucide-react';

interface MemoryMinigameProps {
  onComplete: () => void;
}

const icons = ['🔒', '📧', '🛡️', '👤', '🔑', '📱'];

const MemoryMinigame: React.FC<MemoryMinigameProps> = ({ onComplete }) => {
  const [cards, setCards] = useState<{ id: number; icon: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffledIcons = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({
        id: index,
        icon,
        flipped: false,
        matched: false,
      }));
    setCards(shuffledIcons);
    setFlippedCards([]);
    setMoves(0);
    setIsComplete(false);
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return;
    if (cards[id].matched || cards[id].flipped) return;

    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].icon === cards[second].icon) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].matched = true;
          matchedCards[second].matched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          
          // Check if all matched
          if (matchedCards.every(card => card.matched)) {
            setIsComplete(true);
          }
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].flipped = false;
          resetCards[second].flipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  if (isComplete) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Geweldig gedaan!
        </h3>
        <p className="text-muted-foreground mb-6">
          Je hebt het in {moves} zetten gehaald!
        </p>
        <Button onClick={onComplete} className="rounded-full">
          <Check className="w-4 h-4 mr-2" />
          Doorgaan met spelen
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Vind alle privacy-paren!
        </span>
        <div className="flex items-center gap-4">
          <span className="text-foreground font-medium">
            Zetten: {moves}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={initializeGame}
            className="rounded-full"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.matched || card.flipped}
            className={`
              aspect-square rounded-xl text-2xl font-bold transition-all duration-300
              ${card.flipped || card.matched
                ? 'bg-primary/10 text-foreground scale-100'
                : 'bg-muted hover:bg-muted/80 text-transparent hover:scale-105'
              }
              ${card.matched ? 'ring-2 ring-success' : ''}
              disabled:cursor-default
            `}
          >
            {card.flipped || card.matched ? card.icon : '?'}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MemoryMinigame;
