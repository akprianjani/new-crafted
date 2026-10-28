/* =====================================================================
   FILE INI ADALAH "PUSAT DATA" TOKO. Hampir semua yang perlu Anda ganti ada di sini.

   PENTING: semua data di bawah ini hanyalah CONTOH (Lot A–E).
   Nama lot, harga, dan stok BUKAN data asli New Crafted.
   Ganti semuanya, lalu ubah  usingSampleData  menjadi  false.
   ===================================================================== */

export const SITE = {
  brand: "New Crafted",
  whatsapp: "6281234567890",   // GANTI. Format: 62 + nomor tanpa 0 di depan. Tanpa tanda + atau spasi.
  instagram: "newcrafted.id",  // GANTI. Tanpa @
  usingSampleData: true,       // ubah ke false setelah data produk asli terisi (menghilangkan banner contoh)
  about:
    "Isi bagian ini dengan cerita singkat New Crafted: siapa Anda, bagaimana lot dipilih, dan dari mana biji dikirim. Tuliskan hanya hal yang bisa dibuktikan.",
  orderInfo:
    "Stok, ongkir, dan pembayaran dikonfirmasi penjual lewat WhatsApp sebelum pesanan diproses.",
  wholesaleInfo: [
    "Harga bertingkat tersedia untuk beberapa lot (lihat halaman produk).",
    "Isi informasi volume minimum, jadwal kirim, dan syarat pembelian grosir di sini."
  ]
};

/* ---------------------------------------------------------------------
   DAFTAR PRODUK. Salin satu blok { ... }, tempel di bawahnya, lalu ubah isinya.

   status   : "available" (tersedia) | "limited" (stok terbatas) | "preorder" | "soldout" (habis)
              Jika stockKg = 0 dan status bukan "preorder", produk otomatis dianggap Sold Out.
   stockKg  : stok dalam kilogram (angka). Ini angka yang Anda isi sendiri, bukan stok real-time.
   minKg    : minimum pembelian (kg)
   sizes    : pilihan ukuran kemasan dalam kg, contoh [1, 5, 10]
   tiers    : harga per kg. Baris pertama = harga dasar. Baris berikutnya = harga lebih murah
              untuk pembelian mulai sekian kg. Contoh: { min: 30, price: 140000 }
   img      : nama file foto di folder public/images, contoh "/images/lot-a.jpg". Kosong = gambar placeholder.
   flavor   : kata kunci rasa untuk filter, contoh ["fruity", "chocolate"]. Boleh kosong [].
   Field yang datanya belum ada: biarkan "" (kosong). Kolom kosong tidak akan ditampilkan.
   Jangan mengisi cupping, kadar air, sertifikasi, atau info kebun yang belum diverifikasi.
   --------------------------------------------------------------------- */
export const PRODUCTS = [
  {
    id: "contoh-a", name: "Contoh Lot A",
    origin: "Contoh Origin 1", region: "Contoh Region", farm: "", producer: "",
    process: "Washed", variety: "Contoh Varietas 1", altitude: "",
    notes: "", flavor: [], crop: "", moisture: "", density: "", screen: "", cupping: "",
    status: "available", stockKg: 120, minKg: 5, sizes: [1, 5, 10],
    tiers: [{ min: 1, price: 150000 }, { min: 30, price: 140000 }],
    restock: "", img: "", featured: true, isNew: true
  },
  {
    id: "contoh-b", name: "Contoh Lot B",
    origin: "Contoh Origin 2", region: "Contoh Region", farm: "", producer: "",
    process: "Natural", variety: "Contoh Varietas 2", altitude: "1400–1600 mdpl",
    notes: "Contoh: buah kering, cokelat", flavor: ["fruity", "chocolate"],
    crop: "", moisture: "", density: "", screen: "", cupping: "",
    status: "limited", stockKg: 25, minKg: 1, sizes: [1, 5],
    tiers: [{ min: 1, price: 185000 }],
    restock: "", img: "", featured: true, isNew: true
  },
  {
    id: "contoh-c", name: "Contoh Lot C",
    origin: "Contoh Origin 1", region: "Contoh Region 2", farm: "", producer: "",
    process: "Honey", variety: "Contoh Varietas 1", altitude: "",
    notes: "", flavor: [], crop: "", moisture: "", density: "", screen: "", cupping: "",
    status: "preorder", stockKg: 0, minKg: 10, sizes: [5, 10],
    tiers: [{ min: 1, price: 165000 }],
    restock: "Estimasi tiba: isi tanggal", img: "", featured: true
  },
  {
    id: "contoh-d", name: "Contoh Lot D",
    origin: "Contoh Origin 3", region: "", farm: "", producer: "",
    process: "Anaerobic", variety: "Contoh Varietas 3", altitude: "",
    notes: "Contoh: floral, manis", flavor: ["floral", "sweet"],
    crop: "", moisture: "", density: "", screen: "", cupping: "",
    status: "available", stockKg: 60, minKg: 1, sizes: [1, 5],
    tiers: [{ min: 1, price: 260000 }, { min: 20, price: 245000 }],
    restock: "", img: "", isNew: true
  },
  {
    id: "contoh-e", name: "Contoh Lot E",
    origin: "Contoh Origin 2", region: "Contoh Region", farm: "", producer: "",
    process: "Washed", variety: "Contoh Varietas 2", altitude: "",
    notes: "", flavor: [], crop: "", moisture: "", density: "", screen: "", cupping: "",
    status: "soldout", stockKg: 0, minKg: 5, sizes: [5],
    tiers: [{ min: 1, price: 140000 }],
    restock: "Restock: isi info", img: ""
  }
];
