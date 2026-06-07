import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getLessonsByLevel, getProgressByLevel, getTestByModule } from "../api/courseApi";
import {
    BookOpenIcon,
    CheckCircleIcon,
    CircleIcon,
    PlayCircleIcon,
    TrophyIcon,
    ArrowLeftIcon,
    LockIcon,
} from "lucide-react";

const LEVELS = {
    A1: { name: "Beginner", label: "A1", order: 1 },
    A2: { name: "Elementary", label: "A2", order: 2 },
    B1: { name: "Intermediate", label: "B1", order: 3 },
    B2: { name: "Upper Intermediate", label: "B2", order: 4 },
    C1: { name: "Advanced", label: "C1", order: 5 },
    C2: { name: "Proficiency", label: "C2", order: 6 },
};

const MODULES = [
    { id: "m1", title: "Module 1", lessons: 6 },
    { id: "m2", title: "Module 2", lessons: 6 },
    { id: "m3", title: "Module 3", lessons: 6 },
    { id: "m4", title: "Module 4", lessons: 6 },
];

export default function CoursePage() {
    const { levelCode } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const level = LEVELS[levelCode?.toUpperCase()];

    const [lessons, setLessons] = useState([]);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            if (!user) return;
            const [lessonsData, progressData] = await Promise.all([
                getLessonsByLevel(levelCode.toUpperCase()),
                getProgressByLevel(user.id, levelCode.toUpperCase()),
            ]);
            setLessons(lessonsData || []);
            setProgress(progressData);
            setLoading(false);
        }
        load();
    }, [levelCode, user]);

    if (!level) return <div className="p-10 text-center text-slate-400">Nível não encontrado.</div>;

    if (loading) return <div className="p-10 text-center text-slate-400">Carregando...</div>;

    // Group lessons by module
    const lessonsByModule = {};
    MODULES.forEach(m => {
        lessonsByModule[m.id] = lessons.filter(l => l.moduleId === m.id);
    });

    const completedCount = progress?.completedLessons?.length || 0;
    const totalLessons = lessons.length || 24;
    const overallProgress = progress?.overallProgress || 0;

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-brand-dark">
            {/* Sidebar - Level Progress */}
            <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900 p-6 hidden lg:block">
                <Link to="/my-courses" className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary mb-6">
                    <ArrowLeftIcon size={16} /> Voltar
                </Link>
                <div className="flex items-center gap-3 mb-4">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpenIcon size={20} className="text-primary" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold">{level.label}</h2>
                        <p className="text-xs text-slate-400">{level.name}</p>
                    </div>
                </div>
                <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Progresso</span>
                        <span className="font-medium">{Math.round(overallProgress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${overallProgress}%` }}
                        />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{completedCount}/{totalLessons} lições</p>
                </div>

                {/* Level list */}
                <div className="space-y-1 mt-6">
                    {Object.values(LEVELS).map(lvl => (
                        <button
                            key={lvl.label}
                            onClick={() => navigate(`/course/${lvl.label.toLowerCase()}`)}
                            className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                                lvl.label === level.label
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                        >
                            {lvl.label} — {lvl.name}
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6 lg:p-10">
                {/* Mobile back button */}
                <Link to="/my-courses" className="lg:hidden flex items-center gap-2 text-sm text-slate-400 hover:text-primary mb-6">
                    <ArrowLeftIcon size={16} /> Voltar aos cursos
                </Link>

                <h1 className="text-2xl font-semibold mb-1">
                    {level.label} — {level.name}
                </h1>
                <p className="text-slate-400 mb-8">Complete todas as lições para avançar ao próximo nível.</p>

                {/* Module sections */}
                <div className="space-y-8">
                    {MODULES.map((mod, modIndex) => {
                        const modLessons = lessonsByModule[mod.id] || [];
                        const modCompleted = modLessons.filter(l => progress?.completedLessons?.includes(l.id)).length;
                        const modTotal = modLessons.length || mod.lessons;
                        const isLocked = modIndex > 0 && (lessonsByModule[MODULES[modIndex - 1].id]?.length || 0) > 0 &&
                            (lessonsByModule[MODULES[modIndex - 1].id] || []).some(l => !progress?.completedLessons?.includes(l.id));

                        return (
                            <div key={mod.id} className="bg-white dark:bg-slate-800/20 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                {/* Module header */}
                                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {isLocked ? <LockIcon size={18} className="text-slate-300" /> : <BookOpenIcon size={18} className="text-primary" />}
                                        <h2 className="font-semibold">{mod.title}</h2>
                                        <span className="text-xs text-slate-400">
                                            {modCompleted}/{modTotal} lições
                                        </span>
                                    </div>
                                    {/* Module test badge */}
                                    {modCompleted === modTotal && modTotal > 0 && (
                                        <Link
                                            to={`/test/module/${mod.id}/${levelCode.toUpperCase()}`}
                                            className="flex items-center gap-1 text-xs text-success font-medium"
                                        >
                                            <TrophyIcon size={14} /> Prova do Módulo
                                        </Link>
                                    )}
                                </div>

                                {/* Lessons list */}
                                <div className={`divide-y divide-slate-100 dark:divide-slate-800 ${isLocked ? "opacity-50 pointer-events-none" : ""}`}>
                                    {modLessons.length === 0 ? (
                                        <p className="px-6 py-4 text-sm text-slate-400">
                                            Lições em breve...
                                        </p>
                                    ) : (
                                        modLessons.sort((a, b) => a.order - b.order).map((lesson) => {
                                            const isComplete = progress?.completedLessons?.includes(lesson.id);
                                            return (
                                                <button
                                                    key={lesson.id}
                                                    onClick={() => navigate(`/lesson/${lesson.id}`)}
                                                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition text-left"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {isComplete ? (
                                                            <CheckCircleIcon size={20} className="text-success flex-shrink-0" />
                                                        ) : (
                                                            <PlayCircleIcon size={20} className="text-primary flex-shrink-0" />
                                                        )}
                                                        <span className={`text-sm ${isComplete ? "text-slate-400 line-through" : ""}`}>
                                                            Lesson {lesson.order}: {lesson.title}
                                                        </span>
                                                    </div>
                                                    {lesson.estimatedMinutes && (
                                                        <span className="text-xs text-slate-400">{lesson.estimatedMinutes}min</span>
                                                    )}
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
