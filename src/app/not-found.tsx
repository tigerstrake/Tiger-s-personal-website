import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="min-h-screen px-6 flex items-center"
      style={{ background: "#07080C", color: "#ECEDF2" }}
    >
      <div className="max-w-xl mx-auto">
        <span
          className="text-xs font-semibold uppercase tracking-widest block mb-4"
          style={{ color: "#C8865A", fontFamily: "var(--font-display)" }}
        >
          404
        </span>
        <h1 className="heading-lg mb-4">Page not found</h1>
        <p className="body-lg mb-8">
          The page you are looking for does not exist, or it moved during a site
          rebuild.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/projects"
            className="inline-flex items-center px-5 py-2.5 rounded text-sm font-semibold hover-accent-bg"
            style={{
              fontFamily: "var(--font-display)",
              background: "#C8865A",
              color: "#07080C",
              textDecoration: "none",
            }}
          >
            View projects
          </Link>
          <Link
            href="/"
            className="inline-flex items-center px-5 py-2.5 rounded text-sm font-semibold border hover-light"
            style={{
              fontFamily: "var(--font-display)",
              color: "#8A8F9C",
              borderColor: "rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              textDecoration: "none",
            }}
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
