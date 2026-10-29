// Membuat transaksi Midtrans Snap. Harga SELALU dihitung ulang di server dari config.js (bukan dari browser).
import { PRODUCTS } from "../config.js";
import { checkLine, linePrice, sizeLabel } from "../lib.js";

const isProd = () => process.env.MIDTRANS_IS_PRODUCTION === "true";
const SNAP = () => (isProd() ? "https://app.midtrans.com" : "https://app.sandbox.midtrans.com") + "/snap/v1/transactions";
const str = (v, max) => String(v ?? "").trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) return res.status(503).json({ error: "payment_not_configured" });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const { items, buyer = {} } = body;
  if (!Array.isArray(items) || items.length < 1 || items.length > 30) return res.status(400).json({ error: "invalid_items" });

  // 1. Validasi item dan hitung harga dari data server
  const details = [];
  let gross = 0;
  for (const it of items) {
    const p = PRODUCTS.find((x) => x.id === it.id);
    const size = Number(it.size), qty = Number(it.qty);
    const problem = checkLine(p, size, qty);
    if (problem) return res.status(400).json({ error: "invalid_item", message: `${p?.name || it.id}: ${problem}` });
    const { pack } = linePrice(p, size, qty);
    details.push({ id: `${p.id}-${size}`, price: pack, quantity: qty, name: `${p.name} ${sizeLabel(size)}`.slice(0, 50) });
    gross += pack * qty;
  }

  // 2. Validasi data pembeli
  const b = { nama: str(buyer.nama, 60), email: str(buyer.email, 80), telepon: str(buyer.telepon, 20), alamat: str(buyer.alamat, 120),
    provinsi: str(buyer.provinsi, 40), kota: str(buyer.kota, 40), kecamatan: str(buyer.kecamatan, 40), pos: str(buyer.pos, 5), catatan: str(buyer.catatan, 80) };
  if (b.nama.length < 2 || !/^\S+@\S+\.\S+$/.test(b.email) || !/^62\d{8,13}$/.test(b.telepon) || b.alamat.length < 8 ||
      !b.provinsi || !b.kota || !b.kecamatan || !/^\d{5}$/.test(b.pos)) return res.status(400).json({ error: "invalid_buyer" });

  // 3. Buat transaksi di Midtrans
  const orderId = `NC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const address = `${b.alamat}, ${b.kecamatan}, ${b.provinsi}${b.catatan ? ` | Catatan: ${b.catatan}` : ""}`.slice(0, 200);
  const payload = {
    transaction_details: { order_id: orderId, gross_amount: gross },
    item_details: details,
    customer_details: { first_name: b.nama, email: b.email, phone: b.telepon,
      shipping_address: { first_name: b.nama, phone: b.telepon, address, city: b.kota, postal_code: b.pos, country_code: "IDN" } },
    callbacks: { finish: `https://${host}/#/pesanan/${orderId}` }
  };
  try {
    const r = await fetch(SNAP(), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json",
        Authorization: "Basic " + Buffer.from(serverKey + ":").toString("base64") },
      body: JSON.stringify(payload)
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || !data.redirect_url) {
      console.error("Midtrans error", r.status, JSON.stringify(data).slice(0, 300));
      return res.status(502).json({ error: "gateway_error" });
    }
    return res.status(200).json({ orderId, redirectUrl: data.redirect_url, total: gross });
  } catch (e) {
    console.error("Midtrans fetch gagal", e.message);
    return res.status(502).json({ error: "gateway_unreachable" });
  }
}
