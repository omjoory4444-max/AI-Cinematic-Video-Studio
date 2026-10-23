import React from "react";
import {Composition} from "remotion";
import {TOTAL_FRAMES} from "./data/timeline";
import {VIDEO} from "./theme";
import {IntensiveSupportVideo} from "./Video";
import {TOTAL_FRAMES as TOTAL_FRAMES_02} from "./video02/config";
import {PlatformShowcaseVideo} from "./video02/Video02";

export const RemotionRoot: React.FC = () => (
  <>
    {/* 60 s · 1920×1080 (1080p) · 30 fps */}
    <Composition
      id="IntensiveSupport"
      component={IntensiveSupportVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    {/* Video 02 · platform screenshots · 56 s */}
    <Composition
      id="PlatformShowcase"
      component={PlatformShowcaseVideo}
      durationInFrames={TOTAL_FRAMES_02}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
  </>
);
