/* =====================================================================
   FILE INI ADALAH "PUSAT DATA" TOKO. Hampir semua yang perlu Anda ganti ada di sini.
   ===================================================================== */

export const SITE = {
  brand: "New Crafted Coffee",
  whatsapp: "6281355246789",   // Format: 62 + nomor tanpa 0 di depan. Tanpa tanda + atau spasi.
  instagram: "newcraftedcoffee",  // Tanpa @
  usingSampleData: false,       // false = banner data contoh disembunyikan
  heroImg: "",                  // foto hero beranda, contoh "/images/hero.jpg" (file ada di folder public/images). Kosong = panel brand navy.
  about:
    "Kami hadir untuk memenuhi kebutuhan roastery dan Coffee Shop Anda.",
  orderInfo:
    "Produk yang dapat dipilih berarti tersedia. Ongkir dan detail pembayaran akan diinformasikan saat checkout.",
  wholesaleInfo: [
    "Pembelian minimal 1 kg.",
    "Pembayaran: transfer penuh sebelum pengiriman.",
    "Pembelian grosir mulai 30 kg per transaksi."
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
    id: "anaerobic-washed-mosto-double-fermentation",
    name: "Anaerobic Washed Mosto Double Fermentation",
    origin: "Indonesia", region: "Enrekang, Sulawesi Selatan (Pegunungan Latimojong)", farm: "", producer: "",
    process: "Washed", variety: "100% Arabika Kalosi", altitude: "",
    notes: "Contoh: buah kering, cokelat", flavor: [],
    crop: "", moisture: "", density: "", screen: "", cupping: "",
    status: "available", stockKg: 0, minKg: 1, sizes: [1],
    tiers: [{ min: 1, price: 295000 }],
    restock: "", img: "", featured: true
  },
  {
    id: "natural-anaerobic-slow-dry",
    name: "Natural Anaerobic Slow Dry",
    origin: "Indonesia", region: "Enrekang, Sulawesi Selatan (Pegunungan Latimojong)", farm: "", producer: "",
    process: "Natural", variety: "100% Arabika Kalosi", altitude: "",
    notes: "Contoh: buah kering, cokelat", flavor: [],
    crop: "", moisture: "", density: "", screen: "", cupping: "",
    status: "available", stockKg: 0, minKg: 1, sizes: [1],
    tiers: [{ min: 1, price: 295000 }],
    restock: "", img: "", featured: true
  },
  {
    id: "infused",
    name: "Infused",
    origin: "Indonesia", region: "Enrekang, Sulawesi Selatan (Pegunungan Latimojong)", farm: "", producer: "",
    process: "Washed atau Natural", variety: "100% Arabika Kalosi", altitude: "",
    notes: "Contoh: buah kering, cokelat", flavor: [],
    crop: "", moisture: "", density: "", screen: "", cupping: "",
    status: "available", stockKg: 0, minKg: 1, sizes: [1],
    tiers: [{ min: 1, price: 355000 }],
    restock: "", img: "", featured: true
  }
];
