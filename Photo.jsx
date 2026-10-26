// Foto produk. Jika foto belum ada, tampil ilustrasi biji sebagai placeholder.
const COLORS = ["#8a8f4d", "#7b8140", "#9aa05a", "#6f7539"];

export function BeanArt({ seed = 1 }) {
  let s = seed * 9301;
  const next = () => ((s = (s * 49297 + 233) % 233280) / 233280);
  const beans = Array.from({ length: 46 }, (_, i) => {
    const x = 20 + next() * 360, y = 20 + next() * 360, r = next() * 180;
    return (
      <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
        <ellipse rx="22" ry="14" fill={COLORS[i % 4]} />
        <path d="M-20 0 Q-8 -5 0 0 T20 0" stroke="rgba(0,0,0,.28)" strokeWidth="2" fill="none" />
      </g>
    );
  });
  return (
    <svg viewBox="0 0 400 400" role="img" aria-label="Ilustrasi green bean (placeholder foto)">
      {beans}
    </svg>
  );
}

export default function Photo({ product, seed }) {
  return product.img ? <img src={product.img} alt={product.name} loading="lazy" /> : <BeanArt seed={seed} />;
}
