import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTestById, getTestByModule, submitTestResult } from "../api/courseApi";
import { ClockIcon, CheckCircleIcon, XCircleIcon, AlertCircleIcon, ArrowRightIcon, ArrowLeftIcon } from "lucide-react";

export default function TestPage() {
    const { moduleId, levelCode } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [reviewMode, setReviewMode] = useState(false);

    useEffect(() => {
        async function load() {
            const data = await getTestByModule(moduleId);
            if (!data) {
                // Try direct ID lookup
                const byId = await getTestById(moduleId);
                setTest(byId);
            } else {
                setTest(data);
            }
            setLoading(false);
        }
        load();
    }, [moduleId]);

    // Timer
    useEffect(() => {
        if (!test || submitted || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [test, submitted, timeLeft]);

    // Initialize timer when test loads
    useEffect(() => {
        if (test && test.timeLimit) {
            setTimeLeft(test.timeLimit * 60);
        }
    }, [test]);

    async function handleSubmit() {
        if (!test || !user || submitted) return;

        const testAnswers = Object.entries(answers).map(([qOrder, selectedAnswer]) => ({
            questionOrder: parseInt(qOrder),
            selectedAnswer,
        }));

        const testResult = {
            studentId: user.id,
            testId: test.id,
            levelCode: test.levelCode,
            moduleId: test.moduleId,
            answers: testAnswers,
            startedAt: new Date().toISOString(),
        };

        const res = await submitTestResult(testResult);
        setResult(res);
        setSubmitted(true);
    }

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    }

    if (loading) return <div className="p-10 text-center text-slate-400">Carregando prova...</div>;
    if (!test) return <div className="p-10 text-center text-slate-400">Prova não encontrada.</div>;

    const questions = test.questions || [];
    const currentQ = questions[questionIndex];
    const totalAnswered = Object.keys(answers).length;
    const allAnswered = totalAnswered === questions.length;

    // ── Results Screen ──
    if (submitted && result) {
        const passed = result.passed;
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-brand-dark flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-white dark:bg-slate-800/20 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
                    <div className={`size-20 rounded-full mx-auto flex items-center justify-center mb-4 ${passed ? "bg-success/20" : "bg-fail/20"}`}>
                        {passed ? <CheckCircleIcon size={40} className="text-success" /> : <XCircleIcon size={40} className="text-fail" />}
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">
                        {passed ? "Parabéns! 🎉" : "Não foi dessa vez"}
                    </h2>
                    <p className="text-slate-400 mb-6">
                        {passed
                            ? `Você acertou ${result.correctAnswers}/${result.totalQuestions} e passou no teste!`
                            : `Você acertou ${result.correctAnswers}/${result.totalQuestions}. Precisa de ${test.passingScore}% para passar.`}
                    </p>

                    <div className="flex items-center justify-center gap-6 mb-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-primary">{result.score}%</p>
                            <p className="text-xs text-slate-400">Sua pontuação</p>
                        </div>
                        <div className="w-px h-12 bg-slate-200 dark:bg-slate-700" />
                        <div className="text-center">
                            <p className="text-3xl font-bold text-slate-400">{test.passingScore}%</p>
                            <p className="text-xs text-slate-400">Mínimo</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setReviewMode(true)}
                            className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >
                            Revisar Respostas
                        </button>
                        <button
                            onClick={() => navigate(`/course/${levelCode?.toLowerCase()}`)}
                            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition"
                        >
                            Voltar ao Curso
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Review Mode ──
    if (reviewMode && result) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-brand-dark p-4 lg:p-10">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-xl font-semibold">Revisão — {test.title}</h1>
                        <button onClick={() => setReviewMode(false)} className="text-sm text-primary hover:underline">
                            Voltar
                        </button>
                    </div>
                    {questions.map((q, i) => {
                        const userAnswer = answers[q.order] ?? result.answers.find(a => a.questionOrder === q.order)?.selectedAnswer;
                        const isCorrect = userAnswer === q.correctAnswer;
                        return (
                            <div key={i} className={`bg-white dark:bg-slate-800/20 rounded-xl p-6 mb-4 border ${isCorrect ? "border-success/30" : "border-fail/30"}`}>
                                <p className="text-sm font-medium mb-2">Questão {i + 1}</p>
                                {q.context && <p className="text-sm text-slate-400 mb-3 italic">{q.context}</p>}
                                <p className="text-base mb-4">{q.question}</p>
                                {q.options?.map((opt, oi) => {
                                    const oiStr = String(oi);
                                    const isCorrectOpt = q.correctAnswer === oiStr;
                                    const isUserOpt = userAnswer === oiStr;
                                    return (
                                        <div key={oi} className={`px-3 py-2 rounded text-sm mb-1 ${
                                            isCorrectOpt ? "bg-success/10 text-green-700 font-medium" :
                                            isUserOpt ? "bg-fail/10 text-fail" : ""
                                        }`}>
                                            {String.fromCharCode(65 + oi)}) {opt}
                                            {isCorrectOpt && " ✓"}
                                            {isUserOpt && !isCorrectOpt && " ✗"}
                                        </div>
                                    );
                                })}
                                {q.explanation && (
                                    <p className="text-xs text-slate-400 mt-2">{q.explanation}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // ── Test Screen ──
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-brand-dark">
            {/* Header */}
            <header className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                    <h1 className="text-sm font-semibold">{test.title}</h1>
                    <div className="flex items-center gap-4">
                        <span className={`flex items-center gap-1 text-sm font-mono ${timeLeft < 300 ? "text-fail" : "text-slate-400"}`}>
                            <ClockIcon size={14} /> {formatTime(timeLeft)}
                        </span>
                        <span className="text-xs text-slate-400">{totalAnswered}/{questions.length}</span>
                    </div>
                </div>
            </header>

            {/* Question */}
            <main className="max-w-3xl mx-auto px-4 py-8">
                {currentQ && (
                    <div className="bg-white dark:bg-slate-800/20 rounded-xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                                Questão {questionIndex + 1} de {questions.length}
                            </span>
                            {currentQ.skill && (
                                <span className="text-xs text-slate-400">{currentQ.skill}</span>
                            )}
                        </div>

                        {currentQ.context && (
                            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-4 text-sm leading-relaxed border border-slate-100 dark:border-slate-800">
                                {currentQ.context}
                            </div>
                        )}

                        <p className="text-base font-medium mb-6">{currentQ.question}</p>

                        <div className="space-y-3">
                            {currentQ.options?.map((opt, oi) => {
                                const isSelected = answers[currentQ.order] === String(oi);
                                return (
                                    <button
                                        key={oi}
                                        onClick={() => setAnswers(prev => ({ ...prev, [currentQ.order]: String(oi) }))}
                                        className={`w-full text-left px-4 py-3 rounded-lg border transition text-sm ${
                                            isSelected
                                                ? "border-primary bg-primary/5"
                                                : "border-slate-200 dark:border-slate-700 hover:border-primary/50"
                                        }`}
                                    >
                                        <span className="inline-flex items-center gap-3">
                                            <span className={`size-6 rounded-full border flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                                                isSelected ? "border-primary bg-primary text-white" : "border-slate-300 dark:border-slate-600"
                                            }`}>
                                                {String.fromCharCode(65 + oi)}
                                            </span>
                                            {opt}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>

            {/* Question nav + Submit */}
            <footer className="bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-slate-800 px-4 py-4">
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                    <button
                        onClick={() => setQuestionIndex(i => Math.max(0, i - 1))}
                        disabled={questionIndex === 0}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 disabled:opacity-30 hover:text-primary transition"
                    >
                        <ArrowLeftIcon size={16} /> Anterior
                    </button>

                    {/* Question dots */}
                    <div className="flex flex-wrap items-center gap-1.5 max-w-xs">
                        {questions.map((q, i) => {
                            const isAnswered = answers[q.order] !== undefined;
                            const isCurrent = i === questionIndex;
                            return (
                                <button
                                    key={i}
                                    onClick={() => setQuestionIndex(i)}
                                    className={`size-7 rounded-full text-xs font-medium transition ${
                                        isCurrent
                                            ? "bg-primary text-white"
                                            : isAnswered
                                            ? "bg-primary/30 text-white"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2">
                        {questionIndex < questions.length - 1 ? (
                            <button
                                onClick={() => setQuestionIndex(i => Math.min(questions.length - 1, i + 1))}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary hover:bg-primary-dark transition text-white rounded-lg"
                            >
                                Próximo <ArrowRightIcon size={16} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={!allAnswered}
                                className="flex items-center gap-2 px-6 py-2 bg-success hover:bg-green-400 transition text-brand-dark font-medium rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <CheckCircleIcon size={16} /> Entender Prova
                            </button>
                        )}
                    </div>
                </div>
                {!allAnswered && (
                    <p className="text-center text-xs text-fail mt-2 flex items-center justify-center gap-1">
                        <AlertCircleIcon size={12} /> Responda todas as questões para entregar
                    </p>
                )}
            </footer>
        </div>
    );
}
