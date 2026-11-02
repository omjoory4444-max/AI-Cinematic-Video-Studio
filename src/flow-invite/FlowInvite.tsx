import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {MESSIRI, MONT, RUQAA} from "./fonts";

/* ------------------------------------------------------------------------------------------
 * «Google Flow – صناعة الفيديو بالذكاء الاصطناعي» — cinematic 30 s workshop invitation.
 * One continuous camera move: dark classroom → a portal opens on the chalkboard → fly-through
 * into a world of AI videos → a film studio reveals the title → details → gold signature.
 * Timings are in frames (30 fps) and follow the voiceover's measured word timings
 * (voice starts at VO_OFFSET).
 * ---------------------------------------------------------------------------------------- */

export const FLOW_FPS = 30;
export const FLOW_FRAMES = 900; // 30 s
const VO_OFFSET = 45; // voiceover starts at 1.5 s

const C = {
  ink: "#03040B",
  night: "#070A1A",
  cyan: "#5CE1FF",
  violet: "#8B5CF6",
  magenta: "#D946EF",
  gold: "#E9C77B",
  goldDeep: "#B8893A",
  goldLight: "#FFF1C9",
  ivory: "#F7F3EA",
};

const PORTAL = {x: 960, y: 430};

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const easeIO = Easing.bezier(0.65, 0, 0.35, 1);
const ip = (f: number, i: number[], o: number[], e: (t: number) => number = (t) => t) =>
  interpolate(f, i, o, {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e});

/* ---------------------------------- shared atmosphere ---------------------------------- */

const DUST = Array.from({length: 140}, (_, i) => ({
  x: random(`dx${i}`) * 1920,
  y: random(`dy${i}`) * 1080,
  r: 0.6 + random(`dr${i}`) * 2.4,
  sp: 0.15 + random(`ds${i}`) * 0.6,
  ph: random(`dp${i}`) * Math.PI * 2,
}));

/** Floating dust/bokeh that lives across the whole film; its colour drifts cyan → gold. */
const Atmosphere: React.FC<{frame: number}> = ({frame}) => {
  const goldMix = ip(frame, [600, 680], [0, 1]);
  const bright = ip(frame, [0, 40, 110, 230, 600, 680], [0.15, 0.35, 0.45, 0.9, 0.6, 1]);
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <svg width={1920} height={1080}>
        {DUST.map((d, i) => {
          const y = (d.y - frame * d.sp * 1.4 + 1080 * 4) % 1080;
          const x = d.x + Math.sin(frame / 40 + d.ph) * 14;
          const tw = 0.45 + 0.55 * Math.sin(frame / 18 + d.ph);
          const col = i % 3 === 0 ? (goldMix > 0.5 ? C.goldLight : C.cyan) : goldMix > 0.5 ? C.gold : "#9FB4FF";
          return <circle key={i} cx={x} cy={y} r={d.r * (1 + goldMix * 0.6)} fill={col} opacity={tw * bright * 0.55} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

const Grain: React.FC<{frame: number}> = ({frame}) => (
  <AbsoluteFill style={{opacity: 0.09, mixBlendMode: "overlay", pointerEvents: "none"}}>
    <svg width={1920} height={1080}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 24} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={1920} height={1080} filter="url(#grain)" />
    </svg>
  </AbsoluteFill>
);

const Letterbox: React.FC = () => (
  <>
    <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 64, background: "#000"}} />
    <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 64, background: "#000"}} />
  </>
);

/* --------------------------------------- Scene 1 --------------------------------------- */

const Desk: React.FC<{x: number; y: number; s: number; rim: number}> = ({x, y, s, rim}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* chair back */}
    <rect x={-46} y={-118} width={92} height={60} rx={8} fill="#0B0F1F" stroke={C.cyan} strokeOpacity={rim * 0.35} />
    {/* desk top */}
    <polygon points="-120,-40 120,-40 140,0 -140,0" fill="#10162B" stroke={C.cyan} strokeOpacity={rim * 0.6} strokeWidth={2} />
    <rect x={-132} y={0} width={264} height={14} fill="#0A0E1D" />
    <rect x={-120} y={14} width={10} height={86} fill="#080B17" />
    <rect x={110} y={14} width={10} height={86} fill="#080B17" />
    {/* book on desk */}
    <polygon points="-40,-34 20,-34 26,-24 -34,-24" fill="#1B2240" stroke={C.gold} strokeOpacity={rim * 0.4} />
  </g>
);

