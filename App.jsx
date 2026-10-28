import { useEffect, useState } from "react";
import { SITE, PRODUCTS } from "./config.js";
import Home from "./Home.jsx";
import Catalog from "./Catalog.jsx";
import Detail from "./Detail.jsx";
import Wholesale from "./Wholesale.jsx";

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

export default function App() {
  const { path, query } = useRoute();
  const id = path.startsWith("/produk/") ? path.split("/")[2] : null;

  useEffect(() => {
    const title = path === "/katalog" ? "Katalog green beans" : path === "/grosir" ? "Grosir"
      : id ? (PRODUCTS.find((p) => p.id === id)?.name || "Produk") : "New Crafted Coffee";
    document.title = `${title} — ${SITE.brand}`;
  }, [path, id]);

  let page = <Home />;
  if (path === "/katalog") page = <Catalog key={query.toString()} query={query} />;
  else if (id) page = <Detail key={id} id={id} />;
  else if (path === "/grosir") page = <Wholesale />;

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
    </>
  );
}
