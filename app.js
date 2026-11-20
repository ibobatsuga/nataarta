/**
 * NataArta — Aplikasi Kasir POS Modern Bakso Pak Darto
 * Offline-first POS system with modern Apple/Square-inspired interface.
 */

(() => {
  'use strict';

  // Key penyimpanan lokal spesifik NataArta
  const STORAGE_KEY = 'nataarta_pos_data_v2';
  const LEGACY_KEY = 'nataarta_pos_data_v1';

  // Gambar default beresolusi tinggi untuk menu kuliner Bakso & Minuman
  const GAMBAR_MENU = {
    'b1': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80',
    'b2': 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=500&auto=format&fit=crop&q=80',
    'b3': 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&auto=format&fit=crop&q=80',
    'b4': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&auto=format&fit=crop&q=80',
    'b5': 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80',
    'm1': 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80',
    'm2': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80',
    'p1': 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=500&auto=format&fit=crop&q=80',
    'p2': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    'p3': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80',
    'd1': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=80',
    'd2': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80',
    'd3': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=80',
    'd4': 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80'
  };

  // Data awal menu Bakso Pak Darto
  const DATA_AWAL = {
    toko: {
      nama: 'Bakso Pak Darto',
      alamat: 'Jl. Kuliner Nusantara No. 12',
      telp: '0812-9876-5432',
      pesanStruk: 'Matur nuwun sampun rawuh! Nikmat kuahnya, mantap baksonya.',
      kunciPin: false,
      pin: '1234',
      pajakAktif: false,
      persenPajak: 10
    },
    kasirAktif: 'Pak Darto',
    mejaAktif: '07',
    jumlahTamu: 4,
    produk: [
      { id: 'b1', nama: 'Bakso Urat Granat', kategori: 'Bakso Kuah', harga: 25000, modal: 15000, stok: 50, kode: 'BKS-01', tags: ['🍲', '🌶️'], gambar: GAMBAR_MENU['b1'] },
      { id: 'b2', nama: 'Bakso Halus Kuah Kaldu', kategori: 'Bakso Kuah', harga: 22000, modal: 13000, stok: 60, kode: 'BKS-02', tags: ['🍲', '✨'], gambar: GAMBAR_MENU['b2'] },
      { id: 'b3', nama: 'Bakso Telur Spesial', kategori: 'Bakso Kuah', harga: 24000, modal: 14000, stok: 40, kode: 'BKS-03', tags: ['🍲', '🥚'], gambar: GAMBAR_MENU['b3'] },
      { id: 'b4', nama: 'Bakso Keju Lumer', kategori: 'Bakso Kuah', harga: 26000, modal: 16000, stok: 35, kode: 'BKS-04', tags: ['🍲', '🧀'], gambar: GAMBAR_MENU['b4'] },
      { id: 'b5', nama: 'Bakso Iga Sapi Jumbo', kategori: 'Bakso Kuah', harga: 38000, modal: 24000, stok: 8, kode: 'BKS-05', tags: ['🍲', '👑'], gambar: GAMBAR_MENU['b5'] },
      { id: 'm1', nama: 'Mie Ayam Bakso Pangsit', kategori: 'Mie Ayam', harga: 20000, modal: 11000, stok: 45, kode: 'MIE-01', tags: ['🍜', '🥟'], gambar: GAMBAR_MENU['m1'] },
      { id: 'm2', nama: 'Mie Ayam Komplit', kategori: 'Mie Ayam', harga: 24000, modal: 13000, stok: 30, kode: 'MIE-02', tags: ['🍜', '⭐'], gambar: GAMBAR_MENU['m2'] },
      { id: 'p1', nama: 'Pangsit Goreng Renyah', kategori: 'Pelengkap', harga: 5000, modal: 2000, stok: 80, kode: 'PLG-01', tags: ['🥟', '🔥'], gambar: GAMBAR_MENU['p1'] },
      { id: 'p2', nama: 'Tahu Bakso Kukus', kategori: 'Pelengkap', harga: 8000, modal: 4000, stok: 50, kode: 'PLG-02', tags: ['🥟', '🌿'], gambar: GAMBAR_MENU['p2'] },
      { id: 'p3', lang: 'id', nama: 'Lontong Bungkus Daun', kategori: 'Pelengkap', harga: 4000, modal: 1500, stok: 6, kode: 'PLG-03', tags: ['🍃'], gambar: GAMBAR_MENU['p3'] },
      { id: 'd1', nama: 'Es Teh Manis Jumbo', kategori: 'Minuman', harga: 5000, modal: 1500, stok: 120, kode: 'MNM-01', tags: ['❄️', '🥤'], gambar: GAMBAR_MENU['d1'] },
      { id: 'd2', nama: 'Es Jeruk Peras Segar', kategori: 'Minuman', harga: 8000, modal: 3500, stok: 80, kode: 'MNM-02', tags: ['❄️', '🍊'], gambar: GAMBAR_MENU['d2'] },
      { id: 'd3', nama: 'Es Campur Durian', kategori: 'Minuman', harga: 18000, modal: 10000, stok: 30, kode: 'MNM-03', tags: ['❄️', '🍨'], gambar: GAMBAR_MENU['d3'] },
      { id: 'd4', nama: 'Air Mineral Botol', kategori: 'Minuman', harga: 4000, modal: 2000, stok: 10, kode: 'MNM-04', tags: ['💧'], gambar: GAMBAR_MENU['d4'] }
    ],
    transaksi: [
      {
        invoice: 'INV-20261121-0001',
        waktu: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        kasir: 'Pak Darto',
        meja: '07',
        items: [
          { id: 'b1', nama: 'Bakso Urat Granat', harga: 25000, qty: 2, modal: 15000, catatan: 'Kuah pedas' },
          { id: 'd1', nama: 'Es Teh Manis Jumbo', harga: 5000, qty: 2, modal: 1500, catatan: 'Manis sedang' }
        ],
        subtotal: 60000,
        diskon: 0,
        pajak: 0,
        total: 60000,
        bayar: 100000,
        kembali: 40000,
        metode: 'Tunai',
        status: 'Lunas'
      },
      {
        invoice: 'INV-20261121-0002',
        waktu: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
        kasir: 'Pak Darto',
        meja: '03',
        items: [
          { id: 'm1', nama: 'Mie Ayam Bakso Pangsit', harga: 20000, qty: 1, modal: 11000 },
          { id: 'p1', nama: 'Pangsit Goreng Renyah', harga: 5000, qty: 1, modal: 2000 },
          { id: 'd2', nama: 'Es Jeruk Peras Segar', harga: 8000, qty: 1, modal: 3500 }
        ],
        subtotal: 33000,
        diskon: 0,
        pajak: 0,
        total: 33000,
        bayar: 33000,
        kembali: 0,
        metode: 'QRIS',
        status: 'Lunas'
      }
    ]
  };

  // State runtime
  let state = muatData();
  let keranjang = [];
  let diskon = 0;
  let pinBuffer = '';
  let kategoriAktif = 'Semua';
  let uangDiterima = 0;
  let periodeLaporan = 'hari';
  let grafikRange = 'week'; // week, month, year
  let activeTabId = 'hal-beranda';

  // Ikon emoji per kategori
  const IKON_KAT = {
    'Bakso Kuah': '🍲',
    'Mie Ayam': '🍜',
    'Minuman': '🥤',
    'Pelengkap': '🥟',
    'Default': '🍴'
  };

  // Format Rupiah
  const fmtRp = (num) => 'Rp' + Number(num || 0).toLocaleString('id-ID');

  // Generator Invoice ID
  function buatNomorInvoice() {
    const d = new Date();
    const tgl = d.getFullYear().toString() +
      String(d.getMonth() + 1).padStart(2, '0') +
      String(d.getDate()).padStart(2, '0');
    const urut = String(state.transaksi.length + 1).padStart(4, '0');
    return `INV-${tgl}-${urut}`;
  }

  // Muat & Simpan Data
  function muatData() {
    try {
      let tersimpan = localStorage.getItem(STORAGE_KEY);
      if (!tersimpan) {
        // Coba periksa legacy
        tersimpan = localStorage.getItem(LEGACY_KEY);
      }
      if (tersimpan) {
        const parsed = JSON.parse(tersimpan);
        const data = Object.assign({}, DATA_AWAL, parsed);
        // Pastikan setiap produk memiliki gambar & tags
        data.produk = data.produk.map((p) => {
          if (!p.gambar && GAMBAR_MENU[p.id]) p.gambar = GAMBAR_MENU[p.id];
          if (!p.tags) p.tags = [IKON_KAT[p.kategori] || '🍴'];
          return p;
        });
        return data;
      }
    } catch (e) {
      console.warn('Gagal memuat localStorage:', e);
    }
    return JSON.parse(JSON.stringify(DATA_AWAL));
  }

  function simpanData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      alert('Penyimpanan lokal penuh!');
    }
  }

  // Helper DOM
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  // ----------------------------------------------------
  // NAVIGASI TAB (Bottom Floating Dock & Breadcrumbs)
  // ----------------------------------------------------
  function gantiTab(targetId) {
    activeTabId = targetId;

    $$('.dock-btn').forEach((b) => {
      b.classList.toggle('aktif', b.dataset.target === targetId);
    });

    $$('.halaman').forEach((h) => {
      h.classList.toggle('aktif', h.id === targetId);
    });

    // Update label breadcrumb
    const mapLabel = {
      'hal-beranda': 'beranda',
      'hal-kasir': 'kasir',
      'hal-produk': 'menu',
      'hal-meja': 'meja',
      'hal-riwayat': 'riwayat',
      'hal-laporan': 'laporan',
      'hal-pengaturan': 'pengaturan'
    };
    const labelEl = $('#labelHalamanAktif');
    if (labelEl) labelEl.textContent = mapLabel[targetId] || targetId;

    // Tampilkan / sembunyikan kategori filter di header saat di tab kasir
    const headerKat = $('#wadahKategoriHeader');
    if (headerKat) {
      headerKat.hidden = (targetId !== 'hal-kasir');
    }

    if (targetId === 'hal-beranda') renderDashboard();
    if (targetId === 'hal-kasir') {
      renderKategori();
      renderGridProduk();
      renderKeranjang();
    }
    if (targetId === 'hal-meja') renderDenahMeja();
    if (targetId === 'hal-produk') renderTabelProduk();
    if (targetId === 'hal-riwayat') renderTabelRiwayat();
    if (targetId === 'hal-laporan') renderLaporan();
    if (targetId === 'hal-pengaturan') renderPengaturan();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function aturNavigasi() {
    $$('.dock-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        gantiTab(btn.dataset.target);
      });
    });

    // Tombol view all di dashboard
    $('#btnLihatSemuaRiwayat')?.addEventListener('click', () => gantiTab('hal-riwayat'));
    $('#btnLihatSemuaMenuPop')?.addEventListener('click', () => gantiTab('hal-produk'));
    $('#btnLihatSemuaMenuLess')?.addEventListener('click', () => gantiTab('hal-produk'));

    // Klik banner warning low stock
    $('#bannerStokMenipis')?.addEventListener('click', () => {
      gantiTab('hal-produk');
      const input = $('#cariTabelProduk');
      if (input) {
        input.value = '';
      }
    });

    // Quick Action Cards di Dashboard
    $('#kpiSalesCard')?.addEventListener('click', () => gantiTab('hal-laporan'));
    $('#kpiOrderCard')?.addEventListener('click', () => gantiTab('hal-riwayat'));
    $('#kpiAvgCard')?.addEventListener('click', () => gantiTab('hal-laporan'));
    $('#kpiTablesCard')?.addEventListener('click', () => gantiTab('hal-meja'));
  }

  // Jam Realtime
  function aturJam() {
    const update = () => {
      const d = new Date();
      const jam = String(d.getHours()).padStart(2, '0');
      const mnt = String(d.getMinutes()).padStart(2, '0');
      const el = $('#jamLive');
      if (el) el.textContent = `${jam}:${mnt}`;
    };
    update();
    setInterval(update, 1000);
  }

  // ----------------------------------------------------
  // DASHBOARD (Ref Gambar 1: KPI, Chart, Recent, Popular)
  // ----------------------------------------------------
  function renderDashboard() {
    const sekarang = new Date();
    const transaksiLunas = state.transaksi.filter((t) => t.status === 'Lunas');

    // Transaksi Hari Ini
    const trxHariIni = transaksiLunas.filter((t) => {
      const d = new Date(t.waktu);
      return d.toDateString() === sekarang.toDateString();
    });

    const salesHariIni = trxHariIni.reduce((acc, t) => acc + t.total, 0);
    const totalOrderHariIni = trxHariIni.length;
    const avgOrder = totalOrderHariIni > 0 ? Math.round(salesHariIni / totalOrderHariIni) : 0;

    // Meja Aktif (terisi)
    const mejaTerisi = hitungMejaTerisi();
    const totalMeja = 19;

    // Update KPI UI
    const elSales = $('#statTodaySales');
    const elOrders = $('#statTotalOrders');
    const elAvg = $('#statAvgOrder');
    const elTables = $('#statActiveTables');

    if (elSales) elSales.textContent = fmtRp(salesHariIni);
    if (elOrders) elOrders.textContent = totalOrderHariIni.toString();
    if (elAvg) elAvg.textContent = fmtRp(avgOrder);
    if (elTables) elTables.textContent = `${mejaTerisi}/${totalMeja}`;

    // Low stock items banner
    const lowStockItems = state.produk.filter((p) => p.stok <= 10);
    const bannerEl = $('#bannerStokMenipis');
    const teksStok = $('#teksStokMenipis');
    if (bannerEl && teksStok) {
      if (lowStockItems.length > 0) {
        bannerEl.hidden = false;
        teksStok.textContent = `${lowStockItems.length} menu hampir habis porsi stok (perlu restok)`;
      } else {
        bannerEl.hidden = true;
      }
    }

    // Render Chart SVG
    renderSalesChart();

    // Render Recent Orders
    renderRecentOrders();

    // Render Popular & Less Sell Sidebars
    renderSideMenuDashboard();
  }

  function hitungMejaTerisi() {
    // Estimasi meja terisi dari transaksi aktif hari ini
    const aktif = new Set();
    state.transaksi.slice(0, 8).forEach((t) => {
      if (t.status === 'Lunas' && t.meja) {
        aktif.add(t.meja);
      }
    });
    return Math.max(4, Math.min(aktif.size + 2, 19));
  }

  function renderSalesChart() {
    const pathArea = $('#chartAreaPath');
    const pathLine = $('#chartLinePath');
    const dotsGroup = $('#chartDotsGroup');
    const labelTotal = $('#labelTotalGrafik');
    const sumbuX = $('#labelSumbuX');
    if (!pathArea || !pathLine) return;

    // Dummy trend values yang realistis berdasarkan transaksi nyata
    let labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    let values = [480000, 620000, 710000, 1420000, 1680000, 2350000, 2100000];

    // Jika ada transaksi hari ini, tambahkan ke grafik
    const totalTrx = state.transaksi.filter((t) => t.status === 'Lunas').reduce((a, b) => a + b.total, 0);
    if (totalTrx > 0) {
      values[values.length - 1] = Math.max(values[values.length - 1], totalTrx);
    }

    if (grafikRange === 'month') {
      labels = ['W1', 'W2', 'W3', 'W4'];
      values = [5200000, 6800000, 7400000, 9200000];
    } else if (grafikRange === 'year') {
      labels = ['Q1', 'Q2', 'Q3', 'Q4'];
      values = [28000000, 34000000, 39000000, 48000000];
    }

    const sumTotal = values.reduce((a, b) => a + b, 0);
    if (labelTotal) labelTotal.textContent = fmtRp(sumTotal);

    if (sumbuX) {
      sumbuX.innerHTML = labels.map((l) => `<span>${l}</span>`).join('');
    }

    // Koordinat SVG (viewBox 0 0 700 240)
    const width = 640;
    const height = 180;
    const paddingX = 40;
    const paddingY = 25;
    const maxVal = Math.max(...values) * 1.25 || 1000000;

    const points = values.map((val, idx) => {
      const x = paddingX + (idx / (values.length - 1)) * (width - paddingX * 2);
      const y = height - (val / maxVal) * (height - paddingY) + 20;
      return { x, y, val };
    });

    // Bangun Bezier Catmull-Rom / Smooth Spline
    let dLine = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      dLine += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    const dArea = `${dLine} L ${points[points.length - 1].x} ${height + 25} L ${points[0].x} ${height + 25} Z`;

    pathArea.setAttribute('d', dArea);
    pathLine.setAttribute('d', dLine);

    // Titik data di akhir line
    if (dotsGroup) {
      dotsGroup.innerHTML = points.map((p, idx) => {
        const isLast = idx === points.length - 1;
        return `
          <circle cx="${p.x}" cy="${p.y}" r="${isLast ? 6 : 4}" fill="#ffffff" stroke="#10b981" stroke-width="3"/>
        `;
      }).join('');
    }
  }

  function aturFilterGrafik() {
    $$('#pillsFilterGrafik .btn-segment').forEach((btn) => {
      btn.addEventListener('click', () => {
        $$('#pillsFilterGrafik .btn-segment').forEach((b) => b.classList.remove('aktif'));
        btn.classList.add('aktif');
        grafikRange = btn.dataset.grafik;

        const mapJudul = {
          week: 'Sales Overview (7 Hari Terakhir)',
          month: 'Sales Overview (Bulan Ini)',
          year: 'Sales Overview (Tahun 2026)'
        };
        const elJudul = $('#labelRentangGrafik');
        if (elJudul) elJudul.textContent = mapJudul[grafikRange] || 'Sales Overview';

        renderSalesChart();
      });
    });
  }

  function renderRecentOrders() {
    const wadah = $('#wadahRecentOrders');
    if (!wadah) return;

    const daftar = state.transaksi.slice(0, 4);
    if (daftar.length === 0) {
      wadah.innerHTML = '<p class="muted-text" style="padding: 16px; text-align: center;">Belum ada pesanan masuk.</p>';
      return;
    }

    wadah.innerHTML = daftar.map((t) => {
      const d = new Date(t.waktu);
      const jamStr = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const totalItem = t.items.reduce((a, b) => a + b.qty, 0);
      const mejaStr = t.meja ? `Table ${t.meja}` : 'Dine-in';

      return `
        <div class="row-recent-order">
          <div>
            <div class="recent-inv">#${t.invoice.slice(-8)}</div>
            <div class="recent-sub">${mejaStr} • ${totalItem} items</div>
          </div>
          <div class="recent-kanan">
            <div class="recent-total">${fmtRp(t.total)}</div>
            <div class="recent-jam">${jamStr}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderSideMenuDashboard() {
    const wadahPop = $('#wadahPopularItems');
    const wadahLess = $('#wadahLessSell');

    // Hitung penjualan per menu dari transaksi
    const countMap = {};
    state.transaksi.filter((t) => t.status === 'Lunas').forEach((t) => {
      t.items.forEach((it) => {
        countMap[it.id] = (countMap[it.id] || 0) + it.qty;
      });
    });

    // Default mock count jika riwayat masih sedikit
    const sortedProduk = [...state.produk].map((p) => {
      const sold = (countMap[p.id] || 0) + (p.stok > 40 ? 35 : (p.stok > 20 ? 15 : 4));
      return { ...p, sold };
    }).sort((a, b) => b.sold - a.sold);

    const popular = sortedProduk.slice(0, 5);
    const less = sortedProduk.slice(-3);

    if (wadahPop) {
      wadahPop.innerHTML = popular.map((p) => `
        <div class="item-side-card">
          <img class="item-side-thumb" src="${p.gambar || 'ikon.svg'}" alt="${p.nama}" onerror="this.src='ikon.svg'">
          <div class="item-side-info">
            <div class="item-side-nama">${p.nama}</div>
            <div class="item-side-sold">Sold: ${p.sold}/day</div>
          </div>
          <div class="item-side-harga">${fmtRp(p.harga)}</div>
        </div>
      `).join('');
    }

    if (wadahLess) {
      wadahLess.innerHTML = less.map((p) => `
        <div class="item-side-card">
          <img class="item-side-thumb" src="${p.gambar || 'ikon.svg'}" alt="${p.nama}" onerror="this.src='ikon.svg'">
          <div class="item-side-info">
            <div class="item-side-nama">${p.nama}</div>
            <div class="item-side-sold">Sold: ${Math.max(1, p.sold % 5)}/day</div>
          </div>
          <div class="item-side-harga">${fmtRp(p.harga)}</div>
        </div>
      `).join('');
    }
  }

  // ----------------------------------------------------
  // KASIR & KATALOG MENU (Ref Gambar 2)
  // ----------------------------------------------------
  function renderKategori() {
    const wadah = $('#wadahKategori');
    if (!wadah) return;

    // Hitung jumlah produk per kategori
    const totalAll = state.produk.length;
    const counts = { 'Semua': totalAll };
    const katList = ['Semua'];

    state.produk.forEach((p) => {
      if (p.kategori) {
        if (!katList.includes(p.kategori)) katList.push(p.kategori);
        counts[p.kategori] = (counts[p.kategori] || 0) + 1;
      }
    });

    wadah.innerHTML = katList.map((kat) => `
      <button type="button" class="chip-kat ${kat === kategoriAktif ? 'aktif' : ''}" data-kat="${kat}">
        <span>${kat}</span>
        <span class="chip-count">${counts[kat] || 0}</span>
      </button>
    `).join('');

    wadah.querySelectorAll('.chip-kat').forEach((btn) => {
      btn.addEventListener('click', () => {
        kategoriAktif = btn.dataset.kat;
        renderKategori();
        renderGridProduk();
      });
    });
  }

  function renderGridProduk() {
    const grid = $('#gridProduk');
    if (!grid) return;

    const query = ($('#inputSpotlightSearch')?.value || '').toLowerCase().trim();
    const difilter = state.produk.filter((p) => {
      const matchKat = kategoriAktif === 'Semua' || p.kategori === kategoriAktif;
      const matchCari = !query || p.nama.toLowerCase().includes(query) || (p.kode && p.kode.toLowerCase().includes(query));
      return matchKat && matchCari;
    });

    if (difilter.length === 0) {
      grid.innerHTML = '<p class="muted-text" style="grid-column: 1/-1; padding: 40px; text-align: center;">Menu tidak ditemukan.</p>';
      return;
    }

    grid.innerHTML = difilter.map((p) => {
      const habis = p.stok <= 0;
      const tagStr = (p.tags && p.tags.length > 0) ? p.tags.join(' ') : (IKON_KAT[p.kategori] || '🍴');
      const imgSrc = p.gambar || GAMBAR_MENU[p.id] || 'ikon.svg';

      return `
        <div class="kartu-menu-item ${habis ? 'habis' : ''}" data-id="${p.id}">
          <div class="menu-kolom-kiri">
            <div>
              <div class="menu-tags-top">${tagStr}</div>
              <h4 class="menu-judul">${p.nama}</h4>
            </div>
            <div class="menu-bawah-row">
              <button type="button" class="btn-add-plus" title="Tambah ke Pesanan">+</button>
              <span class="menu-harga">${fmtRp(p.harga)}</span>
            </div>
          </div>
          <div class="menu-gambar-wadah">
            <img class="menu-gambar" src="${imgSrc}" alt="${p.nama}" onerror="this.onerror=null; this.src='ikon.svg';">
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.kartu-menu-item:not(.habis)').forEach((card) => {
      card.addEventListener('click', () => tambahKeKeranjang(card.dataset.id));
    });
  }

  // ----------------------------------------------------
  // KERANJANG PESANAN (Order Detail)
  // ----------------------------------------------------
  function tambahKeKeranjang(produkId) {
    const produk = state.produk.find((p) => p.id === produkId);
    if (!produk || produk.stok <= 0) return;

    const existing = keranjang.find((item) => item.id === produkId);
    if (existing) {
      if (existing.qty < produk.stok) {
        existing.qty += 1;
      } else {
        alert(`Porsi ${produk.nama} tersisa ${produk.stok}`);
        return;
      }
    } else {
      keranjang.push({
        id: produk.id,
        nama: produk.nama,
        harga: produk.harga,
        modal: produk.modal || 0,
        qty: 1,
        catatan: '',
        gambar: produk.gambar || GAMBAR_MENU[produk.id] || 'ikon.svg'
      });
    }
    renderKeranjang();
  }

  function kurangiDariKeranjang(produkId) {
    const index = keranjang.findIndex((item) => item.id === produkId);
    if (index === -1) return;

    if (keranjang[index].qty > 1) {
      keranjang[index].qty -= 1;
    } else {
      keranjang.splice(index, 1);
    }
    renderKeranjang();
  }

  function renderKeranjang() {
    const wadah = $('#wadahItemKeranjang');
    if (!wadah) return;

    // Badges Meja & Tamu di Header Order Detail
    const elMejaPill = $('#labelMejaPill');
    const elTamuPill = $('#labelTamuPill');
    if (elMejaPill) elMejaPill.textContent = `Meja ${state.mejaAktif || '07'}`;
    if (elTamuPill) elTamuPill.textContent = `${state.jumlahTamu || 4} Org`;

    // Invoice draft ID
    const noInvDraft = $('#noInvoiceDraft');
    if (noInvDraft) noInvDraft.textContent = `#ORD-${String(state.transaksi.length + 1001)}`;

    if (keranjang.length === 0) {
      wadah.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); margin: 60px 0;">
          <p style="font-size: 13.5px; font-weight: 600;">Belum ada pesanan terpilih</p>
          <p class="muted-text" style="font-size: 12px; margin-top: 4px;">Klik kartu menu bakso, mie, atau minuman untuk menambahkan.</p>
        </div>
      `;
      $('#labelTotalItemKeranjang').textContent = '0';
      $('#labelSubtotal').textContent = fmtRp(0);
      $('#labelDiskon').textContent = '-';
      $('#labelPajak').textContent = fmtRp(0);
      $('#labelGrandTotal').textContent = fmtRp(0);
      $('#btnBayarNominal').textContent = fmtRp(0);
      $('#btnBukaBayar').disabled = true;
      return;
    }

    const totalQty = keranjang.reduce((acc, curr) => acc + curr.qty, 0);
    const subtotal = keranjang.reduce((acc, curr) => acc + (curr.harga * curr.qty), 0);

    // Pajak PB1
    const persenPajak = (state.toko && state.toko.pajakAktif) ? (state.toko.persenPajak || 10) : 0;
    const nominalPajak = Math.round((subtotal - diskon) * (persenPajak / 100));

    // Grand total
    const grandTotal = Math.max(0, subtotal - diskon + nominalPajak);

    wadah.innerHTML = keranjang.map((item) => `
      <div class="item-cart-row">
        <img class="item-cart-thumb" src="${item.gambar || 'ikon.svg'}" alt="${item.nama}" onerror="this.onerror=null; this.src='ikon.svg';">
        <div class="item-cart-detail">
          <div class="item-cart-nama">${item.nama}</div>
          <div class="item-cart-catatan" data-id="${item.id}">
            ${item.catatan ? item.catatan : '+ Tambah catatan...'}
          </div>
          <div class="item-cart-controls">
            <button type="button" class="btn-stepper-circle btn-kurang" data-id="${item.id}">-</button>
            <span class="item-cart-qty">${item.qty}</span>
            <button type="button" class="btn-stepper-circle btn-tambah" data-id="${item.id}">+</button>
          </div>
        </div>
        <div class="item-cart-harga">
          ${fmtRp(item.harga * item.qty)}
        </div>
      </div>
    `).join('');

    wadah.querySelectorAll('.btn-kurang').forEach((b) => {
      b.addEventListener('click', () => kurangiDariKeranjang(b.dataset.id));
    });
    wadah.querySelectorAll('.btn-tambah').forEach((b) => {
      b.addEventListener('click', () => tambahKeKeranjang(b.dataset.id));
    });

    // Edit catatan item
    wadah.querySelectorAll('.item-cart-catatan').forEach((el) => {
      el.addEventListener('click', () => {
        const item = keranjang.find((it) => it.id === el.dataset.id);
        if (!item) return;
        const res = prompt(`Catatan khusus untuk "${item.nama}" (misal: Tanpa seledri, kuah pedas):`, item.catatan || '');
        if (res !== null) {
          item.catatan = res.trim();
          renderKeranjang();
        }
      });
    });

    // Update kalkulasi
    $('#labelTotalItemKeranjang').textContent = totalQty.toString();
    $('#labelSubtotal').textContent = fmtRp(subtotal);
    $('#labelDiskon').textContent = diskon > 0 ? '-' + fmtRp(diskon) : '-';

    const barisPajak = $('#barisPajak');
    if (barisPajak) {
      if (persenPajak > 0) {
        barisPajak.hidden = false;
        $('#labelTeksPajak').textContent = `Tax (${persenPajak}%)`;
        $('#labelPajak').textContent = fmtRp(nominalPajak);
      } else {
        barisPajak.hidden = true;
      }
    }

    $('#labelGrandTotal').textContent = fmtRp(grandTotal);
    $('#btnBayarNominal').textContent = fmtRp(grandTotal);
    $('#btnBukaBayar').disabled = false;
  }

  // ----------------------------------------------------
  // DENAH MEJA RESTORAN (Meja 01 - 19)
  // ----------------------------------------------------
  function renderDenahMeja() {
    const wadah = $('#wadahGridMeja');
    if (!wadah) return;

    // Meja terisi dari simulasi / histori
    const mejaTerisiSet = new Set(['02', '04', '07', '11', '14', '18']);

    let totalKosong = 0;
    let totalTerisi = 0;

    const listMeja = [];
    for (let i = 1; i <= 19; i++) {
      const nomor = String(i).padStart(2, '0');
      const isTerisi = mejaTerisiSet.has(nomor);
      if (isTerisi) totalTerisi++; else totalKosong++;
      listMeja.push({ nomor, terisi: isTerisi });
    }

    $('#statMejaKosong').textContent = totalKosong.toString();
    $('#statMejaTerisi').textContent = totalTerisi.toString();
    $('#btnPillTableStatus').textContent = `${totalKosong} Available`;

    wadah.innerHTML = listMeja.map((m) => {
      const aktif = (m.nomor === state.mejaAktif);
      return `
        <div class="kartu-meja-slot ${aktif ? 'terpilih' : ''}" data-meja="${m.nomor}">
          <div class="meja-slot-top">
            <span class="meja-no-title">Meja ${m.nomor}</span>
            <span class="meja-status-pill ${m.terisi ? 'terisi' : 'kosong'}">
              ${m.terisi ? 'Terisi' : 'Kosong'}
            </span>
          </div>
          <div class="meja-slot-info">
            ${m.terisi ? 'Pesanan Aktif' : 'Siap Digunakan'}
          </div>
          ${m.terisi ? '<div class="meja-slot-bill">Rp68.000</div>' : '<div class="meja-slot-bill" style="color:var(--text-subtle);">Rp0</div>'}
        </div>
      `;
    }).join('');

    wadah.querySelectorAll('.kartu-meja-slot').forEach((card) => {
      card.addEventListener('click', () => {
        state.mejaAktif = card.dataset.meja;
        simpanData();
        renderDenahMeja();
        renderKeranjang();
        gantiTab('hal-kasir');
      });
    });
  }

  // ----------------------------------------------------
  // MODAL PILIH MEJA (Table Picker)
  // ----------------------------------------------------
  function aturModalPilihMeja() {
    const modal = $('#modalPilihMeja');
    const wadah = $('#wadahPilihMejaModal');

    const bukaModal = () => {
      if (!wadah) return;
      let html = '';
      for (let i = 1; i <= 19; i++) {
        const no = String(i).padStart(2, '0');
        const aktif = (no === state.mejaAktif);
        html += `
          <button type="button" class="btn-meja-pilih-item ${aktif ? 'aktif' : ''}" data-meja="${no}">
            Meja ${no}
          </button>
        `;
      }
      html += `
        <button type="button" class="btn-meja-pilih-item ${state.mejaAktif === 'Bungkus' ? 'aktif' : ''}" data-meja="Bungkus">
          Bungkus
        </button>
      `;
      wadah.innerHTML = html;

      wadah.querySelectorAll('.btn-meja-pilih-item').forEach((b) => {
        b.addEventListener('click', () => {
          state.mejaAktif = b.dataset.meja;
          simpanData();
          modal.hidden = true;
          renderKeranjang();
          renderDenahMeja();
        });
      });

      modal.hidden = false;
    };

    $('#btnAturMejaOrder')?.addEventListener('click', bukaModal);
    $('#badgeMejaAktif')?.addEventListener('click', bukaModal);
    $('#badgeTamuAktif')?.addEventListener('click', () => {
      const tamu = prompt('Masukkan perkiraan jumlah tamu di meja:', state.jumlahTamu || 4);
      if (tamu !== null && Number(tamu) > 0) {
        state.jumlahTamu = Number(tamu);
        simpanData();
        renderKeranjang();
      }
    });

    $('#btnTutupModalMeja')?.addEventListener('click', () => {
      modal.hidden = true;
    });
  }

  // ----------------------------------------------------
  // MODAL PILIH DISKON (Discount Picker)
  // ----------------------------------------------------
  function aturModalPilihDiskon() {
    const modal = $('#modalPilihDiskon');

    $('#btnAturDiskon')?.addEventListener('click', () => {
      modal.hidden = false;
    });

    $('#btnTutupModalDiskon')?.addEventListener('click', () => {
      modal.hidden = true;
    });

    $$('.btn-preset-diskon').forEach((b) => {
      b.addEventListener('click', () => {
        const subtotal = keranjang.reduce((acc, curr) => acc + (curr.harga * curr.qty), 0);
        if (b.dataset.pct !== undefined) {
          const pct = Number(b.dataset.pct);
          diskon = Math.round(subtotal * (pct / 100));
        } else if (b.dataset.nom !== undefined) {
          diskon = Math.min(Number(b.dataset.nom), subtotal);
        }
        modal.hidden = true;
        renderKeranjang();
      });
    });

    $('#btnTerapkanDiskonCustom')?.addEventListener('click', () => {
      const subtotal = keranjang.reduce((acc, curr) => acc + (curr.harga * curr.qty), 0);
      const val = Number($('#inputCustomDiskonNominal')?.value || 0);
      diskon = Math.max(0, Math.min(val, subtotal));
      modal.hidden = true;
      renderKeranjang();
    });
  }

  // ----------------------------------------------------
  // SPOTLIGHT QUICK SEARCH
  // ----------------------------------------------------
  function aturSpotlightSearch() {
    const modal = $('#modalSearchSpotlight');
    const input = $('#inputSpotlightSearch');
    const wadah = $('#wadahHasilSpotlight');

    const updateHasil = () => {
      const q = (input?.value || '').toLowerCase().trim();
      const difilter = state.produk.filter((p) => !q || p.nama.toLowerCase().includes(q) || (p.kategori && p.kategori.toLowerCase().includes(q)));

      if (!wadah) return;
      if (difilter.length === 0) {
        wadah.innerHTML = '<p class="muted-text" style="padding: 16px; text-align: center;">Menu tidak ditemukan.</p>';
        return;
      }

      wadah.innerHTML = difilter.slice(0, 6).map((p) => `
        <div class="item-spotlight-row" data-id="${p.id}">
          <div>
            <strong>${p.nama}</strong>
            <span class="muted-text" style="margin-left: 6px; font-size: 11.5px;">(${p.kategori})</span>
          </div>
          <div><b>${fmtRp(p.harga)}</b></div>
        </div>
      `).join('');

      wadah.querySelectorAll('.item-spotlight-row').forEach((row) => {
        row.addEventListener('click', () => {
          tambahKeKeranjang(row.dataset.id);
          modal.hidden = true;
          gantiTab('hal-kasir');
        });
      });
    };

    $('#btnBukaPencarian')?.addEventListener('click', () => {
      modal.hidden = false;
      input.value = '';
      updateHasil();
      setTimeout(() => input.focus(), 50);
    });

    $('#btnTutupSpotlight')?.addEventListener('click', () => {
      modal.hidden = true;
    });

    input?.addEventListener('input', updateHasil);

    // Keyboard shortcut Cmd+K / Ctrl+K
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        $('#btnBukaPencarian')?.click();
      }
    });
  }

  // ----------------------------------------------------
  // PEMBAYARAN & NUMPAD
  // ----------------------------------------------------
  function aturPembayaran() {
    const modal = $('#modalBayar');
    const inputUang = $('#inputUangDiterima');
    const labelKembalian = $('#bayarKembalian');

    const hitungTotal = () => {
      const subtotal = keranjang.reduce((acc, curr) => acc + (curr.harga * curr.qty), 0);
      const persenPajak = (state.toko && state.toko.pajakAktif) ? (state.toko.persenPajak || 10) : 0;
      const nominalPajak = Math.round((subtotal - diskon) * (persenPajak / 100));
      return Math.max(0, subtotal - diskon + nominalPajak);
    };

    const updateKembalian = () => {
      const total = hitungTotal();
      const kembali = uangDiterima - total;
      labelKembalian.textContent = kembali >= 0 ? fmtRp(kembali) : '- ' + fmtRp(Math.abs(kembali));
      labelKembalian.style.color = kembali >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
      $('#btnProsesBayar').disabled = kembali < 0;
    };

    $('#btnBukaBayar')?.addEventListener('click', () => {
      const total = hitungTotal();
      $('#bayarTotalTagihan').textContent = fmtRp(total);

      uangDiterima = 0;
      inputUang.value = '';
      updateKembalian();
      modal.hidden = false;
    });

    $('#btnTutupBayar')?.addEventListener('click', () => {
      modal.hidden = true;
    });

    // Pilihan Metode
    $$('input[name="metodeBayar"]').forEach((radio) => {
      radio.addEventListener('change', (e) => {
        $$('.metode-kartu-modern').forEach((k) => k.classList.remove('aktif'));
        e.target.closest('.metode-kartu-modern').classList.add('aktif');

        const metode = e.target.value;
        const total = hitungTotal();

        if (metode === 'Tunai') {
          $('#panelTunai').hidden = false;
          $('#panelQris').hidden = true;
          $('#kotakKembalian').hidden = false;
          updateKembalian();
        } else if (metode === 'QRIS') {
          $('#panelTunai').hidden = false;
          $('#panelQris').hidden = false;
          $('#kotakKembalian').hidden = true;
          uangDiterima = total;
          inputUang.value = total.toLocaleString('id-ID');
          updateKembalian();
        } else {
          // Transfer
          $('#panelTunai').hidden = false;
          $('#panelQris').hidden = true;
          $('#kotakKembalian').hidden = true;
          uangDiterima = total;
          inputUang.value = total.toLocaleString('id-ID');
          updateKembalian();
        }
      });
    });

    // Tombol Uang Cepat
    $('#btnUangPas')?.addEventListener('click', () => {
      uangDiterima = hitungTotal();
      inputUang.value = uangDiterima.toLocaleString('id-ID');
      updateKembalian();
    });

    $$('.btn-uang-cepat[data-tambah]').forEach((btn) => {
      btn.addEventListener('click', () => {
        uangDiterima += Number(btn.dataset.tambah);
        inputUang.value = uangDiterima.toLocaleString('id-ID');
        updateKembalian();
      });
    });

    $('#btnHapusInputUang')?.addEventListener('click', () => {
      uangDiterima = 0;
      inputUang.value = '';
      updateKembalian();
    });

    // Numpad
    $$('.btn-num').forEach((btn) => {
      btn.addEventListener('click', () => {
        const aksi = btn.dataset.num;
        let str = String(uangDiterima || '');
        if (aksi === 'back') {
          str = str.slice(0, -1);
        } else if (aksi === '000') {
          if (str && str !== '0') str += '000';
        } else {
          str = (str === '0' ? '' : str) + aksi;
        }
        uangDiterima = Number(str || 0);
        inputUang.value = uangDiterima ? uangDiterima.toLocaleString('id-ID') : '';
        updateKembalian();
      });
    });

    // Konfirmasi Pembayaran
    $('#btnProsesBayar')?.addEventListener('click', () => {
      const subtotal = keranjang.reduce((acc, curr) => acc + (curr.harga * curr.qty), 0);
      const persenPajak = (state.toko && state.toko.pajakAktif) ? (state.toko.persenPajak || 10) : 0;
      const nominalPajak = Math.round((subtotal - diskon) * (persenPajak / 100));
      const total = Math.max(0, subtotal - diskon + nominalPajak);
      const kembali = Math.max(0, uangDiterima - total);
      const metode = $('input[name="metodeBayar"]:checked').value;
      const invoice = buatNomorInvoice();
      const waktu = new Date().toISOString();

      // Potong stok
      keranjang.forEach((item) => {
        const prod = state.produk.find((p) => p.id === item.id);
        if (prod) prod.stok = Math.max(0, prod.stok - item.qty);
      });

      // Simpan transaksi
      const transaksiBaru = {
        invoice,
        waktu,
        kasir: state.kasirAktif || 'Pak Darto',
        meja: state.mejaAktif || '07',
        items: JSON.parse(JSON.stringify(keranjang)),
        subtotal,
        diskon,
        pajak: nominalPajak,
        total,
        bayar: uangDiterima,
        kembali,
        metode,
        status: 'Lunas'
      };

      state.transaksi.unshift(transaksiBaru);
      simpanData();

      // Tutup modal bayar & tampilkan struk
      modal.hidden = true;
      tampilkanStruk(transaksiBaru);

      // Reset keranjang
      keranjang = [];
      diskon = 0;
      renderKeranjang();
      renderGridProduk();
    });
  }

  // ----------------------------------------------------
  // CETAK STRUK THERMAL 58mm
  // ----------------------------------------------------
  function tampilkanStruk(trx) {
    const modal = $('#modalStruk');
    if (!modal) return;

    $('#strukTokoNama').textContent = state.toko.nama;
    $('#strukTokoAlamat').textContent = state.toko.alamat || '';
    $('#strukTokoTelp').textContent = state.toko.telp ? 'Telp/WA: ' + state.toko.telp : '';
    $('#strukInvoice').textContent = trx.invoice;

    const d = new Date(trx.waktu);
    $('#strukWaktu').textContent = `${d.toLocaleDateString('id-ID')} ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    $('#strukKasir').textContent = trx.kasir + (trx.meja ? ` (Meja ${trx.meja})` : '');
    $('#strukMetode').textContent = trx.metode;

    const wadahItems = $('#strukItems');
    wadahItems.innerHTML = trx.items.map((it) => `
      <div class="struk-item-baris">
        <div class="struk-item-nama">${it.nama} ${it.catatan ? `[${it.catatan}]` : ''}</div>
        <div class="struk-item-rincian">
          <span>${it.qty} x ${fmtRp(it.harga)}</span>
          <span>${fmtRp(it.qty * it.harga)}</span>
        </div>
      </div>
    `).join('');

    $('#strukSubtotal').textContent = fmtRp(trx.subtotal);
    if (trx.diskon > 0) {
      $('#strukBarisDiskon').hidden = false;
      $('#strukDiskon').textContent = '-' + fmtRp(trx.diskon);
    } else {
      $('#strukBarisDiskon').hidden = true;
    }

    if (trx.pajak > 0) {
      $('#strukBarisPajak').hidden = false;
      $('#strukPajak').textContent = fmtRp(trx.pajak);
    } else {
      $('#strukBarisPajak').hidden = true;
    }

    $('#strukTotal').textContent = fmtRp(trx.total);
    $('#strukBayar').textContent = fmtRp(trx.bayar);
    $('#strukKembalian').textContent = fmtRp(trx.kembali);
    $('#strukFooterPesan').textContent = state.toko.pesanStruk || 'Matur nuwun sampun rawuh!';

    modal.hidden = false;
  }

  function aturModalStruk() {
    $('#btnTutupStruk')?.addEventListener('click', () => {
      $('#modalStruk').hidden = true;
    });
    $('#btnTransaksiBaru')?.addEventListener('click', () => {
      $('#modalStruk').hidden = true;
    });
    $('#btnCetakStruk')?.addEventListener('click', () => {
      window.print();
    });
  }

  // ----------------------------------------------------
  // MANAJEMEN MENU & STOK
  // ----------------------------------------------------
  function renderTabelProduk() {
    const tbody = $('#tbodyProduk');
    if (!tbody) return;

    const q = ($('#cariTabelProduk')?.value || '').toLowerCase().trim();
    const difilter = state.produk.filter((p) => !q || p.nama.toLowerCase().includes(q) || (p.kategori && p.kategori.toLowerCase().includes(q)));

    $('#labelTotalProduk').textContent = `${difilter.length} Menu`;

    if (difilter.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px; color: var(--text-muted);">Tidak ada menu ditemukan.</td></tr>';
      return;
    }

    tbody.innerHTML = difilter.map((p) => `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${p.gambar || 'ikon.svg'}" style="width:36px; height:36px; border-radius:8px; object-fit:cover;" onerror="this.onerror=null; this.src='ikon.svg';">
            <div>
              <strong>${p.nama}</strong><br>
              <small class="muted-text">${p.kode || '-'}</small>
            </div>
          </div>
        </td>
        <td><span class="badge-stat-meja">${p.kategori}</span></td>
        <td><b>${fmtRp(p.harga)}</b></td>
        <td>${fmtRp(p.modal || 0)}</td>
        <td>
          <span style="font-weight:700; color:${p.stok <= 10 ? 'var(--accent-red)' : 'inherit'}">
            ${p.stok} porsi
          </span>
        </td>
        <td>
          <button type="button" class="btn-edit-p" data-id="${p.id}" style="color:var(--text-main); font-weight:700;">Ubah</button>
          &middot;
          <button type="button" class="btn-hapus-p" data-id="${p.id}" style="color:var(--accent-red); font-weight:700;">Hapus</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.btn-edit-p').forEach((b) => {
      b.addEventListener('click', () => bukaModalProduk(b.dataset.id));
    });
    tbody.querySelectorAll('.btn-hapus-p').forEach((b) => {
      b.addEventListener('click', () => hapusProduk(b.dataset.id));
    });
  }

  function bukaModalProduk(id) {
    const modal = $('#modalFormProduk');
    const form = $('#formProduk');
    if (id) {
      const p = state.produk.find((item) => item.id === id);
      if (!p) return;
      $('#judulModalProduk').textContent = 'Ubah Menu';
      $('#formProdukId').value = p.id;
      $('#formNamaProduk').value = p.nama;
      $('#formKategoriProduk').value = p.kategori;
      $('#formHargaJual').value = p.harga;
      $('#formHargaModal').value = p.modal || 0;
      $('#formStok').value = p.stok;
      $('#formKode').value = p.kode || '';
      $('#formGambar').value = p.gambar || '';
    } else {
      $('#judulModalProduk').textContent = 'Tambah Menu';
      form.reset();
      $('#formProdukId').value = '';
      $('#formStok').value = 50;
      $('#formGambar').value = '';
    }
    modal.hidden = false;
  }

  function hapusProduk(id) {
    const p = state.produk.find((item) => item.id === id);
    if (!p) return;
    if (confirm(`Hapus menu "${p.nama}" dari katalog?`)) {
      state.produk = state.produk.filter((item) => item.id !== id);
      simpanData();
      renderTabelProduk();
      renderKategori();
      renderGridProduk();
    }
  }

  function aturFormProduk() {
    $('#btnTambahProduk')?.addEventListener('click', () => bukaModalProduk(null));
    $('#btnTutupModalProduk')?.addEventListener('click', () => $('#modalFormProduk').hidden = true);
    $('#btnBatalProduk')?.addEventListener('click', () => $('#modalFormProduk').hidden = true);
    $('#cariTabelProduk')?.addEventListener('input', renderTabelProduk);

    $('#formProduk')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = $('#formProdukId').value;
      const nama = $('#formNamaProduk').value.trim();
      const kategori = $('#formKategoriProduk').value.trim() || 'Bakso Kuah';
      const harga = Number($('#formHargaJual').value);
      const modal = Number($('#formHargaModal').value) || 0;
      const stok = Number($('#formStok').value);
      const kode = $('#formKode').value.trim();
      const gambar = $('#formGambar').value.trim();

      if (id) {
        const prod = state.produk.find((p) => p.id === id);
        if (prod) {
          prod.nama = nama;
          prod.kategori = kategori;
          prod.harga = harga;
          prod.modal = modal;
          prod.stok = stok;
          prod.kode = kode;
          if (gambar) prod.gambar = gambar;
        }
      } else {
        state.produk.push({
          id: 'b_' + Date.now(),
          nama,
          kategori,
          harga,
          modal,
          stok,
          kode,
          gambar: gambar || 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80',
          tags: [IKON_KAT[kategori] || '🍴']
        });
      }

      simpanData();
      $('#modalFormProduk').hidden = true;
      renderTabelProduk();
      renderKategori();
      renderGridProduk();
    });
  }

  // ----------------------------------------------------
  // RIWAYAT TRANSAKSI
  // ----------------------------------------------------
  function renderTabelRiwayat() {
    const tbody = $('#tbodyRiwayat');
    if (!tbody) return;

    const tglFilter = $('#filterTanggalRiwayat')?.value;
    let daftar = state.transaksi;

    if (tglFilter) {
      daftar = daftar.filter((t) => t.waktu.startsWith(tglFilter));
    }

    if (daftar.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 24px; color: var(--text-muted);">Belum ada riwayat pesanan.</td></tr>';
      return;
    }

    tbody.innerHTML = daftar.map((t) => {
      const d = new Date(t.waktu);
      const waktuStr = `${d.toLocaleDateString('id-ID')} ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
      const ringkasanItem = t.items.map((i) => `${i.nama} (${i.qty})`).join(', ');
      const batal = t.status === 'Batal';

      return `
        <tr style="${batal ? 'opacity: 0.6; text-decoration: line-through;' : ''}">
          <td><strong>${t.invoice}</strong></td>
          <td>${waktuStr}</td>
          <td>${t.kasir}</td>
          <td style="max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${ringkasanItem}">${ringkasanItem}</td>
          <td><span class="badge-stat-meja">${t.metode}</span></td>
          <td><b>${fmtRp(t.total)}</b></td>
          <td>
            <span class="badge-stat-meja" style="background:${batal ? 'var(--accent-red-bg)' : 'var(--accent-green-bg)'}; color:${batal ? 'var(--accent-red)' : 'var(--accent-green)'}">
              ${t.status}
            </span>
          </td>
          <td>
            <button type="button" class="btn-cetak-trx" data-inv="${t.invoice}" style="font-weight:700;">Nota</button>
            ${!batal ? `&middot; <button type="button" class="btn-batal-trx" data-inv="${t.invoice}" style="color:var(--accent-red); font-weight:700;">Batalkan</button>` : ''}
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-cetak-trx').forEach((b) => {
      b.addEventListener('click', () => {
        const trx = state.transaksi.find((t) => t.invoice === b.dataset.inv);
        if (trx) tampilkanStruk(trx);
      });
    });

    tbody.querySelectorAll('.btn-batal-trx').forEach((b) => {
      b.addEventListener('click', () => batalkanTransaksi(b.dataset.inv));
    });
  }

  function batalkanTransaksi(inv) {
    const trx = state.transaksi.find((t) => t.invoice === inv);
    if (!trx || trx.status === 'Batal') return;

    if (confirm(`Batalkan pesanan ${inv}? Porsi menu akan otomatis dikembalikan ke stok.`)) {
      trx.status = 'Batal';
      trx.items.forEach((it) => {
        const prod = state.produk.find((p) => p.id === it.id);
        if (prod) prod.stok += it.qty;
      });
      simpanData();
      renderTabelRiwayat();
      renderGridProduk();
      renderDashboard();
    }
  }

  function aturFilterRiwayat() {
    $('#filterTanggalRiwayat')?.addEventListener('change', renderTabelRiwayat);
    $('#btnResetTanggal')?.addEventListener('click', () => {
      const input = $('#filterTanggalRiwayat');
      if (input) input.value = '';
      renderTabelRiwayat();
    });
  }

  // ----------------------------------------------------
  // LAPORAN & STATISTIK
  // ----------------------------------------------------
  function renderLaporan() {
    const sekarang = new Date();
    const transaksiAktif = state.transaksi.filter((t) => t.status === 'Lunas');

    const difilter = transaksiAktif.filter((t) => {
      const d = new Date(t.waktu);
      if (periodeLaporan === 'hari') {
        return d.toDateString() === sekarang.toDateString();
      } else if (periodeLaporan === 'minggu') {
        const selisihHari = (sekarang - d) / (1000 * 60 * 60 * 24);
        return selisihHari <= 7;
      } else if (periodeLaporan === 'bulan') {
        return d.getMonth() === sekarang.getMonth() && d.getFullYear() === sekarang.getFullYear();
      }
      return true;
    });

    let omzet = 0;
    let laba = 0;
    let itemTerjual = 0;
    const hitungProduk = {};

    difilter.forEach((t) => {
      omzet += t.total;
      t.items.forEach((it) => {
        itemTerjual += it.qty;
        const profit = ((it.harga - (it.modal || 0)) * it.qty);
        laba += profit;

        if (!hitungProduk[it.nama]) {
          hitungProduk[it.nama] = { qty: 0, omzet: 0 };
        }
        hitungProduk[it.nama].qty += it.qty;
        hitungProduk[it.nama].omzet += (it.harga * it.qty);
      });
    });

    $('#statOmzet').textContent = fmtRp(omzet);
    $('#statTransaksi').textContent = difilter.length.toLocaleString('id-ID');
    $('#statLaba').textContent = fmtRp(laba);
    $('#statItemTerjual').textContent = itemTerjual.toLocaleString('id-ID');

    // Top 5 Menu
    const topList = Object.entries(hitungProduk)
      .map(([nama, val]) => ({ nama, qty: val.qty, omzet: val.omzet }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    const tbody = $('#tbodyTopProduk');
    if (tbody) {
      if (topList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 16px; color:var(--text-muted);">Belum ada data penjualan pada periode ini.</td></tr>';
      } else {
        tbody.innerHTML = topList.map((item, idx) => `
          <tr>
            <td><strong>#${idx + 1}</strong></td>
            <td><b>${item.nama}</b></td>
            <td>${item.qty} porsi</td>
            <td>${fmtRp(item.omzet)}</td>
          </tr>
        `).join('');
      }
    }
  }

  function aturPeriodeLaporan() {
    $$('#wadahPeriodeLaporan .btn-segment').forEach((btn) => {
      btn.addEventListener('click', () => {
        $$('#wadahPeriodeLaporan .btn-segment').forEach((b) => b.classList.remove('aktif'));
        btn.classList.add('aktif');
        periodeLaporan = btn.dataset.periode;
        renderLaporan();
      });
    });
  }

  // ----------------------------------------------------
  // PENGATURAN & BACKUP
  // ----------------------------------------------------
  function renderPengaturan() {
    $('#setNamaToko').value = state.toko.nama || 'Bakso Pak Darto';
    $('#setAlamatToko').value = state.toko.alamat || '';
    $('#setTelpToko').value = state.toko.telp || '';
    $('#setCatatanStruk').value = state.toko.pesanStruk || '';
    $('#setGunakanPin').checked = Boolean(state.toko.kunciPin);
    $('#setPajakAktif').checked = Boolean(state.toko.pajakAktif);
    $('#setPersenPajak').value = state.toko.persenPajak || 10;
  }

  function aturPengaturan() {
    $('#formProfilToko')?.addEventListener('submit', (e) => {
      e.preventDefault();
      state.toko.nama = $('#setNamaToko').value.trim();
      state.toko.alamat = $('#setAlamatToko').value.trim();
      state.toko.telp = $('#setTelpToko').value.trim();
      state.toko.pesanStruk = $('#setCatatanStruk').value.trim();
      simpanData();

      $('#namaTokoHeader').textContent = '.' + state.toko.nama.toLowerCase().replace(/\s+/g, '');
      alert('Profil warung berhasil diperbarui!');
    });

    $('#formPajakSetting')?.addEventListener('submit', (e) => {
      e.preventDefault();
      state.toko.pajakAktif = $('#setPajakAktif').checked;
      state.toko.persenPajak = Number($('#setPersenPajak').value) || 0;
      simpanData();
      renderKeranjang();
      alert('Pengaturan pajak resto berhasil disimpan!');
    });

    $('#formKeamanan')?.addEventListener('submit', (e) => {
      e.preventDefault();
      state.toko.kunciPin = $('#setGunakanPin').checked;
      const pinBaru = $('#setPinBaru').value.trim();
      if (pinBaru) {
        if (/^\d{4}$/.test(pinBaru)) {
          state.toko.pin = pinBaru;
          $('#setPinBaru').value = '';
        } else {
          alert('PIN harus berupa 4 angka numerik!');
          return;
        }
      }
      simpanData();
      alert('Pengaturan keamanan PIN berhasil disimpan!');
    });

    // Ekspor JSON
    $('#btnEksporJson')?.addEventListener('click', () => {
      const jsonStr = JSON.stringify(state, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-nataarta-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    // Impor JSON
    $('#inputImporJson')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target.result);
          if (data && data.produk && data.transaksi) {
            state = data;
            simpanData();
            alert('Pemulihan data berhasil!');
            location.reload();
          } else {
            alert('Format berkas cadangan JSON tidak sesuai!');
          }
        } catch (err) {
          alert('Gagal membaca berkas JSON!');
        }
      };
      reader.readAsText(file);
    });

    // Ekspor CSV Transaksi
    $('#btnEksporCsv')?.addEventListener('click', () => {
      if (state.transaksi.length === 0) {
        alert('Belum ada transaksi untuk diekspor!');
        return;
      }
      let csv = 'Nota,Waktu,Kasir,Meja,Metode,Subtotal,Diskon,Pajak,Total,Bayar,Kembali,Status,Item Pesanan\n';
      state.transaksi.forEach((t) => {
        const items = t.items.map((i) => `${i.nama} x${i.qty}`).join('; ');
        csv += `"${t.invoice}","${t.waktu}","${t.kasir}","${t.meja || '-'}",${t.metode},${t.subtotal},${t.diskon || 0},${t.pajak || 0},${t.total},${t.bayar},${t.kembali},"${t.status}","${items}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rekap-penjualan-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // ----------------------------------------------------
  // KUNCI LAYAR PIN
  // ----------------------------------------------------
  function updatePinIndikator() {
    $$('#pinIndikator .titik-pin').forEach((titik, idx) => {
      titik.classList.toggle('terisi', idx < pinBuffer.length);
    });
  }

  function verifikasiPin() {
    setTimeout(() => {
      const targetPin = (state.toko && state.toko.pin) || '1234';
      if (pinBuffer === targetPin) {
        $('#layarKunci').hidden = true;
        pinBuffer = '';
        updatePinIndikator();
      } else {
        alert('PIN kasir salah! (Default: 1234)');
        pinBuffer = '';
        updatePinIndikator();
      }
    }, 100);
  }

  function aturPadPin() {
    $$('.pad-pin .btn-pin[data-angka]').forEach((b) => {
      b.addEventListener('click', () => {
        if (pinBuffer.length < 4) {
          pinBuffer += b.dataset.angka;
          updatePinIndikator();

          if (pinBuffer.length === 4) {
            verifikasiPin();
          }
        }
      });
    });

    $('#btnHapusPin')?.addEventListener('click', () => {
      pinBuffer = pinBuffer.slice(0, -1);
      updatePinIndikator();
    });

    $('#btnBatalPin')?.addEventListener('click', () => {
      pinBuffer = '';
      updatePinIndikator();
      $('#layarKunci').hidden = true;
    });

    $('#btnKunciSesi')?.addEventListener('click', () => {
      $('#layarKunci').hidden = false;
      pinBuffer = '';
      updatePinIndikator();
    });

    document.addEventListener('keydown', (e) => {
      const layar = $('#layarKunci');
      if (!layar || layar.hidden) return;
      if (/^[0-9]$/.test(e.key)) {
        if (pinBuffer.length < 4) {
          pinBuffer += e.key;
          updatePinIndikator();
          if (pinBuffer.length === 4) {
            verifikasiPin();
          }
        }
      } else if (e.key === 'Backspace') {
        pinBuffer = pinBuffer.slice(0, -1);
        updatePinIndikator();
      } else if (e.key === 'Escape') {
        pinBuffer = '';
        updatePinIndikator();
        $('#layarKunci').hidden = true;
      }
    });
  }

  // ----------------------------------------------------
  // INISIALISASI UTAMA
  // ----------------------------------------------------
  function init() {
    aturNavigasi();
    aturJam();
    aturFilterGrafik();

    renderDashboard();
    renderKategori();
    renderGridProduk();
    renderKeranjang();

    aturModalPilihMeja();
    aturModalPilihDiskon();
    aturSpotlightSearch();
    aturPembayaran();
    aturModalStruk();
    aturFormProduk();
    aturFilterRiwayat();
    aturPeriodeLaporan();
    aturPengaturan();
    aturPadPin();

    // Default mulai di Beranda / Dashboard sesuai gambar referensi 1
    gantiTab('hal-beranda');

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch((err) => {
        console.log('SW registration:', err);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
