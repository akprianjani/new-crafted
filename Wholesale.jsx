import { useState } from "react";
import { SITE } from "./config.js";
import { rp, uniq, waLink } from "./lib.js";

export default function Wholesale() {
  const [v, setV] = useState({ name: "", origin: "", process: "", qty: "", budget: "", notes: "" });
  const [err, setErr] = useState("");
  const set = (k) => (e) => setV((x) => ({ ...x, [k]: e.target.value }));

  const send = () => {
    if (!v.name.trim() || !v.qty) return setErr("Isi nama/usaha dan kuantitas.");
    setErr("");
    const text =
`Halo New Crafted, saya ingin meminta penawaran green beans.

Nama/usaha: ${v.name.trim()}
Origin: ${v.origin || "-"}
Process: ${v.process || "-"}
Kuantitas: ${v.qty} kg
Budget: ${v.budget ? rp(+v.budget) + "/kg" : "-"}
Catatan: ${v.notes.trim() || "-"}`;
    window.open(waLink(text), "_blank", "noopener");
  };

  const sel = (id, label, key, opts) => (
    <div><label htmlFor={id}>{label}</label>
      <select id={id} value={v[key]} onChange={set(key)}>
        <option value="">Belum menentukan</option>{opts.map((o) => <option key={o}>{o}</option>)}</select></div>);

  return (
    <section><div className="wrap" style={{ maxWidth: 760 }}>
      <h1 style={{ fontSize: "2.4rem" }}>Grosir & permintaan penawaran</h1>
      <p>Untuk roastery dan coffee shop dengan kebutuhan rutin atau volume besar. Permintaan dikirim lewat WhatsApp; penjual membalas dengan penawaran harga dan ketersediaan.</p>
      <ul className="ul">{SITE.wholesaleInfo.map((t) => <li key={t}>{t}</li>)}</ul>
      <form className="order" onSubmit={(e) => e.preventDefault()}>
        <div className="row two">
          <div><label htmlFor="w1">Nama / usaha</label><input id="w1" value={v.name} onChange={set("name")} /></div>
          {sel("w2", "Origin yang dicari", "origin", uniq("origin"))}
          {sel("w3", "Process", "process", uniq("process"))}
          <div><label htmlFor="w4">Kuantitas (kg)</label><input id="w4" type="number" min="1" value={v.qty} onChange={set("qty")} /></div>
        </div>
        <div><label htmlFor="w5">Budget per kg (Rp, opsional)</label><input id="w5" type="number" min="0" value={v.budget} onChange={set("budget")} /></div>
        <div><label htmlFor="w6">Catatan kebutuhan</label><textarea id="w6" value={v.notes} onChange={set("notes")} /></div>
        <button className="btn" type="button" onClick={send}>Kirim via WhatsApp</button>
        <p className="err" role="alert">{err}</p>
      </form>
    </div></section>
  );
}
