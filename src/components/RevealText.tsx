import React from "react";
import {useCurrentFrame} from "remotion";
import {FONT} from "../fonts";
import {colors} from "../theme";
import {reveal} from "../lib/anim";

type Props = {
  text: string;
  delay?: number;
  size?: number;
  weight?: 400 | 600 | 700 | 900;
  color?: string;
  stagger?: number;
  lineHeight?: number;
};

/**
 * Word-by-word reveal. Words (not letters) are animated so Arabic letter
 * joining is never broken. In an RTL container the first word appears on the right.
 */
export const RevealText: React.FC<Props> = ({
  text,
  delay = 0,
  size = 96,
  weight = 900,
  color = colors.ivory,
  stagger = 5,
  lineHeight = 1.35,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(" ").filter(Boolean);

  return (
    <div
      dir="rtl"
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: size * 0.28,
        direction: "rtl",
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        lineHeight,
        color,
      }}
    >
      {words.map((word, i) => {
        const p = reveal(frame, delay + i * stagger, 22);
        return (
          <span
            key={`${word}-${i}`}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${(1 - p) * 38}px)`,
              filter: `blur(${(1 - p) * 10}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
