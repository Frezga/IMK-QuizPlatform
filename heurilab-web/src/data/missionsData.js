/**
 * Dataset terstruktur untuk 10 Usability Heuristics Jakob Nielsen,
 * Katalog Lencana Pencapaian, Daftar Misi Simulasi, dan Data Contoh Leaderboard.
 *
 * Catatan untuk tim pengembang:
 * Untuk mengganti misi 'BlueprintPreview' dengan komponen Vue simulasi khusus,
 * daftarkan komponen di ArenaView.vue dan ubah properti `componentKey` pada misi terkait.
 */

export const HEURISTICS_DATA = [
  {
    id: 1,
    number: '01',
    code: 'H1',
    missionCode: 'H1_01',
    title: 'Visibility of System Status',
    shortSummary: 'Sistem harus selalu memberi tahu pengguna apa yang sedang terjadi secara jelas dan tepat waktu.',
    isFocus: false,
    theoryExplanation:
      'Desain antarmuka wajib memberikan umpan balik yang sesuai dan cepat terhadap setiap aksi pengguna. Tanpa kejelasan status proses, pengguna akan ragu apakah klik mereka berhasil, memicu klik berulang, atau meninggalkan halaman.',
    uiIndicators: [
      'Indikator progres saat proses unggah, sinkronisasi, atau pembayaran berjalan',
      'Status tombol berubah jelas (misal: "Menyimpan..." lalu "Tersimpan")',
      'Penanda lokasi aktif di menu navigasi atau langkah checkout',
    ],
    badExample: 'Mengklik tombol "Kirim Berkas" tanpa perubahan visual apa pun selama 8 detik.',
    goodExample: 'Menampilkan bilah progres persentase, status "Mengunggah 65%", dan tombol nonaktif sementara.',
  },
  {
    id: 2,
    number: '02',
    code: 'H2',
    missionCode: 'H2_01',
    title: 'Match Between System and the Real World',
    shortSummary: 'Gunakan bahasa, istilah, dan konsep yang akrab dengan pengguna, bukan jargon teknis sistem.',
    isFocus: false,
    theoryExplanation:
      'Sistem seharusnya berbicara dalam bahasa pengguna sehari-hari dan mengikuti konvensi dunia nyata. Penggunaan kode galat internal, istilah basis data, atau metafora yang asing meningkatkan beban kognitif pengguna.',
    uiIndicators: [
      'Label tombol dan pesan status memakai istilah manusiawi yang mudah dipahami',
      'Urutan informasi mengikuti kebiasaan logis pengguna di dunia nyata',
      'Ikon merepresentasikan objek atau tindakan yang familier secara universal',
    ],
    badExample: 'Pesan error "ERR_SQL_FK_CONSTRAINT_23503 pada entitas inv_hdr".',
    goodExample: 'Pesan jelas: "Data pesanan belum bisa dihapus karena masih terhubung dengan tagihan aktif".',
  },
  {
    id: 3,
    number: '03',
    code: 'H3',
    missionCode: 'H3_01',
    title: 'User Control and Freedom',
    shortSummary: 'Sediakan "pintu keluar darurat" yang jelas agar pengguna dapat membatalkan atau keluar dari aksi.',
    isFocus: false,
    theoryExplanation:
      'Pengguna sering menekan menu atau memulai alur secara tidak sengaja. Antarmuka yang baik selalu menyediakan tombol Batal, Tutup, Kembali, atau Undo yang mudah dijangkau tanpa memaksa pengguna melalui proses berbelit.',
    uiIndicators: [
      'Modal atau form langkah panjang memiliki tombol Batal/Tutup yang terlihat jelas',
      'Tersedia mekanisme Undo setelah tindakan perubahan cepat seperti arsip atau hapus sementara',
      'Pengguna bisa kembali ke langkah sebelumnya tanpa kehilangan seluruh isian',
    ],
    badExample: 'Form multi-langkah yang mengunci navigasi dan tidak memiliki tombol "Batal" atau "Kembali".',
    goodExample: 'Menyediakan tombol "Batal" di samping aksi utama serta notifikasi "Urungkan (Undo)" selama 5 detik.',
  },
  {
    id: 4,
    number: '04',
    code: 'H4',
    missionCode: 'H4_01',
    title: 'Consistency and Standards',
    shortSummary: 'Pertahankan konsistensi kata, pola tata letak, dan perilaku antarmuka di seluruh halaman.',
    isFocus: false,
    theoryExplanation:
      'Pengguna tidak seharusnya menebak apakah istilah atau tombol yang berbeda memiliki arti yang sama. Ikuti konvensi platform dan jaga konsistensi posisi aksi primer/sekunder di seluruh sistem.',
    uiIndicators: [
      'Istilah aksi yang sama menggunakan kata yang seragam (misal selalu "Simpan", bukan berganti "Rekam"/"Apply")',
      'Posisi tombol konfirmasi dan batal konsisten di setiap dialog',
      'Gaya visual tombol primer, sekunder, dan destruktif mengikuti aturan yang sama',
    ],
    badExample: 'Di satu halaman tombol utama di kanan berwarna gelap, di halaman lain bertukar posisi dan arti.',
    goodExample: 'Seluruh dialog menempatkan tombol sekunder "Batal" di kiri dan aksi utama di kanan secara konsisten.',
  },
  {
    id: 5,
    number: '05',
    code: 'H5',
    missionCode: 'H5_01',
    title: 'Error Prevention',
    shortSummary: 'Cegah kesalahan fatal sebelum terjadi melalui konfirmasi tindakan destruktif dan batasan jelas.',
    isFocus: false,
    theoryExplanation:
      'Lebih baik mencegah kesalahan sejak awal daripada sekadar menampilkan pesan galat setelah masalah terjadi. Hilangkan kondisi rawan salah klik (slips) atau minta konfirmasi eksplisit sebelum aksi permanen dijalankan.',
    uiIndicators: [
      'Dialog konfirmasi sebelum menghapus item, akun, atau membatalkan transaksi penting',
      'Menonaktifkan tanggal atau pilihan yang tidak valid sebelum pengguna mengirim form',
      'Membedakan tombol aksi aman dan aksi destruktif secara jelas',
    ],
    badExample: 'Mengklik "Hapus Item" pada keranjang belanja langsung menghapus barang secara permanen tanpa konfirmasi.',
    goodExample: 'Menampilkan dialog konfirmasi "Yakin ingin menghapus item ini?" dengan tombol "Batal" dan "Hapus".',
  },
  {
    id: 6,
    number: '06',
    code: 'H6',
    missionCode: 'H6_01',
    title: 'Recognition Rather than Recall',
    shortSummary: 'Kurangi beban memori pengguna dengan membuat opsi, label, dan instruksi terlihat langsung.',
    isFocus: false,
    theoryExplanation:
      'Pengguna lebih mudah mengenali elemen yang terlihat di layar daripada mengingat arti ikon abstrak atau format perintah dari satu layar ke layar lain. Sertakan label teks, petunjuk terlihat, dan riwayat konteks.',
    uiIndicators: [
      'Ikon tindakan kompleks disertai label teks atau tooltip informatif yang jelas',
      'Format input yang diharapkan terlihat (contoh placeholder atau helper text permanen)',
      'Riwayat pencarian atau daftar pilihan muncul otomatis saat dibutuhkan',
    ],
    badExample: 'Bilah navigasi workspace hanya berisi 6 ikon geometris abstrak tanpa label dan tanpa tooltip.',
    goodExample: 'Setiap tombol aksi utama menampilkan ikon disertai label kata kerja singkat atau label yang jelas.',
  },
  {
    id: 7,
    number: '07',
    code: 'H7',
    missionCode: 'H7_01',
    title: 'Flexibility and Efficiency of Use',
    shortSummary: 'Sediakan jalan pintas atau percepatan alur bagi pengguna mahir tanpa membingungkan pemula.',
    isFocus: false,
    theoryExplanation:
      'Sistem yang baik melayani pengguna baru dengan panduan jelas sekaligus memberi akselerator (seperti pintasan keyboard, aksi massal, atau preset cepat) bagi pengguna yang sudah sering berinteraksi.',
    uiIndicators: [
      'Tersedia pintasan keyboard (misal Ctrl+K untuk pencarian cepat) atau aksi massal pada tabel',
      'Pengguna mahir bisa memilih banyak item sekaligus daripada mengulang aksi satu per satu',
      'Opsi filter cepat atau template berulang tersedia tanpa mengganggu tata letak utama',
    ],
    badExample: 'Mengharuskan admin menyetujui 50 pengajuan dengan membuka halaman detail satu per satu.',
    goodExample: 'Menyediakan kotak centang pilih semua dan tombol "Setujui Terpilih" serta pintasan keyboard.',
  },
  {
    id: 8,
    number: '08',
    code: 'H8',
    missionCode: 'H8_01',
    title: 'Aesthetic and Minimalist Design',
    shortSummary: 'Hindari informasi dan elemen visual berlebihan yang bersaing dengan konten utama pengguna.',
    isFocus: false,
    theoryExplanation:
      'Setiap unit informasi tambahan di layar akan bersaing dengan informasi yang relevan dan menurunkan visibilitasnya. Fokus pada hierarki visual yang bersih dan tampilkan hanya data yang dibutuhkan saat itu.',
    uiIndicators: [
      'Kartu dan tabel menampilkan metadata inti yang mendukung keputusan utama pengguna',
      'Ruang kosong (whitespace) cukup untuk memisahkan kelompok informasi secara tenang',
      'Tidak ada banner promosi berulang atau dekorasi yang menutupi alur tugas',
    ],
    badExample: 'Halaman konfirmasi transfer penuh dengan 6 banner promo, ticker berita, dan statistik tidak relevan.',
    goodExample: 'Menampilkan ringkasan nominal, penerima, biaya admin, dan tombol konfirmasi secara rapi.',
  },
  {
    id: 9,
    number: '09',
    code: 'H9',
    missionCode: 'H9_01',
    title: 'Help Users Recognize, Diagnose, and Recover from Errors',
    shortSummary: 'Pesan galat harus dijelaskan dalam bahasa sederhana, menunjukkan masalah, dan memberi solusi.',
    isFocus: false,
    theoryExplanation:
      'Saat kesalahan tetap terjadi, pesan error tidak boleh samar seperti "Terjadi kesalahan". Tunjukkan secara presisi field mana yang bermasalah dan langkah konkret untuk memperbaikinya.',
    uiIndicators: [
      'Pesan galat muncul tepat di dekat elemen yang bermasalah, bukan hanya di sudut layar',
      'Menyebutkan penyebab spesifik dan cara memperbaiki input',
      'Input pengguna yang sudah benar tidak dihapus seluruhnya saat validasi gagal',
    ],
    badExample: 'Menampilkan banner umum "Input tidak valid!" di atas form panjang tanpa menandai field yang salah.',
    goodExample: 'Menyorot field Kata Sandi dengan pesan: "Minimal 8 karakter dengan kombinasi huruf dan angka".',
  },
  {
    id: 10,
    number: '10',
    code: 'H10',
    missionCode: 'H10_01',
    title: 'Help and Documentation',
    shortSummary: 'Bantuan yang relevan harus mudah dicari, ringkas, dan fokus pada langkah tugas pengguna.',
    isFocus: false,
    theoryExplanation:
      'Meskipun sistem ideal mudah dipakai tanpa manual tebal, pengguna tetap membutuhkan bantuan kontekstual untuk fitur kompleks. Dokumentasi harus ringkas, dapat dicari, dan langsung menjelaskan langkah tindakan.',
    uiIndicators: [
      'Ikon atau tautan bantuan kontekstual tersedia di fitur teknis (seperti impor CSV atau formula)',
      'Panduan disusun berdasar langkah tugas pengguna, bukan glosarium abstrak',
      'Contoh format atau template siap pakai dapat diakses langsung dari halaman terkait',
    ],
    badExample: 'Fitur impor data massal tanpa contoh format kolom dan tautan bantuan mengarah ke beranda kosong.',
    goodExample: 'Menyediakan panel "Panduan Format CSV", daftar kolom wajib, dan tombol unduh contoh template.',
  },
]

