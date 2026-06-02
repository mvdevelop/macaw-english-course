import { SparklesIcon } from "lucide-react";
import { useThemeContext } from "../context/ThemeContext";
import SectionTitle from "../components/SectionTitle";
import { pricingData } from "../data/pricingData";
import { useTranslation } from "../i18n/LanguageContext";

export default function Pricing() {
    const { theme } = useThemeContext();
    const { t } = useTranslation();
    return (
        <div className="relative pt-20 pb-20">
            <img className="absolute -mt-20 md:-mt-100 md:left-20 pointer-events-none" src={theme === "dark" ? "/assets/color-splash.svg" : "/assets/color-splash-light.svg"} alt="color-splash" width={1000} height={1000} priority fetchPriority="high" />
            <SectionTitle text1={t("pricing.label")} text2={t("pricing.title")} text3={t("pricing.subtitle")} />

            <div className="flex flex-wrap items-center justify-center gap-6 mt-16">
                {pricingData.map((plan, index) => (
                    <div key={index} className={`p-6 rounded-2xl max-w-75 w-full shadow-[0px_4px_26px] shadow-black/6 ${plan.mostPopular ? "relative pt-12 bg-gradient-to-b from-primary to-primary-dark" : "bg-white/50 dark:bg-gray-800/50 border border-slate-200 dark:border-slate-800"}`}>
                        {plan.mostPopular && (
                            <div className="flex items-center text-xs gap-1 py-1.5 px-2 text-primary absolute top-4 right-4 rounded bg-white font-medium">
                                <SparklesIcon size={14} />
                                <p>{t("pricing.mostPopular")}</p>
                            </div>
                        )}
                        <p className={plan.mostPopular && "text-white"}>{t(plan.title)}</p>
                        <h4 className={`text-3xl font-semibold mt-1 ${plan.mostPopular && "text-white"}`}>${plan.price}<span className={`font-normal text-sm ${plan.mostPopular ? "text-white" : "text-slate-300"}`}>{t("pricing.perMonth")}</span></h4>
                        <hr className={`my-8 ${plan.mostPopular ? "border-gray-300" : "border-slate-300 dark:border-slate-700"}`} />
                        <div className={`space-y-2 ${plan.mostPopular ? "text-white" : "text-slate-600 dark:text-slate-300"}`}>
                            {plan.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-1.5">
                                    <feature.icon size={18} className={`${plan.mostPopular ? "text-white" : "text-primary"}`} />
                                    <span>{t(feature.name)}</span>
                                </div>
                            ))}
                        </div>
                        <button className={`transition w-full py-3 rounded-lg font-medium mt-8 ${plan.mostPopular ? "bg-white hover:bg-slate-100 text-slate-800" : "bg-primary hover:bg-primary-dark text-white"}`}>
                            <span>{t(plan.buttonText)}</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}