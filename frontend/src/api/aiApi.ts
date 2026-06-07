import type {
  ReadingExercise,
  SpeakingTopic,
  ListeningExercise,
  WritingPrompt,
  SpeakingEvaluation,
  WritingEvaluation,
  MockData,
  AiResponse,
} from "../types";

const AI_API = "https://macaw-english-course.onrender.com/api/ai/chat";
const USE_MOCK = false; // Mude para true para testar sem API

/* ── Dados mock para fallback quando a IA estiver fora ── */
const MOCK_DATA: MockData = {
  reading: {
    title: "My Daily Routine",
    text: "Every morning, I wake up at 7 o'clock. I brush my teeth and take a shower. Then I have breakfast with my family. I usually eat bread and drink milk. After breakfast, I go to school. I study English, Math, and Science. In the afternoon, I do my homework and play with my friends.",
    questions: [
      { id: 1, question: "What time does the person wake up?", options: ["A) 6:00", "B) 7:00", "C) 8:00", "D) 9:00"], correctAnswer: "B" },
      { id: 2, question: "What does the person eat for breakfast?", options: ["A) Rice and beans", "B) Cereal and fruit", "C) Bread and milk", "D) Eggs and toast"], correctAnswer: "C" },
      { id: 3, question: "What does the person do in the afternoon?", options: ["A) Watch TV", "B) Play video games", "C) Homework and play", "D) Take a nap"], correctAnswer: "C" },
    ],
  },
  speaking: {
    topic: "Talk about your favorite hobby",
    questions: ["What is your favorite hobby?", "How often do you do it?", "Why do you enjoy it?"],
    vocabulary: ["hobby", "enjoy", "relaxing", "creative", "fun"],
  },
  listening: {
    title: "A Day at the Park",
    text: "Last Sunday, Sarah went to the park with her family. The weather was beautiful and sunny. She played soccer with her brother while her parents read books under a tree. They had a picnic with sandwiches and fruit. Sarah had a wonderful time.",
    questions: [
      { id: 1, question: "Where did Sarah go?", options: ["A) The beach", "B) The park", "C) The mall", "D) The school"], correctAnswer: "B" },
      { id: 2, question: "What did Sarah do with her brother?", options: ["A) Read books", "B) Played soccer", "C) Ate lunch", "D) Swam"], correctAnswer: "B" },
      { id: 3, question: "What did they have for the picnic?", options: ["A) Pizza and soda", "B) Sandwiches and fruit", "C) Salad and water", "D) Cake and juice"], correctAnswer: "B" },
    ],
  },
  writing: {
    title: "My Best Friend",
    prompt: "Write a short paragraph describing your best friend. Include their name, what they look like, their personality, and why you like spending time with them.",
    wordCount: "80-120",
    tips: ["Use adjectives to describe appearance", "Talk about personality traits", "Give an example of a fun memory"],
  },
};

/* ── Avaliação mock ── */
const MOCK_EVALUATION: SpeakingEvaluation & { overallFeedback: string } = {
  score: 75,
  grammar: "Good use of basic tenses. Try using more complex sentence structures.",
  vocabulary: "Adequate vocabulary. Consider learning more descriptive words.",
  pronunciation: "Clear pronunciation. Practice the 'th' sound more.",
  suggestions: ["Use more connectors like 'however' and 'therefore'", "Expand your vocabulary with synonyms"],
  correctedVersion: "I wake up at 7 o'clock every morning. After brushing my teeth and taking a shower, I have breakfast with my family.",
  overallFeedback: "Muito bom! Continue praticando que você vai longe! 🚀",
};

async function sendToAI(prompt: string, context: string = "", retries: number = 3): Promise<AiResponse> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(AI_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, context }),
      });

      if (res.ok) return res.json();

      const err = await res.json().catch(() => ({ error: "Erro de conexão com o servidor" }));

      // 429 — rate limit: espera e tenta novamente
      if (res.status === 429 && attempt < retries) {
        const delay = (err.retryAfter || 2) * 1000 * attempt;
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      throw new Error(err.error || `Erro ${res.status}: Falha ao comunicar com a IA`);
    } catch (err) {
      if (attempt === retries) throw err;
      // Erro de rede: espera e tenta novamente
      if (err instanceof Error && (err.message?.includes("Failed to fetch") || err.message?.includes("NetworkError"))) {
        await new Promise((r) => setTimeout(r, 2000 * attempt));
        continue;
      }
      throw err;
    }
  }
  // This should never be reached but satisfies TypeScript
  throw new Error("All retries exhausted");
}

/* ── Reading ── */
export async function generateReadingExercise(level: string = "intermediário"): Promise<ReadingExercise> {
  if (USE_MOCK) return MOCK_DATA.reading;
  try {
    const prompt = `Generate a short English reading exercise for a ${level} learner.

Return the response in this exact JSON structure (no markdown, no backticks):
{
  "title": "title of the text",
  "text": "the reading text in English (4-8 sentences)",
  "questions": [
    {"id": 1, "question": "question in English about the text?", "options": ["A) option", "B) option", "C) option", "D) option"], "correctAnswer": "A"},
    {"id": 2, "question": "question in English?", "options": ["A) option", "B) option", "C) option", "D) option"], "correctAnswer": "C"},
    {"id": 3, "question": "question in English?", "options": ["A) option", "B) option", "C) option", "D) option"], "correctAnswer": "B"}
  ]
}`;
    const res = await sendToAI(prompt);
    return parseJsonFromResponse<ReadingExercise>(res.text) || MOCK_DATA.reading;
  } catch {
    return MOCK_DATA.reading;
  }
}

