<script setup>
import { ArrowRight, BookOpen, Trophy } from 'lucide-vue-next'
import { useGameSession } from '@/composables/useGameSession'

const { completedCount, totalScore, userBadges } = useGameSession()
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
    <!-- Hero Section -->
    <section class="grid items-center gap-8 border-b border-[#E4E4E7] pb-12 lg:grid-cols-12 lg:gap-10">
      <div class="lg:col-span-7">
        <p class="font-mono-tabular text-xs font-medium tracking-wider text-[#71717A]">
          BELAJAR • COBA • PAHAMI
        </p>
        <h1 class="mt-3 text-3xl font-semibold tracking-tight text-[#18181B] sm:text-4xl lg:leading-[1.15]">
          Kuasai 10 Usability Heuristics Lewat Simulasi Kasus
        </h1>
        <p class="mt-4 max-w-xl text-sm leading-relaxed text-[#71717A] sm:text-base">
          Tinggalkan kuis gambar statis. Pilih materi prinsip usability Jakob Nielsen, berinteraksilah langsung dengan prototipe antarmuka nyata, lalu tandai elemen yang melanggar prinsip desain.
        </p>

        <div class="mt-7 flex flex-wrap items-center gap-3">
          <RouterLink
            to="/materi"
            class="inline-flex items-center gap-2 rounded-lg bg-[#18181B] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            <BookOpen class="h-4 w-4" :stroke-width="1.75" />
            <span>Jelajahi Materi 10 Heuristik</span>
            <ArrowRight class="h-4 w-4" :stroke-width="1.75" />
          </RouterLink>

          <RouterLink
            to="/leaderboard"
            class="inline-flex items-center gap-2 rounded-lg border border-[#E4E4E7] bg-white px-4 py-3 text-sm font-medium text-[#18181B] transition-colors hover:border-[#18181B]"
          >
            <Trophy class="h-4 w-4" :stroke-width="1.75" />
            <span>Lihat Progres Kelas</span>
          </RouterLink>
        </div>
      </div>

      <!-- Kartu Alur Belajarmu -->
      <div class="lg:col-span-5">
        <div class="rounded-xl border border-[#E4E4E7] bg-[#FFFFFF] p-6">
          <div class="flex items-center justify-between border-b border-[#E4E4E7] pb-3.5">
            <h2 class="text-sm font-semibold text-[#18181B]">Alur Belajarmu</h2>
            <span class="font-mono-tabular text-xs text-[#71717A]">3 Langkah</span>
          </div>

          <ol class="mt-4 space-y-4">
            <li class="flex items-start gap-3.5">
              <span class="font-mono-tabular flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#E4E4E7] bg-[#F4F4F5] text-xs font-semibold text-[#18181B]">
                01
              </span>
              <div>
                <p class="text-sm font-medium text-[#18181B]">Pilih &amp; baca ringkasan teori</p>
                <p class="mt-0.5 text-xs leading-relaxed text-[#71717A]">
                  Buka halaman Materi 10 Heuristik dan pilih salah satu prinsip untuk mulai simulasi.
                </p>
              </div>
            </li>

            <li class="flex items-start gap-3.5">
              <span class="font-mono-tabular flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#E4E4E7] bg-[#F4F4F5] text-xs font-semibold text-[#18181B]">
                02
              </span>
              <div>
                <p class="text-sm font-medium text-[#18181B]">Coba &amp; tandai pelanggaran</p>
                <p class="mt-0.5 text-xs leading-relaxed text-[#71717A]">
                  Uji interaksi simulasi terlebih dahulu, lalu tandai komponen yang bermasalah.
                </p>
              </div>
            </li>

            <li class="flex items-start gap-3.5">
              <span class="font-mono-tabular flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#E4E4E7] bg-[#F4F4F5] text-xs font-semibold text-[#18181B]">
                03
              </span>
              <div>
                <p class="text-sm font-medium text-[#18181B]">Lihat evaluasi</p>
                <p class="mt-0.5 text-xs leading-relaxed text-[#71717A]">
                  Dapatkan validasi teori, rekomendasi perbaikan desain, poin, dan lencana.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!-- Ringkasan Progres Singkat di Beranda -->
    <section class="mt-10 grid gap-4 sm:grid-cols-3">
      <div class="rounded-xl border border-[#E4E4E7] bg-[#FFFFFF] p-5">
        <p class="text-xs font-medium text-[#71717A]">Penguasaan Materi</p>
        <p class="font-mono-tabular mt-2 text-2xl font-semibold text-[#18181B]">
          {{ completedCount }}/10
        </p>
        <p class="mt-1 text-xs text-[#71717A]">Prinsip heuristik terselesaikan</p>
      </div>

      <div class="rounded-xl border border-[#E4E4E7] bg-[#FFFFFF] p-5">
        <p class="text-xs font-medium text-[#71717A]">Total Poin Anda</p>
        <p class="font-mono-tabular mt-2 text-2xl font-semibold text-[#18181B]">
          {{ totalScore }}
        </p>
        <p class="mt-1 text-xs text-[#71717A]">+100 poin setiap misi selesai</p>
      </div>

      <div class="rounded-xl border border-[#E4E4E7] bg-[#FFFFFF] p-5">
        <p class="text-xs font-medium text-[#71717A]">Badges Pencapaian</p>
        <p class="font-mono-tabular mt-2 text-2xl font-semibold text-[#18181B]">
          {{ userBadges.length }}/6
        </p>
        <p class="mt-1 text-xs text-[#71717A]">Lencana terbuka dari simulasi</p>
      </div>
    </section>
  </div>
</template>
