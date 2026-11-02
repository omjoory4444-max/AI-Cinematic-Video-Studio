import React from "react";
import {Composition, registerRoot} from "remotion";
import {FLOW_FPS, FLOW_FRAMES, FlowInvite} from "./FlowInvite";
import {FlowInviteVertical, V_FPS, V_FRAMES} from "./FlowInviteVertical";

// Stand-alone entry point for the Google Flow invitation (no other compositions or remote fonts).
const Root: React.FC = () =>
  React.createElement(
    React.Fragment,
    null,
    React.createElement(Composition, {
      id: "GoogleFlowInvite",
      component: FlowInvite,
      durationInFrames: FLOW_FRAMES,
      fps: FLOW_FPS,
      width: 1920,
      height: 1080,
    }),
    // Portrait 9:16 edition for phones
    React.createElement(Composition, {
      id: "GoogleFlowInviteVertical",
      component: FlowInviteVertical,
      durationInFrames: V_FRAMES,
      fps: V_FPS,
      width: 1080,
      height: 1920,
    }),
  );

registerRoot(Root);
