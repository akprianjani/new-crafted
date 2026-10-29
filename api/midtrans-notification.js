// Webhook dari Midtrans. Alamat ini diisi di dashboard Midtrans (Payment Notification URL).
// Tanda tangan diverifikasi; notifikasi palsu ditolak. Webhook TIDAK membuat transaksi baru,
// jadi notifikasi ganda dari Midtrans aman (idempoten). Status yang tampil ke pembeli selalu
// diambil dari API status Midtrans (api/order-status.js).
import { createHash, timingSafeEqual } from "node:crypto";

export function validSignature(n, serverKey) {
  const expected = createHash("sha512").update(`${n.order_id}${n.status_code}${n.gross_amount}${serverKey}`).digest("hex");
  const got = String(n.signature_key || "");
  return got.length === expected.length && timingSafeEqual(Buffer.from(got), Buffer.from(expected));
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) return res.status(503).json({ error: "payment_not_configured" });
  const n = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  if (!validSignature(n, serverKey)) return res.status(401).json({ error: "invalid_signature" });
  // Tempat menambahkan tindakan lanjutan (mis. kirim email/WhatsApp ke penjual) saat transaction_status = settlement/capture.
  console.log("Midtrans notifikasi", n.order_id, n.transaction_status, n.fraud_status || "");
  return res.status(200).json({ ok: true });
}
