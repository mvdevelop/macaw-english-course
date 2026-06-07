/**
 * Tests for courseApi.ts
 *
 * Uses global fetch mocking to test API call functions.
 */

import {
  getLessonsByLevel,
  getLessonById,
  getTestByModule,
  submitTestResult,
  getProgress,
  completeLesson,
} from "../courseApi";

const mockLesson = {
  _id: "lesson-1",
  title: "Test Lesson",
  levelCode: "A1",
  moduleId: "module-1",
  content: [],
  exercises: [],
};

const mockTest = {
  _id: "test-1",
  title: "Module Test",
  levelCode: "A1",
  moduleId: "module-1",
  questions: [],
  passingScore: 70,
};

describe("courseApi", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks();
  });

  describe("getLessonsByLevel", () => {
    it("returns lessons when API responds ok", async () => {
      const mockData = [mockLesson];
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as unknown as Response);

      const result = await getLessonsByLevel("A1");

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/lessons/level/A1")
      );
    });

    it("returns empty array when API responds with error", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
      } as unknown as Response);

      const result = await getLessonsByLevel("A1");

      expect(result).toEqual([]);
    });
  });

  describe("getLessonById", () => {
    it("returns lesson when found", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockLesson),
      } as unknown as Response);

      const result = await getLessonById("lesson-1");

      expect(result).toEqual(mockLesson);
    });

    it("returns null when lesson not found", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
      } as unknown as Response);

      const result = await getLessonById("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("getTestByModule", () => {
    it("returns test data when found", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTest),
      } as unknown as Response);

      const result = await getTestByModule("module-1");

      expect(result).toEqual(mockTest);
    });

    it("returns null when test not found", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
      } as unknown as Response);

      const result = await getTestByModule("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("submitTestResult", () => {
    it("submits result and returns response", async () => {
      const resultData = { id: "result-1", score: 85, passed: true };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(resultData),
      } as unknown as Response);

      const result = await submitTestResult({ studentId: "s1", score: 85 });

      expect(result).toEqual(resultData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/tests/results"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.any(String),
        })
      );
    });

    it("throws error on failed submission", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
      } as unknown as Response);

      await expect(submitTestResult({})).rejects.toThrow("Failed to submit test");
    });
  });

  describe("getProgress", () => {
    it("returns progress data", async () => {
      const progressData = [{ studentId: "s1", levelCode: "A1", overallProgress: 50 }];
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(progressData),
      } as unknown as Response);

      const result = await getProgress("s1");

      expect(result).toEqual(progressData);
    });

    it("returns empty array on error", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
      } as unknown as Response);

      const result = await getProgress("s1");

      expect(result).toEqual([]);
    });
  });

  describe("completeLesson", () => {
    it("completes lesson successfully", async () => {
      const responseData = { overallProgress: 50 };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(responseData),
      } as unknown as Response);

      const result = await completeLesson("s1", "A1", "lesson-1", 8, 10);

      expect(result).toEqual(responseData);
    });

    it("throws error on failure", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
      } as unknown as Response);

      await expect(completeLesson("s1", "A1", "lesson-1", 8, 10)).rejects.toThrow(
        "Failed to complete lesson"
      );
    });
  });
});
