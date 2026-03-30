import type { Metadata } from "next";
import Link from "next/link";
import { buildLog } from "@/data/buildLog";

export const metadata: Metadata = {
  title: "Build Log",
  description:
    "Engineering notebook. What changed, why, what worked, and what comes next.",
};

export default function BuildLog() {
  return (
    <div style={{ background: "#07080C", minHeight: "100vh" }}>
      {/* Header */}
      <section
        className="px-6 pt-32 pb-12"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "linear-gradient(to bottom, #07080C, #0D0F17)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <span
            className="text-xs font-semibold uppercase tracking-widest block mb-4"
            style={{ color: "#C8865A", fontFamily: "var(--font-display)" }}
          >
            Lab Notes
          </span>
          <h1 className="heading-xl mb-4" style={{ color: "#ECEDF2" }}>
            Build Log
          </h1>
          <p className="body-lg">
            Reverse-chronological engineering notebook. Short notes on what
            changed, why, what the outcome was, and what comes next.
          </p>
          <p className="body-sm mt-3" style={{ color: "#4D5260" }}>
            Not polished. Not marketing. Just what actually happened.
          </p>
        </div>
      </section>

      {/* Entries */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-0">
            {buildLog.map((entry, i) => (
              <article
                key={entry.id}
                className="py-10"
                style={{
                  borderBottom:
                    i < buildLog.length - 1
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "none",
                }}
              >
                {/* Entry header */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className="text-xs"
                    style={{
                      color: "#4D5260",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {entry.date}
                  </span>
                  <span
                    className="w-px h-3"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                    aria-hidden="true"
                  />
                  <Link
                    href={`/projects/${entry.projectSlug}`}
                    className="text-xs px-2.5 py-0.5 rounded"
                    style={{
                      color: "#C8865A",
                      background: "rgba(200,134,90,0.08)",
                      border: "1px solid rgba(200,134,90,0.18)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {entry.project}
                  </Link>
                </div>

                <h2
                  className="heading-sm mb-6"
                  style={{ color: "#ECEDF2" }}
                >
                  {entry.title}
                </h2>

                {/* Structured fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <span
                      className="text-xs font-semibold uppercase tracking-widest block mb-2"
                      style={{
                        color: "#4D5260",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      What changed
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: "#8A8F9C" }}>
                      {entry.what}
                    </p>
                  </div>

                  <div>
                    <span
                      className="text-xs font-semibold uppercase tracking-widest block mb-2"
                      style={{
                        color: "#4D5260",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      Why
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: "#8A8F9C" }}>
                      {entry.why}
                    </p>
                  </div>

                  <div>
                    <span
                      className="text-xs font-semibold uppercase tracking-widest block mb-2"
                      style={{
                        color: "#4D5260",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      Result
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: "#DFA070" }}>
                      {entry.result}
                    </p>
                  </div>

                  <div>
                    <span
                      className="text-xs font-semibold uppercase tracking-widest block mb-2"
                      style={{
                        color: "#4D5260",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      Next
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: "#8A8F9C" }}>
                      {entry.next}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
