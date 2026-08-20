import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Archivo } from 'next/font/google';
import { ArrowRight, BarChart3, Building2, Check, LayoutDashboard, MapPin, QrCode, ScanLine, Smartphone, Star } from 'lucide-react';
import './landing.css';

const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo', display: 'swap' });

export const metadata: Metadata = {
  title: 'ReviewTap | Kartu NFC & QR untuk Google Review',
  description: 'Bantu pelanggan memberi review Google dengan mudah. Cukup tap kartu NFC atau scan QR di tempat usaha Anda.',
};

const placements = [
  { label: 'Di kasir', className: 'use-cashier' },
  { label: 'Di meja', className: 'use-table' },
  { label: 'Di resepsionis', className: 'use-reception' },
];

function ReviewCard({ priority = false }: { priority?: boolean }) {
  return <div className="review-card"><Image src="/images/review-card-reference.png" alt="Kartu ReviewTap dengan Google branding, nama bisnis, QR code, dan area tap NFC" fill priority={priority} sizes="(max-width: 700px) 88vw, 520px" /></div>;
}

function ReviewStars({ label = 'Bintang dari pelanggan' }: { label?: string }) {
  return <div className="review-stars" role="img" aria-label={label}>{Array.from({ length: 5 }, (_, index) => <Star key={index} aria-hidden="true" />)}</div>;
}

export default function LandingPage() {
  return <main lang="id" className={`landing ${archivo.variable}`}>
    <nav className="landing-nav" aria-label="Navigasi utama"><div className="nav-inner">
      <Link href="/" className="wordmark" aria-label="Beranda ReviewTap"><span aria-hidden="true">R</span>ReviewTap</Link>
      <div className="nav-links"><a href="#cara-kerja">Cara kerja</a><a href="#produk">Produknya</a><a href="#penempatan">Penempatan</a></div>
      <Link href="/signup" className="button button-small">Beli Sekarang</Link>
    </div></nav>

    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy"><p className="eyebrow">Kartu NFC + QR untuk Google Review</p><h1 id="hero-title">Tingkatkan rating Google. Bangun kepercayaan.</h1><p className="hero-deck">Pelanggan cukup tap atau scan QR untuk memberi review dan meyakinkan lebih banyak calon pelanggan.</p><div className="hero-actions"><Link href="/signup" className="button">Beli Sekarang <ArrowRight aria-hidden="true" /></Link><a href="#cara-kerja" className="text-action">Lihat cara kerja <ScanLine aria-hidden="true" /></a></div></div>
      <div className="hero-product" aria-label="Kartu ReviewTap"><div className="google-shape google-shape-blue" aria-hidden="true" /><div className="google-shape google-shape-yellow" aria-hidden="true" /><div className="product-shadow" aria-hidden="true" /><ReviewCard priority /><div className="rating-badge"><ReviewStars /><strong>Google Review</strong><span>Lebih mudah diminta</span></div></div>
    </section>

    <section className="trust-story" aria-labelledby="trust-title">
      <div className="trust-copy reveal"><ReviewStars label="Lima bintang review" /><h2 id="trust-title">Review bagus bikin orang lebih percaya.</h2><p>Sebelum datang atau membeli, calon pelanggan sering cek Google dulu. Review yang kuat membantu usaha Anda lebih meyakinkan.</p></div>
      <div className="friction-note reveal"><p>Masalahnya sederhana</p><strong>Pelanggan puas sering lupa memberi review.</strong><span>ReviewTap mengingatkan mereka di waktu yang pas, sebelum meninggalkan tempat Anda.</span></div>
    </section>

    <section className="how" id="cara-kerja" aria-labelledby="how-title"><div className="section-heading reveal"><h2 id="how-title">Tiga langkah. Tidak ribet.</h2><p>Tanpa cari nama bisnis, tanpa ketik alamat, tanpa instruksi panjang.</p></div><ol className="steps">
      <li className="reveal"><span><Smartphone aria-hidden="true" /></span><h3>Tap atau scan</h3><p>Pelanggan mendekatkan HP atau scan QR.</p></li>
      <li className="reveal"><span><MapPin aria-hidden="true" /></span><h3>Google terbuka</h3><p>Langsung masuk ke halaman review bisnis Anda.</p></li>
      <li className="reveal"><span><Star aria-hidden="true" /></span><h3>Review masuk</h3><p>Pelanggan tinggal pilih bintang dan kirim.</p></li>
    </ol></section>

    <section className="product" id="produk" aria-labelledby="product-title"><div className="product-stage reveal"><ReviewCard /></div><div className="product-copy reveal"><h2 id="product-title">Satu kartu, dua cara yang familiar.</h2><p>Taruh di tempat pelanggan biasa berhenti. NFC siap untuk tap, QR siap untuk scan.</p><div className="product-points"><span><Check aria-hidden="true" /> Siap dipajang</span><span><Check aria-hidden="true" /> NFC + QR dalam satu produk</span><span><Check aria-hidden="true" /> Dibuat untuk bisnis Anda</span></div><Link href="/signup" className="button">Pesan Review Card <ArrowRight aria-hidden="true" /></Link></div></section>

    <section className="placements" id="penempatan" aria-labelledby="placements-title"><div className="section-heading reveal"><h2 id="placements-title">Taruh di momen yang pas.</h2><p>Dekat pembayaran, setelah layanan selesai, atau saat pelanggan bersiap pulang.</p></div><div className="placement-grid">{placements.map((place) => <article className={`placement ${place.className} reveal`} key={place.label}><Image src="/images/placement-scenes.png" alt={`${place.label} sebagai tempat ReviewTap digunakan`} fill sizes="(max-width: 760px) 92vw, 33vw" /><h3>{place.label}</h3></article>)}</div><p className="placement-more">Cocok juga untuk klinik, salon, barbershop, toko, hotel, dan front desk.</p></section>

    <section className="software" aria-labelledby="software-title"><div className="software-copy reveal"><p className="eyebrow">Sudah termasuk</p><h2 id="software-title">Kartu fisiknya didukung dashboard.</h2><p>Kelola semua kartu dan cabang dari satu tempat. Praktis saat bisnis Anda bertambah.</p></div><div className="software-list reveal">
      <div><LayoutDashboard aria-hidden="true" /><span><strong>Kelola kartu</strong>Aktifkan dan atur kartu bisnis.</span></div><div><QrCode aria-hidden="true" /><span><strong>Update link</strong>Ganti tujuan tanpa ganti kartu.</span></div><div><BarChart3 aria-hidden="true" /><span><strong>Lihat aktivitas</strong>Pantau jumlah tap dan scan.</span></div><div><Building2 aria-hidden="true" /><span><strong>Atur cabang</strong>Bedakan kartu di tiap lokasi.</span></div>
    </div></section>

    <section className="closing" aria-labelledby="closing-title"><div><ReviewStars label="Lima bintang Google Review" /><h2 id="closing-title">Buat pelanggan puas jadi review yang terlihat.</h2><p>Pasang ReviewTap di bisnis Anda dan mulai minta review dengan cara yang lebih mudah.</p></div><Link href="/signup" className="button button-inverse">Beli Sekarang <ArrowRight aria-hidden="true" /></Link></section>
    <footer><Link href="/" className="wordmark"><span aria-hidden="true">R</span>ReviewTap</Link><p>Kartu NFC + QR untuk Google Review.</p><div><Link href="/login">Masuk</Link><Link href="/signup">Beli Sekarang</Link></div><small>© 2026 ReviewTap.</small></footer>
  </main>;
}
