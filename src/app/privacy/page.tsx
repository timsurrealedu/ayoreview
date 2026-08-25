import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description:
    'Bagaimana AyoReview mengumpulkan, menggunakan, dan melindungi data pemilik bisnis serta pengunjung yang mengetuk kartu NFC atau memindai QR.',
};

const effectiveDate = '25 Agustus 2026';

type PolicySection = {
  title: string;
  body: string[];
  items?: string[];
  after?: string[];
};

const sections: PolicySection[] = [
  {
    title: 'Ringkasan singkat',
    body: [
      'AyoReview menyediakan kartu fisik NFC dan QR yang mengarahkan pelanggan Anda langsung ke formulir review Google bisnis Anda. Kami merancang layanan ini agar data pribadi seminimal mungkin: pelanggan yang mengetuk atau memindai kartu umumnya tidak perlu memberikan data apa pun kepada kami.',
      'Kebijakan ini menjelaskan data apa yang kami kumpulkan dari pemilik bisnis maupun pengunjung yang berinteraksi dengan kartu, bagaimana data tersebut digunakan, dan hak yang Anda miliki.',
    ],
  },
  {
    title: 'Data yang kami kumpulkan',
    body: [
      'Data akun pemilik bisnis: nama, alamat email, dan nomor telepon saat Anda mendaftar, serta kata sandi yang disimpan dalam bentuk terenkripsi.',
      'Data bisnis: nama bisnis, tautan review Google Maps yang Anda tempelkan, serta daftar cabang atau lokasi yang Anda kelola di dasbor.',
      'Data pesanan dan pengiriman: alamat pengiriman kartu, kode pesanan, riwayat pembelian, dan status pembayaran.',
      'Data interaksi kartu: jumlah ketukan NFC dan pemindaian QR per kartu per tanggal, termasuk jenis perangkat secara agregat. Data ini bersifat statistik dan tidak mengidentifikasi individu.',
      'Data teknis: alamat IP, jenis peramban, dan log server yang digunakan untuk keamanan, pencegahan penyalahgunaan, serta pemantauan galat.',
    ],
  },
  {
    title: 'Pelanggan yang mengetuk atau memindai kartu',
    body: [
      'Jika Anda seorang pelanggan yang mengetuk kartu NFC atau memindai kode QR di sebuah usaha, Anda akan langsung dialihkan ke halaman review Google milik usaha tersebut. Kami tidak meminta nama, kontak, atau data pribadi apa pun dari Anda.',
      'Kami hanya mencatat interaksi tersebut sebagai hitungan agregat untuk dasbor pemilik usaha. Setelah Anda tiba di Google, berlaku Kebijakan Privasi Google. Kami menyarankan Anda membaca kebijakan tersebut sebelum memberikan review.',
    ],
  },
  {
    title: 'Cara kami menggunakan data',
    body: [
      'Memproses pesanan kartu, menghubungkan kartu ke profil Google bisnis Anda, dan mengirimkannya.',
      'Menyediakan dasbor interaksi: jumlah ketukan, pemindaian, dan tren harian.',
      'Mendukung Anda saat ada pertanyaan, kendala teknis, atau permintaan penggantian kartu.',
      'Menjaga keamanan layanan, mencegah penyalahgunaan, dan memenuhi kewajiban hukum yang berlaku.',
      'Kami tidak menjual data pribadi Anda, dan kami tidak menggunakan data Anda untuk iklan.',
    ],
  },
  {
    title: 'Berbagi data dengan penyedia layanan',
    body: [
      'Kami hanya membagikan data seperlunya dengan penyedia berikut:',
    ],
    items: [
      'Midtrans — pemroses pembayaran (QRIS, GoPay, ShopeePay, transfer bank). Data kartu pembayaran Anda ditangani langsung oleh Midtrans dan tidak tersimpan di server kami.',
      'Supabase — hosting basis data dan autentikasi akun.',
      'Vercel — hosting aplikasi dan jaringan pengiriman konten.',
      'Google Places API — pencarian listing bisnis Google saat Anda menautkan lokasi.',
      'Sentry — pencatatan galat teknis untuk membantu kami memperbaiki layanan.',
    ],
    after: [
      'Setiap penyedia terikat perjanjian kerahasiaan dan hanya boleh memproses data untuk memberikan layanannya kepada kami.',
    ],
  },
  {
    title: 'Cookie dan sesi masuk',
    body: [
      'Kami menggunakan cookie yang diperlukan agar Anda tetap masuk ke dasbor dan agar situs berfungsi dengan baik. Kami tidak menggunakan cookie pelacakan iklan atau analisis pihak ketiga yang mengidentifikasi individu.',
    ],
  },
  {
    title: 'Penyimpanan dan retensi',
    body: [
      'Data disimpan di server yang dikelola penyedia layanan kami selama akun Anda aktif atau selama diperlukan untuk memenuhi tujuan yang dijelaskan dalam kebijakan ini, termasuk kewajiban pembukuan transaksi sesuai ketentuan hukum Indonesia.',
      'Data interaksi kartu yang bersifat agregat dapat disimpan lebih lama karena tidak mengidentifikasi siapa pun.',
    ],
  },
  {
    title: 'Keamanan',
    body: [
      'Kami melindungi data Anda dengan enkripsi saat transit (HTTPS), kata sandi yang di-hash, pembatasan laju pada endpoint sensitif, serta kontrol akses berbasis peran. Akses ke data pelanggan hanya diberikan kepada personel yang membutuhkannya.',
      'Tidak ada sistem yang sepenuhnya bebas risiko. Jika terjadi insiden data yang memengaruhi Anda, kami akan memberitahukan Anda sesuai ketentuan yang berlaku.',
    ],
  },
  {
    title: 'Hak Anda',
    body: [
      'Sesuai Undang-Undang Perlindungan Data Pribadi (UU No. 27 Tahun 2022), Anda berhak mengakses, memperbaiki, membatasi, atau menghapus data pribadi Anda, serta menarik persetujuan pemrosesan data.',
      'Untuk menggunakan hak tersebut, hubungi kami melalui email di bawah. Kami akan menanggapi permintaan Anda dalam waktu yang wajar. Menghapus akun akan menghapus data bisnis Anda; data transaksi yang wajib disimpan sesuai hukum akan disimpan sesuai ketentuan yang berlaku.',
    ],
  },
  {
    title: 'Privasi anak',
    body: [
      'Layanan AyoReview ditujukan bagi pemilik dan pengelola usaha. Kami tidak sengaja mengumpulkan data pribadi anak di bawah umur. Orang tua atau wali yang meyakini data anaknya terkumpul dapat menghubungi kami untuk penghapusan.',
    ],
  },
  {
    title: 'Perubahan kebijakan ini',
    body: [
      'Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Tanggal berlaku di bagian atas halaman akan selalu mencerminkan versi terbaru, dan perubahan penting akan kami komunikasikan melalui situs atau email.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-[100dvh] bg-canvas text-ink flex flex-col font-sans">
      <header className="border-b border-line bg-surface">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-sm">
            <Logo size={28} className="rounded-md" />
            AyoReview
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-ink hover:text-ink transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Beranda
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-14">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-success bg-subtle border border-line rounded-full px-3 py-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          Kebijakan Privasi
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-5">
          Data Anda aman, sekecil apa pun datanya.
        </h1>
        <p className="text-muted-ink mt-4 leading-relaxed">
          Terakhir diperbarui: <strong className="text-ink">{effectiveDate}</strong>. Kebijakan ini
          berlaku untuk situs ayoreview.id, dasbor AyoReview, dan semua kartu NFC serta QR yang
          kami keluarkan.
        </p>

        <article className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.title} aria-labelledby={section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
              <h2 id={section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="text-xl font-bold tracking-tight">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted-ink">
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
                {section.items && (
                  <ul className="list-disc pl-5 space-y-2 marker:text-ink/40">
                    {section.items.map((item) => (
                      <li key={item.slice(0, 40)}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.after?.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <section aria-labelledby="hubungi-kami" className="bg-surface border border-line rounded-lg p-6">
            <h2 id="hubungi-kami" className="text-xl font-bold tracking-tight">
              Hubungi kami
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-ink">
              Ada pertanyaan tentang kebijakan ini atau data Anda? Kirim email ke{' '}
              <a href="mailto:tim@ayoreview.id" className="font-semibold text-action underline underline-offset-4">
                tim@ayoreview.id
              </a>{' '}
              dan kami akan membantu Anda.
            </p>
          </section>
        </article>
      </main>

      <footer className="border-t border-line py-8">
        <p className="max-w-3xl mx-auto px-6 text-xs text-muted-ink">
          © 2026 AyoReview. Kartu NFC + QR untuk review Google.
        </p>
      </footer>
    </div>
  );
}
