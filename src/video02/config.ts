import content from "../../content/video-02.json";

export const FPS = 30;

export type SceneId =
  | "title"
  | "interface"
  | "stages"
  | "interventions"
  | "comparison"
  | "impact"
  | "journeys"
  | "closing";

export const TOTAL_FRAMES = Math.round(content.totalSeconds * FPS);

export const SCENES = content.scenes.map((s) => ({
  id: s.id as SceneId,
  from: Math.round(s.start * FPS),
  frames: Math.round((s.end - s.start) * FPS),
}));

export const CAPTIONS = content.captions.map((c) => ({
  text: c.text,
  from: Math.round(c.start * FPS),
  to: Math.round(c.end * FPS),
}));

export const NARRATION = {
  enabled: content.narration.enabled,
  file: content.narration.file,
  fromFrame: Math.round(content.narration.startSec * FPS),
  frames: Math.round(content.narration.durationSec * FPS),
};

export const getScene = (id: SceneId) => {
  const scene = SCENES.find((s) => s.id === id);
  if (!scene) {
    throw new Error(`Unknown scene: ${id}`);
  }
  return scene;
};

// Platform palette, sampled from the screenshots so the original look is preserved.
export const P = {
  cream: "#F5F0EA",
  creamDeep: "#ECE4DA",
  navy: "#202A4D",
  navyDeep: "#0C1431",
  pink: "#C18A91",
  pinkSoft: "#E8CDD1",
  blue: "#4274D0",
  green: "#4E9F7D",
  ink: "#2A2F45",
  dim: "#6D7188",
} as const;

/** Real screenshots of the platform (public/images/platform). */
export const IMAGES = {
  home: {file: "images/platform/p01-home.jpg", w: 1284, h: 2007},
  compare: {file: "images/platform/p02-compare-stages.jpg", w: 1284, h: 1998},
  interventions: {file: "images/platform/p03-interventions.jpg", w: 1284, h: 2122},
  progress: {file: "images/platform/p04-progress-chart.jpg", w: 1284, h: 1198},
  classBars: {file: "images/platform/p05-class-bars.jpg", w: 1284, h: 966},
  impact1: {file: "images/platform/p06-impact-1.jpg", w: 1284, h: 1702},
  allImproved: {file: "images/platform/p07a-all-improved.jpg", w: 640, h: 1060},
  roster1: {file: "images/platform/p08-roster-1.jpg", w: 1284, h: 2117},
  followUp: {file: "images/platform/p10-follow-up.jpg", w: 1284, h: 2237},
} as const;

export type ImageKey = keyof typeof IMAGES;
