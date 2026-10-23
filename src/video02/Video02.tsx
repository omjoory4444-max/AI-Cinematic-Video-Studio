import React from "react";
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";
import {Background} from "../components/Background";
import {FONT} from "../fonts";
import {BAR, colors} from "../theme";
import {CAPTIONS, NARRATION, SCENES, SceneId, TOTAL_FRAMES} from "./config";
import {
  ClosingScene,
  ComparisonScene,
  ImpactScene,
  InterfaceScene,
  InterventionsScene,
  JourneysScene,
  StagesScene,
  TitleScene,
} from "./scenes";

const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  title: TitleScene,
  interface: InterfaceScene,
  stages: StagesScene,
  interventions: InterventionsScene,
  comparison: ComparisonScene,
  impact: ImpactScene,
  journeys: JourneysScene,
  closing: ClosingScene,
};

const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  // The title and closing scenes already show the spoken words as large on-screen text.
  const quiet = SCENES.filter((sc) => sc.id === "title" || sc.id === "closing").some(
    (sc) => frame >= sc.from && frame < sc.from + sc.frames,
  );
  const active = quiet ? undefined : CAPTIONS.find((c) => frame >= c.from && frame < c.to);
  if (!active) {
    return null;
  }
  const o = interpolate(frame, [active.from, active.from + 6, active.to - 5, active.to], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{position: "absolute", left: 0, right: 0, bottom: BAR + 14, display: "flex", justifyContent: "center", opacity: o}}>
      <div
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 44,
          lineHeight: 1.3,
          color: colors.ivory,
          padding: "6px 34px 10px",
          borderRadius: 20,
          background: "rgba(6,11,33,0.78)",
          border: `1px solid ${colors.pink400}44`,
        }}
      >
        {active.text}
      </div>
    </div>
  );
};

const musicVolume = (frame: number): number => {
  const fadeIn = interpolate(frame, [0, 45], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const fadeOut = interpolate(frame, [TOTAL_FRAMES - 90, TOTAL_FRAMES], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  let level = 0.34;
  if (NARRATION.enabled) {
    const a = NARRATION.fromFrame;
    const b = NARRATION.fromFrame + NARRATION.frames;
    const duck = interpolate(frame, [a - 15, a + 5, b - 5, b + 30], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    level = 0.34 - 0.2 * duck; // 0.34 alone, 0.14 under the narrator
  }
  return level * fadeIn * fadeOut;
};

/** Video 02: «منصة الدعم التعليمي المكثف» from the real platform screenshots. 1920×1080, 30 fps, RTL. */
export const PlatformShowcaseVideo: React.FC = () => (
  <AbsoluteFill dir="rtl" lang="ar">
    <Background />
    {SCENES.map((scene) => {
      const Scene = SCENE_COMPONENTS[scene.id];
      return (
        <Sequence key={scene.id} from={scene.from} durationInFrames={scene.frames} name={scene.id}>
          <Scene />
        </Sequence>
      );
    })}
    <Subtitles />
    <Audio src={staticFile("audio/music/background.mp3")} loop volume={musicVolume} />
    {NARRATION.enabled ? (
      <Sequence from={NARRATION.fromFrame} durationInFrames={NARRATION.frames + 15}>
        <Audio src={staticFile(NARRATION.file)} volume={1} />
      </Sequence>
    ) : null}
  </AbsoluteFill>
);
