import type { Metadata } from "next";
import FlyingCarousel, { type MediaItem } from "@/components/FlyingCarousel";

export const metadata: Metadata = {
  title: "Flight",
  description:
    "EASA and FAA licensed. PPL SEP(L) with night operations. Currently training for multi-engine, high-performance, and helicopter.",
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
    label: "Multi-engine rating",
    description: "MEP(L). Adding the second engine.",
    status: "In progress",
  },
  {
    label: "High-performance endorsement",
    description: "Aircraft above 200hp. Changes the flight envelope.",
    status: "In progress",
  },
  {
    label: "Helicopter",
    description: "Anything up to 12,500lbs. A different kind of problem.",
    status: "In progress",
  },
];

const SINGLE_ENGINE: MediaItem[] = [
  { type: "image", src: "/images/flying/single-engine/pa28-cockpit.jpeg",         caption: "PA-28 Warrior cockpit" },
  { type: "image", src: "/images/flying/single-engine/pa28-in-cruise.jpeg",       caption: "PA-28 Warrior in cruise" },
  { type: "video", src: "/images/flying/single-engine/sf-from-above.mov",         caption: "San Francisco from above" },
  { type: "video", src: "/images/flying/single-engine/short-final-palo-alto.mov", caption: "Short final into Palo Alto" },
  { type: "video", src: "/images/flying/single-engine/expedited-approach.mov",    caption: "Expedited approach — traffic conflict" },
  { type: "video", src: "/images/flying/single-engine/night-flight-timelapse.m4v",caption: "Night flight timelapse" },
  { type: "image", src: "/images/flying/single-engine/track-log-kavx-3o8.png",   caption: "Catalina trip — track log: KAVX → Big Bear" },
  { type: "image", src: "/images/flying/single-engine/track-log-3o8-kpao.png",   caption: "Catalina trip — track log: Big Bear → KPAO" },
  { type: "video", src: "/images/flying/single-engine/harris-ranch-patterns.mov", caption: "Catalina trip — pattern work at Harris Ranch" },
  { type: "video", src: "/images/flying/single-engine/ifr-departure-kavx.mov",   caption: "Catalina trip — IFR departure out of KAVX" },
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
  { type: "video", src: "/images/flying/helicopter/setdown-pad.mp4",                 caption: "Setting down on pad" },
  { type: "video", src: "/images/flying/helicopter/sf-roundtrip.mp4",                caption: "SF roundtrip" },
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
          <p
            className="body-lg"
            style={{ maxWidth: "520px" }}
          >
            EASA and FAA licensed. Currently training for multi-engine,
            high-performance, and helicopter.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Main text */}
          <div className="lg:col-span-2 space-y-10">

            <div>
              <span
                className="text-xs font-semibold uppercase tracking-widest block mb-4"
                style={{ color: "#C8865A", fontFamily: "var(--font-display)" }}
              >
                Why
              </span>
              <div className="space-y-5">
                <p className="body-lg">
                  It was my grandma&apos;s idea. And from there on out I kept going.
                </p>
                <p className="body-lg">
                  The appeal is simple: you can just go, whenever and wherever.
                  It&apos;s a separate thing from my engineering work — which is
                  part of why I like it.
                </p>
                <p className="body-lg">
                  The view from up there is hard to beat. Clear air, the world
                  laid out below you — it&apos;s a good place to think.
                </p>
                <p className="body-lg">
                  What it has changed about how I work: checklists. The process
                  of getting there requires your full attention in a way that most
                  things don&apos;t, and aviation is built around the idea that
                  memory alone isn&apos;t reliable enough for anything that matters.
                  You write it down and follow the list. I use the same logic on
                  hardware integration and launch operations now.
                </p>
              </div>
            </div>

            <hr className="section-divider" />

            {/* Current training */}
            <div>
              <span
                className="text-xs font-semibold uppercase tracking-widest block mb-6"
                style={{ color: "#C8865A", fontFamily: "var(--font-display)" }}
              >
                Currently training
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
                        background:
                          item.status === "In progress"
                            ? "#C8865A"
                            : "rgba(200,134,90,0.3)",
                        boxShadow:
                          item.status === "In progress"
                            ? "0 0 6px rgba(200,134,90,0.5)"
                            : "none",
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

          {/* Sidebar: Qualifications */}
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
                <div
                  key={q.body}
                  className="card p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-semibold"
                      style={{
                        color: "#ECEDF2",
                        fontFamily: "var(--font-display)",
                      }}
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
                      <dt
                        className="text-xs mb-0.5"
                        style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
                      >
                        Rating
                      </dt>
                      <dd className="text-sm" style={{ color: "#8A8F9C" }}>
                        {q.rating}
                      </dd>
                    </div>
                    <div>
                      <dt
                        className="text-xs mb-0.5"
                        style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
                      >
                        Class
                      </dt>
                      <dd className="text-sm" style={{ color: "#8A8F9C" }}>
                        {q.class}
                      </dd>
                    </div>
                    {q.endorsements.length > 0 && (
                      <div>
                        <dt
                          className="text-xs mb-0.5"
                          style={{
                            color: "#4D5260",
                            fontFamily: "var(--font-display)",
                          }}
                        >
                          Endorsements
                        </dt>
                        <dd>
                          {q.endorsements.map((e) => (
                            <span
                              key={e}
                              className="text-sm block"
                              style={{ color: "#8A8F9C" }}
                            >
                              {e}
                            </span>
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

      {/* Gallery section */}
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
          <h2
            className="heading-lg mb-6"
            style={{ color: "#ECEDF2" }}
          >
            A small collection
          </h2>
          <p className="body-lg mb-16" style={{ maxWidth: "600px" }}>
            Photos and videos from various stages — from first solo through
            checkride, and since then: the high performance endorsement earned on
            the Catalina Island trip, the complex endorsement on the Twin
            Comanche, and the technically advanced aircraft endorsement on the
            glass-panel C172.
          </p>

          <div className="space-y-20">

            <div>
              <span
                className="text-xs font-semibold uppercase tracking-widest block mb-6"
                style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
              >
                Single engine
              </span>
              <FlyingCarousel items={SINGLE_ENGINE} />
            </div>

            <hr className="section-divider" />

            <div>
              <span
                className="text-xs font-semibold uppercase tracking-widest block mb-6"
                style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
              >
                Multi engine
              </span>
              <FlyingCarousel items={MULTI_ENGINE} />
            </div>

            <hr className="section-divider" />

            <div>
              <span
                className="text-xs font-semibold uppercase tracking-widest block mb-6"
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
