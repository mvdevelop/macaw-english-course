"use client"
import { useState, useCallback } from "react";
import {
  BookOpenIcon,
  MicIcon,
  HeadphonesIcon,
  PenLineIcon,
  ArrowRightIcon,
  SendIcon,
  RefreshCwIcon,
  Volume2Icon,
  Loader2Icon,
  CheckCircle2Icon,
  XCircleIcon,
  AlertCircleIcon,
  SparklesIcon,
  PlayIcon,
  StopCircleIcon,
  ChevronRightIcon,
  LightbulbIcon,
} from "lucide-react";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import {
  generateReadingExercise,
  generateSpeakingTopic,
  evaluateSpeaking,
  generateListeningExercise,
  generateWritingPrompt,
  evaluateWriting,
} from "../../api/aiApi";

/* ─── Tab Config ─── */
const TABS = [
  { id: "reading", label: "Reading", icon: BookOpenIcon, color: "from-blue-400 to-blue-600" },
  { id: "speaking", label: "Speaking", icon: MicIcon, color: "from-emerald-400 to-emerald-600" },
  { id: "listening", label: "Listening", icon: HeadphonesIcon, color: "from-purple-400 to-purple-600" },
  { id: "writing", label: "Writing", icon: PenLineIcon, color: "from-orange-400 to-orange-600" },
];

/* ─── Componente Spinner ─── */
function Spinner({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2Icon className="size-8 text-primary animate-spin" strokeWidth={1.5} />
      <p className="text-sm text-slate-500 dark:text-slate-400">{text || "Carregando..."}</p>
    </div>
  );
}

/* ─── Componente de Feedback Score ─── */
function ScoreBar({ label, score }) {
  const color =
    score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300 w-24 shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-mono font-bold text-slate-500 w-8 text-right">{score}%</span>
    </div>
  );
}

/* ─── Página Principal ─── */
const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const levelToDesc = (cefr) => {
  if (["A1", "A2"].includes(cefr)) return "iniciante";
  if (["B1", "B2"].includes(cefr)) return "intermediário";
  return "avançado";
};

