import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, BookOpenIcon, TrendingUpIcon, TrophyIcon } from "lucide-react";

const LEVELS = [
    { code: "a1", label: "A1", name: "Beginner", color: "from-green-400 to-green-600", desc: "Cumprimentos, números, frases básicas" },
    { code: "a2", label: "A2", name: "Elementary", color: "from-blue-400 to-blue-600", desc: "Conversas simples, presente, passado" },
    { code: "b1", label: "B1", name: "Intermediate", color: "from-purple-400 to-purple-600", desc: "Opiniões, experiências, futuro" },
    { code: "b2", label: "B2", name: "Upper Intermediate", color: "from-orange-400 to-orange-600", desc: "Debates, condicionais, voz passiva" },
    { code: "c1", label: "C1", name: "Advanced", color: "from-red-400 to-red-600", desc: "Fluência, expressões idiomáticas" },
    { code: "c2", label: "C2", name: "Proficiency", color: "from-pink-400 to-pink-600", desc: "Domínio total, nuances, acadêmico" },
];

export default function MyCourses() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-brand-dark">
            <div className="flex-1 p-6 lg:p-10 max-w-5xl mx-auto w-full">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary mb-6 transition"
                >
                    <ArrowLeftIcon size={16} /> Voltar ao Dashboard
                </button>
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold">Meus Cursos</h1>
                    <p className="text-slate-400 mt-1">Escolha seu nível e comece a aprender.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {LEVELS.map(level => (
                        <button
                            key={level.code}
                            onClick={() => navigate(`/course/${level.code}`)}
                            className="group bg-white dark:bg-slate-800/20 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-all text-left"
                        >
                            <div className={`h-2 bg-gradient-to-r ${level.color}`} />
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-2xl font-bold">{level.label}</span>
                                    <TrendingUpIcon size={18} className="text-slate-300 group-hover:text-primary transition" />
                                </div>
                                <h3 className="font-semibold mb-1">{level.name}</h3>
                                <p className="text-xs text-slate-400 mb-3">{level.desc}</p>
                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <BookOpenIcon size={12} /> 24 lições
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <TrophyIcon size={12} /> 4 provas
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
