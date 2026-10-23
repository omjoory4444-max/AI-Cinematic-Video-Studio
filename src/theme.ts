// Palette: deep navy (كحلي) + dusty pink (وردي غباري)
export const colors = {
  navy950: "#060B21",
  navy900: "#0A1330",
  navy800: "#0F1B44",
  navy700: "#16255A",
  navy600: "#1F3278",
  pink200: "#F1DCE3",
  pink300: "#E6BCC9",
  pink400: "#D9A5B3",
  pink500: "#C98B9E",
  pink600: "#A96C80",
  ivory: "#F8F2F5",
  textDim: "#B7BFDD",
} as const;

export const VIDEO = {
  fps: 30,
  width: 1920,
  height: 1080,
} as const;

// Cinematic letterbox bar height (px) at the top and bottom of the frame.
export const BAR = 54;

export const brand = {
  platformAr: "منصة الدعم التعليمي المكثف",
  platformEn: "Intensive Learning Support",
  // Personal brand lockup (text only; no student data or photos anywhere in this repo).
  signatureAr: "نهى",
  signatureEn: "English Teacher",
} as const;
