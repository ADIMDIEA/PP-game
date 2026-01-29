import { useState } from 'react'
import MinigameModal from './components/minigames/MinigameModal'

interface Email {
  id: number;
  subject: string;
  content: string;
  correctDecision: string;
  sensitiveData: string[];
  explanation: string;
}

interface LeaderboardPlayer {
  name: string;
  score: number;
}

const MOCK_EMAILS: Email[] = [
      {
        id: 1,
        subject: "Vraag: Lijst met BSN voor aanvragers",
        content:
          "Hoi, kun je mij de BSN lijst sturen van alle aanvragers? Graag ook per persoon het adres en de geboortedatum. Dan kunnen we dit snel verwerken.",
        correctDecision: "reject",
        sensitiveData: ["BSN", "adres", "geboortedatum"],
        explanation: "BSN, adres en geboortedatum zijn persoonsgegevens en mogen niet zomaar via e-mail gedeeld worden.",
      },
      {
        id: 2,
        subject: "Info: Nieuwe procedure bouwvergunning",
        content:
          "De procedure voor een bouwvergunning is gewijzigd. Je moet voortaan eerst naar het infoloket. Meer info staat op onze website.",
        correctDecision: "approve",
        sensitiveData: [],
        explanation: "Dit is algemene, publieke informatie en bevat geen persoonsgegevens.",
      },
      {
        id: 3,
        subject: "Vraag: Overzicht openstaande schulden",
        content:
          "Hoi, kun je een overzicht sturen van inwoners met een openstaande belastingschuld? Graag met naam en bedrag zodat we ze kunnen aanschrijven.",
        correctDecision: "reject",
        sensitiveData: ["naam", "bedrag", "belastingschuld"],
        explanation: "Financiële gegevens (zoals schuld en bedragen) zijn vertrouwelijk en mogen niet zomaar gedeeld worden.",
      },
      {
        id: 4,
        subject: "Notitie: Raadsvergadering volgende week",
        content:
          "Volgende week dinsdag is er de raadsvergadering om 19:30 uur. Het onderwerp is de begroting 2026. Iedereen mag hieraan deelnemen.",
        correctDecision: "approve",
        sensitiveData: [],
        explanation: "Dit is openbare informatie over openbare vergaderingen.",
      },
      {
        id: 5,
        subject: "Vraag: Medisch dossier voor onderzoek",
        content:
          "Hoi, voor ons onderzoek hebben we een medisch dossier nodig van inwoners boven de 65. Kun je het dossier scannen en mailen?",
        correctDecision: "reject",
        sensitiveData: ["medisch", "dossier"],
        explanation: "Medische informatie is zeer gevoelige persoonsgegevens en mag niet via e-mail verspreid worden.",
      },
      {
        id: 6,
        subject: "Info: Tarieven parkeervergunning",
        content:
          "De tarieven voor parkeervergunningen zijn verhoogd naar €50 per jaar. U kunt uw vergunning aanvragen bij de receptie of online via onze website.",
        correctDecision: "approve",
        sensitiveData: [],
        explanation: "Dit is officieel gemeentebeleid en mag gecommuniceerd worden.",
      },
      {
        id: 7,
        subject: "Vraag: Excel met persoonsgegevens medewerkers",
        content:
          "Hoi, kun je mij een Excel sturen met alle medewerkers inclusief BSN en adres? Ik wil dit in één keer controleren.",
        correctDecision: "reject",
        sensitiveData: ["BSN", "adres"],
        explanation: "BSN en adres zijn (zeer) gevoelige persoonsgegevens en mogen niet zomaar gedeeld worden.",
      },
      {
        id: 8,
        subject: "Info: Ingang gemeentehuis gesloten",
        content:
          "Dit weekend is de zuidingang van het gemeentehuis gesloten voor onderhoud. Gebruik alstublieft de hoofdingang aan de Marktplein.",
        correctDecision: "approve",
        sensitiveData: [],
        explanation: "Dit is operationele informatie zonder gevoelige gegevens.",
      },
      {
        id: 9,
        subject: "Vraag: Kenteken voor parkeercontrole",
        content:
          "Hoi, kun je de lijst sturen met kenteken en adres van alle bewoners in zone A? Dan kan de parkeercontrole dit vergelijken.",
        correctDecision: "reject",
        sensitiveData: ["kenteken", "adres"],
        explanation: "Kenteken en adres zijn persoonsgegevens (of herleidbaar) en mogen niet zomaar gedeeld worden.",
      },
      {
        id: 10,
        subject: "Vraag: Stuur even de IBAN voor terugbetaling",
        content:
          "Hoi, kun je de IBAN van mevrouw Jansen mailen? Dan kan ik de terugbetaling direct uitvoeren.",
        correctDecision: "reject",
        sensitiveData: ["IBAN"],
        explanation: "Bankgegevens (IBAN) zijn gevoelige persoonsgegevens en horen niet via e-mail rondgestuurd te worden.",
      },
      {
        id: 11,
        subject: "Info: Afvalinzameling schema",
        content:
          "Let op: het afval wordt deze week op vrijdag opgehaald in plaats van donderdag. Dit geldt voor de hele wijk.",
        correctDecision: "approve",
        sensitiveData: [],
        explanation: "Dit is algemene wijkinformatie en bevat geen persoonsgegevens.",
      },
      {
        id: 12,
        subject: "Vraag: Telefoonnummer voor contactlijst",
        content:
          "Hoi, kun je het telefoonnummer en emailadres sturen van alle mensen die een klacht hebben ingediend? Dan kan ik ze bellen.",
        correctDecision: "reject",
        sensitiveData: ["telefoonnummer", "emailadres"],
        explanation: "Telefoonnummer en e-mailadres zijn persoonsgegevens en mogen niet zomaar gedeeld worden.",
      },
    ];

