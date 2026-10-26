import Photo from "./Photo.jsx";
import { PRODUCTS } from "./config.js";
import { STATUS, getStatus, basePrice, rp, stockText } from "./lib.js";

export default function ProductCard({ p }) {
  const s = getStatus(p);
  return (
    <article className="card">
      <div className="ph"><Photo product={p} seed={PRODUCTS.indexOf(p) + 2} /></div>
      <div className="bd">
        <span className={`badge ${STATUS[s][1]}`}>{STATUS[s][0]}</span>
        <a className="t" href={`#/produk/${p.id}`}><h3>{p.name}</h3></a>
        <div className="meta">{p.origin}{p.region ? " · " + p.region : ""}</div>
        <div className="meta">{p.process}{p.variety ? " · " + p.variety : ""}{p.altitude ? " · " + p.altitude : ""}</div>
        {p.notes && <div className="meta">Notes: {p.notes}</div>}
        <div className="price">{rp(basePrice(p))}/kg</div>
        <div className="meta">Min. {p.minKg} kg · Stok: {stockText(p)}</div>
        <a className="btn alt" href={`#/produk/${p.id}`} style={{ marginTop: "auto" }}>Lihat detail</a>
      </div>
    </article>
  );
}
