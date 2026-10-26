import { useState } from "react";
import { PRODUCTS } from "./config.js";
import Photo from "./Photo.jsx";
import { STATUS, getStatus, basePrice, unitPrice, rp, stockText, waLink } from "./lib.js";

export default function Detail({ id }) {
  const p = PRODUCTS.find((x) => x.id === id);
  const [size, setSize] = useState(p ? p.sizes[0] : 1);
  const [packs, setPacks] = useState(p ? Math.max(1, Math.ceil(p.minKg / p.sizes[0])) : 1);
  const [note, setNote] = useState("");

  if (!p) return <section><div className="wrap"><h2>Produk tidak ditemukan</h2><a className="btn" href="#/katalog">Ke katalog</a></div></section>;

  const s = getStatus(p), sold = s === "soldout";
  const qty = size * Math.max(1, packs), unit = unitPrice(p, qty), subtotal = qty * unit;
  let problem = "";
  if (qty < p.minKg) problem = `Minimum pembelian ${p.minKg} kg.`;
  else if (s !== "preorder" && qty > p.stockKg) problem = `Melebihi stok tercatat (${p.stockKg} kg).`;

  const message =
`Halo New Crafted, saya ingin memesan green beans.

Produk: ${p.name}
Origin: ${p.origin}
Kuantitas: ${qty} kg
Harga satuan: ${rp(unit)}/kg
Subtotal: ${rp(subtotal)}${note.trim() ? `\nCatatan: ${note.trim()}` : ""}

Mohon informasi stok aktual, ongkir, dan cara pembayaran.`;

  const rows = [["Origin", p.origin], ["Region", p.region], ["Farm", p.farm], ["Producer", p.producer],
    ["Varietas", p.variety], ["Process", p.process], ["Altitude", p.altitude], ["Crop year / harvest", p.crop],
    ["Kadar air", p.moisture], ["Density", p.density], ["Screen size", p.screen], ["Cupping score", p.cupping],
    ["Tasting notes", p.notes]].filter((r) => r[1]);

  return (
    <section><div className="wrap">
      <p className="meta"><a href="#/katalog">← Katalog</a></p>
      <div className="detail">
        <div className="ph"><Photo product={p} seed={PRODUCTS.indexOf(p) + 2} /></div>
        <div>
          <span className={`badge ${STATUS[s][1]}`}>{STATUS[s][0]}</span>
          <h1 style={{ fontSize: "2.2rem", marginTop: 8 }}>{p.name}</h1>
          <div className="price">{rp(basePrice(p))}/kg</div>
          <dl>
            {rows.map((r) => <div key={r[0]} style={{ display: "contents" }}><dt>{r[0]}</dt><dd>{r[1]}</dd></div>)}
            <dt>Min. order</dt><dd>{p.minKg} kg</dd>
            <dt>Stok</dt><dd>{stockText(p)}</dd>
          </dl>
          {p.tiers.length > 1 && (<>
            <p className="lbl">Harga bertingkat</p>
            <table><thead><tr><th>Mulai (kg)</th><th>Harga/kg</th></tr></thead>
              <tbody>{p.tiers.map((t) => <tr key={t.min}><td>{t.min}+</td><td>{rp(t.price)}</td></tr>)}</tbody></table>
          </>)}
          <p className="note">Data teknis hanya ditampilkan jika sudah diverifikasi penjual.</p>
        </div>
      </div>

      <div className="order" style={{ maxWidth: 560, marginTop: 28 }}>
        <h2 style={{ fontSize: "1.3rem" }}>Pesan</h2>
        {sold ? (
          <p className="err">Produk ini sold out dan tidak bisa dipesan.{p.restock ? " " + p.restock : ""}</p>
        ) : (<>
          <div><span className="lbl">Ukuran kemasan</span>
            <div className="chips">{p.sizes.map((z) => (
              <button key={z} type="button" className="chip" aria-pressed={z === size} onClick={() => setSize(z)}>{z} kg</button>))}</div></div>
          <div><label htmlFor="packs">Jumlah kemasan</label>
            <input id="packs" type="number" min="1" value={packs}
              onChange={(e) => setPacks(Math.max(1, parseInt(e.target.value) || 1))} /></div>
          <div><label htmlFor="note">Catatan pesanan</label>
            <textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} /></div>
          <div>Kuantitas: <b>{qty} kg ({packs} × {size} kg)</b> · Harga: <b>{rp(unit)}</b>/kg</div>
          <div className="sub">Subtotal {rp(subtotal)}</div>
          <div className="err" role="alert">{problem}</div>
          <a className="btn" href={problem ? undefined : waLink(message)} target="_blank" rel="noopener noreferrer"
            aria-disabled={!!problem} disabled={!!problem} onClick={(e) => problem && e.preventDefault()}>Order via WhatsApp</a>
          <p className="note">Subtotal adalah estimasi. Stok, ongkir, dan pembayaran dikonfirmasi penjual; belum ada pesanan atau pembayaran sebelum itu.</p>
        </>)}
      </div>
    </div></section>
  );
}
