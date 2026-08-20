import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Archivo, IBM_Plex_Mono } from 'next/font/google';
import { ArrowRight, BarChart3, MapPin, QrCode, RefreshCw, ScanLine } from 'lucide-react';
import { RoutingDemo } from './routing-demo';
import './landing.css';

const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo', display: 'swap' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'ReviewTap — Kartu Ulasan NFC & QR Dinamis',
  description: 'Ubah tautan ulasan Google di balik perangkat QR dan NFC ReviewTap tanpa mencetak ulang.',
  keywords: ['ulasan Google', 'kode QR dinamis', 'perangkat ulasan NFC', 'ulasan bisnis lokal'],
};

const destinations = [
  { id: 'jakarta', label: 'Jakarta — Ulasan Google', url: 'https://g.page/r/contoh-jakarta/review' },
  { id: 'bandung', label: 'Bandung — Ulasan Google', url: 'https://g.page/r/contoh-bandung/review' },
  { id: 'surabaya', label: 'Surabaya — Ulasan Google', url: 'https://g.page/r/contoh-surabaya/review' },
];

export default function LandingPage() {
  return <main lang="id" className={`landing ${archivo.variable} ${plexMono.variable}`}>
    {/* THESIS: The managed redirect decouples the physical card from its destination and refuses generic SaaS card grids.
        OWN-WORLD: Cool paper or night-dispatch navy, orange signals, thermal labels, routing rules, and 4px corners.
        STORY: A merchant understands the fixed public ID, tests a destination change, then creates a free QR.
        FIRST VIEWPORT: Direct promise and actions lead beside a merchant scene with its stable-route overlay.
        FORM: Routing Exchange, code-led, selected in the prior planning round; seed key selected-routing-exchange-plan.
        FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance. */}
    <span hidden data-direction-contract="selected-routing-exchange-plan">Routing Exchange direction contract</span>
    <nav className="landing-nav" aria-label="Navigasi utama"><div className="nav-inner">
      <Link href="/" className="wordmark" aria-label="Beranda ReviewTap"><span aria-hidden="true">RT</span>ReviewTap</Link>
      <div className="nav-links"><a href="#how-it-works">Cara kerja</a><a href="#placements">Penempatan</a><a href="#dynamic">Tautan dinamis</a><a href="#proof">Bukti</a></div>
      <div className="nav-actions"><Link href="/login" className="login-link">Masuk</Link><Link href="/signup" className="button button-small">Buat QR gratis</Link></div>
    </div></nav>

    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy"><h1 id="hero-title">Ubah tautannya,<br />bukan kartunya.</h1><p className="hero-deck">Satu perangkat QR dan NFC. Perbarui tujuan ulasan Google kapan pun bisnis Anda berubah.</p><div className="hero-actions"><Link href="/signup" className="button">Buat QR gratis <ArrowRight aria-hidden="true" /></Link><a href="#route-demo" className="text-action">Lihat cara kerjanya <ScanLine aria-hidden="true" /></a></div><p className="hero-note">Buat akun untuk menghasilkan QR terkelola Anda.</p></div>
      <div className="hero-scene"><Image src="/images/countertop.webp" alt="Perangkat QR dan NFC ReviewTap di samping kasir kafe" fill priority sizes="(max-width: 900px) 100vw, 58vw" /><div className="route-ticket" aria-label="Contoh rute ReviewTap"><span className="sample-flag">CONTOH RUTE</span><div><small>ID PUBLIK TETAP</small><strong>reviewtap.id/q/RT-J7K2</strong></div><i aria-hidden="true" /><div><small>TUJUAN DAPAT DIUBAH</small><strong>Ulasan Google · Jakarta</strong></div></div></div>
    </section>

    <section className="route-demo-wrap" id="route-demo" aria-labelledby="demo-title"><div className="section-intro"><h2 id="demo-title">Satu rute publik.<br />Tujuan bebas diperbarui.</h2><p>Kode yang tercetak mempertahankan identitasnya. Anda mengubah tujuan pelanggan dari dasbor.</p></div><RoutingDemo publicId="RT-J7K2" destinations={destinations} /></section>

    <section className="route-stops" id="how-it-works" aria-labelledby="works-title"><div className="section-intro"><h2 id="works-title">Dari pengaturan<br />hingga insight.</h2><p>Satu rute menghubungkan pekerjaan sebelum, selama, dan setelah perangkat ditempatkan.</p></div><ol>
      <li><span><QrCode /></span><div><h3>Buat rutenya</h3><p>Tambahkan bisnis dan URL ulasan Google. ReviewTap membuat tujuan QR dan NFC terkelola.</p></div></li>
      <li className="long-stop"><span><MapPin /></span><div><h3>Tempatkan di akhir layanan</h3><p>Gunakan ID publik yang sama di kasir, meja makan, atau area pintu masuk.</p></div></li>
      <li><span><BarChart3 /></span><div><h3>Ukur interaksi</h3><p>Lihat tren interaksi serta perbandingan pemindaian QR dan ketukan NFC di dasbor.</p></div></li>
    </ol></section>

    <section className="placements" id="placements" aria-labelledby="placements-title"><div className="placements-head"><h2 id="placements-title">Hadir di momen yang tepat.</h2><p>Pilih titik yang sesuai dengan alur layanan Anda. Uji performa penempatan melalui dasbor.</p></div>
      <article className="placement placement-cashier"><Image src="/images/cashier.webp" alt="Perangkat ReviewTap di samping terminal kasir kafe" fill sizes="(max-width: 760px) 100vw, 50vw" /><div><span>Kasir</span><h3>Manfaatkan jeda yang alami.</h3><p>Tempatkan perangkat di dekat area pembayaran atau penyerahan struk.</p></div></article>
      <article className="placement placement-table"><Image src="/images/table.webp" alt="Perangkat ReviewTap di atas meja restoran" fill sizes="(max-width: 760px) 100vw, 25vw" /><div><span>Meja</span><h3>Selalu mudah dijangkau.</h3></div></article>
      <article className="placement placement-entrance"><Image src="/images/entrance.webp" alt="Perangkat ReviewTap di dekat pintu masuk butik" fill sizes="(max-width: 760px) 100vw, 25vw" /><div><span>Pintu masuk</span><h3>Sambut momen kepulangan.</h3></div></article>
    </section>

    <section className="dynamic" id="dynamic" aria-labelledby="dynamic-title"><div className="section-intro"><h2 id="dynamic-title">Perangkat tetap.<br />Rute bergerak.</h2><p>ReviewTap berada di antara perangkat fisik dan tujuan Anda, jadi mengganti tautan tidak berarti mengganti hardware.</p></div><div className="route-diagram" aria-label="Alur pengalihan terkelola ReviewTap"><div><QrCode /><span>QR atau NFC</span></div><b aria-hidden="true">→</b><div className="route-core"><ScanLine /><span>ID publik terkelola</span><small>reviewtap.id/q/RT-J7K2</small></div><b aria-hidden="true">→</b><div><RefreshCw /><span>URL ulasan Google</span></div></div><div className="capabilities"><article><h3>Ubah tujuan</h3><p>Perbarui URL yang terhubung ke perangkat melalui dasbor merchant.</p></article><article><h3>Lihat tren interaksi</h3><p>Tinjau tren 30 hari, perbandingan QR dan NFC, serta performa penempatan.</p></article><article><h3>Pertahankan rute yang ringkas</h3><p>Pelanggan mengetuk atau memindai rute publik yang meneruskan mereka ke tujuan terpilih.</p></article></div></section>

    <section className="proof" id="proof" aria-labelledby="proof-title"><div className="proof-head"><h2 id="proof-title">Bukti akan hadir di sini.</h2><p>Slot ini sengaja dikosongkan sampai bukti pilot yang terverifikasi disetujui.</p></div><div className="proof-grid"><div data-placeholder="kutipan-merchant"><strong>Kutipan merchant</strong><span>Ganti dengan kutipan, nama, peran, dan bisnis yang telah disetujui.</span></div><div data-placeholder="logo-pelanggan"><strong>Logo pelanggan</strong><span>Ganti dengan file logo dan izin penggunaan yang telah disetujui.</span></div><div data-placeholder="metrik-pilot"><strong>Metrik pilot</strong><span>Ganti dengan periode, jumlah sampel, dan definisi metrik yang bersumber jelas.</span></div></div></section>
    <section className="closing"><div><h2>Perubahan tautan berikutnya cukup beberapa detik.</h2><p>Buat rutenya sekarang. Tambahkan perangkat fisik saat Anda siap.</p></div><Link href="/signup" className="button button-inverse">Buat QR gratis <ArrowRight /></Link></section>
    <footer><Link href="/" className="wordmark"><span aria-hidden="true">RT</span>ReviewTap</Link><p>Infrastruktur ulasan NFC &amp; QR yang cerdas.</p><div><Link href="/login">Masuk sebagai merchant</Link><Link href="/signup">Buat QR gratis</Link></div><small>© 2026 ReviewTap. Hak cipta dilindungi.</small></footer>
    <p className="image-provenance">Visual dibuat dengan OpenAI untuk ReviewTap, Agustus 2026.</p>
  </main>;
}