export const BADGES_CATALOG = [
  {
    id: 'ux_inspector',
    name: 'UX Inspector',
    description: 'Menyelesaikan minimal 1 misi simulasi dengan tepat.',
    unlockHint: 'Selesaikan 1 misi',
    icon: 'SearchCheck',
    checkUnlocked: ({ completedCodes }) => completedCodes.length >= 1,
  },
  {
    id: 'error_preventer',
    name: 'Error Preventer',
    description: 'Menguasai simulasi #05 Error Prevention secara tepat.',
    unlockHint: 'Tuntaskan Misi #05',
    icon: 'ShieldAlert',
    checkUnlocked: ({ completedCodes }) => completedCodes.includes('H5_01'),
  },
  {
    id: 'top_reviewer',
    name: 'Top Reviewer',
    description: 'Mengumpulkan minimal 300 Poin evaluasi di HeuriLab.',
    unlockHint: 'Raih 300 Poin',
    icon: 'Award',
    checkUnlocked: ({ totalScore }) => totalScore >= 300,
  },
  {
    id: 'memory_architect',
    name: 'Memory Architect',
    description: 'Menguasai simulasi #06 Recognition Rather than Recall.',
    unlockHint: 'Tuntaskan Misi #06',
    icon: 'Eye',
    checkUnlocked: ({ completedCodes }) => completedCodes.includes('H6_01'),
  },
  {
    id: 'sharp_evaluator',
    name: 'Sharp Evaluator',
    description: 'Menjawab tepat dalam 1 kali percobaan di bawah 60 detik.',
    unlockHint: '1x coba & < 60 dtk',
    icon: 'Zap',
    checkUnlocked: ({ logs }) =>
      logs.some((log) => log.is_correct && log.attempts === 1 && log.time_spent_seconds <= 60),
  },
  {
    id: 'heuristic_master',
    name: 'Heuristic Master',
    description: 'Menuntaskan seluruh 10 Usability Heuristics dengan skor 100%.',
    unlockHint: 'Selesaikan 10/10 misi',
    icon: 'Crown',
    checkUnlocked: ({ completedCodes }) => completedCodes.length >= 10,
  },
]

