"use client"
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useThemeContext } from "../../context/ThemeContext";
import { getProgress } from "../../api/courseApi";
import {
  UserIcon,
  MailIcon,
  CalendarIcon,
  BookOpenIcon,
  TrophyIcon,
  AwardIcon,
  TrendingUpIcon,
  TargetIcon,
  ClockIcon,
  MedalIcon,
  SparklesIcon,
  StarIcon,
  ChevronRightIcon,
  Edit2Icon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const levelColors = {
  A1: "from-green-400 to-green-500",
  A2: "from-blue-400 to-blue-500",
  B1: "from-purple-400 to-purple-500",
  B2: "from-orange-400 to-orange-500",
  C1: "from-red-400 to-red-500",
  C2: "from-pink-400 to-pink-500",
};

/* ── Dados mock de progresso (fallback) ── */
const mockProgress = [
  { level: "A1", progress: 100, lessons: 24, score: 92, completed: true },
  { level: "A2", progress: 85, lessons: 20, score: 78, completed: false },
  { level: "B1", progress: 45, lessons: 11, score: 65, completed: false },
  { level: "B2", progress: 10, lessons: 3, score: 55, completed: false },
  { level: "C1", progress: 0, lessons: 0, score: 0, completed: false },
  { level: "C2", progress: 0, lessons: 0, score: 0, completed: false },
];

const skillsData = [
  { skill: "Reading", value: 85 },
  { skill: "Listening", value: 72 },
  { skill: "Speaking", value: 60 },
  { skill: "Writing", value: 78 },
  { skill: "Grammar", value: 82 },
  { skill: "Vocabulary", value: 75 },
];

export default function Profile() {
  const { user, logout } = useAuth();
  const { theme } = useThemeContext();
  const [progress, setProgress] = useState(mockProgress);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user?.id) {
      getProgress(user.id)
        .then((data) => {
          if (data && data.length > 0) {
            const mapped = data.map((p) => ({
              level: p.levelCode || p.level,
              progress: p.overallProgress || p.OverallProgress || 0,
              lessons: p.completedLessons?.length || 0,
              score: p.exerciseScores?.length > 0
                ? Math.round(p.exerciseScores.reduce((a, b) => a + b.score, 0) / p.exerciseScores.length)
                : 0,
              completed: p.completedAt != null || p.overallProgress >= 100,
            }));
            setProgress(mapped);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const totalLessons = progress.reduce((a, b) => a + b.lessons, 0);
  const avgScore = progress.filter((p) => p.score > 0).length
    ? Math.round(progress.filter((p) => p.score > 0).reduce((a, b) => a + b.score, 0) / progress.filter((p) => p.score > 0).length)
    : 0;
  const completedLevels = progress.filter((p) => p.completed).length;
  const overallProgress = Math.round(progress.reduce((a, b) => a + b.progress, 0) / progress.length);

  const currentYear = new Date().getFullYear();
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    : `${currentYear}`;

  const handleSaveName = () => {
    // TODO: call API to update name
    setEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">Meu Perfil</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Acompanhe seu progresso e conquistas</p>
        </div>
      </div>

      {/* ── User Info Card ── */}
      <div className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/20 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="size-20 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-3xl font-bold shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button onClick={handleSaveName} className="p-1.5 rounded-lg bg-primary text-white hover:bg-primary-dark transition">
                  <CheckIcon size={16} strokeWidth={2} />
                </button>
                <button onClick={() => { setEditing(false); setName(user?.name || ""); }} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200 transition">
                  <XIcon size={16} strokeWidth={2} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white">{user?.name}</h2>
                <button onClick={() => setEditing(true)} className="p-1 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                  <Edit2Icon size={14} strokeWidth={1.5} />
                </button>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><MailIcon size={14} strokeWidth={1.5} /> {user?.email}</span>
              <span className="flex items-center gap-1.5"><CalendarIcon size={14} strokeWidth={1.5} /> Membro desde {memberSince}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{overallProgress}%</p>
              <p className="text-xs text-slate-400">Geral</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-500">{totalLessons}</p>
              <p className="text-xs text-slate-400">Aulas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-500">{avgScore}%</p>
              <p className="text-xs text-slate-400">Média</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {[
          { id: "overview", label: "Visão Geral", icon: TrendingUpIcon },
          { id: "levels", label: "Níveis", icon: TargetIcon },
          { id: "certificates", label: "Certificados", icon: AwardIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shrink-0 ${
                isActive
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
              }`}
            >
              <Icon size={16} strokeWidth={1.5} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Overview Tab ── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: BookOpenIcon, label: "Aulas Feitas", value: totalLessons, color: "from-blue-400 to-blue-600" },
              { icon: TrophyIcon, label: "Níveis Completos", value: completedLevels, color: "from-yellow-400 to-yellow-600" },
              { icon: StarIcon, label: "Score Médio", value: `${avgScore}%`, color: "from-emerald-400 to-emerald-600" },
              { icon: MedalIcon, label: "Progresso", value: `${overallProgress}%`, color: "from-purple-400 to-purple-600" },
            ].map((stat, i) => (
              <div key={i} className="relative p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 overflow-hidden">
                <div className={`absolute top-0 right-0 size-16 rounded-bl-full bg-gradient-to-br ${stat.color} opacity-10`} />
                <stat.icon className="size-5 text-primary mb-2" strokeWidth={1.5} />
                <p className="text-lg md:text-xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Gráfico Radar + Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar Chart - Skills */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Habilidades</h3>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={skillsData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <Radar name="Skills" dataKey="value" stroke="#4895ef" fill="#4895ef" fillOpacity={0.3} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart - Progress by Level */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Progresso por Nível</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={progress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="level" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
                  <Bar dataKey="progress" name="Progresso (%)" fill="#4895ef" radius={[6, 6, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">📊 Progresso Detalhado</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50">
                    <th className="text-left px-3 py-2 font-medium text-slate-400 text-xs uppercase">Nível</th>
                    <th className="text-center px-3 py-2 font-medium text-slate-400 text-xs uppercase">Progresso</th>
                    <th className="text-center px-3 py-2 font-medium text-slate-400 text-xs uppercase">Aulas</th>
                    <th className="text-center px-3 py-2 font-medium text-slate-400 text-xs uppercase">Score</th>
                    <th className="text-center px-3 py-2 font-medium text-slate-400 text-xs uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.map((p) => (
                    <tr key={p.level} className="border-b border-slate-100 dark:border-slate-700/30">
                      <td className="px-3 py-3 font-semibold text-slate-800 dark:text-white">{p.level}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                            <div className={`h-full rounded-full bg-gradient-to-r ${levelColors[p.level] || "from-primary to-primary-light"}`}
                              style={{ width: `${p.progress}%` }} />
                          </div>
                          <span className="text-xs font-mono text-slate-500 w-8 text-right">{p.progress}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center text-slate-600 dark:text-slate-300">{p.lessons}</td>
                      <td className="px-3 py-3 text-center font-mono text-slate-600 dark:text-slate-300">{p.score > 0 ? `${p.score}%` : "-"}</td>
                      <td className="px-3 py-3 text-center">
                        {p.completed ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                            ✅ Completo
                          </span>
                        ) : p.progress > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            📖 Em andamento
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700/50 text-slate-400">
                            🔒 Bloqueado
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Levels Tab ── */}
      {activeTab === "levels" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {progress.map((p) => (
            <div key={p.level} className={`p-5 rounded-xl border ${
              p.completed
                ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10"
                : p.progress > 0
                ? "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-2xl font-bold bg-gradient-to-r ${levelColors[p.level]} bg-clip-text text-transparent`}>
                  {p.level}
                </span>
                {p.completed ? (
                  <TrophyIcon className="size-6 text-yellow-500" strokeWidth={1.5} />
                ) : p.progress > 0 ? (
                  <BookOpenIcon className="size-5 text-primary" strokeWidth={1.5} />
                ) : (
                  <span className="text-lg">🔒</span>
                )}
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Progresso</span>
                  <span>{p.progress}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${levelColors[p.level]} transition-all duration-700`}
                    style={{ width: `${p.progress}%` }} />
                </div>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>{p.lessons} aulas</span>
                <span>Score: {p.score > 0 ? `${p.score}%` : "-"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Certificates Tab ── */}
      {activeTab === "certificates" && (
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Certificados conquistados ao completar cada nível do curso.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {progress.map((p) => (
              <div
                key={p.level}
                className={`relative p-6 rounded-2xl border-2 text-center transition-all duration-300 ${
                  p.completed
                    ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 shadow-lg shadow-yellow-200/50 dark:shadow-yellow-900/20"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 opacity-50"
                }`}
              >
                {p.completed ? (
                  <>
                    <div className="flex justify-center mb-4">
                      <div className="size-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                        <AwardIcon className="size-8 text-white" strokeWidth={1.5} />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{p.level}</h3>
                    <p className="text-xs text-slate-500 mb-3">Certificado de Conclusão</p>
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 mb-3">
                      Score: {p.score}%
                    </div>
                    <button className="flex items-center justify-center gap-1 w-full px-3 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-medium transition">
                      <TrophyIcon size={14} strokeWidth={1.5} />
                      Ver Certificado
                    </button>
                  </>
                ) : p.progress > 0 ? (
                  <>
                    <div className="flex justify-center mb-4">
                      <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <BookOpenIcon className="size-8 text-slate-400" strokeWidth={1.5} />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{p.level}</h3>
                    <p className="text-xs text-slate-500 mb-3">Em andamento — {p.progress}%</p>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden mb-3">
                      <div className={`h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500`} style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="text-xs text-slate-400">{p.lessons} aulas concluídas</span>
                  </>
                ) : (
                  <>
                    <div className="flex justify-center mb-4">
                      <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <span className="text-2xl">🔒</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-400 dark:text-slate-600 mb-1">{p.level}</h3>
                    <p className="text-xs text-slate-400">Complete o nível anterior</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
