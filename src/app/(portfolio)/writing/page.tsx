import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Physics notes, astrophysics writing, and occasional technical reflection.",
};

export default function Writing() {
  return (
    <div style={{ background: "#07080C", minHeight: "100vh" }}>
      <section
        className="px-6 pt-32 pb-16"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "linear-gradient(to bottom, #07080C, #0D0F17)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <span
            className="text-xs font-semibold uppercase tracking-widest block mb-4"
            style={{ color: "#C8865A", fontFamily: "var(--font-display)" }}
          >
            Writing
          </span>
          <h1 className="heading-xl mb-4" style={{ color: "#ECEDF2" }}>
            Physics &amp; Writing
          </h1>
          <p className="body-lg" style={{ maxWidth: "520px" }}>
            Astrophysics notes, the occasional technical reflection, and
            anything else that doesn&apos;t fit neatly into a project page.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">

          {/* ASTR S-80 paper */}
          <div className="mb-16">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h2 className="heading-sm" style={{ color: "#ECEDF2" }}>
                Stellar Remnants: Black Holes, Neutron Stars and White Dwarfs
              </h2>
            </div>
            <p
              className="text-xs mb-5"
              style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
            >
              ASTR S-80 · Harvard University Summer School · 2023
            </p>
            <p className="body-lg mb-4">
              Final paper for the Harvard astrophysics course. Covers the three
              types of stellar remnants (white dwarfs, neutron stars, and black
              holes) and what determines which one a star becomes (the answer is
              just mass). The paper goes into electron degeneracy pressure and
              the Pauli exclusion principle for white dwarfs, neutron star
              formation mechanics, and black hole physics including the
              information paradox and its relationship to string theory.
            </p>
            <p className="body-lg mb-6">
              One section I found genuinely interesting: whether planets orbiting
              neutron stars are survivors of the original supernova or formed
              afterward from the debris disk. The answer isn&apos;t settled, and
              the implications for planetary formation theory are significant
              either way.
            </p>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "#C8865A", fontFamily: "var(--font-display)" }}
                >
                  Full paper
                </span>
                <a
                  href="/docs/tiger-strake-astrobiology-paper.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs"
                  style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
                >
                  Open ↗
                </a>
              </div>
              <iframe
                src="/docs/tiger-strake-astrobiology-paper.pdf"
                className="w-full rounded-lg"
                style={{
                  height: "700px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "#0A0B10",
                }}
                title="Stellar Remnants paper"
              />
            </div>
          </div>

          <hr className="section-divider mb-16" />

          {/* Placeholder for future entries */}
          <div
            className="text-center py-20"
            style={{ color: "#4D5260" }}
          >
            <p
              className="text-sm mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              More writing will be added here.
            </p>
            <p className="text-xs" style={{ fontFamily: "var(--font-mono)" }}>
              Physics notes · Technical reflections · Lab observations
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
