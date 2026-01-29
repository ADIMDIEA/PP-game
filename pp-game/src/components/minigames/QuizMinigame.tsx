import { useState } from 'react';

interface QuizMinigameProps {
  onComplete: () => void;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const questions: Question[] = [
  {
    question: 'Wat betekent GDPR?',
    options: [
      'General Data Protection Regulation',
      'Global Data Privacy Rules',
      'Government Data Protection Rights',
      'General Digital Privacy Regulation'
    ],
    correctAnswer: 0,
    explanation: 'GDPR staat voor General Data Protection Regulation, de Europese privacywetgeving.'
  },
  {
    question: 'Welke van deze gegevens is GEEN persoonsgegeven?',
    options: [
      'E-mailadres',
      'Telefoonnummer',
      'Weerbericht',
      'Geboortedatum'
    ],
    correctAnswer: 2,
    explanation: 'Een weerbericht is geen persoonsgegeven omdat het niet gekoppeld is aan een persoon.'
  },
  {
    question: 'Wat is een BSN-nummer?',
    options: [
      'Bank Service Nummer',
      'Burgerservicenummer',
      'Business Security Number',
      'Basic System Number'
    ],
    correctAnswer: 1,
    explanation: 'BSN staat voor Burgerservicenummer, een uniek identificatienummer voor Nederlandse burgers.'
  }
];

function QuizMinigame({ onComplete }: QuizMinigameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const question = questions[currentQuestion];

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    if (answerIndex === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsComplete(true);
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };

  if (isComplete) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🎓</div>
        <h3 className="text-2xl font-bold text-primary mb-2">Quiz Voltooid!</h3>
        <p className="text-muted-foreground mb-4">
          Je hebt {score} van de {questions.length} vragen goed beantwoord!
        </p>
        <div className="inline-block px-6 py-2 bg-primary/10 text-primary rounded-full font-semibold border border-primary/30">
          Score: {score}/{questions.length} ✓
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            Vraag {currentQuestion + 1} van {questions.length}
          </span>
          <span className="text-sm font-semibold text-primary">
            Score: {score}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
              className={`
                w-full text-left p-3 rounded-lg border-2 transition-all
                ${selectedAnswer === null
                  ? 'border-border hover:border-primary/40 hover:bg-primary/10'
                  : selectedAnswer === index
                    ? index === question.correctAnswer
                      ? 'border-success/60 bg-success/10'
                      : 'border-destructive/60 bg-destructive/10'
                    : index === question.correctAnswer
                      ? 'border-success/60 bg-success/10'
                      : 'border-border bg-muted/40'
                }
              `}
            >
              <span className="font-medium">{option}</span>
              {selectedAnswer !== null && index === question.correctAnswer && (
                <span className="ml-2 text-success">✓</span>
              )}
              {selectedAnswer === index && index !== question.correctAnswer && (
                <span className="ml-2 text-destructive">✗</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {showExplanation && (
        <div className={`p-4 rounded-lg mb-4 ${
          selectedAnswer === question.correctAnswer
            ? 'bg-success/10 border border-success/30'
            : 'bg-warning/10 border border-warning/30'
        }`}>
          <p className="text-sm text-foreground">
            <strong>💡 {selectedAnswer === question.correctAnswer ? 'Correct!' : 'Helaas!'}</strong>
            <br />
            {question.explanation}
          </p>
        </div>
      )}

      {showExplanation && (
        <button
          onClick={handleNext}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg font-semibold transition-colors"
        >
          {currentQuestion < questions.length - 1 ? 'Volgende Vraag →' : 'Afronden'}
        </button>
      )}
    </div>
  );
};

export default QuizMinigame;
