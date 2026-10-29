import { useEffect, useState } from "react";
import { SITE, PRODUCTS } from "./config.js";
import { CartProvider, useCart } from "./cart.jsx";
import CartDrawer from "./CartDrawer.jsx";
import Home from "./Home.jsx";
import Catalog from "./Catalog.jsx";
import Detail from "./Detail.jsx";
import Wholesale from "./Wholesale.jsx";
import Checkout from "./Checkout.jsx";
import OrderStatus from "./OrderStatus.jsx";

// Router sederhana berbasis alamat "#/..." (tanpa library tambahan).
function useRoute() {
  const read = () => {
    const [path, qs] = (typeof location === "undefined" ? "/" : location.hash.slice(1) || "/").split("?");
    return { path, query: new URLSearchParams(qs || "") };
  };
  const [r, setR] = useState(read);
  useEffect(() => {
    const on = () => { setR(read()); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return r;
}

const NAV = [["/", "Beranda"], ["/katalog", "Katalog"], ["/grosir", "Grosir"]];

function Shell() {
  const { path, query } = useRoute();
  const { count, open, setOpen, toast } = useCart();
  const seg = path.split("/");
  const id = seg[1] === "produk" ? seg[2] : null;
  const orderId = seg[1] === "pesanan" ? seg[2] : null;

  useEffect(() => {
    const title = path === "/katalog" ? "Katalog green beans" : path === "/grosir" ? "Grosir" : path === "/checkout" ? "Checkout"
      : orderId ? "Status pesanan" : id ? (PRODUCTS.find((p) => p.id === id)?.name || "Produk") : "Kopi Berkualitas, untuk Semua";
    document.title = `${title} — ${SITE.brand}`;
  }, [path, id, orderId]);

  let page = <Home />;
  if (path === "/katalog") page = <Catalog key={query.toString()} query={query} />;
  else if (id) page = <Detail key={id} id={id} />;
  else if (path === "/grosir") page = <Wholesale />;
  else if (path === "/checkout") page = <Checkout />;
  else if (orderId) page = <OrderStatus key={orderId} id={orderId} />;

  return (
    <>
      <a className="skip" href="#konten" onClick={(e) => { e.preventDefault(); document.getElementById("konten")?.focus(); }}>Lewati ke konten</a>
      {SITE.usingSampleData && (
        <div className="demo">Data contoh: nama lot, harga, dan stok adalah placeholder, bukan produk asli. Ganti di config.js.</div>
      )}
      <header className="top"><div className="wrap">
        <a className="logo" href="#/">{SITE.brand}</a>
        <nav aria-label="Menu utama">
          {NAV.map(([r, l]) => (
            <a key={r} href={`#${r}`} aria-current={r === path || (r === "/katalog" && id) ? "page" : undefined}>{l}</a>))}
          <button className="cartbtn" onClick={() => setOpen(true)} aria-label={`Buka keranjang, ${count} item`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
            {count > 0 && <span className="cnt">{count}</span>}
          </button>
        </nav>
      </div></header>
      <main id="konten" tabIndex={-1}>{page}</main>
      <footer><div className="wrap">
        <div><b>{SITE.brand}</b><p>Specialty green coffee beans untuk roastery, coffee shop, dan roaster rumahan.</p></div>
        <div><b>Kontak</b><p>
          <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp</a><br />
          <a href={`https://instagram.com/${SITE.instagram}`} target="_blank" rel="noopener noreferrer">Instagram @{SITE.instagram}</a></p></div>
        <div><b>Informasi pemesanan</b><p>{SITE.orderInfo}</p></div>
      </div></footer>
      <CartDrawer />
      {toast && !open && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    </>
  );
}

export default function App() {
  return <CartProvider><Shell /></CartProvider>;
}
