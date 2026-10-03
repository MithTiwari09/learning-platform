import Link from "next/link";
import { courses, readyLessons } from "@/lib/content";

const LOOP = [
  { name: "Watch", text: "A short video explains one idea." },
  { name: "Read", text: "A one-screen summary you can come back to." },
  { name: "Practise", text: "Try it straight away, with instant feedback." },
  { name: "Check", text: "A quick quiz, then on to the next lesson." },
];

export default function Home() {
  return (
    <main className="container">
      <section className="hero">
        <div className="eyebrow">For students and professionals, anywhere</div>
        <h1>Learn it. Then do it.</h1>
        <p>
          Every lesson ends with hands-on practice right in your browser, so you build real skills instead of just
          watching videos.
        </p>
      </section>

      <div className="loop">
        {LOOP.map((s) => (
          <div key={s.name}>
            <b>{s.name}</b>
            <span>{s.text}</span>
          </div>
        ))}
      </div>

      <h2 className="eyebrow" style={{ marginBottom: 12 }}>
        Courses
      </h2>
      {courses.map((course) => {
        const lessonCount = course.modules.reduce((n, m) => n + m.lessons.length, 0);
        const first = readyLessons(course)[0];
        return (
          <article key={course.slug} className="course-card">
            <div>
              <div className="eyebrow">Beginner · {course.hours}</div>
              <h3>{course.title}</h3>
              <p>{course.tagline}</p>
              <div className="meta-row">
                <span className="pill">{course.modules.length} modules</span>
                <span className="pill">{lessonCount} lessons</span>
                <span className="pill accent">Practice in the browser</span>
              </div>
            </div>
            <div className="meta-row">
              <Link className="btn" href={`/courses/${course.slug}`}>
                See the course
              </Link>
              {first && (
                <Link className="btn primary" href={`/courses/${course.slug}/${first.slug}`}>
                  Start lesson 1
                </Link>
              )}
            </div>
          </article>
        );
      })}
    </main>
  );
}
