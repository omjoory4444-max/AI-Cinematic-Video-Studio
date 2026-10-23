import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {BAR} from "../theme";
import {easeInOut} from "../lib/anim";

type Props = {
  frames: number;
  children: React.ReactNode;
  fade?: number;
};

/**
 * Wraps every scene: RTL layout, safe area inside the letterbox bars,
 * a soft fade in/out and a slow "camera push-in".
 */
export const SceneFrame: React.FC<Props> = ({frames, children, fade = 12}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, fade, frames - fade, frames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, frames], [1, 1.035], {easing: easeInOut});

  return (
    <AbsoluteFill
      dir="rtl"
      lang="ar"
      style={{
        opacity,
        transform: `scale(${scale})`,
        direction: "rtl",
        textAlign: "center",
        paddingTop: BAR + 40,
        paddingBottom: BAR + 150,
        paddingInline: 140,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
