import React from "react";

export type IconName = "layers" | "clock" | "eye" | "search" | "plan" | "bolt" | "chart" | "check" | "spark";

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

/** Small hand-drawn stroke icon set (original shapes, no external assets). */
export const Icon: React.FC<Props> = ({name, size = 64, color = "currentColor", strokeWidth = 2.2}) => {
  const common = {
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const content = (() => {
    switch (name) {
      case "layers":
        return (
          <>
            <path d="M12 3 3 8l9 5 9-5-9-5Z" {...common} />
            <path d="m3 12 9 5 9-5" {...common} />
            <path d="m3 16 9 5 9-5" {...common} />
          </>
        );
      case "clock":
        return (
          <>
            <circle cx="12" cy="12" r="9" {...common} />
            <path d="M12 7v5l3.5 2" {...common} />
          </>
        );
      case "eye":
        return (
          <>
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" {...common} />
            <circle cx="12" cy="12" r="3" {...common} />
          </>
        );
      case "search":
        return (
          <>
            <circle cx="10.5" cy="10.5" r="6.5" {...common} />
            <path d="m20 20-4.8-4.8" {...common} />
          </>
        );
      case "plan":
        return (
          <>
            <rect x="5" y="4" width="14" height="17" rx="2.5" {...common} />
            <path d="M9 4V3h6v1" {...common} />
            <path d="m8.5 11 1.6 1.6L13 9.8" {...common} />
            <path d="M8.5 16.5h7" {...common} />
          </>
        );
      case "bolt":
        return <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12.5L13 2Z" {...common} />;
      case "chart":
        return (
          <>
            <path d="M4 20V4" {...common} />
            <path d="M4 20h16" {...common} />
            <path d="M8 16v-4M12.5 16V9M17 16V6" {...common} />
          </>
        );
      case "check":
        return (
          <>
            <circle cx="12" cy="12" r="9" {...common} />
            <path d="m8 12.3 2.8 2.8L16.2 9.5" {...common} />
          </>
        );
      case "spark":
        return <path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z" {...common} />;
      default:
        return null;
    }
  })();

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      {content}
    </svg>
  );
};
