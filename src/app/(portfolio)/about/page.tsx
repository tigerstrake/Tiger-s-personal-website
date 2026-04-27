import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, Github, Linkedin, Instagram } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "AeroAstro at Stanford. Building rockets, UAVs, fabrication-heavy hardware, and licensed to fly.",
};

const SOCIAL = [
  { label: "tiger29@stanford.edu", href: "mailto:tiger29@stanford.edu", icon: Mail },
  { label: "github.com/tigerstrake", href: "https://github.com/tigerstrake", icon: Github },
  { label: "linkedin", href: "https://www.linkedin.com/in/tiger-strake-8581582a1/", icon: Linkedin },
  { label: "instagram", href: "https://www.instagram.com/tiger.strake/", icon: Instagram },
];

export default function About() {
  return (
    <div style={{ background: "#07080C", minHeight: "100vh" }}>
      {/* Header */}
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
            About
          </span>
          <h1 className="heading-xl mb-4" style={{ color: "#ECEDF2" }}>
            Tiger Strake
          </h1>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#5A5F6E", letterSpacing: "-0.02em" }}>
            Stanford AeroAstro · Builder · Licensed Pilot
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Long-form bio */}
          <div className="lg:col-span-2 space-y-8">

            <div>
              <h2 className="heading-sm mb-4" style={{ color: "#ECEDF2" }}>What I&apos;m interested in</h2>
              <div className="space-y-4">
                <p className="body-lg">
                  Aerospace hardware is the main thing — propulsion, structural design with real weight budgets, embedded systems that have to work with the physics rather than around it. That&apos;s where most of my time goes.
                </p>
                <p className="body-lg">
                  I&apos;ve recently gotten into mountaineering, which I wasn&apos;t expecting to love as much as I do. There&apos;s something about committing to a route on incomplete information — deciding when to push and when to turn back — that maps surprisingly well to how I think about test programs and flight operations.
                </p>
                <p className="body-lg">
                  Outside of that: orbital mechanics, bouncing half-formed ideas off people, and cooking. Night owl by nature. Most productive when it&apos;s quiet and something&apos;s running on the bench.
                </p>
              </div>
            </div>

            <div>
              <h2 className="heading-sm mb-4" style={{ color: "#ECEDF2" }}>Flying</h2>
              <div className="space-y-4">
                <p className="body-lg">
                  I hold EASA and FAA Private Pilot Licences with single-engine
                  piston ratings and night qualification. Currently training for
                  multi-engine, high-performance, and helicopter endorsements.
                </p>
                <p className="body-lg">
                  The appeal isn&apos;t complicated. You can just go, whenever,
                  wherever. And the view from up there is hard to beat. More on this on the{" "}
                  <Link href="/flight" style={{ color: "#C8865A" }}>
                    flight page
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div>
              <h2 className="heading-sm mb-4" style={{ color: "#ECEDF2" }}>What I&apos;m looking for</h2>
              <div className="space-y-4">
                <p className="body-lg">
                  Aerospace and hardware internships where the work involves
                  real build and test, not slide preparation. Research tied to
                  actual systems with measurable results. Technical teams where
                  execution matters and people build things rather than describe
                  building things.
                </p>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Headshot */}
            <div
              className="w-full rounded-2xl overflow-hidden"
              style={{
                aspectRatio: "4/5",
                border: "1px solid rgba(255,255,255,0.07)",
                position: "relative",
              }}
            >
              <Image
                src="/images/about-me/tiger-portrait-headshot.jpg"
                alt="Tiger Strake"
                fill
                style={{ objectFit: "cover", objectPosition: "center top" }}
                priority
              />
              {/* Subtle fade on edges */}
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(7,8,12,0.15) 0%, transparent 25%, transparent 65%, rgba(7,8,12,0.55) 100%)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}>
                Contact
              </h3>
              <ul className="space-y-3">
                {SOCIAL.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 text-sm hover-accent transition-colors duration-200"
                      style={{ color: "#5A5F6E" }}
                    >
                      <Icon size={13} />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick facts */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}>
                Details
              </h3>
              <dl className="space-y-3">
                {[
                  ["University", "Stanford"],
                  ["Department", "AeroAstro"],
                  ["Certifications", "EASA PPL, FAA PPL"],
                  ["Ratings", "SEP(L), Night"],
                  ["Based", "Stanford, CA"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs mb-0.5" style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}>{k}</dt>
                    <dd className="text-sm" style={{ color: "#8A8F9C" }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* CTA links */}
            <div className="space-y-2">
              <Link
                href="/projects"
                className="flex items-center justify-between px-4 py-3 rounded card card-hover text-sm font-medium hover-accent transition-colors duration-200"
                style={{ color: "#ECEDF2", fontFamily: "var(--font-display)" }}
              >
                View projects <ArrowRight size={14} />
              </Link>
              <Link
                href="/build-log"
                className="flex items-center justify-between px-4 py-3 rounded card card-hover text-sm font-medium hover-accent transition-colors duration-200"
                style={{ color: "#8A8F9C", fontFamily: "var(--font-display)" }}
              >
                Build log <ArrowRight size={14} />
              </Link>
              <a
                href="/docs/tiger-strake-cv.pdf"
                download
                className="flex items-center justify-between px-4 py-3 rounded card card-hover text-sm font-medium hover-accent transition-colors duration-200"
                style={{ color: "#8A8F9C", fontFamily: "var(--font-display)" }}
              >
                Download CV <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
