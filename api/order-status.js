// Mengambil status pembayaran langsung dari Midtrans (bukan dari browser), lalu menerjemahkannya.
const isProd = () => process.env.MIDTRANS_IS_PRODUCTION === "true";

export function mapStatus(s) {
  const t = s.transaction_status;
  if (t === "settlement" || (t === "capture" && s.fraud_status === "accept")) return "paid";
  if (t === "pending" || t === "authorize" || (t === "capture" && s.fraud_status === "challenge")) return "pending";
  if (t === "expire") return "expired";
  if (t === "cancel" || t === "refund" || t === "partial_refund" || t === "chargeback") return "cancelled";
  if (t === "deny" || t === "failure") return "failed";
  return "pending";
}

export default async function handler(req, res) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) return res.status(503).json({ error: "payment_not_configured" });
  const id = String(req.query?.id || "");
  if (!/^NC-[A-Z0-9-]{6,40}$/.test(id)) return res.status(400).json({ error: "invalid_id" });
  try {
    const base = isProd() ? "https://api.midtrans.com" : "https://api.sandbox.midtrans.com";
    const r = await fetch(`${base}/v2/${id}/status`, {
      headers: { Accept: "application/json", Authorization: "Basic " + Buffer.from(serverKey + ":").toString("base64") }
    });
    const s = await r.json().catch(() => ({}));
    // 404 = pesanan dibuat tetapi pembeli belum memilih metode pembayaran => masih menunggu
    if (String(s.status_code) === "404") return res.status(200).json({ orderId: id, status: "pending" });
    if (!r.ok && !s.transaction_status) return res.status(502).json({ error: "gateway_error" });
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      orderId: id, status: mapStatus(s), total: Number(s.gross_amount) || null, paymentType: s.payment_type || null,
      vaNumber: s.va_numbers?.[0]?.va_number || s.permata_va_number || s.bill_key || null
    });
  } catch (e) {
    return res.status(502).json({ error: "gateway_unreachable" });
  }
}
