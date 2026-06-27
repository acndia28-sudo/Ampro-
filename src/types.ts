export interface Team {
  name: string;
  logo: string;
  code: string;
}

export interface MatchStats {
  possession: [number, number]; // [home, away]
  shots: [number, number];
  shotsOnTarget: [number, number];
  corners: [number, number];
  fouls: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellow' | 'red' | 'substitution';
  team: 'home' | 'away';
  player: string;
  detail?: string;
}

export interface Match {
  id: string;
  league: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  minute: number;
  status: 'LIVE' | 'FT' | 'HT' | 'UPCOMING';
  events: MatchEvent[];
  stats: MatchStats;
  referee: string;
  stadium: string;
}

export interface TableRow {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gd: number;
  points: number;
}

export interface Transfer {
  id: string;
  player: string;
  position: string;
  fromClub: string;
  toClub: string;
  fee: string;
  status: 'Confirmed' | 'Rumor' | 'Developing';
  source: string;
  date: string;
  details?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  time: string;
  category: 'Match Report' | 'Transfer' | 'Injury' | 'Tactics' | 'General';
  team?: string;
  image?: string;
}

export interface NotificationSettings {
  goals: boolean;
  cards: boolean;
  fullTime: boolean;
  transfers: boolean;
  favoriteTeams: string[];
  sound: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
