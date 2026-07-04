"use client";

import OrbitalBackground from "@/components/OrbitalBackground";

export default function SimulationClient() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#07080C" }}>
      <h1 className="sr-only">Gravity Simulator</h1>
      <OrbitalBackground showHelpByDefault showTutorial />
    </div>
  );
}
