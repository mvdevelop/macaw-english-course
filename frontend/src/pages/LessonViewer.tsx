import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getLessonById, completeLesson } from "../api/courseApi";
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    XCircleIcon,
    BookOpenIcon,
    Image as ImageIcon,
    HeadphonesIcon,
    PencilIcon,
} from "lucide-react";

export default function LessonViewer() {
    const { lessonId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(0); // current step index
    const [exerciseAnswers, setExerciseAnswers] = useState({});
    const [exerciseChecked, setExerciseChecked] = useState({});
    const [exerciseResults, setExerciseResults] = useState({});

    useEffect(() => {
        async function load() {
            const data = await getLessonById(lessonId);
            setLesson(data);
            setLoading(false);
        }
        load();
    }, [lessonId]);

    // Build all steps: content blocks + exercises
    const allSteps = useMemo(() => {
        if (!lesson) return [];
        const steps = [];
        // Content blocks
        lesson.content?.sort((a, b) => a.order - b.order).forEach(block => {
            steps.push({ type: "content", block });
        });
        // Exercises
        lesson.exercises?.sort((a, b) => a.order - b.order).forEach(ex => {
            steps.push({ type: "exercise", exercise: ex });
        });
        return steps;
    }, [lesson]);

    const currentStep = allSteps[step];
    const totalSteps = allSteps.length;
    const progress = totalSteps > 0 ? ((step + 1) / totalSteps) * 100 : 0;

    // Count exercise results
    const totalExercises = lesson?.exercises?.length || 0;
    const correctExercises = Object.values(exerciseResults).filter(Boolean).length;
    const allExercisesDone = totalExercises > 0 && Object.keys(exerciseChecked).length === totalExercises;

    async function handleFinish() {
        if (!user || !lesson) return;
        await completeLesson(user.id, lesson.levelCode, lesson.id, correctExercises, totalExercises);
        navigate(`/course/${lesson.levelCode.toLowerCase()}`);
    }

    if (loading) return <div className="p-10 text-center text-slate-400">Carregando lição...</div>;
    if (!lesson) return <div className="p-10 text-center text-slate-400">Lição não encontrada.</div>;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-brand-dark">
            {/* Top bar */}
            <header className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary"
                    >
                        <ArrowLeftIcon size={16} /> Sair
                    </button>
                    <h1 className="text-sm font-semibold text-center truncate max-w-xs">
                        {lesson.title}
                    </h1>
                    <span className="text-xs text-slate-400">
                        {step + 1}/{totalSteps}
                    </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 mt-3">
                    <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </header>

            {/* Content area */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl">
                    {currentStep?.type === "content" && (
                        <ContentBlock block={currentStep.block} />
                    )}
                    {currentStep?.type === "exercise" && (
                        <ExerciseBlock
                            exercise={currentStep.exercise}
                            answer={exerciseAnswers[currentStep.exercise.order] || ""}
                            checked={exerciseChecked[currentStep.exercise.order] || false}
                            isCorrect={exerciseResults[currentStep.exercise.order]}
                            onAnswer={(val) => setExerciseAnswers(prev => ({ ...prev, [currentStep.exercise.order]: val }))}
                            onCheck={() => {
                                const ex = currentStep.exercise;
                                const isCorrect = ex.correctAnswer === exerciseAnswers[ex.order];
                                setExerciseChecked(prev => ({ ...prev, [ex.order]: true }));
                                setExerciseResults(prev => ({ ...prev, [ex.order]: isCorrect }));
                            }}
                        />
                    )}
                </div>
            </main>

            {/* Bottom nav */}
            <footer className="bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-slate-800 px-4 py-4">
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                    <button
                        onClick={() => setStep(s => Math.max(0, s - 1))}
                        disabled={step === 0}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 disabled:opacity-30 hover:text-primary transition"
                    >
                        <ArrowLeftIcon size={16} /> Anterior
                    </button>

                    {allExercisesDone && step === totalSteps - 1 ? (
                        <button
                            onClick={handleFinish}
                            className="flex items-center gap-2 px-6 py-2 bg-success hover:bg-green-400 transition text-brand-dark font-medium rounded-lg"
                        >
                            <CheckCircleIcon size={16} /> Finalizar Lição
                        </button>
                    ) : (
                        <button
                            onClick={() => setStep(s => Math.min(totalSteps - 1, s + 1))}
                            disabled={step === totalSteps - 1}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary hover:bg-primary-dark transition text-white rounded-lg disabled:opacity-30"
                        >
                            Próximo <ArrowRightIcon size={16} />
                        </button>
                    )}
                </div>

                {/* Score summary when all exercises done */}
                {allExercisesDone && (
                    <div className="mt-3 text-center text-sm">
                        <span className="text-slate-400">
                            Exercícios: <strong className="text-primary">{correctExercises}/{totalExercises}</strong> corretos
                        </span>
                    </div>
                )}
            </footer>
        </div>
    );
}

// ── Content Block Renderer ──
function ContentBlock({ block }) {
    switch (block.type) {
        case "text":
            return (
                <div className="prose max-w-none">
                    <div className="bg-white dark:bg-slate-800/20 rounded-xl p-8 border border-slate-200 dark:border-slate-800">
                        <BookOpenIcon className="text-primary mb-4" size={24} />
                        <p className="text-base leading-relaxed whitespace-pre-wrap">{block.body}</p>
                    </div>
                </div>
            );
        case "image":
            return (
                <div className="bg-white dark:bg-slate-800/20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    <img src={block.imageUrl} alt={block.caption} className="w-full h-auto" />
                    {block.caption && (
                        <p className="px-4 py-2 text-sm text-slate-400 italic">{block.caption}</p>
                    )}
                </div>
            );
        case "reading":
            return (
                <div className="bg-white dark:bg-slate-800/20 rounded-xl p-8 border border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <PencilIcon size={18} className="text-primary" /> {block.title}
                    </h3>
                    <p className="text-base leading-relaxed whitespace-pre-wrap">{block.body}</p>
                </div>
            );
        case "audio":
            return (
                <div className="bg-white dark:bg-slate-800/20 rounded-xl p-8 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-4">
                        <HeadphonesIcon size={24} className="text-primary" />
                        <h3 className="font-semibold">Listening</h3>
                    </div>
                    {block.audioUrl && (
                        <audio controls className="w-full mb-4">
                            <source src={block.audioUrl} />
                        </audio>
                    )}
                    {block.transcript && (
                        <details className="text-sm text-slate-400">
                            <summary>Ver transcript</summary>
                            <p className="mt-2 whitespace-pre-wrap">{block.transcript}</p>
                        </details>
                    )}
                </div>
            );
        default:
            return <p className="text-slate-400 text-center">Conteúdo não reconhecido.</p>;
    }
}

// ── Exercise Renderer ──
function ExerciseBlock({ exercise, answer, checked, isCorrect, onAnswer, onCheck }) {
    switch (exercise.type) {
        case "multiple-choice":
            return (
                <div className="bg-white dark:bg-slate-800/20 rounded-xl p-8 border border-slate-200 dark:border-slate-800">
                    <h3 className="text-base font-semibold mb-6">{exercise.question}</h3>
                    <div className="space-y-3">
                        {exercise.options?.map((opt, i) => {
                            const isSelected = answer === String(i);
                            const isCorrectAnswer = exercise.correctAnswer === String(i);
                            let cls = "border-slate-200 dark:border-slate-700 hover:border-primary/50";
                            if (checked) {
                                if (isCorrectAnswer) cls = "border-success bg-success/10";
                                else if (isSelected && !isCorrectAnswer) cls = "border-fail bg-fail/10";
                            } else if (isSelected) {
                                cls = "border-primary bg-primary/5";
                            }
                            return (
                                <button
                                    key={i}
                                    onClick={() => !checked && onAnswer(String(i))}
                                    disabled={checked}
                                    className={`w-full text-left px-4 py-3 rounded-lg border transition text-sm ${cls}`}
                                >
                                    <span className="inline-flex items-center gap-3">
                                        <span className="size-6 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
                                            {String.fromCharCode(65 + i)}
                                        </span>
                                        {opt}
                                        {checked && isCorrectAnswer && <CheckCircleIcon size={16} className="text-success ml-auto" />}
                                        {checked && isSelected && !isCorrectAnswer && <XCircleIcon size={16} className="text-fail ml-auto" />}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    {checked && exercise.explanation && (
                        <div className={`mt-4 p-3 rounded-lg text-sm ${isCorrect ? "bg-success/10 text-green-700" : "bg-fail/10 text-fail"}`}>
                            {isCorrect ? "✅ Correto! " : "❌ Incorreto. "}
                            {exercise.explanation}
                        </div>
                    )}
                    {!checked && (
                        <button
                            onClick={onCheck}
                            disabled={!answer && answer !== 0}
                            className="mt-4 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg disabled:opacity-40 hover:bg-primary-dark transition"
                        >
                            Verificar
                        </button>
                    )}
                </div>
            );
        case "fill-blank":
            return (
                <div className="bg-white dark:bg-slate-800/20 rounded-xl p-8 border border-slate-200 dark:border-slate-800">
                    <h3 className="text-base font-semibold mb-4">{exercise.question}</h3>
                    <input
                        type="text"
                        value={answer || ""}
                        onChange={e => onAnswer(e.target.value)}
                        disabled={checked}
                        placeholder="Sua resposta..."
                        className={`w-full px-4 py-3 rounded-lg border text-sm transition ${
                            checked
                                ? isCorrect
                                    ? "border-success bg-success/10"
                                    : "border-fail bg-fail/10"
                                : "border-slate-200 dark:border-slate-700 focus:border-primary"
                        }`}
                    />
                    {checked && exercise.explanation && (
                        <div className={`mt-4 p-3 rounded-lg text-sm ${isCorrect ? "bg-success/10 text-green-700" : "bg-fail/10 text-fail"}`}>
                            {isCorrect ? "✅ Correto! " : "❌ Incorreto. Resposta: "}
                            {!isCorrect && <strong>{exercise.correctAnswer}</strong>}
                            {exercise.explanation && <> — {exercise.explanation}</>}
                        </div>
                    )}
                    {!checked && (
                        <button
                            onClick={onCheck}
                            disabled={!answer}
                            className="mt-4 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg disabled:opacity-40 hover:bg-primary-dark transition"
                        >
                            Verificar
                        </button>
                    )}
                </div>
            );
        default:
            // Fallback to multiple-choice style
            return (
                <div className="bg-white dark:bg-slate-800/20 rounded-xl p-8 border border-slate-200 dark:border-slate-800">
                    <h3 className="text-base font-semibold mb-6">{exercise.question}</h3>
                    <p className="text-sm text-slate-400">Exercício do tipo "{exercise.type}" — renderização padrão.</p>
                    {exercise.options?.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => !checked && onAnswer(String(i))}
                            disabled={checked}
                            className={`w-full text-left px-4 py-3 rounded-lg border transition text-sm mb-2 ${
                                answer === String(i) ? "border-primary bg-primary/5" : "border-slate-200 dark:border-slate-700"
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                    {!checked && (
                        <button
                            onClick={onCheck}
                            disabled={!answer}
                            className="mt-4 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg disabled:opacity-40 hover:bg-primary-dark transition"
                        >
                            Verificar
                        </button>
                    )}
                </div>
            );
    }
}
