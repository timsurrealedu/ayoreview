import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Archivo } from 'next/font/google';
import { ArrowRight, BarChart3, Building2, Check, LayoutDashboard, MapPin, Nfc, QrCode, ShieldCheck, Smartphone, Star, X } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { getCurrentUser } from '@/lib/auth';
import { LandingCounter } from './landing-counter';
import { ScrollReveal } from './scroll-reveal';
import './landing.css';

/*
MESSAGE ARC: WHAT (pre-linked NFC+QR card, one tap to the Google review form)
-> WHY (reviews decide where people go; happy customers forget to review)
-> HOW (we link the card to the listing before shipping)
-> WHAT YOU GET (Rp 30.000 once, dashboard included)
-> WHERE (placements) -> MANAGE (dashboard) -> GO.
One order CTA label ("Pesan Kartu") everywhere. No invented stats, no em-dashes.
*/

const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo', display: 'swap' });

export const metadata: Metadata = {
  title: 'AyoReview | Kartu NFC & QR untuk Review Google',
  description: 'Kartu NFC + QR yang tertaut ke listing Google bisnis Anda sebelum dikirim. Pelanggan mengetuk, formulir review langsung terbuka. Rp 30.000 sekali bayar.',
};

const placements = [
  { label: 'Di kasir', className: 'use-cashier' },
  { label: 'Di meja', className: 'use-table' },
  { label: 'Di resepsionis', className: 'use-reception' },
];

const included = [
  'Kartu NFC + QR siap pajang',
  'Tertaut ke listing Google Anda sebelum dikirim',
  'Dasbor interaksi: ketukan, pindaian, tren 30 hari',
  'Ganti tujuan review kapan saja tanpa cetak ulang',
  'Siap dipakai untuk beberapa cabang sejak awal',
];

const dashboardFeatures = [
  { icon: LayoutDashboard, title: 'Kelola kartu', body: 'Aktifkan dan atur kartu tiap bisnis.' },
  { icon: QrCode, title: 'Perbarui tautan', body: 'Ganti tujuan review tanpa mengganti kartu.' },
  { icon: BarChart3, title: 'Lihat aktivitas', body: 'Pantau jumlah ketukan dan pindaian.' },
  { icon: Building2, title: 'Atur cabang', body: 'Bedakan kartu di tiap lokasi.' },
];

