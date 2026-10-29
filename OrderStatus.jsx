import { useEffect, useMemo, useState } from "react";
import { rp } from "./lib.js";

const UI = {
  pending: ["Menunggu pembayaran", "Selesaikan pembayaran sebelum batas waktu. Halaman ini diperbarui otomatis."],
  paid: ["Pembayaran berhasil", "Terima kasih! Pembayaran sudah terkonfirmasi. Penjual akan memproses pesanan Anda dan menghubungi Anda soal ongkir dan pengiriman."],
  failed: ["Pembayaran gagal", "Pembayaran tidak berhasil. Anda bisa kembali ke katalog dan membuat pesanan baru."],
  expired: ["Pembayaran kedaluwarsa", "Batas waktu pembayaran sudah lewat. Silakan buat pesanan baru."],
  cancelled: ["Pesanan dibatalkan", "Pesanan ini dibatalkan. Hubungi penjual jika ini tidak sesuai."]
};
const METODE = { qris: "QRIS", bank_transfer: "Virtual Account", echannel: "Virtual Account (Mandiri)", credit_card: "Kartu debit/kredit", gopay: "GoPay / QRIS", shopeepay: "ShopeePay" };

export default function OrderStatus({ id }) {
  const [d, setD] = useState(null);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const sum = useMemo(() => { try { return JSON.parse(localStorage.getItem("nc-order-" + id)); } catch { return null; } }, [id]);

  useEffect(() => {
    let stop = false, t;
    async function load() {
      try {
        const r = await fetch(`/api/order-status?id=${encodeURIComponent(id)}`);
        const j = await r.json();
        if (stop) return;
        if (!r.ok) throw new Error();
        setD(j); setErr("");
        if (j.status === "pending") t = setTimeout(load, 5000);
      } catch { if (!stop) { setErr("Status pesanan belum bisa dimuat. Mencoba lagi…"); t = setTimeout(load, 10000); } }
    }
    load();
    return () => { stop = true; clearTimeout(t); };
  }, [id]);

  const st = d && UI[d.status];
  const copy = async () => { try { await navigator.clipboard.writeText(d.vaNumber); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* abaikan */ } };

  return (
    <section><div className="wrap" style={{ maxWidth: 720 }}>
      <h1 className="h1s">Status <em>pesanan.</em></h1>
      <div className="order">
        <div className="rowp"><span className="meta">Nomor pesanan</span><b>{id}</b></div>
        {!d && !err && <p>Memeriksa status pembayaran…</p>}
        {err && <p className="err" role="status">{err}</p>}
        {st && (<>
          <div><span className={`pill s-${d.status}`}>{st[0]}</span><p>{st[1]}</p></div>
          <div className="rowp"><span className="meta">Total pembayaran</span><b>{rp(d.total ?? sum?.total ?? 0)}</b></div>
          {d.paymentType && <div className="rowp"><span className="meta">Metode pembayaran</span><b>{METODE[d.paymentType] || d.paymentType}</b></div>}
          {d.status === "pending" && d.vaNumber && (
            <div className="rowp"><span>Nomor Virtual Account<br /><b className="mono">{d.vaNumber}</b></span>
              <button className="btn alt" onClick={copy}>{copied ? "Tersalin ✓" : "Salin nomor"}</button></div>)}
          {d.status === "pending" && sum?.payUrl && <a className="btn" href={sum.payUrl}>Lanjutkan pembayaran</a>}
        </>)}
        {sum?.items && (<div><p className="lbl">Ringkasan produk</p>
          <ul className="ul">{sum.items.map((i, k) => <li key={k}>{i.name} · {i.size} × {i.qty} · {rp(i.total)}</li>)}</ul></div>)}
        <a className="btn alt" href="#/katalog">Kembali ke katalog</a>
      </div>
    </div></section>
  );
}
