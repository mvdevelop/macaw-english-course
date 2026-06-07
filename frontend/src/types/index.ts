import type { LucideIcon } from "lucide-react";

// ─── Core Domain Models ───

export interface User {
  id?: string;
  name: string;
  email: string;
  passwordHash?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  message: string;
}

export interface Course {
  id?: string;
  name: string;
  description: string;
  level: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Student {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Navigation ───

export interface NavLink {
  name: string;
  href: string;
}

export interface SidebarLink {
  icon: LucideIcon;
  label: string;
  href: string;
}

// ─── Data Types ───

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PricingFeature {
  name: string;
  icon: LucideIcon;
}

export interface PricingPlan {
  title: string;
  price: number;
  features: PricingFeature[];
  buttonText: string;
  mostPopular?: boolean;
}

export interface LevelData {
  code: string;
  label: string;
  name: string;
  color: string;
  icon: LucideIcon;
  description_key: string;
  topics_key: string;
}

export interface CompanyLogo {
  name: string;
  logo: string;
}

// ─── Hall of Fame / Ranking ───

export interface PodiumEntry {
  name: string;
  level: string;
  score: number;
  badge: string;
  image: string;
  lessons: number;
  streak: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  level: string;
  xp: number;
  progress: number;
  avatar: string;
}

export interface WeeklyActivity {
  day: string;
  aulas: number;
  exercicios: number;
}

export interface Badge {
  name: string;
  emoji: string;
  desc: string;
}

export interface Review {
  name: string;
  level: string;
  rating: number;
  image: string;
  comment: string;
}

export interface StatsData {
  totalStudents: number;
  lessonsCompleted: number;
  avgXP: number;
  streakDays: number;
}

// ─── AI Practice Types ───

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface ReadingExercise {
  title: string;
  text: string;
  questions: Question[];
}

export interface SpeakingTopic {
  topic: string;
  questions: string[];
  vocabulary: string[];
}

export interface ListeningExercise {
  title: string;
  text: string;
  questions: Question[];
}

export interface WritingPrompt {
  title: string;
  prompt: string;
  wordCount: string;
  tips: string[];
}

export interface SpeakingEvaluation {
  score: number;
  grammar: string;
  vocabulary: string;
  pronunciation: string;
  suggestions: string[];
  correctedVersion: string;
}

export interface ScoreDetail {
  score: number;
  feedback: string;
  issues?: string[];
  suggestions?: string[];
}

export interface WritingEvaluation {
  score: number;
  grammar: ScoreDetail;
  vocabulary: ScoreDetail;
  structure: ScoreDetail;
  relevance: ScoreDetail;
  correctedVersion: string;
  overallFeedback: string;
}

// ─── Auth Context ───

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  signup: (name: string, email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
}

// ─── Theme Context ───

export interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

// ─── i18n ───

export type Lang = "pt" | "en" | "es";
export type TranslationDict = Record<string, string>;

export interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

// ─── Speech Hooks ───

export type SpeechStatus = "idle" | "listening" | "processing" | "done" | "error";

export interface SpeechRecognitionReturn {
  status: SpeechStatus;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  isSupported: boolean;
  startListening: (lang?: string) => void;
  stopListening: () => void;
  reset: () => void;
}

export interface SpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  voice?: SpeechSynthesisVoice | null;
}

export interface SpeechSynthesisReturn {
  speaking: boolean;
  supported: boolean;
  speak: (text: string, options?: SpeechOptions) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  getVoices: (lang?: string) => SpeechSynthesisVoice[];
}

// ─── API Types ───

export interface AiRequest {
  prompt: string;
  context?: string;
}

export interface AiResponse {
  text?: string;
  error?: string;
  rawResponse?: string;
  retryAfter?: number;
}

// ─── Progress Types ───

export interface StudentProgress {
  id?: string;
  studentId: string;
  levelCode: string;
  completedLessons: string[];
  overallProgress: number;
  startedAt: string;
  updatedAt: string;
}

export interface CompleteLessonRequest {
  studentId: string;
  levelCode: string;
  lessonId: string;
  score: number;
  total: number;
}

// ─── Message Types ───

export interface Message {
  id?: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  text: string;
  sentAt: string;
  isRead: boolean;
}

export interface Conversation {
  userId: string;
  userName: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

// ─── Mock Data ───

export interface MockData {
  reading: ReadingExercise;
  speaking: SpeakingTopic;
  listening: ListeningExercise;
  writing: WritingPrompt;
}

// ─── Dashboard Stat ───

export interface DashboardStat {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}

// ─── AI Practice Tab ───

export interface AIPracticeTab {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

// ─── Tab Config for AIPractice ───

export type PracticeStatus = "idle" | "loading" | "active" | "feedback" | "error" | "recording" | "processing";
