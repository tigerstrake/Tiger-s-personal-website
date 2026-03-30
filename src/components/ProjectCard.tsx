import Link from "next/link";
import type { Project } from "@/data/projects";

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

interface ProjectCardProps {
  project: Project;
  variant?: "default" | "compact" | "featured";
}

function Thumbnail({ src, title, height = 180 }: { src?: string; title: string; height?: number }) {
  const hasImage = src && !src.includes("placeholder");
  return (
    <div
      className="w-full overflow-hidden"
      style={{
        height,
        borderRadius: "6px 6px 0 0",
        background: "#0D0F17",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
      }}
    >
      {hasImage ? (
        <img
          src={src}
          alt={title}
          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0D0F17 0%, #14161F 60%, #1B1D28 100%)",
          }}
        >
          <span style={{ color: "#2A2D3A", fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>
            {title}
          </span>
        </div>
      )}
    </div>
  );
}

export default function ProjectCard({
  project,
  variant = "default",
}: ProjectCardProps) {
  const { slug, title, subtitle, description, status, categories, role, lastUpdated, coverImage } =
    project;

  const date = new Date(lastUpdated).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  if (variant === "featured") {
    return (
      <Link href={`/projects/${slug}`} className="block group">
        <article
          className="card card-hover relative overflow-hidden h-full flex flex-col"
          style={{ minHeight: "320px" }}
        >
          {/* Thumbnail */}
          <Thumbnail src={coverImage} title={title} height={190} />

          <div className="p-7 flex flex-col flex-1">
            {/* Accent edge */}
            <div
              className="absolute top-0 left-0 w-px"
              style={{
                height: "190px",
                background:
                  "linear-gradient(to bottom, transparent, rgba(200,134,90,0.4) 40%, rgba(200,134,90,0.4) 60%, transparent)",
              }}
            />

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <span className={`tag ${STATUS_CLASSES[status]}`}>
                {STATUS_LABELS[status]}
              </span>
              <span
                className="text-xs"
                style={{ color: "#4D5260", fontFamily: "var(--font-mono)" }}
              >
                {date}
              </span>
            </div>

            {/* Category chips */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {categories.map((cat) => (
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

            {/* Title */}
            <h3
              className="heading-md mb-2 group-hover:text-[#C8865A] transition-colors duration-200"
              style={{ color: "#ECEDF2" }}
            >
              {title}
            </h3>
            <p className="text-sm mb-4" style={{ color: "#5A5F6E" }}>
              {subtitle}
            </p>

            {/* Description */}
            <p
              className="text-sm leading-relaxed flex-1"
              style={{ color: "#8A8F9C" }}
            >
              {description.slice(0, 200)}
              {description.length > 200 ? "…" : ""}
            </p>

            {/* Footer */}
            <div
              className="flex items-center justify-between mt-6 pt-4 border-t"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              <span className="text-xs" style={{ color: "#4D5260" }}>
                {role}
              </span>
              <span
                className="text-xs font-medium group-hover:text-[#C8865A] transition-colors duration-200"
                style={{ color: "#5A5F6E", fontFamily: "var(--font-display)" }}
              >
                View project →
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/projects/${slug}`} className="block group">
        <article
          className="flex items-start gap-4 py-4 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <span className={`tag ${STATUS_CLASSES[status]} shrink-0 mt-0.5`}>
            {STATUS_LABELS[status]}
          </span>
          <div className="flex-1 min-w-0">
            <h3
              className="text-sm font-semibold group-hover:text-[#C8865A] transition-colors duration-200 truncate"
              style={{ color: "#ECEDF2", fontFamily: "var(--font-display)" }}
            >
              {title}
            </h3>
            <p className="text-xs mt-0.5 truncate" style={{ color: "#5A5F6E" }}>
              {subtitle}
            </p>
          </div>
          <span
            className="text-xs shrink-0"
            style={{ color: "#4D5260", fontFamily: "var(--font-mono)" }}
          >
            {date}
          </span>
        </article>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/projects/${slug}`} className="block group">
      <article className="card card-hover overflow-hidden h-full flex flex-col">
        {/* Thumbnail */}
        <Thumbnail src={coverImage} title={title} height={160} />

        <div className="p-6 flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <span className={`tag ${STATUS_CLASSES[status]}`}>
              {STATUS_LABELS[status]}
            </span>
            <span
              className="text-xs shrink-0"
              style={{ color: "#4D5260", fontFamily: "var(--font-mono)" }}
            >
              {date}
            </span>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {categories.map((cat) => (
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

          <h3
            className="heading-sm mb-1.5 group-hover:text-[#C8865A] transition-colors duration-200"
            style={{ color: "#ECEDF2" }}
          >
            {title}
          </h3>
          <p className="text-xs mb-3" style={{ color: "#5A5F6E" }}>
            {subtitle}
          </p>
          <p
            className="text-sm leading-relaxed flex-1"
            style={{ color: "#8A8F9C" }}
          >
            {description.slice(0, 140)}
            {description.length > 140 ? "…" : ""}
          </p>

          <div
            className="flex items-center justify-between mt-4 pt-3 border-t"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <span className="text-xs" style={{ color: "#4D5260" }}>
              {role}
            </span>
            <span
              className="text-xs font-medium group-hover:text-[#C8865A] transition-colors duration-200"
              style={{ color: "#5A5F6E", fontFamily: "var(--font-display)" }}
            >
              →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
