import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowRight } from 'lucide-react';

interface QuizMinigameProps {
  onComplete: () => void;
}

const privacyQuestions = [
  {
    question: "Wat is een veilig wachtwoord?",
    options: [
      { text: "123456", correct: false },
      { text: "MijnNaam2024!", correct: false },
      { text: "K@tje#Boom$42!Regen", correct: true },
      { text: "password", correct: false },
    ],
    explanation: "Een sterk wachtwoord bevat letters, cijfers en speciale tekens, en is niet te raden."
  },
  {
    question: "Wanneer deel je persoonlijke gegevens?",
    options: [
      { text: "Altijd als iemand erom vraagt", correct: false },
      { text: "Alleen als het noodzakelijk en veilig is", correct: true },
      { text: "Nooit, onder geen enkele omstandigheid", correct: false },
      { text: "Als het gratis producten oplevert", correct: false },
    ],
    explanation: "Deel alleen gegevens wanneer het echt nodig is en je de ontvanger vertrouwt."
  },
  {
    question: "Wat doe je met een verdachte e-mail?",
    options: [
      { text: "Op alle links klikken om te controleren", correct: false },
      { text: "Beantwoorden met je gegevens", correct: false },
      { text: "Negeren of verwijderen", correct: true },
      { text: "Doorsturen naar vrienden", correct: false },
    ],
    explanation: "Verdachte e-mails kun je het beste negeren of verwijderen. Klik nooit op onbekende links."
  },
];

const QuizMinigame: React.FC<QuizMinigameProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const question = privacyQuestions[currentQuestion];

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (question.options[index].correct) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < privacyQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsComplete(true);
    }
  };

  if (isComplete) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="text-5xl mb-4">
          {correctAnswers === privacyQuestions.length ? '🏆' : '👍'}
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Quiz voltooid!
        </h3>
        <p className="text-muted-foreground mb-6">
          Je had {correctAnswers} van de {privacyQuestions.length} vragen goed!
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
      {/* Progress */}
      <div className="flex items-center gap-2">
        {privacyQuestions.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              idx < currentQuestion
                ? 'bg-success'
                : idx === currentQuestion
                ? 'bg-primary'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <div>
        <span className="text-xs text-muted-foreground uppercase tracking-wide">
          Vraag {currentQuestion + 1} van {privacyQuestions.length}
        </span>
        <h3 className="text-lg font-medium text-foreground mt-1">
          {question.question}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === idx;
          const isCorrect = option.correct;
          
          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={showResult}
              className={`
                w-full p-4 rounded-xl text-left transition-all
                ${!showResult 
                  ? 'bg-muted hover:bg-primary/10 hover:ring-2 hover:ring-primary/20' 
                  : ''
                }
                ${showResult && isCorrect 
                  ? 'bg-success/10 ring-2 ring-success' 
                  : ''
                }
                ${showResult && isSelected && !isCorrect 
                  ? 'bg-destructive/10 ring-2 ring-destructive' 
                  : ''
                }
                disabled:cursor-default
              `}
            >
              <div className="flex items-center justify-between">
                <span className="text-foreground">{option.text}</span>
                {showResult && isCorrect && (
                  <Check className="w-5 h-5 text-success" />
                )}
                {showResult && isSelected && !isCorrect && (
                  <X className="w-5 h-5 text-destructive" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showResult && (
        <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 animate-fade-in">
          <p className="text-sm text-foreground">
            💡 {question.explanation}
          </p>
        </div>
      )}

      {/* Next button */}
      {showResult && (
        <div className="flex justify-end">
          <Button onClick={handleNext} className="rounded-full">
            {currentQuestion < privacyQuestions.length - 1 ? (
              <>
                Volgende vraag
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Afronden
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizMinigame;
