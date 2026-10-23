import {Easing, interpolate} from "remotion";

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** 0 → 1 progress that starts at `delay` and lasts `duration` frames. */
export const reveal = (frame: number, delay: number, duration = 24): number =>
  interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

/** Gentle continuous floating motion (px), deterministic per frame. */
export const float = (frame: number, seed = 0, amplitude = 8, period = 120): number =>
  Math.sin(((frame + seed * 17) / period) * Math.PI * 2) * amplitude;
