import type { StudentProgress } from "../types";

// Lesson and Test types are defined locally as they aren't in the shared types file
interface Lesson {
  id?: string;
  title?: string;
  description?: string;
  levelCode?: string;
  moduleId?: string;
  [key: string]: unknown;
}

interface Test {
  id?: string;
  title?: string;
  description?: string;
  levelCode?: string;
  moduleId?: string;
  [key: string]: unknown;
}

const API = "https://macaw-english-course.onrender.com/api";

export async function getLessonsByLevel(levelCode: string): Promise<Lesson[]> {
  const res = await fetch(`${API}/lessons/level/${levelCode}`);
  if (!res.ok) return [];
  return res.json();
}

export async function getLessonsByModule(moduleId: string): Promise<Lesson[]> {
  const res = await fetch(`${API}/lessons/module/${moduleId}`);
  if (!res.ok) return [];
  return res.json();
}

export async function getLessonById(id: string): Promise<Lesson | null> {
  const res = await fetch(`${API}/lessons/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function getTestsByLevel(levelCode: string): Promise<Test[]> {
  const res = await fetch(`${API}/tests/level/${levelCode}`);
  if (!res.ok) return [];
  return res.json();
}

export async function getTestById(id: string): Promise<Test | null> {
  const res = await fetch(`${API}/tests/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function getTestByModule(moduleId: string): Promise<Test | null> {
  const res = await fetch(`${API}/tests/module/${moduleId}`);
  if (!res.ok) return null;
  return res.json();
}

export async function submitTestResult(result: Record<string, unknown>): Promise<unknown> {
  const res = await fetch(`${API}/tests/results`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result),
  });
  if (!res.ok) throw new Error("Failed to submit test");
  return res.json();
}

export async function getProgress(studentId: string): Promise<StudentProgress[]> {
  const res = await fetch(`${API}/progress/student/${studentId}`);
  if (!res.ok) return [];
  return res.json();
}

export async function getProgressByLevel(
  studentId: string,
  levelCode: string
): Promise<StudentProgress | null> {
  const res = await fetch(`${API}/progress/student/${studentId}/level/${levelCode}`);
  if (!res.ok) return null;
  return res.json();
}

export async function completeLesson(
  studentId: string,
  levelCode: string,
  lessonId: string,
  score: number,
  total: number
): Promise<unknown> {
  const res = await fetch(`${API}/progress/complete-lesson`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, levelCode, lessonId, score, total }),
  });
  if (!res.ok) throw new Error("Failed to complete lesson");
  return res.json();
}
