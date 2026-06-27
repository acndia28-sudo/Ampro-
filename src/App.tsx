import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Activity,
  Bell,
  Volume2,
  VolumeX,
  MessageSquare,
  TrendingUp,
  Newspaper,
  Zap,
  Award,
  Send,
  Sparkles,
  Check,
  ChevronRight,
  Filter,
  Users,
  Search,
  Database,
  Lock,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Match, TableRow, Transfer, NewsItem, NotificationSettings, Message, MatchEvent } from './types';

// Initial Mock Data
const INITIAL_MATCHES: Match[] = [
  {
    id: 'm1',
    league: 'Premier League',
    homeTeam: { name: 'Arsenal', logo: '🔴', code: 'ARS' },
    awayTeam: { name: 'Man City', logo: '🔵', code: 'MCI' },
    homeScore: 2,
    awayScore: 1,
    minute: 84,
    status: 'LIVE',
    referee: 'Michael Oliver',
    stadium: 'Emirates Stadium, London',
    events: [
      { minute: 24, type: 'goal', team: 'home', player: 'Bukayo Saka', detail: 'Penalty' },
      { minute: 42, type: 'yellow', team: 'away', player: 'Rodri' },
      { minute: 58, type: 'goal', team: 'away', player: 'Erling Haaland', detail: 'Assist: De Bruyne' },
      { minute: 71, type: 'goal', team: 'home', player: 'Gabriel Martinelli', detail: 'Assist: Ødegaard' },
      { minute: 79, type: 'yellow', team: 'home', player: 'William Saliba' },
    ],
    stats: {
      possession: [48, 52],
      shots: [12, 14],
      shotsOnTarget: [5, 6],
      corners: [4, 7],
      fouls: [10, 11],
      yellowCards: [1, 1],
      redCards: [0, 0]
    }
  },
  {
    id: 'm2',
    league: 'Champions League',
    homeTeam: { name: 'Real Madrid', logo: '⚪', code: 'RMA' },
    awayTeam: { name: 'Bayern Munich', logo: '🔴', code: 'FCB' },
    homeScore: 0,
    awayScore: 0,
    minute: 12,
    status: 'LIVE',
    referee: 'Szymon Marciniak',
    stadium: 'Santiago Bernabéu, Madrid',
    events: [],
    stats: {
      possession: [55, 45],
      shots: [3, 2],
      shotsOnTarget: [1, 0],
      corners: [2, 1],
      fouls: [2, 3],
      yellowCards: [0, 0],
      redCards: [0, 0]
    }
  },
  {
    id: 'm3',
    league: 'La Liga',
    homeTeam: { name: 'Barcelona', logo: '🔵', code: 'FCB' },
    awayTeam: { name: 'Atletico Madrid', logo: '🔴', code: 'ATM' },
    homeScore: 1,
    awayScore: 1,
    minute: 65,
    status: 'LIVE',
    referee: 'Jesús Gil Manzano',
    stadium: 'Montjuïc Stadium, Barcelona',
    events: [
      { minute: 31, type: 'goal', team: 'away', player: 'Antoine Griezmann' },
      { minute: 49, type: 'goal', team: 'home', player: 'Robert Lewandowski', detail: 'Assist: Pedri' },
      { minute: 55, type: 'yellow', team: 'away', player: 'Koke' },
      { minute: 61, type: 'substitution', team: 'home', player: 'Gavi' },
    ],
    stats: {
      possession: [61, 39],
      shots: [9, 7],
      shotsOnTarget: [4, 3],
      corners: [5, 3],
      fouls: [8, 12],
      yellowCards: [0, 1],
      redCards: [0, 0]
    }
  },
  {
    id: 'm4',
    league: 'Serie A',
    homeTeam: { name: 'Inter Milan', logo: '⚫', code: 'INT' },
    awayTeam: { name: 'AC Milan', logo: '🔴', code: 'ACM' },
    homeScore: 3,
    awayScore: 2,
    minute: 90,
    status: 'FT',
    referee: 'Davide Massa',
    stadium: 'San Siro, Milan',
    events: [
      { minute: 14, type: 'goal', team: 'home', player: 'Lautaro Martínez' },
      { minute: 38, type: 'goal', team: 'away', player: 'Rafael Leão' },
      { minute: 52, type: 'goal', team: 'home', player: 'Marcus Thuram' },
      { minute: 68, type: 'goal', team: 'away', player: 'Olivier Giroud' },
      { minute: 82, type: 'goal', team: 'home', player: 'Lautaro Martínez', detail: 'Penalty' },
      { minute: 88, type: 'red', team: 'away', player: 'Theo Hernandez' }
    ],
    stats: {
      possession: [49, 51],
      shots: [15, 12],
      shotsOnTarget: [8, 5],
      corners: [6, 4],
      fouls: [12, 14],
      yellowCards: [2, 3],
      redCards: [0, 1]
    }
  },
  {
    id: 'm5',
    league: 'Premier League',
    homeTeam: { name: 'Liverpool', logo: '🔴', code: 'LIV' },
    awayTeam: { name: 'Chelsea', logo: '🔵', code: 'CHE' },
    homeScore: 0,
    awayScore: 0,
    minute: 0,
    status: 'UPCOMING',
    referee: 'Anthony Taylor',
    stadium: 'Anfield, Liverpool',
    events: [],
    stats: {
      possession: [50, 50],
      shots: [0, 0],
      shotsOnTarget: [0, 0],
      corners: [0, 0],
      fouls: [0, 0],
      yellowCards: [0, 0],
      redCards: [0, 0]
    }
  }
];

const INITIAL_STANDINGS: TableRow[] = [
  { position: 1, team: 'Arsenal', played: 34, won: 25, drawn: 3, lost: 6, gd: 45, points: 78 },
  { position: 2, team: 'Man City', played: 34, won: 23, drawn: 7, lost: 4, gd: 42, points: 76 },
  { position: 3, team: 'Liverpool', played: 34, won: 22, drawn: 8, lost: 4, gd: 38, points: 74 },
  { position: 4, team: 'Aston Villa', played: 34, won: 20, drawn: 6, lost: 8, gd: 18, points: 66 },
  { position: 5, team: 'Tottenham', played: 34, won: 18, drawn: 6, lost: 10, gd: 12, points: 60 },
  { position: 6, team: 'Chelsea', played: 34, won: 16, drawn: 9, lost: 9, gd: 11, points: 57 },
  { position: 7, team: 'Newcastle', played: 34, won: 16, drawn: 8, lost: 10, gd: 14, points: 56 },
  { position: 8, team: 'Manchester United', played: 34, won: 16, drawn: 6, lost: 12, gd: -1, points: 54 }
];

const INITIAL_TRANSFERS: Transfer[] = [
  {
    id: 't1',
    player: 'Kylian Mbappé',
    position: 'Forward',
    fromClub: 'PSG',
    toClub: 'Real Madrid',
    fee: 'Free Transfer',
    status: 'Confirmed',
    source: 'Fabrizio Romano',
    date: 'Today',
    details: 'Signed a 5-year contract with signing-on bonus in excess of €100m. Presentation completed at Bernabéu.'
  },
  {
    id: 't2',
    player: 'Xavi Simons',
    position: 'Midfielder',
    fromClub: 'PSG',
    toClub: 'Bayern Munich',
    fee: '€60m',
    status: 'Developing',
    source: 'Sky Sports Germany',
    date: 'Today',
    details: 'Bayern leading the race and finalizing verbal agreement with the player. Discussions with PSG ongoing.'
  },
  {
    id: 't3',
    player: 'Victor Osimhen',
    position: 'Striker',
    fromClub: 'Napoli',
    toClub: 'Chelsea',
    fee: '€110m',
    status: 'Rumor',
    source: 'Di Marzio',
    date: 'Today',
    details: 'Chelsea representatives scheduled a new round of meetings with his agents to negotiate salary demands.'
  },
  {
    id: 't4',
    player: 'Bruno Guimarães',
    position: 'Midfielder',
    fromClub: 'Newcastle',
    toClub: 'Arsenal',
    fee: '€85m',
    status: 'Rumor',
    source: 'The Athletic',
    date: 'Yesterday',
    details: 'Arteta values the player highly. Arsenal exploring structured payments to meet financial rules.'
  }
];

