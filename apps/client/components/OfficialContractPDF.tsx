import React from 'react';
import { PROVIDER_PROFILE } from '@/config/provider';

export interface OfficialContractData {
  id: string;
  project_title: string;
  client_company: string;
  client_contact_name: string;
  client_email?: string;
  client_phone?: string;
  client_address?: string;
  client_notes?: string;
  scope_of_work: string;
  deliverables: string[];
  total_fee: number;
  payment_terms: string;
  terms_and_conditions: string;
  status: string;
  expires_at: string;
  signed_at?: string;
  signer_name?: string;
  signer_title?: string;
  signature_data?: string;
  document_checksum?: string;
  access_code?: string;
  provider_signature_data?: string;
  provider_signer_name?: string;
  provider_signer_title?: string;
  provider_signed_at?: string;
  provider_address?: string;
  provider_phone?: string;
  provider_email?: string;
  provider_website?: string;
  provider_brand?: string;
  provider_city?: string;
}

interface Props {
  agreement: OfficialContractData;
}

export default function OfficialContractPDF({ agreement }: Props) {
  // Format currency
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Parse Title & Project
  const parseProjectTitle = (rawTitle: string) => {
    if (rawTitle.includes(' — ')) {
      const [judul, ...proyekParts] = rawTitle.split(' — ');
      return {
        judulPerjanjian: judul.trim(),
        namaProyek: proyekParts.join(' — ').trim(),
      };
    }
    return {
      judulPerjanjian: 'Perjanjian Kerja Sama Pengembangan Website & Sistem Digital',
      namaProyek: rawTitle.trim(),
    };
  };

  // Parse Client Notes
  const parseClientNotes = (notes?: string) => {
    let statusKepemilikan = 'Pemilik bisnis';
    let domainName = '-';
    if (notes) {
      const statusMatch = notes.match(/Status Kepemilikan:\s*([^.]+)/i);
      if (statusMatch && statusMatch[1]) {
        statusKepemilikan = statusMatch[1].trim();
      }
      const domainMatch = notes.match(/Opsi Domain:\s*([^.]+)/i);
      if (domainMatch && domainMatch[1]) {
        domainName = domainMatch[1].trim();
      }
    }
    return { statusKepemilikan, domainName };
  };

  const { judulPerjanjian, namaProyek } = parseProjectTitle(agreement.project_title);
  const { statusKepemilikan, domainName } = parseClientNotes(agreement.client_notes);

  const signedDateObj = agreement.signed_at ? new Date(agreement.signed_at) : new Date();
  const hariIndonesia = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][signedDateObj.getDay()];
  const tanggalLengkap = signedDateObj.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const docNumber = `PKS-${signedDateObj.getFullYear()}/SBA/${agreement.id.slice(0, 8).toUpperCase()}`;

  const providerName = agreement.provider_signer_name || PROVIDER_PROFILE.name;
  const providerBrand = agreement.provider_brand || PROVIDER_PROFILE.brandName;
  const providerTitle = agreement.provider_signer_title || PROVIDER_PROFILE.roleTitle;
  const providerAddress = agreement.provider_address || PROVIDER_PROFILE.address;
  const providerPhone = agreement.provider_phone || PROVIDER_PROFILE.phone;
  const providerEmail = agreement.provider_email || PROVIDER_PROFILE.email;
  const providerWebsite = agreement.provider_website || PROVIDER_PROFILE.website;
  const providerCity = agreement.provider_city || PROVIDER_PROFILE.legalJurisdictionCity;

  return (
    <div className="official-contract-root bg-white text-black font-serif text-[10pt] leading-normal p-6 sm:p-10 max-w-[210mm] mx-auto print:p-0 print:m-0 print:max-w-none">
      {/* 1. KOP SURAT RESMI */}
      <div className="border-b-2 border-black pb-2 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt={providerBrand}
              className="w-12 h-12 object-contain shrink-0 rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold tracking-tight font-sans text-black">
                {providerBrand.toUpperCase()}
              </h1>
              <p className="text-[9pt] font-sans text-gray-800">
                Layanan Pengembangan Website, E-Commerce, & Rekayasa Sistem Digital
              </p>
              <p className="text-[8pt] font-sans text-gray-600">
                {providerAddress} • WhatsApp: {providerPhone} • Website: {providerWebsite}
              </p>
            </div>
          </div>
          <div className="text-right text-[8pt] font-sans text-gray-600 shrink-0">
            <span className="font-bold block">PERJANJIAN KERJA SAMA</span>
            <span>UU ITE & KUHPERDATA</span>
          </div>
        </div>
      </div>

      {/* 2. JUDUL & NOMOR SURAT */}
      <div className="text-center my-4 space-y-0.5">
        <h2 className="text-sm font-bold uppercase tracking-wider">
          SURAT PERJANJIAN KERJA SAMA (PKS)
        </h2>
        <h3 className="text-xs font-semibold uppercase tracking-wide">
          PENGEMBANGAN WEBSITE DAN SISTEM DIGITAL
        </h3>
        <p className="text-[8.5pt] font-mono text-gray-700">
          Nomor: {docNumber}
        </p>
      </div>

      {/* 3. PEMBUKA & IDENTITAS LENGKAP PARA PIHAK */}
      <div className="space-y-3 mb-4 text-justify text-[9.5pt]">
        <p>
          Pada hari ini, <strong>{hariIndonesia}</strong>, tanggal <strong>{tanggalLengkap}</strong>, dibuat dan disepakati secara elektronik oleh Para Pihak yang bertanda tangan di bawah ini:
        </p>

        {/* IDENTITAS PIHAK PERTAMA */}
        <div className="pl-3 border-l-2 border-black space-y-1">
          <p className="font-bold text-[9.5pt]">
            1. PIHAK PERTAMA (Penyedia Jasa):
          </p>
          <div className="text-[9pt] grid grid-cols-3 gap-y-0.5 max-w-lg">
            <span className="text-gray-700">Nama Lengkap</span>
            <span className="col-span-2">: <strong>{providerName}</strong></span>
            <span className="text-gray-700">Brand / Usaha</span>
            <span className="col-span-2">: <strong>{providerBrand}</strong></span>
            <span className="text-gray-700">Alamat Domisili</span>
            <span className="col-span-2">: {providerAddress}</span>
            <span className="text-gray-700">Nomor WhatsApp</span>
            <span className="col-span-2">: {providerPhone}</span>
            <span className="text-gray-700">Email Aktif</span>
            <span className="col-span-2">: {providerEmail}</span>
          </div>
          <p className="text-[8.5pt] text-gray-700 italic pt-0.5">
            Bertindak selaku perorangan penyedia jasa pengembangan website dan sistem digital, selanjutnya disebut sebagai <strong>&ldquo;PIHAK PERTAMA&rdquo;</strong>.
          </p>
        </div>

        {/* IDENTITAS PIHAK KEDUA */}
        <div className="pl-3 border-l-2 border-black space-y-1">
          <p className="font-bold text-[9.5pt]">
            2. PIHAK KEDUA (Klien / Pemesan):
          </p>
          <div className="text-[9pt] grid grid-cols-3 gap-y-0.5 max-w-lg">
            <span className="text-gray-700">Nama Pemilik / Klien</span>
            <span className="col-span-2">: <strong>{agreement.signer_name || agreement.client_contact_name || '-'}</strong></span>
            <span className="text-gray-700">Nama Bisnis / Brand</span>
            <span className="col-span-2">: <strong>{agreement.client_company || '-'}</strong></span>
            <span className="text-gray-700">Status Kepemilikan</span>
            <span className="col-span-2">: {statusKepemilikan}</span>
            <span className="text-gray-700">Alamat Domisili</span>
            <span className="col-span-2">: {agreement.client_address || '-'}</span>
            <span className="text-gray-700">Nomor WhatsApp</span>
            <span className="col-span-2">: {agreement.client_phone || '-'}</span>
            <span className="text-gray-700">Email Aktif</span>
            <span className="col-span-2">: {agreement.client_email || '-'}</span>
            <span className="text-gray-700">Nama Domain</span>
            <span className="col-span-2 font-mono">: {domainName}</span>
          </div>
          <p className="text-[8.5pt] text-gray-700 italic pt-0.5">
            Bertindak selaku pemilik usaha dan pemesan sah atas layanan pembuatan website, selanjutnya disebut sebagai <strong>&ldquo;PIHAK KEDUA&rdquo;</strong>.
          </p>
        </div>

        <p className="pt-1">
          Para Pihak dengan ini menyatakan sepakat untuk mengikatkan diri dalam Perjanjian Kerja Sama dengan ketentuan dan syarat-syarat sebagai berikut:
        </p>
      </div>

      {/* 4. TABEL VARIABEL PROYEK */}
      <div className="my-3">
        <table className="w-full text-[9pt] border border-collapse border-black">
          <tbody>
            <tr>
              <td className="py-1 px-2 border border-black font-semibold w-1/3">Judul Perjanjian</td>
              <td className="py-1 px-2 border border-black">{judulPerjanjian}</td>
            </tr>
            <tr>
              <td className="py-1 px-2 border border-black font-semibold">Nama Proyek</td>
              <td className="py-1 px-2 border border-black font-medium">{namaProyek}</td>
            </tr>
            <tr>
              <td className="py-1 px-2 border border-black font-semibold">Nilai Kontrak (Total Fee)</td>
              <td className="py-1 px-2 border border-black font-bold">
                {formatRupiah(agreement.total_fee)}
              </td>
            </tr>
            <tr>
              <td className="py-1 px-2 border border-black font-semibold">Nama Penanggung Jawab</td>
              <td className="py-1 px-2 border border-black">{agreement.client_contact_name || agreement.signer_name}</td>
            </tr>
            <tr>
              <td className="py-1 px-2 border border-black font-semibold">Nama Bisnis / Brand</td>
              <td className="py-1 px-2 border border-black">{agreement.client_company || '-'}</td>
            </tr>
            <tr>
              <td className="py-1 px-2 border border-black font-semibold">Status Kepemilikan Bisnis</td>
              <td className="py-1 px-2 border border-black">{statusKepemilikan}</td>
            </tr>
            <tr>
              <td className="py-1 px-2 border border-black font-semibold">Nama Domain</td>
              <td className="py-1 px-2 border border-black font-mono">{domainName}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 5. PASAL-PASAL */}
      <div className="space-y-3.5 text-justify text-[9.5pt]">
        {/* PASAL 1 */}
        <div className="space-y-0.5">
          <div className="text-center font-bold">
            <div>Pasal 1</div>
            <div className="font-semibold italic text-[9pt]">Ruang Lingkup Pekerjaan</div>
          </div>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>PIHAK PERTAMA menyediakan jasa pembuatan website dan sistem digital sesuai paket layanan atau quotation yang telah disetujui PIHAK KEDUA.</li>
            <li>Ruang lingkup pekerjaan mencakup perancangan antarmuka, rekayasa kode program, implementasi, konfigurasi server/database, pengujian sistem, dan deployment online.</li>
            <li>Pekerjaan di luar ruang lingkup awal dianggap sebagai pekerjaan tambahan (*additional work*) dan dikenakan biaya terpisah.</li>
            <li><strong>Batasan Tanggung Jawab:</strong> Tanggung jawab PIHAK PERTAMA murni terbatas pada penyediaan rekayasa perangkat lunak. PIHAK PERTAMA tidak mengelola, mengawasi, menjalankan, atau bertanggung jawab atas operasional bisnis PIHAK KEDUA, termasuk produk, penjualan, transaksi keuangan, dan isi materi yang dipublikasikan.</li>
          </ol>
        </div>

        {/* PASAL 2 */}
        <div className="space-y-0.5">
          <div className="text-center font-bold">
            <div>Pasal 2</div>
            <div className="font-semibold italic text-[9pt]">Hasil Pekerjaan (Deliverables)</div>
          </div>
          <p>Setelah proyek selesai dan pembayaran dilunasi penuh, hasil pekerjaan yang diserahkan meliputi:</p>
          <ul className="list-disc pl-5 space-y-0.5">
            {agreement.deliverables && agreement.deliverables.length > 0 ? (
              agreement.deliverables.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))
            ) : (
              <>
                <li>Website dan sistem digital yang telah siap digunakan dan diuji secara fungsional.</li>
                <li>Konfigurasi domain dan server sesuai paket layanan.</li>
                <li>Akses dashboard administrator dan dokumentasi penggunaan dasar.</li>
              </>
            )}
          </ul>
          <p className="text-[8.5pt] italic">
            Penyerahan akses penuh dilakukan setelah pelunasan 100%. Sejak serah terima dilakukan, kendali dan penggunaan website sepenuhnya berada pada PIHAK KEDUA.
          </p>
        </div>

        {/* PASAL 3 */}
        <div className="space-y-0.5">
          <div className="text-center font-bold">
            <div>Pasal 3</div>
            <div className="font-semibold italic text-[9pt]">Biaya dan Ketentuan Pembayaran</div>
          </div>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>Total biaya proyek yang disepakati adalah sebesar <strong>{formatRupiah(agreement.total_fee)}</strong>.</li>
            <li>PIHAK KEDUA wajib membayar uang muka (DP) sebesar 50% sebelum pengerjaan proyek dimulai.</li>
            <li>Sisa pembayaran sebesar 50% wajib dilunasi setelah pengerjaan selesai dan sebelum serah terima final atau rilis publik.</li>
            <li>Biaya perpanjangan layanan pihak ketiga (domain tahunan, hosting, API berbayar, payment gateway) ditanggung oleh PIHAK KEDUA.</li>
            <li>Keterlambatan pelunasan dapat menyebabkan penundaan serah terima hingga kewajiban diselesaikan.</li>
          </ol>
        </div>

        {/* PASAL 4 - KEBIJAKAN REFUND & PEMBATALAN */}
        <div className="space-y-0.5">
          <div className="text-center font-bold">
            <div>Pasal 4</div>
            <div className="font-semibold italic text-[9pt]">Pembatalan dan Kebijakan Pengembalian Dana (Refund Policy)</div>
          </div>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li><strong>Uang Muka Non-Refundable:</strong> Uang Muka (DP) yang telah dibayarkan bersifat <em>non-refundable</em> (tidak dapat dikembalikan) apabila pembatalan proyek dilakukan atas inisiatif, perubahan rencana, atau kelalaian sepihak dari PIHAK KEDUA setelah penandatanganan Perjanjian, pengerjaan teknis, atau pengadaan aset (domain/server/lisensi) telah dimulai oleh PIHAK PERTAMA.</li>
            <li><strong>Kompensasi Progres Berjalan:</strong> Apabila pembatalan sepihak dilakukan oleh PIHAK KEDUA ketika progres pekerjaan telah melampaui 50% dari total estimasi pengerjaan, maka PIHAK KEDUA tetap berkewajiban menyelesaikan pembayaran secara proporsional sesuai volume dan bobot pekerjaan yang telah diselesaikan oleh PIHAK PERTAMA.</li>
            <li><strong>Pengembalian Dana Sah:</strong> Pengembalian dana (refund) secara proporsional hanya wajib dilakukan apabila PIHAK PERTAMA terbukti secara sah dan sepihak menghentikan pengerjaan proyek tanpa alasan yang dibenarkan menurut hukum dan bukan akibat kelalaian atau wanprestasi dari PIHAK KEDUA.</li>
            <li><strong>Biaya Pihak Ketiga Hangus:</strong> Segala biaya pihak ketiga yang telah dibayarkan (registrasi nama domain tahunan, server hosting, API berbayar, dan lisensi) bersifat mutlak tidak dapat di-refund karena tunduk pada kebijakan vendor pihak ketiga terkait.</li>
            <li><strong>Pencairan Refund:</strong> Pengembalian dana yang telah disepakati secara tertulis akan diproses selambat-lambatnya 14 (empat belas) hari kerja melalui transfer ke rekening bank resmi PIHAK KEDUA.</li>
          </ol>
        </div>

        {/* PASAL 5 */}
        <div className="space-y-0.5">
          <div className="text-center font-bold">
            <div>Pasal 5</div>
            <div className="font-semibold italic text-[9pt]">Revisi dan Materi Konten</div>
          </div>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>PIHAK KEDUA berhak atas maksimal 2 (dua) kali revisi minor visual dasar (penyesuaian teks, warna, gambar sederhana).</li>
            <li>PIHAK KEDUA menjamin bahwa seluruh materi, logo, gambar, dan teks yang diserahkan tidak melanggar hak cipta pihak ketiga.</li>
          </ol>
        </div>

        {/* PASAL 6 */}
        <div className="space-y-0.5">
          <div className="text-center font-bold">
            <div>Pasal 6</div>
            <div className="font-semibold italic text-[9pt]">Domain, Hosting, dan Rekening Pihak Ketiga</div>
          </div>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>Domain didaftarkan atas identitas PIHAK KEDUA sebagai pemilik (*registrant*).</li>
            <li>Akun transaksi keuangan, payment gateway, API supplier, dan rekening penerimaan terdaftar atas nama PIHAK KEDUA.</li>
            <li><strong>PIHAK PERTAMA sama sekali tidak menampung, memegang, atau mengelola dana hasil transaksi PIHAK KEDUA.</strong></li>
          </ol>
        </div>

        {/* PASAL 7 */}
        <div className="space-y-0.5">
          <div className="text-center font-bold">
            <div>Pasal 7</div>
            <div className="font-semibold italic text-[9pt]">Garansi dan Pemeliharaan</div>
          </div>
          <p>
            PIHAK PERTAMA memberikan masa garansi perbaikan bug selama 14 (empat belas) hari kalender sejak serah terima. Garansi tidak mencakup perubahan fitur baru atau gangguan akibat modifikasi mandiri oleh PIHAK KEDUA.
          </p>
        </div>

        {/* PASAL 8 - KLAUSUL KRUSIAL ANTI-PENIPUAN / PELEPASAN TANGGUNG JAWAB */}
        <div className="space-y-0.5">
          <div className="text-center font-bold">
            <div>Pasal 8</div>
            <div className="font-semibold italic text-[9pt]">Legalitas Usaha dan Larangan Penyalahgunaan (Anti-Penipuan)</div>
          </div>
          <ol className="list-decimal pl-5 space-y-0.5">
            <li>PIHAK KEDUA bertanggung jawab penuh secara hukum atas legalitas produk, transaksi, konten, dan operasional bisnisnya.</li>
            <li><strong>Larangan Tindak Pidana:</strong> Website dilarang keras digunakan untuk penipuan, toko fiktif, phishing, perjudian online, investasi ilegal, atau aktivitas melanggar hukum Republik Indonesia lainnya.</li>
            <li><strong>Pelepasan Tanggung Jawab (Indemnity):</strong> Apabila di kemudian hari timbul tuntutan hukum atau penyelidikan kepolisian atas aktivitas bisnis/penipuan yang dilakukan PIHAK KEDUA, maka PIHAK KEDUA membebaskan PIHAK PERTAMA dari segala tuntutan hukum, kerugian materiil, dan tanggung jawab pidana maupun perdata.</li>
            <li>PIHAK PERTAMA berhak memberikan data identitas klien dan catatan proyek kepada pihak penegak hukum apabila terdapat permintaan resmi sesuai peraturan perundang-undangan.</li>
          </ol>
        </div>

        {/* PASAL 9 */}
        <div className="space-y-0.5">
          <div className="text-center font-bold">
            <div>Pasal 9</div>
            <div className="font-semibold italic text-[9pt]">Penangguhan Sistem (Kill Switch)</div>
          </div>
          <p>
            Apabila terdapat indikasi kuat penyalahgunaan website untuk penipuan, permintaan resmi aparat penegak hukum, atau data klien terbukti palsu, PIHAK PERTAMA berhak menangguhkan atau menonaktifkan website secara sepihak demi mencegah kerugian masyarakat lebih lanjut.
          </p>
        </div>

        {/* PASAL 10 */}
        <div className="space-y-0.5">
          <div className="text-center font-bold">
            <div>Pasal 10</div>
            <div className="font-semibold italic text-[9pt]">Penyelesaian Perselisihan</div>
          </div>
          <p>
            Perselisihan diselesaikan secara musyawarah untuk mufakat. Apabila tidak tercapai mufakat, Para Pihak sepakat memilih domisili hukum di Pengadilan Negeri tempat kedudukan PIHAK PERTAMA ({providerCity}).
          </p>
        </div>
      </div>

      {/* 6. KLAUSUL PENUTUP & PENGESAHAN ELEKTRONIK */}
      <div className="my-4 text-justify text-[9.5pt] space-y-1">
        <p>
          Demikian Perjanjian ini dibuat dan disetujui secara sadar oleh Para Pihak tanpa paksaan dari pihak mana pun, serta sah dan mengikat menurut KUHPerdata Pasal 1320 dan UU ITE Pasal 5 dan 11.
        </p>
      </div>

      {/* 7. KOLOM TANDA TANGAN BERSIH (TRADISIONAL FORMAL - TANPA KOTAK HITAM ANEH) */}
      <div className="mt-6 pt-2 signature-container keep-together" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
        <p className="text-right text-[9pt] mb-3">
          Disepakati secara elektronik, {tanggalLengkap}
        </p>

        <div className="grid grid-cols-2 gap-8 text-center">
          {/* Kolom Pihak Pertama */}
          <div className="flex flex-col justify-between min-h-[140px]">
            <div>
              <p className="text-[9.5pt] font-bold">PIHAK PERTAMA,</p>
              <p className="text-[9pt] font-semibold text-gray-800">{providerBrand.toUpperCase()}</p>
            </div>

            {/* Signature Area */}
            <div className="h-16 flex items-center justify-center my-1">
              {agreement.provider_signature_data ? (
                <img
                  src={agreement.provider_signature_data}
                  alt="Tanda Tangan Pihak Pertama"
                  className="max-h-14 w-auto object-contain filter contrast-200 brightness-0"
                />
              ) : (
                <span className="font-serif italic text-base tracking-widest text-gray-900 border-b border-black pb-0.5 px-4">
                  Alif Muzakky
                </span>
              )}
            </div>

            <div>
              <p className="font-bold text-[9.5pt] uppercase underline underline-offset-2">
                {providerName.toUpperCase()}
              </p>
              <p className="text-[8.5pt] text-gray-700">
                {providerTitle}
              </p>
            </div>
          </div>

          {/* Kolom Pihak Kedua */}
          <div className="flex flex-col justify-between min-h-[140px]">
            <div>
              <p className="text-[9.5pt] font-bold">PIHAK KEDUA,</p>
              <p className="text-[9pt] font-semibold text-gray-800">
                {agreement.client_company || 'KLIEN'}
              </p>
            </div>

            {/* Client Signature Area */}
            <div className="h-16 flex items-center justify-center my-1">
              {agreement.signature_data ? (
                <img
                  src={agreement.signature_data}
                  alt="Tanda Tangan Klien"
                  className="max-h-14 w-auto object-contain filter contrast-200 brightness-0"
                />
              ) : (
                <span className="text-[8.5pt] italic text-gray-500 border-b border-black px-4 pb-0.5">
                  (Tanda Tangan Elektronik)
                </span>
              )}
            </div>

            <div>
              <p className="font-bold text-[9.5pt] uppercase underline underline-offset-2">
                {agreement.signer_name || agreement.client_contact_name || 'KLIEN'}
              </p>
              <p className="text-[8.5pt] text-gray-700">
                Pemilik Usaha
              </p>
            </div>
          </div>
        </div>

        {/* Small discreet reference footer */}
        <div className="mt-8 pt-2 border-t border-gray-400 flex items-center justify-between text-[7.5pt] text-gray-600 font-sans">
          <span>Surat Perjanjian Kerja Sama • Stack.byAlif & {agreement.client_company || agreement.signer_name || 'Klien'}</span>
          <span className="font-mono">Ref: {agreement.id.slice(0, 16).toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
