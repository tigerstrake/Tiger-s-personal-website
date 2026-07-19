"use client";

import { useMemo, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { projects, type ProjectCategory, type ProjectStatus } from "@/data/projects";
import { Search } from "lucide-react";

const ALL_CATEGORIES = Array.from(
  new Set(projects.flatMap((project) => project.categories)),
).sort((a, b) => a.localeCompare(b)) as ProjectCategory[];

const ALL_STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "early-stage", label: "Early Stage" },
  { value: "archived", label: "Archived" },
];

export default function ProjectsExplorer() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "All">("All");
  const [activeStatus, setActiveStatus] = useState<ProjectStatus | "All">("All");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects
      .filter((project) => {
        const matchesSearch =
          query === "" ||
          [
            project.title,
            project.subtitle,
            project.description,
            project.role,
            project.timeline,
            project.challenge,
            ...project.categories,
            ...project.tools,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query);

        const matchesCategory =
          activeCategory === "All" || project.categories.includes(activeCategory);

        const matchesStatus =
          activeStatus === "All" || project.status === activeStatus;

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        const statusRank: Record<ProjectStatus, number> = {
          active: 0,
          completed: 1,
          "early-stage": 2,
          archived: 3,
        };
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        const statusDiff = statusRank[a.status] - statusRank[b.status];
        if (statusDiff !== 0) return statusDiff;
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      });
  }, [search, activeCategory, activeStatus]);

  const filterBtnStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "var(--font-display)",
    fontSize: "0.75rem",
    fontWeight: 500,
    letterSpacing: "0.02em",
    minHeight: "32px",
    padding: "6px 12px",
    borderRadius: "999px",
    border: active
      ? "1px solid rgba(200,134,90,0.35)"
      : "1px solid rgba(255,255,255,0.07)",
    background: active ? "rgba(200,134,90,0.10)" : "rgba(255,255,255,0.03)",
    color: active ? "#C8865A" : "#8A8F9C",
    cursor: "pointer",
    transition: "all 0.15s",
  });

  return (
    <>
      <section
        className="sm:sticky sm:top-16 px-6 py-4"
        style={{
          background: "rgba(7,8,12,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          zIndex: 10,
        }}
      >
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="relative w-full sm:max-w-md">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "#7B8293" }}
              aria-hidden="true"
            />
            <input
              type="search"
              aria-label="Search projects"
              placeholder="Search projects..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded outline-none"
              style={{
                fontFamily: "var(--font-body)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#ECEDF2",
                caretColor: "#C8865A",
              }}
            />
          </div>

          <div>
            <span
              className="text-xs font-semibold uppercase tracking-widest block mb-2"
              style={{ color: "#9EA6BA", fontFamily: "var(--font-display)" }}
            >
              Topic
            </span>
            <div className="flex flex-wrap gap-1.5 items-center">
              <button
                type="button"
                onClick={() => setActiveCategory("All")}
                style={filterBtnStyle(activeCategory === "All")}
                aria-pressed={activeCategory === "All"}
              >
                All topics
              </button>
              {ALL_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setActiveCategory(activeCategory === category ? "All" : category)
                  }
                  style={filterBtnStyle(activeCategory === category)}
                  aria-pressed={activeCategory === category}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div
            className="pt-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.10)" }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-widest block mb-2"
              style={{ color: "#9EA6BA", fontFamily: "var(--font-display)" }}
            >
              Project status
            </span>
            <div className="flex flex-wrap gap-1.5 items-center">
              <button
                type="button"
                onClick={() => setActiveStatus("All")}
                style={filterBtnStyle(activeStatus === "All")}
                aria-pressed={activeStatus === "All"}
              >
                All statuses
              </button>
              {ALL_STATUSES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setActiveStatus(activeStatus === value ? "All" : value)}
                  style={filterBtnStyle(activeStatus === value)}
                  aria-pressed={activeStatus === value}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p style={{ color: "#7B8293", fontFamily: "var(--font-display)" }}>
                No projects match those filters.
              </p>
            </div>
          ) : (
            <>
              <p
                className="text-xs mb-8"
                style={{ color: "#7B8293", fontFamily: "var(--font-mono)" }}
                aria-live="polite"
              >
                {filtered.length} project{filtered.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
