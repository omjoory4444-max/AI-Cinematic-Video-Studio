import {continueRender, delayRender, staticFile} from "remotion";

// Fonts are bundled in public/flow-invite/fonts (all SIL Open Font License, from Google Fonts),
// so rendering works offline and doesn't depend on fonts.gstatic.com.
const FACES: Array<{family: string; file: string; weight: string}> = [
  {family: "FlowMessiri", file: "ElMessiri-arabic.woff2", weight: "400 700"},
  {family: "FlowMessiri", file: "ElMessiri-latin.woff2", weight: "400 700"},
  {family: "FlowRuqaa", file: "ArefRuqaa-400-arabic.woff2", weight: "400"},
  {family: "FlowRuqaa", file: "ArefRuqaa-700-arabic.woff2", weight: "700"},
  {family: "FlowMontserrat", file: "Montserrat-latin.woff2", weight: "100 900"},
];

export const MESSIRI = "FlowMessiri, serif";
export const RUQAA = "FlowRuqaa, serif";
export const MONT = "FlowMontserrat, sans-serif";

if (typeof document !== "undefined") {
  const handle = delayRender("Loading Google Flow invite fonts");
  Promise.all(
    FACES.map((f) => {
      const face = new FontFace(f.family, `url(${staticFile(`flow-invite/fonts/${f.file}`)}) format("woff2")`, {weight: f.weight});
      return face.load().then((loaded) => document.fonts.add(loaded));
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
}
