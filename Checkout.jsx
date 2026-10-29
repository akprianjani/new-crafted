import { useState } from "react";
import Photo from "./Photo.jsx";
import { useCart } from "./cart.jsx";
import { rp, sizeLabel, waLink } from "./lib.js";

const EMPTY = { nama: "", email: "", telepon: "", alamat: "", provinsi: "", kota: "", kecamatan: "", pos: "", catatan: "" };
export const normPhone = (v) => {
  let d = v.replace(/\D/g, "");
  if (d.startsWith("0")) d = "62" + d.slice(1); else if (d.startsWith("8")) d = "62" + d;
  return d;
};

export function validate(f) {
  const e = {};
  if (f.nama.trim().length < 2) e.nama = "Isi nama lengkap.";
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = "Isi email yang valid.";
  if (!/^62\d{8,13}$/.test(normPhone(f.telepon))) e.telepon = "Isi nomor telepon/WhatsApp yang valid, contoh 081234567890.";
  if (f.alamat.trim().length < 8) e.alamat = "Isi alamat lengkap (jalan, nomor, RT/RW).";
  ["provinsi", "kota", "kecamatan"].forEach((k) => { if (!f[k].trim()) e[k] = "Wajib diisi."; });
  if (!/^\d{5}$/.test(f.pos.trim())) e.pos = "Kode pos berisi 5 angka.";
  return e;
}

function Field({ id, label, err, f, set, type = "text", area, opt }) {
  const P = { id, value: f[id], onChange: (e) => set(id, e.target.value), "aria-invalid": !!err, "aria-describedby": err ? id + "-e" : undefined };
  return (
    <div className="fld">
      <label htmlFor={id}>{label}{opt ? " (opsional)" : ""}</label>
      {area ? <textarea {...P} /> : <input type={type} {...P} />}
      {err && <span className="err" id={id + "-e"}>{err}</span>}
    </div>
  );
}

