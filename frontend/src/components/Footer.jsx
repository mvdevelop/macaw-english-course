import { Link } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";
import { navLinks } from "../data/navLinks";
import { useTranslation } from "../i18n/LanguageContext";

export default function Footer() {
    const { theme } = useThemeContext();
    const { t } = useTranslation();
    return (
        <footer className="relative px-6 md:px-16 lg:px-24 xl:px-32 mt-40 w-full dark:text-slate-50">
            <img className="absolute max-w-4xl w-full h-auto -mt-30 max-md:px-4 right-0 md:right-16 lg:right-24 xl:right-32 top-0 pointer-events-none" src={theme === "dark" ? "/assets/landing-text-dark.svg" : "/assets/landing-text-light.svg"} alt="landing" width={930} height={340} priority fetchPriority="high" />
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-200 dark:border-slate-700 pb-6">
                <div className="md:max-w-114">
                    <a href="/">
                        <span className="text-xl font-bold text-primary">{t("footer.brand")}</span>
                    </a>
                    <p className="mt-6">
                        {t("footer.description")}
                    </p>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20">
                    <div>
                        <h2 className="font-semibold mb-5">{t("footer.navigation")}</h2>
                        <ul className="space-y-2">
                            {navLinks.map((link, index) => (
                                <li key={index}>
                                    <a href={link.href} className="hover:text-primary transition">{t(link.name)}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5">{t("footer.contact")}</h2>
                        <div className="space-y-2">
                            <p>+55 (11) 98765-4321</p>
                            <p>contato@macawenglish.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center pb-5">
                {t("footer.copyright")}
            </p>
        </footer>
    );
};