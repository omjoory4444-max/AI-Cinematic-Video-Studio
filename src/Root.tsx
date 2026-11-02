import React from "react";
import {Composition} from "remotion";
import {TOTAL_FRAMES} from "./data/timeline";
import {VIDEO} from "./theme";
import {IntensiveSupportVideo} from "./Video";
import {FLOW_FPS, FLOW_FRAMES, FlowInvite} from "./flow-invite/FlowInvite";

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
    {/* 30 s · 1920×1080 · 30 fps — Google Flow workshop invitation */}
    <Composition
      id="GoogleFlowInvite"
      component={FlowInvite}
      durationInFrames={FLOW_FRAMES}
      fps={FLOW_FPS}
      width={1920}
      height={1080}
    />
  </>
);
