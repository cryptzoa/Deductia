# 🎓 Deductia

**Deductia** sistem manajemen absensi dan pembelajaran (LMS) modern yang dirancang khusus untuk perkuliahan. Sistem ini menjembatani komunikasi antara dosen dan mahasiswa melalui pengalaman digital yang mulus, aman, dan real-time.

![User Dashboard](/assets/Dashboard/Users/Mhs-Dashboard.png)




---

## 🚀 Teknologi yang Digunakan (Tech Stack)

### Backend (API & Admin)

- **Framework**: Laravel 12.x
- **Admin Panel**: Filament PHP 3.x
- **Database**: MySQL / MariaDB
- **Autentikasi**: Laravel Sanctum (Token-based)
- **Containerization**: Docker (PHP 8.3-FPM + Nginx + Supervisor)
- **Task Queue**: Laravel Queues (Redis/Database) untuk pemrosesan background
- **Deployment**: Railway

### Frontend (User Interface)

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios dengan Interceptors
- **AI / Face Detection**: face-api.js (Client-side TensorFlow based)
- **Maps & Location**: Browser Geolocation API
- **Deployment**: Vercel

---

## 🔒 Keamanan & Infrastruktur

### 1. Autentikasi & Otorisasi

Sistem menggunakan standar keamanan industri untuk melindungi data pengguna:

- **Laravel Sanctum**: Seluruh komunikasi API diamankan menggunakan Bearer Token (Stateful & Stateless support).
- **Middleware `auth:sanctum`**: Melindungi endpoint sensitif agar hanya bisa diakses oleh user yang login.
- **Middleware `user.active`**: Layer keamanan tambahan yang memastikan hanya mahasiswa yang status akunnya sudah **DISETUJUI (Verified)** oleh admin yang bisa mengakses dashboard. Akun "Waiting" akan diarahkan ke halaman tunggu.
- **Password Hashing**: Semua password di-hash menggunakan algoritma Bcrypt yang aman.

### 2. Validasi Input

- **Server-Side Validation**: Seluruh input dari frontend (NIM, file upload, koordinat) divalidasi ketat di backend menggunakan Laravel Validation Rules.
- **File Sanitization**: Mencegah upload file berbahaya dengan membatasi tipe MIME (gambar/dokumen saja) dan ukuran file.

### 3. Proteksi Absensi (Anti-Fraud)

Untuk mencegah kecurangan (titip absen), sistem menerapkan validasi berlapis:

- **Geo-Fencing (Radius Kampus)**:
  - Sistem menghitung jarak antara koordinat GPS User dengan koordinat Kampus menggunakan formula Haversine.
  - Secara default, absensi ditolak jika jarak > 100 meter (dapat dikonfigurasi di Admin Panel).
- **AI Face Detection**: Menggunakan library **`face-api.js` (TensorFlow.js)** di sisi klien.
  - Sistem mendeteksi keberadaan wajah manusia secara _real-time_ melalui kamera.
  - Tombol submit hanya aktif jika AI mengonfirmasi adanya wajah dengan tingkat kepercayaan tertentu.
  - Mencegah pengambilan gambar benda mati atau foto kosong.
- **One-Device Enforcement**: Mencegah satu akun login di banyak device secara bersamaan melalui manajemen token (Login baru akan menendang sesi lama).
- **Window Time**: Absensi hanya valid jika dilakukan dalam waktu 15 menit sejak sesi dibuka.

---

## 🔗 Integrasi API (Frontend - Backend)

Frontend berkomunikasi dengan Backend melalui **RESTful API**.

### Axios Interceptor

Di sisi Frontend (`lib/axios.ts`), saya menggunakan interceptor untuk menangani request secara otomatis:

1.  **Request Interceptor**: Secara otomatis menyisipkan header `Authorization: Bearer <token>` ke setiap request jika token tersimpan di LocalStorage.
2.  **Response Interceptor**: Menangani error global, seperti jika token kedaluwarsa (`401 Unauthorized`), user akan otomatis di-logout dan diarahkan ke halaman login.

### Struktur Endpoint Utama

### Struktur Endpoint Utama & Payload

#### 1. Submit Absensi (`POST /api/sessions/{id}/attend`)

Endpoint ini menangani validasi kompleks dari sisi backend.

