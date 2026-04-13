// Project data — add new entries here, the UI updates automatically.
// Status options: "active" | "completed" | "early-stage" | "archived"
// Category options: see Category type below

export type ProjectStatus = "active" | "completed" | "early-stage" | "archived";

export type ProjectCategory =
  | "Aerospace"
  | "Rockets"
  | "UAVs"
  | "Manufacturing"
  | "Robotics"
  | "Embedded"
  | "Mechatronics"
  | "Physics"
  | "Fabrication"
  | "Media"
  | "Biotech";

export interface ProjectHighlight {
  label: string;
  value: string;
}

export interface ProjectDoc {
  label: string;
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  status: ProjectStatus;
  categories: ProjectCategory[];
  role: string;
  timeline: string;
  lastUpdated: string;
  featured: boolean;
  coverImage?: string;
  images?: string[];
  videos?: string[];
  youtubeUrl?: string;
  docs?: ProjectDoc[];
  url?: string;
  embed?: boolean;
  challenge: string;
  constraints: string[];
  designDecisions: string[];
  buildProcess: string[];
  results: string;
  lessons: string[];
  highlights: ProjectHighlight[];
  tools: string[];
  relatedSlugs: string[];
}

export const projects: Project[] = [
  {
    slug: "l1-rocket",
    title: "L1 Rocket",
    subtitle: "Level 1 high-power rocketry. Built, waiting on a launch window.",
    description:
      "My L1 certification rocket. Everything is built: airframe, avionics, recovery, parachute, preflight checklist. I just haven't had a launch window yet. The NAR L1 cert requires a witnessed flight at an insured range with a single H or I motor, stable ascent, and a successful parachute recovery. Once I get to a launch, the plan is solid.",
    status: "active",
    categories: ["Rockets", "Aerospace"],
    role: "Builder",
    timeline: "2025",
    lastUpdated: "2026-03-12",
    featured: true,
    coverImage: "/images/l1-rocket/l1-rocket-held-in-lab.jpg",
    images: [],
    challenge:
      "The certification flight isn't the hard part. It's making sure everything works before you're standing on a field with a rocket on the pad and people watching.",
    constraints: [
      "H or I motor only for the cert flight, single certified motor, no clustering",
      "Standard parachute recovery required. No tumble, glide, or non-parachute methods.",
      "CP has to be marked on the exterior, stability margin documented, and the certifier will ask you technical questions on the spot",
    ],
    designDecisions: [
      "Kept the avionics bay accessible with one tool, no panel removal. Field conditions are not the place to discover you can't reach something.",
      "Wrote explicit go/no-go gates into the preflight checklist tied to physical states, not just task boxes",
      "Ran the full preflight procedure dry three times before ever going near a launch",
    ],
    buildProcess: [
      "OpenRocket for stability modeling and motor selection",
      "Airframe build and fin alignment",
      "Avionics and recovery packaging, bench-tested before integration",
      "Preflight checklist written and dry-run until there were no surprises left in it",
    ],
    results:
      "Everything built and bench-checked. Waiting on a launch window at an insured NAR range.",
    lessons: [
      "The avionics packaging I thought would work fine needed a full rework once I actually tried to service it. What looks accessible in CAD isn't always accessible with cold hands.",
      "Recovery packaging fit was tighter than expected once temperature dropped. Something to spec more carefully on L2.",
    ],
    highlights: [
      { label: "Motor class", value: "H or I (single)" },
      { label: "Certification body", value: "NAR" },
      { label: "Status", value: "Built, launch pending" },
    ],
    tools: ["Fusion 360", "OpenRocket", "Avionics integration", "Recovery systems"],
    relatedSlugs: ["l2-rocket", "pulse-jet", "rocket-tvc", "stratosphere-balloon"],
  },

  {
    slug: "l2-rocket",
    title: "L2 Rocket",
    subtitle: "Level 2 high-power rocketry. Early build phase.",
    description:
      "The step up from L1. Bigger motor, longer airframe, more complex recovery, and the same care applied to a harder set of problems. Just started the build. L2 adds a written exam, a J/K/L motor, and mandatory dual-deployment recovery with altimeter-triggered ejection charges.",
    status: "active",
    categories: ["Rockets", "Aerospace"],
    role: "Systems Lead",
    timeline: "2026–Present",
    lastUpdated: "2026-03-15",
    featured: true,
    coverImage: "/images/l2-rocket/l2-rocket-cad.png",
    challenge:
      "Scale the L1 approach to a significantly more powerful vehicle without losing the attention to process that made L1 work.",
    constraints: [
      "NAR Level 2 certification requirements",
      "Increased structural loads from a higher-impulse motor",
      "Dual-deployment recovery with redundant altimeters",
      "Field assembly needs to stay manageable without special tooling",
    ],
    designDecisions: [
      "Dual altimeter bay with independent battery and arming systems",
      "All-fiberglass airframe for structural margin beyond minimum requirements",
      "Extended avionics section to fit the redundancy without moving the CG",
    ],
    buildProcess: [
      "Written exam study underway, required before the certification flight",
      "Airframe build started",
      "Avionics bay planned for dual altimeter with independent battery and arming. Same serviceability standard as L1.",
    ],
    results: "Early build phase. Target: L2 certification flight.",
    lessons: [],
    highlights: [
      { label: "Vehicle Class", value: "Level 2 HPR" },
      { label: "Recovery", value: "Dual-deployment" },
      { label: "Phase", value: "Build" },
    ],
    tools: ["Fusion 360", "OpenRocket", "Fiberglass layup", "Dual altimetry"],
    relatedSlugs: ["l1-rocket", "rocket-tvc"],
  },

  {
    slug: "skyrunners-uav",
    title: "SkyRunners UAV",
    subtitle: "Manufacturing and structures lead. Active team project.",
    description:
      "SkyRunners is a Stanford student team building a fixed-wing UAV system. I lead manufacturing and structures, which means turning design intent into actual parts that survive the loads they're supposed to survive, assembled in a way that can be reproduced and maintained.",
    status: "active",
    categories: ["UAVs", "Aerospace", "Manufacturing"],
    role: "Manufacturing & Structures Lead",
    timeline: "2025–Present",
    lastUpdated: "2026-03-14",
    featured: true,
    coverImage: "/images/skurunners/skyrunners-cover.jpg",
    images: ["/images/skurunners/skurunners-wing-panel-blue-pink-stripes.jpg"],
    challenge:
      "Coordinate manufacturing across a team where design and build happen in parallel, while keeping structural integrity and weight targets intact throughout.",
    constraints: [
      "Weight budget is non-negotiable. Every gram in structure is a gram out of payload or endurance.",
      "Parts need to be manufacturable with available tooling, not just theoretically optimal",
      "Airframe needs to be repairable in the field without specialized equipment",
    ],
    designDecisions: [
      "Composite spar design for the main wing load path, with accessible bonding interfaces",
      "Modular fuselage sections so subsystems can be swapped without full disassembly",
      "Material selection driven by laminate schedule rather than raw material properties alone",
    ],
    buildProcess: [
      "Wing profile: E193 airfoil. First cores built by laser cutting plywood ribs, gluing to pink foam blocks, and manually cutting to shape. Worked, but introduced too much asymmetry.",
      "Switched wing production to the 4-axis wire foam cutter at CHIP, which cuts root and tip profiles simultaneously from the CAD file. First cuts came out clean and symmetric.",
      "Fuselage skinning: 1/32\" balsa sheet over rib frames, heatshrink foil pulled tight over the balsa for a smooth aerodynamic surface",
      "Full parametric redesign: rebuilt the model so chord, span, rib spacing, fuselage cross-section, and tail geometry all drive from a single parameter table instead of being manually updated",
      "CFD in Luminary: current design has CoP too far aft. Elevators need negative AoA to trim, which is a drag penalty. Geometry revision in progress.",
    ],
    results: "Active development. Wing production process validated. Aerodynamic layout under revision based on CFD.",
    lessons: [],
    highlights: [
      { label: "Platform", value: "Fixed-wing UAV" },
      { label: "Role", value: "Manufacturing & Structures Lead" },
      { label: "Team", value: "SkyRunners at Stanford" },
    ],
    tools: [
      "Fusion 360",
      "Composite layup",
      "Structural analysis",
      "CNC routing",
      "Vacuum bagging",
    ],
    relatedSlugs: ["l1-rocket", "l2-rocket"],
  },

  {
    slug: "pulse-jet",
    title: "Pulse Jet",
    subtitle: "Combustion test program. Early stage.",
    description:
      "A pulse jet build with two friends, focused on making the test setup repeatable before worrying about making it fast. The goal right now is a fixture geometry that can be modified without rebuilding the whole test rig, and a data capture setup that gives comparable run-to-run numbers.",
    status: "early-stage",
    categories: ["Aerospace", "Manufacturing"],
    role: "Lead Builder and Test Engineer",
    timeline: "2025–Present",
    lastUpdated: "2026-03-12",
    featured: false,
    coverImage: "/images/pulse-jet/pulse-jet-cover.webp",
    challenge:
      "Build a pulse jet test setup where geometry changes can be evaluated without rebuilding the fixture every time. Repeatability before optimization.",
    constraints: [
      "Thermal stress and material fatigue under repeated combustion runs",
      "Strict test safety envelope in a compact fixture format",
      "Currently in safety review phase. No hot fires until the protocol is signed off.",
    ],
    designDecisions: [
      "Modular chamber and intake geometry for faster revision cycles",
      "Fixed ignition routing to separate ignition variables from geometry variables",
      "Temperature and thrust measurement integrated at set reference points before the first run",
    ],
    buildProcess: [
      "Initial chamber fabrication and support fixture complete",
      "Safety documentation and review in progress",
      "Instrumentation mounting designed into the fixture, not added after",
    ],
    results:
      "Repeatable ignition sequence established. Thermal mapping identifies geometry hotspots per revision.",
    lessons: [
      "Fixture stiffness matters more than expected. Run-to-run geometry drift contaminated early data.",
    ],
    highlights: [
      { label: "Type", value: "Valveless pulse jet" },
      { label: "Phase", value: "Safety evaluation" },
      { label: "Collaborators", value: "3-person team" },
    ],
    tools: [
      "Fusion 360",
      "Sheet metal fabrication",
      "Thermal instrumentation",
      "Bench fixture design",
    ],
    relatedSlugs: ["l1-rocket", "rocket-tvc"],
  },

  {
    slug: "smart-light-switch",
    title: "Smart Light Switch",
    subtitle: "ESP32-based servo-actuated wall switch with WiFi scheduling",
    coverImage: "/images/smart-light-switch/smart-switch-cover.png",
    videos: [
      "/images/smart-light-switch/smart-light-switch-demo.mp4",
      "/images/smart-light-switch/lightswitch-demo-clip-1.mp4",
      "/images/smart-light-switch/lightswitch-demo-clip-2.mp4",
    ],
    docs: [
      { label: "Breadboard diagram", url: "/docs/smart-light-switch-breadboard.pdf" },
      { label: "Schematic", url: "/docs/smart-light-switch-schematic.pdf" },
    ],
    description:
      "A mechatronic retrofit for a standard wall switch. An ESP32 drives a servo that physically actuates the toggle, a web interface running off the ESP's own WiFi access point handles scheduling, and the whole thing installs in place of the existing switch plate. No cloud, no app. Just a local scheduler that works.",
    status: "active",
    categories: ["Embedded", "Mechatronics"],
    role: "Designer and Builder",
    timeline: "2026",
    lastUpdated: "2026-03-10",
    featured: false,
    challenge:
      "Retrofit a standard wall switch with programmable scheduling while keeping it fully self-contained and not dependent on any external service.",
    constraints: [
      "Must fit within a standard single-gang wall box",
      "Must work without any internet connection or cloud service",
      "Servo actuation needs to reliably toggle the physical switch without slipping or stalling",
    ],
    designDecisions: [
      "ESP32 hosts its own WiFi access point. The scheduler is accessible from any device on the local network without a router.",
      "Servo bracket designed to accommodate the small tolerances of consumer switch plates",
      "Web UI stored in ESP32 flash, no external hosting",
    ],
    buildProcess: [
      "Servo bracket prototyped and iterated in PLA for fit before final fabrication",
      "ESP32 firmware: FreeRTOS task for servo control, separate task for web server",
      "Scheduling logic stores events in NVS (non-volatile storage) so they survive power cycles",
    ],
    results:
      "Works. Reliably schedules the physical switch toggle. Web UI loads in under 200ms on the local network.",
    lessons: [
      "Servo torque needs significantly more margin than the nominal spec when actuating against spring-loaded switches",
    ],
    highlights: [
      { label: "MCU", value: "ESP32" },
      { label: "Actuation", value: "Servo-driven physical toggle" },
      { label: "Interface", value: "Local WiFi AP + web scheduler" },
    ],
    tools: ["ESP32", "FreeRTOS", "Fusion 360", "PLA 3D printing", "Web UI (ESP-hosted)"],
    relatedSlugs: ["rocket-tvc", "robotic-arm"],
  },

  {
    slug: "robotic-arm",
    title: "Small Robotic Arm",
    subtitle: "Multi-DOF arm. Target demo: autonomous block stacking.",
    description:
      "A small desktop robotic arm built as a testbed for control logic and inverse kinematics. The target demo is autonomous wooden block stacking, which makes it a useful exhibition piece for 3D printing events since the whole structure is printed. Currently working through IK and closed-loop joint control to get to the point where it can actually execute the stacking sequence reliably.",
    status: "active",
    categories: ["Robotics", "Embedded", "Mechatronics"],
    role: "Designer and Builder",
    timeline: "2026–Present",
    lastUpdated: "2026-03-08",
    featured: false,
    coverImage: "/images/robotic-arm/robotic-arm-on-workbench.jpg",
    challenge:
      "Build a low-cost desktop arm with enough precision and repeatability to stack wooden blocks autonomously. Reliable enough to run unsupervised at an exhibition.",
    constraints: [
      "Budget constraint: off-the-shelf servo motors and 3D printed structure only",
      "Workspace and reach sized for desktop use",
      "Control architecture should be modular so kinematics experiments don't require hardware changes",
    ],
    designDecisions: [
      "3-DOF plus gripper. Enough for meaningful IK experiments without excessive mechanical complexity.",
      "ESP32-based control with serial interface to allow laptop-side trajectory planning",
      "Printed structure designed for reprints. Joints are bolt-together, not glued.",
    ],
    buildProcess: [
      "CAD in Fusion 360, iterating on joint stiffness and servo mounting",
      "Firmware: servo control loop with position feedback from potentiometers",
      "Inverse kinematics implementation in progress",
    ],
    results: "Structure complete, forward kinematics verified, IK in progress.",
    lessons: [],
    highlights: [
      { label: "DOF", value: "3 + gripper" },
      { label: "Control", value: "ESP32 + serial" },
      { label: "Fabrication", value: "3D printed PLA" },
    ],
    tools: ["Fusion 360", "ESP32", "Servo motors", "PLA printing", "Python (IK)"],
    relatedSlugs: ["smart-light-switch", "rocket-tvc"],
  },

  {
    slug: "rocket-tvc",
    title: "Rocket TVC",
    subtitle: "Thrust vector control architecture for small rocket experiments",
    description:
      "A thrust vector control prototype for small-scale rocket stabilization experiments. The goal is a TVC stack with real hardware-in-loop validation, not just a simulation that looks good on a laptop.",
    status: "active",
    categories: ["Rockets", "Embedded", "Aerospace"],
    role: "Mechanical and Embedded Integrator",
    timeline: "2026–Present",
    lastUpdated: "2026-03-12",
    featured: false,
    coverImage: "/images/rocket-tvc/rocket-tvc-cover.png",
    videos: ["/images/rocket-tvc/rocket-tvc-test-clip.mp4"],
    challenge:
      "Build a TVC mechanism that's responsive enough to be useful and mechanically reliable enough to trust in a test stand context.",
    constraints: [
      "Actuator latency must be low enough for meaningful control loop bandwidth",
      "Mechanical backlash directly corrupts closed-loop stability and has to be designed out",
      "Power-to-weight tradeoff between motor size and system mass",
    ],
    designDecisions: [
      "Compliant mechanism for gimbal motion. Eliminates the backlash you get from traditional bearing-and-linkage setups.",
      "ESP32 as controller with dedicated PWM output for servo actuation",
      "Test harness first: validate the control loop on the bench before any propulsion integration",
    ],
    buildProcess: [
      "Controller framework and signal routing validated on bench fixture",
      "Mechanical gimbal prototyped in PLA, backlash characterized before control tuning",
      "Linkage geometry reworked after initial backlash measurements exceeded predictions",
    ],
    results: "Core control architecture functional. Actuator selection and loop tuning in progress.",
    lessons: [
      "Backlash sensitivity was significantly higher than predicted. Linkage stiffness needs to be a core design parameter from the start, not a detail sorted out later.",
    ],
    highlights: [
      { label: "Controller", value: "ESP32" },
      { label: "Mechanism", value: "Compliant gimbal" },
      { label: "Validation", value: "Hardware-in-loop bench test" },
    ],
    tools: [
      "ESP32",
      "Fusion 360",
      "Servo actuation",
      "Signal logging",
      "PLA 3D printing",
    ],
    relatedSlugs: ["l1-rocket", "l2-rocket", "pulse-jet"],
  },

  {
    slug: "stratosphere-balloon",
    title: "Stratosphere Balloon Payload",
    subtitle: "Science payload to ~30km with live sensor logging",
    description:
      "A stratospheric balloon payload built with three classmates at Evangelisches Gymnasium Lippstadt. The gondola flew a Raspberry Pi 2B running a full sensor suite: magnetometer, gyroscope, interior and exterior temperature, altitude, and pressure, alongside a GoPro and Raspberry Pi camera. The structure was 3D-printed in a teardrop form for aerodynamic stability during ascent, with an insulation layer to keep the electronics alive at stratospheric temperatures. We got the data back: full temperature, pressure, and altitude curves through the ascent and descent.",
    status: "completed",
    categories: ["Aerospace", "Manufacturing", "Fabrication"],
    role: "Co-lead Engineer",
    timeline: "2022",
    lastUpdated: "2026-03-26",
    featured: true,
    coverImage: "/images/stratosphere-balloon/stratosphere-balloon-earth-curvature-view.png",
    images: ["/images/stratosphere-balloon/stratosphere-balloon-gps-flight-track-map.jpg", "/images/stratosphere-balloon/stratosphere-balloon-telemetry-altitude-chart.png"],
    youtubeUrl: "https://www.youtube.com/embed/Uy57UXi4sQ4",
    challenge:
      "Keep a Raspberry Pi and its sensors running through a flight profile that hits near-vacuum pressure and temperatures well below -40°C, then recover the gondola and get usable data off it.",
    constraints: [
      "Electronics must survive stratospheric temperatures without heaters",
      "Mass budget is constrained by balloon lift. Every gram of insulation costs altitude.",
      "Gondola needs to survive a parachute landing on whatever terrain happens to be below",
      "GPS tracking required for recovery: two independent trackers plus an AirTag",
    ],
    designDecisions: [
      "Teardrop gondola form in 3D-printed structure to reduce oscillation on ascent and improve stability",
      "Insulation layer integrated into the outer shell with embedded nuts for assembly",
      "Raspberry Pi 2B for processing capability and reasonable power draw from the 10,000 mAh powerbank",
      "Dual GPS trackers plus AirTag for recovery. If one fails, you can still find it.",
    ],
    buildProcess: [
      "Gondola structural design in teardrop form, 3D printed with insulation layer and embedded hardware",
      "Electronics integration: Raspberry Pi 2B, sensor suite (magnetometer, gyroscope, temp, pressure, altitude), GoPro, Pi camera",
      "Power system: 10,000 mAh powerbank for main electronics, 9V battery for backup systems",
      "Recovery: parachute sized to landing zone constraints, 2x GPS trackers plus AirTag",
      "Flight: balloon released, ascent to stratosphere, burst, parachute descent, recovery",
      "Data analysis: temperature, pressure, and altitude curves extracted from logged sensor data",
    ],
    results:
      "Successful flight. Full sensor dataset recovered: altitude, interior and exterior temperature, pressure, magnetic field, and acceleration logged through the complete flight profile. Video recovered from both cameras. The gondola was retrieved from a farmer who was slightly amused and slightly confused by the whole situation.",
    lessons: [
      "Temperature swing between launch and apogee is larger than spec values suggest once you account for sensor lag and enclosure thermal mass",
      "Recovery with dual GPS plus AirTag was worth the extra weight. The balloon drifted further than predicted.",
    ],
    highlights: [
      { label: "Computer", value: "Raspberry Pi 2B" },
      { label: "Sensors", value: "Temp, pressure, altitude, gyro, magnetometer" },
      { label: "Team", value: "4 students, EGL" },
    ],
    tools: ["Fusion 360", "Raspberry Pi", "Python (sensor logging)", "3D printing", "GPS tracking"],
    relatedSlugs: ["fabrication-lab-eg", "l1-rocket"],
  },

  {
    slug: "esa-internship",
    title: "ESA Internship",
    subtitle: "Attitude control and mission operations. BepiColombo and LISA Pathfinder.",
    description:
      "Two weeks at the European Space Agency in Grade 9. Work focused on attitude control systems for BepiColombo and LISA Pathfinder, analyzing satellite positioning data and contributing to backup system improvements. Also directed a simulated satellite launch exercise as Director General, which is a strange thing to do at 15 but genuinely useful for understanding mission operations at a systems level.",
    status: "completed",
    categories: ["Aerospace"],
    role: "Intern",
    timeline: "2021",
    lastUpdated: "2026-03-22",
    featured: true,
    coverImage: "/images/esa/esa-airbus-spacecraft-hardware-lab-coats.jpg",
    images: ["/images/esa/esa-esoc-mission-control-room.jpg", "/images/esa/esa-esoc-satellite-operations-workstation.jpg"],
    challenge:
      "Do useful work on real spacecraft systems with two weeks of access and a high school physics background.",
    constraints: [
      "Two-week duration with a steep ramp-up required on attitude control and mission operations",
      "Working with flight software and documentation not designed for external interns",
    ],
    designDecisions: [
      "Focused on the attitude control subsystem rather than trying to cover the full mission stack. Depth over breadth given the time available.",
      "Used the simulated launch exercise to build intuition for operations tradeoffs under time pressure",
    ],
    buildProcess: [
      "Mission architecture orientation for BepiColombo and LISA Pathfinder",
      "Attitude control data analysis and backup satellite system review",
      "Simulated satellite launch exercise directed as internal training scenario",
    ],
    results:
      "Completed backup satellite system analysis. Contributed recommendations to attitude control documentation.",
    lessons: [
      "Real spacecraft operations are dominated by edge case handling and redundancy logic. Almost none of that shows up in textbook descriptions of a mission.",
      "The gap between simulation and flight software is larger than it looks from the outside",
    ],
    highlights: [
      { label: "Duration", value: "2 weeks" },
      { label: "Missions", value: "BepiColombo, LISA Pathfinder" },
      { label: "Focus", value: "Attitude control systems" },
    ],
    tools: ["Mission analysis tools", "Attitude control documentation", "Operations simulation"],
    relatedSlugs: ["dlr-internship", "eumetsat-internship"],
  },

  {
    slug: "dlr-internship",
    title: "DLR Internship",
    subtitle: "Hypersonic aerodynamics and scramjet testing at Mach 10",
    description:
      "One week at DLR (German Aerospace Research Center) in the hypersonic wind tunnel facility. Operated Mach 10 test equipment, calculated airfoil efficiency at hypersonic speeds, and worked through scramjet combustor aerodynamics data. Short duration, high density. The kind of week that recalibrates what you think fast means.",
    status: "completed",
    categories: ["Aerospace", "Physics"],
    role: "Intern",
    timeline: "2021",
    lastUpdated: "2026-03-22",
    featured: true,
    coverImage: "/images/dlr/dlr-optics-bench-experiment.jpg",
    images: ["/images/dlr/dlr-drone-3d-printed-component-test-rig.jpg", "/images/dlr/dlr-electronics-breadboard-workbench.jpg"],
    challenge:
      "Get meaningful technical understanding out of one week in a world-class hypersonic research facility.",
    constraints: [
      "One-week duration, which required being selective about what was worth focusing on",
      "Test facility safety protocols limited hands-on equipment operation to supervised sessions",
    ],
    designDecisions: [
      "Concentrated time on aerodynamic analysis over propulsion. More accessible in the available window given existing background.",
    ],
    buildProcess: [
      "Wind tunnel facility orientation and safety protocol certification",
      "Mach 10 airfoil testing: data collection and drag/lift coefficient analysis across multiple geometries",
      "Scramjet combustor aerodynamics: inlet and flow path efficiency analysis",
    ],
    results:
      "Calculated efficiency curves for several airfoil geometries at Mach 10. Documented scramjet inlet aerodynamics analysis.",
    lessons: [
      "Hypersonic aerodynamics has almost nothing in common with subsonic intuition. Shock interactions and aerodynamic heating dominate everything.",
      "High-end research facilities spend more time on calibration and diagnostics than on actual test runs",
    ],
    highlights: [
      { label: "Duration", value: "1 week" },
      { label: "Facility", value: "DLR hypersonic wind tunnel" },
      { label: "Test Speed", value: "Mach 10" },
    ],
    tools: ["Hypersonic wind tunnel instrumentation", "Aerodynamic analysis", "CFD diagnostics"],
    relatedSlugs: ["esa-internship", "eumetsat-internship", "pulse-jet"],
  },

  {
    slug: "eumetsat-internship",
    title: "EUMETSAT Internship",
    subtitle: "Satellite operations and space systems program",
    description:
      "Two weeks at EUMETSAT (European Organization for the Exploitation of Meteorological Satellites). Organized a space systems education program covering satellite construction, rocketry, and orbit mechanics. Produced and published a podcast interview with the Director General on low Earth orbit satellite operations, which required doing real homework to ask questions worth answering.",
    status: "completed",
    categories: ["Aerospace"],
    role: "Intern",
    timeline: "2021",
    lastUpdated: "2026-03-22",
    featured: false,
    coverImage: "/images/eumetsat/eumetsat-satellite.jpg",
    videos: ["/images/eumetsat/eumetsat-airmass-rgb-satellite-animation.mp4"],
    challenge:
      "Design and deliver a coherent educational program on space systems while also producing a technically credible interview with the Director General on LEO satellite operations.",
    constraints: [
      "Two-week duration. The program had to be designed and delivered within the same window.",
      "Audience for the educational program ranged widely in technical background",
    ],
    designDecisions: [
      "Program built around physical hardware where possible: satellite mock-ups and rocket components rather than slides alone",
      "Podcast format for the DG interview rather than a written report. Better medium for covering operational nuance and edge cases.",
    ],
    buildProcess: [
      "Space systems curriculum covering satellite construction, launch mechanics, and orbit operations",
      "Rocketry section with hands-on component demonstration",
      "DG interview preparation: technical background research on LEO constellation design and operations",
      "Recorded, edited, and published podcast through EUMETSAT channels",
    ],
    results:
      "Program completed and delivered. Director General podcast interview published through EUMETSAT.",
    lessons: [
      "Getting a useful technical interview requires real preparation. Surface-level questions get surface-level answers regardless of how senior the person is.",
    ],
    highlights: [
      { label: "Duration", value: "2 weeks" },
      { label: "Output", value: "Published podcast" },
      { label: "Focus", value: "LEO satellite operations" },
    ],
    tools: ["Curriculum design", "Podcast production", "Satellite hardware"],
    relatedSlugs: ["esa-internship", "dlr-internship"],
  },

  {
    slug: "fabrication-lab-eg",
    title: "Fabrication Lab EG",
    subtitle: "Founded a school makerspace and handed it over to trained successors",
    description:
      "Founded and ran the fabrication lab at Evangelisches Gymnasium Lippstadt during junior and senior year of high school. The school had five Bambu Lab X1Cs. Everything else I brought in from my own print farm: SLA printers, laser cutters, and additional FDM machines. Mentored 12 students across grades 6 to 10 in 3D printing, CAD, laser cutting, PCB design, and building their own websites. The goal from the start was to train people well enough that the lab wouldn't depend on me, which worked. I handed it off before graduating and haven't been involved since.",
    status: "completed",
    categories: ["Fabrication", "Manufacturing"],
    role: "Founder and Lab Lead",
    timeline: "2022–2024",
    lastUpdated: "2026-03-25",
    featured: false,
    coverImage: "/images/fabrication-lab/fab-lab-students-3d-printers.jpg",
    images: ["/images/fabrication-lab/fab-lab-3d-printer-interior-blue-parts.jpg", "/images/fabrication-lab/fab-lab-3d-printers-room-sign.jpg"],
    challenge:
      "Build a functional makerspace in a school environment and develop students who can work independently, not just follow instructions when I'm present.",
    constraints: [
      "School equipment budget was limited. Most of the hardware came from my own print farm.",
      "Students ranged from grade 6 with no prior experience to grade 10 with some CAD background",
      "Lab needed to run without direct supervision for routine work",
    ],
    designDecisions: [
      "Process documentation written for the youngest students. If a 6th grader can follow it, it's clear enough.",
      "Machine training structured in tiers: supervised, then assisted, then independent, with explicit signed-off checkpoints",
      "CAD curriculum built around actual student projects rather than abstract exercises. Better retention and more useful output.",
    ],
    buildProcess: [
      "Initial equipment setup: 5 Bambu Lab X1Cs from the school plus SLA printers, laser cutters, and FDM machines from my own print farm",
      "Curriculum development for 3D printing, Fusion 360 CAD, laser cutting, PCB design, and web development",
      "Student onboarding and machine certification program",
      "Ongoing: weekly mentoring sessions, equipment maintenance, curriculum updates based on what students actually needed",
    ],
    results:
      "Lab handed over to trained student successors on graduation. 12 students mentored across four grade levels. Multiple projects completed independently before handover. I'm no longer involved.",
    lessons: [
      "Teaching someone to fix a printer jam is more valuable than fixing it for them. The lab scales when students can solve their own problems.",
      "The biggest skill gap is tolerating iteration, not technical ability. Getting students to redesign instead of giving up is most of the work.",
    ],
    highlights: [
      { label: "Students Mentored", value: "12 (grades 6–10)" },
      { label: "Equipment", value: "5 school Bambu X1Cs + personal print farm hardware" },
      { label: "Running Since", value: "2021" },
    ],
    tools: ["Fusion 360", "FDM 3D printing", "SLA printing", "Laser cutting", "KiCad", "Web development"],
    relatedSlugs: ["stratosphere-balloon", "harvard-fabrication"],
  },

  {
    slug: "ml-robotics-elderly",
    title: "ML Robotics for Elderly Assistance",
    subtitle: "Co-authored with Harvard Summer School peers",
    description:
      "A machine learning robotics project co-developed with two Harvard Summer School peers, targeting elderly assistance with daily household tasks. Combined computer vision for object recognition with a task planning and manipulation pipeline. Written up and submitted as a collaborative research project.",
    status: "archived",
    categories: ["Robotics"],
    role: "Co-author",
    timeline: "2023",
    lastUpdated: "2026-03-22",
    featured: false,
    coverImage: "/images/ml-robot/ml-robot-cover.jpg",
    challenge:
      "Build a practical robotic assistance system around the perception and manipulation problems involved in household chores. Tasks that are obvious to humans but poorly specified for robots.",
    constraints: [
      "Three-person team across different backgrounds, which required clear task decomposition and parallel workstreams",
      "Limited physical hardware access. System architecture had to be testable primarily in simulation.",
    ],
    designDecisions: [
      "Vision first: reliable object recognition was the prerequisite for any manipulation pipeline, so perception was developed and validated independently before anything else",
      "Modular architecture separating perception, planning, and actuation. Each layer testable without the full stack running.",
    ],
    buildProcess: [
      "Object detection and classification using trained CNN models",
      "Task planning layer mapping recognized objects and scene state to chore sequences",
      "Manipulation pipeline for common household object interactions",
      "Integration and testing in simulated environment",
    ],
    results: "The project ran for a significant amount of time but didn't reach a working demo.",
    lessons: [
      "Real-world robustness in perception is much harder than benchmark accuracy suggests. Lighting variation alone breaks classifiers that looked solid on test data.",
    ],
    highlights: [
      { label: "Focus", value: "Elderly daily assistance" },
      { label: "Approach", value: "CV + task planning + manipulation" },
      { label: "Team", value: "3 co-authors (Harvard Summer School)" },
    ],
    tools: ["Python", "Computer vision (CNN)", "ROS", "Simulation environment"],
    relatedSlugs: ["robotic-arm", "harvard-fabrication"],
  },

  {
    slug: "harvard-fabrication",
    title: "Harvard Digital Fabrication",
    subtitle: "PHYS-S-12. Full coursework archive.",
    url: "https://tigerstrake.github.io/Digital_Fabrication_Tiger_Strake_phys-s-12/index.html",
    embed: true,
    coverImage: "/images/harvard/harvard-cover.jpg",
    description:
      "PHYS-S-12 at Harvard Summer School: eleven weeks covering laser cutting, CNC milling, casting, microcontroller programming, embedded sensor integration, and machine building, culminating in a modular TVC rocket. Each week is documented with build notes, CAD files, and process photos. The full course site, including week-by-week writeups and the final project breakdown, is embedded below.",
    status: "archived",
    categories: ["Fabrication", "Embedded", "Manufacturing"],
    role: "Student / Builder",
    timeline: "2023",
    lastUpdated: "2026-03-12",
    featured: false,
    challenge:
      "Complete a full fabrication curriculum covering CAD, laser, CNC, casting, electronics, and embedded systems, culminating in an integrated final project under real time pressure.",
    constraints: [
      "Weekly scope limits. Each domain had to be understood fast enough to produce a result.",
      "Chemical propulsion was safety-prohibited. TVC project pivoted to electronics-based stabilization.",
      "Limited equipment access required adapting designs to whatever machines were available on the day",
    ],
    designDecisions: [
      "TVC gimbal used PLA's inherent flexibility as the compliant hinge mechanism. Eliminates the backlash you get from traditional linkages.",
      "Twist-fit modular rocket sections for field assembly without tools",
      "MPU-6050 IMU mounted at rocket base with OLED display for real-time orientation readout during bench testing",
    ],
    buildProcess: [
      "Week 2: Laser-cut press-fit cardboard assembly. Kerf compensation was the key lesson.",
      "Week 3–4: Kinematic sculpture with gear-reduced DC motor and Arduino Uno, later upgraded with herringbone gears from Fusion 360 spur gear add-in",
      "Week 5: TVC mount prototyped on Prusa. First version failed on fit, second version used Polycam photogrammetry for reference geometry.",
      "Week 6: MPU-6050 6-axis IMU calibrated against angle finder, compliant mechanism contact sensor designed for launch detection",
      "Week 7: OLED display on I2C showing live gyro data, oscilloscope characterization of output timing",
      "Week 8: Roland SRM-20 CNC milling in machinable wax. First attempt failed when wax melted onto the end mill due to speed. Surface roughing fixed the adhesion issue.",
      "Week 9: ESP32 ESPnow peer-to-peer communication, both boards exchanging data via MAC address registration",
      "Final: Modular TVC rocket, Bambu Lab 3D printer for final parts, collaborative build with Hiranya",
    ],
    results:
      "Complete coursework documented. TVC rocket final project presented. All weekly builds archived with full process notes.",
    lessons: [
      "CNC setup parameters matter more than the geometry. Losing a wax mold to a spindle speed error is an expensive lesson.",
      "Photogrammetry (Polycam) outperformed the dedicated scanning hardware (RevoPoint) for complex organic geometry",
      "Modular assembly needs to account for cumulative tolerance. A twist-fit that works at the bench can bind in the field.",
    ],
    highlights: [
      { label: "Duration", value: "11 weeks" },
      { label: "Final Project", value: "Modular TVC Rocket" },
      { label: "Institution", value: "Harvard Summer School" },
    ],
    tools: [
      "Fusion 360",
      "Arduino Uno R3",
      "ESP32 (ESPnow)",
      "MPU-6050 IMU",
      "OLED display (I2C)",
      "Roland SRM-20 CNC",
      "Prusa / Bambu Lab 3D printers",
      "Laser cutter",
      "Polycam photogrammetry",
      "Oomoo silicone casting",
    ],
    relatedSlugs: ["rocket-tvc", "smart-light-switch", "fabrication-lab-eg", "ml-robotics-elderly", "dual-enrollment-hsl"],
  },

  {
    slug: "additive-manufacturing-competition",
    coverImage: "/images/am-competition/am-championships-lasertec-cnc-slm-machine.jpg",
    images: ["/images/am-competition/am-championships-slm-metal-printed-parts-benchy.jpg"],
    title: "Additive Manufacturing Competition",
    subtitle: "Competed solo against company-sponsored teams. Won most rounds.",
    description:
      "Competed individually in the 2023 Advanced Additive Manufacturing Competition against teams of three or more people, all of them company-sponsored with dedicated tooling resources. Challenge categories covered SLA, SLS, SLM, and FDM. Tasks ranged from geared mechanisms to pipe manifolds designed for welding to other functional industrial components. Won most of the challenge rounds.",
    status: "archived",
    categories: ["Fabrication", "Manufacturing"],
    role: "Individual Competitor",
    timeline: "2023",
    lastUpdated: "2026-03-25",
    featured: false,
    challenge:
      "Design functional industrial parts across four additive processes, each with different material constraints, tolerances, and post-processing requirements, under competition time pressure and without a team.",
    constraints: [
      "Solo entry against company-sponsored teams of 3 or more with dedicated tooling resources",
      "Each challenge round used a different process. No single design approach carried across all categories.",
      "Parts had to be functional, not just printable: geared mechanisms needed to mesh, pipe manifolds had to survive welding loads",
    ],
    designDecisions: [
      "Prioritized design for the specific process over material optimization. The right geometry for SLS is different from SLM even with similar alloys.",
      "Geared mechanism tolerances tightened beyond default process specs to ensure actual engagement after post-processing shrinkage",
      "Pipe manifold wall thickness and joint geometry driven by weld heat input, not just print geometry",
    ],
    buildProcess: [
      "Challenge brief analysis: identify which process constraints dominated each task",
      "Rapid CAD iteration within competition time limits",
      "Design review against process-specific failure modes before submission",
    ],
    results: "Won most challenge rounds competing solo against company-sponsored teams.",
    lessons: [
      "Additive process selection is a design decision, not a manufacturing detail. Geometry that prints well in FDM can be structurally wrong for the same part in SLM.",
      "Industrial parts competitions care about function, not just print quality. A beautiful SLA part that fails its fit check loses.",
    ],
    highlights: [
      { label: "Year", value: "2023" },
      { label: "Processes", value: "SLA, SLS, SLM, FDM" },
      { label: "Format", value: "Solo vs. company-sponsored teams" },
    ],
    tools: ["Fusion 360", "SLA", "SLS", "SLM", "FDM", "Industrial CAD for additive"],
    relatedSlugs: ["fabrication-lab-eg", "harvard-fabrication", "stratosphere-balloon"],
  },

  {
    slug: "bioengineering-ai-startup",
    title: "Bioengineering & AI Startup",
    subtitle: "Co-founder. AI applications in bioengineering.",
    description:
      "Co-founded a startup exploring applications of AI in bioengineering. Early stage, details not public yet.",
    status: "active",
    categories: ["Biotech"],
    role: "Co-founder",
    timeline: "2025–Present",
    lastUpdated: "2026-03-26",
    featured: false,
    coverImage: "/images/startup/startup-davinci.jpg",
    challenge: "Find where AI creates real value in bioengineering workflows rather than just adding a model layer on top of an existing process.",
    constraints: [
      "Early stage. Scope and focus still being defined.",
    ],
    designDecisions: [],
    buildProcess: [],
    results: "Active. Details not public yet.",
    lessons: [],
    highlights: [
      { label: "Stage", value: "Early / stealth" },
      { label: "Domain", value: "AI + Bioengineering" },
    ],
    tools: [],
    relatedSlugs: [],
  },

  {
    slug: "infinity-studios",
    title: "Short Film Production",
    subtitle: "Co-directed, produced, and edited a short film. Grade 11.",
    description:
      "Co-directed and co-wrote a short film about an abduction with five peers, then handled the full post-production pipeline: VFX sequences including animated vehicles, an original soundtrack, and the final edit. The kind of project where you learn that the gap between what you envisioned and what you can actually pull off in post is mostly a function of how well you planned the shoot.",
    status: "archived",
    categories: ["Media"],
    role: "Co-Director, Executive Producer & Editor",
    timeline: "2022–2023",
    lastUpdated: "2026-03-22",
    featured: false,
    coverImage: "/images/short-film/short-film-cover.png",
    videos: ["/images/short-film/short-film-final.mp4"],
    challenge:
      "Coordinate a six-person production, co-write a coherent script, shoot usable footage, and deliver a finished film with VFX and original music, without a budget or production infrastructure.",
    constraints: [
      "No dedicated equipment. Cameras, lighting, and audio sourced from what was available.",
      "Six-person team meant scheduling and scene logistics had to be tight or shoot days ran long",
      "VFX (animated cars, compositing) done in consumer software with no visual effects background",
    ],
    designDecisions: [
      "Script written scene-by-scene with location and lighting requirements embedded. Easier to schedule and reduces surprises on shoot day.",
      "Original soundtrack composed to fit the edit rather than the reverse. Avoids licensing issues and gets better sync.",
      "VFX kept to shots where they were story-essential rather than decorative. Easier to execute and harder to notice when they don't quite work.",
    ],
    buildProcess: [
      "Pre-production: co-wrote script, built shot list, location scouting, casting within the peer group",
      "Production: co-directed all shoot days, managed blocking and continuity",
      "Post-production: full edit, VFX compositing (vehicle animation), color grade, original soundtrack composition",
    ],
    results: "Film completed and screened. Full production from script to final cut.",
    lessons: [
      "Coverage matters more than any individual shot. Running out of options in the edit is a worse position than running long on set.",
      "Audio is the thing that makes amateur productions feel amateur. Getting it right on set is worth more than any post-production fix.",
    ],
    highlights: [
      { label: "Role", value: "Co-Director, Producer & Editor" },
      { label: "Team", value: "6 people" },
      { label: "VFX", value: "Vehicle animation, compositing" },
    ],
    tools: ["Video editing software", "VFX compositing", "Music composition", "On-set direction"],
    relatedSlugs: [],
  },

  {
    slug: "social-media-manager",
    title: "Social Media: Autohaus Hecker",
    subtitle: "Content producer for a truck dealership. Final Cut, drones, cable cams.",
    description:
      "Produced and edited social media content for Autohaus Hecker, a truck dealership, from 2019 to 2025. Along the way picked up a full production skill set: Final Cut Pro, Photoshop, After Effects, drone operation, gimbal work, audio equipment, cable cams, and suction-mounted cameras on vehicles. It's a real production environment. The truck has to look good moving, not just parked.",
    status: "archived",
    categories: ["Media"],
    role: "Content Producer",
    timeline: "2019–2025",
    lastUpdated: "2026-03-26",
    featured: false,
    coverImage: "/images/social-media-manager/social-media-cover.png",
    videos: [
      "/images/social-media-manager/01_sway_lng_drone_fields.mp4",
      "/images/social-media-manager/02_abroll_overhead_drone.mp4",
      "/images/social-media-manager/03_abroll_hero_angle.mp4",
      "/images/social-media-manager/05_bf4_highway_clean.mp4",
      "/images/social-media-manager/06_bf4_dealership_hero.mp4",
    ],
    challenge:
      "Shoot and edit content that makes heavy trucks look good on social media, with one person handling the full production stack.",
    constraints: [
      "Shooting moving vehicles means coordinating camera mounts, safety, and timing simultaneously",
      "No dedicated crew. Rigging, operating, and editing all handled solo.",
    ],
    designDecisions: [
      "Suction-mounted and cable cam setups for dynamic vehicle shots that can't be done handheld",
      "Gimbal for all handheld work. Stabilized footage is the baseline, not the exception.",
    ],
    buildProcess: [
      "Pre-production: shot planning, camera and rig selection for each shoot type",
      "Production: drone, gimbal, cable cam, suction mount, matched to the shot",
      "Post: Final Cut Pro edit, Photoshop and After Effects for graphics and compositing",
    ],
    results: "Six years of content production. Full production capability built across video, photo, and motion graphics.",
    lessons: [
      "Audio recorded on location with proper equipment saves more time in post than any edit shortcut",
      "Vehicle shoots require more safety planning than you expect. A suction mount failure at speed is a serious problem.",
    ],
    highlights: [
      { label: "Client", value: "Autohaus Hecker" },
      { label: "Running since", value: "2019" },
      { label: "Equipment", value: "Drone, gimbal, cable cam, suction mounts" },
    ],
    tools: ["Final Cut Pro", "Adobe Photoshop", "Adobe After Effects", "Drone", "Gimbal", "Cable cam", "Audio equipment"],
    relatedSlugs: [],
  },

  {
    slug: "dual-enrollment-hsl",
    title: "Junior Studium, Hochschule Hamm-Lippstadt",
    subtitle: "Selective dual enrollment. University-level physics and engineering during high school.",
    description:
      "During high school, I joined the selective Junior Studium program at Hochschule Hamm-Lippstadt. I was only the second student ever from my school to be accepted into the program. I completed university-level courses in mechanics, thermodynamics, atomic physics, electrical engineering, instrumental analytics, and quantum mechanics, sitting the same exams as full-time university students. An early step into the kind of work I enjoy most: technical, demanding, and grounded in understanding how things actually work.",
    status: "completed",
    categories: ["Physics"],
    role: "Junior Studium Student",
    timeline: "2021–2024",
    lastUpdated: "2026-03-28",
    featured: false,
    coverImage: "/images/dual-enrollment/dual-enrollment-cover.png",
    challenge:
      "Pursue technical depth beyond what the high school curriculum offered, in subjects that actually matched where my interests were pointing.",
    constraints: [
      "Selective admission. Only the second student from my school ever accepted.",
      "Exams sat alongside full-time university students, no separate track",
    ],
    designDecisions: [
      "Focused on physics and engineering courses rather than spreading across unrelated subjects. Depth over breadth.",
      "Pursued this alongside a full high school load, which forced real prioritization",
    ],
    buildProcess: [
      "Admitted to the Junior Studium program at the start of grade 9",
      "Completed coursework and university exams across six technical subjects over three years",
      "Passed all exams",
    ],
    results:
      "Completed six university-level courses across theoretical physics and applied engineering. Built early technical depth in areas that directly inform the hardware and aerospace work I do now.",
    lessons: [
      "University physics has a different standard than school physics. Showing your working matters as much as getting the right answer.",
      "Quantum mechanics at 15 is hard. It is also exactly the kind of thing worth doing early if you want to build intuition for it later.",
    ],
    highlights: [
      { label: "Institution", value: "Hochschule Hamm-Lippstadt" },
      { label: "Program", value: "Junior Studium (selective)" },
      { label: "Duration", value: "2021–2024" },
      { label: "Courses", value: "6 university-level" },
    ],
    tools: [
      "Physics Mechanics",
      "Thermodynamics",
      "Atomic Physics",
      "Electrical Engineering",
      "Instrumental Analytics",
      "Quantum Mechanics",
    ],
    relatedSlugs: ["harvard-fabrication", "fabrication-lab-eg"],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
