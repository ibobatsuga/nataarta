# NataArta — POS Bakso Pak Darto 🍲

**NataArta** adalah sistem aplikasi kasir pintar (*Point of Sale*) offline yang dirancang khusus untuk operasional **Bakso Pak Darto**. Cepat, ringan, responsif, dan siap cetak nota thermal 58mm langsung dari perangkat kasir (HP/Tablet/Laptop).

---

## 🍲 Fitur & Modul

1. **Terminal Kasir Cepat:**
   - Katalog menu lengkap (Bakso Kuah, Mie Ayam, Minuman Segar, dan Pelengkap).
   - Filter instan per kategori & pencarian cepat nama menu.
   - Panel pesanan meja dengan stepper porsi, hitung subtotal, diskon fleksibel, dan total otomatis.
2. **Kalkulator Pembayaran & Uang Cepat:**
   - Pilihan metode: **Tunai**, **QRIS**, dan **Transfer Bank**.
   - Tombol uang pas & pecahan cepat (+10rb, +20rb, +50rb, +100rb).
   - Numpad sentuh virtual dengan perhitungan kembalian otomatis.
3. **Cetak Nota Thermal 58mm:**
   - Desain nota monospaced profesional yang presisi untuk printer thermal Bluetooth / USB 58mm.
4. **Manajemen Porsi & Stok:**
   - Stok berkurang otomatis setiap kali pesanan lunas.
   - Fitur pembatalan transaksi yang otomatis mengembalikan porsi menu ke stok dapur.
5. **Laporan & Statistik Penjualan:**
   - Rekap omzet, total transaksi, estimasi laba kotor, dan jumlah mangkok/porsi terjual.
   - Filter periode: Hari Ini, 7 Hari, Bulan Ini, dan Semua.
   - Top 5 menu paling laris.
6. **Keamanan & Backup:**
   - Kunci layar PIN kasir (PIN Bawaan: `1234`).
   - Ekspor/impor cadangan JSON.
   - Ekspor rekap transaksi ke CSV untuk pembukuan Excel.
7. **PWA (Progressive Web App):**
   - Dilengkapi Service Worker (`sw.js`) dan web manifest.
   - Bisa dipasang di layar utama (Add to Home Screen) dan berjalan 100% tanpa internet.

---

## 💻 Panduan Menjalankan

Aplikasi ini berbasis web standar (HTML5, CSS3, Vanilla JS):
- Buka langsung `index.html` di browser apa pun.
- Atau jalankan dengan web server lokal / deploy ke Vercel.
