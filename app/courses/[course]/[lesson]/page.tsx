import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { courses, getCourse, getLesson, readyLessons } from "@/lib/content";
import { Markdown } from "@/components/Markdown";
import { LessonPractice } from "@/components/LessonPractice";
import { LessonProgressPanel } from "@/components/LessonProgressPanel";
import { Quiz } from "@/components/Quiz";
import { SchemaPanel } from "@/components/SchemaPanel";

export function generateStaticParams() {
  return courses.flatMap((c) => readyLessons(c).map((l) => ({ course: c.slug, lesson: l.slug })));
}

async function load(props: PageProps<"/courses/[course]/[lesson]">) {
  const { course: courseSlug, lesson: lessonSlug } = await props.params;
  const course = getCourse(courseSlug);
  const found = course && getLesson(course, lessonSlug);
  return course && found ? { course, ...found } : null;
}

export async function generateMetadata(props: PageProps<"/courses/[course]/[lesson]">): Promise<Metadata> {
  const data = await load(props);
  return data ? { title: `${data.lesson.title} · ${data.course.title}`, description: data.lesson.summary } : {};
}

export default async function LessonPage(props: PageProps<"/courses/[course]/[lesson]">) {
  const data = await load(props);
  if (!data) notFound();
  const { course, module, lesson, prev, next } = data;
  const lessonCount = course.modules.reduce((n, m) => n + m.lessons.length, 0);
  const base = `/courses/${course.slug}`;

  return (
    <div className="container lesson-layout">
      <main className="lesson-main">
        <section>
          <div className="crumbs">
            <Link href={base}>{course.title}</Link> › Module {module.number}: {module.title}
          </div>
          <h1>{lesson.title}</h1>
          <p className="lede">{lesson.summary}</p>
          <p className="small">
            Lesson {lesson.number} of {lessonCount} · about {lesson.minutes} minutes
          </p>
        </section>

        <section aria-label="Lesson video" className="video">
          <div className="play" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M5 3l12 7-12 7z" />
            </svg>
          </div>
          <div>
            <strong>Video: {lesson.video.title}</strong>
            <small>The narrated video for this lesson is coming soon. The lesson below covers the same ideas.</small>
          </div>
        </section>

        <section>
          <h2>The lesson</h2>
          <Markdown>{lesson.body}</Markdown>
        </section>

        <section className="key-ideas">
          <div className="eyebrow">Key ideas</div>
          <ul>
            {lesson.keyIdeas.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Practise</h2>
          <LessonPractice lesson={lesson} />
        </section>

        <section>
          <h2>Quick check</h2>
          <Quiz lessonSlug={lesson.slug} questions={lesson.quiz} />
        </section>

        <nav className="pager" aria-label="Lesson navigation">
          {prev ? (
            <Link className="btn" href={`${base}/${prev.slug}`}>
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link className="btn primary" href={`${base}/${next.slug}`}>
              Next: {next.title} →
            </Link>
          ) : (
            <Link className="btn primary" href={base}>
              Back to the course
            </Link>
          )}
        </nav>
      </main>

      <aside className="rail">
        <LessonProgressPanel lesson={lesson} />
        {lesson.practiceDb?.showBookshopTables && <SchemaPanel />}
      </aside>
    </div>
  );
}
