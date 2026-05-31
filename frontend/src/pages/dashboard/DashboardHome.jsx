import { useAuth } from "../../context/AuthContext";
import { BookOpenIcon, AwardIcon, ClockIcon } from "lucide-react";

const stats = [
    { icon: BookOpenIcon, label: "Cursos Ativos", value: "0", color: "text-primary" },
    { icon: ClockIcon, label: "Horas Estudadas", value: "0", color: "text-primary" },
    { icon: AwardIcon, label: "Certificados", value: "0", color: "text-primary" },
];

export default function DashboardHome() {
    const { user } = useAuth();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold">
                    Olá, {user?.name?.split(" ")[0]} 👋
                </h1>
                <p className="text-slate-400 mt-1">
                    Bem-vindo ao seu painel de aprendizado.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/20"
                    >
                        <stat.icon className={`size-6 ${stat.color}`} />
                        <p className="text-2xl font-semibold mt-3">{stat.value}</p>
                        <p className="text-sm text-slate-400">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Placeholder content */}
            <div className="p-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                <p className="text-slate-400">
                    Seus cursos aparecerão aqui quando você se inscrever.
                </p>
            </div>
        </div>
    );
}
