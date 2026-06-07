"use client"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VideoIcon, SendIcon, CheckCircleIcon, ArrowRightIcon, TrophyIcon, StarIcon, ZapIcon, BookOpenIcon, UsersIcon, FlameIcon, MedalIcon, CrownIcon, SparklesIcon, TrendingUpIcon, GraduationCapIcon, ChevronRightIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { levelsData } from "../data/levelsData";
import { podiumData, reviewsData, statsData, leaderboardData, weeklyActivityData, badges } from "../data/hallOfFameData";
import SectionTitle from "../components/SectionTitle";
import { useThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { FaqSection } from "../sections/FaqSection";
import { useTranslation } from "../i18n/LanguageContext";

export default function Page() {
    const { theme } = useThemeContext();
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
    const [contactSent, setContactSent] = useState(false);

    const handleContactSubmit = (e) => {
        e.preventDefault();
        setContactSent(true);
        setContactForm({ name: "", email: "", message: "" });
        setTimeout(() => setContactSent(false), 4000);
    };

    return (
        <>
            <div id="home" className="relative h-[80vh] min-h-[580px] overflow-hidden">
                {/* Background Carousel — começa após a navbar (top-20) */}
                <div className="absolute top-20 left-0 right-0 bottom-0 z-0">
                    <Swiper
                        modules={[Autoplay, Pagination, EffectFade]}
                        effect="fade"
                        fadeEffect={{ crossFade: true }}
                        speed={1500}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        pagination={{ clickable: false }}
                        loop={true}
                        className="w-full h-full"
                    >
                        {[
                            { src: "https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=2070&auto=format&fit=crop", alt: "Estátua da Liberdade - Nova York, EUA" },
                            { src: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop", alt: "London Eye - Londres, Reino Unido" },
                            { src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop", alt: "Torre Eiffel - Paris, Europa" },
                            { src: "https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=2070&auto=format&fit=crop", alt: "Veneza - Itália, Europa" },
                        ].map((img, i) => (
                            <SwiperSlide key={i}>
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className="w-full h-full object-cover"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Spacer da navbar */}
                <div className="h-20" />

                {/* Content — centralizado no espaço útil abaixo da navbar */}
                <div className="h-[calc(100%-80px)] flex flex-col items-center justify-center text-center px-4 relative z-10">
                    <div className="mb-3">
                        <p className="text-base md:text-lg font-medium text-white/70 tracking-wide" style={{textShadow: "0 1px 6px rgba(0,0,0,0.5)"}}>
                            Welcome to Macaw English School
                        </p>
                    </div>
                    <h1 className="text-5xl/15 md:text-[64px]/19 font-semibold max-w-2xl text-white" style={{textShadow: "0 2px 10px rgba(0,0,0,0.5)"}}>
                        {t("hero.title_start")}{" "}
                        <span className="text-primary" style={{textShadow: "0 2px 10px rgba(0,0,0,0.5)"}}>{t("hero.title_highlight")}</span>
                    </h1>
                    <p className="text-base text-white/90 max-w-lg mt-2" style={{textShadow: "0 1px 6px rgba(0,0,0,0.5)"}}>
                        {t("hero.subtitle")}
                    </p>
                    <div className="flex items-center gap-4 mt-8 justify-center">
                        <button
                            onClick={() => navigate(user ? "/dashboard" : "/login")}
                            className="bg-primary hover:bg-primary-dark transition text-white rounded-md px-6 h-11 shadow-lg shadow-primary/25"
                        >
                            {t("hero.startNow")}
                        </button>
                        <button className="flex items-center gap-2 border border-white/30 hover:border-white/50 transition text-white rounded-md px-6 h-11 backdrop-blur-sm bg-white/10">
                            <VideoIcon strokeWidth={1} />
                            <span>{t("hero.trialClass")}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Gradient transition: Hero → Levels */}
            <div className="h-16 bg-gradient-to-b from-white to-[#f0f5ff] dark:from-gray-950 dark:to-[#0a0a1a]" />

            {/* Níveis CEFR — do A1 ao C2 */}
            <div className="relative pt-16 pb-28 overflow-hidden bg-[#f0f5ff] dark:bg-[#0a0a1a]">
                {/* ── Elementos flutuantes de fundo ── */}
                <motion.div
                    className="absolute -top-20 -left-20 size-72 rounded-full bg-gradient-to-br from-primary/10 to-blue-300/10 dark:from-primary/5 dark:to-blue-500/5 blur-3xl"
                    animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-40 -right-32 size-96 rounded-full bg-gradient-to-br from-purple-300/10 to-pink-300/10 dark:from-purple-500/5 dark:to-pink-500/5 blur-3xl"
                    animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -bottom-20 left-1/3 size-64 rounded-full bg-gradient-to-br from-emerald-300/10 to-teal-300/10 dark:from-emerald-500/5 dark:to-teal-500/5 blur-3xl"
                    animate={{ x: [0, 25, 0], y: [0, 15, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* ── Pequenos círculos decorativos ── */}
                <motion.div
                    className="absolute top-32 left-[15%] size-3 rounded-full bg-primary/20 dark:bg-primary/10"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                    className="absolute top-60 right-[20%] size-2 rounded-full bg-purple-400/30 dark:bg-purple-400/10"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
                />
                <motion.div
                    className="absolute bottom-40 left-[30%] size-4 rounded-full bg-emerald-400/20 dark:bg-emerald-400/10"
                    animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                />

                <SectionTitle text1={t("levels.label")} text2={t("levels.title")} text3={t("levels.subtitle")} />

                {/* ── Subtítulo com ícone ── */}
                <motion.div
                    className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-400 dark:text-slate-500"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <GraduationCapIcon className="size-4" strokeWidth={1.5} />
                    <span>Do zero à fluência — método comprovado</span>
                </motion.div>

                {/* ── Cards de Nível ── */}
                <div id="cursos" className="flex flex-wrap items-start justify-center gap-6 mt-12 px-6 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto">
                    {levelsData.map((level, index) => {
                        return (
                            <motion.div
                                key={level.code}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index, duration: 0.5, ease: "easeOut" }}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className="group p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 bg-white/90 dark:bg-slate-800/30 backdrop-blur-sm max-w-80 w-full hover:shadow-xl hover:shadow-black/5 transition-shadow duration-300 relative overflow-hidden"
                            >
                                {/* ── Brilho superior no hover ── */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${level.color} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500`} />

                                {/* ── Barra colorida superior ── */}
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${level.color} opacity-60 group-hover:opacity-100 transition-opacity`} />

                                {/* ── Ícone com glow ── */}
                                <motion.div
                                    whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.1 }}
                                    transition={{ duration: 0.5 }}
                                    className={`inline-flex items-center justify-center size-14 rounded-xl bg-gradient-to-br ${level.color} text-white mb-4 shadow-lg shadow-black/10 group-hover:shadow-xl transition-shadow`}
                                >
                                    <level.icon className="size-7" strokeWidth={1.5} />
                                </motion.div>

                                {/* ── Label + Nome ── */}
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xl font-bold bg-gradient-to-r ${level.color} bg-clip-text text-transparent`}>
                                        {level.label}
                                    </span>
                                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                        {t(`level.${level.code}.name`)}
                                    </span>
                                </div>

                                {/* ── Descrição ── */}
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                                    {t(level.description_key)}
                                </p>

                                {/* ── Tópicos ── */}
                                <div className="space-y-2">
                                    {t(level.topics_key).split(" • ").slice(0, 4).map((topic, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 * i }}
                                            className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
                                        >
                                            <div className={`size-1.5 rounded-full bg-gradient-to-r ${level.color} shrink-0`} />
                                            <span>{topic.trim()}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* ── Botão "Ver mais" ── */}
                                <motion.button
                                    whileHover={{ x: 3 }}
                                    className="mt-5 flex items-center gap-1 text-xs font-medium text-primary group-hover:text-primary-dark transition-colors"
                                >
                                    Explorar nível
                                    <ChevronRightIcon className="size-3.5" strokeWidth={2} />
                                </motion.button>
                            </motion.div>
                        );
                    })}
                </div>

                {/* ── Badge final ── */}
                <motion.div
                    className="flex items-center justify-center gap-2 mt-14 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 shadow-sm text-sm text-slate-500 dark:text-slate-400">
                        <GraduationCapIcon className="size-4 text-primary" strokeWidth={1.5} />
                        Teste de nivelamento gratuito disponível
                        <ChevronRightIcon className="size-4 text-primary" strokeWidth={2} />
                    </span>
                </motion.div>
            </div>

            {/* Gradient transition: Levels → Hall of Fame */}
            <div className="h-20 bg-gradient-to-b from-[#f0f5ff] to-white dark:from-[#0a0a1a] dark:to-gray-950" />

            {/* Hall da Fama — Dashboard Gamificado */}
            <div id="ranking" className="relative pt-20 pb-20">
                <SectionTitle text1={t("hall.label")} text2={t("hall.title")} text3={t("hall.subtitle")} />

                {/* ── Stats Cards ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-12 px-6 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto">
                    {[
                        { icon: UsersIcon, label: "Alunos Ativos", value: statsData.totalStudents.toLocaleString(), color: "from-blue-400 to-blue-600" },
                        { icon: BookOpenIcon, label: "Aulas Concluídas", value: statsData.lessonsCompleted.toLocaleString(), color: "from-emerald-400 to-emerald-600" },
                        { icon: ZapIcon, label: "XP Médio", value: statsData.avgXP.toLocaleString(), color: "from-purple-400 to-purple-600" },
                        { icon: FlameIcon, label: "Streak Geral", value: `${statsData.streakDays} dias`, color: "from-orange-400 to-orange-600" },
                    ].map((stat, i) => (
                        <div key={i} className="relative p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 overflow-hidden group hover:shadow-lg hover:shadow-black/5 transition-all duration-300">
                            <div className={`absolute top-0 right-0 size-20 rounded-bl-full bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                            <stat.icon className="size-5 md:size-6 text-primary mb-2" strokeWidth={1.5} />
                            <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                            <p className="text-lg md:text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* ── Podium + Gráfico lado a lado ── */}
                <div className="mt-16 px-6 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">

                    {/* Podium — 3 colunas */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center gap-2 mb-8">
                            <MedalIcon className="size-5 text-yellow-500" strokeWidth={1.5} />
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Top 3 Alunos</h3>
                        </div>
                        <div className="flex items-end justify-center gap-3 md:gap-5">
                            {/* 2º lugar */}
                            <div className="flex flex-col items-center w-1/3">
                                <div className="relative">
                                    <img src={podiumData[1].image} alt={podiumData[1].name} className="size-14 md:size-20 rounded-full border-[3px] border-slate-300 dark:border-slate-600 object-cover" />
                                    <div className="absolute -top-1.5 -right-1.5 size-6 md:size-7 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-xs font-bold text-white">2</div>
                                </div>
                                <p className="mt-2 font-semibold text-xs md:text-sm text-center text-slate-800 dark:text-white">{podiumData[1].name}</p>
                                <p className="text-[10px] md:text-xs text-primary font-medium">{podiumData[1].level}</p>
                                <div className="mt-2 w-full max-w-[100px]">
                                    <div className="relative h-20 md:h-28 bg-slate-100 dark:bg-slate-700/50 rounded-t-lg overflow-hidden">
                                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-500 rounded-t-lg transition-all duration-700" style={{ height: "85%" }} />
                                    </div>
                                </div>
                                <p className="mt-1.5 text-xs font-bold text-slate-500">{podiumData[1].score.toLocaleString()} XP</p>
                            </div>

                            {/* 1º lugar */}
                            <div className="flex flex-col items-center w-1/3 -mt-6">
                                <CrownIcon className="size-5 md:size-6 text-yellow-400 mb-1" strokeWidth={1.5} />
                                <div className="relative">
                                    <img src={podiumData[0].image} alt={podiumData[0].name} className="size-16 md:size-24 rounded-full border-[3px] border-yellow-400 object-cover ring-2 ring-yellow-200" />
                                    <div className="absolute -top-1.5 -right-1.5 size-6 md:size-8 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold text-yellow-900">1</div>
                                </div>
                                <p className="mt-2 font-semibold text-sm md:text-base text-center text-slate-800 dark:text-white">{podiumData[0].name}</p>
                                <p className="text-xs text-primary font-medium">{podiumData[0].level}</p>
                                <div className="mt-2 w-full max-w-[120px]">
                                    <div className="relative h-24 md:h-36 bg-slate-100 dark:bg-slate-700/50 rounded-t-lg overflow-hidden">
                                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-t-lg transition-all duration-700" style={{ height: "100%" }} />
                                    </div>
                                </div>
                                <p className="mt-1.5 text-xs font-bold text-yellow-500">{podiumData[0].score.toLocaleString()} XP</p>
                            </div>

                            {/* 3º lugar */}
                            <div className="flex flex-col items-center w-1/3">
                                <div className="relative">
                                    <img src={podiumData[2].image} alt={podiumData[2].name} className="size-14 md:size-20 rounded-full border-[3px] border-amber-600 dark:border-amber-700 object-cover" />
                                    <div className="absolute -top-1.5 -right-1.5 size-6 md:size-7 rounded-full bg-amber-600 dark:bg-amber-700 flex items-center justify-center text-xs font-bold text-white">3</div>
                                </div>
                                <p className="mt-2 font-semibold text-xs md:text-sm text-center text-slate-800 dark:text-white">{podiumData[2].name}</p>
                                <p className="text-[10px] md:text-xs text-primary font-medium">{podiumData[2].level}</p>
                                <div className="mt-2 w-full max-w-[100px]">
                                    <div className="relative h-16 md:h-24 bg-slate-100 dark:bg-slate-700/50 rounded-t-lg overflow-hidden">
                                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-amber-600 to-amber-500 dark:from-amber-800 dark:to-amber-700 rounded-t-lg transition-all duration-700" style={{ height: "70%" }} />
                                    </div>
                                </div>
                                <p className="mt-1.5 text-xs font-bold text-slate-500">{podiumData[2].score.toLocaleString()} XP</p>
                            </div>
                        </div>
                    </div>

                    {/* Gráfico Semanal — 2 colunas */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUpIcon className="size-5 text-emerald-500" strokeWidth={1.5} />
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Atividade Semanal</h3>
                        </div>
                        <div className="p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30">
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={weeklyActivityData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                                    <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: 12,
                                            border: "1px solid #e2e8f0",
                                            fontSize: 13,
                                        }}
                                    />
                                    <Bar dataKey="aulas" name="Aulas" fill="#4895ef" radius={[6, 6, 0, 0]} barSize={20} />
                                    <Bar dataKey="exercicios" name="Exercícios" fill="#6db0f7" radius={[6, 6, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* ── Leaderboard Top 10 ── */}
                <div className="mt-16 px-6 md:px-16 lg:px-24 xl:px-32 max-w-5xl mx-auto">
                    <div className="flex items-center gap-2 mb-6">
                        <MedalIcon className="size-5 text-primary" strokeWidth={1.5} />
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Ranking Geral</h3>
                    </div>
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50">
                                        <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">#</th>
                                        <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Aluno</th>
                                        <th className="text-center px-4 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Nível</th>
                                        <th className="text-center px-4 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">XP</th>
                                        <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Progresso</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboardData.map((student) => (
                                        <tr key={student.rank} className={`border-b border-slate-100 dark:border-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors ${student.rank <= 3 ? "bg-amber-50/50 dark:bg-amber-900/10" : ""}`}>
                                            <td className="px-4 py-3">
                                                {student.rank <= 3 ? (
                                                    <span className="text-lg">{["🥇", "🥈", "🥉"][student.rank - 1]}</span>
                                                ) : (
                                                    <span className="text-slate-400 font-mono">{student.rank}</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <img src={student.avatar} alt={student.name} className="size-8 rounded-full" />
                                                    <span className="font-medium text-slate-800 dark:text-white">{student.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">{student.level}</span>
                                            </td>
                                            <td className="px-4 py-3 text-center font-mono font-bold text-slate-700 dark:text-slate-200">{student.xp.toLocaleString()}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-700 ${student.rank === 1 ? "bg-gradient-to-r from-yellow-400 to-yellow-300" : student.rank === 2 ? "bg-gradient-to-r from-slate-400 to-slate-300" : student.rank === 3 ? "bg-gradient-to-r from-amber-600 to-amber-500" : "bg-gradient-to-r from-primary to-primary-light"}`}
                                                            style={{ width: `${student.progress}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-mono text-slate-500 w-8 text-right">{student.progress}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ── Badges / Conquistas ── */}
                <div className="mt-16 px-6 md:px-16 lg:px-24 xl:px-32 max-w-5xl mx-auto">
                    <div className="flex items-center gap-2 mb-6">
                        <SparklesIcon className="size-5 text-purple-500" strokeWidth={1.5} />
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Conquistas</h3>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {badges.map((badge, i) => (
                            <div key={i} className="group relative flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 hover:shadow-md hover:shadow-black/5 transition-all duration-300 cursor-default">
                                <span className="text-2xl">{badge.emoji}</span>
                                <div>
                                    <p className="text-sm font-medium text-slate-800 dark:text-white">{badge.name}</p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{badge.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Reviews ── */}
                <div className="mt-16 px-6 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 mb-6">
                        <StarIcon className="size-5 text-yellow-400" strokeWidth={1.5} />
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Depoimentos</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {reviewsData.slice(0, 6).map((review, index) => (
                            <div key={index} className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 hover:shadow-lg hover:shadow-black/5 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                    <img src={review.image} alt={review.name} className="size-10 rounded-full object-cover" />
                                    <div>
                                        <p className="font-medium text-sm text-slate-800 dark:text-white">{review.name}</p>
                                        <p className="text-xs text-primary">{review.level}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-0.5 mb-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <StarIcon key={i} className={`size-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200 dark:text-slate-600"}`} />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <FaqSection />

            {/* Gradient transition: FAQ → Contact */}
            <div className="h-28 bg-gradient-to-b from-white to-[#1a1a2e] dark:from-gray-950 dark:to-[#12121f]" />

            {/* Contact Section — cinza chumbo */}
            <div id="contato" className="bg-[#1a1a2e] dark:bg-[#12121f]">
                <div className="max-w-5xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-semibold text-white">{t("contact.title")}</h2>
                        <p className="text-slate-300 max-w-lg mx-auto mt-3">{t("contact.subtitle")}</p>
                    </div>
                    {contactSent ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <CheckCircleIcon className="size-16 text-primary mb-4" />
                            <h3 className="text-xl font-semibold text-white">{t("contact.success")}</h3>
                            <p className="text-slate-300 mt-2">{t("contact.successMsg")}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleContactSubmit} className="max-w-xl mx-auto space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">{t("contact.nameLabel")}</label>
                                <input
                                    type="text"
                                    required
                                    value={contactForm.name}
                                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-[#2a2a3e] border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                    placeholder={t("contact.namePlaceholder")}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">{t("contact.emailLabel")}</label>
                                <input
                                    type="email"
                                    required
                                    value={contactForm.email}
                                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-[#2a2a3e] border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                    placeholder={t("contact.emailPlaceholder")}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">{t("contact.messageLabel")}</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={contactForm.message}
                                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-[#2a2a3e] border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
                                    placeholder={t("contact.messagePlaceholder")}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark transition text-white rounded-lg px-6 h-12 font-medium"
                            >
                                <SendIcon className="size-4" />
                                {t("contact.sendButton")}
                            </button>
                        </form>
                    )}
                </div>
            </div>

        </>
    );
}
