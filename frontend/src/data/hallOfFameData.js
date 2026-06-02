const avatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4895ef&color=fff&size=128&bold=true`;

export const podiumData = [
    {
        name: "Lucas Mendes",
        level: "C1",
        score: "98%",
        image: avatar("Lucas Mendes"),
        quote: "Superei todas as expectativas!",
    },
    {
        name: "Ana Carolina",
        level: "B2",
        score: "95%",
        image: avatar("Ana Carolina"),
        quote: "Evoluí do zero ao intermediário em 4 meses.",
    },
    {
        name: "Pedro Santos",
        level: "C2",
        score: "97%",
        image: avatar("Pedro Santos"),
        quote: "Proficiência alcançada com nota máxima!",
    },
];

export const reviewsData = [
    {
        name: "Mariana Oliveira",
        level: "B1 → B2",
        rating: 5,
        image: avatar("Mariana Oliveira"),
        comment: "A plataforma é incrível! Os professores são muito atenciosos e o método funciona de verdade. Consegui minha certificação IELTS.",
    },
    {
        name: "Rafael Costa",
        level: "A2 → B1",
        rating: 5,
        image: avatar("Rafael Costa"),
        comment: "Melhor investimento que fiz. As aulas são dinâmicas e o suporte é excelente. Recomendo para todos os níveis.",
    },
    {
        name: "Juliana Ferreira",
        level: "A1 → A2",
        rating: 5,
        image: avatar("Juliana Ferreira"),
        comment: "Comecei do zero e já consigo manter conversas básicas. O conteúdo é muito bem estruturado e divertido.",
    },
    {
        name: "Thiago Almeida",
        level: "B2 → C1",
        rating: 4,
        image: avatar("Thiago Almeida"),
        comment: "A qualidade dos professores nativos faz toda a diferença. O progresso é visível semana a semana.",
    },
    {
        name: "Camila Rodrigues",
        level: "A1 → B1",
        rating: 5,
        image: avatar("Camila Rodrigues"),
        comment: "Em 6 meses saí do absoluto zero para o intermediário. A metodologia da Macaw é realmente diferenciada.",
    },
    {
        name: "Felipe Martins",
        level: "C1 → C2",
        rating: 5,
        image: avatar("Felipe Martins"),
        comment: "Precisava do C2 para uma vaga internacional e consegui! A preparação para o exame foi impecável.",
    },
];
