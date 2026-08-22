import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Archivo } from 'next/font/google';
import { ArrowRight, BarChart3, Building2, Check, LayoutDashboard, MapPin, QrCode, ScanLine, Smartphone, Star } from 'lucide-react';
import './landing.css';

const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo', display: 'swap' });

export const metadata: Metadata = {
  title: 'AyoReview | Kartu NFC & QR untuk Ulasan Google',
  description: 'Bantu pelanggan memberi ulasan Google dengan mudah. Cukup ketuk kartu NFC atau pindai QR di tempat usaha Anda.',
};

const placements = [
  { label: 'Di kasir', className: 'use-cashier' },
  { label: 'Di meja', className: 'use-table' },
  { label: 'Di resepsionis', className: 'use-reception' },
];

function ReviewCard({ priority = false }: { priority?: boolean }) {
  return <div className="review-card"><Image src="/images/review-card-reference.png" alt="Kartu AyoReview dengan merek Google, nama bisnis, kode QR, dan area ketuk NFC" fill priority={priority} sizes="(max-width: 700px) 88vw, 520px" /></div>;
}

function ReviewStars({ label = 'Bintang dari pelanggan' }: { label?: string }) {
  return <div className="review-stars" role="img" aria-label={label}>{Array.from({ length: 5 }, (_, index) => <Star key={index} aria-hidden="true" />)}</div>;
}

