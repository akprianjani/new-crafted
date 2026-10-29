import { PRODUCTS, SITE } from "./config.js";
import { useState } from "react";
import ProductCard from "./ProductCard.jsx";
import Banner from "./Banner.jsx";
import { uniq, getStatus } from "./lib.js";

// Foto utama hero: taruh file di public/images/hero.jpg. Jika belum ada, tampil panel kosong yang rapi.
const HERO_IMG = "/images/hero.jpg";

function HeroImage() {
  const [state, setState] = useState("loading"); // loading | ok | gagal
  return (
    <div className="hero-img">
      {state !== "gagal" && (
        <img src={HERO_IMG} alt="Green coffee beans pilihan New Crafted"
          style={{ opacity: state === "ok" ? 1 : 0 }}
          onLoad={() => setState("ok")} onError={() => setState("gagal")} />
      )}
    </div>
  );
}

function Tiles({ field, param }) {
  return (
    <div className="origin-row">
      {uniq(field).map((v) => (
        <a key={v} className="tile" href={`#/katalog?${param}=${encodeURIComponent(v)}`}>
          <b>{v}</b>
          <span className="meta">{PRODUCTS.filter((p) => p[field] === v).length} lot</span>
        </a>
      ))}
    </div>
  );
}

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured);
  const fresh = PRODUCTS.filter((p) => p.isNew || ["limited", "preorder"].includes(getStatus(p)));
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <h1>Kopi Berkualitas, <em>untuk Semua.</em></h1>
            <p className="lead">
              New Crafted mengkurasi green bean kopi pilihan untuk roastery, coffee shop, dan home roaster,
              agar siapa pun dapat mengeksplorasi karakter kopi dan menciptakan cita rasa terbaiknya sendiri.
            </p>
            <div className="cta">
              <a className="btn" href="#/katalog">Explore Green Beans</a>
              <a className="btn alt" href="#/katalog?by=origin">Shop by Origin</a>
            </div>
          </div>
          <HeroImage />
        </div>
      </section>
      <Banner />
      <section><div className="wrap"><div className="sechead"><h2>Produk <em>unggulan.</em></h2><a href="#/katalog">Lihat semua →</a></div>
        <div className="grid">{featured.map((p) => <ProductCard key={p.id} p={p} />)}</div></div></section>
      <section className="alt-bg"><div className="wrap">
        <h2>Belanja berdasarkan <em>origin.</em></h2><Tiles field="origin" param="origin" />
        <h2 style={{ marginTop: 36 }}>Metode <em>pascapanen.</em></h2><Tiles field="process" param="process" />
      </div></section>
      <section><div className="wrap"><div className="sechead"><h2>Baru, restock, <em>terbatas.</em></h2></div>
        <div className="grid">{fresh.map((p) => <ProductCard key={p.id} p={p} />)}</div></div></section>
      <section><div className="wrap" style={{ maxWidth: 720 }}><h2>Tentang New Crafted</h2><p>{SITE.about}</p></div></section>
      <section><div className="wrap"><div className="band">
        <h2>Beli grosir atau minta penawaran</h2>
        <p>Butuh volume besar untuk roastery Anda? Sampaikan origin, proses, jumlah, dan budget.</p>
        <a className="btn" href="#/grosir">Minta penawaran</a>
      </div></div></section>
    </>
  );
}