function App() {
  
  const [screen, setScreen] = useState("start"); // start | email | results | lose
  const [emails] = useState<Email[]>(MOCK_EMAILS);
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);

  // Minigame state
  const [showMinigame, setShowMinigame] = useState(false);
  const [secondChanceGranted, setSecondChanceGranted] = useState(false);
  const [wrongAnswerAttempt, setWrongAnswerAttempt] = useState(false);
  const [minigamePlays, setMinigamePlays] = useState(0);

  const MAX_MINIGAME_PLAYS = 2;

  // Fake leaderboard ophalen
  const startGame = async () => {
    try {
      const lb = await fetch("/api/leaderboard").then(r => r.json());
      setLeaderboard(lb);
    } catch {
      setLeaderboard([]);
    }

    try {
      const prev = await fetch("/api/my-score").then(r => r.json());
      setPreviousScore(prev.score);
    } catch {
      setPreviousScore(null);
    }

    setScreen("email");
  };

  const currentEmail = emails[currentEmailIndex];

  const toggleHighlight = (phrase: string) => {
    if (highlights.includes(phrase)) {
      // Verwijder highlight als deze al bestaat
      setHighlights(highlights.filter(h => h !== phrase));
    } else {
      // Voeg highlight toe als deze nog niet bestaat
      setHighlights([...highlights, phrase]);
    }
  };

  const submitDecision = (decision: string) => {
    // Check if this is a wrong answer
    const isCorrect = decision === currentEmail.correctDecision;

    // If the player already played the minigame twice, a new wrong answer ends the game
    if (!isCorrect && !wrongAnswerAttempt && minigamePlays >= MAX_MINIGAME_PLAYS) {
      setScreen("lose");
      return;
    }
    
    // If wrong answer and no second chance granted yet, trigger minigame
    if (!isCorrect && !secondChanceGranted && !wrongAnswerAttempt) {
      setWrongAnswerAttempt(true);
      setMinigamePlays(prev => prev + 1);
      setShowMinigame(true);
      return; // Don't process the answer yet
    }

    // Process the answer (either correct answer, or after minigame resolution)
    let points = 0;

    if (decision === currentEmail.correctDecision) points += 10;

    currentEmail.sensitiveData.forEach((sensitive: string) => {
      if (highlights.includes(sensitive)) points += 5;
    });

    const newScore = score + points;
    setScore(newScore);
    setHighlights([]);

    // Reset minigame state for next question
    setSecondChanceGranted(false);
    setWrongAnswerAttempt(false);

    const nextIndex = currentEmailIndex + 1;
    if (nextIndex >= emails.length) {
      setScreen("results");
      saveScore(newScore);
    } else {
      setCurrentEmailIndex(nextIndex);
      setScreen("email");
    }
  };

  const handleMinigameSuccess = () => {
    setShowMinigame(false);
    setSecondChanceGranted(true);
    setWrongAnswerAttempt(false);
    // User stays on the same question for a retry
  };

  const handleMinigameFail = () => {
    setShowMinigame(false);
    setHighlights([]);
    setSecondChanceGranted(false);
    setWrongAnswerAttempt(false);
    setScreen("lose");
  };

  const saveScore = async (finalScore: number) => {
    try {
      await fetch("/api/save-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: finalScore }),
      });
    } catch {
      // Silently fail - score saving is optional
    }
  };

  const compareScores = () => {
    if (previousScore === null) return "Eerste score!";
    if (score > previousScore) return "Verbeterd!";
    if (score < previousScore) return "Lager dan vorige keer";
    return "Gelijk gebleven";
  };

  // ---------------- UI ----------------

  if (screen === "start") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted gap-8 px-4">
        <div className="text-center">
          <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">🔒</span>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-3">Email verzending</h1>
          <p className="text-lg text-muted-foreground mb-8">Leer over privacy door e-mails te beoordelen</p>
        </div>
        <button
          onClick={startGame}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          🚀 Start Game
        </button>
      </div>
    );
  }

  if (screen === "email" && currentEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <span className="text-sm text-muted-foreground font-medium">
              Email {currentEmailIndex + 1} van {emails.length}
            </span>
            <div className="score-badge">
              <span className="text-primary">⭐</span>
              <span>{score} punten</span>
            </div>
          </div>
          
          {secondChanceGranted && (
            <div className="mb-6 p-4 bg-success/10 border-2 border-success rounded-xl text-success-foreground animate-slide-up">
              <span className="font-bold">🎉 Tweede kans!</span> Je hebt de minigame voltooid. Probeer het nog een keer!
            </div>
          )}
          
          <div className="game-card mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl">📧</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Van: Gemeentewerker</h2>
                <p className="text-sm text-muted-foreground">Onderwerp: {currentEmail.subject}</p>
              </div>
            </div>
            
            <div className="border-t border-border pt-4 mt-4">
              <p className="mb-6 leading-relaxed text-foreground">
                {currentEmail.content.split(" ").map((word: string, i: number) => (
                  <span
                    key={i}
                    onClick={() => toggleHighlight(word.replace(/[.,!?]/g, ""))}
                    className={`cursor-pointer inline transition-all duration-200 rounded px-1 ${
                      highlights.includes(word.replace(/[.,!?]/g, ""))
                        ? "bg-destructive text-destructive-foreground font-bold shadow-sm"
                        : "hover:bg-muted"
                    }`}
                  >
                    {word}{" "}
                  </span>
                ))}
              </p>
            </div>
          </div>

          <div className="game-card mb-6 bg-warning/5 border-warning/20">
            <p className="text-sm text-warning-foreground mb-2 font-semibold">💡 Tip: Klik op woorden om gevoelige data te markeren (klik opnieuw om te verwijderen)</p>
            <p className="text-sm text-muted-foreground">
              Gevoelige data in deze email: {currentEmail.sensitiveData.join(", ")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Je hebt {highlights.length} {highlights.length === 1 ? 'woord' : 'woorden'} gemarkeerd
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => submitDecision("approve")}
              className="bg-success hover:bg-success/90 text-success-foreground px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <span className="text-xl">✓</span>
              <span>Goedkeuren</span>
            </button>
            <button
              onClick={() => submitDecision("reject")}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <span className="text-xl">✗</span>
              <span>Afkeuren</span>
            </button>
          </div>
        </div>

        {/* Minigame Modal */}
        <MinigameModal 
          key={currentEmailIndex}
          isOpen={showMinigame}
          onSuccess={handleMinigameSuccess}
          onFail={handleMinigameFail}
        />
      </div>
    );
  }

  if (screen === "results") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4 animate-confetti">🎉</div>
            <h2 className="text-5xl font-bold text-foreground mb-3">Spel Afgerond!</h2>
            <p className="text-lg text-muted-foreground">Geweldig gedaan met het beschermen van privacy!</p>
          </div>
          
          <div className="game-card mb-6 text-center">
            <p className="text-lg text-muted-foreground mb-2">Eindstand</p>
            <div className="score-badge text-3xl mb-3">
              <span>⭐</span>
              <span className="score-positive">{score}</span>
              <span className="text-muted-foreground">punten</span>
            </div>
            <p className="text-lg font-semibold text-primary">{compareScores()}</p>
          </div>

          <div className="game-card mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">📊</span>
              <h3 className="text-2xl font-bold text-foreground">Leaderboard</h3>
            </div>
            <ul className="space-y-3">
              {leaderboard && leaderboard.length > 0 ? (
                leaderboard.map((player: LeaderboardPlayer, i: number) => (
                  <li key={i} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-foreground font-medium">
                      <span className="text-primary font-bold mr-2">{i + 1}.</span>
                      {player.name}
                    </span>
                    <span className="score-badge text-sm">{player.score} punten</span>
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground text-center py-4">Geen leaderboard beschikbaar</li>
              )}
            </ul>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            <span className="text-2xl">🔄</span>
            <span>Opnieuw Spelen</span>
          </button>
        </div>
      </div>
    );
  }

  if (screen === "lose") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">😢</div>
            <h2 className="text-5xl font-bold text-foreground mb-3">Game Over</h2>
            <p className="text-lg text-muted-foreground">
              Je hebt de minigame verloren of je hebt je 2 minigame-kansen al gebruikt.
            </p>
          </div>

          <div className="game-card mb-6 text-center">
            <p className="text-lg text-muted-foreground mb-2">Jouw score</p>
            <div className="score-badge text-3xl mb-3">
              <span>⭐</span>
              <span className="score-negative">{score}</span>
              <span className="text-muted-foreground">punten</span>
            </div>
            <p className="text-sm text-muted-foreground">Minigames gespeeld: {minigamePlays}/{MAX_MINIGAME_PLAYS}</p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            <span className="text-2xl">🔄</span>
            <span>Opnieuw Proberen</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default App
