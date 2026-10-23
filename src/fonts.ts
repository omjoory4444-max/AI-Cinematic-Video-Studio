import {loadFont} from "@remotion/google-fonts/Cairo";

// Cairo (SIL Open Font License) covers Arabic + Latin and is free to use.
const {fontFamily} = loadFont("normal", {
  weights: ["400", "600", "700", "900"],
  subsets: ["arabic", "latin"],
});

export const FONT = fontFamily;
