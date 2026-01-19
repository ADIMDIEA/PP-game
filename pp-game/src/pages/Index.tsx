import { GameProvider } from '@/contexts/GameContext';
import MinigameModal from '@/components/game/MinigameModal';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Gamepad2 } from 'lucide-react';

const IndexContent = () => {
  const { triggerMinigame } = useGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center py-8 px-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Gamepad2 className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Minigame</h1>
          <p className="text-lg text-muted-foreground mb-8">Klik op de knop om te starten!</p>
        </div>
        
        <Button
          onClick={() => triggerMinigame()}
          size="lg"
          className="rounded-xl text-base font-semibold px-8 py-6"
        >
          <Gamepad2 className="w-5 h-5 mr-2" />
          Start Minigame
        </Button>
      </div>
      
      <MinigameModal />
    </div>
  );
};

const Index = () => {
  return (
    <GameProvider>
      <IndexContent />
    </GameProvider>
  );
};

export default Index;
