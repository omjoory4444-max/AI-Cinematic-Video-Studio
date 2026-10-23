import React from "react";
import {Audio, Sequence, interpolate, staticFile} from "remotion";
import {LEAD_FRAMES, SCENES, TOTAL_FRAMES, audioManifest, getAbsoluteVoiceWindows, getVoice} from "../data/timeline";

const MUSIC_BASE = 0.5; // music level when nothing is spoken
const MUSIC_DUCK = 0.3; // fraction of the base level kept while the narrator speaks

/** Music volume at an absolute frame: fade in/out + automatic ducking under the voice. */
const musicVolume = (frame: number, windows: Array<{start: number; end: number}>): number => {
  const fadeIn = interpolate(frame, [0, 45], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const fadeOut = interpolate(frame, [TOTAL_FRAMES - 75, TOTAL_FRAMES], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let duck = 1; // 1 = full music, 0 = fully ducked
  for (const w of windows) {
    const d = interpolate(frame, [w.start - 12, w.start, w.end, w.end + 20], [1, 0, 0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    duck = Math.min(duck, d);
  }

  return MUSIC_BASE * fadeIn * fadeOut * (MUSIC_DUCK + (1 - MUSIC_DUCK) * duck);
};

/** Voiceover clips (one per scene, placed after a short lead-in) + background music. */
export const AudioTracks: React.FC = () => {
  const windows = getAbsoluteVoiceWindows();

  return (
    <>
      {audioManifest.music.enabled ? (
        <Audio src={staticFile(audioManifest.music.file)} loop volume={(f) => musicVolume(f, windows)} />
      ) : null}

      {SCENES.map((scene) => {
        const voice = getVoice(scene.id);
        if (!voice) {
          return null;
        }
        return (
          <Sequence key={scene.id} from={scene.from + LEAD_FRAMES} durationInFrames={scene.frames - LEAD_FRAMES}>
            <Audio src={staticFile(voice.file)} volume={1} />
          </Sequence>
        );
      })}
    </>
  );
};
