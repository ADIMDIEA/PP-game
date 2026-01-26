import { useEffect, useState } from 'react'
import './App.css'

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

function App() {
  
  const [screen, setScreen] = useState("start"); // start | email | minigame | results
  const [emails, setEmails] = useState<Email[]>([]);
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);

  // Mock data
  useEffect(() => {
    setEmails([
      {
        id: 1,
        subject: "Vraag: Adresgegevens buurtfeest?",
        content:
          "Hoi Jan, kun je me alle adressen van de Dorpsstraat mailen? Ik ga het buurtfeest organiseren en moet iedereen uitnodigen. Alvast bedankt!",
        correctDecision: "reject",
        sensitiveData: ["adressen", "Dorpsstraat"],
        explanation: "Adresgegevens zijn persoonsgegevens die niet zomaar via email verspreid mogen worden.",
      },
      {
        id: 2,
        subject: "Info: Vergunning aanvraag procedure",
        content:
          "De procedure voor een bouwvergunning is gewijzigd. Je moet voortaan eerst naar het infoloket gaan met je id-bewijs en persoonlijke voorkeursdatum. Meer info op onze website.",
        correctDecision: "approve",
        sensitiveData: [],
        explanation: "Dit is publieke informatie over procedures, geen persoonsgegevens.",
      },
      {
        id: 3,
        subject: "Vraag: Schuldenlijst gemeente",
        content:
          "Hoi, kun je me een lijstje geven van alle burgers die belastingschuld hebben? We willen die aanschrijven. Namen en bedragen graag.",
        correctDecision: "reject",
        sensitiveData: ["belastingschuld", "Namen", "bedragen"],
        explanation: "Financiële gegevens van burgers zijn vertrouwelijk en mogen niet zomaar verspreid worden.",
      },
      {
        id: 4,
        subject: "Notitie: Gemeentelijke agenda volgende week",
        content:
          "Volgende week dinsdag is er de raadsvergadering om 19:30 uur. Het onderwerp is de begroting 2026. Iedereen mag hieraan deelnemen.",
        correctDecision: "approve",
        sensitiveData: [],
        explanation: "Dit is openbare informatie over openbare vergaderingen.",
      },
      {
        id: 5,
        subject: "Vraag: Medische dossiers voor onderzoek",
        content:
          "Hoi, voor ons onderzoek naar gezondheidsrisico's hebben we de medische dossiers nodig van alle inwonersboven de 65 jaar. Kunnen die gescand worden?",
        correctDecision: "reject",
        sensitiveData: ["medische dossiers", "gezondheidsrisico's", "inwonersboven de 65 jaar"],
        explanation: "Medische gegevens zijn zeer gevoelige persoonsgegevens en vallen onder GDPR.",
      },
      {
        id: 6,
        subject: "Info: Regelwijziging parkeervergunning",
        content:
          "De tarieven voor parkeervergunningen zijn verhoogd naar €50 per jaar. U kunt uw vergunning aanvragen bij de receptie of online via onze website.",
        correctDecision: "approve",
        sensitiveData: [],
        explanation: "Dit is officieel gemeentebeleid en mag gecommuniceerd worden.",
      },
      {
        id: 7,
        subject: "Vraag: BSN nummers medewerkers",
        content:
          "Hoi, voor de personeelsadministratie heb ik een xlsx met alle BSN nummers van onze medewerkers nodig. Kunnen jullie die geven?",
        correctDecision: "reject",
        sensitiveData: ["BSN nummers", "personeelsadministratie"],
        explanation: "BSN nummers zijn zeer gevoelige identificatiegegevens.",
      },
      {
        id: 8,
        subject: "Info: Gesloten ingang gemeentehuis",
        content:
          "Dit weekend is de zuidingang van het gemeentehuis gesloten voor onderhoud. Gebruik alstublieft de hoofdingang aan de Marktplein.",
        correctDecision: "approve",
        sensitiveData: [],
        explanation: "Dit is operationele informatie zonder gevoelige gegevens.",
      },
    ]);
  }, []);

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

  const addHighlight = (phrase: string) => {
    if (!highlights.includes(phrase)) {
      setHighlights([...highlights, phrase]);
    }
  };

  const submitDecision = (decision: string) => {
    let points = 0;

    if (decision === currentEmail.correctDecision) points += 10;

    currentEmail.sensitiveData.forEach((sensitive: string) => {
      if (highlights.includes(sensitive)) points += 5;
    });

    const newScore = score + points;
    setScore(newScore);
    setHighlights([]);

    const nextIndex = currentEmailIndex + 1;
    if (nextIndex >= emails.length) {
      setScreen("results");
      saveScore(newScore);
    } else {
      setCurrentEmailIndex(nextIndex);
      setScreen("email");
    }
  };

  const saveScore = async (finalScore: number) => {
    try {
      await fetch("/api/save-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: finalScore }),
      });
    } catch {}
  };

  const compareScores = () => {
    if (previousScore === null) return "Eerste score!";
    if (score > previousScore) return "Verbeterd!";
    if (score < previousScore) return "Lager dan vorige keer";
    return "Gelijk gebleven";
  };

  const finishMinigame = () => {
    setScreen("email");
  };

  // ---------------- UI ----------------

  if (screen === "start") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-6">
        <h1 className="text-4xl font-bold">Privacy Quest</h1>
        <button
          onClick={startGame}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl"
        >
          Start Game
        </button>
      </div>
    );
  }

  if (screen === "email" && currentEmail) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 text-sm text-gray-400">
            Email {currentEmailIndex + 1} van {emails.length}
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-bold mb-4">Van: Gemeentewerker</h2>
            <p className="text-gray-300 mb-2">Onderwerp: {currentEmail.subject}</p>
            
            <div className="border-t border-gray-600 pt-4 mt-4">
              <p className="mb-6 leading-relaxed">
                {currentEmail.content.split(" ").map((word: string, i: number) => (
                  <span
                    key={i}
                    onClick={() => addHighlight(word.replace(/[.,!?]/g, ""))}
                    className={`cursor-pointer inline transition-colors ${
                      highlights.includes(word.replace(/[.,!?]/g, ""))
                        ? "bg-red-500 text-white font-bold"
                        : "hover:bg-slate-700"
                    }`}
                  >
                    {word}{" "}
                  </span>
                ))}
              </p>
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg mb-6">
            <p className="text-sm text-yellow-300 mb-2">💡 Tip: Klik op gevoelige data om deze rood te highlighten</p>
            <p className="text-sm text-gray-300">
              Gevoelige data: {currentEmail.sensitiveData.join(", ")}
            </p>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => submitDecision("approve")}
              className="flex-1 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              ✓ Goedkeuren (veilig om te sturen)
            </button>
            <button
              onClick={() => submitDecision("reject")}
              className="flex-1 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              ✗ Afkeuren (bevat gevoelige data)
            </button>
          </div>

          <div className="flex justify-between text-sm">
            <p className="text-gray-400">Score: <span className="text-yellow-400 font-bold">{score}</span></p>
            <p className="text-gray-400">Gehighlighte items: {highlights.length}</p>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "minigame") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-900 text-white gap-6">
        <h2 className="text-2xl font-bold">MiniGame Tijd 🎮</h2>
        <button
          onClick={finishMinigame}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-xl"
        >
          Minigame afronden
        </button>
      </div>
    );
  }

  if (screen === "results") {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">🎉 Spel Afgerond!</h2>
          
          <div className="bg-slate-800 p-6 rounded-lg mb-6">
            <p className="text-2xl mb-4">Eindstand: <span className="text-yellow-400 font-bold">{score}</span> punten</p>
            <p className="text-lg text-gray-300">{compareScores()}</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-4">📊 Leaderboard</h3>
            <ul className="space-y-2">
              {leaderboard && leaderboard.length > 0 ? (
                leaderboard.map((player: LeaderboardPlayer, i: number) => (
                  <li key={i} className="flex justify-between text-gray-300">
                    <span>{i + 1}. {player.name}</span>
                    <span className="font-bold">{player.score} punten</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-400">Geen leaderboard beschikbaar</li>
              )}
            </ul>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            🔄 Opnieuw Spelen
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default App
