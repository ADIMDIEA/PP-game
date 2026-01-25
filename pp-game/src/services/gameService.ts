import { User, Game, GameSession, Message, Minigame, Decision } from '@/types/database';

// Mock Data Store (simulating DB tables)
const MOCK_USERS: User[] = [
  { user_id: 1, username: 'PlayerOne', email: 'player1@example.com' }
];

const MOCK_GAMES: Game[] = [
  { game_id: 1, title: 'Privacy Quest' }
];

const MOCK_MINIGAMES: Minigame[] = [
  { minigame_id: 1, name: 'Sorting', game_id: 1 },
  { minigame_id: 2, name: 'Quiz', game_id: 1 },
  { minigame_id: 3, name: 'Memory', game_id: 1 }
];

const MOCK_MESSAGES: Message[] = [
  // Sorting minigame messages
  { message_id: 1, content: 'Naam', message_type: 'incoming', minigame_id: 1 },
  { message_id: 2, content: 'BSN-nummer', message_type: 'incoming', minigame_id: 1 },
  { message_id: 3, content: 'Favoriete kleur', message_type: 'incoming', minigame_id: 1 },
  { message_id: 4, content: 'E-mailadres', message_type: 'incoming', minigame_id: 1 },
  { message_id: 5, content: 'Telefoonnummer', message_type: 'incoming', minigame_id: 1 },
  { message_id: 6, content: 'Geboortedatum', message_type: 'incoming', minigame_id: 1 },
  { message_id: 7, content: 'Hobby', message_type: 'incoming', minigame_id: 1 },
];

const MOCK_GAME_SESSIONS: GameSession[] = [];
const MOCK_DECISIONS: Decision[] = [];

class GameService {
  // User methods
  async getUser(userId: number): Promise<User | undefined> {
    return MOCK_USERS.find(user => user.user_id === userId);
  }

  // Game methods
  async getGame(gameId: number): Promise<Game | undefined> {
    return MOCK_GAMES.find(game => game.game_id === gameId);
  }

  // Session methods
  async createGameSession(userId: number, gameId: number): Promise<GameSession> {
    const newSession: GameSession = {
      session_id: MOCK_GAME_SESSIONS.length + 1,
      user_id: userId,
      game_id: gameId,
      start_time: new Date(),
    };
    MOCK_GAME_SESSIONS.push(newSession);
    return newSession;
  }

  async endGameSession(sessionId: number): Promise<void> {
    const session = MOCK_GAME_SESSIONS.find(s => s.session_id === sessionId);
    if (session) {
      session.end_time = new Date();
    }
  }

  // Minigame methods
  async getMinigame(minigameId: number): Promise<Minigame | undefined> {
    return MOCK_MINIGAMES.find(mg => mg.minigame_id === minigameId);
  }

  async getMinigameMessages(minigameId: number): Promise<Message[]> {
    return MOCK_MESSAGES.filter(msg => msg.minigame_id === minigameId);
  }

  // Decision methods
  async saveDecision(
    sessionId: number,
    messageId: number,
    approved: boolean,
    selectedText: string | null = null
  ): Promise<Decision> {
    const newDecision: Decision = {
      decision_id: MOCK_DECISIONS.length + 1,
      approved,
      session_id: sessionId,
      message_id: messageId,
    };
    MOCK_DECISIONS.push(newDecision);
    
    // If there's highlighted text, we'd save it to a highlights table
    // For now we're just saving the decision
    
    return newDecision;
  }

  async getSessionDecisions(sessionId: number): Promise<Decision[]> {
    return MOCK_DECISIONS.filter(d => d.session_id === sessionId);
  }

  // Score calculation
  async calculateScore(sessionId: number): Promise<number> {
    const decisions = await this.getSessionDecisions(sessionId);
    
    let score = 0;
    for (const decision of decisions) {
      const message = MOCK_MESSAGES.find(m => m.message_id === decision.message_id);
      if (!message) continue;
      
      // Example scoring logic - adjust based on your game rules
      const isSensitive = this.isSensitiveData(message.content);
      const correctDecision = (isSensitive && !decision.approved) || (!isSensitive && decision.approved);
      
      score += correctDecision ? 10 : -5;
    }
    
    return Math.max(0, score);
  }

  private isSensitiveData(content: string): boolean {
    const sensitiveKeywords = ['BSN', 'telefoonnummer', 'geboortedatum', 'e-mailadres', 'naam'];
    return sensitiveKeywords.some(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    );
  }
}

export const gameService = new GameService();
