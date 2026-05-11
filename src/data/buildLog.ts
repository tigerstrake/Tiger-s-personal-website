// Build log entries — reverse chronological, newest first.
// Add new entries at the top of the array.

export interface BuildLogEntry {
  id: string;
  date: string;
  project: string;
  projectSlug: string;
  title: string;
  what: string;      // what changed
  why: string;       // why it changed
  result: string;    // what the outcome was
  next: string;      // what's next
}

export const buildLog: BuildLogEntry[] = [
  {
    id: "bl-011",
    date: "2026-05-11",
    project: "SkyRunners UAV",
    projectSlug: "skyrunners-uav",
    title: "Carbon fiber spar rods cut and clamps printed to fix motor twist",
    what: "Cut four carbon fiber rods to length and 3D-printed four clamps to mount them to the existing airframe. The spars run spanwise from the main fuselage structure to brace the motor booms and stop them rotating out of plane under load.",
    why: "During ground testing, the motor booms were twisting under thrust — the motors were pulling out of plane, which is a stability problem that would have made controlled flight impossible. The fix is to run rigid carbon fiber spars between the fuselage and each boom, clamped to the existing structure with printed brackets rather than bonded or drilled.",
    result: "Rods cut cleanly to the correct length. All four clamps printed and test-fitted to the airframe — tolerances are correct, clamping force is good, and nothing needs to be rebored. Used a respirator and full PPE throughout the cutting process; carbon fiber dust is not something you mess around with.",
    next: "Install the spars and clamps into the airframe, re-check motor alignment under static load, and verify the twist is eliminated before the next systems test.",
  },
  {
    id: "bl-010",
    date: "2026-04-09",
    project: "SkyRunners UAV",
    projectSlug: "skyrunners-uav",
    title: "Full systems test: motors and servos under load",
    what: "With the airframe fully assembled — motors on mounts, ESCs wired, servos connected to the flight controller and linked to control surfaces — ran the first full systems test. Spun all four motors up to partial and full throttle and exercised all control surfaces through their full range under load.",
    why: "This is the first time every subsystem has been powered simultaneously on the actual airframe. We needed to confirm that nothing interferes under real operating conditions: vibration from the motors affecting the servo linkages, voltage sag on the power bus under combined motor and servo load, and that control surface deflections stay correct when the airframe is under thrust.",
    result: "All four motors spun up cleanly with no ESC faults. No resonance or vibration coupling into the tail linkages at any throttle level. Servos held position under motor wash and responded correctly to stick inputs throughout. Power bus stayed stable — no brownouts or voltage dips that affected the FC. Elevator and rudder throws matched the configured endpoints in both directions.",
    next: "Taxi tests and low-speed ground handling to check CG and control authority before first flight.",
  },
  {
    id: "bl-009",
    date: "2026-04-09",
    project: "SkyRunners UAV",
    projectSlug: "skyrunners-uav",
    title: "Control surface linkages installed and servo cables routed through tail boom",
    what: "Installed pushrod linkages for the elevator and rudder, connected them to the control horns on each surface, and ran all servo cables through the tail boom to the fuselage.",
    why: "With the tail bonded and cured, getting the control surfaces mechanically connected was the next critical path item. Linkages need to go in before the boom is enclosed or any other hardware crowds the routing path — it's much harder to fish cables through after the fact.",
    result: "Both elevator and rudder pushrods installed with correct throw and no slop at the clevises. Cables routed cleanly through the boom with enough slack at the fuselage end for servo connections. Control surfaces move through full range of motion with no binding.",
    next: "Connect servo cables to the flight controller, configure control surface endpoints in the FC, and verify correct throw direction for each axis.",
  },
  {
    id: "bl-008",
    date: "2026-04-07",
    project: "SkyRunners UAV",
    projectSlug: "skyrunners-uav",
    title: "Motor mounts and landing gear: designed, 3D printed, and assembled",
    what: "Designed new motor mounts and landing gear in CAD, 3D printed both parts, and assembled them onto the airframe.",
    why: "The previous motor mount arrangement was a temporary placeholder and the aircraft had no landing gear. Getting proper mounts locked in lets us do static thrust tests with the motors in their final position, and the landing gear is needed before any ground handling or taxi tests.",
    result: "Parts printed cleanly. Motor mounts fit onto the boom tubes with the designed press-fit tolerance — no slop, no cracking. Landing gear attached and holds the airframe at the correct ground angle. Assembly went together without issues.",
    next: "Mount motors and ESCs onto the new mounts, run static thrust tests, and check CG with full electronics installed.",
  },
  {
    id: "bl-007",
    date: "2026-04-05",
    project: "SkyRunners UAV",
    projectSlug: "skyrunners-uav",
    title: "Carbon spars bonded to fuselage and tail",
    what: "Glued the carbon fiber spars to the fuselage and bonded the tail assembly onto the carbon spars.",
    why: "The spars are the primary load path from the wings through the fuselage to the tail. Getting them permanently bonded is a prerequisite for any further structural work — everything else keys off the spar positions.",
    result: "Bond came out clean. Spar alignment checked against the CAD reference and is within tolerance. Tail is square to the fuselage centerline. Epoxy cured fully overnight with no delamination or voids visible.",
    next: "Install control surface linkages and route servo cables through the tail boom.",
  },
  {
    id: "bl-006",
    date: "2026-03-20",
    project: "SkyRunners UAV",
    projectSlug: "skyrunners-uav",
    title: "CFD in Luminary: CoP is too far aft",
    what: "Ran full CFD analysis on the current wing and fuselage geometry in Luminary.",
    why: "We needed to verify the aerodynamic center and center of pressure location before committing to the next structural iteration.",
    result: "CoP came out significantly too far aft relative to our CG target. The aircraft as designed would be longitudinally unstable. To compensate, the elevators need to run at a meaningful negative angle of attack to trim, which is a drag penalty we don't want baked into the baseline.",
    next: "Revisit wing placement relative to CG, and look at adjusting tail volume coefficient. Need to get CoP forward before the current geometry gets locked in.",
  },
  {
    id: "bl-005",
    date: "2026-03-05",
    project: "SkyRunners UAV",
    projectSlug: "skyrunners-uav",
    title: "Full parametric redesign",
    what: "Rebuilt the entire airframe model parametrically in Fusion 360. Wing chord, span, rib spacing, fuselage cross-section, and tail geometry all driven by a single parameter table.",
    why: "Every time we changed something, we were manually updating a dozen other dimensions. A parameter change to the wing chord required touching every rib, the spar cutouts, the skin panels. It was slow and introduced errors. Making it parametric means we can iterate on aerodynamic layout without paying a drafting tax each time.",
    result: "Model rebuilt. Changing the master parameters now propagates correctly through the full assembly. First test: swept chord from 180mm to 200mm, updated cleanly in about 30 seconds.",
    next: "Use the parametric model as the input for the CFD runs and structural sizing.",
  },
  {
    id: "bl-004",
    date: "2026-02-18",
    project: "SkyRunners UAV",
    projectSlug: "skyrunners-uav",
    title: "Fuselage skinning: balsa ribs + heatshrink foil",
    what: "Covered the fuselage rib frames with 1/32\" balsa sheet, then wrapped the outside with heatshrink foil.",
    why: "The rib-only structure had too much drag and no defined external surface for aerodynamic analysis. Balsa sheet gives a smooth skin over the ribs; heatshrink foil pulled tight over that gives a clean, low-friction outer surface and adds a small amount of torsional stiffness.",
    result: "Surface came out smooth. Heatshrink pulled evenly with a heat gun. No bubbling or wrinkles on the curved fuselage sections. Weight added was less than expected.",
    next: "Weigh completed fuselage section, update mass budget.",
  },
  {
    id: "bl-003",
    date: "2026-02-03",
    project: "SkyRunners UAV",
    projectSlug: "skyrunners-uav",
    title: "Wing cutting: switched to 4-axis wire foam cutter at CHIP",
    what: "Moved wing core production from the manual method to the 4-axis wire foam cutter at CHIP (Stanford's product realization lab).",
    why: "The manual pink foam cutting was too inconsistent. Two wing halves cut back-to-back had visible profile differences that would cause roll asymmetry. The wire cutter runs the E193 profile directly from the CAD file and cuts both root and tip profiles simultaneously on the 4-axis machine, giving a proper tapered section.",
    result: "First cuts came out clean. Both wing halves match within tolerance. The profile edges are sharp and consistent in a way the manual method never got close to.",
    next: "Bond spars and ribs into foam cores, then skin.",
  },
  {
    id: "bl-002",
    date: "2025-12-10",
    project: "SkyRunners UAV",
    projectSlug: "skyrunners-uav",
    title: "First wing cores: E193 profile, laser cut ribs and manual foam shaping",
    what: "Cut the first wing cores using a laser-cut wood rib template method: laser cut E193 profile ribs from plywood, glued them to pink foam blocks as guides, then manually cut the foam to shape with a hot wire and knife and bonded the pieces together.",
    why: "Needed a first wing core to validate the E193 profile choice and the basic build process before investing in the CHIP foam cutter setup.",
    result: "Wing core came out roughly correct in profile. Surface finish was rough and the manual cutting introduced some asymmetry, but good enough to validate the E193 geometry as workable and confirm the rib spacing layout.",
    next: "Evaluate whether manual cutting is accurate enough for the final build or if we need a better process.",
  },
  {
    id: "bl-001",
    date: "2026-03-10",
    project: "Smart Light Switch",
    projectSlug: "smart-light-switch",
    title: "ESP brownout: traced to servo voltage spikes",
    what: "Tracked down why the ESP32 would accept a firmware upload exactly once, then become completely unreachable on every subsequent attempt.",
    why: "The failure mode was strange: first flash worked, the program ran briefly, then the ESP dropped off USB and never came back. Looked like a code issue at first. The board appeared bricked rather than just crashing.",
    result: "Root cause: the servo was generating voltage spikes on the shared power rail that were browning out the ESP immediately after it started driving the servo. The ESP wasn't crashing or locking up. It was losing power. Confirmed by decoupling the servo from the rail: ESP stayed up indefinitely. Fixed with a dedicated supply for the servo and a decoupling capacitor on the ESP rail. The fix took about ten minutes once the cause was known; finding the cause took much longer.",
    next: "Enclosure design and wall-box integration.",
  },
];