/**
 * Daftar 10 misi di ArenaView.
 * Misi 1: #05 Error Prevention (EpCartCheckout.vue - Simulasi penuh)
 * Misi 2: #06 Recognition Rather than Recall (RrIconNav.vue - Starter simulasi)
 * Misi 3-10: Cakupan ke-8 heuristik lainnya dengan blueprint interaktif siap dikembangkan tim.
 */
export const MISSIONS_DATA = [
  {
    stepNumber: 1,
    missionCode: 'H5_01',
    heuristicNumber: '05',
    heuristicTitle: 'Error Prevention',
    componentKey: 'EpCartCheckout',
    title: 'Kasus #1: Keranjang Belanja E-Commerce',
    instruction:
      'Cobalah ubah jumlah barang lalu klik tombol "Hapus Item" pada produk Headphone Wireless di keranjang belanja. Amati perilaku antarmuka, lalu masuk ke Mode Tandai Elemen untuk menandai cacat desain paling kritis.',
    correctElementId: 'delete-item-btn',
    correctReasonId: 'r_h5_no_confirm',
    reasonOptions: [
      {
        id: 'r_h5_no_confirm',
        label: 'Menghapus item secara permanen tanpa modal konfirmasi atau opsi batal (Undo).',
      },
      {
        id: 'r_h5_color_contrast',
        label: 'Warna teks harga produk kurang kontras terhadap latar kartu putih.',
      },
      {
        id: 'r_h5_missing_search',
        label: 'Tidak tersedia kolom pencarian produk di dalam halaman ringkasan keranjang.',
      },
    ],
    wrongElementHint:
      'Perhatikan elemen aksi yang langsung menghilangkan data belanja Anda secara permanen hanya dengan satu kali klik.',
    wrongReasonHint:
      'Elemen yang Anda tandai sudah tepat, namun fokuslah pada risiko hilangnya data akibat ketiadaan pencegahan salah klik.',
    violatedTheory:
      'Error Prevention (#05) menuntut sistem mencegah kesalahan fatal sebelum terjadi. Menghapus item bernilai dari keranjang belanja secara instan tanpa dialog konfirmasi atau opsi Undo sangat berisiko saat pengguna tidak sengaja menekan tombol hapus.',
    designRecommendation:
      'Tambahkan modal konfirmasi sebelum menghapus (misalnya: "Yakin ingin menghapus Headphone Wireless dari keranjang?" dengan tombol Batal dan Hapus), atau sediakan toast notifikasi "Item dihapus · Urungkan" selama beberapa detik.',
  },
  {
    stepNumber: 2,
    missionCode: 'H6_01',
    heuristicNumber: '06',
    heuristicTitle: 'Recognition Rather than Recall',
    componentKey: 'RrIconNav',
    title: 'Kasus #2: Bilah Alat Workspace Dokumen',
    instruction:
      'Amati bilah alat (toolbar) di bagian atas editor dokumen ini. Cobalah pahami fungsi tiap tombol aksi cepat, lalu tandai elemen yang memaksa pengguna menebak dan mengingat arti simbol tanpa bantuan label.',
    correctElementId: 'icon-only-toolbar',
    correctReasonId: 'r_h6_abstract_icons',
    reasonOptions: [
      {
        id: 'r_h6_abstract_icons',
        label: 'Deretan ikon abstrak ditampilkan tanpa label teks maupun tooltip sehingga pengguna harus menebak fungsinya.',
      },
      {
        id: 'r_h6_slow_loading',
        label: 'Dokumen tidak menampilkan persentase progres saat halaman dimuat pertama kali.',
      },
      {
        id: 'r_h6_no_shortcut',
        label: 'Tidak terdapat tombol ekspor dokumen langsung ke format spreadsheet di kanan atas.',
      },
    ],
    wrongElementHint:
      'Amati kelompok tombol kontrol di bilah alat atas yang hanya mengandalkan simbol tanpa penjelasan teks.',
    wrongReasonHint:
      'Elemen toolbar benar, tetapi identifikasi alasan utama mengapa pengguna kesulitan mengenali fungsi tombol-tombol tersebut.',
    violatedTheory:
      'Recognition Rather than Recall (#06) menekankan bahwa pengguna seharusnya mengenali fungsi langsung dari tampilan yang terlihat, bukan dipaksa mengingat arti ikon abstrak dari pengalaman sebelumnya.',
    designRecommendation:
      'Sertakan label teks singkat di samping ikon utama atau tampilkan tooltip deskriptif saat kursor diarahkan (serta teks aria-label yang jelas) agar fungsi setiap alat langsung dikenali.',
  },
  {
    stepNumber: 3,
    missionCode: 'H1_01',
    heuristicNumber: '01',
    heuristicTitle: 'Visibility of System Status',
    componentKey: 'BlueprintPreview',
    title: 'Kasus #3: Unggah Lampiran Tugas',
    instruction:
      'Coba tekan tombol "Kirim Berkas Tugas" di panel unggah dan perhatikan respons sistem. Setelah mencoba, aktifkan Mode Tandai Elemen dan pilih bagian yang gagal memberi kejelasan status proses.',
    blueprint: {
      panelTitle: 'Portal Pengumpulan Tugas Akhir',
      panelSubtitle: 'Maksimal ukuran berkas PDF 15 MB',
      actionLabel: 'Kirim Berkas Tugas',
      actionFeedback: 'Klik terdeteksi, namun sistem tidak menampilkan spinner, persentase, atau perubahan status tombol.',
      elements: [
        {
          id: 'file-drop-info',
          label: 'Nama berkas: Laporan_IMK_Final.pdf (4,2 MB)',
          tag: 'Info Berkas',
        },
        {
          id: 'upload-submit-btn',
          label: 'Tombol "Kirim Berkas Tugas" (Diam tanpa indikator progres saat diklik)',
          tag: 'Aksi Unggah',
        },
        {
          id: 'deadline-note',
          label: 'Catatan tenggat: Jumat, 23:59 WIB',
          tag: 'Metadata',
        },
      ],
    },
    correctElementId: 'upload-submit-btn',
    correctReasonId: 'r_h1_no_progress',
    reasonOptions: [
      {
        id: 'r_h1_no_progress',
        label: 'Tidak ada umpan balik status loading atau persentase progres sehingga pengguna tidak tahu apakah berkas sedang diproses.',
      },
      {
        id: 'r_h1_jargon',
        label: 'Ukuran berkas menggunakan satuan megabita yang tidak dimengerti mahasiswa.',
      },
      {
        id: 'r_h1_no_darkmode',
        label: 'Latar belakang panel unggah berwarna terang dan tidak menyediakan tema gelap.',
      },
    ],
    wrongElementHint:
      'Perhatikan elemen pemicu proses pengiriman berkas yang tampak membeku setelah Anda menekannya.',
    wrongReasonHint:
      'Target elemen sudah tepat. Pilih alasan yang berkaitan dengan ketiadaan umpan balik status proses sistem.',
    violatedTheory:
      'Visibility of System Status (#01) mengharuskan sistem selalu menginformasikan status proses yang sedang berlangsung dalam waktu yang wajar melalui umpan balik visual yang jelas.',
    designRecommendation:
      'Ubah teks tombol menjadi "Mengunggah..." dalam status nonaktif sementara, tampilkan indikator progres persentase (0%–100%), lalu konfirmasi jelas saat berkas berhasil tersimpan.',
  },
  {
    stepNumber: 4,
    missionCode: 'H2_01',
    heuristicNumber: '02',
    heuristicTitle: 'Match Between System and the Real World',
    componentKey: 'BlueprintPreview',
    title: 'Kasus #4: Panel Riwayat Transaksi',
    instruction:
      'Periksa komponen informasi status pesanan pada dasbor pelanggan berikut. Temukan elemen yang memakai bahasa teknis internal sehingga membingungkan pengguna awam.',
    blueprint: {
      panelTitle: 'Status Pesanan #ORD-8821',
      panelSubtitle: 'Ringkasan pelacakan pengiriman paket',
      actionLabel: 'Periksa Kode Status',
      actionFeedback: 'Pengguna umum tidak memahami arti kode internal "TX_STATE: 0x04_SETTLED_NON_IDEMPOTENT".',
      elements: [
        {
          id: 'order-date-row',
          label: 'Tanggal Pemesanan: 14 November 2026',
          tag: 'Tanggal',
        },
        {
          id: 'system-jargon-badge',
          label: 'Status Saat Ini: TX_STATE: 0x04_SETTLED_NON_IDEMPOTENT',
          tag: 'Status Pesanan',
        },
        {
          id: 'shipping-courier',
          label: 'Kurir Pengiriman: Reguler (Estimasi 2–3 hari)',
          tag: 'Ekspedisi',
        },
      ],
    },
    correctElementId: 'system-jargon-badge',
    correctReasonId: 'r_h2_jargon',
    reasonOptions: [
      {
        id: 'r_h2_jargon',
        label: 'Menampilkan jargon teknis mesin/database alih-alih istilah bahasa sehari-hari yang dipahami pengguna.',
      },
      {
        id: 'r_h2_missing_undo',
        label: 'Tidak ada tombol untuk membatalkan kurir ekspedisi setelah paket diterima.',
      },
      {
        id: 'r_h2_too_minimal',
        label: 'Tampilan daftar pesanan tidak memiliki animasi gradasi warna.',
      },
    ],
    wrongElementHint:
      'Cari baris yang menggunakan kode heksadesimal dan istilah pemrograman internal sebagai status yang dibaca pelanggan.',
    wrongReasonHint:
      'Baris status sudah tepat. Pilih alasan yang menjelaskan ketidaksesuaian bahasa sistem dengan bahasa pengguna.',
    violatedTheory:
      'Match Between System and the Real World (#02) meminta antarmuka berbicara dalam bahasa dan konsep yang familier bagi pengguna, bukan istilah teknis backend.',
    designRecommendation:
      'Terjemahkan kode status internal menjadi frasa manusiawi yang jelas, misalnya "Pembayaran Diterima · Menunggu Pengemasan".',
  },
  {
    stepNumber: 5,
    missionCode: 'H3_01',
    heuristicNumber: '03',
    heuristicTitle: 'User Control and Freedom',
    componentKey: 'BlueprintPreview',
    title: 'Kasus #5: Wizard Pendaftaran Kelas',
    instruction:
      'Simulasikan kondisi saat Anda salah membuka formulir pengajuan pindah kelas 4 langkah ini. Tandai elemen kontrol navigasi yang menjebak pengguna tanpa jalan keluar.',
    blueprint: {
      panelTitle: 'Formulir Pengajuan Pindah Kelas (Langkah 2 dari 4)',
      panelSubtitle: 'Lengkapi seluruh data untuk melanjutkan ke tahap verifikasi',
      actionLabel: 'Coba Keluar dari Wizard',
      actionFeedback: 'Overlay mengunci halaman utama dan tidak menyediakan tombol Batal, Kembali, maupun ikon Tutup (×).',
      elements: [
        {
          id: 'wizard-step-header',
          label: 'Penunjuk Tahap: Langkah 2 — Alasan Akademik',
          tag: 'Header',
        },
        {
          id: 'wizard-locked-footer',
          label: 'Footer Aksi: Hanya tombol "Lanjut Langkah 3" (Tanpa Batal / Kembali)',
          tag: 'Kontrol Navigasi',
        },
        {
          id: 'wizard-reason-input',
          label: 'Kolom Catatan: Isi ringkas alasan pengajuan',
          tag: 'Input Teks',
        },
      ],
    },
    correctElementId: 'wizard-locked-footer',
    correctReasonId: 'r_h3_no_exit',
    reasonOptions: [
      {
        id: 'r_h3_no_exit',
        label: 'Tidak menyediakan tombol Batal atau Kembali sebagai jalan keluar saat pengguna salah masuk alur.',
      },
      {
        id: 'r_h3_font_size',
        label: 'Judul langkah menggunakan ukuran huruf yang terlalu besar.',
      },
      {
        id: 'r_h3_missing_chart',
        label: 'Tidak menampilkan grafik kapasitas kelas pada halaman formulir.',
      },
    ],
    wrongElementHint:
      'Lihat bagian tombol kontrol di bawah formulir yang seharusnya memberi keleluasaan membatalkan atau mundur.',
    wrongReasonHint:
      'Bagian footer aksi sudah benar. Pilih alasan yang menyoroti hilangnya kendali pengguna untuk keluar dari proses.',
    violatedTheory:
      'User Control and Freedom (#03) menegaskan bahwa pengguna sering memasuki alur secara tidak sengaja dan membutuhkan "pintu keluar darurat" yang jelas untuk kembali atau membatalkan tanpa hambatan.',
    designRecommendation:
      'Tambahkan tombol "Kembali" ke langkah sebelumnya dan tombol "Batal" (atau ikon Tutup dengan konfirmasi draf bila perlu) pada footer dialog.',
  },
  {
    stepNumber: 6,
    missionCode: 'H4_01',
    heuristicNumber: '04',
    heuristicTitle: 'Consistency and Standards',
    componentKey: 'BlueprintPreview',
    title: 'Kasus #6: Dialog Aksi Modul Pengaturan',
    instruction:
      'Bandingkan penamaan dan posisi tombol aksi pada dialog pengaturan berikut dengan konvensi standar aplikasi. Tandai elemen yang membingungkan karena tidak konsisten.',
    blueprint: {
      panelTitle: 'Pengaturan Notifikasi Email',
      panelSubtitle: 'Konfirmasi perubahan preferensi akun',
      actionLabel: 'Uji Klik Tombol Dialog',
      actionFeedback: 'Di halaman profil tombol kanan adalah aksi Simpan, namun di sini tombol kanan justru bertuliskan "Buang Perubahan" dengan gaya primer.',
      elements: [
        {
          id: 'notif-toggle-row',
          label: 'Sakelar: Ringkasan Mingguan Aktif',
          tag: 'Pengaturan',
        },
        {
          id: 'inconsistent-action-pair',
          label: 'Pasangan Tombol Terbalik: Kiri "Rekam Data" · Kanan Hitam Solid "Buang Perubahan"',
          tag: 'Grup Tombol',
        },
        {
          id: 'notif-email-preview',
          label: 'Alamat tujuan: mahasiswa@kampus.ac.id',
          tag: 'Informasi',
        },
      ],
    },
    correctElementId: 'inconsistent-action-pair',
    correctReasonId: 'r_h4_inconsistent',
    reasonOptions: [
      {
        id: 'r_h4_inconsistent',
        label: 'Istilah tombol ("Rekam Data") dan penempatan aksi primer/batal bertolak belakang dengan standar halaman lain.',
      },
      {
        id: 'r_h4_no_avatar',
        label: 'Tidak menampilkan foto profil pengguna di dalam kotak pengaturan notifikasi.',
      },
      {
        id: 'r_h4_too_short',
        label: 'Alamat email hanya berjumlah satu baris saja.',
      },
    ],
    wrongElementHint:
      'Perhatikan pasangan tombol keputusan di bagian bawah yang menggunakan istilah asing dan menukar posisi tombol utama.',
    wrongReasonHint:
      'Kelompok tombol sudah tepat. Pilih alasan mengenai ketidakseragaman istilah dan posisi standar.',
    violatedTheory:
      'Consistency and Standards (#04) menekankan agar istilah, posisi, dan hierarki visual tombol selalu seragam di seluruh produk sehingga pengguna tidak perlu menebak ulang.',
    designRecommendation:
      'Gunakan label standar "Simpan Perubahan" dengan gaya tombol primer di kanan dan "Batal" sebagai tombol sekunder di kiri secara konsisten di semua dialog.',
  },
  {
    stepNumber: 7,
    missionCode: 'H7_01',
    heuristicNumber: '07',
    heuristicTitle: 'Flexibility and Efficiency of Use',
    componentKey: 'BlueprintPreview',
    title: 'Kasus #7: Antrean Moderasi 40 Data',
    instruction:
      'Bayangkan Anda seorang asisten dosen yang harus memverifikasi 40 laporan sekaligus setiap hari. Tandai bagian antarmuka tabel yang menghambat efisiensi kerja pengguna berpengalaman.',
    blueprint: {
      panelTitle: 'Daftar Verifikasi Laporan Mingguan (40 Menunggu)',
      panelSubtitle: 'Kelola status persetujuan laporan mahasiswa',
      actionLabel: 'Simulasikan Verifikasi Massal',
      actionFeedback: 'Tidak ada kotak centang pilih semua (bulk select) atau pintasan keyboard; setiap baris wajib dibuka ke halaman baru satu per satu.',
      elements: [
        {
          id: 'table-header-filter',
          label: 'Judul Tabel: Daftar Pengajuan Terbaru',
          tag: 'Header Tabel',
        },
        {
          id: 'no-bulk-action-rows',
          label: 'Daftar Baris Tanpa Checkbox Massal & Tanpa Tombol Setujui Cepat',
          tag: 'Aksi Baris',
        },
        {
          id: 'pagination-counter',
          label: 'Penunjuk Halaman: Menampilkan 1–10 dari 40',
          tag: 'Paginasi',
        },
      ],
    },
    correctElementId: 'no-bulk-action-rows',
    correctReasonId: 'r_h7_no_accelerator',
    reasonOptions: [
      {
        id: 'r_h7_no_accelerator',
        label: 'Tidak menyediakan aksi massal (bulk action) atau pintasan cepat untuk memproses banyak item sekaligus.',
      },
      {
        id: 'r_h7_wrong_font',
        label: 'Angka paginasi menggunakan huruf monospace agar sejajar.',
      },
      {
        id: 'r_h7_missing_video',
        label: 'Tabel tidak menyertakan pemutar video tutorial di sebelah judul.',
      },
    ],
    wrongElementHint:
      'Cari elemen mekanisme aksi pada daftar baris yang memaksa pekerjaan repetitif dilakukan secara manual satu per satu.',
    wrongReasonHint:
      'Area aksi baris sudah tepat. Pilih alasan terkait ketiadaan akselerator untuk mempercepat tugas berulang.',
    violatedTheory:
      'Flexibility and Efficiency of Use (#07) mendorong adanya akselerator seperti aksi massal, preset, atau pintasan keyboard agar pengguna mahir dapat bekerja jauh lebih cepat.',
    designRecommendation:
      'Tambahkan checkbox per baris beserta opsi "Pilih Semua", tombol "Setujui Terpilih", dan pintasan keyboard untuk navigasi cepat antar item.',
  },
  {
    stepNumber: 8,
    missionCode: 'H8_01',
    heuristicNumber: '08',
    heuristicTitle: 'Aesthetic and Minimalist Design',
    componentKey: 'BlueprintPreview',
    title: 'Kasus #8: Halaman Konfirmasi Pembayaran',
    instruction:
      'Tinjau layar konfirmasi pembayaran tagihan UKT ini. Tandai elemen yang mengganggu fokus utama karena penuh informasi tidak relevan.',
    blueprint: {
      panelTitle: 'Konfirmasi Pembayaran Tagihan',
      panelSubtitle: 'Pastikan nominal dan tujuan rekening sudah benar',
      actionLabel: 'Periksa Kepadatan Layar',
      actionFeedback: 'Tiga blok promo, ticker skor olahraga, dan tautan artikel hiburan memenuhi layar tepat di antara nominal dan tombol bayar.',
      elements: [
        {
          id: 'payment-amount-summary',
          label: 'Ringkasan Nominal: Rp2.500.000 · Virtual Account Kampus',
          tag: 'Data Inti',
        },
        {
          id: 'cluttered-promo-feed',
          label: 'Blok Sisipan: 3 Banner Cashback + Ticker Berita + Widget Cuaca di Tengah Form',
          tag: 'Konten Distraksi',
        },
        {
          id: 'pay-now-button',
          label: 'Tombol Utama: Konfirmasi Pembayaran',
          tag: 'CTA Utama',
        },
      ],
    },
    correctElementId: 'cluttered-promo-feed',
    correctReasonId: 'r_h8_clutter',
    reasonOptions: [
      {
        id: 'r_h8_clutter',
        label: 'Menampilkan banyak konten sekunder tidak relevan yang bersaing langsung dengan informasi transaksi inti.',
      },
      {
        id: 'r_h8_missing_tooltip',
        label: 'Nominal uang tidak memiliki animasi berkedip.',
      },
      {
        id: 'r_h8_no_export',
        label: 'Tidak tersedia tombol ekspor ke format SVG pada layar konfirmasi.',
      },
    ],
    wrongElementHint:
      'Perhatikan elemen di tengah alur pembayaran yang sama sekali tidak membantu pengguna memverifikasi tagihan.',
    wrongReasonHint:
      'Elemen distraksi sudah tepat. Pilih alasan tentang informasi berlebihan yang menurunkan visibilitas data inti.',
    violatedTheory:
      'Aesthetic and Minimalist Design (#08) menyatakan bahwa setiap elemen ekstra di layar bersaing dengan informasi penting dan mengurangi kejelasan tugas utama.',
    designRecommendation:
      'Singkirkan widget berita, cuaca, dan banner promo dari alur konfirmasi pembayaran agar pengguna fokus memverifikasi nominal dan tujuan transaksi.',
  },
  {
    stepNumber: 9,
    missionCode: 'H9_01',
    heuristicNumber: '09',
    heuristicTitle: 'Help Users Recognize, Diagnose, and Recover from Errors',
    componentKey: 'BlueprintPreview',
    title: 'Kasus #9: Validasi Formulir Pendaftaran',
    instruction:
      'Klik tombol "Simpan Akun" pada formulir dengan beberapa isian yang salah, lalu tandai komponen pesan kesalahan yang gagal membantu pengguna memperbaiki masalahnya.',
    blueprint: {
      panelTitle: 'Buat Profil Peserta Workshop',
      panelSubtitle: 'Lengkapi data dasar untuk sertifikat',
      actionLabel: 'Simpan Akun',
      actionFeedback: 'Muncul teks merah generik "Error 400: Input Gagal!" tanpa menyebut kolom mana yang salah dan bagaimana memperbaikinya.',
      elements: [
        {
          id: 'generic-error-banner',
          label: 'Banner Galat: "Error 400: Input Gagal!" (Tanpa lokasi field & tanpa solusi)',
          tag: 'Pesan Error',
        },
        {
          id: 'fullname-input',
          label: 'Kolom Nama Lengkap: Andi Wijaya',
          tag: 'Input Nama',
        },
        {
          id: 'institution-input',
          label: 'Kolom Asal Instansi: Fakultas Ilmu Komputer',
          tag: 'Input Instansi',
        },
      ],
    },
    correctElementId: 'generic-error-banner',
    correctReasonId: 'r_h9_vague_error',
    reasonOptions: [
      {
        id: 'r_h9_vague_error',
        label: 'Pesan galat terlalu samar, memakai kode status, tidak menunjuk kolom yang salah, dan tidak memberi solusi perbaikan.',
      },
      {
        id: 'r_h9_no_confetti',
        label: 'Tidak menampilkan animasi konfeti saat halaman formulir pertama dibuka.',
      },
      {
        id: 'r_h9_too_many_fields',
        label: 'Formulir memiliki dua kolom isian yang terlalu sedikit.',
      },
    ],
    wrongElementHint:
      'Tandai elemen notifikasi galat yang muncul setelah Anda mencoba menyimpan formulir.',
    wrongReasonHint:
      'Pesan error sudah tepat ditandai. Pilih alasan yang menjelaskan mengapa pesan tersebut tidak membantu pemulihan kesalahan.',
    violatedTheory:
      'Help Users Recognize, Diagnose, and Recover from Errors (#09) mewajibkan pesan kesalahan ditulis dalam bahasa sederhana, menjelaskan penyebab secara tepat, dan memberi saran perbaikan konkret.',
    designRecommendation:
      'Tampilkan pesan tepat di bawah kolom terkait dengan kalimat jelas, misalnya: "Format NIM harus 10 digit angka (contoh: 2251502001)".',
  },
  {
    stepNumber: 10,
    missionCode: 'H10_01',
    heuristicNumber: '10',
    heuristicTitle: 'Help and Documentation',
    componentKey: 'BlueprintPreview',
    title: 'Kasus #10: Fitur Impor Data Nilai CSV',
    instruction:
      'Cobalah fitur unggah massal file CSV berikut. Tandai bagian yang membuat pengguna kebingungan karena tidak adanya panduan struktur data atau bantuan kontekstual.',
    blueprint: {
      panelTitle: 'Impor Nilai Mahasiswa (Format CSV)',
      panelSubtitle: 'Unggah file .csv untuk memperbarui daftar nilai secara massal',
      actionLabel: 'Buka Bantuan Format',
      actionFeedback: 'Ikon tanda tanya (?) tidak berfungsi dan tidak ada contoh susunan kolom wajib (NIM, Nama, Nilai) maupun tautan unduh template.',
      elements: [
        {
          id: 'csv-upload-box',
          label: 'Area Pilih Berkas: Unggah .csv maksimal 5 MB',
          tag: 'Upload Box',
        },
        {
          id: 'missing-help-template',
          label: 'Panel Panduan Kosong: Tidak ada daftar kolom wajib, contoh format, atau tombol Unduh Template',
          tag: 'Bantuan Kontekstual',
        },
        {
          id: 'import-history-date',
          label: 'Catatan Impor Terakhir: Belum ada riwayat impor',
          tag: 'Riwayat',
        },
      ],
    },
    correctElementId: 'missing-help-template',
    correctReasonId: 'r_h10_no_guidance',
    reasonOptions: [
      {
        id: 'r_h10_no_guidance',
        label: 'Fitur teknis impor CSV tidak menyediakan dokumentasi langkah ringkas, contoh kolom wajib, maupun template siap pakai.',
      },
      {
        id: 'r_h10_wrong_border',
        label: 'Garis tepi kotak unggah berbentuk garis putus-putus abu-abu.',
      },
      {
        id: 'r_h10_missing_audio',
        label: 'Halaman tidak memutar efek suara saat file dipilih.',
      },
    ],
    wrongElementHint:
      'Cari bagian pada antarmuka impor teknis ini yang seharusnya memberi petunjuk struktur file kepada pengguna.',
    wrongReasonHint:
      'Bagian panduan sudah tepat. Pilih alasan mengenai ketiadaan dokumentasi kontekstual dan contoh format.',
    violatedTheory:
      'Help and Documentation (#10) menegaskan bahwa untuk fitur kompleks atau berstandar khusus, bantuan yang ringkas, mudah ditemukan, dan berorientasi langkah tugas wajib tersedia di tempat pengguna membutuhkannya.',
    designRecommendation:
      'Sertakan daftar singkat kolom wajib (`nim,nama,nilai`), contoh 2 baris CSV valid, dan tombol "Unduh Template CSV" langsung di panel unggah.',
  },
]

/**
 * Data contoh leaderboard Kelas IMK untuk melengkapi tampilan
 * ketika database Supabase masih berisi kurang dari 5 mahasiswa.
 */
export const SAMPLE_LEADERBOARD_USERS = [
  {
    id: 'sample-1',
    name: 'Nadia Putri',
    total_score: 800,
    badges: ['ux_inspector', 'error_preventer', 'top_reviewer', 'memory_architect', 'sharp_evaluator'],
    isSample: true,
  },
  {
    id: 'sample-2',
    name: 'Raka Pratama',
    total_score: 600,
    badges: ['ux_inspector', 'error_preventer', 'top_reviewer'],
    isSample: true,
  },
  {
    id: 'sample-3',
    name: 'Sinta Maharani',
    total_score: 500,
    badges: ['ux_inspector', 'error_preventer', 'top_reviewer'],
    isSample: true,
  },
  {
    id: 'sample-4',
    name: 'Dimas Arya',
    total_score: 300,
    badges: ['ux_inspector', 'top_reviewer'],
    isSample: true,
  },
  {
    id: 'sample-5',
    name: 'Fajar Nugroho',
    total_score: 200,
    badges: ['ux_inspector', 'error_preventer'],
    isSample: true,
  },
]
