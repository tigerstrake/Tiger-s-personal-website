import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/data/projects";
import { buildLog } from "@/data/buildLog";
import { ArrowLeft, ExternalLink } from "lucide-react";
import BrowserEmbed from "@/components/BrowserEmbed";

// Static export: pre-render all project pages
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.description.slice(0, 160),
  };
}

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  completed: "Completed",
  "early-stage": "Early Stage",
  archived: "Archived",
};

const STATUS_CLASSES: Record<string, string> = {
  active: "tag-active",
  completed: "tag-completed",
  "early-stage": "tag-early",
  archived: "tag-archived",
};

function SectionLabel({ label }: { label: string }) {
  return (
    <span
      className="text-xs font-semibold uppercase tracking-widest block mb-3"
      style={{ color: "#C8865A", fontFamily: "var(--font-display)" }}
    >
      {label}
    </span>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span
            className="mt-2 w-1 h-1 rounded-full shrink-0"
            style={{ background: "rgba(200,134,90,0.5)" }}
          />
          <span className="text-sm leading-relaxed" style={{ color: "#8A8F9C" }}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const relatedProjects = projects.filter(
    (p) => project.relatedSlugs.includes(p.slug) && p.slug !== project.slug
  );

  const projectLog = buildLog.filter((e) => e.projectSlug === project.slug);

  const date = new Date(project.lastUpdated).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div style={{ background: "#07080C", minHeight: "100vh" }}>
      {/* Back link */}
      <div className="px-6 pt-24 pb-0">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm"
            style={{ color: "#5A5F6E", fontFamily: "var(--font-display)" }}
          >
            <ArrowLeft size={14} /> All projects
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section
        className="px-6 pt-8 pb-16"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "linear-gradient(to bottom, #07080C, #0D0F17)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`tag ${STATUS_CLASSES[project.status]}`}>
              {STATUS_LABELS[project.status]}
            </span>
            {project.categories.map((cat) => (
              <span
                key={cat}
                className="text-xs px-2 py-0.5 rounded"
                style={{
                  color: "#4D5260",
                  background: "rgba(255,255,255,0.04)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {cat}
              </span>
            ))}
          </div>

          <h1 className="heading-xl mb-3" style={{ color: "#ECEDF2" }}>
            {project.title}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.1rem",
              color: "#5A5F6E",
              marginBottom: "2rem",
            }}
          >
            {project.subtitle}
          </p>

          {/* Highlights row */}
          <div className="flex flex-wrap gap-6">
            <div>
              <span
                className="text-xs block mb-1"
                style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
              >
                Role
              </span>
              <span className="text-sm" style={{ color: "#8A8F9C" }}>
                {project.role}
              </span>
            </div>
            <div>
              <span
                className="text-xs block mb-1"
                style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
              >
                Timeline
              </span>
              <span className="text-sm" style={{ color: "#8A8F9C" }}>
                {project.timeline}
              </span>
            </div>
            <div>
              <span
                className="text-xs block mb-1"
                style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
              >
                Updated
              </span>
              <span
                className="text-sm"
                style={{ color: "#8A8F9C", fontFamily: "var(--font-mono)" }}
              >
                {date}
              </span>
            </div>
            {project.highlights.map((h) => (
              <div key={h.label}>
                <span
                  className="text-xs block mb-1"
                  style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
                >
                  {h.label}
                </span>
                <span className="text-sm" style={{ color: "#8A8F9C" }}>
                  {h.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cover media */}
      {!project.embed && (
      <div className="px-6">
        <div className="max-w-4xl mx-auto my-10 space-y-4">
          {project.coverImage && !project.coverImage.includes("placeholder") ? (
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full rounded-xl"
              style={{ border: "1px solid rgba(255,255,255,0.07)", maxHeight: "600px", objectFit: "contain", background: "#0A0B10" }}
            />
          ) : (
            <div
              className="w-full rounded-xl"
              style={{
                aspectRatio: "16/7",
                background: "linear-gradient(135deg, #0D0F17 0%, #14161F 50%, #1B1D28 100%)",
                border: "1px solid rgba(255,255,255,0.07)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="text-xs" style={{ color: "#4D5260", fontFamily: "var(--font-mono)" }}>
                {project.title} · images coming
              </span>
            </div>
          )}

          {/* Additional images */}
          {project.images && project.images.length > 0 && (
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {project.images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${project.title} ${i + 2}`}
                  className="w-full rounded-lg"
                  style={{ border: "1px solid rgba(255,255,255,0.07)", display: "block" }}
                />
              ))}
            </div>
          )}

          {/* Videos */}
          {project.videos && project.videos.length > 0 && (
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
              {project.videos.map((src, i) => (
                <video
                  key={i}
                  src={src}
                  controls
                  playsInline
                  className="w-full rounded-xl"
                  style={{ border: "1px solid rgba(255,255,255,0.07)", background: "#0A0B10" }}
                />
              ))}
            </div>
          )}

          {/* Docs */}
          {project.docs && project.docs.length > 0 && (
            <div className="space-y-6">
              {project.docs.map((doc) => (
                <div key={doc.url}>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "#C8865A", fontFamily: "var(--font-display)" }}
                    >
                      {doc.label}
                    </span>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
                    >
                      <ExternalLink size={11} /> Open
                    </a>
                  </div>
                  <iframe
                    src={doc.url}
                    className="w-full rounded-lg"
                    style={{
                      height: "600px",
                      border: "1px solid rgba(255,255,255,0.07)",
                      background: "#0A0B10",
                    }}
                    title={doc.label}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      )}

      {/* Body */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">

            {/* Description */}
            <div>
              <SectionLabel label="Overview" />
              <p className="body-lg leading-relaxed">{project.description}</p>
            </div>

            {/* Embedded site */}
            {project.embed && project.url && (
              <div>
                <BrowserEmbed url={project.url} height={640} />
              </div>
            )}

            <hr className="section-divider" />

            {/* Challenge */}
            <div>
              <SectionLabel label="The problem" />
              <p className="body-lg">{project.challenge}</p>
            </div>

            {/* Constraints */}
            {project.constraints.length > 0 && (
              <div>
                <SectionLabel label="Constraints" />
                <BulletList items={project.constraints} />
              </div>
            )}

            {/* Design decisions */}
            {project.designDecisions.length > 0 && (
              <div>
                <SectionLabel label="Design decisions" />
                <BulletList items={project.designDecisions} />
              </div>
            )}

            {/* Build process */}
            {project.buildProcess.length > 0 && (
              <div>
                <SectionLabel label="Build process" />
                <ol className="space-y-3">
                  {project.buildProcess.map((step, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span
                        className="shrink-0 text-xs pt-1"
                        style={{
                          color: "#4D5260",
                          fontFamily: "var(--font-mono)",
                          minWidth: "1.5rem",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm leading-relaxed" style={{ color: "#8A8F9C" }}>
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <hr className="section-divider" />

            {/* Result */}
            <div>
              <SectionLabel label="Result" />
              <div
                className="p-5 rounded-lg"
                style={{
                  background: "rgba(200,134,90,0.06)",
                  border: "1px solid rgba(200,134,90,0.18)",
                }}
              >
                <p className="text-sm leading-relaxed" style={{ color: "#DFA070" }}>
                  {project.results}
                </p>
              </div>
            </div>

            {/* Lessons */}
            {project.lessons.length > 0 && (
              <div>
                <SectionLabel label="What went wrong / what I learned" />
                <BulletList items={project.lessons} />
              </div>
            )}

            {/* Build log entries */}
            {projectLog.length > 0 && (
              <div>
                <hr className="section-divider" />
                <div className="flex items-center justify-between mb-4">
                  <SectionLabel label="Build log" />
                  <Link
                    href="/build-log"
                    className="text-xs"
                    style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
                  >
                    Full log →
                  </Link>
                </div>
                <div
                  className="space-y-0 overflow-y-auto rounded-lg"
                  style={{
                    maxHeight: "420px",
                    border: "1px solid rgba(255,255,255,0.07)",
                    background: "#0A0B10",
                  }}
                >
                  {projectLog.map((entry, i) => (
                    <div
                      key={entry.id}
                      className="px-5 py-5"
                      style={{
                        borderBottom:
                          i < projectLog.length - 1
                            ? "1px solid rgba(255,255,255,0.05)"
                            : "none",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="text-xs"
                          style={{ color: "#4D5260", fontFamily: "var(--font-mono)" }}
                        >
                          {entry.date}
                        </span>
                      </div>
                      <p
                        className="text-sm font-medium mb-3"
                        style={{ color: "#ECEDF2", fontFamily: "var(--font-display)" }}
                      >
                        {entry.title}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span
                            className="text-xs uppercase tracking-widest block mb-1"
                            style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
                          >
                            What
                          </span>
                          <p className="text-xs leading-relaxed" style={{ color: "#6A6F7E" }}>
                            {entry.what}
                          </p>
                        </div>
                        <div>
                          <span
                            className="text-xs uppercase tracking-widest block mb-1"
                            style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
                          >
                            Result
                          </span>
                          <p className="text-xs leading-relaxed" style={{ color: "#DFA070" }}>
                            {entry.result}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Tools */}
            <div>
              <h3
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
              >
                Tools & Methods
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.tools.map((tool) => (
                  <span
                    key={tool}
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      color: "#5A5F6E",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Highlights */}
            {project.highlights.length > 0 && (
              <div>
                <h3
                  className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
                >
                  Specs
                </h3>
                <dl className="space-y-3">
                  {project.highlights.map((h) => (
                    <div key={h.label}>
                      <dt
                        className="text-xs mb-0.5"
                        style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
                      >
                        {h.label}
                      </dt>
                      <dd className="text-sm" style={{ color: "#8A8F9C" }}>
                        {h.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Related projects */}
            {relatedProjects.length > 0 && (
              <div>
                <h3
                  className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
                >
                  Related
                </h3>
                <div className="space-y-2">
                  {relatedProjects.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/projects/${rel.slug}`}
                      className="flex items-center justify-between px-3 py-2.5 rounded card card-hover text-sm"
                      style={{ color: "#8A8F9C", fontFamily: "var(--font-display)" }}
                    >
                      {rel.title}
                      <ExternalLink size={12} style={{ color: "#4D5260" }} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* External link */}
            {project.url && (
              <div>
                <h3
                  className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
                >
                  External link
                </h3>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2.5 rounded card card-hover text-sm"
                  style={{ color: "#C8865A", fontFamily: "var(--font-display)" }}
                >
                  View site
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