const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Guardiola signals tactical overhaul ahead of title run-in',
    summary: 'Pep Guardiola suggests structural changes in midfielder spacing to counter modern low-block defenses.',
    content: 'Speaking in the press conference, Pep Guardiola noted: "Spaces are getting tighter. Teams defend with six in the back. We must adapt our inverted full-backs to play more centrally or risk static possession. Football is changing fast and if we don\'t evolve, we are dead." Sources suggest Rico Lewis and John Stones have been drilling special transition positioning all week.',
    source: 'Tactical Analysis Hub',
    time: '2 hours ago',
    category: 'Tactics',
    team: 'Man City',
    image: '⚽'
  },
  {
    id: 'n2',
    title: 'Injury Blow: Bukayo Saka major doubt for North London Derby',
    summary: 'Arsenal star winger suffered a minor hamstring tweak in the closing minutes of training.',
    content: 'Mikel Arteta faces a selection headache as Bukayo Saka is in a race against time to be fit for the crucial North London Derby. The winger sat out Wednesday\'s tactical session with medical staff monitoring his hamstring closely. "He felt a little something," Arteta confirmed. "We will test him tomorrow but we will not take unnecessary risks with his long-term health."',
    source: 'Gunners Daily',
    time: '4 hours ago',
    category: 'Injury',
    team: 'Arsenal',
    image: '🚑'
  },
  {
    id: 'n3',
    title: 'Fabrizio Romano: Chelsea set to trigger wonderkid release clause',
    summary: 'Chelsea have triggered the €40m release clause for Brazilian teenage sensation Messinho.',
    content: 'Chelsea Football Club has officially notified Palmeiras of their intention to trigger the €40m release clause for 17-year-old winger Estevão Willian, affectionately known as Messinho. Personal terms have been agreed on a 7-year contract. The player will join Stamford Bridge in the summer of 2025 when he turns 18, continuing Chelsea\'s heavy recruitment drive in South America.',
    source: 'Here We Go News',
    time: '5 hours ago',
    category: 'Transfer',
    team: 'Chelsea',
    image: '💰'
  }
];

const GOAL_PLAYERS = [
  'Martin Ødegaard', 'Bukayo Saka', 'Kai Havertz', 'Erling Haaland', 'Phil Foden', 'Kevin De Bruyne',
  'Jude Bellingham', 'Vinícius Júnior', 'Rodrygo', 'Harry Kane', 'Jamal Musiala', 'Thomas Müller',
  'Robert Lewandowski', 'Pedri', 'Gavi', 'Lautaro Martínez', 'Marcus Thuram', 'Rafael Leão'
];

const CARD_PLAYERS = [
  'William Saliba', 'Declan Rice', 'Rodri', 'Rúben Dias', 'Antonio Rüdiger', 'Aurélien Tchouaméni',
  'Leon Goretzka', 'Dayot Upamecano', 'Ronald Araújo', 'Frenkie de Jong', 'Hakan Çalhanoğlu', 'Fikayo Tomori'
];

interface ToastAlert {
  id: string;
  title: string;
  message: string;
  type: 'goal' | 'card' | 'transfer' | 'system';
  teamLogo?: string;
  time: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'scores' | 'standings' | 'transfers' | 'news' | 'chat'>('scores');
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [standings, setStandings] = useState<TableRow[]>(INITIAL_STANDINGS);
  const [transfers, setTransfers] = useState<Transfer[]>(INITIAL_TRANSFERS);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  
  // Selected Match for Match Center details
  const [selectedMatchId, setSelectedMatchId] = useState<string>('m1');
  const selectedMatch = useMemo(() => matches.find(m => m.id === selectedMatchId) || matches[0], [matches, selectedMatchId]);

