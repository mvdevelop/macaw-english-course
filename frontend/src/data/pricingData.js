import { CheckIcon } from "lucide-react";

export const pricingData = [
    {
        title: "Iniciante",
        price: 99,
        features: [
            {
                name: "4 aulas por mês",
                icon: CheckIcon,
            },
            {
                name: "Acesso ao material online",
                icon: CheckIcon,
            },
            {
                name: "Suporte por email",
                icon: CheckIcon,
            },
            {
                name: "Certificado de conclusão",
                icon: CheckIcon,
            },
            {
                name: "Comunidade de alunos",
                icon: CheckIcon,
            },
        ],
        buttonText: "Começar Agora",
    },
    {
        title: "Intermediário",
        price: 199,
        mostPopular: true,
        features: [
            {
                name: "8 aulas por mês",
                icon: CheckIcon,
            },
            {
                name: "Acesso completo ao material",
                icon: CheckIcon,
            },
            {
                name: "Suporte prioritário",
                icon: CheckIcon,
            },
            {
                name: "Aulas em grupo e individuais",
                icon: CheckIcon,
            },
            {
                name: "Preparação para certificações",
                icon: CheckIcon,
            },
            {
                name: "Feedback personalizado",
                icon: CheckIcon,
            }
        ],
        buttonText: "Inscrever-se",
    },
    {
        title: "Avançado",
        price: 349,
        features: [
            {
                name: "Aulas ilimitadas",
                icon: CheckIcon,
            },
            {
                name: "Aulas 1-on-1 com professor nativo",
                icon: CheckIcon,
            },
            {
                name: "Suporte 24/7",
                icon: CheckIcon,
            },
            {
                name: "Preparação para exames internacionais",
                icon: CheckIcon,
            },
            {
                name: "Plano de estudos personalizado",
                icon: CheckIcon,
            },
            {
                name: "Acesso a recursos premium",
                icon: CheckIcon,
            }
        ],
        buttonText: "Contatar Vendas",
    }
];