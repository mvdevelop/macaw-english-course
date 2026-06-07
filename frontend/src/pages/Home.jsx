"use client"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VideoIcon, SendIcon, CheckCircleIcon, ArrowRightIcon, TrophyIcon, StarIcon } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { levelsData } from "../data/levelsData";
import { podiumData, reviewsData } from "../data/hallOfFameData";
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
                            { src: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop", alt: "Biblioteca - conhecimento e estudo" },
                            { src: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2070&auto=format&fit=crop", alt: "Dedicacao aos estudos" },
                            { src: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=2070&auto=format&fit=crop", alt: "Aprendizado online" },
                            { src: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop", alt: "London - Reino Unido" },
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
            <div className="h-24 bg-gradient-to-b from-white to-[#eaf4fe] dark:from-gray-950 dark:to-[#0d0d1a]" />

            {/* Níveis CEFR — do A1 ao C2 */}
            <div className="relative pt-16 pb-20 bg-[#eaf4fe] dark:bg-[#0d0d1a]">
                <SectionTitle text1={t("levels.label")} text2={t("levels.title")} text3={t("levels.subtitle")} />

                <div id="cursos" className="flex flex-wrap items-start justify-center gap-6 mt-12 px-6 md:px-16 lg:px-24 xl:px-32">
                    {levelsData.map((level) => (
                        <div key={level.code} className="group p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/20 max-w-80 w-full hover:shadow-lg hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1">
                            <div className={`inline-flex items-center justify-center size-12 rounded-xl bg-gradient-to-br ${level.color} text-white mb-4`}>
                                <level.icon className="size-6" strokeWidth={1.5} />
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-lg font-bold bg-gradient-to-r ${level.color} bg-clip-text text-transparent`}>
                                    {level.label}
                                </span>
                                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{t(`level.${level.code}.name`)}</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                {t(level.description_key)}
                            </p>
                            <div className="space-y-1.5">
                                {t(level.topics_key).split(" • ").map((topic, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                        <ArrowRightIcon className="size-3.5 text-primary shrink-0" />
                                        <span>{topic.trim()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Gradient transition: Levels → Hall of Fame */}
            <div className="h-20 bg-gradient-to-b from-[#eaf4fe] to-white dark:from-[#0d0d1a] dark:to-gray-950" />

            {/* Hall da Fama — Podium + Reviews */}
            <div id="ranking" className="relative pt-20 pb-20">
                <SectionTitle text1={t("hall.label")} text2={t("hall.title")} text3={t("hall.subtitle")} />

                {/* Podium Top 3 */}
                <div className="flex items-end justify-center gap-4 md:gap-6 mt-16 mb-20 px-6">
                    {/* 2nd place */}
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <img src={podiumData[1].image} alt={podiumData[1].name} className="size-16 md:size-20 rounded-full border-4 border-slate-300 dark:border-slate-600 object-cover" />
                            <div className="absolute -top-2 -right-2 size-7 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300">2</div>
                        </div>
                        <p className="mt-2 font-semibold text-sm text-center">{podiumData[1].name}</p>
                        <p className="text-xs text-primary font-medium">{podiumData[1].level}</p>
                        <p className="text-xs text-slate-400 mt-1">{podiumData[1].score}</p>
                    </div>
                    {/* 1st place */}
                    <div className="flex flex-col items-center -mt-8">
                        <div className="relative">
                            <img src={podiumData[0].image} alt={podiumData[0].name} className="size-20 md:size-24 rounded-full border-4 border-yellow-400 object-cover" />
                            <div className="absolute -top-3 -right-3 size-8 rounded-full bg-yellow-400 flex items-center justify-center text-sm font-bold text-yellow-900">1</div>
                        </div>
                        <TrophyIcon className="size-5 text-yellow-400 mt-2" />
                        <p className="mt-1 font-semibold text-sm text-center">{podiumData[0].name}</p>
                        <p className="text-xs text-primary font-medium">{podiumData[0].level}</p>
                        <p className="text-xs text-slate-400 mt-1">{podiumData[0].score}</p>
                    </div>
                    {/* 3rd place */}
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <img src={podiumData[2].image} alt={podiumData[2].name} className="size-16 md:size-20 rounded-full border-4 border-amber-700 object-cover" />
                            <div className="absolute -top-2 -right-2 size-7 rounded-full bg-amber-700 flex items-center justify-center text-sm font-bold text-white">3</div>
                        </div>
                        <p className="mt-2 font-semibold text-sm text-center">{podiumData[2].name}</p>
                        <p className="text-xs text-primary font-medium">{podiumData[2].level}</p>
                        <p className="text-xs text-slate-400 mt-1">{podiumData[2].score}</p>
                    </div>
                </div>

                {/* Reviews Grid */}
                <div className="flex flex-wrap items-start justify-center gap-4 px-6 md:px-16 lg:px-24 xl:px-32">
                    {reviewsData.map((review, index) => (
                        <div key={index} className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 max-w-72 w-full hover:shadow-lg hover:shadow-black/5 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-3">
                                <img src={review.image} alt={review.name} className="size-10 rounded-full object-cover" />
                                <div>
                                    <p className="font-medium text-sm">{review.name}</p>
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
