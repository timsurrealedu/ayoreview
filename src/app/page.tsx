import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Archivo } from 'next/font/google';
import { ArrowRight, BarChart3, Building2, Check, LayoutDashboard, MapPin, Nfc, QrCode, Smartphone, Star } from 'lucide-react';
import { ActivateCardModal } from '@/components/ui/activate-card-modal';
import { LandingCounter } from './landing-counter';
import './landing.css';

/*
THESIS: The product is shown working before it is explained — first viewport is the merchant's own dashboard mid-count, not a claim about reviews.
OWN-WORLD: Committed violet (#7c3aed) on warm-white canvas #fbfaff; white surfaces at 16px radii with soft offset shadows; Archivo throughout; green/amber reserved for data states.
STORY: Visitor sees review count rising live, believes the loop works, learns tap→review in three beats, sees the card in real placements, orders.
FIRST VIEWPORT: Left 45%: headline with violet emphasis word, deck, primary "Pesan Sekarang" + secondary activation action. Right 55%: white dashboard mock (counting number, NFC/QR split, drawn sparkline) overlapped by angled physical card photo. Primary action bottom-left of viewport half.
FORM: "The counter that counts" — dealt index 5, seed key ccc25469, locked by user.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
*/

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
  return <div className="review-card"><Image src="/images/nfc-card-design.png" alt="Kartu AyoReview: kode QR untuk scan dan area NFC untuk ketuk, dengan merek Google" fill priority={priority} sizes="(max-width: 700px) 88vw, 520px" /></div>;
}

function ReviewStars({ label = 'Bintang dari pelanggan' }: { label?: string }) {
  return <div className="review-stars" role="img" aria-label={label}>{Array.from({ length: 5 }, (_, index) => <Star key={index} aria-hidden="true" />)}</div>;
}