export default function LandingPage() {
  return <main lang="id" className={`landing ${archivo.variable}`}>
    <nav className="landing-nav" aria-label="Navigasi utama"><div className="nav-inner">
      <Link href="/" className="wordmark" aria-label="Beranda AyoReview"><span aria-hidden="true">A</span>AyoReview</Link>
      <div className="nav-links"><a href="#cara-kerja">Cara kerja</a><a href="#produk">Produknya</a><a href="#penempatan">Penempatan</a></div>
      <Link href="/signup" className="button button-small">Beli Sekarang</Link>
    </div></nav>

    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy"><p className="eyebrow">Kartu NFC + QR untuk Ulasan Google</p><h1 id="hero-title">Tingkatkan peringkat Google. Bangun kepercayaan.</h1><p className="hero-deck">Pelanggan cukup mengetuk atau memindai QR untuk memberi ulasan dan meyakinkan lebih banyak calon pelanggan.</p><div className="hero-actions"><Link href="/signup" className="button">Beli Sekarang <ArrowRight aria-hidden="true" /></Link><a href="#cara-kerja" className="text-action">Lihat cara kerja <ScanLine aria-hidden="true" /></a></div></div>
      <div className="hero-product" aria-label="Kartu AyoReview"><div className="google-shape google-shape-blue" aria-hidden="true" /><div className="google-shape google-shape-yellow" aria-hidden="true" /><div className="product-shadow" aria-hidden="true" /><ReviewCard priority /><div className="rating-badge"><ReviewStars /><strong>Ulasan Google</strong><span>Lebih mudah diminta</span></div></div>
    </section>

    <section className="trust-story" aria-labelledby="trust-title">
      <div className="trust-copy reveal"><ReviewStars label="Lima bintang ulasan" /><h2 id="trust-title">Ulasan bagus membuat orang lebih percaya.</h2><p>Sebelum datang atau membeli, calon pelanggan sering memeriksa Google. Ulasan yang kuat membantu usaha Anda lebih meyakinkan.</p></div>
      <div className="friction-note reveal"><p>Masalahnya sederhana</p><strong>Pelanggan puas sering lupa memberi ulasan.</strong><span>AyoReview mengingatkan mereka di waktu yang tepat, sebelum meninggalkan tempat Anda.</span></div>
    </section>

    <section className="how" id="cara-kerja" aria-labelledby="how-title"><div className="section-heading reveal"><h2 id="how-title">Tiga langkah. Tidak ribet.</h2><p>Tanpa cari nama bisnis, tanpa ketik alamat, tanpa instruksi panjang.</p></div><ol className="steps">
      <li className="reveal"><span><Smartphone aria-hidden="true" /></span><h3>Ketuk atau pindai</h3><p>Pelanggan mendekatkan ponsel atau memindai QR.</p></li>
      <li className="reveal"><span><MapPin aria-hidden="true" /></span><h3>Google terbuka</h3><p>Langsung masuk ke halaman ulasan bisnis Anda.</p></li>
      <li className="reveal"><span><Star aria-hidden="true" /></span><h3>Ulasan masuk</h3><p>Pelanggan tinggal memilih bintang dan mengirim.</p></li>
    </ol></section>

    <section className="product" id="produk" aria-labelledby="product-title"><div className="product-stage reveal"><ReviewCard /></div><div className="product-copy reveal"><h2 id="product-title">Satu kartu, dua cara yang mudah.</h2><p>Taruh di tempat pelanggan biasa berhenti. NFC siap diketuk, QR siap dipindai.</p><div className="product-points"><span><Check aria-hidden="true" /> Siap dipajang</span><span><Check aria-hidden="true" /> NFC + QR dalam satu produk</span><span><Check aria-hidden="true" /> Dibuat untuk bisnis Anda</span></div><Link href="/signup" className="button">Pesan Kartu Ulasan <ArrowRight aria-hidden="true" /></Link></div></section>

    <section className="placements" id="penempatan" aria-labelledby="placements-title"><div className="section-heading reveal"><h2 id="placements-title">Taruh di momen yang pas.</h2><p>Dekat pembayaran, setelah layanan selesai, atau saat pelanggan bersiap pulang.</p></div><div className="placement-grid">{placements.map((place) => <article className={`placement ${place.className} reveal`} key={place.label}><Image src="/images/placement-scenes.png" alt={`${place.label} sebagai tempat AyoReview digunakan`} fill sizes="(max-width: 760px) 92vw, 33vw" /><h3>{place.label}</h3></article>)}</div><p className="placement-more">Cocok juga untuk klinik, salon, pangkas rambut, toko, hotel, dan meja resepsionis.</p></section>

    <section className="software" aria-labelledby="software-title"><div className="software-copy reveal"><p className="eyebrow">Sudah termasuk</p><h2 id="software-title">Kartu fisiknya didukung dasbor.</h2><p>Kelola semua kartu dan cabang dari satu tempat. Praktis saat bisnis Anda bertambah.</p></div><div className="software-list reveal">
      <div><LayoutDashboard aria-hidden="true" /><span><strong>Kelola kartu</strong>Aktifkan dan atur kartu bisnis.</span></div><div><QrCode aria-hidden="true" /><span><strong>Perbarui tautan</strong>Ganti tujuan tanpa mengganti kartu.</span></div><div><BarChart3 aria-hidden="true" /><span><strong>Lihat aktivitas</strong>Pantau jumlah ketukan dan pindaian.</span></div><div><Building2 aria-hidden="true" /><span><strong>Atur cabang</strong>Bedakan kartu di tiap lokasi.</span></div>
    </div></section>

    <section className="closing" aria-labelledby="closing-title"><div><ReviewStars label="Lima bintang Ulasan Google" /><h2 id="closing-title">Ubah kepuasan pelanggan menjadi ulasan yang terlihat.</h2><p>Pasang AyoReview di bisnis Anda dan mulai meminta ulasan dengan cara yang lebih mudah.</p></div><Link href="/signup" className="button button-inverse">Beli Sekarang <ArrowRight aria-hidden="true" /></Link></section>
    <footer><Link href="/" className="wordmark"><span aria-hidden="true">A</span>AyoReview</Link><p>Kartu NFC + QR untuk Ulasan Google.</p><div><Link href="/login">Masuk</Link><Link href="/signup">Beli Sekarang</Link></div><small>© 2026 AyoReview. Hak cipta dilindungi.</small></footer>
  </main>;
}
