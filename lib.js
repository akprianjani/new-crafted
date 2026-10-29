import { PRODUCTS, SITE } from "./config.js";

export const rp = (n) => "Rp" + Math.round(n).toLocaleString("id-ID");

export const STATUS = {
  available: ["Available", "b-available"],
  limited: ["Limited Stock", "b-limited"],
  preorder: ["Pre-Order", "b-pre"],
  soldout: ["Sold Out", "b-sold"]
};

// Produk dianggap habis jika diset soldout, atau stok 0 dan bukan pre-order.
export const getStatus = (p) =>
  p.status === "soldout" || (p.status !== "preorder" && p.stockKg <= 0) ? "soldout" : p.status;

export const basePrice = (p) => p.tiers[0].price;
export const unitPrice = (p, qty) => p.tiers.reduce((cur, t) => (qty >= t.min ? t.price : cur), basePrice(p));

export const stockText = (p) => {
  const s = getStatus(p);
  if (s === "soldout") return "Habis";
  if (s === "preorder") return "Pre-order" + (p.restock ? " · " + p.restock : "");
  return `${p.stockKg} kg (angka dari penjual, bukan real-time)`;
};

export const waLink = (text) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
export const uniq = (key) => [...new Set(PRODUCTS.map((p) => p[key]).filter(Boolean))].sort();

/* ---------- Keranjang (dipakai juga oleh server di folder api/) ---------- */
export const sizeLabel = (kg) => (kg < 1 ? `${Math.round(kg * 1000)} g` : `${kg} kg`);

// Jumlah kemasan minimum agar total berat memenuhi minimum order produk.
export const minQty = (p, size) => Math.max(1, Math.ceil(p.minKg / size - 1e-9));

// Harga satu baris keranjang. Harga per kg mengikuti harga bertingkat berdasarkan total kg baris tersebut.
export function linePrice(p, size, qty) {
  const kg = size * qty;
  const unit = unitPrice(p, kg);
  const pack = Math.round(size * unit);
  return { kg, unit, pack, total: pack * qty };
}

// Mengembalikan teks masalah, atau "" jika baris keranjang valid.
export function checkLine(p, size, qty) {
  if (!p) return "Produk tidak ditemukan.";
  if (!p.sizes.includes(size)) return "Ukuran kemasan tidak tersedia.";
  if (!Number.isInteger(qty) || qty < 1 || qty > 1000) return "Jumlah tidak valid.";
  const s = getStatus(p), kg = size * qty;
  if (s === "soldout") return "Produk sold out.";
  if (kg < p.minKg - 1e-9) return `Minimum pembelian ${p.minKg} kg.`;
  if (s !== "preorder" && kg > p.stockKg + 1e-9) return `Melebihi stok tercatat (${p.stockKg} kg).`;
  return "";
}
