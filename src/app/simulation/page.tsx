import type { Metadata } from "next";
import SimulationClient from "./SimulationClient";

export const metadata: Metadata = {
  title: "Gravity Simulator",
  description:
    "Interactive gravity simulator with gravity wells, black holes, debris, satellites, and repulsors.",
  alternates: {
    canonical: "/simulation",
  },
};

export default function SimulationPage() {
  return <SimulationClient />;
}
