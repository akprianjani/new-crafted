# New Crafted — Website Green Beans Kopi

Website toko green beans kopi. Pesanan masuk lewat WhatsApp. Tanpa login, database, atau pembayaran online.

> **Data contoh:** semua produk (Contoh Lot A–E), harga, stok, nomor WhatsApp, dan Instagram adalah **contoh**. Ganti sebelum dipublikasikan.

## Isi proyek (semua file ada di satu tingkat, tanpa folder)

- `config.js` → **buku menu & daftar harga**. Hampir semua yang Anda ubah ada di sini.
- `index.html`, `main.jsx`, `App.jsx`, `Home.jsx`, `Catalog.jsx`, `Detail.jsx`, `Wholesale.jsx`, `ProductCard.jsx`, `Photo.jsx`, `lib.js`, `styles.css` → mesin & tampilan. Tidak perlu disentuh.
- `package.json`, `vite.config.js` → daftar bahan & pengaturan. Tidak perlu disentuh.

## Mengganti data
Buka `config.js` (di GitHub: klik file → ikon pensil). Petunjuk ada di setiap bagian. Yang paling sering diubah: `whatsapp`, `instagram`, `about`, lalu di tiap produk: `tiers` (harga per kg), `stockKg`, `minKg`, `sizes`, `status`, `restock`.
Menambah produk: salin satu blok `{ ... }`, tempel di bawahnya, ubah `id` jadi unik. Field yang belum ada datanya biarkan `""`; tidak akan tampil. Setelah data asli lengkap, ubah `usingSampleData` menjadi `false`.

## Foto produk
Foto disimpan di folder `public/images`. Folder ini belum ada; buat satu kali di GitHub:
1. Di repository, **Add file → Create new file**.
2. Di kolom nama ketik: `public/images/mulai.txt` (garis miring otomatis membuat folder). Isi file bebas, misalnya "foto". **Commit changes**.
3. Buka folder `public/images`, **Add file → Upload files**, pilih foto (misalnya `lot-a.jpg`).
4. Di `config.js`, tulis `img: "/images/lot-a.jpg"` pada produknya.

## Menerbitkan (GitHub + Vercel, dari tablet)
Lihat panduan di chat. Ringkasnya: unggah semua file di atas (bukan ZIP) ke repository GitHub lewat **Add file → Upload files**, lalu **Import** repository itu di vercel.com dan klik **Deploy**. Vercel mengenali Vite otomatis.

## Jika katalog makin besar
- Puluhan produk: data di Google Sheets yang dibaca website.
- Ratusan produk / banyak admin / stok otomatis: CMS (Sanity, Strapi) atau database (Supabase). Ganti sumber data di `config.js`; tampilan tidak perlu dibuat ulang.
- Pembayaran online: pertimbangkan setelah penjualan via WhatsApp stabil.
