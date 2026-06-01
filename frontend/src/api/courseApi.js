const API = "https://macaw-english-course.onrender.com/api";

export async function getLessonsByLevel(levelCode) {
    const res = await fetch(`${API}/lessons/level/${levelCode}`);
    if (!res.ok) return [];
    return res.json();
}

export async function getLessonsByModule(moduleId) {
    const res = await fetch(`${API}/lessons/module/${moduleId}`);
    if (!res.ok) return [];
    return res.json();
}

export async function getLessonById(id) {
    const res = await fetch(`${API}/lessons/${id}`);
    if (!res.ok) return null;
    return res.json();
}

export async function getTestsByLevel(levelCode) {
    const res = await fetch(`${API}/tests/level/${levelCode}`);
    if (!res.ok) return [];
    return res.json();
}

export async function getTestById(id) {
    const res = await fetch(`${API}/tests/${id}`);
    if (!res.ok) return null;
    return res.json();
}

export async function getTestByModule(moduleId) {
    const res = await fetch(`${API}/tests/module/${moduleId}`);
    if (!res.ok) return null;
    return res.json();
}

export async function submitTestResult(result) {
    const res = await fetch(`${API}/tests/results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
    });
    if (!res.ok) throw new Error("Failed to submit test");
    return res.json();
}

export async function getProgress(studentId) {
    const res = await fetch(`${API}/progress/student/${studentId}`);
    if (!res.ok) return [];
    return res.json();
}

export async function getProgressByLevel(studentId, levelCode) {
    const res = await fetch(`${API}/progress/student/${studentId}/level/${levelCode}`);
    if (!res.ok) return null;
    return res.json();
}

export async function completeLesson(studentId, levelCode, lessonId, score, total) {
    const res = await fetch(`${API}/progress/complete-lesson`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, levelCode, lessonId, score, total }),
    });
    if (!res.ok) throw new Error("Failed to complete lesson");
    return res.json();
}
