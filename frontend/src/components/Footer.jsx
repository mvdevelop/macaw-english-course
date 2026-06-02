import { Link } from "react-router-dom";
import { navLinks } from "../data/navLinks";
import { useTranslation } from "../i18n/LanguageContext";

export default function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="px-6 md:px-16 lg:px-24 xl:px-32 w-full bg-[#1a1a2e] text-white">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-slate-700 pb-6">
                <div className="md:max-w-114">
                    <a href="/">
                        <span className="text-xl font-bold text-primary">Macaw English School</span>
                    </a>
                    <p className="mt-6 text-slate-300">
                        {t("footer.description")}
                    </p>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20">
                    <div>
                        <h2 className="font-semibold mb-5 text-white">{t("footer.navigation")}</h2>
                        <ul className="space-y-2">
                            {navLinks.map((link, index) => (
                                <li key={index}>
                                    <a href={link.href} className="hover:text-primary transition text-slate-300">{t(link.name)}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5 text-white">{t("footer.contact")}</h2>
                        <div className="space-y-2 text-slate-300">
                            <p>+55 (11) 98765-4321</p>
                            <p>contato@macawenglish.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center pb-5 text-slate-400">
                {t("footer.copyright")}
            </p>
        </footer>
    );
};
