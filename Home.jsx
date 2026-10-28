import { PRODUCTS, SITE } from "./config.js";
import { BeanArt } from "./Photo.jsx";
import ProductCard from "./ProductCard.jsx";
import { uniq } from "./lib.js";
 
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
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <h1>Kopi Berkualitas, untuk Semua.</h1>
            <p className="lead">
              New Crafted mengkurasi green bean kopi pilihan untuk bisnis roastery, coffee shop, hingga home roaster, agar siapa pun dapat mengeksplorasi karakter kopi dan menciptakan cita rasa terbaiknya sendiri.
            </p>
            <div className="cta">
              <a className="btn" href="#/katalog">Explore Green Beans</a>
              <a className="btn alt" href="#/katalog?by=origin">Shop by Origin</a>
            </div>
          </div>
          <div className="beans">
            <BeanArt seed={7} />
            <span className="cap">Placeholder — ganti dengan foto green bean asli</span>
          </div>
        </div>
      </section>
      <section><div className="wrap"><h2>Produk</h2>
        <div className="grid">{featured.map((p) => <ProductCard key={p.id} p={p} />)}</div></div></section>
      <section style={{ background: "var(--sand)" }}><div className="wrap">
        <h2>Metode pascapanen</h2><Tiles field="process" param="process" />
      </div></section>
      <section><div className="wrap" style={{ maxWidth: 720 }}><h2>Tentang New Crafted</h2><p>{SITE.about}</p></div></section>
      <section><div className="wrap"><div className="band">
        <h2>Beli grosir atau minta penawaran</h2>
        <p>Butuh volume besar untuk roastery Anda? Sampaikan origin, proses, jumlah, dan budget.</p>
        <a className="btn" href="#/grosir">Minta penawaran</a>
      </div></div></section>
    </>
  );
}
 
