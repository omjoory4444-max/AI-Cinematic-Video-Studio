import React from "react";
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, random, staticFile, useCurrentFrame} from "remotion";
import {MESSIRI, MONT, RUQAA} from "./fonts";

/* ------------------------------------------------------------------------------------------
 * Portrait (9:16) edition of the Google Flow invitation, for phones.
 * Same story and visual identity as FlowInvite.tsx, recomposed for 1080×1920, plus a new
 * ending: school logo → principal → "إعداد وتنفيذ" gold signature.
 * Frame numbers follow the measured voiceover timings (voice starts at VO_OFFSET).
 * ---------------------------------------------------------------------------------------- */

export const V_FPS = 30;
export const V_FRAMES = 1040; // ≈ 34.7 s
const W = 1080;
const H = 1920;
const VO_OFFSET = 45;

const C = {
  ink: "#03040B",
  cyan: "#5CE1FF",
  violet: "#8B5CF6",
  magenta: "#D946EF",
  gold: "#E9C77B",
  goldDeep: "#B8893A",
  goldLight: "#FFF1C9",
  ivory: "#F7F3EA",
};

const PORTAL = {x: 540, y: 760};

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const easeIO = Easing.bezier(0.65, 0, 0.35, 1);
const ip = (f: number, i: number[], o: number[], e: (t: number) => number = (t) => t) =>
  interpolate(f, i, o, {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e});

const camPush = (f: number) => ip(f, [0, 150, 200, 238], [1.0, 1.12, 1.5, 4.4], easeIO);

/* ---------------------------------- shared atmosphere ---------------------------------- */

const DUST = Array.from({length: 150}, (_, i) => ({
  x: random(`vdx${i}`) * W,
  y: random(`vdy${i}`) * H,
  r: 0.7 + random(`vdr${i}`) * 2.6,
  sp: 0.15 + random(`vds${i}`) * 0.6,
  ph: random(`vdp${i}`) * Math.PI * 2,
}));

