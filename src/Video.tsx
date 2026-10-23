import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {AudioTracks} from "./components/AudioTracks";
import {Background} from "./components/Background";
import {Captions} from "./components/Captions";
import {SCENES, SceneId} from "./data/timeline";
import {ChallengeScene} from "./scenes/ChallengeScene";
import {HookScene} from "./scenes/HookScene";
import {HowScene} from "./scenes/HowScene";
import {ImpactScene} from "./scenes/ImpactScene";
import {IntroScene} from "./scenes/IntroScene";
import {OutroScene} from "./scenes/OutroScene";
import {ProgressScene} from "./scenes/ProgressScene";

const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  hook: HookScene,
  challenge: ChallengeScene,
  intro: IntroScene,
  how: HowScene,
  progress: ProgressScene,
  impact: ImpactScene,
  outro: OutroScene,
};

/** Video 01: «منصة الدعم التعليمي المكثف» (60 s, 1920×1080, 30 fps, RTL). */
export const IntensiveSupportVideo: React.FC = () => (
  <AbsoluteFill dir="rtl" lang="ar">
    <Background />

    {SCENES.map((scene) => {
      const SceneComponent = SCENE_COMPONENTS[scene.id];
      return (
        <Sequence key={scene.id} from={scene.from} durationInFrames={scene.frames} name={scene.id}>
          <SceneComponent />
        </Sequence>
      );
    })}

    <Captions />
    <AudioTracks />
  </AbsoluteFill>
);
