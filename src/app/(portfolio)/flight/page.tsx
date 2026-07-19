import type { Metadata } from "next";
import Image from "next/image";
import FlyingCarousel, { type MediaItem } from "@/components/FlyingCarousel";

export const metadata: Metadata = {
  title: "Flight",
  description:
    "EASA PPL(A) and FAA Private Pilot. Training toward multiengine-airplane and rotorcraft-helicopter ratings plus high-performance, tailwheel, and complex endorsements.",
  alternates: {
    canonical: "/flight",
  },
};

const QUALIFICATIONS = [
  {
    body: "EASA",
    rating: "PPL(A)",
    class: "SEP(L)",
    endorsements: ["Night qualification"],
    status: "Current",
  },
  {
    body: "FAA",
    rating: "Private Pilot",
    class: "ASEL",
    endorsements: ["Night operations"],
    status: "Current",
  },
];

const IN_TRAINING = [
  {
    label: "MEP",
    description: "Airplane multiengine class rating — DA62 and Twin Comanche.",
    status: "In progress",
  },
  {
    label: "Rotorcraft — Helicopter",
    description: "Rotorcraft-helicopter category and class rating at Specialized Helicopters at KRHV.",
    status: "In progress",
  },
  {
    label: "High Performance",
    description: "FAA logbook endorsement for airplanes with an engine over 200 horsepower.",
    status: "In progress",
  },
  {
    label: "Tailwheel",
    description: "FAA logbook endorsement for conventional-gear airplanes.",
    status: "In progress",
  },
  {
    label: "Complex",
    description: "FAA logbook endorsement for airplanes with retractable gear, flaps, and a controllable-pitch propeller.",
    status: "In progress",
  },
];

const SINGLE_ENGINE: MediaItem[] = [
  { type: "image", src: "/images/flying/single-engine/pa28-cockpit.jpeg",         caption: "PA-28 Warrior cockpit — Dortmund Airport, Germany" },
  { type: "image", src: "/images/flying/single-engine/pa28-in-cruise.jpeg",       caption: "PA-28 Warrior in cruise — over Menden, Germany" },
  { type: "video", src: "/images/flying/single-engine/sf-from-above.mp4",         caption: "San Francisco from above" },
  { type: "video", src: "/images/flying/single-engine/short-final-palo-alto.mp4", caption: "Short final into Palo Alto" },
  { type: "video", src: "/images/flying/single-engine/expedited-approach.mp4",    caption: "Expedited approach — traffic conflict near Dortmund Airport, Germany" },
  { type: "video", src: "/images/flying/single-engine/night-flight-timelapse.mp4", caption: "Night flight timelapse — over the Ruhr area, Germany" },
  { type: "image", src: "/images/flying/single-engine/track-log-kavx-3o8.png",    caption: "Track log: Catalina (KAVX) → Harris Ranch (3O8)" },
  { type: "image", src: "/images/flying/single-engine/track-log-3o8-kpao.png",    caption: "Track log: Harris Ranch (3O8) → Palo Alto (KPAO)" },
  { type: "video", src: "/images/flying/single-engine/harris-ranch-patterns.mp4",  caption: "Pattern work at Harris Ranch" },
  { type: "video", src: "/images/flying/single-engine/ifr-departure-kavx.mp4",    caption: "IFR departure out of Catalina (KAVX)" },
];

const MULTI_ENGINE: MediaItem[] = [
  { type: "image", src: "/images/flying/multi-engine/twin-comanche-sunset.jpg",  caption: "Twin Comanche at sunset — Reid–Hillview Airport, San José" },
  { type: "video", src: "/images/flying/multi-engine/takeoff-san-jose.mp4",      caption: "Takeoff from San Jose" },
  { type: "video", src: "/images/flying/multi-engine/steep-turns.mp4",           caption: "Steep turns — over San José" },
  { type: "video", src: "/images/flying/multi-engine/base-final-hollister.mp4",  caption: "Base and final into Hollister" },
];

const HELICOPTER: MediaItem[] = [
  { type: "image", src: "/images/flying/helicopter/parents-sf-flight.jpg",           caption: "Taking my parents on a flight around San Francisco" },
  { type: "video", src: "/images/flying/helicopter/detour-chicago.mp4",              caption: "Detour in Chicago" },
  { type: "video", src: "/images/flying/helicopter/final-hayward.mp4",               caption: "Final approach into Hayward" },
  { type: "video", src: "/images/flying/helicopter/short-base-final-hayward.mp4",    caption: "Shortened base and final into Hayward" },
  { type: "video", src: "/images/flying/helicopter/windy-departure-hayward.mp4",     caption: "Windy departure from Hayward" },
  { type: "video", src: "https://pub-1689e9161f494bbc873145913e873cd2.r2.dev/Setdown%20on%20Pad.mp4",  caption: "Setting down on pad — Hayward Executive Airport" },
  { type: "video", src: "https://pub-1689e9161f494bbc873145913e873cd2.r2.dev/sf-roundtrip.mp4", caption: "SF roundtrip — around San Francisco Bay" },
];

