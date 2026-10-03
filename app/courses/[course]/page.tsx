import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { courses, getCourse } from "@/lib/content";
import { CourseLessonStatus } from "@/components/CourseLessonStatus";

export function generateStaticParams() {
  return courses.map((c) => ({ course: c.slug }));
}

export async function generateMetadata(props: PageProps<"/courses/[course]">): Promise<Metadata> {
  const course = getCourse((await props.params).course);
  return course ? { title: course.title, description: course.tagline } : {};
}

export default async function CoursePage(props: PageProps<"/courses/[course]">) {
  const course = getCourse((await props.params).course);
  if (!course) notFound();

  return (
    <main className="container">
      <section className="course-head">
        <div className="eyebrow">Course · {course.hours}</div>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <p className="small">{course.audience}</p>
      </section>

      <div className="modules">
        {course.modules.map((m) => {
          const ready = m.lessons.filter((l) => l.status === "ready").length;
          return (
            <section key={m.number} className="module">
              <div className="module-head">
                <div>
                  <div className="eyebrow">Module {m.number}</div>
                  <h2>{m.title}</h2>
                </div>
                {ready === 0 && <span className="pill">Coming soon</span>}
              </div>
              <p>{m.description}</p>
              <ul className="lesson-list">
                {m.lessons.map((l) => (
                  <li key={l.slug}>
                    {l.status === "ready" ? (
                      <Link className="lesson-row" href={`/courses/${course.slug}/${l.slug}`}>
                        <span className="lesson-num">{l.number}</span>
                        <span className="lesson-title">{l.title}</span>
                        <CourseLessonStatus lesson={l} />
                      </Link>
                    ) : (
                      <div className="lesson-row planned">
                        <span className="lesson-num">{l.number}</span>
                        <span className="lesson-title">{l.title}</span>
                        <span className="small">Coming soon</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
