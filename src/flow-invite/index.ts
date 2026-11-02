import React from "react";
import {Composition, registerRoot} from "remotion";
import {FLOW_FPS, FLOW_FRAMES, FlowInvite} from "./FlowInvite";

// Stand-alone entry point for the Google Flow invitation (no other compositions or remote fonts).
const Root: React.FC = () =>
  React.createElement(Composition, {
    id: "GoogleFlowInvite",
    component: FlowInvite,
    durationInFrames: FLOW_FRAMES,
    fps: FLOW_FPS,
    width: 1920,
    height: 1080,
  });

registerRoot(Root);
