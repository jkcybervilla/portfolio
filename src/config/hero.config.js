export const HERO_CONFIG = {
  // Background — swap this one value to change bg later
  background: {
    type: "particles",   // "particles" | "color" | "image" | "video"
    color: "#0a0a0f",    // used as canvas clear color + page bg
  },

  // Brand
  brand: {
    companyName: "MY PORTFOLIO",
    tagline: "Precision at Every Span",
    accentColor: "#d4af37",
    textColor: "#ffffff",
  },

  // Particle network
  particles: {
    desktop: { count: 120, lineThreshold: 1.8 },
    mobile:  { count: 80,  lineThreshold: 1.5 },
    color: "#d4af37",
    pointSize: 0.03,
    lineOpacity: 0.15,
    pointOpacity: 0.8,
  },

  // Scroll
  scroll: {
    desktopPinDistance: 7000,
    mobilePinDistance: 4500,
    cameraStart: 5,
    cameraEnd: 2,
    rotationY: Math.PI * 0.5,
  },

  // Stages
  stages: [
    {
      id: "SECTION-1",
      title: "SECTION-1",
      description: "Deep excavation, stub setting, and concrete foundation for lattice towers across all terrain types.",
      range: [0, 0.25],
    },
    {
      id: "SECTION-2",
      title: "SECTION-2",
      description: "Precision assembly and erection of high-voltage transmission towers up to 765kV.",
      range: [0.25, 0.5],
    },
    {
      id: "SECTION-3",
      title: "SECTION-3",
      description: "Conductor stringing, tensioning, and OPGW installation with full sagging compliance.",
      range: [0.5, 0.75],
    },
    {
      id: "SECTION-4",
      title: "SECTION-4",
      description: "Skilled site engineers, trained linemen, and end-to-end project execution teams.",
      range: [0.75, 1.01],
    },
  ],
}