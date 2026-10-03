import type { Course, Lesson, LessonEntry, Module } from "./types";
import { sqlFromZero } from "./courses/sql-from-zero";

export const courses: Course[] = [sqlFromZero];

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function allLessons(course: Course): { module: Module; lesson: LessonEntry }[] {
  return course.modules.flatMap((module) => module.lessons.map((lesson) => ({ module, lesson })));
}

export function readyLessons(course: Course): Lesson[] {
  return allLessons(course)
    .map((x) => x.lesson)
    .filter((l): l is Lesson => l.status === "ready");
}

export function getLesson(
  course: Course,
  slug: string,
): { module: Module; lesson: Lesson; prev?: Lesson; next?: Lesson } | undefined {
  const ready = readyLessons(course);
  const i = ready.findIndex((l) => l.slug === slug);
  if (i === -1) return undefined;
  const mod = course.modules.find((m) => m.lessons.some((l) => l.slug === slug))!;
  return { module: mod, lesson: ready[i], prev: ready[i - 1], next: ready[i + 1] };
}