const Atmosphere: React.FC<{frame: number}> = ({frame}) => {
  const goldMix = ip(frame, [620, 700], [0, 1]);
  const bright = ip(frame, [0, 40, 110, 230, 620, 700], [0.15, 0.35, 0.45, 0.9, 0.6, 0.9]);
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <svg width={W} height={H}>
        {DUST.map((d, i) => {
          const y = (d.y - frame * d.sp * 1.4 + H * 4) % H;
          const x = d.x + Math.sin(frame / 40 + d.ph) * 14;
          const tw = 0.45 + 0.55 * Math.sin(frame / 18 + d.ph);
          const col = i % 3 === 0 ? (goldMix > 0.5 ? C.goldLight : C.cyan) : goldMix > 0.5 ? C.gold : "#9FB4FF";
          return <circle key={i} cx={x} cy={y} r={d.r * (1 + goldMix * 0.5)} fill={col} opacity={tw * bright * 0.55} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

const Grain: React.FC<{frame: number}> = ({frame}) => (
  <AbsoluteFill style={{opacity: 0.08, mixBlendMode: "overlay", pointerEvents: "none"}}>
    <svg width={W} height={H}>
      <filter id="vgrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 24} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={W} height={H} filter="url(#vgrain)" />
    </svg>
  </AbsoluteFill>
);

/* --------------------------------------- Classroom --------------------------------------- */

const Desk: React.FC<{x: number; y: number; s: number; rim: number}> = ({x, y, s, rim}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-46} y={-118} width={92} height={60} rx={8} fill="#0B0F1F" stroke={C.cyan} strokeOpacity={rim * 0.35} />
    <polygon points="-120,-40 120,-40 140,0 -140,0" fill="#10162B" stroke={C.cyan} strokeOpacity={rim * 0.6} strokeWidth={2} />
    <rect x={-132} y={0} width={264} height={14} fill="#0A0E1D" />
    <rect x={-120} y={14} width={10} height={86} fill="#080B17" />
    <rect x={110} y={14} width={10} height={86} fill="#080B17" />
    <polygon points="-40,-34 20,-34 26,-24 -34,-24" fill="#1B2240" stroke={C.gold} strokeOpacity={rim * 0.4} />
  </g>
);

const Classroom: React.FC<{frame: number}> = ({frame}) => {
  const push = camPush(frame);
  const fadeIn = ip(frame, [0, 40], [0, 1]);
  const lightUp = ip(frame, [100, 170], [0, 1]);
  const out = ip(frame, [222, 240], [1, 0]);
  const desks: Array<[number, number, number]> = [
    [330, 1250, 0.62], [750, 1250, 0.62],
    [250, 1450, 0.9], [830, 1450, 0.9],
    [150, 1730, 1.25], [930, 1730, 1.25],
  ];
  return (
    <AbsoluteFill style={{opacity: fadeIn * out, transform: `scale(${push})`, transformOrigin: `${PORTAL.x}px ${PORTAL.y}px`}}>
      <svg width={W} height={H}>
        <defs>
          <linearGradient id="vwall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#05070F" />
            <stop offset="1" stopColor="#0B1024" />
          </linearGradient>
          <linearGradient id="vfloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0A0E20" />
            <stop offset="1" stopColor="#03050C" />
          </linearGradient>
          <linearGradient id="vmoon" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9DB7FF" stopOpacity={0.22} />
            <stop offset="1" stopColor="#9DB7FF" stopOpacity={0} />
          </linearGradient>
          <radialGradient id="vportalLight" cx={PORTAL.x} cy={PORTAL.y} r={1100} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={C.cyan} stopOpacity={0.55} />
            <stop offset="0.35" stopColor={C.violet} stopOpacity={0.22} />
            <stop offset="1" stopColor={C.violet} stopOpacity={0} />
          </radialGradient>
          <clipPath id="vfloorClip">
            <rect y={1100} width={W} height={H - 1100} />
          </clipPath>
        </defs>
        <rect width={W} height={1100} fill="url(#vwall)" />
        <rect y={1100} width={W} height={H - 1100} fill="url(#vfloor)" />
        <g clipPath="url(#vfloorClip)">
          {Array.from({length: 13}, (_, i) => (
            <line key={i} x1={540} y1={820} x2={-900 + i * 240} y2={H} stroke="#1A2246" strokeOpacity={0.35} />
          ))}
        </g>
        <rect y={1096} width={W} height={6} fill="#0E1430" />
        {/* window with moonlight */}
        <rect x={70} y={170} width={230} height={300} fill="#0B1533" stroke="#1C2650" strokeWidth={10} />
        <line x1={185} y1={170} x2={185} y2={470} stroke="#1C2650" strokeWidth={8} />
        <line x1={70} y1={320} x2={300} y2={320} stroke="#1C2650" strokeWidth={8} />
        <circle cx={250} cy={220} r={24} fill="#DCE6FF" opacity={0.5} />
        <polygon points="70,170 300,170 900,1920 260,1920" fill="url(#vmoon)" opacity={0.75 - lightUp * 0.4} />
        {/* wall clock */}
        <g transform="translate(900 300)">
          <circle r={50} fill="#0C1128" stroke="#252F5C" strokeWidth={6} />
          <line x1={0} y1={0} x2={0} y2={-30} stroke="#3A4680" strokeWidth={4} />
          <line x1={0} y1={0} x2={22} y2={6} stroke="#3A4680" strokeWidth={4} />
        </g>
        {/* chalkboard */}
        <rect x={110} y={560} width={860} height={420} rx={6} fill="#2A1F17" />
        <rect x={126} y={576} width={828} height={388} fill="#0C1A17" />
        <g stroke="#CFE3DA" strokeOpacity={0.16} strokeWidth={3} fill="none" strokeLinecap="round">
          <text x={170} y={650} fill="#CFE3DA" fillOpacity={0.16} stroke="none" fontFamily={MONT} fontSize={44} fontWeight={300}>
            Hello, class!
          </text>
          <path d="M170 690 q40 -18 80 0 t80 0 t80 0" />
          <path d="M760 880 l50 -50 l35 35 l55 -80" />
        </g>
        <rect x={110} y={975} width={860} height={12} fill="#2A1F17" />
        <rect width={W} height={H} fill="url(#vportalLight)" opacity={lightUp} style={{mixBlendMode: "screen"}} />
        {desks.map(([x, y, s], i) => (
          <Desk key={i} x={x} y={y} s={s} rim={lightUp * (1 - s * 0.3)} />
        ))}
      </svg>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,${0.55 - lightUp * 0.25}) 55%, rgba(0,0,0,0.92) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------------- Portal ring ------------------------------------- */

const portalRadius = (f: number) =>
  f < 112 ? 0 : f < 150 ? ip(f, [112, 150], [0, 140], ease) : f < 205 ? ip(f, [150, 205], [140, 200]) : ip(f, [205, 238], [200, 1500], Easing.in(Easing.cubic));

const PortalRing: React.FC<{frame: number}> = ({frame}) => {
  if (frame < 100 || frame > 245) return null;
  const spark = ip(frame, [100, 112, 130, 150], [0, 1, 0.5, 0]);
  const push = camPush(frame);
  const r = portalRadius(frame) * push;
  const fade = ip(frame, [228, 245], [1, 0]);
  const rot = frame * 2.2;
  return (
    <AbsoluteFill style={{opacity: fade, mixBlendMode: "screen"}}>
      <svg width={W} height={H}>
        <defs>
          <linearGradient id="vringG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={C.cyan} />
            <stop offset="0.5" stopColor={C.violet} />
            <stop offset="1" stopColor={C.magenta} />
          </linearGradient>
          <filter id="vglow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="14" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g opacity={spark}>
          <ellipse cx={PORTAL.x} cy={PORTAL.y} rx={4 + r * 0.05} ry={150 * push} fill={C.cyan} filter="url(#vglow)" />
          <circle cx={PORTAL.x} cy={PORTAL.y} r={30} fill="#fff" opacity={0.7} filter="url(#vglow)" />
        </g>
        {r > 1 ? (
          <g filter="url(#vglow)" transform={`translate(${PORTAL.x} ${PORTAL.y})`}>
            <circle r={r} fill="none" stroke="url(#vringG)" strokeWidth={6 + r * 0.02} />
            <g transform={`rotate(${rot})`}>
              <circle r={r * 1.08} fill="none" stroke={C.cyan} strokeWidth={3} strokeDasharray={`${r * 0.9} ${r * 0.5}`} opacity={0.8} />
            </g>
            <g transform={`rotate(${-rot * 1.4})`}>
              <circle r={r * 1.18} fill="none" stroke={C.violet} strokeWidth={2} strokeDasharray={`${r * 0.3} ${r * 0.25}`} opacity={0.6} />
            </g>
            {Array.from({length: 18}, (_, i) => {
              const a = (i / 18) * Math.PI * 2 + frame / 20;
              const rr = r * (1.05 + 0.12 * Math.sin(frame / 9 + i));
              return <circle key={i} cx={Math.cos(a) * rr} cy={Math.sin(a) * rr} r={2.5 + (i % 3)} fill={i % 2 ? C.cyan : C.goldLight} />;
            })}
          </g>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};

/* ------------------------------------- AI video world ------------------------------------ */

const THUMBS = [
  ["#0EA5E9", "#1E3A8A", "#FDE68A"],
  ["#F97316", "#7C2D12", "#FEF3C7"],
  ["#8B5CF6", "#1E1B4B", "#F0ABFC"],
  ["#10B981", "#064E3B", "#D1FAE5"],
  ["#EC4899", "#4C0519", "#FBCFE8"],
  ["#F59E0B", "#312E81", "#FFFBEB"],
];

const CARDS = Array.from({length: 28}, (_, i) => {
  const a = random(`vca${i}`) * Math.PI * 2;
  const rad = 360 + random(`vcr${i}`) * 520;
  return {
    x: Math.cos(a) * rad * 0.8,
    y: Math.sin(a) * rad * 1.5,
    z0: random(`vcz${i}`) * 5200,
    t: THUMBS[i % THUMBS.length],
    tilt: (random(`vct${i}`) - 0.5) * 30,
    prog: 0.2 + random(`vcp${i}`) * 0.7,
  };
});

const VideoCard: React.FC<{t: string[]; prog: number; frame: number; i: number}> = ({t, prog, frame, i}) => {
  const p = (prog + frame / 200) % 1;
  return (
    <div
      style={{
        width: 340,
        height: 200,
        borderRadius: 18,
        overflow: "hidden",
        position: "relative",
        background: `linear-gradient(160deg, ${t[0]} 0%, ${t[1]} 100%)`,
        boxShadow: `0 0 40px ${t[0]}88, inset 0 0 0 1.5px rgba(255,255,255,0.35)`,
      }}
    >
      <svg width={340} height={200} style={{position: "absolute", inset: 0}}>
        <circle cx={250 + Math.sin(frame / 25 + i) * 10} cy={62} r={26} fill={t[2]} opacity={0.85} />
        <polygon points="0,200 80,110 150,170 220,95 340,190 340,200" fill={t[1]} opacity={0.9} />
        <circle cx={170} cy={100} r={30} fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.8)" strokeWidth={2} />
        <polygon points="160,86 160,114 186,100" fill="#fff" />
        <rect x={16} y={180} width={308} height={5} rx={2.5} fill="rgba(255,255,255,0.25)" />
        <rect x={16} y={180} width={308 * p} height={5} rx={2.5} fill="#fff" />
        <path d="M24 22 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 z" fill="#fff" opacity={0.9} />
      </svg>
    </div>
  );
};

const NODES = Array.from({length: 34}, (_, i) => ({x: random(`vnx${i}`) * W, y: 80 + random(`vny${i}`) * (H - 160)}));

const AIWorld: React.FC<{frame: number}> = ({frame}) => {
  if (frame < 108 || frame > 352) return null;
  const travel = ip(frame, [108, 205, 240, 352], [0, 700, 3000, 4700]);
  const R = portalRadius(frame) * camPush(frame);
  const clip = frame < 238 ? `circle(${R}px at ${PORTAL.x}px ${PORTAL.y}px)` : "none";
  const outScale = ip(frame, [312, 350], [1, 1.35], Easing.in(Easing.quad));
  const outOpacity = ip(frame, [318, 348], [1, 0]);
  const innerScale = frame < 238 ? ip(frame, [108, 238], [0.55, 1]) : 1;
  return (
    <AbsoluteFill
      style={{
        clipPath: clip,
        opacity: outOpacity,
        background: `radial-gradient(circle at 50% 42%, #1B1446 0%, #0A0B24 45%, ${C.ink} 100%)`,
      }}
    >
      <AbsoluteFill style={{transform: `scale(${outScale * innerScale})`, transformOrigin: `${PORTAL.x}px ${PORTAL.y + 60}px`}}>
        <svg width={W} height={H} style={{position: "absolute", opacity: 0.5}}>
          {NODES.map((n, i) => {
            const m = NODES[(i * 7 + 3) % NODES.length];
            const k = NODES[(i * 11 + 5) % NODES.length];
            const pulse = 0.4 + 0.6 * Math.abs(Math.sin(frame / 15 + i));
            return (
              <g key={i}>
                <line x1={n.x} y1={n.y} x2={m.x} y2={m.y} stroke={C.violet} strokeOpacity={0.25} />
                <line x1={n.x} y1={n.y} x2={k.x} y2={k.y} stroke={C.cyan} strokeOpacity={0.15} />
                <circle cx={n.x} cy={n.y} r={3 + pulse * 3} fill={i % 2 ? C.cyan : C.violet} opacity={pulse} />
              </g>
            );
          })}
        </svg>
        <svg width={W} height={H} style={{position: "absolute"}}>
          {Array.from({length: 60}, (_, i) => {
            const a = random(`vsa${i}`) * Math.PI * 2;
            const d0 = ((random(`vsd${i}`) * 1100 + travel * 0.9) % 1100) + 40;
            const len = 20 + ip(frame, [200, 232, 260], [10, 260, 40]) + d0 * 0.08;
            return (
              <line
                key={i}
                x1={540 + Math.cos(a) * d0 * 0.7}
                y1={820 + Math.sin(a) * d0 * 1.3}
                x2={540 + Math.cos(a) * (d0 + len) * 0.7}
                y2={820 + Math.sin(a) * (d0 + len) * 1.3}
                stroke={i % 4 === 0 ? C.goldLight : C.cyan}
                strokeOpacity={0.15 + (d0 / 1140) * 0.6}
                strokeWidth={1.5}
              />
            );
          })}
        </svg>
        <AbsoluteFill style={{perspective: 1100, perspectiveOrigin: "50% 43%"}}>
          {CARDS.map((c, i) => {
            const z = ((c.z0 + travel) % 5200) - 4800;
            const op = ip(z, [-4800, -3800, -300, 350], [0, 1, 1, 0]);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 540 - 170,
                  top: 825 - 100,
                  opacity: op,
                  transform: `translate3d(${c.x}px, ${c.y}px, ${z}px) rotateY(${-c.x / 30}deg) rotateZ(${c.tilt * 0.2}deg)`,
                }}
              >
                <VideoCard t={c.t} prog={c.prog} frame={frame} i={i} />
              </div>
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------------------------------- Flashes ---------------------------------------- */

const Flash: React.FC<{frame: number; at: number; color: string; width?: number; peak?: number}> = ({frame, at, color, width = 14, peak = 0.85}) => {
  const o = ip(frame, [at - width, at, at + width * 1.6], [0, peak, 0]);
  if (o <= 0) return null;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 42%, ${color} 0%, ${color}88 30%, rgba(0,0,0,0) 75%)`,
        opacity: o,
        mixBlendMode: "screen",
      }}
    />
  );
};

/* ------------------------------------------ Studio ---------------------------------------- */

const Word: React.FC<{text: string; frame: number; at: number; style?: React.CSSProperties}> = ({text, frame, at, style}) => {
  const p = ip(frame, [at, at + 16], [0, 1], ease);
  return (
    <span style={{display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 26}px)`, filter: `blur(${(1 - p) * 10}px)`, ...style}}>
      {text}
    </span>
  );
};

const Icon: React.FC<{kind: "cal" | "clock" | "pin"}> = ({kind}) => (
  <svg width={50} height={50} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    {kind === "cal" ? (
      <>
        <rect x={3} y={5} width={18} height={16} rx={2.5} />
        <path d="M3 10h18M8 3v4M16 3v4" />
        <circle cx={12} cy={15.5} r={1.4} fill={C.gold} />
      </>
    ) : kind === "clock" ? (
      <>
        <circle cx={12} cy={12} r={9} />
        <path d="M12 7v5l3.5 2" />
      </>
    ) : (
      <>
        <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
        <circle cx={12} cy={9.5} r={2.6} />
      </>
    )}
  </svg>
);

const InfoPill: React.FC<{frame: number; at: number; icon: "cal" | "clock" | "pin"; text: string}> = ({frame, at, icon, text}) => {
  const p = ip(frame, [at, at + 20], [0, 1], ease);
  const sweep = ip(frame, [at + 6, at + 40], [-120, 220]);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 40}px) scale(${0.92 + p * 0.08})`,
        filter: `blur(${(1 - p) * 8}px)`,
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "24px 48px",
        borderRadius: 999,
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
        border: `1.5px solid ${C.gold}99`,
        boxShadow: `0 0 34px ${C.gold}22, inset 0 0 24px rgba(233,199,123,0.08)`,
      }}
    >
      <Icon kind={icon} />
      <span style={{fontFamily: MESSIRI, fontWeight: 600, fontSize: 58, color: C.ivory, lineHeight: 1.2}}>{text}</span>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 140,
          left: `${sweep}%`,
          background: "linear-gradient(90deg, transparent, rgba(255,241,201,0.35), transparent)",
          transform: "skewX(-20deg)",
        }}
      />
    </div>
  );
};

const Studio: React.FC<{frame: number}> = ({frame}) => {
  if (frame < 310 || frame > 690) return null;
  const inO = ip(frame, [314, 340], [0, 1]);
  const outO = ip(frame, [628, 672], [1, 0]);
  const inScale = ip(frame, [314, 350], [1.18, 1], ease);
  const push = ip(frame, [340, 670], [1, 1.06]);
  const swing = Math.sin(frame / 50) * 5;
  const titleUp = ip(frame, [428, 452], [0, 1], easeIO);
  const titleP = ip(frame, [338, 362], [0, 1], ease);
  const track = ip(frame, [338, 380], [30, 2], ease);
  const sheen = ip(frame, [350, 395], [-30, 130]);
  const lineW = ip(frame, [352, 384], [0, 1], ease);
  const gradText = (s: number): React.CSSProperties => ({
    backgroundImage: `linear-gradient(100deg, #FFFFFF 0%, #DDF7FF 35%, #FFFFFF ${s - 8}%, #FFF4D2 ${s}%, #FFFFFF ${s + 8}%, #BFEFFF 100%)`,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  });
  return (
    <AbsoluteFill style={{opacity: inO * outO, transform: `scale(${inScale * push})`}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 38%, #18163D 0%, #0A0A20 50%, ${C.ink} 100%)`}} />
      <svg width={W} height={H} style={{position: "absolute"}}>
        {Array.from({length: 9}, (_, i) => {
          const x = 70 + i * 117;
          const glow = 0.25 + 0.2 * Math.sin(frame / 20 + i * 0.7);
          return <rect key={i} x={x} y={160} width={6} height={1020} rx={3} fill={i % 2 ? C.violet : C.cyan} opacity={glow * (1 - Math.abs(i - 4) / 6.5)} />;
        })}
        <defs>
          <linearGradient id="vstageFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1A1B44" stopOpacity={0.9} />
            <stop offset="1" stopColor="#000" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="vbeam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFF6DC" stopOpacity={0.32} />
            <stop offset="1" stopColor="#FFF6DC" stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect y={1260} width={W} height={H - 1260} fill="url(#vstageFloor)" />
        <ellipse cx={540} cy={1330} rx={460} ry={60} fill={C.cyan} opacity={0.08} />
        <g style={{mixBlendMode: "screen"}}>
          <polygon points={`${150 + swing},0 ${230 + swing},0 ${600},1500 ${200},1500`} fill="url(#vbeam)" />
          <polygon points={`${850 - swing},0 ${930 - swing},0 ${880},1500 ${480},1500`} fill="url(#vbeam)" />
          <polygon points="510,0 570,0 760,1500 320,1500" fill="url(#vbeam)" opacity={0.55} />
        </g>
      </svg>
      <AbsoluteFill style={{mixBlendMode: "screen", opacity: ip(frame, [338, 350, 372], [0, 0.85, 0])}}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 720,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${C.cyan}, #fff, ${C.cyan}, transparent)`,
            filter: "blur(1.5px)",
          }}
        />
      </AbsoluteFill>
      {/* title block */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${-110 - titleUp * 280}px) scale(${1 - titleUp * 0.14})`,
        }}
      >
        <div style={{direction: "rtl", fontFamily: MESSIRI, fontWeight: 600, fontSize: 60, color: C.gold, marginBottom: 4}}>
          <Word text="ورشة" frame={frame} at={330} />
        </div>
        <div
          style={{
            direction: "ltr",
            fontFamily: MONT,
            fontWeight: 800,
            fontSize: 200,
            letterSpacing: track,
            lineHeight: 1.0,
            textAlign: "center",
            opacity: titleP,
            filter: `blur(${(1 - titleP) * 16}px) drop-shadow(0 0 30px rgba(92,225,255,0.45))`,
            transform: `scale(${0.94 + titleP * 0.06})`,
          }}
        >
          <div style={gradText(sheen)}>Google</div>
          <div style={gradText(sheen - 20)}>Flow</div>
        </div>
        <div style={{width: 760 * lineW, height: 2, margin: "26px 0 26px", background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`}} />
        <div
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: MESSIRI,
            fontWeight: 600,
            fontSize: 70,
            lineHeight: 1.35,
            color: C.ivory,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            columnGap: 20,
            maxWidth: 900,
            textShadow: "0 0 24px rgba(139,92,246,0.55)",
          }}
        >
          <div style={{display: "flex", gap: 20, width: "100%", justifyContent: "center"}}>
            <Word text="صناعة" frame={frame} at={372} />
            <Word text="الفيديو" frame={frame} at={385} />
          </div>
          <div style={{display: "flex", gap: 20, width: "100%", justifyContent: "center"}}>
            <Word text="بالذكاء" frame={frame} at={400} />
            <Word text="الاصطناعي" frame={frame} at={413} />
          </div>
        </div>
      </AbsoluteFill>
      {/* details */}
      <AbsoluteFill style={{alignItems: "center", justifyContent: "flex-start", paddingTop: 1150}}>
        <div dir="rtl" style={{display: "flex", flexDirection: "column", gap: 30, alignItems: "center"}}>
          <InfoPill frame={frame} at={447} icon="cal" text="الثلاثاء" />
          <InfoPill frame={frame} at={484} icon="clock" text="الحصة الثانية" />
          <InfoPill frame={frame} at={521} icon="pin" text="فصل اللغة الإنجليزية" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* --------------------------------- Ending: school & credits --------------------------------- */

// Closing voiceover (absolute frames): school 669–738 · principal 755–855 · credits 872–960
const Ending: React.FC<{frame: number}> = ({frame}) => {
  if (frame < 630) return null;
  const bg = ip(frame, [630, 672], [0, 1]);
  const logoP = ip(frame, [664, 712], [0, 1], ease);
  const scan = ip(frame, [664, 712], [-15, 115], easeIO); // light-scan reveal, left → right
  const flareO = ip(frame, [664, 672, 704, 718], [0, 1, 1, 0]);
  const spec = ip(frame, [740, 800], [-20, 120]);
  const ringP = ip(frame, [700, 745], [0, 1], ease);
  const principalP = ip(frame, [752, 776], [0, 1], ease);
  const lineP = ip(frame, [855, 895], [0, 1], ease);
  const nameP = ip(frame, [912, 958], [0, 1], easeIO);
  const sheen = ip(frame, [962, 1015], [-20, 120]);
  const breathe = 1 + ip(frame, [670, V_FRAMES], [0, 0.035]);
  const glow = 0.35 + 0.15 * Math.sin(frame / 14);
  return (
    <AbsoluteFill style={{opacity: bg}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, #1C1530 0%, #0B0814 50%, ${C.ink} 100%)`}} />
      <AbsoluteFill style={{transform: `scale(${breathe})`, alignItems: "center"}}>
        {/* school logo — cinematic reveal on the dark stage: halo ring, light-scan, gold flare */}
        <div
          style={{
            position: "absolute",
            top: 250,
            width: 900,
            height: 640,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* soft coloured halo + expanding ring behind the logo */}
          <div
            style={{
              position: "absolute",
              width: 980,
              height: 760,
              borderRadius: "50%",
              background: "radial-gradient(ellipse at 50% 50%, rgba(70,120,220,0.30) 0%, rgba(92,225,255,0.10) 40%, rgba(0,0,0,0) 70%)",
              opacity: ip(frame, [662, 700], [0, 1]),
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 300 + ringP * 700,
              height: 300 + ringP * 700,
              borderRadius: "50%",
              border: `2px solid ${C.gold}`,
              opacity: (1 - ringP) * 0.7 * (ringP > 0 ? 1 : 0),
              boxShadow: `0 0 40px ${C.gold}`,
            }}
          />
          {/* the logo: revealed by a scanning band of light, sharpening from blur */}
          <div
            style={{
              position: "relative",
              width: 760,
              transform: `scale(${1.1 - logoP * 0.1})`,
              filter: `blur(${(1 - logoP) * 12}px) drop-shadow(0 0 1.5px rgba(255,255,255,0.55)) drop-shadow(0 0 26px rgba(92,160,255,${0.25 + 0.15 * glow}))`,
              WebkitMaskImage: `linear-gradient(90deg, #000 ${scan - 12}%, rgba(0,0,0,0) ${scan + 12}%)`,
              maskImage: `linear-gradient(90deg, #000 ${scan - 12}%, rgba(0,0,0,0) ${scan + 12}%)`,
            }}
          >
            <Img src={staticFile("flow-invite/school-logo-dark.png")} style={{width: "100%", display: "block"}} />
            {/* specular sweep that only touches the logo's own pixels */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(105deg, rgba(255,255,255,0) ${spec - 12}%, rgba(255,248,225,0.95) ${spec}%, rgba(255,255,255,0) ${spec + 12}%)`,
                WebkitMaskImage: `url(${staticFile("flow-invite/school-logo-dark.png")})`,
                maskImage: `url(${staticFile("flow-invite/school-logo-dark.png")})`,
                WebkitMaskSize: "100% 100%",
                maskSize: "100% 100%",
                mixBlendMode: "screen",
              }}
            />
          </div>
          {/* gold anamorphic flare riding the scan line */}
          <div
            style={{
              position: "absolute",
              left: `${5 + scan * 0.9}%`,
              top: "50%",
              width: 900,
              height: 4,
              marginLeft: -450,
              marginTop: -2,
              background: `linear-gradient(90deg, rgba(0,0,0,0), ${C.goldLight}, #fff, ${C.goldLight}, rgba(0,0,0,0))`,
              filter: "blur(2px)",
              opacity: flareO,
              mixBlendMode: "screen",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: `${5 + scan * 0.9}%`,
              top: "50%",
              width: 160,
              height: 160,
              marginLeft: -80,
              marginTop: -80,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,241,201,0.5) 25%, rgba(0,0,0,0) 70%)",
              opacity: flareO,
              mixBlendMode: "screen",
            }}
          />
        </div>
        {/* principal */}
        <div
          dir="rtl"
          lang="ar"
          style={{
            position: "absolute",
            top: 1010,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            opacity: principalP,
            transform: `translateY(${(1 - principalP) * 26}px)`,
            filter: `blur(${(1 - principalP) * 8}px)`,
          }}
        >
          <span style={{fontFamily: MESSIRI, fontWeight: 600, fontSize: 46, color: C.gold}}>مديرة المدرسة</span>
          <span style={{fontFamily: MESSIRI, fontWeight: 700, fontSize: 68, color: C.ivory}}>الأستاذة أمل البوعينين</span>
        </div>
        {/* ornament */}
        <svg width={W} height={40} style={{position: "absolute", top: 1220}}>
          <defs>
            <linearGradient id="vorn" x1="0" x2="1">
              <stop offset="0" stopColor={C.gold} stopOpacity={0} />
              <stop offset="0.5" stopColor={C.goldLight} />
              <stop offset="1" stopColor={C.gold} stopOpacity={0} />
            </linearGradient>
          </defs>
          <rect x={540 - 380 * lineP} y={19} width={Math.max(760 * lineP, 0.01)} height={2} fill="url(#vorn)" />
          <g transform="translate(540 20) rotate(45)" opacity={lineP}>
            <rect x={-7} y={-7} width={14} height={14} fill="none" stroke={C.goldLight} strokeWidth={2} />
          </g>
        </svg>
        {/* credits: gold signature */}
        <div dir="rtl" lang="ar" style={{position: "absolute", top: 1300, display: "flex", flexDirection: "column", alignItems: "center"}}>
          <div style={{fontFamily: MESSIRI, fontWeight: 600, fontSize: 52, color: C.goldLight, display: "flex", gap: 16}}>
            <Word text="إعداد" frame={frame} at={868} />
            <Word text="وتنفيذ" frame={frame} at={878} />
          </div>
          <div style={{fontFamily: MESSIRI, fontWeight: 400, fontSize: 56, color: C.ivory, marginTop: 10}}>
            <Word text="الأستاذة" frame={frame} at={905} />
          </div>
          <div
            style={{
              fontFamily: RUQAA,
              fontWeight: 700,
              fontSize: 150,
              lineHeight: 1.45,
              padding: "0 40px",
              marginTop: -20,
              clipPath: `inset(-20% 0 -20% ${(1 - nameP) * 100}%)`,
              backgroundImage: `linear-gradient(100deg, ${C.goldDeep} 0%, ${C.gold} 30%, ${C.goldLight} ${sheen - 6}%, #FFFFFF ${sheen}%, ${C.goldLight} ${sheen + 6}%, ${C.gold} 75%, ${C.goldDeep} 100%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: `drop-shadow(0 0 ${18 + glow * 20}px rgba(233,199,123,${glow}))`,
            }}
          >
            نهى الجماز
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------ Audio ------------------------------------------ */

const SPEECH: Array<[number, number]> = [
  [45, 122], [146, 316], [328, 440], [450, 575], [585, 655], [669, 740], [755, 857], [872, 962],
];

const musicVolume = (f: number) => {
  const fade = ip(f, [0, 20], [0, 1]) * ip(f, [985, V_FRAMES], [1, 0]);
  let duck = 1;
  for (const [s, e] of SPEECH) duck = Math.min(duck, ip(f, [s - 8, s, e, e + 14], [1, 0, 0, 1]));
  return fade * (0.42 + 0.58 * duck) * 0.62;
};


const FlowAudio: React.FC = () => (
  <>
    <Audio src={staticFile("flow-invite/music-vertical.mp3")} volume={musicVolume} />
    <Sequence from={VO_OFFSET}>
      <Audio src={staticFile("flow-invite/voiceover-vertical.mp3")} volume={1} />
    </Sequence>
    <Sequence from={118}>
      <Audio src={staticFile("flow-invite/sfx-portal.mp3")} volume={0.5} />
    </Sequence>
    <Sequence from={336}>
      <Audio src={staticFile("flow-invite/sfx-impact.mp3")} volume={0.55} />
    </Sequence>
  </>
);

/* ------------------------------------------- Root ------------------------------------------ */

export const FlowInviteVertical: React.FC = () => {
  const frame = useCurrentFrame();
  const endFade = ip(frame, [V_FRAMES - 30, V_FRAMES], [0, 1]);
  return (
    <AbsoluteFill style={{background: C.ink, overflow: "hidden"}}>
      <Classroom frame={frame} />
      <AIWorld frame={frame} />
      <PortalRing frame={frame} />
      <Studio frame={frame} />
      <Ending frame={frame} />
      <Atmosphere frame={frame} />
      <Flash frame={frame} at={232} color="#DDF7FF" width={10} peak={0.95} />
      <Flash frame={frame} at={326} color="#FFF1C9" width={12} peak={0.8} />
      <Flash frame={frame} at={654} color="#E9C77B" width={20} peak={0.35} />
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.5) 100%)"}} />
      <Grain frame={frame} />
      <AbsoluteFill style={{background: "#000", opacity: endFade}} />
      <FlowAudio />
    </AbsoluteFill>
  );
};
