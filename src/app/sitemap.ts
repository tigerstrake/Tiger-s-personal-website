import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

export const dynamic = "force-static";

const baseUrl = "https://tigerstrake.com";

const staticRoutes = [
  "",
  "/about",
  "/projects",
  "/build-log",
  "/flight",
  "/writing",
  "/contact",
  "/resume",
  "/simulation",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: route === "" ? "monthly" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.lastUpdated),
    changeFrequency: "monthly",
    priority: project.featured ? 0.8 : 0.6,
  }));

  return [...staticEntries, ...projectEntries];
}
