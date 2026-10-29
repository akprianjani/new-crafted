import { useEffect } from "react";
import Photo from "./Photo.jsx";
import { useCart } from "./cart.jsx";
import { rp, sizeLabel, minQty } from "./lib.js";

export default function CartDrawer() {
  const { open, setOpen, lines, subtotal, setQty, remove } = useCart();
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);
  if (!open) return null;
  const bad = lines.some((l) => l.error);
  const checkout = () => { setOpen(false); location.hash = "#/checkout"; };

  return (
    <div className="drawer-wrap">
      <div className="overlay" onClick={() => setOpen(false)} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Keranjang belanja">
        <div className="dhead"><h2>Keranjang</h2>
          <button className="xbtn" onClick={() => setOpen(false)} aria-label="Tutup keranjang">✕</button></div>
        {lines.length === 0 ? (
          <div className="dempty"><p>Keranjang masih kosong.</p>
            <a className="btn" href="#/katalog" onClick={() => setOpen(false)}>Lihat katalog</a></div>
        ) : (<>
          <ul className="dlist">
            {lines.map((l) => (
              <li key={l.id + l.size} className="dline">
                <div className="dthumb"><Photo product={l.p} /></div>
                <div className="dinfo">
                  <b>{l.p.name}</b>
                  <span className="meta">{sizeLabel(l.size)} · {rp(l.pack)} / kemasan</span>
                  {l.error && <span className="err">{l.error}</span>}
                  <div className="stepper">
                    <button aria-label="Kurangi" disabled={l.qty <= minQty(l.p, l.size)} onClick={() => setQty(l, l.qty - 1)}>−</button>
                    <span aria-live="polite">{l.qty}</span>
                    <button aria-label="Tambah" onClick={() => setQty(l, l.qty + 1)}>+</button>
                    <button className="linkbtn" onClick={() => remove(l)}>Hapus</button>
                  </div>
                </div>
                <b className="dtotal">{rp(l.total)}</b>
              </li>))}
          </ul>
          <div className="dfoot">
            <div className="rowp"><span>Subtotal</span><b>{rp(subtotal)}</b></div>
            <p className="note">Ongkir belum termasuk dan dikonfirmasi penjual.</p>
            <button className="btn block" onClick={checkout} disabled={bad}>Lanjut ke Pembayaran</button>
            {bad && <p className="err">Perbaiki item yang bermasalah dulu.</p>}
          </div>
        </>)}
      </aside>
    </div>
  );
}
