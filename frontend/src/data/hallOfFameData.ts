import type { StatsData, PodiumEntry, LeaderboardEntry, WeeklyActivity, Badge, Review } from '../types';

const avatar = (name: string) =>
  `https://api.dicebear.com/9.x/adventurer/png?seed=${encodeURIComponent(name)}&size=128&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

/* ── Estatísticas gerais ── */
export const statsData: StatsData = {
  totalStudents: 5247,
  lessonsCompleted: 38420,
  avgXP: 2850,
  streakDays: 7,
};

/* ── Pódio Top 3 ── */
export const podiumData: PodiumEntry[] = [
  {
    name: "Lucas Mendes",
    level: "C1",
    score: 9850,
    badge: "🏆",
    image: avatar("Lucas Mendes"),
    lessons: 147,
    streak: 89,
  },
  {
    name: "Ana Carolina",
    level: "B2",
    score: 9520,
    badge: "🥈",
    image: avatar("Ana Carolina"),
    lessons: 134,
    streak: 72,
  },
  {
    name: "Pedro Santos",
    level: "C2",
    score: 9780,
    badge: "🥉",
    image: avatar("Pedro Santos"),
    lessons: 158,
    streak: 94,
  },
];

/* ── Leaderboard (Top 10) ── */
export const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "Lucas Mendes", level: "C1", xp: 9850, progress: 98, avatar: avatar("Lucas Mendes") },
  { rank: 2, name: "Pedro Santos", level: "C2", xp: 9780, progress: 97, avatar: avatar("Pedro Santos") },
  { rank: 3, name: "Ana Carolina", level: "B2", xp: 9520, progress: 95, avatar: avatar("Ana Carolina") },
  { rank: 4, name: "Mariana Oliveira", level: "B2", xp: 8740, progress: 87, avatar: avatar("Mariana Oliveira") },
  { rank: 5, name: "Rafael Costa", level: "B1", xp: 8120, progress: 81, avatar: avatar("Rafael Costa") },
  { rank: 6, name: "Juliana Ferreira", level: "A2", xp: 7650, progress: 76, avatar: avatar("Juliana Ferreira") },
  { rank: 7, name: "Thiago Almeida", level: "C1", xp: 7230, progress: 72, avatar: avatar("Thiago Almeida") },
  { rank: 8, name: "Camila Rodrigues", level: "B1", xp: 6890, progress: 68, avatar: avatar("Camila Rodrigues") },
  { rank: 9, name: "Felipe Martins", level: "C2", xp: 6540, progress: 65, avatar: avatar("Felipe Martins") },
  { rank: 10, name: "Beatriz Lima", level: "A2", xp: 6120, progress: 61, avatar: avatar("Beatriz Lima") },
];

/* ── Dados para o gráfico semanal ── */
export const weeklyActivityData: WeeklyActivity[] = [
  { day: "Seg", aulas: 12, exercicios: 8 },
  { day: "Ter", aulas: 18, exercicios: 12 },
  { day: "Qua", aulas: 15, exercicios: 10 },
  { day: "Qui", aulas: 22, exercicios: 14 },
  { day: "Sex", aulas: 10, exercicios: 6 },
  { day: "Sáb", aulas: 8, exercicios: 4 },
  { day: "Dom", aulas: 5, exercicios: 3 },
];

/* ── Emblemas / Conquistas ── */
export const badges: Badge[] = [
  { name: "Foguete", emoji: "🚀", desc: "Completou 10 aulas em um dia" },
  { name: "Fogo", emoji: "🔥", desc: "30 dias de streak" },
  { name: "Cérebro", emoji: "🧠", desc: "Acertou 100% num teste" },
  { name: "Raio", emoji: "⚡", desc: "Evoluiu de nível em 1 mês" },
  { name: "Coroa", emoji: "👑", desc: "Top 1 do ranking" },
];

/* ── Reviews originais ── */
export const reviewsData: Review[] = [
  {
    name: "Mariana Oliveira",
    level: "B1 → B2",
    rating: 5,
    image: avatar("Mariana Oliveira"),
    comment: "A plataforma é incrível! Os professores são muito atenciosos e o método funciona de verdade. Consegui minha certificação IELTS.",
  },
  {
    name: "Rafael Costa",
    level: "A2 → B1",
    rating: 5,
    image: avatar("Rafael Costa"),
    comment: "Melhor investimento que fiz. As aulas são dinâmicas e o suporte é excelente. Recomendo para todos os níveis.",
  },
  {
    name: "Juliana Ferreira",
    level: "A1 → A2",
    rating: 5,
    image: avatar("Juliana Ferreira"),
    comment: "Comecei do zero e já consigo manter conversas básicas. O conteúdo é muito bem estruturado e divertido.",
  },
  {
    name: "Thiago Almeida",
    level: "B2 → C1",
    rating: 4,
    image: avatar("Thiago Almeida"),
    comment: "A qualidade dos professores nativos faz toda a diferença. O progresso é visível semana a semana.",
  },
  {
    name: "Camila Rodrigues",
    level: "A1 → B1",
    rating: 5,
    image: avatar("Camila Rodrigues"),
    comment: "Em 6 meses saí do absoluto zero para o intermediário. A metodologia da Macaw é realmente diferenciada.",
  },
  {
    name: "Felipe Martins",
    level: "C1 → C2",
    rating: 5,
    image: avatar("Felipe Martins"),
    comment: "Precisava do C2 para uma vaga internacional e consegui! A preparação para o exame foi impecável.",
  },
];
