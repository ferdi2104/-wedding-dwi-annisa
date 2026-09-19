# The Wedding of Dwi & Annisa 💍

Website undangan pernikahan digital bertema **Adat Sunda (Alam & Saung Tradisional)** yang elegan, responsif, dan interaktif untuk seluruh perangkat handphone (Android & iOS).

---

## ✨ Fitur Utama

- **Layar Pembuka / Cover Interaktif:**
  - Animasi kepakan kupu-kupu & burung melintas di langit.
  - Hiasan bunga sudut bergoyang lembut tertiup angin.
  - Bangunan saung bernuansa hidup dengan pancaran cahaya lampu jendela temaram.
  - Efek kelopak bunga melati berjatuhan & kunang-kunang melayang di halaman.
  - Indikator buka undangan animasi *bouncing scroll pill*.
- **Nama Tamu Undangan Dinamis:** Mendukung URL parameter (contoh: `?to=Nama+Tamu`).
- **Musik Latar Interaktif:** Tombol kontrol piringan hitam (*vinyl disc*) berputar dengan sound track lagu Sunda *Jalir Jangji*.
- **Informasi Mempelai & Keluarga:** Menampilkan profil lengkap kedua mempelai beserta nama orang tua.
- **Save The Date & Countdown Timer:** Hitung mundur waktu langsung menuju hari pernikahan (25 September 2026).
- **Rincian Acara & Integrasi Peta:**
  - **Akad Nikah:** Jum'at, 25 September 2026 | KUA Cengkareng.
  - **Resepsi:** Sabtu, 26 September 2026 | Pendongkelan 008/016 Kapuk, Cengkareng (titik presisi Google Maps).
- **Galeri Foto:** Galeri foto kedua mempelai dilengkapi popup *Lightbox Modal*.
- **Amplop Digital (Cashless Gift):**
  - Kartu BCA Dwi Saputra & Annisa Mustafidah dengan tombol salin nomor rekening satu klik.
  - Alamat pengiriman kado fisik beserta tombol salin alamat.
- **Buku Tamu / Doa & RSVP:** Form konfirmasi kehadiran dan pengiriman doa restu yang tersimpan secara lokal.
- **Aksesibilitas & Kompatibilitas Mobile:**
  - Teroptimasi penuh untuk seluruh layar HP Android & iPhone (`viewport-fit=cover`, dynamic `--vh`, safe area insets).
  - Mendukung preferensi gerak rendah (`prefers-reduced-motion`).
  - Dukungan navigasi keyboard penuh (APG standards).

---

## 🛠️ Teknologi yang Digunakan

- **HTML5:** Struktur semantik, landmark aksesibilitas, dan audio player native.
- **CSS3:** Flexbox, CSS Grid, custom properties (CSS variables), keyframe animations, dan media queries adaptif.
- **JavaScript (Vanilla):** DOM manipulation, audio controller, countdown timer, clipboard copy API, dan dynamic query parser.
- **Font & Ikon:** Google Fonts (*Great Vibes*, *Playfair Display*, *Nunito Sans*) & Font Awesome Icons 6.

---

## 📂 Struktur Berkas

```text
├── index.html              # Halaman utama undangan digital
├── style.css               # Gaya tampilan, layout mobile & animasi
├── script.js               # Logika countdown, audio, rsvp, dan interaksi
├── README.md               # Dokumentasi proyek
└── assets/
    ├── audio/
    │   └── wedding-song.mp3 # Lagu latar instrumen Sunda
    └── images/             # Ornamen, foto mempelai, latar & sprite animasi
```

---

## 🚀 Cara Menjalankan

1. Clone repositori ini atau download sebagai ZIP:
   ```bash
   git clone https://github.com/ferdi2104/-wedding-dwi-annisa.git
   ```
2. Buka berkas `index.html` langsung di browser Anda (Google Chrome, Safari, Firefox, Edge, dsb.).
3. Untuk menguji nama tamu undangan, tambahkan parameter `?to=` pada tautan:
   ```text
   index.html?to=Bapak+Budi+Sekeluarga
   ```