export default function LandingPage() {
  return <main lang="id" className={`landing ${archivo.variable}`}>
    <nav className="landing-nav" aria-label="Navigasi utama"><div className="nav-inner">
      <Link href="/" className="wordmark" aria-label="Beranda AyoReview"><span aria-hidden="true">A</span>AyoReview</Link>
      <div className="nav-links"><a href="#cara-kerja">Cara kerja</a><a href="#produk">Produknya</a><a href="#penempatan">Penempatan</a></div>
      <div className="nav-actions">
        <ActivateCardModal />
        <Link href="/login" className="button button-small button-inverse">Masuk</Link>
      </div>
    </div></nav>

    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title">Ulasan Google naik,<em> begitu saja.</em></h1>
        <p className="hero-deck">Kartu NFC + QR di meja atau kasir Anda. Pelanggan mengetuk, ulasan masuk, dasbor Anda menghitung. Tanpa aplikasi, tanpa ribet.</p>
        <div className="hero-actions">
          <Link href="/pesan" className="button">Pesan Sekarang <ArrowRight aria-hidden="true" /></Link>
          <ActivateCardModal />
        </div>
        <p className="hero-note">Kartu siap pakai Rp 20.000 sekali bayar · dikirim ke alamat Anda</p>
      </div>

      <div className="hero-demo" role="img" aria-label="Contoh tampilan dasbor AyoReview dengan jumlah ulasan yang bertambah, rasio NFC dan QR, serta tren 30 hari">
        <div className="dash-mock" aria-hidden="true">
          <div className="dash-head"><strong>Ulasan bulan ini</strong><span className="dash-live">Langsung</span></div>
          <LandingCounter />
          <div className="dash-split">
            <div><Nfc /><i style={{ '--w': '68%' } as React.CSSProperties} /></div>
            <div><QrCode /><i style={{ '--w': '32%' } as React.CSSProperties} /></div>
          </div>
          <svg className="dash-spark" viewBox="0 0 220 56" preserveAspectRatio="none">
            <path className="spark-line" d="M0,46 C18,44 28,38 44,39 S70,30 88,31 S116,20 134,22 S166,10 184,13 S210,4 220,5" />
          </svg>
          <div className="dash-foot">Tren 30 hari terakhir</div>
        </div>
        <div className="demo-card-wrap"><ReviewCard priority /></div>
        <p className="demo-caption">Contoh tampilan dasbor Anda</p>
      </div>
    </section>

    <section className="trust-story" aria-labelledby="trust-title">
      <div className="trust-copy reveal"><ReviewStars label="Lima bintang ulasan" /><h2 id="trust-title">Ulasan bagus membuat orang lebih percaya.</h2><p>Sebelum datang atau membeli, calon pelanggan sering memeriksa Google. Ulasan yang kuat membantu usaha Anda lebih meyakinkan.</p></div>
      <div className="friction-note reveal"><strong>Pelanggan puas sering lupa memberi ulasan.</strong><span>AyoReview mengingatkan mereka di waktu yang tepat, sebelum meninggalkan tempat Anda.</span></div>
    </section>

    <section className="how" id="cara-kerja" aria-labelledby="how-title"><div className="section-heading reveal"><h2 id="how-title">Tiga langkah. Tidak ribet.</h2><p>Tanpa cari nama bisnis, tanpa ketik alamat, tanpa instruksi panjang.</p></div><ol className="steps">
      <li className="reveal"><span><Smartphone aria-hidden="true" /></span><h3>Ketuk atau pindai</h3><p>Pelanggan mendekatkan ponsel atau memindai QR.</p></li>
      <li className="reveal"><span><MapPin aria-hidden="true" /></span><h3>Google terbuka</h3><p>Langsung masuk ke halaman ulasan bisnis Anda.</p></li>
      <li className="reveal"><span><Star aria-hidden="true" /></span><h3>Ulasan masuk</h3><p>Pelanggan tinggal memilih bintang dan mengirim — dasbor Anda bertambah.</p></li>
    </ol></section>

    <section className="product" id="produk" aria-labelledby="product-title"><div className="product-stage reveal"><ReviewCard /></div><div className="product-copy reveal"><h2 id="product-title">Satu kartu, dua cara yang mudah.</h2><p>Taruh di tempat pelanggan biasa berhenti. NFC siap diketuk, QR siap dipindai.</p><div className="product-points"><span><Check aria-hidden="true" /> Siap dipajang</span><span><Check aria-hidden="true" /> NFC + QR dalam satu produk</span><span><Check aria-hidden="true" /> Dibuat untuk bisnis Anda</span></div><Link href="/pesan" className="button">Pesan Kartu Ulasan <ArrowRight aria-hidden="true" /></Link></div></section>

    <section className="placements" id="penempatan" aria-labelledby="placements-title"><div className="section-heading reveal"><h2 id="placements-title">Taruh di momen yang pas.</h2><p>Dekat pembayaran, setelah layanan selesai, atau saat pelanggan bersiap pulang.</p></div><div className="placement-grid">{placements.map((place) => <article className={`placement ${place.className} reveal`} key={place.label}><Image src="/images/placement-scenes.png" alt={`${place.label} sebagai tempat AyoReview digunakan`} fill sizes="(max-width: 760px) 92vw, 33vw" /><h3>{place.label}</h3></article>)}</div><p className="placement-more">Cocok juga untuk klinik, salon, pangkas rambut, toko, hotel, dan meja resepsionis.</p></section>

    <section className="software" aria-labelledby="software-title"><div className="software-copy reveal"><h2 id="software-title">Kartu fisiknya didukung dasbor.</h2><p>Kelola semua kartu dan cabang dari satu tempat. Praktis saat bisnis Anda bertambah.</p></div><div className="software-list reveal">
      <div><LayoutDashboard aria-hidden="true" /><span><strong>Kelola kartu</strong>Aktifkan dan atur kartu bisnis.</span></div><div><QrCode aria-hidden="true" /><span><strong>Perbarui tautan</strong>Ganti tujuan tanpa mengganti kartu.</span></div><div><BarChart3 aria-hidden="true" /><span><strong>Lihat aktivitas</strong>Pantau jumlah ketukan dan pindaian.</span></div><div><Building2 aria-hidden="true" /><span><strong>Atur cabang</strong>Bedakan kartu di tiap lokasi.</span></div>
    </div></section>

    <section className="closing" aria-labelledby="closing-title"><div><ReviewStars label="Lima bintang Ulasan Google" /><h2 id="closing-title">Mulai menghitung ulasan hari ini.</h2><p>Pesan kartu, tertaut ke bisnis Anda sebelum dikirim. Bayar via QRIS, GoPay, atau transfer bank.</p></div><Link href="/pesan" className="button button-inverse">Pesan Sekarang <ArrowRight aria-hidden="true" /></Link></section>
    <footer><Link href="/" className="wordmark"><span aria-hidden="true">A</span>AyoReview</Link><p>Kartu NFC + QR untuk Ulasan Google.</p><div><Link href="/login">Masuk</Link><Link href="/pesan">Pesan Sekarang</Link></div><small>© 2026 AyoReview. Hak cipta dilindungi.</small></footer>
  </main>;
}
