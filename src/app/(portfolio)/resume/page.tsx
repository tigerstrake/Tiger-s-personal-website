import type { Metadata } from "next";
import { Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Resume",
  description: "Tiger Strake CV and resume download.",
};

const HIGHLIGHTS = [
  "Stanford AeroAstro with a focus on aerospace hardware and build programs",
  "L1 certified, L2 in progress. SkyRunners UAV manufacturing and structures lead",
  "Embedded systems across ESP32, IMU integration, servo control, and telemetry",
  "Fabrication: composites, CNC milling, casting, laser cutting, 3D printing (FDM/resin)",
  "Pilot: EASA + FAA PPL SEP(L) with night ops, currently training MEP and high-performance",
  "Harvard Digital Fabrication coursework: 11-week intensive across the full fabrication stack",
];

export default function Resume() {
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
            CV
          </span>
          <h1 className="heading-xl mb-4" style={{ color: "#ECEDF2" }}>
            Resume
          </h1>
          <p className="body-lg">
            Available as a PDF download. Updated regularly.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Download + highlights */}
          <div className="lg:col-span-2 space-y-10">

            {/* Download buttons */}
            <div className="flex flex-wrap gap-3">
              <a
                href="/docs/tiger-strake-cv.pdf"
                download
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded text-sm font-semibold hover-accent-bg"
                style={{
                  fontFamily: "var(--font-display)",
                  background: "#C8865A",
                  color: "#07080C",
                }}
              >
                <Download size={15} />
                Download PDF
              </a>
            </div>

            {/* PDF embed */}
            <iframe
              src="/docs/tiger-strake-cv.pdf"
              className="w-full rounded-xl"
              style={{
                aspectRatio: "8.5/11",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "#0A0B10",
              }}
              title="Tiger Strake CV"
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div>
              <h3
                className="text-xs font-semibold uppercase tracking-widest mb-5"
                style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
              >
                Highlights
              </h3>
              <ul className="space-y-4">
                {HIGHLIGHTS.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="mt-2 w-1 h-1 rounded-full shrink-0"
                      style={{ background: "#C8865A" }}
                    />
                    <p className="text-sm leading-relaxed" style={{ color: "#8A8F9C" }}>
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="p-4 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p className="text-xs leading-relaxed" style={{ color: "#4D5260" }}>
                Reach out at{" "}
                <a
                  href="mailto:tiger29@stanford.edu"
                  style={{ color: "#C8865A" }}
                >
                  tiger29@stanford.edu
                </a>{" "}
                for internship or research inquiries. I respond to
                aerospace/hardware roles and anything involving real build work.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
