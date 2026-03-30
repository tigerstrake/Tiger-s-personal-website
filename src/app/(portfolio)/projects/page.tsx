"use client";

import { useState, useMemo } from "react";
import ProjectCard from "@/components/ProjectCard";
import { projects, type ProjectStatus, type ProjectCategory } from "@/data/projects";
import { Search } from "lucide-react";

const ALL_CATEGORIES: ProjectCategory[] = [
  "Aerospace",
  "Rockets",
  "UAVs",
  "Manufacturing",
  "Robotics",
  "Embedded",
  "Mechatronics",
  "Physics",
  "Fabrication",
];

const ALL_STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "early-stage", label: "Early Stage" },
  { value: "archived", label: "Archived" },
];

export default function Projects() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "All">("All");
  const [activeStatus, setActiveStatus] = useState<ProjectStatus | "All">("All");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        search.trim() === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" || p.categories.includes(activeCategory);

      const matchesStatus =
        activeStatus === "All" || p.status === activeStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      const STATUS_RANK: Record<string, number> = { active: 0, completed: 1, "early-stage": 2, archived: 3 };
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      const statusDiff = STATUS_RANK[a.status] - STATUS_RANK[b.status];
      if (statusDiff !== 0) return statusDiff;
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    });
  }, [search, activeCategory, activeStatus]);

  const filterBtnStyle = (active: boolean) => ({
    fontFamily: "var(--font-display)",
    fontSize: "0.75rem",
    fontWeight: 500,
    letterSpacing: "0.02em",
    padding: "4px 12px",
    borderRadius: "999px",
    border: active
      ? "1px solid rgba(200,134,90,0.35)"
      : "1px solid rgba(255,255,255,0.07)",
    background: active ? "rgba(200,134,90,0.10)" : "rgba(255,255,255,0.03)",
    color: active ? "#C8865A" : "#5A5F6E",
    cursor: "pointer",
    transition: "all 0.15s",
  } as React.CSSProperties);

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

      {/* Filters */}
      <section
        className="sticky top-16 px-6 py-4"
        style={{
          background: "rgba(7,8,12,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          zIndex: 10,
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "#4D5260" }}
            />
            <input
              type="text"
              placeholder="Search projects…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

          {/* Category filters */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <button
              onClick={() => setActiveCategory("All")}
              style={filterBtnStyle(activeCategory === "All")}
            >
              All
            </button>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? "All" : cat)}
                style={filterBtnStyle(activeCategory === cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status filters */}
          <div className="flex flex-wrap gap-1.5 items-center">
            {ALL_STATUSES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setActiveStatus(activeStatus === value ? "All" : value)}
                style={filterBtnStyle(activeStatus === value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}>
                No projects match those filters.
              </p>
            </div>
          ) : (
            <>
              <p
                className="text-xs mb-8"
                style={{ color: "#4D5260", fontFamily: "var(--font-mono)" }}
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
    </div>
  );
}