export default function Flight() {
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
            Aviation
          </span>
          <h1 className="heading-xl mb-4" style={{ color: "#ECEDF2" }}>
            Flight
          </h1>
          <p className="body-lg" style={{ maxWidth: "520px" }}>
            EASA PPL(A) and FAA Private Pilot. Additional ratings and
            endorsements in progress.
          </p>
        </div>
      </section>

      {/* Content + sidebar */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Main text */}
          <div className="lg:col-span-2 space-y-10">

            <div>
              <span
                className="text-xs font-semibold uppercase tracking-widest block mb-4"
                style={{ color: "#C8865A", fontFamily: "var(--font-display)" }}
              >
                Background
              </span>
              <div className="space-y-5">
                <p className="body-lg">
                  My grandmother once half-jokingly asked whether I wanted to get
                  a glider license. That turned into a Private Pilot License in
                  Germany, first solo hours over the Rhine Valley, and a lot of
                  paperwork when I moved to the US and converted the license.
                </p>
                <p className="body-lg">
                  At Stanford I&apos;m getting checked out at local flying clubs and
                  keeping my hours up, mostly flying G1000 Cessna 172SPs with modern
                  avionics. Alongside that I&apos;m building toward my multi-engine
                  rating on a DA62 and Twin Comanche, and getting my helicopter rating
                  at Specialized Helicopters.
                </p>
                <p className="body-lg">
                  The first 100 hours across fixed-wing and rotary, Europe and the
                  US, steam gauges and glass cockpit were some of the most fun
                  I&apos;ve ever had learning a new skill. For me as an AeroAstro
                  major, it&apos;s always cool to see how the concepts we learn in
                  class apply to the actual aircraft&apos;s behavior.
                </p>
              </div>
            </div>

            <hr className="section-divider" />

            {/* Working toward */}
            <div>
              <span
                className="text-xs font-semibold uppercase tracking-widest block mb-6"
                style={{ color: "#C8865A", fontFamily: "var(--font-display)" }}
              >
                Working toward
              </span>
              <div className="space-y-4">
                {IN_TRAINING.map((item) => (
                  <div
                    key={item.label}
                    className="card p-5 flex items-start gap-4"
                  >
                    <span
                      className="w-2 h-2 mt-1.5 rounded-full shrink-0"
                      style={{
                        background: "#C8865A",
                        boxShadow: "0 0 6px rgba(200,134,90,0.5)",
                      }}
                    />
                    <div>
                      <h3
                        className="text-sm font-semibold mb-1"
                        style={{
                          color: "#ECEDF2",
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {item.label}
                        <span
                          className="ml-3 text-xs font-normal"
                          style={{ color: "#7B8293" }}
                        >
                          {item.status}
                        </span>
                      </h3>
                      <p className="text-sm" style={{ color: "#8A8F9C" }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div>
            <div
              className="relative w-full rounded-xl mb-6 overflow-hidden"
              style={{
                aspectRatio: "4/3",
                border: "1px solid rgba(255,255,255,0.07)",
                background: "#0A0B10",
              }}
            >
              <Image
                src="/images/flying/ABF48F2A-9189-4E2C-83A3-C55A770548A1_1_105_c.jpeg"
                alt="Tiger flying in a single-engine aircraft"
                fill
                sizes="(min-width: 1024px) 280px, calc(100vw - 48px)"
                style={{ objectFit: "cover" }}
              />
            </div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: "#7B8293", fontFamily: "var(--font-display)" }}
            >
              Licenses held
            </h3>
            <div className="space-y-4">
              {QUALIFICATIONS.map((q) => (
                <div key={q.body} className="card p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#ECEDF2", fontFamily: "var(--font-display)" }}
                    >
                      {q.body}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        color: "#7ECFA0",
                        background: "rgba(100,200,140,0.08)",
                        border: "1px solid rgba(100,200,140,0.2)",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {q.status}
                    </span>
                  </div>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-xs mb-0.5" style={{ color: "#7B8293", fontFamily: "var(--font-display)" }}>Rating</dt>
                      <dd className="text-sm" style={{ color: "#8A8F9C" }}>{q.rating}</dd>
                    </div>
                    <div>
                      <dt className="text-xs mb-0.5" style={{ color: "#7B8293", fontFamily: "var(--font-display)" }}>Class</dt>
                      <dd className="text-sm" style={{ color: "#8A8F9C" }}>{q.class}</dd>
                    </div>
                    {q.endorsements.length > 0 && (
                      <div>
                        <dt className="text-xs mb-0.5" style={{ color: "#7B8293", fontFamily: "var(--font-display)" }}>Endorsements</dt>
                        <dd>
                          {q.endorsements.map((e) => (
                            <span key={e} className="text-sm block" style={{ color: "#8A8F9C" }}>{e}</span>
                          ))}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Gallery — carousels */}
      <section
        className="px-6 pb-24"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-4xl mx-auto pt-20">
          <span
            className="text-xs font-semibold uppercase tracking-widest block mb-4"
            style={{ color: "#C8865A", fontFamily: "var(--font-display)" }}
          >
            In the air
          </span>
          <p className="body-lg mb-16" style={{ maxWidth: "560px" }}>
            A small selection from various stages — first solo through checkride,
            Catalina Island and back, multi-engine training, and helicopter.
          </p>

          <div className="space-y-20">
            <div>
              <span
                className="text-xs font-semibold uppercase tracking-widest block mb-5"
                style={{ color: "#7B8293", fontFamily: "var(--font-display)" }}
              >
                Single engine
              </span>
              <FlyingCarousel items={SINGLE_ENGINE} />
            </div>

            <hr className="section-divider" />

            <div>
              <span
                className="text-xs font-semibold uppercase tracking-widest block mb-5"
                style={{ color: "#7B8293", fontFamily: "var(--font-display)" }}
              >
                Multi engine
              </span>
              <FlyingCarousel items={MULTI_ENGINE} />
            </div>

            <hr className="section-divider" />

            <div>
              <span
                className="text-xs font-semibold uppercase tracking-widest block mb-5"
                style={{ color: "#7B8293", fontFamily: "var(--font-display)" }}
              >
                Helicopter
              </span>
              <FlyingCarousel items={HELICOPTER} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
