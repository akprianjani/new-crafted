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
  const start = { ...EMPTY, origin: query.get("origin") || "", process: query.get("process") || "" };
  const [f, setF] = useState(start);
  const [open, setOpen] = useState(Boolean(start.origin || start.process));
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
      <h1 className="h1s">Katalog <em>green beans.</em></h1>
      <form className="toolbar" onSubmit={(e) => e.preventDefault()} aria-label="Cari dan filter produk">
        <div className="tb-main">
          <div><label className="sr" htmlFor="q">Cari</label>
            <input id="q" type="search" placeholder="Cari nama, origin, atau notes" value={f.q} onChange={(e) => set("q")(e.target.value)} /></div>
          <div><label className="sr" htmlFor="sort">Urutkan harga</label>
            <select id="sort" value={f.sort} onChange={(e) => set("sort")(e.target.value)}>
              <option value="">Urutkan: Default</option><option value="asc">Harga terendah</option><option value="desc">Harga tertinggi</option>
            </select></div>
        </div>
        <details className="fmore" open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
          <summary>Filter</summary>
          <div className="fgrid">
            <Select id="origin" label="Origin" value={f.origin} onChange={set("origin")} options={uniq("origin")} />
            <Select id="process" label="Process" value={f.process} onChange={set("process")} options={uniq("process")} />
            <Select id="variety" label="Varietas" value={f.variety} onChange={set("variety")} options={uniq("variety")} />
            <Select id="flavor" label="Karakter rasa" value={f.flavor} onChange={set("flavor")} options={flavors} />
            <Select id="stock" label="Ketersediaan" value={f.stock} onChange={set("stock")}
              options={Object.entries(STATUS).map(([k, v]) => [k, v[0]])} />
            <div><label htmlFor="max">Harga maks. per kg (Rp)</label>
              <input id="max" type="number" min="0" step="10000" value={f.max} onChange={(e) => set("max")(e.target.value)} /></div>
            <button className="btn alt" type="button" onClick={() => setF(EMPTY)}>Reset filter</button>
          </div>
        </details>
      </form>
      <p className="meta" aria-live="polite">{list.length} produk ditemukan</p>
      <div className="grid" style={{ marginTop: 16 }}>
        {list.length ? list.map((p) => <ProductCard key={p.id} p={p} />)
          : <p>Tidak ada produk yang cocok. Ubah atau reset filter.</p>}
      </div>
    </div></section>
  );
}
