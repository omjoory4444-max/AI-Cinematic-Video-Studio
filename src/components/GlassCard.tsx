import React from "react";
import {colors} from "../theme";

type Props = {
  children: React.ReactNode;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  accent?: string;
};

/** Translucent navy card with a dusty-pink hairline (no backdrop blur, so renders stay fast). */
export const GlassCard: React.FC<Props> = ({children, width, height, style, accent = colors.pink400}) => (
  <div
    dir="rtl"
    style={{
      width,
      height,
      boxSizing: "border-box",
      borderRadius: 36,
      padding: 40,
      background: `linear-gradient(160deg, ${colors.navy700}E6 0%, ${colors.navy800}D9 100%)`,
      border: `1.5px solid ${accent}55`,
      boxShadow: `0 30px 80px rgba(2,4,14,0.55), inset 0 1px 0 ${accent}33`,
      direction: "rtl",
      ...style,
    }}
  >
    {children}
  </div>
);
