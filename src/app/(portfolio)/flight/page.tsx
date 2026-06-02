import type { Metadata } from "next";
import FlyingCarousel, { type MediaItem } from "@/components/FlyingCarousel";

export const metadata: Metadata = {
  title: "Flight",
  description:
    "EASA PPL(A) and FAA Private Pilot. Building toward multi-engine, helicopter, high performance, tailwheel, and complex.",
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
    description: "Multi-engine piston — DA62 and Twin Comanche.",
    status: "In progress",
  },
  {
    label: "Helicopter",
    description: "Up to 12,500 lbs. Specialized Helicopters at KRHV.",
    status: "In progress",
  },
  {
    label: "High Performance",
    description: "Required for aircraft with engines over 200hp.",
    status: "In progress",
  },
  {
    label: "Tailwheel",
    description: "Conventional gear — the old-school way to land.",
    status: "In progress",
  },
  {
    label: "Complex",
    description: "Retractable gear, flaps, and controllable-pitch prop.",
    status: "In progress",
  },
];

const SINGLE_ENGINE: MediaItem[] = [
  { type: "image", src: "/images/flying/single-engine/pa28-cockpit.jpeg",         caption: "PA-28 Warrior cockpit" },
  { type: "image", src: "/images/flying/single-engine/pa28-in-cruise.jpeg",       caption: "PA-28 Warrior in cruise" },
  { type: "video", src: "/images/flying/single-engine/sf-from-above.mov",         caption: "San Francisco from above" },
  { type: "video", src: "/images/flying/single-engine/short-final-palo-alto.mov", caption: "Short final into Palo Alto" },
  { type: "video", src: "/images/flying/single-engine/expedited-approach.mov",    caption: "Expedited approach — traffic conflict" },
  { type: "video", src: "/images/flying/single-engine/night-flight-timelapse.mp4", caption: "Night flight timelapse" },
  { type: "image", src: "/images/flying/single-engine/track-log-kavx-3o8.png",    caption: "Track log: Catalina (KAVX) → Harris Ranch (3O8)" },
  { type: "image", src: "/images/flying/single-engine/track-log-3o8-kpao.png",    caption: "Track log: Harris Ranch (3O8) → Palo Alto (KPAO)" },
  { type: "video", src: "/images/flying/single-engine/harris-ranch-patterns.mov",  caption: "Pattern work at Harris Ranch" },
  { type: "video", src: "/images/flying/single-engine/ifr-departure-kavx.mov",    caption: "IFR departure out of Catalina (KAVX)" },
];

const MULTI_ENGINE: MediaItem[] = [
  { type: "image", src: "/images/flying/multi-engine/twin-comanche-sunset.jpg",  caption: "Twin Comanche at sunset" },
  { type: "video", src: "/images/flying/multi-engine/takeoff-san-jose.mov",      caption: "Takeoff from San Jose" },
  { type: "video", src: "/images/flying/multi-engine/steep-turns.mov",           caption: "Steep turns" },
  { type: "video", src: "/images/flying/multi-engine/base-final-hollister.mov",  caption: "Base and final into Hollister" },
];

const HELICOPTER: MediaItem[] = [
  { type: "image", src: "/images/flying/helicopter/parents-sf-flight.jpg",           caption: "Taking my parents on a flight around SF" },
  { type: "video", src: "/images/flying/helicopter/detour-chicago.mp4",              caption: "Detour in Chicago" },
  { type: "video", src: "/images/flying/helicopter/final-hayward.mov",               caption: "Final approach into Hayward" },
  { type: "video", src: "/images/flying/helicopter/short-base-final-hayward.mov",    caption: "Shortened base and final into Hayward" },
  { type: "video", src: "/images/flying/helicopter/windy-departure-hayward.mov",     caption: "Windy departure from Hayward" },
  { type: "video", src: "https://pub-1689e9161f494bbc873145913e873cd2.r2.dev/Setdown%20on%20Pad.mp4",  caption: "Setting down on pad" },
  { type: "video", src: "https://pub-1689e9161f494bbc873145913e873cd2.r2.dev/sf-roundtrip.mp4", caption: "SF roundtrip" },
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
            EASA PPL(A) and FAA Private Pilot. Multi-engine, helicopter, and
            more in progress.
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
                  I earned my EASA PPL(A) in Germany, logging my first solo hours
                  over the Rhine Valley before finishing school. That certificate got
                  me in the air early, but moving to the US meant converting to a FAA
                  license.
                </p>
                <p className="body-lg">
                  At Stanford I&apos;m working through my FAA currency and club
                  checkouts at WVFC, mostly flying the C172S with G1000 glass panel.
                  Alongside that I&apos;m building toward my multi-engine rating on a
                  DA62 and Twin Comanche, and getting my helicopter rating at
                  Specialized Helicopters.
                </p>
                <p className="body-lg">
                  The first 100 hours across fixed-wing and rotary, EASA and FAA,
                  steam gauges and glass were some of the most fun I&apos;ve ever had
                  learning a new skill. For an AeroAstro major, this is the fun part
                  — applying the classroom concepts to the cockpit.
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
                          style={{ color: "#4D5260" }}
                        >
                          {item.status}
                        </span>
                      </h3>
                      <p className="text-sm" style={{ color: "#5A5F6E" }}>
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
            <img
              src="/images/flying/ABF48F2A-9189-4E2C-83A3-C55A770548A1_1_105_c.jpeg"
              alt="Flying"
              className="w-full rounded-xl mb-6"
              style={{ border: "1px solid rgba(255,255,255,0.07)", display: "block" }}
            />
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
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
                      <dt className="text-xs mb-0.5" style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}>Rating</dt>
                      <dd className="text-sm" style={{ color: "#8A8F9C" }}>{q.rating}</dd>
                    </div>
                    <div>
                      <dt className="text-xs mb-0.5" style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}>Class</dt>
                      <dd className="text-sm" style={{ color: "#8A8F9C" }}>{q.class}</dd>
                    </div>
                    {q.endorsements.length > 0 && (
                      <div>
                        <dt className="text-xs mb-0.5" style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}>Endorsements</dt>
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
                style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
              >
                Single engine
              </span>
              <FlyingCarousel items={SINGLE_ENGINE} />
            </div>

            <hr className="section-divider" />

            <div>
              <span
                className="text-xs font-semibold uppercase tracking-widest block mb-5"
                style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
              >
                Multi engine
              </span>
              <FlyingCarousel items={MULTI_ENGINE} />
            </div>

            <hr className="section-divider" />

            <div>
              <span
                className="text-xs font-semibold uppercase tracking-widest block mb-5"
                style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
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