export default async function LandingPage() {
  const user = await getCurrentUser();
  const isAdmin = user?.is_platform_admin === true;
  return <main lang="id" className={`landing ${archivo.variable}`}>
    <ScrollReveal />
    <nav className="landing-nav" aria-label="Navigasi utama"><div className="nav-inner">
      <Link href="/" className="wordmark" aria-label="Beranda AyoReview"><Logo size={32} />AyoReview</Link>
      <div className="nav-links"><a href="#cara-kerja">Cara kerja</a><a href="#harga">Harga</a><a href="#penempatan">Penempatan</a></div>
      <div className="nav-actions">
        {isAdmin && <Link href="/admin" className="admin-link"><ShieldCheck aria-hidden="true" />Admin</Link>}
        <Link href={user ? '/my' : '/login'} className="button button-small button-inverse">{user ? 'Dasbor' : 'Masuk'}</Link>
      </div>
    </div></nav>

    {/* WHAT: the offer, stated plainly, with the physical product front and center */}
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title"><em>Satu ketukan</em>, review Google meningkat.</h1>
        <p className="hero-deck">Kami kirim kartu NFC + QR yang sudah tertaut ke listing Google usaha Anda. Pelanggan mengetuk, formulir review langsung terbuka.</p>
        <div className="hero-actions">
          <Link href="/pesan" className="button">Pesan Kartu <ArrowRight aria-hidden="true" /></Link>
        </div>
      </div>

      <div className="hero-stage" role="img" aria-label="Kartu AyoReview fisik berisi kode QR dan area NFC, dengan notifikasi review baru yang muncul di atasnya">
        <div className="hero-card-wrap" aria-hidden="true">
          <div className="review-card"><Image src="/images/nfc-card-design.png" alt="" fill priority sizes="(max-width: 900px) 92vw, 560px" /></div>
          <div className="tap-toast">
            <Star aria-hidden="true" />
            <span><strong>Review baru masuk</strong>barusan, dari meja kasir</span>
          </div>
          <div className="tap-hint"><Nfc aria-hidden="true" /><span>Cukup tempelkan ponsel</span></div>
        </div>
        <p className="hero-caption">Kartu fisik Anda, tertaut ke Google sebelum dikirim</p>
      </div>
    </section>

    {/* WHY: reviews decide where people go; happy customers forget to review */}
    <section className="why" aria-labelledby="why-title">
      <div className="section-heading reveal">
        <h2 id="why-title">Review menentukan pilihan pelanggan.</h2>
        <p>Sebelum datang, calon pelanggan mengecek Google dulu. Bisnis dengan review yang banyak dan bagus tampil lebih atas, dan lebih dipercaya.</p>
      </div>
      <div className="why-grid">
        <article className="why-card why-without reveal" aria-label="Kondisi tanpa AyoReview">
          <h3>Tanpa kartu</h3>
          <ul>
            <li><X aria-hidden="true" />Pelanggan puas lalu pulang, review terlupakan</li>
            <li><X aria-hidden="true" />Meminta review langsung terasa canggung</li>
            <li><X aria-hidden="true" />Yang rajin memberi review cuma yang kecewa</li>
          </ul>
        </article>
        <article className="why-card why-with reveal" aria-label="Kondisi dengan AyoReview">
          <h3>Dengan AyoReview</h3>
          <ul>
            <li><Check aria-hidden="true" />Kartu di kasir atau meja mengajak di momen yang tepat</li>
            <li><Check aria-hidden="true" />Satu ketukan, tanpa aplikasi dan tanpa login</li>
            <li><Check aria-hidden="true" />Review masuk sebelum pelanggan keluar pintu</li>
          </ul>
        </article>
      </div>
    </section>

    {/* HOW: order, we link it, customers tap */}
    <section className="how" id="cara-kerja" aria-labelledby="how-title">
      <div className="section-heading reveal">
        <h2 id="how-title">Dari pesanan ke review masuk, tiga langkah.</h2>
        <p>Anda tidak perlu mengatur apa pun di Google. Kami yang menyiapkannya.</p>
      </div>
      <ol className="steps">
        <li className="reveal"><span aria-hidden="true"><Smartphone /></span><h3>Pesan dan bayar</h3><p>Pilih bisnis Anda, isi alamat kirim, bayar lewat QRIS, GoPay, atau bank.</p></li>
        <li className="reveal"><span aria-hidden="true"><MapPin /></span><h3>Kami tautkan dan kirim</h3><p>Kartu tertaut ke listing Google bisnis Anda sebelum dikemas. Tinggal taruh di tempat.</p></li>
        <li className="reveal"><span aria-hidden="true"><Star /></span><h3>Pelanggan ketuk</h3><p>Ponsel menyentuh kartu atau memindai QR, formulir review Google langsung terbuka.</p></li>
      </ol>
    </section>

    {/* WHAT YOU GET: the concrete offer */}
    <section className="get" id="harga" aria-labelledby="get-title">
      <div className="get-price reveal">
        <p className="get-label">Sekali bayar</p>
        <p className="get-amount">Rp 30.000</p>
        <p className="get-note">Tanpa langganan, tanpa biaya bulanan. Kartu dan dasbor jadi milik Anda.</p>
        <Link href="/pesan" className="button button-inverse">Pesan Kartu <ArrowRight aria-hidden="true" /></Link>
        <p className="get-pay">Dikirim ke alamat Anda. Pembayaran via QRIS, GoPay, ShopeePay, dan transfer bank.</p>
      </div>
      <div className="get-list reveal" aria-labelledby="get-title">
        <h2 id="get-title">Apa yang Anda dapatkan.</h2>
        <ul>
          {included.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}
        </ul>
      </div>
    </section>

    {/* WHERE: placements */}
    <section className="placements" id="penempatan" aria-labelledby="placements-title">
      <div className="section-heading reveal">
        <h2 id="placements-title">Taruh di momen yang pas.</h2>
        <p>Dekat pembayaran, setelah layanan selesai, atau saat pelanggan bersiap pulang.</p>
      </div>
      <div className="placement-grid">
        {placements.map((place) => <article className={`placement ${place.className} reveal`} key={place.label}>
          <Image src="/images/placement-scenes.png" alt={`${place.label} sebagai tempat AyoReview digunakan`} fill sizes="(max-width: 760px) 92vw, 33vw" />
          <h3>{place.label}</h3>
        </article>)}
      </div>
      <p className="placement-more">Cocok juga untuk klinik, salon, pangkas rambut, toko, hotel, dan meja resepsionis.</p>
    </section>

    {/* MANAGE: the dashboard, with the live mock as proof */}
    <section className="software" aria-labelledby="software-title">
      <div className="software-copy reveal">
        <h2 id="software-title">Setiap ketukan tercatat.</h2>
        <p>Dasbor Anda memperlihatkan aktivitas tiap kartu dan cabang, dari ketukan NFC sampai pindai QR.</p>
        <div className="dash-mock" role="img" aria-label="Contoh tampilan dasbor AyoReview dengan jumlah review yang bertambah dan rasio NFC terhadap QR">
          <div className="dash-head" aria-hidden="true"><strong>Review bulan ini</strong><span className="dash-live">Langsung</span></div>
          <div aria-hidden="true"><LandingCounter /></div>
          <div className="dash-split" aria-hidden="true">
            <div><Nfc /><i style={{ '--w': '68%' } as React.CSSProperties} /></div>
            <div><QrCode /><i style={{ '--w': '32%' } as React.CSSProperties} /></div>
          </div>
        </div>
        <p className="demo-caption">Contoh tampilan dasbor Anda</p>
      </div>
      <div className="software-list reveal">
        {dashboardFeatures.map(({ icon: Icon, title, body }) => (
          <div key={title}><Icon aria-hidden="true" /><span><strong>{title}</strong>{body}</span></div>
        ))}
      </div>
    </section>

    {/* GO */}
    <section className="closing" aria-labelledby="closing-title">
      <div>
        <h2 id="closing-title">Mulai kumpulkan review minggu ini.</h2>
        <p>Pesan hari ini, kartu sampai di alamat Anda sudah tertaut ke bisnis Anda.</p>
      </div>
      <Link href="/pesan" className="button button-inverse">Pesan Kartu <ArrowRight aria-hidden="true" /></Link>
    </section>

    <footer>
      <Link href="/" className="wordmark"><Logo size={32} />AyoReview</Link>
      <p>Kartu NFC + QR untuk review Google.</p>
      <div><Link href="/login">Masuk</Link><Link href="/pesan">Pesan Kartu</Link><Link href="/privacy">Privasi</Link></div>
      <small>© 2026 AyoReview. Hak cipta dilindungi.</small>
    </footer>
  </main>;
}
