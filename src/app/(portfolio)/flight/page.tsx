import type { Metadata } from "next";

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
    </div>
  );
}
