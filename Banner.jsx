import LuckyCat from "./LuckyCat.jsx";

/* Isi ini kalau makna guratan kayu sudah ditentukan. Dibiarkan "" = tulisan tidak tampil. */
const MAKNA = { judul: "", teks: "" };

function rand(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const COLORS = ["#030a2a", "#16246b", "#22358f", "#0a1650", "#2f44a8"];

function GrainLines() {
  const r = rand(11);
  const lines = [];
  for (let i = 0; i < 38; i++) {
    const y = 8 + i * 5.2;
    const a = (r() - 0.5) * 26, b = (r() - 0.5) * 26, c = (r() - 0.5) * 26, d = (r() - 0.5) * 26;
    lines.push(
      <path key={i} fill="none" strokeLinecap="round" stroke={COLORS[i % 5]}
        strokeWidth={0.8 + r() * 2.4} opacity={0.25 + r() * 0.5}
        d={`M-20 ${y} C 280 ${y + a}, 560 ${y + b}, 820 ${y + c} S 1100 ${y + d}, 1220 ${y + a / 2}`} />
    );
  }
  return lines;
}

export default function Banner() {
  const hasText = MAKNA.judul || MAKNA.teks;
  return (
    <section aria-label="Banner" style={{ position: "relative", height: "clamp(140px, 26vw, 220px)", background: "#06113E", overflow: "hidden" }}>
      <svg viewBox="0 0 1200 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Guratan kayu"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <GrainLines />
        {[44, 32, 21, 11, 4].map((rx, i) => (
          <ellipse key={i} cx="330" cy="104" rx={rx * 1.6} ry={rx * 0.62} fill="none" stroke="#D63429" strokeWidth="2" opacity={0.75 - i * 0.1} />
        ))}
      </svg>
      {hasText && (
        <div style={{ position: "absolute", left: "max(16px, 4vw)", top: "50%", transform: "translateY(-50%)", maxWidth: "55%", color: "#fff", background: "rgba(6,17,62,.75)", padding: "10px 14px", borderRadius: 8 }}>
          {MAKNA.judul && <b style={{ display: "block", fontFamily: "var(--f1)", fontSize: "1.1rem" }}>{MAKNA.judul}</b>}
          {MAKNA.teks && <span style={{ fontSize: ".9rem" }}>{MAKNA.teks}</span>}
        </div>
      )}
      <LuckyCat style={{ position: "absolute", right: "max(12px, 4vw)", bottom: 0, height: "88%", width: "auto" }} />
    </section>
  );
}