export default function Checkout() {
  const { lines, subtotal, clear, setOpen } = useCart();
  const [f, setF] = useState(EMPTY);
  const [errs, setErrs] = useState({});
  const [method, setMethod] = useState("online");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const bad = lines.some((l) => l.error);

  const waText = () =>
`Halo New Crafted, saya ingin memesan green beans.

${lines.map((l) => `- ${l.p.name} (${l.p.origin}) ${sizeLabel(l.size)} × ${l.qty} = ${l.kg} kg, ${rp(l.unit)}/kg, ${rp(l.total)}`).join("\n")}

Subtotal: ${rp(subtotal)}

Nama: ${f.nama.trim()}
Telepon: ${normPhone(f.telepon)}
Email: ${f.email.trim()}
Alamat: ${f.alamat.trim()}, ${f.kecamatan.trim()}, ${f.kota.trim()}, ${f.provinsi.trim()} ${f.pos.trim()}${f.catatan.trim() ? `\nCatatan: ${f.catatan.trim()}` : ""}

Mohon informasi stok aktual, ongkir, dan cara pembayaran.`;

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    if (!lines.length || bad) return setMsg("Periksa keranjang Anda terlebih dahulu.");
    const er = validate(f);
    setErrs(er);
    const first = Object.keys(er)[0];
    if (first) { document.getElementById(first)?.focus(); return; }
    if (method === "wa") { window.open(waLink(waText()), "_blank", "noopener"); return; }

    setBusy(true);
    try {
      const r = await fetch("/api/create-order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lines.map((l) => ({ id: l.id, size: l.size, qty: l.qty })), buyer: { ...f, telepon: normPhone(f.telepon) } })
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.redirectUrl) throw new Error(d.error === "payment_not_configured" ? "nokey" : "gagal");
      try {
        localStorage.setItem("nc-order-" + d.orderId, JSON.stringify({
          payUrl: d.redirectUrl, total: d.total, nama: f.nama.trim(),
          items: lines.map((l) => ({ name: l.p.name, size: sizeLabel(l.size), qty: l.qty, total: l.total }))
        }));
      } catch { /* abaikan */ }
      clear();
      try { localStorage.removeItem("nc-cart-v1"); } catch { /* abaikan */ } // pastikan terhapus sebelum pindah halaman
      window.location.href = d.redirectUrl;
    } catch (err) {
      setMsg(err.message === "nokey"
        ? "Pembayaran online belum diaktifkan di toko ini. Silakan pesan lewat WhatsApp."
        : "Pembayaran online belum bisa dimulai. Coba lagi sebentar, atau pesan lewat WhatsApp.");
    } finally { setBusy(false); }
  }

  if (!lines.length) return (
    <section><div className="wrap"><h1>Checkout</h1><p>Keranjang Anda kosong.</p><a className="btn" href="#/katalog">Lihat katalog</a></div></section>);

  return (
    <section><div className="wrap">
      <p className="meta"><a href="#/katalog">← Lanjut belanja</a></p>
      <h1 className="h1s">Check<em>out.</em></h1>
      <form className="co" onSubmit={submit} noValidate>
        <div className="co-main">
          <fieldset><legend>1 · Informasi pembeli</legend>
            <div className="row two">
              <Field id="nama" label="Nama lengkap" err={errs.nama} f={f} set={set} />
              <Field id="telepon" label="Telepon / WhatsApp" err={errs.telepon} f={f} set={set} type="tel" />
            </div>
            <Field id="email" label="Email" err={errs.email} f={f} set={set} type="email" />
            <Field id="alamat" label="Alamat pengiriman" err={errs.alamat} f={f} set={set} area />
            <div className="row two">
              <Field id="provinsi" label="Provinsi" err={errs.provinsi} f={f} set={set} />
              <Field id="kota" label="Kota / Kabupaten" err={errs.kota} f={f} set={set} />
              <Field id="kecamatan" label="Kecamatan" err={errs.kecamatan} f={f} set={set} />
              <Field id="pos" label="Kode pos" err={errs.pos} f={f} set={set} />
            </div>
            <Field id="catatan" label="Catatan pesanan" f={f} set={set} area opt />
          </fieldset>

          <fieldset><legend>2 · Metode pembayaran</legend>
            <label className={`pay${method === "online" ? " on" : ""}`}>
              <input type="radio" name="m" checked={method === "online"} onChange={() => setMethod("online")} />
              <span><b>Bayar online</b><span className="meta">QRIS, Virtual Account, atau kartu debit/kredit. Anda memilih salah satunya di halaman pembayaran aman Midtrans.</span></span>
            </label>
            <label className={`pay${method === "wa" ? " on" : ""}`}>
              <input type="radio" name="m" checked={method === "wa"} onChange={() => setMethod("wa")} />
              <span><b>Pesan lewat WhatsApp</b><span className="meta">Kirim pesanan ke penjual. Stok, ongkir, dan pembayaran dikonfirmasi lewat chat.</span></span>
            </label>
          </fieldset>
        </div>

        <aside className="co-side" aria-label="Ringkasan pesanan">
          <h2>Ringkasan pesanan</h2>
          <ul className="dlist">
            {lines.map((l) => (
              <li key={l.id + l.size} className="dline">
                <div className="dthumb"><Photo product={l.p} /></div>
                <div className="dinfo"><b>{l.p.name}</b>
                  <span className="meta">{[l.p.process, sizeLabel(l.size)].filter(Boolean).join(" · ")} × {l.qty}</span>
                  <span className="meta">{rp(l.pack)} / kemasan</span>
                  {l.error && <span className="err">{l.error}</span>}</div>
                <b className="dtotal">{rp(l.total)}</b>
              </li>))}
          </ul>
          <div className="rowp"><span>Total belanja</span><b className="sub">{rp(subtotal)}</b></div>
          <p className="note">Ongkir belum termasuk. Biaya kirim dikonfirmasi penjual setelah alamat diterima.</p>
          {msg && <p className="err" role="alert">{msg}</p>}
          <button className="btn block" type="submit" disabled={busy || bad}>
            {busy ? "Memproses…" : method === "online" ? "Bayar sekarang" : "Kirim pesanan via WhatsApp"}</button>
          {msg && method === "online" && (
            <button type="button" className="btn alt block" style={{ marginTop: 10 }}
              onClick={() => { setMethod("wa"); const er = validate(f); setErrs(er); if (!Object.keys(er).length) window.open(waLink(waText()), "_blank", "noopener"); }}>
              Pesan lewat WhatsApp</button>)}
          <button type="button" className="linkbtn" onClick={() => setOpen(true)}>Ubah isi keranjang</button>
        </aside>
      </form>
    </div></section>
  );
}
