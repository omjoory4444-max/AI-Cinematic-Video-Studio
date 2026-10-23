import content from "../../content/video-01.json";
import audioManifestRaw from "../../public/audio/manifest.json";
import {VIDEO} from "../theme";

export type SceneId = "hook" | "challenge" | "intro" | "how" | "progress" | "impact" | "outro";

export type SceneDef = {
  id: SceneId;
  seconds: number;
  narration: string;
  captions: string[];
};

export type AudioManifest = {
  voiceover: {
    enabled: boolean;
    engine: string | null;
    voice: string | null;
    scenes: Record<string, {file: string; durationSec: number}>;
  };
  music: {
    enabled: boolean;
    file: string;
    license: string | null;
  };
};

export const audioManifest = audioManifestRaw as unknown as AudioManifest;

const FPS = VIDEO.fps;
const LEAD_FRAMES = Math.round(content.voiceLeadSeconds * FPS);
const TAIL_FRAMES = Math.round(content.voiceTailSeconds * FPS);

export const SCENES: ReadonlyArray<SceneDef & {from: number; frames: number}> = (() => {
  let cursor = 0;
  return (content.scenes as SceneDef[]).map((scene) => {
    const frames = Math.round(scene.seconds * FPS);
    const entry = {...scene, from: cursor, frames};
    cursor += frames;
    return entry;
  });
})();

export const TOTAL_FRAMES = SCENES.reduce((sum, scene) => sum + scene.frames, 0);

export type SceneTiming = (typeof SCENES)[number];

export const getScene = (id: SceneId): SceneTiming => {
  const scene = SCENES.find((s) => s.id === id);
  if (!scene) {
    throw new Error(`Unknown scene: ${id}`);
  }
  return scene;
};

/** Voice file info for a scene (null when no voiceover has been generated). */
export const getVoice = (id: SceneId) => {
  if (!audioManifest.voiceover.enabled) {
    return null;
  }
  return audioManifest.voiceover.scenes[id] ?? null;
};

/** Frame (local to the scene) where the voice starts and ends. */
export const getVoiceWindowLocal = (id: SceneId): {start: number; end: number} => {
  const scene = getScene(id);
  const voice = getVoice(id);
  const start = LEAD_FRAMES;
  const planned = scene.frames - LEAD_FRAMES - TAIL_FRAMES;
  const length = voice ? Math.min(Math.round(voice.durationSec * FPS), planned) : planned;
  return {start, end: start + length};
};

export type ChunkTiming = {text: string; start: number; end: number};

/**
 * Splits the scene's voice window across caption chunks, proportionally to
 * their character count. Used both for burned-in subtitles and to trigger
 * visuals in sync with what the narrator is saying (frames are local to the scene).
 */
export const getChunkTimings = (id: SceneId): ChunkTiming[] => {
  const scene = getScene(id);
  const {start, end} = getVoiceWindowLocal(id);
  const total = scene.captions.reduce((sum, c) => sum + c.length, 0) || 1;
  let cursor = start;
  return scene.captions.map((text, index) => {
    const isLast = index === scene.captions.length - 1;
    const length = Math.round(((end - start) * text.length) / total);
    const chunkStart = cursor;
    const chunkEnd = isLast ? end : cursor + length;
    cursor = chunkEnd;
    return {text, start: chunkStart, end: chunkEnd};
  });
};

/** Absolute voice windows (whole video), used to duck the music under the narration. */
export const getAbsoluteVoiceWindows = (): Array<{start: number; end: number}> =>
  SCENES.filter((scene) => getVoice(scene.id) !== null).map((scene) => {
    const w = getVoiceWindowLocal(scene.id);
    return {start: scene.from + w.start, end: scene.from + w.end};
  });

export {LEAD_FRAMES};
