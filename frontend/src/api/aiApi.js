const AI_API = "https://macaw-english-course.onrender.com/api/ai/chat";

async function sendToAI(prompt, context = "", retries = 3) {
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
      if (err.message?.includes("Failed to fetch") || err.message?.includes("NetworkError")) {
        await new Promise((r) => setTimeout(r, 2000 * attempt));
        continue;
      }
      throw err;
    }
  }
}

/* ── Reading ── */
export async function generateReadingExercise(level = "intermediário") {
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
  return parseJsonFromResponse(res.text);
}

/* ── Speaking ── */
export async function generateSpeakingTopic(level = "intermediário") {
  const prompt = `Suggest ONE conversation topic for a ${level} English learner to practice speaking.
Return ONLY a JSON object (no markdown):
{"topic": "the topic in English", "questions": ["follow-up question 1", "follow-up question 2", "follow-up question 3"], "vocabulary": ["word1", "word2", "word3"]}`;

  const res = await sendToAI(prompt);
  return parseJsonFromResponse(res.text);
}

export async function evaluateSpeaking(transcript, topic) {
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
  return parseJsonFromResponse(res.text);
}

/* ── Listening ── */
export async function generateListeningExercise(level = "intermediário") {
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
  return parseJsonFromResponse(res.text);
}

/* ── Writing ── */
export async function generateWritingPrompt(level = "intermediário") {
  const prompt = `Create a writing prompt for a ${level} English learner.
Return ONLY a JSON object (no markdown):
{
  "title": "writing task title",
  "prompt": "detailed writing prompt in English with instructions",
  "wordCount": "120-150",
  "tips": ["quick tip 1", "quick tip 2", "quick tip 3"]
}`;

  const res = await sendToAI(prompt);
  return parseJsonFromResponse(res.text);
}

export async function evaluateWriting(text, prompt) {
  const evaluationPrompt = `Evaluate this English writing for the prompt: "${prompt}"

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
  return parseJsonFromResponse(res.text);
}

/* ── Helper ── */
function parseJsonFromResponse(text) {
  if (!text) return null;
  try {
    // Try direct parse first
    return JSON.parse(text);
  } catch {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch {}
    }
    // Try to find { } pattern
    const braceMatch = text.match(/{[\s\S]*}/);
    if (braceMatch) {
      try {
        return JSON.parse(braceMatch[0]);
      } catch {}
    }
    return { error: "Failed to parse AI response", raw: text };
  }
}
