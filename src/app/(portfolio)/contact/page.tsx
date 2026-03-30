import type { Metadata } from "next";
import { Mail, Github, Linkedin, Instagram } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach out about internships, project work, research, or technical collaboration.",
};

const CONTACT_METHODS = [
  {
    icon: Mail,
    label: "Email",
    value: "tiger29@stanford.edu",
    href: "mailto:tiger29@stanford.edu",
    description: "Preferred for internships, research, and serious inquiries.",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/tigerstrake",
    href: "https://github.com/tigerstrake",
    description: "Code and project repositories.",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/tiger-strake-8581582a1",
    href: "https://www.linkedin.com/in/tiger-strake-8581582a1/",
    description: "Professional background and connections.",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@tiger.strake",
    href: "https://www.instagram.com/tiger.strake/",
    description: "Occasionally posts build photos.",
  },
];

const FOCUS_AREAS = [
  {
    title: "Internships",
    description:
      "Aerospace, propulsion, UAV systems, and hardware engineering roles. Interested in teams that value execution.",
  },
  {
    title: "Project collaboration",
    description:
      "Technical work where design, build, and test all matter. Not interested in slide decks.",
  },
  {
    title: "Research",
    description:
      "Applied work tied to real systems. Preference for aerospace, propulsion, and structures.",
  },
  {
    title: "Technical conversations",
    description:
      "Building something hard and want to compare approaches? Email works.",
  },
];

export default function Contact() {
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
            Get in touch
          </span>
          <h1 className="heading-xl mb-4" style={{ color: "#ECEDF2" }}>
            Contact
          </h1>
          <p className="body-lg" style={{ maxWidth: "480px" }}>
            Reach out about internships, project work, research, or something
            interesting you think I should be building.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Contact methods */}
          <div>
            <h2
              className="text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
            >
              Reach me at
            </h2>
            <div className="space-y-3">
              {CONTACT_METHODS.map(({ icon: Icon, label, value, href, description }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="card card-hover flex items-start gap-4 p-5 block"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "rgba(200,134,90,0.08)" }}
                  >
                    <Icon size={16} style={{ color: "#C8865A" }} />
                  </div>
                  <div className="min-w-0">
                    <span
                      className="text-xs block mb-0.5"
                      style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
                    >
                      {label}
                    </span>
                    <span
                      className="text-sm font-medium block mb-1 truncate"
                      style={{ color: "#ECEDF2" }}
                    >
                      {value}
                    </span>
                    <span className="text-xs" style={{ color: "#5A5F6E" }}>
                      {description}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* What I'm open to */}
          <div>
            <h2
              className="text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
            >
              What I&apos;m open to
            </h2>
            <div className="space-y-3">
              {FOCUS_AREAS.map(({ title, description }) => (
                <div
                  key={title}
                  className="p-5 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <h3
                    className="text-sm font-semibold mb-1.5"
                    style={{ color: "#ECEDF2", fontFamily: "var(--font-display)" }}
                  >
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#5A5F6E" }}>
                    {description}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="mt-8 p-5 rounded-xl"
              style={{
                background: "rgba(200,134,90,0.05)",
                border: "1px solid rgba(200,134,90,0.15)",
              }}
            >
              <p className="text-sm leading-relaxed" style={{ color: "#8A8F9C" }}>
                I&apos;ll respond pretty quickly. In-person meetings are a bit
                harder to schedule. I&apos;m a Stanford student, so timing
                around quarters matters. Anything aerospace or hardware-related
                I try to get back to within a few days. For everything else, it
                depends on where I am in a build cycle.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
