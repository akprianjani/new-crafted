import { useState } from "react";
import Photo from "./Photo.jsx";
import { useCart } from "./cart.jsx";
import { STATUS, getStatus, linePrice, minQty, rp, sizeLabel } from "./lib.js";

// Kartu produk: foto besar, nama, tasting notes, pilihan berat, harga otomatis, tombol + merah.
export default function ProductCard({ p }) {
  const { add } = useCart();
  const [size, setSize] = useState(p.sizes[0]);
  const s = getStatus(p), sold = s === "soldout";
  const price = linePrice(p, size, 1).pack;
  const sub = [p.origin, p.process, p.variety].filter(Boolean).join(" · ");
  return (
    <article className={`card${sold ? " is-sold" : ""}`}>
      <a className="ph" href={`#/produk/${p.id}`} aria-label={`Lihat ${p.name}`}>
        <Photo product={p} />
        {sold ? <span className="flag dark">Sold Out</span> : p.isNew && <span className="flag">NEW</span>}
      </a>
      <div className="bd">
        <a className="t" href={`#/produk/${p.id}`}><h3>{p.name}</h3></a>
        <p className="notes">{p.notes || sub}</p>
        {p.notes && sub && <p className="meta">{sub}</p>}
        <div className="chips sm" role="group" aria-label={`Pilih berat ${p.name}`}>
          {p.sizes.map((z) => (
            <button key={z} type="button" className="chip" aria-pressed={z === size} onClick={() => setSize(z)}>{sizeLabel(z)}</button>))}
        </div>
        <div className="buy">
          <div>
            <div className="price">{rp(price)}</div>
            <div className="meta">per {sizeLabel(size)} · {STATUS[s][0]}</div>
            {p.minKg > size && !sold && <div className="meta">Min. {p.minKg} kg ({minQty(p, size)} kemasan)</div>}
          </div>
          <button className="plus" type="button" disabled={sold} onClick={() => add(p, size)}
            aria-label={sold ? `${p.name} sold out` : `Tambah ${p.name} ${sizeLabel(size)} ke keranjang`}>+</button>
        </div>
      </div>
    </article>
  );
}
