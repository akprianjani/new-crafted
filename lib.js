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
