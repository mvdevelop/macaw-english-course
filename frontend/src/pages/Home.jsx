"use client"
import { VideoIcon } from "lucide-react";
import Marquee from "react-fast-marquee";
import { companiesLogo } from "../data/companiesLogo";
import { featuresData } from "../data/featuresData";
import SectionTitle from "../components/SectionTitle";
import { useThemeContext } from "../context/ThemeContext";
import { FaqSection } from "../sections/FaqSection";
import Pricing from "../sections/Pricing";

export default function Page() {
    const { theme } = useThemeContext();
    return (
        <>
            <div className="flex flex-col items-center justify-center text-center px-4 bg-[url('/assets/light-hero-gradient.svg')] dark:bg-[url('/assets/dark-hero-gradient.svg')] bg-no-repeat bg-cover">
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
                    <p className="text-xs">Junte-se a mais de 5 mil alunos satisfeitos</p>
                </div>
                <h1 className="mt-2 text-5xl/15 md:text-[64px]/19 font-semibold max-w-2xl">
                    Domine o{" "}
                    <span className="bg-gradient-to-r from-primary to-primary-light dark:from-primary-light dark:to-primary-foreground bg-clip-text text-transparent">inglês</span>
                </h1>
                <p className="text-base dark:text-slate-300 max-w-lg mt-2">
                    Aprenda inglês com professores nativos e certificados. Aulas online e presenciais com metodologia comprovada.
                </p>
                <div className="flex items-center gap-4 mt-8">
                    <button className="bg-primary hover:bg-primary-dark transition text-white rounded-md px-6 h-11">
                        Começar Agora
                    </button>
                    <button className="flex items-center gap-2 border border-primary-dark transition text-slate-600 dark:text-white rounded-md px-6 h-11">
                        <VideoIcon strokeWidth={1} />
                        <span>Aula Experimental</span>
                    </button>
                </div>
                <h3 className="text-base text-center text-slate-400 mt-28 pb-14 font-medium">
                    Confiado por alunos de todo o Brasil —
                </h3>
                <Marquee className="max-w-5xl mx-auto" gradient={true} speed={25} gradientColor={theme === "dark" ? "#000" : "#fff"}>
                    <div className="flex items-center justify-center">
                        {[...companiesLogo, ...companiesLogo].map((company, index) => (
                            <img key={index} className="mx-11" src={company.logo} alt={company.name} width={100} height={100} />
                        ))}
                    </div>
                </Marquee>
            </div>

            <SectionTitle text1="CURSOS" text2="Aprenda com Qualidade" text3="Cursos estruturados do básico ao avançado com professores certificados e metodologia comprovada." />

            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-4 mt-10 px-6 md:px-16 lg:px-24 xl:px-32">
                {featuresData.map((feature, index) => (
                    <div key={index} className="p-6 rounded-xl space-y-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/20 max-w-80 md:max-w-66">
                        <feature.icon className="text-primary size-8 mt-4" strokeWidth={1.3} />
                        <h3 className="text-base font-medium">{feature.title}</h3>
                        <p className="text-slate-400 line-clamp-2">{feature.description}</p>
                    </div>
                ))}
            </div>

            <Pricing />

            <FaqSection />

            <div className="flex flex-col items-center text-center justify-center mt-20">
                <h3 className="text-3xl font-semibold mt-16 mb-4">Pronto para Começar?</h3>
                <p className="text-slate-600 dark:text-slate-200 max-w-xl mx-auto">
                    Junte-se a milhares de alunos que já transformaram sua vida aprendendo inglês com a Macaw.
                </p>
                <div className="flex items-center gap-4 mt-8">
                    <button className="bg-primary hover:bg-primary-dark transition text-white rounded-md px-6 h-11">
                        Iniciar Aula Experimental
                    </button>
                    <button className="border border-primary-dark transition text-slate-600 dark:text-white rounded-md px-6 h-11">
                        Falar com Consultor
                    </button>
                </div>
            </div>

        </>
    );
}