export default function AIPractice() {
  const [activeTab, setActiveTab] = useState("reading");
  const [level, setLevel] = useState("A1");

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <SparklesIcon className="size-6 text-primary" strokeWidth={1.5} />
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">AI Practice Lab</h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Pratique as 4 habilidades do inglês com feedback inteligente
        </p>
      </div>

      {/* Level Selector — CEFR A1 a C2 */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Nível:</span>
        {CEFR_LEVELS.map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              level === l
                ? "bg-primary text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shrink-0 ${
                isActive
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                  : "bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              <Icon className="size-4" strokeWidth={1.5} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-800/20 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-8">
        {activeTab === "reading" && <ReadingPractice cefrLevel={level} level={levelToDesc(level)} />}
        {activeTab === "speaking" && <SpeakingPractice cefrLevel={level} level={levelToDesc(level)} />}
        {activeTab === "listening" && <ListeningPractice cefrLevel={level} level={levelToDesc(level)} />}
        {activeTab === "writing" && <WritingPractice cefrLevel={level} level={levelToDesc(level)} />}
      </div>
    </div>
  );
}

/* ════════════════════════════ READING ════════════════════════════ */
function ReadingPractice({ level }) {
  const [status, setStatus] = useState("idle"); // idle | loading | active | feedback | error
  const [exercise, setExercise] = useState(null);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setStatus("loading");
    setError(null);
    setAnswers({});
    setFeedback(null);
    try {
      const data = await generateReadingExercise(level);
      if (data?.error) throw new Error(data.error);
      setExercise(data);
      setStatus("active");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const handleAnswer = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleCheck = () => {
    const results = exercise.questions.map((q) => ({
      ...q,
      userAnswer: answers[q.id] || "",
      correct: (answers[q.id] || "").startsWith(q.correctAnswer),
    }));
    setFeedback(results);
    setStatus("feedback");
  };

  const allAnswered = exercise?.questions?.every((q) => answers[q.id]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">📖 Read & Comprehend</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Leia o texto e responda às perguntas</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={status === "loading"}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white rounded-lg text-sm font-medium transition"
        >
          {status === "loading" ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <RefreshCwIcon className="size-4" />
          )}
          {status === "idle" || status === "feedback" ? "Gerar Texto" : "Novo Texto"}
        </button>
      </div>

      {status === "loading" && <Spinner text="Gerando texto para leitura..." />}

      {status === "error" && (
        <div className="flex flex-col items-center py-12 text-center">
          <AlertCircleIcon className="size-12 text-red-400 mb-3" strokeWidth={1.5} />
          <p className="text-sm text-red-500 mb-2">{error}</p>
          <button onClick={handleGenerate} className="text-sm text-primary hover:underline">Tentar novamente</button>
        </div>
      )}

      {status === "idle" && (
        <div className="py-16 text-center">
          <BookOpenIcon className="size-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" strokeWidth={1} />
          <p className="text-slate-500 dark:text-slate-400">Clique em "Gerar Texto" para começar</p>
        </div>
      )}

      {(status === "active" || status === "feedback") && exercise && (
        <div className="space-y-6">
          {/* Texto */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-3">{exercise.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{exercise.text}</p>
          </div>

          {/* Perguntas */}
          <div className="space-y-4">
            {exercise.questions.map((q) => {
              const isCorrect = feedback?.find((f) => f.id === q.id)?.correct;
              const userAnswer = feedback?.find((f) => f.id === q.id)?.userAnswer;
              return (
                <div key={q.id} className={`p-4 rounded-xl border transition ${
                  status === "feedback"
                    ? isCorrect
                      ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10"
                      : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10"
                    : "border-slate-200 dark:border-slate-700"
                }`}>
                  <p className="text-sm font-medium text-slate-800 dark:text-white mb-3">{q.id}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isSelected = (answers[q.id] || "") === opt[0];
                      const disabled = status === "feedback";
                      return (
                        <button
                          key={opt}
                          onClick={() => !disabled && handleAnswer(q.id, opt[0])}
                          disabled={disabled}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                            disabled && isCorrect && isSelected
                              ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700"
                              : disabled && !isCorrect && isSelected
                              ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700"
                              : isSelected
                              ? "bg-primary/10 text-primary border border-primary/30"
                              : "bg-slate-50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary/50"
                          }`}
                        >
                          {opt}
                          {status === "feedback" && isSelected && (
                            <span className="float-right">{isCorrect ? "✅" : "❌"}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {status === "active" && (
            <button
              onClick={handleCheck}
              disabled={!allAnswered}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white rounded-xl font-medium transition"
            >
              <CheckCircle2Icon className="size-4" strokeWidth={1.5} />
              Corrigir Respostas
            </button>
          )}

          {status === "feedback" && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-800 dark:text-white mb-2">
                ✅ {feedback.filter((f) => f.correct).length} de {feedback.length} corretas
              </p>
              <button
                onClick={handleGenerate}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <RefreshCwIcon className="size-3.5" strokeWidth={1.5} />
                Praticar com novo texto
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════ SPEAKING ════════════════════════════ */
function SpeakingPractice({ level }) {
  const [status, setStatus] = useState("idle"); // idle | loading | active | recording | processing | feedback | error
  const [topic, setTopic] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);
  const { status: speechStatus, transcript, interimTranscript, startListening, stopListening, reset: resetSpeech } = useSpeechRecognition();
  const { speak } = useSpeechSynthesis();

  const handleGenerateTopic = async () => {
    setStatus("loading");
    setError(null);
    setFeedback(null);
    resetSpeech();
    try {
      const data = await generateSpeakingTopic(level);
      if (data?.error) throw new Error(data.error);
      setTopic(data);
      setStatus("active");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const handleStartRecording = () => {
    startListening("en-US");
    setStatus("recording");
  };

  const handleStopRecording = () => {
    stopListening();
    setStatus("processing");
    processFeedback(transcript);
  };

  const processFeedback = useCallback(async (text) => {
    if (!text || !topic) return;
    try {
      const data = await evaluateSpeaking(text, topic.topic);
      setFeedback(data);
      setStatus("feedback");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }, [topic]);

  const handleSubmitText = async () => {
    if (!transcript.trim()) return;
    setStatus("processing");
    await processFeedback(transcript);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">🎤 Speak & Improve</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Fale sobre um tópico e receba feedback</p>
        </div>
        <button
          onClick={handleGenerateTopic}
          disabled={status === "loading"}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white rounded-lg text-sm font-medium transition"
        >
          {status === "loading" ? <Loader2Icon className="size-4 animate-spin" /> : <RefreshCwIcon className="size-4" />}
          {status === "idle" || status === "feedback" ? "Novo Tópico" : "Gerar Tópico"}
        </button>
      </div>

      {status === "loading" && <Spinner text="Gerando tópico para conversação..." />}

      {status === "error" && (
        <div className="flex flex-col items-center py-12 text-center">
          <AlertCircleIcon className="size-12 text-red-400 mb-3" strokeWidth={1.5} />
          <p className="text-sm text-red-500 mb-2">{error}</p>
          <button onClick={handleGenerateTopic} className="text-sm text-primary hover:underline">Tentar novamente</button>
        </div>
      )}

      {status === "idle" && (
        <div className="py-16 text-center">
          <MicIcon className="size-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" strokeWidth={1} />
          <p className="text-slate-500 dark:text-slate-400">Clique em "Novo Tópico" para começar</p>
        </div>
      )}

      {status !== "idle" && status !== "loading" && topic && (
        <div className="space-y-6">
          {/* Topic Card */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 border border-emerald-200 dark:border-emerald-800">
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Tópico</p>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{topic.topic}</h3>
            <div className="space-y-1 mb-3">
              {topic.questions?.map((q, i) => (
                <p key={i} className="text-sm text-slate-600 dark:text-slate-300">• {q}</p>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <LightbulbIcon className="size-4 text-emerald-500" strokeWidth={1.5} />
              {topic.vocabulary?.map((v, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">{v}</span>
              ))}
            </div>
          </div>

          {/* Recording Area */}
          {(status === "active" || status === "recording") && (
            <div className="space-y-4">
              {status === "recording" && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
                  <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">Gravando...</span>
                </div>
              )}

              {interimTranscript && (
                <p className="text-sm text-slate-400 italic">{interimTranscript}...</p>
              )}

              {transcript && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-medium text-slate-400 mb-1">Sua fala:</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200">{transcript}</p>
                </div>
              )}

              <div className="flex gap-3">
                {status === "active" && (
                  <button
                    onClick={handleStartRecording}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition"
                  >
                    <MicIcon className="size-4" strokeWidth={1.5} />
                    Falar Agora
                  </button>
                )}
                {status === "recording" && (
                  <button
                    onClick={handleStopRecording}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition"
                  >
                    <StopCircleIcon className="size-4" strokeWidth={1.5} />
                    Parar Gravação
                  </button>
                )}
              </div>

              {transcript && status === "active" && (
                <button
                  onClick={handleSubmitText}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition"
                >
                  <SendIcon className="size-4" strokeWidth={1.5} />
                  Enviar para Avaliação
                </button>
              )}
            </div>
          )}

          {status === "processing" && <Spinner text="Avaliando sua fala..." />}

          {/* Feedback */}
          {status === "feedback" && feedback && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`text-3xl font-bold ${feedback.score >= 70 ? "text-emerald-500" : feedback.score >= 50 ? "text-yellow-500" : "text-red-500"}`}>
                  {feedback.score}%
                </div>
                <span className="text-sm font-medium text-slate-500">Score Geral</span>
              </div>

              <div className="space-y-3">
                <ScoreBar label="Gramática" score={feedback.score} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Gramática", text: feedback.grammar },
                  { label: "Vocabulário", text: feedback.vocabulary },
                  { label: "Pronúncia", text: feedback.pronunciation },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-medium text-slate-400 mb-1">{item.label}</p>
                    <p className="text-sm text-slate-700 dark:text-slate-200">{item.text}</p>
                  </div>
                ))}
              </div>

              {feedback.correctedVersion && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">Versão Corrigida:</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200">{feedback.correctedVersion}</p>
                </div>
              )}

              {feedback.suggestions?.length > 0 && (
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">💡 Sugestões</p>
                  <ul className="space-y-1">
                    {feedback.suggestions.map((s, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                        <ChevronRightIcon className="size-3.5 text-blue-500 mt-0.5 shrink-0" strokeWidth={2} />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={handleGenerateTopic}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <RefreshCwIcon className="size-3.5" strokeWidth={1.5} />
                Praticar com novo tópico
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════ LISTENING ════════════════════════════ */
function ListeningPractice({ level }) {
  const [status, setStatus] = useState("idle"); // idle | loading | active | feedback | error
  const [exercise, setExercise] = useState(null);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [error, setError] = useState(null);
  const { speak, speaking, stop } = useSpeechSynthesis();

  const handleGenerate = async () => {
    setStatus("loading");
    setError(null);
    setAnswers({});
    setFeedback(null);
    setAudioPlayed(false);
    try {
      const data = await generateListeningExercise(level);
      if (data?.error) throw new Error(data.error);
      setExercise(data);
      setStatus("active");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const handlePlayAudio = () => {
    if (exercise?.text) {
      speak(exercise.text, { lang: "en-US", rate: 0.85 });
      setAudioPlayed(true);
    }
  };

  const handleAnswer = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleCheck = () => {
    const results = exercise.questions.map((q) => ({
      ...q,
      userAnswer: answers[q.id] || "",
      correct: (answers[q.id] || "").startsWith(q.correctAnswer),
    }));
    setFeedback(results);
    setStatus("feedback");
  };

  const allAnswered = exercise?.questions?.every((q) => answers[q.id]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">🎧 Listen & Answer</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Ouça o áudio e responda às perguntas</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={status === "loading"}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white rounded-lg text-sm font-medium transition"
        >
          {status === "loading" ? <Loader2Icon className="size-4 animate-spin" /> : <RefreshCwIcon className="size-4" />}
          {status === "idle" || status === "feedback" ? "Gerar Exercício" : "Novo Exercício"}
        </button>
      </div>

      {status === "loading" && <Spinner text="Gerando exercício de listening..." />}

      {status === "error" && (
        <div className="flex flex-col items-center py-12 text-center">
          <AlertCircleIcon className="size-12 text-red-400 mb-3" strokeWidth={1.5} />
          <p className="text-sm text-red-500 mb-2">{error}</p>
          <button onClick={handleGenerate} className="text-sm text-primary hover:underline">Tentar novamente</button>
        </div>
      )}

      {status === "idle" && (
        <div className="py-16 text-center">
          <HeadphonesIcon className="size-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" strokeWidth={1} />
          <p className="text-slate-500 dark:text-slate-400">Clique em "Gerar Exercício" para começar</p>
        </div>
      )}

      {(status === "active" || status === "feedback") && exercise && (
        <div className="space-y-6">
          {/* Audio Player */}
          <div className="p-5 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800">
            <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-2">{exercise.title}</p>
            <div className="flex items-center gap-3">
              <button
                onClick={speaking ? stop : handlePlayAudio}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition ${
                  speaking
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-purple-500 hover:bg-purple-600 text-white"
                }`}
              >
                {speaking ? <StopCircleIcon className="size-4" /> : <PlayIcon className="size-4" />}
                {speaking ? "Parar" : audioPlayed ? "Ouvir Novamente" : "Ouvir Áudio"}
              </button>
              <Volume2Icon className={`size-5 ${speaking ? "text-purple-500 animate-pulse" : "text-purple-300"}`} strokeWidth={1.5} />
            </div>
          </div>

          {/* Perguntas */}
          <div className="space-y-4">
            {exercise.questions.map((q) => {
              const isCorrect = feedback?.find((f) => f.id === q.id)?.correct;
              return (
                <div key={q.id} className={`p-4 rounded-xl border transition ${
                  status === "feedback"
                    ? isCorrect
                      ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10"
                      : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10"
                    : "border-slate-200 dark:border-slate-700"
                }`}>
                  <p className="text-sm font-medium text-slate-800 dark:text-white mb-3">{q.id}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isSelected = (answers[q.id] || "") === opt[0];
                      const disabled = status === "feedback";
                      return (
                        <button
                          key={opt}
                          onClick={() => !disabled && handleAnswer(q.id, opt[0])}
                          disabled={disabled}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                            disabled && isCorrect && isSelected
                              ? "bg-green-100 dark:bg-green-900/20 text-green-800 border border-green-300"
                              : disabled && !isCorrect && isSelected
                              ? "bg-red-100 dark:bg-red-900/20 text-red-800 border border-red-300"
                              : isSelected
                              ? "bg-primary/10 text-primary border border-primary/30"
                              : "bg-slate-50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary/50"
                          }`}
                        >
                          {opt}
                          {status === "feedback" && isSelected && (
                            <span className="float-right">{isCorrect ? "✅" : "❌"}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {status === "active" && (
            <button
              onClick={handleCheck}
              disabled={!allAnswered}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white rounded-xl font-medium transition"
            >
              <CheckCircle2Icon className="size-4" strokeWidth={1.5} />
              Corrigir Respostas
            </button>
          )}

          {status === "feedback" && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-800 dark:text-white mb-2">
                ✅ {feedback.filter((f) => f.correct).length} de {feedback.length} corretas
              </p>
              {/* Show transcript */}
              <details className="mt-3">
                <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">Ver transcrição do áudio</summary>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{exercise.text}</p>
              </details>
              <button onClick={handleGenerate} className="mt-3 flex items-center gap-2 text-sm text-primary hover:underline">
                <RefreshCwIcon className="size-3.5" strokeWidth={1.5} />
                Novo exercício
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════ WRITING ════════════════════════════ */
function WritingPractice({ level }) {
  const [status, setStatus] = useState("idle"); // idle | loading | active | processing | feedback | error
  const [prompt, setPrompt] = useState(null);
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  const handleGenerate = async () => {
    setStatus("loading");
    setError(null);
    setText("");
    setFeedback(null);
    setShowPrompt(false);
    try {
      const data = await generateWritingPrompt(level);
      if (data?.error) throw new Error(data.error);
      setPrompt(data);
      setStatus("active");
      setShowPrompt(true);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const handleReview = async () => {
    if (!text.trim()) return;
    setStatus("processing");
    try {
      const data = await evaluateWriting(text, prompt.prompt);
      setFeedback(data);
      setStatus("feedback");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">✍️ Write & Review</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Escreva e receba feedback detalhado</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={status === "loading"}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white rounded-lg text-sm font-medium transition"
        >
          {status === "loading" ? <Loader2Icon className="size-4 animate-spin" /> : <RefreshCwIcon className="size-4" />}
          {status === "idle" || status === "feedback" ? "Gerar Tema" : "Novo Tema"}
        </button>
      </div>

      {status === "loading" && <Spinner text="Gerando tema para redação..." />}

      {status === "error" && (
        <div className="flex flex-col items-center py-12 text-center">
          <AlertCircleIcon className="size-12 text-red-400 mb-3" strokeWidth={1.5} />
          <p className="text-sm text-red-500 mb-2">{error}</p>
          <button onClick={handleGenerate} className="text-sm text-primary hover:underline">Tentar novamente</button>
        </div>
      )}

      {status === "idle" && (
        <div className="py-16 text-center">
          <PenLineIcon className="size-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" strokeWidth={1} />
          <p className="text-slate-500 dark:text-slate-400">Clique em "Gerar Tema" para começar</p>
        </div>
      )}

      {status !== "idle" && status !== "loading" && prompt && (
        <div className="space-y-6">
          {/* Prompt */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 border border-orange-200 dark:border-orange-800">
            <p className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">Tema</p>
            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">{prompt.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{prompt.prompt}</p>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-xs text-slate-400">📝 {prompt.wordCount} palavras</span>
              {prompt.tips?.map((tip, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">💡 {tip}</span>
              ))}
            </div>
          </div>

          {/* Textarea */}
          {(status === "active" || status === "processing") && (
            <div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={status === "processing"}
                rows={8}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none text-sm leading-relaxed"
                placeholder="Escreva seu texto em inglês aqui..."
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-400">{wordCount} palavras</span>
                {status === "active" && (
                  <button
                    onClick={handleReview}
                    disabled={wordCount < 5}
                    className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white rounded-lg text-sm font-medium transition"
                  >
                    <SendIcon className="size-4" strokeWidth={1.5} />
                    Revisar
                  </button>
                )}
              </div>
            </div>
          )}

          {status === "processing" && <Spinner text="Avaliando sua redação..." />}

          {/* Feedback */}
          {status === "feedback" && feedback && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-4xl font-bold ${feedback.score >= 70 ? "text-green-500" : feedback.score >= 50 ? "text-yellow-500" : "text-red-500"}`}>
                  {feedback.score}%
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-white">Score Geral</p>
                  <p className="text-xs text-slate-400">Overall Performance</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Grammar", key: "grammar" },
                  { label: "Vocabulary", key: "vocabulary" },
                  { label: "Structure", key: "structure" },
                  { label: "Relevance", key: "relevance" },
                ].map((item) => {
                  const data = feedback[item.key];
                  if (!data) return null;
                  return (
                    <div key={item.key} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700">
                      <ScoreBar label={item.label} score={data.score || feedback.score} />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{data.feedback}</p>
                      {data.issues?.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {data.issues.map((issue, i) => (
                            <li key={i} className="text-xs text-red-500 flex items-start gap-1.5">
                              <span>•</span> {issue}
                            </li>
                          ))}
                        </ul>
                      )}
                      {data.suggestions?.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {data.suggestions.map((s, i) => (
                            <li key={i} className="text-xs text-emerald-600 dark:text-emerald-400 flex items-start gap-1.5">
                              <span>•</span> {s}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>

              {feedback.correctedVersion && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">📝 Versão Corrigida:</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line">{feedback.correctedVersion}</p>
                </div>
              )}

              {feedback.overallFeedback && (
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">💬 Feedback Geral:</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200">{feedback.overallFeedback}</p>
                </div>
              )}

              <button onClick={handleGenerate} className="flex items-center gap-2 text-sm text-primary hover:underline">
                <RefreshCwIcon className="size-3.5" strokeWidth={1.5} />
                Escrever sobre novo tema
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
