import { useMemo, useState } from "react";
import { PRODUCTS } from "./config.js";
import ProductCard from "./ProductCard.jsx";
import { STATUS, getStatus, basePrice, uniq } from "./lib.js";

const EMPTY = { q: "", origin: "", process: "", variety: "", flavor: "", stock: "", max: "", sort: "" };

function Select({ id, label, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Semua</option>
        {options.map((o) => (Array.isArray(o)
          ? <option key={o[0]} value={o[0]}>{o[1]}</option>
          : <option key={o}>{o}</option>))}
      </select>
    </div>
  );
}

export default function Catalog({ query }) {
  const [f, setF] = useState({ ...EMPTY, origin: query.get("origin") || "", process: query.get("process") || "" });
  const set = (k) => (v) => setF((x) => ({ ...x, [k]: v }));
  const flavors = [...new Set(PRODUCTS.flatMap((p) => p.flavor || []))].sort();

  const list = useMemo(() => {
    const q = f.q.toLowerCase();
    const r = PRODUCTS.filter((p) =>
      (!q || [p.name, p.origin, p.region, p.process, p.variety, p.notes].join(" ").toLowerCase().includes(q)) &&
      (!f.origin || p.origin === f.origin) && (!f.process || p.process === f.process) &&
      (!f.variety || p.variety === f.variety) && (!f.flavor || (p.flavor || []).includes(f.flavor)) &&
      (!f.stock || getStatus(p) === f.stock) && (!f.max || basePrice(p) <= Number(f.max)));
    if (f.sort) r.sort((a, b) => (f.sort === "asc" ? basePrice(a) - basePrice(b) : basePrice(b) - basePrice(a)));
    return r;
  }, [f]);

  return (
    <section><div className="wrap">
      <h1 style={{ fontSize: "2.4rem" }}>Katalog green beans</h1>
      <div className="cat">
        <form className="filters" onSubmit={(e) => e.preventDefault()} aria-label="Filter produk">
          <div><label htmlFor="q">Cari</label>
            <input id="q" type="search" placeholder="Nama, origin, notes" value={f.q} onChange={(e) => set("q")(e.target.value)} /></div>
          <Select id="origin" label="Origin" value={f.origin} onChange={set("origin")} options={uniq("origin")} />
          <Select id="process" label="Process" value={f.process} onChange={set("process")} options={uniq("process")} />
          <Select id="variety" label="Varietas" value={f.variety} onChange={set("variety")} options={uniq("variety")} />
          <Select id="flavor" label="Karakter rasa" value={f.flavor} onChange={set("flavor")} options={flavors} />
          <Select id="stock" label="Ketersediaan" value={f.stock} onChange={set("stock")}
            options={Object.entries(STATUS).map(([k, v]) => [k, v[0]])} />
          <div><label htmlFor="max">Harga maks. per kg (Rp)</label>
            <input id="max" type="number" min="0" step="10000" value={f.max} onChange={(e) => set("max")(e.target.value)} /></div>
          <div><label htmlFor="sort">Urutkan harga</label>
            <select id="sort" value={f.sort} onChange={(e) => set("sort")(e.target.value)}>
              <option value="">Default</option><option value="asc">Terendah</option><option value="desc">Tertinggi</option>
            </select></div>
          <button className="btn alt" type="button" onClick={() => setF(EMPTY)}>Reset filter</button>
        </form>
        <div>
          <p className="meta" aria-live="polite">{list.length} produk ditemukan</p>
          <div className="grid">
            {list.length ? list.map((p) => <ProductCard key={p.id} p={p} />)
              : <p>Tidak ada produk yang cocok. Ubah atau reset filter.</p>}
          </div>
        </div>
      </div>
    </div></section>
  );
}
