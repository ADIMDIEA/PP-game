export interface User {
  user_id: number;
  username: string;
  email: string;
}

export interface Game {
  game_id: number;
  title: string;
}

export interface GameSession {
  session_id: number;
  user_id: number;
  game_id: number;
  start_time: Date;
  end_time?: Date;
}

export interface Message {
  message_id: number;
  content: string;
  message_type: 'incoming' | 'outgoing';
  minigame_id: number;
}

export interface Minigame {
  minigame_id: number;
  name: string;
  game_id: number;
}

export interface Decision {
  decision_id: number;
  approved: boolean;
  session_id: number;
  message_id: number;
}