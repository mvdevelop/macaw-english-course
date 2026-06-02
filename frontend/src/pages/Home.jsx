"use client"
import { useState } from "react";
import { VideoIcon, SendIcon, CheckCircleIcon, ArrowRightIcon } from "lucide-react";
import { levelsData } from "../data/levelsData";
import { featuresData } from "../data/featuresData";
import SectionTitle from "../components/SectionTitle";
import { useThemeContext } from "../context/ThemeContext";
import { FaqSection } from "../sections/FaqSection";
import Pricing from "../sections/Pricing";
import { useTranslation } from "../i18n/LanguageContext";

export default function Page() {
    const { theme } = useThemeContext();
    const { t } = useTranslation();
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
            <div id="home" className="flex flex-col items-center justify-center text-center px-4 pb-16 bg-[url('/assets/light-hero-gradient.svg')] dark:bg-[url('/assets/dark-hero-gradient.svg')] bg-no-repeat bg-cover">
                <div className="flex flex-wrap items-center justify-center gap-3 p-1.5 pr-4 mt-46 rounded-full border border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-slate-600/20">
                    <div className="flex items-center -space-x-3">
                        <img className="size-7 rounded-full" height={50} width={50}
                            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50"
                            alt="userImage1" />
                        <img className="size-7 rounded-full" height={50} width={50}
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50"
                            alt="userImage2" />
                        <img className="size-7 rounded-full" height={50} width={50}
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop"
                            alt="userImage3" />
                    </div>
                    <p className="text-xs">{t("hero.join")}</p>
                </div>
                <h1 className="mt-2 text-5xl/15 md:text-[64px]/19 font-semibold max-w-2xl">
                    {t("hero.title_start")}{" "}
                    <span className="bg-gradient-to-r from-primary to-primary-light dark:from-primary-light dark:to-primary-foreground bg-clip-text text-transparent">{t("hero.title_highlight")}</span>
                </h1>
                <p className="text-base dark:text-slate-300 max-w-lg mt-2">
                    {t("hero.subtitle")}
                </p>
                <div className="flex items-center gap-4 mt-8">
                    <button className="bg-primary hover:bg-primary-dark transition text-white rounded-md px-6 h-11">
                        {t("hero.startNow")}
                    </button>
                    <button className="flex items-center gap-2 border border-primary-dark transition text-slate-600 dark:text-white rounded-md px-6 h-11">
                        <VideoIcon strokeWidth={1} />
                        <span>{t("hero.trialClass")}</span>
                    </button>
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

            {/* Gradient transition: Levels → Pricing */}
            <div className="h-20 bg-gradient-to-b from-[#eaf4fe] to-white dark:from-[#0d0d1a] dark:to-gray-950" />

            <Pricing />

            <FaqSection />

            {/* Gradient transition: FAQ → CTA */}
            <div className="h-20 bg-gradient-to-b from-white to-slate-50 dark:from-gray-950 dark:to-[#15152a]" />

            <div className="flex flex-col items-center text-center justify-center px-4 py-20 bg-slate-50 dark:bg-[#15152a]">
                <h3 className="text-3xl font-semibold mb-4">{t("cta.title")}</h3>
                <p className="text-slate-600 dark:text-slate-200 max-w-xl mx-auto">
                    {t("cta.subtitle")}
                </p>
                <div className="flex items-center gap-4 mt-8">
                    <button className="bg-primary hover:bg-primary-dark transition text-white rounded-md px-6 h-11">
                        {t("cta.startTrial")}
                    </button>
                    <button className="border border-primary-dark transition text-slate-600 dark:text-white rounded-md px-6 h-11">
                        {t("cta.talkConsultant")}
                    </button>
                </div>
            </div>

            {/* Gradient transition: CTA → Contact (light slate → dark lead) */}
            <div className="h-28 bg-gradient-to-b from-slate-50 to-[#1a1a2e] dark:from-[#15152a] dark:to-[#12121f]" />

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