/* ── Speaking ── */
export async function generateSpeakingTopic(level: string = "intermediário"): Promise<SpeakingTopic> {
  if (USE_MOCK) return MOCK_DATA.speaking;
  try {
    const prompt = `Suggest ONE conversation topic for a ${level} English learner to practice speaking.
Return ONLY a JSON object (no markdown):
{"topic": "the topic in English", "questions": ["follow-up question 1", "follow-up question 2", "follow-up question 3"], "vocabulary": ["word1", "word2", "word3"]}`;
    const res = await sendToAI(prompt);
    return parseJsonFromResponse<SpeakingTopic>(res.text) || MOCK_DATA.speaking;
  } catch {
    return MOCK_DATA.speaking;
  }
}

export async function evaluateSpeaking(transcript: string, topic: string): Promise<SpeakingEvaluation> {
  if (USE_MOCK) return { ...MOCK_EVALUATION, grammar: `Good attempt on "${topic}". ${MOCK_EVALUATION.grammar}` };
  try {
    const prompt = `Evaluate this English speech response about "${topic}".

Student's speech: "${transcript}"

Return ONLY a JSON object (no markdown):
{
  "score": number between 0-100,
  "grammar": "brief grammar assessment",
  "vocabulary": "brief vocabulary assessment",
  "pronunciation": "brief pronunciation assessment",
  "suggestions": ["suggestion 1", "suggestion 2"],
  "correctedVersion": "a corrected version of what the student tried to say"
}`;
    const res = await sendToAI(prompt);
    return parseJsonFromResponse<SpeakingEvaluation>(res.text) || { ...MOCK_EVALUATION, grammar: `Good attempt on "${topic}". ${MOCK_EVALUATION.grammar}` };
  } catch {
    return { ...MOCK_EVALUATION, grammar: `Good attempt on "${topic}". ${MOCK_EVALUATION.grammar}` };
  }
}

/* ── Listening ── */
export async function generateListeningExercise(level: string = "intermediário"): Promise<ListeningExercise> {
  if (USE_MOCK) return MOCK_DATA.listening;
  try {
    const prompt = `Create a short English listening exercise for a ${level} learner.

Return ONLY a JSON object (no markdown):
{
  "title": "title",
  "text": "the text that would be read aloud (3-5 sentences)",
  "questions": [
    {"id": 1, "question": "comprehension question in English?", "options": ["A) option", "B) option", "C) option", "D) option"], "correctAnswer": "B"},
    {"id": 2, "question": "comprehension question?", "options": ["A) option", "B) option", "C) option", "D) option"], "correctAnswer": "A"},
    {"id": 3, "question": "comprehension question?", "options": ["A) option", "B) option", "C) option", "D) option"], "correctAnswer": "C"}
  ]
}`;
    const res = await sendToAI(prompt);
    return parseJsonFromResponse<ListeningExercise>(res.text) || MOCK_DATA.listening;
  } catch {
    return MOCK_DATA.listening;
  }
}

/* ── Writing ── */
export async function generateWritingPrompt(level: string = "intermediário"): Promise<WritingPrompt> {
  if (USE_MOCK) return MOCK_DATA.writing;
  try {
    const prompt = `Create a writing prompt for a ${level} English learner.
Return ONLY a JSON object (no markdown):
{
  "title": "writing task title",
  "prompt": "detailed writing prompt in English with instructions",
  "wordCount": "120-150",
  "tips": ["quick tip 1", "quick tip 2", "quick tip 3"]
}`;
    const res = await sendToAI(prompt);
    return parseJsonFromResponse<WritingPrompt>(res.text) || MOCK_DATA.writing;
  } catch {
    return MOCK_DATA.writing;
  }
}

export async function evaluateWriting(text: string, promptText: string): Promise<WritingEvaluation> {
  if (USE_MOCK) return MOCK_EVALUATION as unknown as WritingEvaluation;
  try {
    const evaluationPrompt = `Evaluate this English writing for the prompt: "${promptText}"

Student's text: "${text}"

Return ONLY a JSON object (no markdown):
{
  "score": number between 0-100,
  "grammar": {"score": 0-100, "feedback": "feedback on grammar", "issues": ["issue 1", "issue 2"]},
  "vocabulary": {"score": 0-100, "feedback": "feedback on vocabulary", "suggestions": ["suggestion 1"]},
  "structure": {"score": 0-100, "feedback": "feedback on structure"},
  "relevance": {"score": 0-100, "feedback": "how relevant to the prompt"},
  "correctedVersion": "a corrected version of the text",
  "overallFeedback": "general feedback and encouragement in Portuguese"
}`;
    const res = await sendToAI(evaluationPrompt);
    return parseJsonFromResponse<WritingEvaluation>(res.text) || (MOCK_EVALUATION as unknown as WritingEvaluation);
  } catch {
    return MOCK_EVALUATION as unknown as WritingEvaluation;
  }
}

/* ── Helper ── */
function parseJsonFromResponse<T>(text: string | undefined): T | null {
  if (!text) return null;
  try {
    // Try direct parse first
    return JSON.parse(text) as T;
  } catch {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim()) as T;
      } catch {
        // fall through
      }
    }
    // Try to find { } pattern
    const braceMatch = text.match(/{[\s\S]*}/);
    if (braceMatch) {
      try {
        return JSON.parse(braceMatch[0]) as T;
      } catch {
        // fall through
      }
    }
    return null;
  }
}
