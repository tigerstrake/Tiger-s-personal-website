import type { Metadata } from "next";
import ProjectsExplorer from "./ProjectsExplorer";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Rocketry, UAV, fabrication, embedded systems, robotics, and software projects by Tiger Strake.",
  alternates: {
    canonical: "/projects",
  },
};

export default function Projects() {

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
        <div className="max-w-6xl mx-auto">
          <span
            className="text-xs font-semibold uppercase tracking-widest block mb-4"
            style={{ color: "#C8865A", fontFamily: "var(--font-display)" }}
          >
            Archive
          </span>
          <h1 className="heading-xl mb-4" style={{ color: "#ECEDF2" }}>
            Projects
          </h1>
          <p className="body-lg" style={{ maxWidth: "480px" }}>
            Hardware builds, fabrication programs, and embedded systems work.
            Sorted newest first.
          </p>
        </div>
      </section>

      <ProjectsExplorer />
    </div>
  );
}
