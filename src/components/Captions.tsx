import React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {FONT} from "../fonts";
import {BAR, colors} from "../theme";
import {SCENES, getChunkTimings} from "../data/timeline";

/** Burned-in Arabic subtitles, timed to the narration window of each scene. */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();

  const active = SCENES.flatMap((scene) =>
    getChunkTimings(scene.id).map((chunk) => ({
      text: chunk.text,
      start: scene.from + chunk.start,
      end: scene.from + chunk.end,
    })),
  ).find((chunk) => frame >= chunk.start && frame < chunk.end);

  if (!active) {
    return null;
  }

  const opacity = interpolate(frame, [active.start, active.start + 7, active.end - 6, active.end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lift = interpolate(frame, [active.start, active.start + 9], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      dir="rtl"
      lang="ar"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: BAR + 46,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${lift}px)`,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 50,
          lineHeight: 1.4,
          color: colors.ivory,
          padding: "10px 38px 14px",
          borderRadius: 22,
          background: "rgba(6,11,33,0.72)",
          border: `1px solid ${colors.pink400}44`,
          direction: "rtl",
        }}
      >
        {active.text}
      </div>
    </div>
  );
};
