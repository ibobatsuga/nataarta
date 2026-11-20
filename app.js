/**
 * NataArta — Aplikasi Kasir POS Bakso Pak Darto
 * Offline-first POS system using localStorage.
 */

(() => {
  'use strict';

  // Key penyimpanan lokal spesifik NataArta
  const STORAGE_KEY = 'nataarta_pos_data_v1';

  // Data awal menu Bakso Pak Darto
  const DATA_AWAL = {
    toko: {
      nama: 'Bakso Pak Darto',
      alamat: 'Jl. Kuliner Nusantara No. 12',
      telp: '0812-9876-5432',
      pesanStruk: 'Matur nuwun sampun rawuh! Nikmat kuahnya, mantap baksonya.',
      kunciPin: false,
      pin: '1234'
    },
    kasirAktif: 'Pak Darto',
    produk: [
      { id: 'b1', nama: 'Bakso Urat Granat', kategori: 'Bakso Kuah', harga: 25000, modal: 15000, stok: 50, kode: 'BKS-01' },
      { id: 'b2', nama: 'Bakso Halus Kuah Kaldu', kategori: 'Bakso Kuah', harga: 22000, modal: 13000, stok: 60, kode: 'BKS-02' },
      { id: 'b3', nama: 'Bakso Telur Spesial', kategori: 'Bakso Kuah', harga: 24000, modal: 14000, stok: 40, kode: 'BKS-03' },
      { id: 'b4', nama: 'Bakso Keju Lumer', kategori: 'Bakso Kuah', harga: 26000, modal: 16000, stok: 35, kode: 'BKS-04' },
      { id: 'b5', nama: 'Bakso Iga Sapi Jumbo', kategori: 'Bakso Kuah', harga: 38000, modal: 24000, stok: 25, kode: 'BKS-05' },
      { id: 'm1', nama: 'Mie Ayam Bakso Pangsit', kategori: 'Mie Ayam', harga: 20000, modal: 11000, stok: 45, kode: 'MIE-01' },
      { id: 'm2', nama: 'Mie Ayam Komplit', kategori: 'Mie Ayam', harga: 24000, modal: 13000, stok: 30, kode: 'MIE-02' },
      { id: 'p1', nama: 'Pangsit Goreng Renyah', kategori: 'Pelengkap', harga: 5000, modal: 2000, stok: 80, kode: 'PLG-01' },
      { id: 'p2', nama: 'Tahu Bakso Kukus', kategori: 'Pelengkap', harga: 8000, modal: 4000, stok: 50, kode: 'PLG-02' },
      { id: 'p3', nama: 'Lontong Bungkus Daun', kategori: 'Pelengkap', harga: 4000, modal: 1500, stok: 60, kode: 'PLG-03' },
      { id: 'd1', nama: 'Es Teh Manis Jumbo', kategori: 'Minuman', harga: 5000, modal: 1500, stok: 120, kode: 'MNM-01' },
      { id: 'd2', nama: 'Es Jeruk Peras Segar', kategori: 'Minuman', harga: 8000, modal: 3500, stok: 80, kode: 'MNM-02' },
      { id: 'd3', nama: 'Es Campur Durian', kategori: 'Minuman', harga: 18000, modal: 10000, stok: 30, kode: 'MNM-03' },
      { id: 'd4', nama: 'Air Mineral Botol', kategori: 'Minuman', harga: 4000, modal: 2000, stok: 100, kode: 'MNM-04' }
    ],
    transaksi: []
  };

  // State runtime
  let state = muatData();
  let keranjang = [];
  let diskon = 0;
  let pinBuffer = '';
  let kategoriAktif = 'Semua';
  let uangDiterima = 0;
  let periodeLaporan = 'hari';

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
      const tersimpan = localStorage.getItem(STORAGE_KEY);
      if (tersimpan) {
        return Object.assign({}, DATA_AWAL, JSON.parse(tersimpan));
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

  // Navigasi Tab
  function aturNavigasi() {
    $$('.nav-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        $$('.nav-item').forEach((b) => b.classList.remove('aktif'));
        $$('.halaman').forEach((h) => h.classList.remove('aktif'));
        btn.classList.add('aktif');
        const targetEl = document.getElementById(targetId);
        if (targetEl) targetEl.classList.add('aktif');

        if (targetId === 'hal-produk') renderTabelProduk();
        if (targetId === 'hal-riwayat') renderTabelRiwayat();
        if (targetId === 'hal-laporan') renderLaporan();
        if (targetId === 'hal-pengaturan') renderPengaturan();
      });
    });
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
  // KASIR & KATALOG MENU
  // ----------------------------------------------------
  function renderKategori() {
    const katList = ['Semua'];
    state.produk.forEach((p) => {
      if (p.kategori && !katList.includes(p.kategori)) katList.push(p.kategori);
    });

    const wadah = $('#wadahKategori');
    if (!wadah) return;
    wadah.innerHTML = katList.map((kat) => `
      <button type="button" class="chip-kat ${kat === kategoriAktif ? 'aktif' : ''}" data-kat="${kat}">
        ${kat}
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

    const query = ($('#inputCariProduk')?.value || '').toLowerCase().trim();
    const difilter = state.produk.filter((p) => {
      const matchKat = kategoriAktif === 'Semua' || p.kategori === kategoriAktif;
      const matchCari = !query || p.nama.toLowerCase().includes(query) || (p.kode && p.kode.toLowerCase().includes(query));
      return matchKat && matchCari;
    });

    if (difilter.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--teks-redup);">Menu tidak ditemukan.</p>';
      return;
    }

    grid.innerHTML = difilter.map((p) => {
      const ikon = IKON_KAT[p.kategori] || IKON_KAT.Default;
      const habis = p.stok <= 0;
      return `
        <div class="kartu-produk ${habis ? 'habis' : ''}" data-id="${p.id}">
          <div>
            <div class="produk-ikon-wadah">${ikon}</div>
            <div class="produk-info">
              <h4>${p.nama}</h4>
              <span class="produk-kategori-tag">${p.kategori}</span>
            </div>
          </div>
          <div class="produk-bawah">
            <span class="produk-harga">${fmtRp(p.harga)}</span>
            <span class="stok-badge">${habis ? 'Habis' : p.stok + ' porsi'}</span>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.kartu-produk:not(.habis)').forEach((card) => {
      card.addEventListener('click', () => tambahKeKeranjang(card.dataset.id));
    });
  }

  // ----------------------------------------------------
  // KERANJANG PESANAN
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
        qty: 1
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

    if (keranjang.length === 0) {
      wadah.innerHTML = '<p style="text-align: center; color: var(--teks-redup); margin-top: 40px;">Belum ada pesanan terpilih.<br>Klik menu bakso atau minuman di samping.</p>';
      $('#labelSubtotal').textContent = fmtRp(0);
      $('#labelGrandTotal').textContent = fmtRp(0);
      $('#btnBayarNominal').textContent = fmtRp(0);
      $('#btnBukaBayar').disabled = true;
      return;
    }

    wadah.innerHTML = keranjang.map((item) => `
      <div class="item-keranjang">
        <div class="item-keranjang-kiri">
          <div class="item-keranjang-nama">${item.nama}</div>
          <div class="item-keranjang-harga">${fmtRp(item.harga)}</div>
        </div>
        <div class="item-keranjang-aksi">
          <button type="button" class="btn-stepper btn-kurang" data-id="${item.id}">-</button>
          <span class="item-qty">${item.qty}</span>
          <button type="button" class="btn-stepper btn-tambah" data-id="${item.id}">+</button>
        </div>
      </div>
    `).join('');

    wadah.querySelectorAll('.btn-kurang').forEach((b) => {
      b.addEventListener('click', () => kurangiDariKeranjang(b.dataset.id));
    });
    wadah.querySelectorAll('.btn-tambah').forEach((b) => {
      b.addEventListener('click', () => tambahKeKeranjang(b.dataset.id));
    });

    const subtotal = keranjang.reduce((acc, curr) => acc + (curr.harga * curr.qty), 0);
    const grandTotal = Math.max(0, subtotal - diskon);

    $('#labelSubtotal').textContent = fmtRp(subtotal);
    $('#labelDiskon').textContent = diskon > 0 ? '-' + fmtRp(diskon) : fmtRp(0);
    $('#labelGrandTotal').textContent = fmtRp(grandTotal);
    $('#btnBayarNominal').textContent = fmtRp(grandTotal);
    $('#btnBukaBayar').disabled = false;
  }

  // ----------------------------------------------------
  // PEMBAYARAN & NUMPAD
  // ----------------------------------------------------
  function aturPembayaran() {
    const modal = $('#modalBayar');
    const inputUang = $('#inputUangDiterima');
    const labelKembalian = $('#bayarKembalian');

    const updateKembalian = () => {
      const subtotal = keranjang.reduce((acc, curr) => acc + (curr.harga * curr.qty), 0);
      const total = Math.max(0, subtotal - diskon);
      const kembali = uangDiterima - total;
      labelKembalian.textContent = kembali >= 0 ? fmtRp(kembali) : '- ' + fmtRp(Math.abs(kembali));
      labelKembalian.style.color = kembali >= 0 ? 'var(--sukses)' : 'var(--bahaya)';
      $('#btnProsesBayar').disabled = kembali < 0;
    };

    $('#btnBukaBayar')?.addEventListener('click', () => {
      const subtotal = keranjang.reduce((acc, curr) => acc + (curr.harga * curr.qty), 0);
      const total = Math.max(0, subtotal - diskon);
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
        $$('.metode-kartu').forEach((k) => k.classList.remove('aktif'));
        e.target.closest('.metode-kartu').classList.add('aktif');

        const metode = e.target.value;
        const subtotal = keranjang.reduce((acc, curr) => acc + (curr.harga * curr.qty), 0);
        const total = Math.max(0, subtotal - diskon);

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
      const subtotal = keranjang.reduce((acc, curr) => acc + (curr.harga * curr.qty), 0);
      uangDiterima = Math.max(0, subtotal - diskon);
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

    // Proses Pembayaran Sukses
    $('#btnProsesBayar')?.addEventListener('click', () => {
      const subtotal = keranjang.reduce((acc, curr) => acc + (curr.harga * curr.qty), 0);
      const total = Math.max(0, subtotal - diskon);
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
        items: JSON.parse(JSON.stringify(keranjang)),
        subtotal,
        diskon,
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
    $('#strukKasir').textContent = trx.kasir;
    $('#strukMetode').textContent = trx.metode;

    const wadahItems = $('#strukItems');
    wadahItems.innerHTML = trx.items.map((it) => `
      <div class="struk-item-baris">
        <div class="struk-item-nama">${it.nama}</div>
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
  // MANAJEMEN MENU (CRUD)
  // ----------------------------------------------------
  function renderTabelProduk() {
    const tbody = $('#tbodyProduk');
    if (!tbody) return;

    const q = ($('#cariTabelProduk')?.value || '').toLowerCase().trim();
    const difilter = state.produk.filter((p) => !q || p.nama.toLowerCase().includes(q) || (p.kategori && p.kategori.toLowerCase().includes(q)));

    $('#labelTotalProduk').textContent = `${difilter.length} Menu`;

    if (difilter.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px; color: var(--teks-redup);">Tidak ada menu ditemukan.</td></tr>';
      return;
    }

    tbody.innerHTML = difilter.map((p) => `
      <tr>
        <td><strong>${p.nama}</strong><br><small style="color:var(--teks-redup);">${p.kode || '-'}</small></td>
        <td><span class="stok-badge">${p.kategori}</span></td>
        <td><b>${fmtRp(p.harga)}</b></td>
        <td>${fmtRp(p.modal || 0)}</td>
        <td>
          <span style="font-weight:700; color:${p.stok <= 10 ? 'var(--bahaya)' : 'inherit'}">
            ${p.stok} porsi
          </span>
        </td>
        <td>
          <button type="button" class="btn-tautan btn-edit-p" data-id="${p.id}">Ubah</button>
          &middot;
          <button type="button" class="btn-tautan btn-hapus-p" data-id="${p.id}" style="color:var(--bahaya);">Hapus</button>
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
    } else {
      $('#judulModalProduk').textContent = 'Tambah Menu Bakso';
      form.reset();
      $('#formProdukId').value = '';
      $('#formStok').value = 50;
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

      if (id) {
        const prod = state.produk.find((p) => p.id === id);
        if (prod) {
          prod.nama = nama;
          prod.kategori = kategori;
          prod.harga = harga;
          prod.modal = modal;
          prod.stok = stok;
          prod.kode = kode;
        }
      } else {
        state.produk.push({
          id: 'b_' + Date.now(),
          nama,
          kategori,
          harga,
          modal,
          stok,
          kode
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
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 24px; color: var(--teks-redup);">Belum ada riwayat pesanan.</td></tr>';
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
          <td><span class="stok-badge">${t.metode}</span></td>
          <td><b>${fmtRp(t.total)}</b></td>
          <td>
            <span class="stok-badge" style="background:${batal ? 'var(--bahaya-bg)' : 'var(--sukses-bg)'}; color:${batal ? 'var(--bahaya)' : 'var(--sukses)'}">
              ${t.status}
            </span>
          </td>
          <td>
            <button type="button" class="btn-tautan btn-cetak-trx" data-inv="${t.invoice}">Nota</button>
            ${!batal ? `&middot; <button type="button" class="btn-tautan btn-batal-trx" data-inv="${t.invoice}" style="color:var(--bahaya);">Batalkan</button>` : ''}
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
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 16px; color:var(--teks-redup);">Belum ada data penjualan pada periode ini.</td></tr>';
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
    $$('#wadahPeriodeLaporan .pil').forEach((btn) => {
      btn.addEventListener('click', () => {
        $$('#wadahPeriodeLaporan .pil').forEach((b) => b.classList.remove('aktif'));
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
  }

  function aturPengaturan() {
    $('#formProfilToko')?.addEventListener('submit', (e) => {
      e.preventDefault();
      state.toko.nama = $('#setNamaToko').value.trim();
      state.toko.alamat = $('#setAlamatToko').value.trim();
      state.toko.telp = $('#setTelpToko').value.trim();
      state.toko.pesanStruk = $('#setCatatanStruk').value.trim();
      simpanData();

      $('#namaTokoHeader').textContent = state.toko.nama;
      alert('Profil Bakso Pak Darto berhasil diperbarui!');
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
      a.download = `backup-nataarta-bakso-pak-darto-${new Date().toISOString().slice(0, 10)}.json`;
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
      let csv = 'Nota,Waktu,Kasir,Metode,Subtotal,Diskon,Total,Bayar,Kembali,Status,Item Pesanan\n';
      state.transaksi.forEach((t) => {
        const items = t.items.map((i) => `${i.nama} x${i.qty}`).join('; ');
        csv += `"${t.invoice}","${t.waktu}","${t.kasir}","${t.metode}",${t.subtotal},${t.diskon},${t.total},${t.bayar},${t.kembali},"${t.status}","${items}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rekap-penjualan-pak-darto-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // ----------------------------------------------------
  // KUNCI LAYAR PIN
  // ----------------------------------------------------
  function periksaKunciLayar() {
    const layar = $('#layarKunci');
    if (state.toko.kunciPin) {
      layar.hidden = false;
      pinBuffer = '';
      updatePinIndikator();
    } else {
      layar.hidden = true;
    }
  }

  function updatePinIndikator() {
    $$('#pinIndikator .titik-pin').forEach((titik, idx) => {
      titik.classList.toggle('terisi', idx < pinBuffer.length);
    });
  }

  function aturPadPin() {
    $$('.pad-pin .btn-pin[data-angka]').forEach((b) => {
      b.addEventListener('click', () => {
        if (pinBuffer.length < 4) {
          pinBuffer += b.dataset.angka;
          updatePinIndikator();

          if (pinBuffer.length === 4) {
            setTimeout(() => {
              const targetPin = state.toko.pin || '1234';
              if (pinBuffer === targetPin) {
                $('#layarKunci').hidden = true;
                pinBuffer = '';
                updatePinIndikator();
              } else {
                alert('PIN kasir salah!');
                pinBuffer = '';
                updatePinIndikator();
              }
            }, 100);
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
    });

    $('#btnKunciSesi')?.addEventListener('click', () => {
      $('#layarKunci').hidden = false;
      pinBuffer = '';
      updatePinIndikator();
    });
  }

  // Diskon Prompt
  function aturDiskon() {
    $('#btnAturDiskon')?.addEventListener('click', () => {
      const subtotal = keranjang.reduce((acc, curr) => acc + (curr.harga * curr.qty), 0);
      const input = prompt(`Masukkan nominal diskon (Rp) [Maksimal ${fmtRp(subtotal)}]:`, String(diskon || ''));
      if (input !== null) {
        const nominal = Math.max(0, Math.min(Number(input) || 0, subtotal));
        diskon = nominal;
        renderKeranjang();
      }
    });

    $('#btnKosongkanKeranjang')?.addEventListener('click', () => {
      if (keranjang.length > 0 && confirm('Kosongkan keranjang pesanan meja?')) {
        keranjang = [];
        diskon = 0;
        renderKeranjang();
      }
    });

    $('#inputCariProduk')?.addEventListener('input', renderGridProduk);
  }

  // ----------------------------------------------------
  // INISIALISASI UTAMA
  // ----------------------------------------------------
  function init() {
    $('#namaTokoHeader').textContent = state.toko.nama || 'Bakso Pak Darto';
    $('#judulTokoKunci').textContent = state.toko.nama || 'Bakso Pak Darto';

    aturNavigasi();
    aturJam();
    aturPadPin();
    periksaKunciLayar();

    renderKategori();
    renderGridProduk();
    renderKeranjang();

    aturDiskon();
    aturPembayaran();
    aturModalStruk();
    aturFormProduk();
    aturFilterRiwayat();
    aturPeriodeLaporan();
    aturPengaturan();

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
