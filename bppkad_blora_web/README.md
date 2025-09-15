# Website BPPKAD Blora - Realisasi APBD 2017-2024

Website untuk menampilkan data realisasi APBD (Anggaran Pendapatan dan Belanja Daerah) Kabupaten Blora dari tahun 2017-2024.

## Fitur

- **Dashboard Utama**: Ringkasan data APBD dengan grafik dan statistik
- **Halaman Kategori**: 
  - Pendapatan
  - Pembelanjaan  
  - Pembiayaan
- **Panel Admin**: Input dan kelola data APBD
- **Grafik Interaktif**: Bar chart dan line chart untuk visualisasi data
- **Responsive Design**: Tampilan optimal di desktop dan mobile

## Teknologi

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Database**: Supabase (PostgreSQL)
- **Charts**: Chart.js
- **Styling**: Custom CSS dengan desain modern dan minimalis

## Struktur Project

```
/
├── index.html          # Dashboard utama
├── pendapatan.html     # Halaman data pendapatan
├── pembelanjaan.html   # Halaman data pembelanjaan
├── pembiayaan.html     # Halaman data pembiayaan
├── admin.html          # Panel administrasi
├── css/
│   └── style.css       # Stylesheet utama
├── js/
│   ├── script.js       # Fungsi JavaScript utama
│   └── supabase.js     # Koneksi dan API Supabase
└── README.md           # Dokumentasi
```

## Setup Database Supabase

### 1. Buat Akun Supabase
1. Kunjungi [https://supabase.com](https://supabase.com)
2. Daftar/login ke akun Anda
3. Buat project baru

### 2. Setup Database Table
Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Buat tabel apbd_data
CREATE TABLE apbd_data (
    id BIGSERIAL PRIMARY KEY,
    kategori TEXT NOT NULL,
    subkategori TEXT NOT NULL,
    isi_subkategori TEXT,
    tahun INTEGER NOT NULL,
    anggaran NUMERIC DEFAULT 0,
    realisasi NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buat index untuk performa yang lebih baik
CREATE INDEX idx_apbd_kategori ON apbd_data(kategori);
CREATE INDEX idx_apbd_tahun ON apbd_data(tahun);
CREATE INDEX idx_apbd_subkategori ON apbd_data(kategori, subkategori);
```

### 3. Konfigurasi Koneksi
1. Buka file `js/supabase.js`
2. Ganti nilai berikut dengan kredensial Supabase Anda:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

**Cara mendapatkan kredensial:**
- URL: Dashboard Supabase → Settings → API → Project URL
- Anon Key: Dashboard Supabase → Settings → API → Project API Keys → anon/public

### 4. Setup Row Level Security (RLS)
Untuk keamanan data, aktifkan RLS di Supabase:

```sql
-- Aktifkan RLS
ALTER TABLE apbd_data ENABLE ROW LEVEL SECURITY;

-- Policy untuk read (semua user bisa membaca)
CREATE POLICY "Enable read access for all users" ON apbd_data
FOR SELECT USING (true);

-- Policy untuk insert/update/delete (hanya untuk authenticated users)
CREATE POLICY "Enable insert for authenticated users only" ON apbd_data
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON apbd_data
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON apbd_data
FOR DELETE USING (auth.role() = 'authenticated');
```

## Deployment ke GitHub Pages

### 1. Setup Repository
1. Buat repository baru di GitHub
2. Upload semua file project
3. Pastikan file `index.html` ada di root directory

### 2. Aktifkan GitHub Pages
1. Go to repository Settings
2. Scroll ke bagian "Pages"
3. Source: Deploy from a branch
4. Branch: main/master
5. Folder: / (root)
6. Save

### 3. Akses Website
Website akan tersedia di: `https://username.github.io/repository-name`

## Cara Penggunaan

### Mode User (Viewing)
1. **Dashboard**: Melihat ringkasan data APBD
2. **Kategori Pages**: Melihat detail data per kategori dengan grafik
3. **Data Tables**: Melihat data dalam format tabel

### Mode Admin
1. Akses halaman `/admin.html`
2. **Tambah Data**:
   - Pilih kategori (Pendapatan/Pembelanjaan/Pembiayaan)
   - Pilih tahun (2017-2024)
   - Input subkategori (manual typing)
   - Input isi subkategori (opsional)
   - Input nilai anggaran dan realisasi
   - Submit form
3. **Kelola Data**:
   - Lihat data existing dalam tabs
   - Hapus data dengan tombol "Hapus"

## Contoh Data

Struktur data APBD yang bisa diinput:

### Pendapatan
- **Subkategori**: Pajak Daerah, Retribusi Daerah, Dana Perimbangan
- **Isi Subkategori**: Pajak Bumi Bangunan, Pajak Kendaraan, dll.

### Pembelanjaan
- **Subkategori**: Belanja Pegawai, Belanja Barang, Belanja Modal
- **Isi Subkategori**: Gaji dan Tunjangan, ATK, Pembangunan Infrastruktur

### Pembiayaan
- **Subkategori**: Penerimaan Pembiayaan, Pengeluaran Pembiayaan
- **Isi Subkategori**: Sisa Lebih, Pembayaran Utang

## Troubleshooting

### Error "Supabase connection failed"
- Pastikan SUPABASE_URL dan SUPABASE_ANON_KEY sudah diisi dengan benar
- Cek koneksi internet
- Pastikan Supabase project masih aktif

### Data tidak tampil
- Cek apakah tabel `apbd_data` sudah dibuat di Supabase
- Pastikan ada data di dalam tabel
- Buka Developer Console (F12) untuk melihat error messages

### Error saat menambah data
- Pastikan semua field required sudah diisi
- Cek apakah ada error di console browser
- Pastikan RLS policy sudah disetup dengan benar

## Maintenance

### Update Data
- Gunakan panel admin untuk menambah/hapus data
- Backup data secara berkala dari Supabase dashboard

### Update Website
1. Edit file yang diperlukan
2. Commit dan push ke GitHub repository
3. GitHub Pages akan otomatis update website

## Support

Jika ada pertanyaan atau masalah:
1. Cek dokumentasi Supabase: [https://supabase.com/docs](https://supabase.com/docs)
2. Cek dokumentasi Chart.js: [https://www.chartjs.org/docs/](https://www.chartjs.org/docs/)
3. Buka issue di GitHub repository

---

**Dibuat untuk BPPKAD Kabupaten Blora**
*Website Realisasi APBD 2017-2024*