- **Header**: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Body (Form Data)**:
  - `selfie`: File gambar (JPG/PNG).
  - `latitude`: Lintang lokasi user (Float).
  - `longitude`: Bujur lokasi user (Float).
  - `face_detected`: `true` (Boolean/String) - Flag hasil deteksi AI dari frontend.

#### 2. Get User Profile (`GET /api/me`)

- **Response**: Detail user termasuk `status` (active/waiting).

#### 3. Get Materials (`GET /api/materials`)

- **Response**: List materi dengan auto-detected `file_type` (pdf, video, link).

---

## ✨ Fitur & Detail Teknis

### 1. Modul Absensi Cerdas & AI Implementation

Sistem menggabungkan Geolocation API dan Client-side AI untuk validasi maksimal.

#### a. Face Detection Workflow (`face-api.js`)

Sistem tidak mengirim gambar ke server untuk dianalisis (menghemat bandwidth & server load), melainkan melakukan **Edge Computing** di browser user:

1.  **Model Loading**: Saat komponen Absensi dibuka, sistem meload model `TinyFaceDetector` (~190KB) dari folder `/public/models`.
2.  **Detection Loop**: Video stream kamera di-scan setiap 500ms.
3.  **State Management**: Jika `confidance_score > 0.5`, UI membuka kunci tombol "Capture".
4.  **Submission**: Parameter `face_detected=true` dikirim ke Backend sebagai tanda validasi lokal berhasil.

#### b. Validasi Lokasi & Server

1.  **Single Submission**: Cek unique constraint di database `exists()`.
2.  **Background Processing**: Job Queue (`ProcessAttendanceAddress`) melakukan Reverse Geocoding via eksternal API secara asinkron.

### 2. Pusat Materi (Learning Hub)

Dosen dapat mendistribusikan materi dnegan fitur auto-detection:

- **Support Beragam Tipe**: PDF, PPT, dan Link Eksternal (YouTube/Drive).
- **Smart Type Recognition**: Backend otomatis mendeteksi tipe file berdasarkan ekstensi atau domain link (misal: link youtube dikenali sebagai video), lalu Frontend menampilkan ikon yang sesuai (ikon PDF, Play Button untuk video, dll).
- **Direct Access**: File disajikan melalui secure URL yang digenerate oleh backend (`asset()`).

### 3. Dashboard Real-time

- **Sesi Aktif**: Menampilkan sesi yang sedang berlangsung dengan indikator "Live".
- **Progress Bar**: Visualisasi berapa persen pertemuan yang sudah diselesaikan dalam satu semester.
- **Statistik**: Grafik donat (Chart) yang menghitung persentase kehadiran: `(Hadir / Total Sesi Berlalu) * 100`.

---

## 🛠️ Instalasi & Setup

### Prasyarat

- PHP 8.3+ & Composer
- Node.js 18+ & NPM
- MySQL Server
- Git

### Tahap 1: Backend (Laravel)

1.  **Clone & Install Dependencies**

    ```bash
    git clone https://github.com/username/deductia.git
    cd backend
    composer install
    ```

2.  **Konfigurasi Environment**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

    _Edit `.env` sesuaikan database:_

    ```env
    DB_DATABASE=deductia
    DB_USERNAME=root
    DB_PASSWORD=
    ```

3.  **Migrasi & Admin User**

    ```bash
    php artisan migrate
    php artisan make:filament-user # Ikuti prompt untuk buat akun dosen
    ```

4.  **Jalankan Server**
    ```bash
    php artisan serve
    php artisan queue:listen # Penting untuk fitur geocoding background
    ```

### Tahap 2: Frontend (Next.js)

1.  **Install Dependencies**

    ```bash
    cd ../deductia-fe
    npm install
    ```

2.  **Konfigurasi Environment**

    ```bash
    cp .env.local.example .env.local
    ```

    _Isi `.env.local`:_

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000/api
    ```

3.  **Jalankan Frontend**
    ```bash
    npm run dev
    ```
    Buka `http://localhost:3000` di browser.

---

## 👨‍💻 Developer

Tugas Akhir / UAS Pemrograman Pemrograman Dasar 2

- **Nama**: RAYHAN SOEANGKUPON LUBIS
- **NIM**: 2025806013
- **Kelas**: TI 2
- **Prodi**: TEKNOLOGI INFORMASI
- **Dosen Pengampu**: Rintis Mardika Sunarto, S.Kom., M.Kom.

---
