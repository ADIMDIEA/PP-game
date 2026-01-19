import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types
export interface MinigameResult {
  completed: boolean;
  skipped: boolean;
}

interface GameState {
  showMinigame: boolean;
  currentMinigameId: string | null;
}

interface GameContextType {
  state: GameState;
  triggerMinigame: (minigameId?: string) => void;
  completeMinigame: (result: MinigameResult) => void;
  skipMinigame: () => void;
}

const initialState: GameState = {
  showMinigame: false,
  currentMinigameId: null,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(initialState);

  const triggerMinigame = useCallback((minigameId?: string) => {
    const availableMinigames = ['memory', 'quiz', 'sorting'];
    const selectedGame = minigameId || availableMinigames[Math.floor(Math.random() * availableMinigames.length)];
    
    setState(prev => ({
      ...prev,
      showMinigame: true,
      currentMinigameId: selectedGame,
    }));
  }, []);

  const completeMinigame = useCallback((result: MinigameResult) => {
    setState(prev => ({
      ...prev,
      showMinigame: false,
      currentMinigameId: null,
    }));
  }, []);

  const skipMinigame = useCallback(() => {
    setState(prev => ({
      ...prev,
      showMinigame: false,
      currentMinigameId: null,
    }));
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        triggerMinigame,
        completeMinigame,
        skipMinigame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
