import Link from "next/link";
import OrbitalBackground from "@/components/OrbitalBackground";
import ProjectCard from "@/components/ProjectCard";
import { getFeaturedProjects } from "@/data/projects";
import { buildLog } from "@/data/buildLog";
import { ArrowRight, Github, Linkedin } from "lucide-react";

const CREDENTIALS = [
  { label: "Stanford AeroAstro", detail: "Class of 2029" },
  { label: "ESA", detail: "BepiColombo, LISA Pathfinder" },
  { label: "German Aerospace Center (DLR)", detail: "Mach 10 hypersonic testing" },
  {
    label: "European Organisation for the Exploitation of Meteorological Satellites (EUMETSAT)",
    detail: "Satellite operations",
  },
  { label: "Harvard", detail: "Digital fabrication" },
  { label: "EASA + FAA PPL", detail: "SEP and night privileges; helicopter rating in training" },
];

export default function Home() {
  const featured = getFeaturedProjects();
  const recentLog = buildLog.slice(0, 3);

  return (
    <>
      {/* Physics Background */}
      <OrbitalBackground showTutorial />

      {/* Content above canvas */}
      <div className="relative" style={{ zIndex: 1 }}>

        {/* ─── Hero ──────────────────────────────────────────────────────── */}
        <section
          className="min-h-screen flex flex-col justify-center"
          style={{ paddingTop: "80px" }}
        >
          <div className="max-w-6xl mx-auto w-full px-6">
            <div
              className="inline-flex items-center gap-2 text-xs font-medium mb-8 animate-fade-up"
              style={{
                fontFamily: "var(--font-display)",
                color: "#C8865A",
                letterSpacing: "0.1em",
              }}
            >
              <span className="w-8 h-px" style={{ background: "#C8865A" }} />
              STANFORD AEROASTRO &rsquo;29
            </div>

            <h1
              className="animate-fade-up stagger-2"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4.5vw, 3rem)",
                color: "#C8D0E4",
                fontWeight: 600,
                letterSpacing: "0",
                lineHeight: 1.3,
                maxWidth: "680px",
                marginBottom: "1.5rem",
              }}
            >
              Hi, I&apos;m Tiger!
            </h1>

            <div className="animate-fade-up stagger-3" style={{ maxWidth: "640px", marginBottom: "2.5rem" }}>
              <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "#B0B6CB", marginBottom: "1rem", fontFamily: "var(--font-body)" }}>
                I&apos;m a Stanford AeroAstro student from Germany focused on aerospace hardware:
                high-power rockets, fixed-wing UAVs, embedded controls, and
                fabrication-heavy test rigs. Before turning 16, I interned at
                the European Space Agency and the European Organisation for the
                Exploitation of Meteorological Satellites (EUMETSAT), and worked
                on hypersonic hardware testing at the German Aerospace Center (DLR).
              </p>
              <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "#B0B6CB", marginBottom: "1rem", fontFamily: "var(--font-body)" }}>
                At Stanford, I&apos;m part of the Swift Solar Plane Project. We&apos;re
                building a solar-powered airplane more than five meters across
                for autonomous, multi-day flight, with the long-term goal of the
                world record for the longest continuous electric flight. I also
                hold EASA and FAA private pilot licenses.
              </p>
              <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "#B0B6CB", marginBottom: "1rem", fontFamily: "var(--font-body)" }}>
                Away from the lab, I like mountaineering, running the trails around
                the Stanford Dish, and wakeboarding.
              </p>
              <p style={{ fontSize: "1rem", lineHeight: 1.6, color: "#B8BDD0", fontFamily: "var(--font-display)", fontWeight: 600, fontStyle: "italic" }}>
                And yes, my real name is Tiger.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 animate-fade-up" style={{ marginBottom: "3rem", animationDelay: "0.33s" }}>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-semibold hover-accent-bg"
                style={{
                  fontFamily: "var(--font-display)",
                  background: "#C8865A",
                  color: "#07080C",
                  transition: "background 0.2s, transform 0.2s",
                }}
              >
                View projects
                <ArrowRight size={14} />
              </Link>

              <a
                href="https://github.com/tigerstrake"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-semibold border hover-light"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "#8A8F9C",
                  borderColor: "rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  transition: "color 0.2s, border-color 0.2s",
                }}
              >
                <Github size={14} />
                GitHub
              </a>
            </div>

            {/* Credential strip */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              {CREDENTIALS.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="w-1 h-1 rounded-full shrink-0"
                    style={{ background: i === 0 ? "#C8865A" : "rgba(200,134,90,0.4)" }}
                  />
                  <span
                    className="text-xs"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#8A8F9C",
                      letterSpacing: "0.02em",
                    }}
                  >
                    <span style={{ color: "#B8BDD0", fontWeight: 600 }}>{c.label}</span>
                    {" "}{c.detail}
                  </span>
                </div>
              ))}
            </div>

            {/* Simulation hint */}
            <div
              className="hidden sm:flex animate-fade-up items-center gap-2 mt-5"
              style={{ animationDelay: "0.5s" }}
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  lineHeight: 1.45,
                  color: "#C4B5FD",
                  letterSpacing: "0.02em",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  background: "rgba(7,8,12,0.78)",
                  border: "1px solid rgba(167,139,250,0.32)",
                  borderRadius: "999px",
                  padding: "0.45rem 0.75rem",
                  backdropFilter: "blur(10px)",
                }}
              >
                ↑ The background is a live gravity simulator &mdash; use the toolbar to create black holes &amp; launch satellites
              </span>
            </div>
          </div>

        </section>

        {/* Gradient fade from simulation to solid bg */}
        <div
          aria-hidden="true"
          style={{
            height: "120px",
            background:
              "linear-gradient(to bottom, transparent, rgba(7,8,12,0.92))",
            pointerEvents: "none",
            marginTop: "-120px",
            position: "relative",
            zIndex: 1,
          }}
        />

        {/* ─── Featured Projects ──────────────────────────────────────────── */}
        <section className="px-6 py-20" style={{ background: "rgba(7,8,12,0.96)" }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span
                  className="text-xs font-semibold uppercase tracking-widest block mb-3"
                  style={{ color: "#C8865A", fontFamily: "var(--font-display)" }}
                >
                  Projects
                </span>
                <h2 className="heading-lg" style={{ color: "#ECEDF2" }}>
                  Featured work
                </h2>
              </div>
              <Link
                href="/projects"
                className="hidden md:inline-flex items-center gap-2 text-sm font-medium"
                style={{ color: "#8A8F9C", fontFamily: "var(--font-display)" }}
              >
                All projects <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((project) => (
                <ProjectCard key={project.slug} project={project} variant="featured" />
              ))}
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ─── Build Log Preview ───────────────────────────────────────────── */}
        <section className="px-6 py-20" style={{ background: "rgba(7,8,12,0.96)" }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span
                  className="text-xs font-semibold uppercase tracking-widest block mb-3"
                  style={{ color: "#C8865A", fontFamily: "var(--font-display)" }}
                >
                  Lab Notes
                </span>
                <h2 className="heading-lg" style={{ color: "#ECEDF2" }}>
                  Build log
                </h2>
              </div>
              <Link
                href="/build-log"
                className="hidden md:inline-flex items-center gap-2 text-sm font-medium"
                style={{ color: "#8A8F9C", fontFamily: "var(--font-display)" }}
              >
                Full log <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-0">
              {recentLog.map((entry) => (
                <div
                  key={entry.id}
                  className="py-6 border-b"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs"
                        style={{ color: "#7A8090", fontFamily: "var(--font-mono)" }}
                      >
                        {entry.date}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          color: "#C8865A",
                          background: "rgba(200,134,90,0.08)",
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {entry.project}
                      </span>
                    </div>
                  </div>
                  <h3
                    className="text-sm font-semibold mb-2"
                    style={{ color: "#ECEDF2", fontFamily: "var(--font-display)" }}
                  >
                    {entry.title}
                  </h3>
                  <p className="text-sm" style={{ color: "#8A8F9C" }}>
                    {entry.what}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA strip ─────────────────────────────────────────────────── */}
        <section className="px-6 py-16" style={{ background: "rgba(7,8,12,0.98)" }}>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="heading-md mb-1" style={{ color: "#ECEDF2" }}>
                Building something interesting?
              </h2>
              <p className="text-sm" style={{ color: "#8A8F9C" }}>
                I&apos;d love to hear about your project — to learn more, give advice, or just talk through it. Reach out about anything, especially if it flies.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-semibold"
                style={{
                  fontFamily: "var(--font-display)",
                  background: "#C8865A",
                  color: "#07080C",
                }}
              >
                Get in touch
              </Link>
              <a
                href="https://www.linkedin.com/in/tiger-strake-8581582a1/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-semibold border"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "#8A8F9C",
                  borderColor: "rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <Linkedin size={14} />
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
