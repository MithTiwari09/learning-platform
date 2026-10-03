import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container course-head">
      <h1>Page not found</h1>
      <p>That lesson or page doesn&apos;t exist yet.</p>
      <p>
        <Link href="/courses/sql-from-zero">Go to SQL from Zero</Link>
      </p>
    </main>
  );
}