const Classroom: React.FC<{frame: number}> = ({frame}) => {
  // slow dolly towards the board, then rushing into the portal
  const push = ip(frame, [0, 150, 200, 238], [1.0, 1.12, 1.5, 4.2], easeIO);
  const fadeIn = ip(frame, [0, 40], [0, 1]);
  const lightUp = ip(frame, [100, 170], [0, 1]); // portal light on the room
  const out = ip(frame, [222, 240], [1, 0]);
  const desks = [
    // [x, y, scale]  back row → front row
    [610, 640, 0.55], [800, 640, 0.55], [1120, 640, 0.55], [1310, 640, 0.55],
    [470, 760, 0.8], [760, 760, 0.8], [1160, 760, 0.8], [1450, 760, 0.8],
    [280, 930, 1.12], [700, 930, 1.12], [1220, 930, 1.12], [1640, 930, 1.12],
  ];
  return (
    <AbsoluteFill
      style={{
        opacity: fadeIn * out,
        transform: `scale(${push})`,
        transformOrigin: `${PORTAL.x}px ${PORTAL.y}px`,
      }}
    >
      <svg width={1920} height={1080}>
        <defs>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#060815" />
            <stop offset="1" stopColor="#0B1024" />
          </linearGradient>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0A0E20" />
            <stop offset="1" stopColor="#03050C" />
          </linearGradient>
          <linearGradient id="moon" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9DB7FF" stopOpacity={0.22} />
            <stop offset="1" stopColor="#9DB7FF" stopOpacity={0} />
          </linearGradient>
          <radialGradient id="portalLight" cx={PORTAL.x} cy={PORTAL.y} r={900} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={C.cyan} stopOpacity={0.55} />
            <stop offset="0.35" stopColor={C.violet} stopOpacity={0.22} />
            <stop offset="1" stopColor={C.violet} stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={1920} height={600} fill="url(#wall)" />
        <rect y={600} width={1920} height={480} fill="url(#floor)" />
        {/* floor perspective lines */}
        <clipPath id="floorClip">
          <rect y={600} width={1920} height={480} />
        </clipPath>
        <g clipPath="url(#floorClip)">
          {Array.from({length: 15}, (_, i) => (
            <line key={i} x1={960} y1={430} x2={-600 + i * 230} y2={1080} stroke="#1A2246" strokeOpacity={0.35} />
          ))}
        </g>
        <rect y={596} width={1920} height={6} fill="#0E1430" />
        {/* window with moonlight */}
        <g>
          <rect x={110} y={170} width={260} height={360} fill="#0B1533" stroke="#1C2650" strokeWidth={10} />
          <line x1={240} y1={170} x2={240} y2={530} stroke="#1C2650" strokeWidth={8} />
          <line x1={110} y1={350} x2={370} y2={350} stroke="#1C2650" strokeWidth={8} />
          <circle cx={310} cy={230} r={26} fill="#DCE6FF" opacity={0.5} />
          <polygon points="110,170 370,170 980,1080 360,1080" fill="url(#moon)" opacity={0.8 - lightUp * 0.4} />
        </g>
        {/* wall clock */}
        <g transform="translate(1640 250)">
          <circle r={48} fill="#0C1128" stroke="#252F5C" strokeWidth={6} />
          <line x1={0} y1={0} x2={0} y2={-30} stroke="#3A4680" strokeWidth={4} />
          <line x1={0} y1={0} x2={22} y2={6} stroke="#3A4680" strokeWidth={4} />
        </g>
        {/* chalkboard */}
        <rect x={540} y={225} width={840} height={420} rx={6} fill="#2A1F17" />
        <rect x={556} y={241} width={808} height={388} fill="#0C1A17" />
        <g stroke="#CFE3DA" strokeOpacity={0.16} strokeWidth={3} fill="none" strokeLinecap="round">
          <text x={620} y={320} fill="#CFE3DA" fillOpacity={0.16} stroke="none" fontFamily={MONT} fontSize={44} fontWeight={300}>
            Hello, class!
          </text>
          <path d="M620 360 q40 -18 80 0 t80 0 t80 0" />
          <path d="M1180 520 l60 -60 l40 40 l60 -90" />
        </g>
        <rect x={540} y={640} width={840} height={12} fill="#2A1F17" />
        {/* portal light spilling over the room */}
        <rect width={1920} height={1080} fill="url(#portalLight)" opacity={lightUp} style={{mixBlendMode: "screen"}} />
        {desks.map(([x, y, s], i) => (
          <Desk key={i} x={x} y={y} s={s} rim={lightUp * (1 - s * 0.35)} />
        ))}
      </svg>
      {/* deep vignette for darkness */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 0%, rgba(0,0,0,${0.55 - lightUp * 0.25}) 55%, rgba(0,0,0,0.92) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------------- Portal ring ------------------------------------- */

const portalRadius = (f: number) =>
  f < 112 ? 0 : f < 150 ? ip(f, [112, 150], [0, 120], ease) : f < 205 ? ip(f, [150, 205], [120, 175]) : ip(f, [205, 238], [175, 1500], Easing.in(Easing.cubic));

const PortalRing: React.FC<{frame: number}> = ({frame}) => {
  if (frame < 100 || frame > 245) return null;
  const spark = ip(frame, [100, 112, 130, 150], [0, 1, 0.5, 0]);
  const R = portalRadius(frame);
  // the ring lives in screen space: scale its radius by the classroom camera push
  const push = ip(frame, [0, 150, 200, 238], [1.0, 1.12, 1.5, 4.2], easeIO);
  const r = R * push;
  const fade = ip(frame, [228, 245], [1, 0]);
  const rot = frame * 2.2;
  return (
    <AbsoluteFill style={{opacity: fade, mixBlendMode: "screen"}}>
      <svg width={1920} height={1080}>
        <defs>
          <linearGradient id="ringG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={C.cyan} />
            <stop offset="0.5" stopColor={C.violet} />
            <stop offset="1" stopColor={C.magenta} />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="14" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* initial spark: a vertical slit of light */}
        <g opacity={spark}>
          <ellipse cx={PORTAL.x} cy={PORTAL.y} rx={4 + r * 0.05} ry={140 * push} fill={C.cyan} filter="url(#glow)" />
          <circle cx={PORTAL.x} cy={PORTAL.y} r={30} fill="#fff" opacity={0.7} filter="url(#glow)" />
        </g>
        {r > 1 ? (
          <g filter="url(#glow)" transform={`translate(${PORTAL.x} ${PORTAL.y})`}>
            <circle r={r} fill="none" stroke="url(#ringG)" strokeWidth={6 + r * 0.02} />
            <g transform={`rotate(${rot})`}>
              <circle r={r * 1.08} fill="none" stroke={C.cyan} strokeWidth={3} strokeDasharray={`${r * 0.9} ${r * 0.5}`} opacity={0.8} />
            </g>
            <g transform={`rotate(${-rot * 1.4})`}>
              <circle r={r * 1.18} fill="none" stroke={C.violet} strokeWidth={2} strokeDasharray={`${r * 0.3} ${r * 0.25}`} opacity={0.6} />
            </g>
            {/* orbiting sparks */}
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

const CARDS = Array.from({length: 26}, (_, i) => {
  const a = random(`ca${i}`) * Math.PI * 2;
  const rad = 380 + random(`cr${i}`) * 520;
  return {
    x: Math.cos(a) * rad * 1.35,
    y: Math.sin(a) * rad * 0.75,
    z0: random(`cz${i}`) * 5200,
    t: THUMBS[i % THUMBS.length],
    tilt: (random(`ct${i}`) - 0.5) * 30,
    prog: 0.2 + random(`cp${i}`) * 0.7,
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
        {/* AI sparkle */}
        <path d="M24 22 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 z" fill="#fff" opacity={0.9} />
      </svg>
    </div>
  );
};

const NODES = Array.from({length: 34}, (_, i) => ({
  x: random(`nx${i}`) * 1920,
  y: 80 + random(`ny${i}`) * 920,
}));

const AIWorld: React.FC<{frame: number}> = ({frame}) => {
  if (frame < 108 || frame > 352) return null;
  const travel = ip(frame, [108, 205, 240, 352], [0, 700, 3000, 4700]);
  const R = portalRadius(frame) * ip(frame, [0, 150, 200, 238], [1.0, 1.12, 1.5, 4.2], easeIO);
  const clip = frame < 238 ? `circle(${R}px at ${PORTAL.x}px ${PORTAL.y}px)` : "none";
  const outScale = ip(frame, [312, 350], [1, 1.35], Easing.in(Easing.quad));
  const outOpacity = ip(frame, [318, 348], [1, 0]);
  const innerScale = frame < 238 ? ip(frame, [108, 238], [0.55, 1]) : 1;
  return (
    <AbsoluteFill style={{clipPath: clip, opacity: outOpacity}}>
      <AbsoluteFill
        style={{
          transform: `scale(${outScale * innerScale})`,
          background: `radial-gradient(circle at 50% 45%, #1B1446 0%, #0A0B24 45%, ${C.ink} 100%)`,
        }}
      >
        {/* neural constellation */}
        <svg width={1920} height={1080} style={{position: "absolute", opacity: 0.5}}>
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
        {/* warp light streaks */}
        <svg width={1920} height={1080} style={{position: "absolute"}}>
          {Array.from({length: 60}, (_, i) => {
            const a = random(`sa${i}`) * Math.PI * 2;
            const d0 = ((random(`sd${i}`) * 1200 + travel * 0.9) % 1200) + 40;
            const len = 20 + ip(frame, [200, 232, 260], [10, 260, 40]) + d0 * 0.08;
            return (
              <line
                key={i}
                x1={960 + Math.cos(a) * d0}
                y1={460 + Math.sin(a) * d0 * 0.7}
                x2={960 + Math.cos(a) * (d0 + len)}
                y2={460 + Math.sin(a) * (d0 + len) * 0.7}
                stroke={i % 4 === 0 ? C.goldLight : C.cyan}
                strokeOpacity={0.15 + (d0 / 1240) * 0.6}
                strokeWidth={1.5}
              />
            );
          })}
        </svg>
        {/* tunnel of AI-made videos flying toward the camera */}
        <AbsoluteFill style={{perspective: 1100, perspectiveOrigin: "50% 43%"}}>
          {CARDS.map((c, i) => {
            const z = ((c.z0 + travel) % 5200) - 4800; // -4800 … 400
            const op = ip(z, [-4800, -3800, -300, 350], [0, 1, 1, 0]);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 960 - 170,
                  top: 465 - 100,
                  opacity: op,
                  transform: `translate3d(${c.x}px, ${c.y}px, ${z}px) rotateY(${-c.x / 45}deg) rotateZ(${c.tilt * 0.2}deg)`,
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

const Flash: React.FC<{frame: number; at: number; color: string; width?: number; peak?: number}> = ({
  frame,
  at,
  color,
  width = 14,
  peak = 0.85,
}) => {
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
    <span
      style={{
        display: "inline-block",
        opacity: p,
        transform: `translateY(${(1 - p) * 26}px)`,
        filter: `blur(${(1 - p) * 10}px)`,
        ...style,
      }}
    >
      {text}
    </span>
  );
};

const Icon: React.FC<{kind: "cal" | "clock" | "pin"}> = ({kind}) => (
  <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
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
        gap: 18,
        padding: "22px 40px",
        borderRadius: 999,
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
        border: `1.5px solid ${C.gold}99`,
        boxShadow: `0 0 34px ${C.gold}22, inset 0 0 24px rgba(233,199,123,0.08)`,
      }}
    >
      <Icon kind={icon} />
      <span style={{fontFamily: MESSIRI, fontWeight: 600, fontSize: 50, color: C.ivory, lineHeight: 1.2}}>{text}</span>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 120,
          left: `${sweep}%`,
          background: "linear-gradient(90deg, transparent, rgba(255,241,201,0.35), transparent)",
          transform: "skewX(-20deg)",
        }}
      />
    </div>
  );
};

const Studio: React.FC<{frame: number}> = ({frame}) => {
  if (frame < 310 || frame > 672) return null;
  const inO = ip(frame, [314, 340], [0, 1]);
  const outO = ip(frame, [604, 650], [1, 0]);
  const inScale = ip(frame, [314, 350], [1.18, 1], ease);
  const push = ip(frame, [340, 650], [1, 1.07]);
  const swing = Math.sin(frame / 50) * 6;
  const titleUp = ip(frame, [430, 455], [0, 1], easeIO);
  const titleP = ip(frame, [338, 362], [0, 1], ease);
  const track = ip(frame, [338, 380], [40, 4], ease);
  const sheen = ip(frame, [350, 395], [-30, 130]);
  const lineW = ip(frame, [352, 384], [0, 1], ease);
  return (
    <AbsoluteFill style={{opacity: inO * outO, transform: `scale(${inScale * push})`}}>
      {/* stage */}
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 38%, #18163D 0%, #0A0A20 50%, ${C.ink} 100%)`}} />
      {/* LED panels on back wall */}
      <svg width={1920} height={1080} style={{position: "absolute"}}>
        {Array.from({length: 14}, (_, i) => {
          const x = 120 + i * 130;
          const glow = 0.25 + 0.2 * Math.sin(frame / 20 + i * 0.7);
          return <rect key={i} x={x} y={120} width={6} height={520} rx={3} fill={i % 2 ? C.violet : C.cyan} opacity={glow * (1 - Math.abs(i - 6.5) / 9)} />;
        })}
        {/* reflective floor */}
        <defs>
          <linearGradient id="stageFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1A1B44" stopOpacity={0.9} />
            <stop offset="1" stopColor="#000" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFF6DC" stopOpacity={0.35} />
            <stop offset="1" stopColor="#FFF6DC" stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect y={700} width={1920} height={380} fill="url(#stageFloor)" />
        <ellipse cx={960} cy={760} rx={620} ry={60} fill={C.cyan} opacity={0.08} />
        {/* spotlights */}
        <g style={{mixBlendMode: "screen"}}>
          <polygon points={`${420 + swing},0 ${500 + swing},0 ${980},900 ${560},900`} fill="url(#beam)" />
          <polygon points={`${1420 - swing},0 ${1500 - swing},0 ${1360},900 ${940},900`} fill="url(#beam)" />
          <polygon points="930,0 990,0 1180,900 740,900" fill="url(#beam)" opacity={0.6} />
        </g>
      </svg>
      {/* film-camera lens flare */}
      <AbsoluteFill style={{mixBlendMode: "screen", opacity: ip(frame, [338, 350, 372], [0, 0.85, 0])}}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 400,
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
          transform: `translateY(${-30 - titleUp * 150}px) scale(${1 - titleUp * 0.2})`,
        }}
      >
        <div style={{direction: "rtl", fontFamily: MESSIRI, fontWeight: 600, fontSize: 46, color: C.gold, marginBottom: 6}}>
          <Word text="ورشة" frame={frame} at={330} />
        </div>
        <div
          style={{
            direction: "ltr",
            fontFamily: MONT,
            fontWeight: 800,
            fontSize: 168,
            letterSpacing: track,
            lineHeight: 1.05,
            opacity: titleP,
            filter: `blur(${(1 - titleP) * 16}px) drop-shadow(0 0 30px rgba(92,225,255,0.45))`,
            transform: `scale(${0.94 + titleP * 0.06})`,
            backgroundImage: `linear-gradient(100deg, #FFFFFF 0%, #DDF7FF 35%, #FFFFFF ${sheen - 8}%, #FFF4D2 ${sheen}%, #FFFFFF ${sheen + 8}%, #BFEFFF 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Google Flow
        </div>
        <div
          style={{
            width: 760 * lineW,
            height: 2,
            margin: "18px 0 22px",
            background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
          }}
        />
        <div
          dir="rtl"
          lang="ar"
          style={{fontFamily: MESSIRI, fontWeight: 600, fontSize: 64, color: C.ivory, display: "flex", gap: 18, textShadow: "0 0 24px rgba(139,92,246,0.55)"}}
        >
          <Word text="صناعة" frame={frame} at={372} />
          <Word text="الفيديو" frame={frame} at={385} />
          <Word text="بالذكاء" frame={frame} at={400} />
          <Word text="الاصطناعي" frame={frame} at={413} />
        </div>
      </AbsoluteFill>
      {/* details */}
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center", paddingTop: 330}}>
        <div dir="rtl" style={{display: "flex", gap: 34, alignItems: "center"}}>
          <InfoPill frame={frame} at={447} icon="cal" text="الثلاثاء" />
          <InfoPill frame={frame} at={484} icon="clock" text="الحصة الثانية" />
          <InfoPill frame={frame} at={521} icon="pin" text="فصل اللغة الإنجليزية" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------------------------------- Signature ---------------------------------------- */

const Signature: React.FC<{frame: number}> = ({frame}) => {
  if (frame < 615) return null;
  const bg = ip(frame, [615, 660], [0, 1]);
  const lineP = ip(frame, [648, 690], [0, 1], ease);
  const nameP = ip(frame, [700, 748], [0, 1], easeIO);
  const sheen = ip(frame, [752, 812], [-20, 120]);
  const breathe = 1 + ip(frame, [660, 900], [0, 0.045]);
  const glow = 0.35 + 0.15 * Math.sin(frame / 14);
  return (
    <AbsoluteFill style={{opacity: bg}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, #1C1530 0%, #0B0814 45%, ${C.ink} 100%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 52%, rgba(233,199,123,${0.18 * nameP}) 0%, rgba(0,0,0,0) 45%)`}} />
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center", transform: `scale(${breathe})`}}>
        <div dir="rtl" lang="ar" style={{fontFamily: MESSIRI, fontWeight: 400, fontSize: 54, color: C.goldLight, marginBottom: 6, display: "flex", gap: 14}}>
          <Word text="مع" frame={frame} at={658} />
          <Word text="تحيات" frame={frame} at={664} />
          <Word text="المعلمة" frame={frame} at={672} />
        </div>
        {/* name: revealed right → left like ink being written */}
        <div
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: RUQAA,
            fontWeight: 700,
            fontSize: 190,
            lineHeight: 1.45,
            padding: "0 40px",
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
        {/* ornament line */}
        <svg width={900} height={40} style={{marginTop: -6}}>
          <defs>
            <linearGradient id="orn" x1="0" x2="1">
              <stop offset="0" stopColor={C.gold} stopOpacity={0} />
              <stop offset="0.5" stopColor={C.goldLight} />
              <stop offset="1" stopColor={C.gold} stopOpacity={0} />
            </linearGradient>
          </defs>
          <rect x={450 - 420 * lineP} y={19} width={Math.max(840 * lineP, 0.01)} height={2} fill="url(#orn)" />
          <g transform="translate(450 20) rotate(45)" opacity={lineP}>
            <rect x={-7} y={-7} width={14} height={14} fill="none" stroke={C.goldLight} strokeWidth={2} />
          </g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------ Audio ------------------------------------------ */

// spoken windows (absolute frames) used to duck the music under the narrator
const SPEECH: Array<[number, number]> = [
  [45, 122], [146, 316], [328, 440], [450, 575], [585, 648], [662, 735],
];

const musicVolume = (f: number) => {
  const fade = ip(f, [0, 20], [0, 1]) * ip(f, [850, 900], [1, 0]);
  let duck = 1;
  for (const [s, e] of SPEECH) duck = Math.min(duck, ip(f, [s - 8, s, e, e + 14], [1, 0, 0, 1]));
  return fade * (0.42 + 0.58 * duck) * 0.62;
};

const FlowAudio: React.FC = () => (
  <>
    <Audio src={staticFile("flow-invite/music.mp3")} volume={musicVolume} />
    <Sequence from={VO_OFFSET}>
      <Audio src={staticFile("flow-invite/voiceover.mp3")} volume={1} />
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

export const FlowInvite: React.FC = () => {
  const frame = useCurrentFrame();
  const endFade = ip(frame, [872, 900], [0, 1]);
  return (
    <AbsoluteFill style={{background: C.ink, overflow: "hidden"}}>
      <Classroom frame={frame} />
      <AIWorld frame={frame} />
      <PortalRing frame={frame} />
      <Studio frame={frame} />
      <Signature frame={frame} />
      <Atmosphere frame={frame} />
      <Flash frame={frame} at={232} color="#DDF7FF" width={10} peak={0.95} />
      <Flash frame={frame} at={326} color="#FFF1C9" width={12} peak={0.8} />
      <Flash frame={frame} at={636} color="#E9C77B" width={20} peak={0.35} />
      {/* global vignette keeps one cinematic look across all scenes */}
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)"}} />
      <Grain frame={frame} />
      <Letterbox />
      <AbsoluteFill style={{background: "#000", opacity: endFade}} />
      <FlowAudio />
    </AbsoluteFill>
  );
};