  // Notifications Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('pitch_sense_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      goals: true,
      cards: true,
      fullTime: true,
      transfers: true,
      favoriteTeams: ['Arsenal', 'Real Madrid'],
      sound: true,
    };
  });

  useEffect(() => {
    localStorage.setItem('pitch_sense_notifications', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  // Toast Alerts in State
  const [toasts, setToasts] = useState<ToastAlert[]>([]);

  // Favorite Team Search/Input
  const [favTeamInput, setFavTeamInput] = useState('');

  // AI Chat Messages
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      content: 'Greetings, tactician! ⚽ I am **Tactico**, your AI football analyst and witty pundit. Ask me anything about modern tactics (inverted fullbacks, gegenpressing), match histories, team line-ups, or let\'s debate who belongs on the Ballon d\'Or podium. What is on your mind today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // AI Match Analysis State
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, string>>({});
  const [isAnalyzingMatch, setIsAnalyzingMatch] = useState<Record<string, boolean>>({});

  // AI Transfer Rumor Evaluator State
  const [rumorForm, setRumorForm] = useState({
    player: '',
    currentClub: '',
    targetClub: '',
    sourceValue: '',
    description: ''
  });
  const [rumorAnalysisResult, setRumorAnalysisResult] = useState<string | null>(null);
  const [isEvaluatingRumor, setIsEvaluatingRumor] = useState(false);

  // AI News Summarizer State
  const [selectedNewsSummary, setSelectedNewsSummary] = useState<string | null>(null);
  const [selectedNewsItem, setSelectedNewsItem] = useState<NewsItem | null>(null);
  const [isSummarizingNews, setIsSummarizingNews] = useState(false);

  // Auto-scrolling chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Audio Context Tone Generator for Notifications
  const playNotificationSound = (type: 'goal' | 'card' | 'transfer' | 'system') => {
    if (!notificationSettings.sound) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (type === 'goal') {
        // High double-beep for goal
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
        
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        
        osc1.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc1.start();
        osc1.stop(ctx.currentTime + 0.4);
      } else if (type === 'card') {
        // Alert flat beep
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(330, ctx.currentTime); // E4
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else {
        // Nice chime
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  };

  // Toast trigger helper
  const addToast = (title: string, message: string, type: 'goal' | 'card' | 'transfer' | 'system', teamLogo?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newToast = { id, title, message, type, teamLogo, time };
    setToasts(prev => [newToast, ...prev].slice(0, 5)); // Keep last 5 toasts on screen
    playNotificationSound(type);

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  };

  // Recalculate standings based on matches (dynamic league tables!)
  const updateStandingsWithMatch = (home: string, away: string, homeScore: number, awayScore: number) => {
    setStandings(prev => {
      return prev.map(row => {
        if (row.team === home) {
          const won = homeScore > awayScore ? 1 : 0;
          const drawn = homeScore === awayScore ? 1 : 0;
          const lost = homeScore < awayScore ? 1 : 0;
          const pts = (won * 3) + (drawn * 1);
          const gd = homeScore - awayScore;
          return {
            ...row,
            played: row.played + 1,
            won: row.won + won,
            drawn: row.drawn + drawn,
            lost: row.lost + lost,
            gd: row.gd + gd,
            points: row.points + pts
          };
        }
        if (row.team === away) {
          const won = awayScore > homeScore ? 1 : 0;
          const drawn = awayScore === homeScore ? 1 : 0;
          const lost = awayScore < homeScore ? 1 : 0;
          const pts = (won * 3) + (drawn * 1);
          const gd = awayScore - homeScore;
          return {
            ...row,
            played: row.played + 1,
            won: row.won + won,
            drawn: row.drawn + drawn,
            lost: row.lost + lost,
            gd: row.gd + gd,
            points: row.points + pts
          };
        }
        return row;
      }).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.gd !== a.gd) return b.gd - a.gd;
        return b.team.localeCompare(a.team);
      }).map((row, index) => ({ ...row, position: index + 1 }));
    });
  };

  // Real-Time Match Simulation Engine: Trigger random event
  const simulateMatchAction = () => {
    // Pick an active LIVE match randomly
    const liveMatches = matches.filter(m => m.status === 'LIVE');
    if (liveMatches.length === 0) {
      addToast('No Live Matches', 'All matches are currently completed. Restarting some matches for simulation!', 'system');
      // Revive some matches to LIVE
      setMatches(prev => prev.map((m, i) => i < 3 ? { ...m, status: 'LIVE', minute: Math.floor(Math.random() * 45) + 1, homeScore: Math.floor(Math.random() * 2), awayScore: Math.floor(Math.random() * 2) } : m));
      return;
    }

    const targetMatch = liveMatches[Math.floor(Math.random() * liveMatches.length)];
    const roll = Math.random();

    let eventType: 'goal' | 'yellow' | 'red' | 'substitution' = 'goal';
    let teamSide: 'home' | 'away' = Math.random() > 0.5 ? 'home' : 'away';
    let playerName = '';
    let detailMsg = '';

    const executingTeam = teamSide === 'home' ? targetMatch.homeTeam : targetMatch.awayTeam;
    const opponentTeam = teamSide === 'home' ? targetMatch.awayTeam : targetMatch.homeTeam;

    if (roll < 0.4) {
      // GOAL!
      eventType = 'goal';
      playerName = GOAL_PLAYERS[Math.floor(Math.random() * GOAL_PLAYERS.length)];
      const assister = GOAL_PLAYERS[Math.floor(Math.random() * GOAL_PLAYERS.length)];
      detailMsg = assister !== playerName ? `Assist: ${assister}` : 'Solo effort';

      const isHome = teamSide === 'home';
      const newHomeScore = targetMatch.homeScore + (isHome ? 1 : 0);
      const newAwayScore = targetMatch.awayScore + (isHome ? 0 : 1);

      // Trigger Notification
      const isFavorite = notificationSettings.favoriteTeams.includes(executingTeam.name) || notificationSettings.favoriteTeams.includes(opponentTeam.name);
      
      if (notificationSettings.goals && (!notificationSettings.favoriteTeams.length || isFavorite)) {
        addToast(
          `⚽ GOAL! - ${targetMatch.league}`,
          `${executingTeam.name} ${newHomeScore}-${newAwayScore} ${opponentTeam.name} - ${playerName} (${targetMatch.minute}')`,
          'goal',
          executingTeam.logo
        );
      }

      // Update Matches state
      setMatches(prev => prev.map(m => {
        if (m.id === targetMatch.id) {
          const newEvents: MatchEvent[] = [
            ...m.events,
            { minute: m.minute, type: 'goal', team: teamSide, player: playerName, detail: detailMsg }
          ];
          // Update stats slightly
          const newStats = { ...m.stats };
          if (isHome) {
            newStats.shots[0] += 1;
            newStats.shotsOnTarget[0] += 1;
          } else {
            newStats.shots[1] += 1;
            newStats.shotsOnTarget[1] += 1;
          }
          return {
            ...m,
            homeScore: newHomeScore,
            awayScore: newAwayScore,
            events: newEvents,
            stats: newStats
          };
        }
        return m;
      }));

    } else if (roll < 0.7) {
      // Yellow or Red Card
      const isRed = Math.random() > 0.8;
      eventType = isRed ? 'red' : 'yellow';
      playerName = CARD_PLAYERS[Math.floor(Math.random() * CARD_PLAYERS.length)];
      
      const isFavorite = notificationSettings.favoriteTeams.includes(executingTeam.name) || notificationSettings.favoriteTeams.includes(opponentTeam.name);

      if (notificationSettings.cards && (!notificationSettings.favoriteTeams.length || isFavorite)) {
        addToast(
          `${isRed ? '🟥 RED CARD!' : '🟨 YELLOW CARD'} - ${targetMatch.league}`,
          `${playerName} (${executingTeam.name}) penalized at ${targetMatch.minute}'`,
          'card',
          executingTeam.logo
        );
      }

      setMatches(prev => prev.map(m => {
        if (m.id === targetMatch.id) {
          const newEvents: MatchEvent[] = [
            ...m.events,
            { minute: m.minute, type: eventType, team: teamSide, player: playerName }
          ];
          const newStats = { ...m.stats };
          if (isRed) {
            if (teamSide === 'home') newStats.redCards[0] += 1;
            else newStats.redCards[1] += 1;
          } else {
            if (teamSide === 'home') newStats.yellowCards[0] += 1;
            else newStats.yellowCards[1] += 1;
          }
          return {
            ...m,
            events: newEvents,
            stats: newStats
          };
        }
        return m;
      }));

    } else {
      // Substitution or Stats shifting
      eventType = 'substitution';
      playerName = GOAL_PLAYERS[Math.floor(Math.random() * GOAL_PLAYERS.length)];
      const playerOut = CARD_PLAYERS[Math.floor(Math.random() * CARD_PLAYERS.length)];
      detailMsg = `In: ${playerName} / Out: ${playerOut}`;

      setMatches(prev => prev.map(m => {
        if (m.id === targetMatch.id) {
          // Change possession and stats slightly
          const possessionShift = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
          const newPossession: [number, number] = [
            Math.max(30, Math.min(70, m.stats.possession[0] + possessionShift)),
            Math.max(30, Math.min(70, m.stats.possession[1] - possessionShift))
          ];
          const newStats = {
            ...m.stats,
            possession: newPossession,
            corners: [
              m.stats.corners[0] + (Math.random() > 0.8 ? 1 : 0),
              m.stats.corners[1] + (Math.random() > 0.8 ? 1 : 0)
            ],
            fouls: [
              m.stats.fouls[0] + (Math.random() > 0.7 ? 1 : 0),
              m.stats.fouls[1] + (Math.random() > 0.7 ? 1 : 0)
            ]
          };
          return {
            ...m,
            events: [
              ...m.events,
              { minute: m.minute, type: 'substitution', team: teamSide, player: playerName, detail: detailMsg }
            ],
            stats: newStats
          };
        }
        return m;
      }));
    }
  };

  // Dynamic game minute ticking in background
  useEffect(() => {
    const interval = setInterval(() => {
      setMatches(prev => prev.map(m => {
        if (m.status === 'LIVE') {
          const nextMinute = m.minute + 1;
          if (nextMinute >= 90) {
            // End the match!
            const isFavorite = notificationSettings.favoriteTeams.includes(m.homeTeam.name) || notificationSettings.favoriteTeams.includes(m.awayTeam.name);
            if (notificationSettings.fullTime && (!notificationSettings.favoriteTeams.length || isFavorite)) {
              addToast(
                `🏁 FULL TIME - ${m.league}`,
                `${m.homeTeam.name} ${m.homeScore}-${m.awayScore} ${m.awayTeam.name} - Finished after 90 minutes.`,
                'system'
              );
            }
            // Update standings
            updateStandingsWithMatch(m.homeTeam.name, m.awayTeam.name, m.homeScore, m.awayScore);

            return {
              ...m,
              minute: 90,
              status: 'FT'
            };
          }
          return {
            ...m,
            minute: nextMinute
          };
        }
        return m;
      }));
    }, 12000); // 1 minute in-game is 12 seconds in real life

    return () => clearInterval(interval);
  }, [notificationSettings]);

  // Periodic random event simulation (every 18 seconds an event happens somewhere)
  useEffect(() => {
    const interval = setInterval(() => {
      simulateMatchAction();
    }, 18000);
    return () => clearInterval(interval);
  }, [matches, notificationSettings]);

  // Add a transfer dynamically to simulate the Transfer Wire feed
  const simulateTransferRumor = () => {
    const firstNames = ['Marcus', 'Erling', 'Jude', 'Alexis', 'Bruno', 'Jack', 'Lautaro', 'Federico', 'Luka', 'Leroy'];
    const lastNames = ['Rashford', 'Haaland', 'Bellingham', 'Mac Allister', 'Fernandes', 'Grealish', 'Martínez', 'Chiesa', 'Modrić', 'Sané'];
    const clubs = ['Man United', 'Arsenal', 'Real Madrid', 'Barcelona', 'Bayern Munich', 'PSG', 'Juventus', 'AC Milan', 'Dortmund'];
    const positions = ['Striker', 'Midfielder', 'Winger', 'Defender', 'Goalkeeper'];

    const player = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    const fromClub = clubs[Math.floor(Math.random() * clubs.length)];
    let toClub = clubs[Math.floor(Math.random() * clubs.length)];
    while (toClub === fromClub) {
      toClub = clubs[Math.floor(Math.random() * clubs.length)];
    }
    const position = positions[Math.floor(Math.random() * positions.length)];
    const fee = `€${Math.floor(Math.random() * 80) + 20}m`;
    const statuses: ('Confirmed' | 'Developing' | 'Rumor')[] = ['Rumor', 'Developing', 'Confirmed'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const sources = ['Fabrizio Romano', 'The Athletic', 'Sky Sports', 'Gianluca Di Marzio', 'L\'Equipe'];
    const source = sources[Math.floor(Math.random() * sources.length)];

    const newTransfer: Transfer = {
      id: `t_sim_${Math.random().toString(36).substr(2, 5)}`,
      player,
      position,
      fromClub,
      toClub,
      fee,
      status,
      source,
      date: 'Just Now',
      details: `${player} is heavily linked to a move to ${toClub} from ${fromClub}. Personal terms are ${status === 'Confirmed' ? 'completely agreed.' : 'being negotiated.'}`
    };

    setTransfers(prev => [newTransfer, ...prev]);

    if (notificationSettings.transfers) {
      addToast(
        `✈️ TRANSFER WIRE - ${status.toUpperCase()}`,
        `${player} (${position}) ${fromClub} ➔ ${toClub} [${fee}]`,
        'transfer'
      );
    }
  };

  // Add Favorite Team
  const handleAddFavorite = (e: React.FormEvent) => {
    e.preventDefault();
    const team = favTeamInput.trim();
    if (!team) return;
    if (notificationSettings.favoriteTeams.includes(team)) {
      addToast('Already Favorite', `${team} is already in your alerts list!`, 'system');
      setFavTeamInput('');
      return;
    }
    setNotificationSettings(prev => ({
      ...prev,
      favoriteTeams: [...prev.favoriteTeams, team]
    }));
    setFavTeamInput('');
    addToast('Favorite Team Added', `You will now receive focused alerts for ${team}.`, 'system');
  };

  const handleRemoveFavorite = (team: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      favoriteTeams: prev.favoriteTeams.filter(t => t !== team)
    }));
    addToast('Favorite Team Removed', `Alerts stopped for ${team}.`, 'system');
  };

  // AI Function: Submit Chat to Tactico
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isChatLoading) return;

    const userMsgId = Math.random().toString(36).substr(2, 9);
    const userMessage: Message = {
      id: userMsgId,
      role: 'user',
      content: userInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage].map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      // Premium error state - explain how to add API key
      const errorMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: `⚠️ **AI Integration Setup Required** \n\nI couldn't reach the AI module. To activate **Tactico AI Chat, Match Breakdown, and Rumor Evaluator**, please ensure your **GEMINI_API_KEY** is configured in the AI Studio Secrets panel.\n\n*Temporary Offline Response:* Modern tactics center on positional play (Juego de Posición). If you have configured your keys, verify the backend container logs!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // AI Function: Analyze Match
  const handleAnalyzeMatch = async (matchId: string) => {
    if (isAnalyzingMatch[matchId]) return;
    setIsAnalyzingMatch(prev => ({ ...prev, [matchId]: true }));

    const matchToAnalyze = matches.find(m => m.id === matchId);
    if (!matchToAnalyze) return;

    try {
      const response = await fetch('/api/match/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeTeam: matchToAnalyze.homeTeam.name,
          awayTeam: matchToAnalyze.awayTeam.name,
          score: `${matchToAnalyze.homeScore}-${matchToAnalyze.awayScore}`,
          events: matchToAnalyze.events,
          stats: matchToAnalyze.stats
        })
      });

      if (!response.ok) throw new Error('Failed to analyze');

      const data = await response.json();
      setAiAnalysis(prev => ({ ...prev, [matchId]: data.analysis }));
    } catch (err) {
      console.error(err);
      setAiAnalysis(prev => ({
        ...prev,
        [matchId]: `⚠️ **API Key Missing or Container Error**\n\nCould not compile AI analysis. Please verify your \`GEMINI_API_KEY\` setup. \n\n*General Insight:* This match features high intensity defensive blocks and crucial transitions. Space utilization was decided by mid-block defensive positioning.`
      }));
    } finally {
      setIsAnalyzingMatch(prev => ({ ...prev, [matchId]: false }));
    }
  };

  // AI Function: Evaluate Rumor
  const handleEvaluateRumor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rumorForm.player || !rumorForm.targetClub || isEvaluatingRumor) return;

    setIsEvaluatingRumor(true);
    setRumorAnalysisResult(null);

    try {
      const response = await fetch('/api/rumor/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rumorForm)
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      setRumorAnalysisResult(data.analysis);
    } catch (err) {
      console.error(err);
      setRumorAnalysisResult(`⚠️ **Evaluation Offline**\n\nPlease set up your \`GEMINI_API_KEY\` to evaluate rumors dynamically. \n\n**Quick Draft analysis of ${rumorForm.player}:**\n- *Fit:* Fits modern forward requirements.\n- *Rating:* Warm Rumor.`);
    } finally {
      setIsEvaluatingRumor(false);
    }
  };

  // AI Function: Summarize News
  const handleSummarizeNews = async (item: NewsItem) => {
    setSelectedNewsItem(item);
    setSelectedNewsSummary(null);
    setIsSummarizingNews(true);

    try {
      const response = await fetch('/api/news/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: item.title, content: item.content })
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      setSelectedNewsSummary(data.summary);
    } catch (err) {
      console.error(err);
      setSelectedNewsSummary(`⚠️ **Summary Offline**\n\nUnable to reach Gemini API. Please configure your \`GEMINI_API_KEY\`.\n\n*Original News Summary:* ${item.summary}`);
    } finally {
      setIsSummarizingNews(false);
    }
  };

  // Formatting utility for events
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'yellow': return '🟨';
      case 'red': return '🟥';
      case 'substitution': return '🔄';
      default: return '📍';
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#050505] text-white overflow-hidden relative selection:bg-[#00FF41] selection:text-black">
      
      {/* Toast Overlay (Top Right Notifications) */}
      <div className="absolute top-4 right-4 z-50 space-y-3 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-4 p-4 bg-[#0A0A0A] border-l-4 border-[#00FF41] shadow-2xl rounded-r-lg border border-white/5 animate-slide-in relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#00FF41]/5 rounded-bl-full pointer-events-none" />
            <div className="text-2xl mt-0.5 select-none">{toast.teamLogo || '📢'}</div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#00FF41]">Alert Triggered</span>
                <span className="text-[9px] text-white/40">{toast.time}</span>
              </div>
              <h4 className="text-xs font-black uppercase tracking-tight text-white leading-tight">{toast.title}</h4>
              <p className="text-xs text-white/70 mt-1 font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-white/40 hover:text-white text-xs select-none pl-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Top Header - Bold Typography Design Elements */}
      <header className="flex justify-between items-center px-6 py-4 md:px-8 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-6 md:gap-10">
          <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic select-none">
            PITCH<span className="text-[#00FF41]">.</span>SENSE
          </h1>
          <nav className="hidden md:flex gap-6 items-center">
            <button
              onClick={() => setActiveTab('scores')}
              className={`text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'scores' ? 'text-[#00FF41] border-b-2 border-[#00FF41] pb-1' : 'opacity-40 hover:opacity-100'}`}
            >
              Live Scores
            </button>
            <button
              onClick={() => setActiveTab('standings')}
              className={`text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'standings' ? 'text-[#00FF41] border-b-2 border-[#00FF41] pb-1' : 'opacity-40 hover:opacity-100'}`}
            >
              Standings
            </button>
            <button
              onClick={() => setActiveTab('transfers')}
              className={`text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'transfers' ? 'text-[#00FF41] border-b-2 border-[#00FF41] pb-1' : 'opacity-40 hover:opacity-100'}`}
            >
              Transfers
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'news' ? 'text-[#00FF41] border-b-2 border-[#00FF41] pb-1' : 'opacity-40 hover:opacity-100'}`}
            >
              Team News
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 ${activeTab === 'chat' ? 'text-[#00FF41] border-b-2 border-[#00FF41] pb-1' : 'opacity-40 hover:opacity-100'}`}
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Tactico Pundit
            </button>
          </nav>
        </div>

        {/* Live Simulation Controls & User Panel */}
        <div className="flex items-center gap-4">
          <button
            onClick={simulateMatchAction}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00FF41] text-black rounded text-[10px] font-black uppercase tracking-wider hover:bg-white hover:scale-105 transition-all cursor-pointer shadow-lg active:scale-95"
            title="Simulate random live goal or event immediately!"
          >
            <Zap className="w-3.5 h-3.5 fill-black" />
            <span>Sim Goal</span>
          </button>
          <button
            onClick={simulateTransferRumor}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 text-white rounded text-[10px] font-black uppercase tracking-wider hover:bg-white hover:text-black transition-all cursor-pointer"
            title="Simulate a new transfer rumor or confirmed deal"
          >
            <span>Sim Transfer</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {matches.filter(m => m.status === 'LIVE').length} Live
            </span>
          </div>

          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00FF41] to-[#006AFF] shrink-0" />
        </div>
      </header>

      {/* Mobile Navigation Header Tabs */}
      <div className="flex md:hidden bg-[#0A0A0A] border-b border-white/5 px-4 py-2 gap-2 overflow-x-auto shrink-0 scrollbar-none">
        <button
          onClick={() => setActiveTab('scores')}
          className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest shrink-0 ${activeTab === 'scores' ? 'bg-[#00FF41] text-black' : 'bg-white/5 text-white/60'}`}
        >
          Scores
        </button>
        <button
          onClick={() => setActiveTab('standings')}
          className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest shrink-0 ${activeTab === 'standings' ? 'bg-[#00FF41] text-black' : 'bg-white/5 text-white/60'}`}
        >
          Standings
        </button>
        <button
          onClick={() => setActiveTab('transfers')}
          className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest shrink-0 ${activeTab === 'transfers' ? 'bg-[#00FF41] text-black' : 'bg-white/5 text-white/60'}`}
        >
          Transfers
        </button>
        <button
          onClick={() => setActiveTab('news')}
          className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest shrink-0 ${activeTab === 'news' ? 'bg-[#00FF41] text-black' : 'bg-white/5 text-white/60'}`}
        >
          News
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest shrink-0 flex items-center gap-1 ${activeTab === 'chat' ? 'bg-[#00FF41] text-black' : 'bg-white/5 text-white/60'}`}
        >
          <Sparkles className="w-3 h-3" /> AI Chat
        </button>
      </div>

      {/* Main Viewport Grid */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Side Navigation & Custom Notifications Desk (Desktop only sidebar) */}
        <div className="hidden lg:flex flex-col w-80 bg-[#0A0A0A] border-r border-white/10 overflow-y-auto shrink-0 p-6 space-y-6">
          
          {/* Custom Notification Controller */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5 text-[#00FF41]">
                <Bell className="w-4 h-4 text-[#00FF41]" /> Custom Alerts
              </h3>
              <button
                onClick={() => setNotificationSettings(prev => ({ ...prev, sound: !prev.sound }))}
                className="text-white/60 hover:text-white transition-colors"
                title={notificationSettings.sound ? "Mute audio beep alerts" : "Unmute audio beep alerts"}
              >
                {notificationSettings.sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-500" />}
              </button>
            </div>
            
            <p className="text-[10px] text-white/40 leading-relaxed uppercase">
              Configure real-time customizable trigger alerts.
            </p>

            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notificationSettings.goals}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, goals: e.target.checked }))}
                  className="rounded border-white/20 text-[#00FF41] focus:ring-0 focus:ring-offset-0 bg-transparent w-4 h-4 cursor-pointer"
                />
                <span>Goal Alerts (Beep)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notificationSettings.cards}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, cards: e.target.checked }))}
                  className="rounded border-white/20 text-[#00FF41] focus:ring-0 focus:ring-offset-0 bg-transparent w-4 h-4 cursor-pointer"
                />
                <span>Card Alerts (Warning Beep)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notificationSettings.fullTime}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, fullTime: e.target.checked }))}
                  className="rounded border-white/20 text-[#00FF41] focus:ring-0 focus:ring-offset-0 bg-transparent w-4 h-4 cursor-pointer"
                />
                <span>Full-time Results</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notificationSettings.transfers}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, transfers: e.target.checked }))}
                  className="rounded border-white/20 text-[#00FF41] focus:ring-0 focus:ring-offset-0 bg-transparent w-4 h-4 cursor-pointer"
                />
                <span>Transfer Rumors / Confirmed</span>
              </label>
            </div>

            {/* Favorite Teams alerts section */}
            <div className="pt-3 border-t border-white/5 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/50">Favorite Alerts Only</span>
              <form onSubmit={handleAddFavorite} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add Team..."
                  value={favTeamInput}
                  onChange={(e) => setFavTeamInput(e.target.value)}
                  className="flex-1 bg-[#121212] border border-white/10 rounded px-2.5 py-1 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00FF41]"
                />
                <button
                  type="submit"
                  className="px-2 bg-white/10 border border-white/10 text-white rounded text-xs font-black hover:bg-white hover:text-black transition-colors"
                >
                  +
                </button>
              </form>

              {notificationSettings.favoriteTeams.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {notificationSettings.favoriteTeams.map(team => (
                    <span
                      key={team}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 rounded text-[9px] font-black uppercase"
                    >
                      {team}
                      <button
                        type="button"
                        onClick={() => handleRemoveFavorite(team)}
                        className="hover:text-white font-black"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[9px] text-white/30 uppercase italic">Receiving alerts for all match updates.</p>
              )}
            </div>
          </div>

          {/* Quick Standings Leaders Mini Board */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/50">Leaderboard</h3>
              <button
                onClick={() => setActiveTab('standings')}
                className="text-[10px] font-bold text-[#00FF41] hover:underline uppercase"
              >
                Full Table
              </button>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden divide-y divide-white/5">
              {standings.slice(0, 5).map((row, index) => (
                <div key={row.team} className="flex items-center gap-3 px-4 py-2.5 text-xs">
                  <span className={`font-black w-4 ${index === 0 ? 'text-[#00FF41]' : 'text-white/40'}`}>{row.position}</span>
                  <span className="flex-1 font-bold text-white/90">{row.team}</span>
                  <span className="text-white/40 font-semibold">{row.played} GP</span>
                  <span className="font-black text-right w-6 text-[#00FF41]">{row.points}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prompt/Guide */}
          <div className="text-[10px] text-white/30 uppercase leading-relaxed space-y-1">
            <p>🔴 System Live Engine online.</p>
            <p>⚡ Push notifications active.</p>
            <p>🧠 Powered by Gemini 3.5 Flash.</p>
          </div>

        </div>

        {/* Dynamic Inner Panel Viewport */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#050505]">

          {/* Tab 1: Live Scores Hub */}
          {activeTab === 'scores' && (
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              
              {/* Match List Selector Panel */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-wider italic">Pitch Scoreboard</h2>
                    <p className="text-[10px] text-white/40 uppercase">Select match to open detailed AI Match Center</p>
                  </div>
                  <div className="flex gap-2">
                    {/* Simulator Info */}
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 rounded text-[10px] uppercase font-bold text-white/50">
                      <span>Sim ticking 15s</span>
                    </div>
                  </div>
                </div>

                {/* Match Cards Container */}
                <div className="grid grid-cols-1 gap-3">
                  {matches.map(match => {
                    const isSelected = match.id === selectedMatchId;
                    return (
                      <div
                        key={match.id}
                        id={`match-card-${match.id}`}
                        onClick={() => setSelectedMatchId(match.id)}
                        className={`group border cursor-pointer rounded-xl p-4 transition-all duration-300 relative overflow-hidden ${
                          isSelected
                            ? 'bg-white/5 border-[#00FF41] shadow-[0_0_15px_rgba(0,255,65,0.08)]'
                            : 'bg-[#0A0A0A] border-white/10 hover:border-white/30'
                        }`}
                      >
                        {/* Selected Indicator Glow */}
                        {isSelected && (
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00FF41]" />
                        )}

                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[9px] font-black uppercase tracking-wider text-white/40 bg-white/5 px-2 py-0.5 rounded">
                            {match.league}
                          </span>
                          
                          {match.status === 'LIVE' ? (
                            <div className="flex items-center gap-1.5 bg-[#00FF41]/10 px-2.5 py-0.5 rounded text-[#00FF41]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-pulse" />
                              <span className="text-[9px] font-black uppercase tracking-widest">{match.minute}' MIN</span>
                            </div>
                          ) : match.status === 'FT' ? (
                            <span className="text-[9px] font-black bg-white/10 text-white/60 px-2.5 py-0.5 rounded tracking-widest">
                              FT
                            </span>
                          ) : (
                            <span className="text-[9px] font-black text-[#00FF41] border border-[#00FF41]/20 px-2.5 py-0.5 rounded tracking-widest">
                              UPCOMING
                            </span>
                          )}
                        </div>

                        {/* Visual Team Score Area */}
                        <div className="flex items-center justify-between py-2">
                          {/* Home Team */}
                          <div className="flex items-center gap-3 w-[40%]">
                            <span className="text-xl select-none">{match.homeTeam.logo}</span>
                            <span className="text-sm md:text-base font-black uppercase tracking-tight truncate group-hover:text-[#00FF41] transition-colors">
                              {match.homeTeam.name}
                            </span>
                          </div>

                          {/* Scores or Schedule */}
                          <div className="flex items-center justify-center w-[20%] text-center">
                            {match.status !== 'UPCOMING' ? (
                              <div className="flex items-center gap-3">
                                <span className="text-2xl md:text-3xl font-black tracking-tighter">{match.homeScore}</span>
                                <span className="text-sm font-black opacity-30">-</span>
                                <span className="text-2xl md:text-3xl font-black tracking-tighter">{match.awayScore}</span>
                              </div>
                            ) : (
                              <span className="text-[10px] font-black uppercase tracking-wider text-[#00FF41] bg-[#00FF41]/5 px-2 py-1 rounded border border-[#00FF41]/20">
                                20:00
                              </span>
                            )}
                          </div>

                          {/* Away Team */}
                          <div className="flex items-center justify-end gap-3 w-[40%] text-right">
                            <span className="text-sm md:text-base font-black uppercase tracking-tight truncate group-hover:text-[#00FF41] transition-colors">
                              {match.awayTeam.name}
                            </span>
                            <span className="text-xl select-none">{match.awayTeam.logo}</span>
                          </div>
                        </div>

                        {/* Bottom Score Scorers Teaser */}
                        {match.events.filter(e => e.type === 'goal').length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-white/40">
                            {match.events.filter(e => e.type === 'goal').slice(0, 3).map((g, idx) => (
                              <span key={idx} className="truncate">
                                ⚽ {g.player} ({g.minute}')
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Match Center detailed side view (Desktop split display) */}
              <div className="w-full md:w-[480px] lg:w-[520px] bg-[#0A0A0A] border-t md:border-t-0 md:border-l border-white/10 flex flex-col overflow-y-auto shrink-0 p-5 md:p-6 space-y-6">
                
                {/* Match Header Display */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-white/40">
                    <span>{selectedMatch.league} • Match Center</span>
                    <span>{selectedMatch.stadium}</span>
                  </div>

                  {/* Gigantic Scoreboard Board */}
                  <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 relative flex flex-col items-center justify-center text-center">
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {selectedMatch.status === 'LIVE' ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Live {selectedMatch.minute}'</span>
                        </>
                      ) : (
                        <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">{selectedMatch.status}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 items-center w-full my-4">
                      <div className="flex flex-col items-center">
                        <span className="text-4xl mb-2 select-none">{selectedMatch.homeTeam.logo}</span>
                        <span className="text-sm font-black uppercase italic tracking-tight">{selectedMatch.homeTeam.name}</span>
                      </div>

                      <div className="flex flex-col items-center">
                        {selectedMatch.status !== 'UPCOMING' ? (
                          <div className="flex items-baseline justify-center">
                            <span className="text-5xl md:text-6xl font-black tracking-tighter">{selectedMatch.homeScore}</span>
                            <span className="text-2xl font-black mx-2 opacity-20">-</span>
                            <span className="text-5xl md:text-6xl font-black tracking-tighter">{selectedMatch.awayScore}</span>
                          </div>
                        ) : (
                          <span className="text-xs font-black uppercase text-[#00FF41] border border-[#00FF41]/20 px-3 py-1 rounded">
                            UPCOMING
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-4xl mb-2 select-none">{selectedMatch.awayTeam.logo}</span>
                        <span className="text-sm font-black uppercase italic tracking-tight">{selectedMatch.awayTeam.name}</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-white/30 uppercase mt-2">Referee: {selectedMatch.referee}</p>
                  </div>
                </div>

                {/* Match Statistics Bar Blocks */}
                {selectedMatch.status !== 'UPCOMING' && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest border-b border-white/10 pb-2">Match Statistics</h3>
                    
                    {/* Possession */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-black">
                        <span>{selectedMatch.stats.possession[0]}%</span>
                        <span className="text-white/40 uppercase tracking-widest text-[9px]">Possession</span>
                        <span>{selectedMatch.stats.possession[1]}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden flex">
                        <div className="h-full bg-[#00FF41]" style={{ width: `${selectedMatch.stats.possession[0]}%` }} />
                        <div className="h-full bg-white/25" style={{ width: `${selectedMatch.stats.possession[1]}%` }} />
                      </div>
                    </div>

                    {/* Shots & Target Shots */}
                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div className="bg-white/5 border border-white/5 rounded-lg p-3 text-center">
                        <span className="text-[9px] uppercase font-black text-white/40 block mb-1">Total Shots</span>
                        <span className="text-lg font-black">{selectedMatch.stats.shots[0]} - {selectedMatch.stats.shots[1]}</span>
                      </div>
                      <div className="bg-white/5 border border-white/5 rounded-lg p-3 text-center">
                        <span className="text-[9px] uppercase font-black text-white/40 block mb-1">On Target</span>
                        <span className="text-lg font-black">{selectedMatch.stats.shotsOnTarget[0]} - {selectedMatch.stats.shotsOnTarget[1]}</span>
                      </div>
                    </div>

                    {/* Other Stats Row */}
                    <div className="bg-[#050505] border border-white/5 rounded-xl divide-y divide-white/5 text-xs">
                      <div className="flex justify-between items-center px-4 py-2.5">
                        <span className="font-bold">{selectedMatch.stats.corners[0]}</span>
                        <span className="text-white/30 text-[9px] uppercase tracking-widest font-black">Corners</span>
                        <span className="font-bold">{selectedMatch.stats.corners[1]}</span>
                      </div>
                      <div className="flex justify-between items-center px-4 py-2.5">
                        <span className="font-bold">{selectedMatch.stats.fouls[0]}</span>
                        <span className="text-white/30 text-[9px] uppercase tracking-widest font-black">Fouls</span>
                        <span className="font-bold">{selectedMatch.stats.fouls[1]}</span>
                      </div>
                      <div className="flex justify-between items-center px-4 py-2.5">
                        <span className="font-bold text-yellow-500">{selectedMatch.stats.yellowCards[0]}</span>
                        <span className="text-white/30 text-[9px] uppercase tracking-widest font-black">Yellow Cards</span>
                        <span className="font-bold text-yellow-500">{selectedMatch.stats.yellowCards[1]}</span>
                      </div>
                      <div className="flex justify-between items-center px-4 py-2.5">
                        <span className="font-bold text-red-500">{selectedMatch.stats.redCards[0]}</span>
                        <span className="text-white/30 text-[9px] uppercase tracking-widest font-black">Red Cards</span>
                        <span className="font-bold text-red-500">{selectedMatch.stats.redCards[1]}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Match Events Timeline */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest border-b border-white/10 pb-2">Timeline Events</h3>
                  
                  {selectedMatch.events.length > 0 ? (
                    <div className="relative border-l border-white/10 pl-4 ml-2 space-y-4 pt-1">
                      {selectedMatch.events.map((event, idx) => (
                        <div key={idx} className="relative group">
                          {/* Timeline dot */}
                          <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-[#050505] border-2 border-[#00FF41]" />
                          
                          <div className="flex items-start gap-2.5">
                            <span className="text-[10px] font-black text-white/40 block mt-0.5 w-6">{event.minute}'</span>
                            <span className="text-sm select-none">{getEventIcon(event.type)}</span>
                            <div>
                              <p className="text-xs font-bold leading-none text-white/90">
                                {event.player}{' '}
                                <span className="text-[10px] text-white/40 font-normal uppercase tracking-wider block sm:inline">
                                  ({event.team === 'home' ? selectedMatch.homeTeam.code : selectedMatch.awayTeam.code})
                                </span>
                              </p>
                              {event.detail && (
                                <p className="text-[10px] text-[#00FF41] mt-0.5 uppercase tracking-wide">{event.detail}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-white/30 uppercase italic text-center py-4">No match incidents to report yet.</p>
                  )}
                </div>

                {/* AI Tactical Analysis Generator */}
                {selectedMatch.status !== 'UPCOMING' && (
                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5 text-[#00FF41]">
                        <Sparkles className="w-4 h-4" /> AI Tactical Breakdown
                      </h4>
                      <button
                        onClick={() => handleAnalyzeMatch(selectedMatch.id)}
                        disabled={isAnalyzingMatch[selectedMatch.id]}
                        className="px-3 py-1 bg-white/5 border border-white/10 hover:border-white/30 text-white rounded text-[10px] font-black uppercase tracking-wider disabled:opacity-55 cursor-pointer"
                      >
                        {isAnalyzingMatch[selectedMatch.id] ? 'Analyzing...' : 'Generate Breakdown'}
                      </button>
                    </div>

                    {aiAnalysis[selectedMatch.id] ? (
                      <div className="bg-[#050505] border border-white/10 rounded-xl p-4 text-xs leading-relaxed text-white/90 whitespace-pre-line prose prose-invert font-sans max-h-72 overflow-y-auto">
                        {aiAnalysis[selectedMatch.id]}
                      </div>
                    ) : (
                      <div className="bg-[#050505] border border-white/5 rounded-xl p-4 text-center">
                        <p className="text-[10px] text-white/40 uppercase leading-relaxed">
                          Click "Generate Breakdown" to prompt **Tactico AI** to evaluate real-time setups, tactical shifts, and manager decisions for this match.
                        </p>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Tab 2: Standings Table */}
          {activeTab === 'standings' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-black uppercase tracking-wider italic">League Table</h2>
                <p className="text-xs text-white/40 uppercase">Real-time standings automatically updated by simulation outcomes.</p>
              </div>

              {/* Major League Filters */}
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-[#00FF41] text-black rounded text-[10px] font-black uppercase tracking-widest">
                  Premier League
                </button>
                <button className="px-3 py-1.5 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded text-[10px] font-black uppercase tracking-widest opacity-60">
                  La Liga
                </button>
                <button className="px-3 py-1.5 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded text-[10px] font-black uppercase tracking-widest opacity-60">
                  Champions League
                </button>
              </div>

              {/* Full Standings Table */}
              <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#050505] text-[10px] font-black uppercase tracking-widest border-b border-white/10 text-white/40">
                        <th className="py-3.5 px-4 text-center w-12">Pos</th>
                        <th className="py-3.5 px-4">Club</th>
                        <th className="py-3.5 px-4 text-center">Played</th>
                        <th className="py-3.5 px-4 text-center">Won</th>
                        <th className="py-3.5 px-4 text-center">Drawn</th>
                        <th className="py-3.5 px-4 text-center">Lost</th>
                        <th className="py-3.5 px-4 text-center">GD</th>
                        <th className="py-3.5 px-4 text-right pr-6 text-[#00FF41]">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm font-semibold text-white/90">
                      {standings.map((row, index) => {
                        const isFavorite = notificationSettings.favoriteTeams.includes(row.team);
                        return (
                          <tr
                            key={row.team}
                            className={`hover:bg-white/5 transition-colors ${
                              isFavorite ? 'bg-[#00FF41]/5 border-l-2 border-l-[#00FF41]' : ''
                            }`}
                          >
                            <td className="py-3.5 px-4 text-center font-black">
                              <span className={index < 4 ? 'text-[#00FF41]' : index >= 6 ? 'text-red-500/80' : 'text-white'}>
                                {row.position}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-bold">
                              <div className="flex items-center gap-2">
                                <span>{row.team === 'Arsenal' ? '🔴' : row.team === 'Man City' ? '🔵' : row.team === 'Liverpool' ? '🔴' : row.team === 'Chelsea' ? '🔵' : '⚪'}</span>
                                <span className="uppercase tracking-tight">{row.team}</span>
                                {isFavorite && (
                                  <span className="text-[8px] bg-[#00FF41]/20 text-[#00FF41] px-1.5 py-0.5 rounded font-black tracking-widest">
                                    FAV
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold text-white/80">{row.played}</td>
                            <td className="py-3.5 px-4 text-center text-white/60">{row.won}</td>
                            <td className="py-3.5 px-4 text-center text-white/60">{row.drawn}</td>
                            <td className="py-3.5 px-4 text-center text-white/60">{row.lost}</td>
                            <td className={`py-3.5 px-4 text-center font-bold ${row.gd > 0 ? 'text-[#00FF41]/90' : row.gd < 0 ? 'text-red-500/80' : 'text-white/40'}`}>
                              {row.gd > 0 ? `+${row.gd}` : row.gd}
                            </td>
                            <td className="py-3.5 px-4 text-right pr-6 font-black text-[#00FF41] text-base">{row.points}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-[#050505] border-t border-white/5 flex flex-wrap gap-4 text-[10px] font-black uppercase text-white/40">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-[#00FF41]/20 rounded-full border border-[#00FF41]" />
                    <span>Champions League (Top 4)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-red-500/20 rounded-full border border-red-500" />
                    <span>Relegation Risk (Bottom 3)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Transfer Center */}
          {activeTab === 'transfers' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 flex flex-col lg:flex-row gap-6">
              
              {/* Transfer Wire List */}
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-wider italic">Transfer Wire</h2>
                  <p className="text-xs text-white/40 uppercase">Real-time reports, verified deals and rumors from around the world.</p>
                </div>

                <div className="space-y-4">
                  {transfers.map(transfer => (
                    <div
                      key={transfer.id}
                      className="bg-[#0A0A0A] border border-white/10 hover:border-[#00FF41]/40 rounded-xl p-5 transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="space-y-1">
                          <span className={`inline-block text-[9px] font-black px-2 py-0.5 uppercase tracking-widest rounded ${
                            transfer.status === 'Confirmed'
                              ? 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/20'
                              : transfer.status === 'Developing'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          }`}>
                            {transfer.status}
                          </span>
                          <h3 className="text-base md:text-lg font-black uppercase italic leading-tight text-white group-hover:text-[#00FF41]">
                            {transfer.player}
                          </h3>
                        </div>
                        <span className="text-[10px] font-semibold text-white/40">{transfer.date}</span>
                      </div>

                      <div className="grid grid-cols-3 bg-[#050505] border border-white/5 rounded-lg p-3 my-3 text-xs text-center">
                        <div>
                          <span className="text-[9px] uppercase font-black text-white/30 block">From Club</span>
                          <span className="font-bold text-white/90">{transfer.fromClub}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-black text-white/30 block">Target Club</span>
                          <span className="font-bold text-white/90">{transfer.toClub}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-black text-white/30 block">Reported Fee</span>
                          <span className="font-black text-[#00FF41]">{transfer.fee}</span>
                        </div>
                      </div>

                      {transfer.details && (
                        <p className="text-xs text-white/70 leading-relaxed font-sans">{transfer.details}</p>
                      )}

                      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] uppercase text-white/40">
                        <span>Source: {transfer.source}</span>
                        <span>Pos: {transfer.position}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Transfer Rumor Evaluator Widget */}
              <div className="w-full lg:w-[400px] shrink-0 bg-[#0A0A0A] border border-white/10 rounded-xl p-6 self-start space-y-5">
                <div className="space-y-1">
                  <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5 text-[#00FF41]">
                    <Sparkles className="w-4 h-4" /> AI Rumor Evaluator
                  </h3>
                  <p className="text-[10px] text-white/40 uppercase">
                    Have you heard a rumor? Type it in to prompt **Tactico AI** to calculate the probability and fit!
                  </p>
                </div>

                <form onSubmit={handleEvaluateRumor} className="space-y-3.5">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-wider text-white/50 mb-1">Player Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Victor Osimhen"
                      value={rumorForm.player}
                      onChange={(e) => setRumorForm(prev => ({ ...prev, player: e.target.value }))}
                      className="w-full bg-[#050505] border border-white/10 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#00FF41]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-white/50 mb-1">Current Club</label>
                      <input
                        type="text"
                        placeholder="e.g. Napoli"
                        value={rumorForm.currentClub}
                        onChange={(e) => setRumorForm(prev => ({ ...prev, currentClub: e.target.value }))}
                        className="w-full bg-[#050505] border border-white/10 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#00FF41]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-white/50 mb-1">Target Club</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Chelsea"
                        value={rumorForm.targetClub}
                        onChange={(e) => setRumorForm(prev => ({ ...prev, targetClub: e.target.value }))}
                        className="w-full bg-[#050505] border border-white/10 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#00FF41]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-wider text-white/50 mb-1">Source / Reported Fee</label>
                    <input
                      type="text"
                      placeholder="e.g. Fabrizio Romano / €100m"
                      value={rumorForm.sourceValue}
                      onChange={(e) => setRumorForm(prev => ({ ...prev, sourceValue: e.target.value }))}
                      className="w-full bg-[#050505] border border-white/10 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#00FF41]"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-wider text-white/50 mb-1">Rumor Description / Context</label>
                    <textarea
                      rows={2}
                      placeholder="Additional details, contract lengths, player social media hints..."
                      value={rumorForm.description}
                      onChange={(e) => setRumorForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-[#050505] border border-white/10 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#00FF41] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isEvaluatingRumor}
                    className="w-full py-2.5 bg-[#00FF41] hover:bg-white text-black text-xs font-black uppercase tracking-widest rounded transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isEvaluatingRumor ? 'Analyzing...' : 'Evaluate Rumor'}
                  </button>
                </form>

                {/* AI Rumor Analysis Output */}
                {rumorAnalysisResult && (
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Pundit Evaluation Verdict</span>
                    <div className="bg-[#050505] border border-white/10 rounded-xl p-4 text-xs leading-relaxed text-white/90 whitespace-pre-line prose prose-invert font-sans max-h-72 overflow-y-auto">
                      {rumorAnalysisResult}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Tab 4: Team News Panel */}
          {activeTab === 'news' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 flex flex-col lg:flex-row gap-6">
              
              {/* Articles Grid list */}
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-wider italic">Pitch News feed</h2>
                  <p className="text-xs text-white/40 uppercase">Top football reports summarized in real-time by AI punditry.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {news.map(item => (
                    <div
                      key={item.id}
                      className="bg-[#0A0A0A] border border-white/10 hover:border-[#00FF41]/40 rounded-xl p-5 transition-all flex flex-col"
                    >
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <span className="text-[9px] font-black uppercase tracking-wider text-[#00FF41] bg-[#00FF41]/5 border border-[#00FF41]/20 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        <span className="text-[9px] text-white/40 font-semibold">{item.time}</span>
                      </div>

                      <h3 className="text-base font-black uppercase italic leading-tight text-white mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      
                      <p className="text-xs text-white/60 font-sans leading-relaxed flex-1 mb-4">
                        {item.summary}
                      </p>

                      <div className="flex justify-between items-center pt-3 border-t border-white/5 mt-auto">
                        <span className="text-[10px] text-white/40 uppercase font-black">Source: {item.source}</span>
                        <button
                          onClick={() => handleSummarizeNews(item)}
                          className="text-xs font-black uppercase text-[#00FF41] hover:underline flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> AI Summarize
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* News Summarizer Sidebar Modal */}
              {selectedNewsItem && (
                <div className="w-full lg:w-[400px] shrink-0 bg-[#0A0A0A] border border-white/10 rounded-xl p-6 self-start space-y-5 animate-slide-in">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-[#00FF41] uppercase tracking-widest">Selected Article</span>
                      <h3 className="text-sm font-black uppercase italic text-white/95 leading-tight">
                        {selectedNewsItem.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedNewsItem(null);
                        setSelectedNewsSummary(null);
                      }}
                      className="text-white/40 hover:text-white select-none text-sm"
                    >
                      ✕
                    </button>
                  </div>

                  {isSummarizingNews ? (
                    <div className="text-center py-10 space-y-3">
                      <div className="w-6 h-6 border-2 border-[#00FF41] border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-[10px] text-white/40 uppercase font-black">Tactico summarizing article...</p>
                    </div>
                  ) : selectedNewsSummary ? (
                    <div className="space-y-4">
                      <div className="bg-[#050505] border border-white/10 rounded-xl p-4 space-y-4 text-xs font-sans text-white/90 leading-relaxed whitespace-pre-line overflow-y-auto max-h-[360px]">
                        {selectedNewsSummary}
                      </div>
                      <p className="text-[9px] text-white/30 uppercase leading-relaxed">
                        Summaries are generated by evaluating the core factual claims through AI. Verify statements with standard sports outlets.
                      </p>
                    </div>
                  ) : null}
                </div>
              )}

            </div>
          )}

          {/* Tab 5: AI Tactico Pundit Chat */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col h-full bg-[#050505] overflow-hidden">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#00FF41]/10 border border-[#00FF41]/40 flex items-center justify-center text-xl select-none">
                    🧠
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-wider">Tactico Chat Desk</h2>
                    <p className="text-[9px] text-[#00FF41] font-black uppercase tracking-wider">AI Football Pundit Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setChatMessages([chatMessages[0]])}
                  className="text-[9px] text-white/40 hover:text-white uppercase font-black tracking-widest border border-white/10 px-2 py-1 rounded"
                >
                  Clear Chat
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.map(message => {
                  const isUser = message.role === 'user';
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-base font-black ${
                        isUser ? 'bg-white/10 border border-white/20' : 'bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41]'
                      }`}>
                        {isUser ? '👤' : '⚽'}
                      </div>

                      <div className={`space-y-1 ${isUser ? 'text-right' : ''}`}>
                        <div className="flex items-center gap-2 text-[10px] text-white/40 font-black uppercase">
                          <span>{isUser ? 'Tactician (You)' : 'Tactico'}</span>
                          <span>•</span>
                          <span>{message.timestamp}</span>
                        </div>

                        <div className={`rounded-xl p-4 text-xs font-sans text-white/95 leading-relaxed whitespace-pre-line border ${
                          isUser
                            ? 'bg-white/5 border-white/10'
                            : 'bg-[#0A0A0A] border-[#00FF41]/20 shadow-[0_0_10px_rgba(0,255,65,0.02)]'
                        } prose prose-invert`}>
                          {message.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {isChatLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full shrink-0 bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41] flex items-center justify-center text-base animate-pulse">
                      🧠
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] text-white/40 font-black uppercase">Tactico is calculating...</div>
                      <div className="bg-[#0A0A0A] border border-[#00FF41]/10 rounded-xl px-4 py-3 text-xs text-white/50">
                        <span className="inline-flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-bounce" style={{ animationDelay: '300ms' }} />
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input form */}
              <div className="p-4 border-t border-white/10 bg-[#0A0A0A] shrink-0">
                <form onSubmit={handleSendChat} className="flex gap-2 max-w-4xl mx-auto">
                  <input
                    type="text"
                    required
                    disabled={isChatLoading}
                    placeholder="Ask about inverted fullbacks, Champions League favorites, or player stats..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="flex-1 bg-[#050505] border border-white/10 focus:border-[#00FF41] rounded px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isChatLoading}
                    className="px-5 bg-[#00FF41] hover:bg-white text-black text-xs font-black uppercase tracking-widest rounded transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* Bottom ticker banner matching "Bold Typography" footer style */}
      <footer className="bg-[#00FF41] text-black py-2.5 md:py-3 overflow-hidden border-t border-black/10 shrink-0 select-none">
        <div className="animate-ticker text-xs md:text-sm font-black uppercase italic tracking-wide">
          <span className="mx-6">Real Madrid 3-0 Alaves • FT</span>
          <span className="mx-6">Tottenham 2-1 Burnley • FT</span>
          <span className="mx-6">Everton 1-0 Sheffield Utd • FT</span>
          <span className="mx-6">West Ham 3-1 Luton • FT</span>
          <span className="mx-6">Newcastle 1-1 Brighton • FT</span>
          <span className="mx-6">Chelsea 2-3 Nottingham Forest • FT</span>
          <span className="mx-6">Bayern Munich 4-1 Stuttgart • FT</span>
          <span className="mx-6">Barcelona 2-1 Real Sociedad • FT</span>
          {/* Duplicated for smooth loop */}
          <span className="mx-6">Real Madrid 3-0 Alaves • FT</span>
          <span className="mx-6">Tottenham 2-1 Burnley • FT</span>
          <span className="mx-6">Everton 1-0 Sheffield Utd • FT</span>
          <span className="mx-6">West Ham 3-1 Luton • FT</span>
          <span className="mx-6">Newcastle 1-1 Brighton • FT</span>
          <span className="mx-6">Chelsea 2-3 Nottingham Forest • FT</span>
          <span className="mx-6">Bayern Munich 4-1 Stuttgart • FT</span>
          <span className="mx-6">Barcelona 2-1 Real Sociedad • FT</span>
        </div>
      </footer>

    </div>
  );
}
