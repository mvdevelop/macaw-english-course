import { Link } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";
import { navLinks } from "../data/navLinks";

export default function Footer() {
    const { theme } = useThemeContext();
    return (
        <footer className="relative px-6 md:px-16 lg:px-24 xl:px-32 mt-40 w-full dark:text-slate-50">
            <img className="absolute max-w-4xl w-full h-auto -mt-30 max-md:px-4 right-0 md:right-16 lg:right-24 xl:right-32 top-0 pointer-events-none" src={theme === "dark" ? "/assets/landing-text-dark.svg" : "/assets/landing-text-light.svg"} alt="landing" width={930} height={340} priority fetchPriority="high" />
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-200 dark:border-slate-700 pb-6">
                <div className="md:max-w-114">
                    <a href="/">
                        <span className="text-xl font-bold text-primary">Macaw English School</span>
                    </a>
                    <p className="mt-6">
                        Aprenda inglês com professores nativos e certificados. Metodologia comprovada com aulas online e presenciais para todos os níveis.
                    </p>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20">
                    <div>
                        <h2 className="font-semibold mb-5">Navegação</h2>
                        <ul className="space-y-2">
                            {navLinks.map((link, index) => (
                                <li key={index}>
                                    <a href={link.href} className="hover:text-primary transition">{link.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5">Contato</h2>
                        <div className="space-y-2">
                            <p>+55 (11) 98765-4321</p>
                            <p>contato@macawenglish.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center pb-5">
                Copyright 2024 © <a href="/">Macaw English School</a>. Todos os direitos reservados.
            </p>
        </footer>
    );
};