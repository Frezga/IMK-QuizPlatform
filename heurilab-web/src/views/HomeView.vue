<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Check, Circle } from 'lucide-vue-next'
import { HEURISTICS_DATA } from '@/data/missionsData'
import { useGameSession } from '@/composables/useGameSession'
import TheoryDetailModal from '@/components/common/TheoryDetailModal.vue'

const router = useRouter()
const { completedCount, heuristicMasteryMap } = useGameSession()

const theoryModalOpen = ref(false)
const selectedHeuristicNumber = ref('01')

function openTheoryModal(heuristicNumber) {
  selectedHeuristicNumber.value = heuristicNumber
  theoryModalOpen.value = true
}

function handleStartMissionFromTheory(missionCode) {
  theoryModalOpen.value = false
  router.push({ path: '/arena', query: { mission: missionCode } })
}

function isHeuristicDone(missionCode) {
  return (heuristicMasteryMap.value[missionCode] ?? 0) === 100
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
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
          Tinggalkan kuis gambar statis. Berinteraksilah langsung dengan prototipe antarmuka nyata, rasakan celah desainnya, lalu tandai elemen yang melanggar prinsip usability Jakob Nielsen.
        </p>

        <div class="mt-7 flex flex-wrap items-center gap-3">
          <RouterLink
            to="/arena"
            class="inline-flex items-center gap-2 rounded-lg bg-[#18181B] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            <span>Mulai Misi: Kasus Interaktif</span>
            <ArrowRight class="h-4 w-4" :stroke-width="1.75" />
          </RouterLink>
          <RouterLink
            to="/leaderboard"
            class="inline-flex items-center rounded-lg border border-[#E4E4E7] bg-white px-4 py-3 text-sm font-medium text-[#18181B] transition-colors hover:border-[#18181B]"
          >
            Lihat Progres Kelas
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
                <p class="text-sm font-medium text-[#18181B]">Baca ringkasan teori</p>
                <p class="mt-0.5 text-xs leading-relaxed text-[#71717A]">
                  Pahami inti 10 prinsip heuristik dan indikator pemeriksaannya di UI.
                </p>
              </div>
            </li>

            <li class="flex items-start gap-3.5">
              <span class="font-mono-tabular flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#E4E4E7] bg-[#F4F4F5] text-xs font-semibold text-[#18181B]">
                02
              </span>
              <div>
                <p class="text-sm font-medium text-[#18181B]">Coba & tandai pelanggaran</p>
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

    <!-- Bagian Materi 10 Heuristik -->
    <section id="materi" class="pt-10">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 class="text-xl font-semibold tracking-tight text-[#18181B]">
            Materi 10 Heuristik
          </h2>
          <p class="mt-1 text-sm text-[#71717A]">
            <span class="font-mono-tabular font-medium text-[#18181B]">{{ completedCount }}/10 materi selesai</span>
            · Klik kartu untuk membaca penjelasan mendalam dan contoh kasus UI.
          </p>
        </div>

        <div class="flex items-center gap-2 text-xs text-[#71717A]">
          <span class="inline-block h-3 w-3 rounded-sm border-2 border-zinc-900 bg-white"></span>
          <span>Fokus simulasi mendalam (#05 & #06)</span>
        </div>
      </div>

      <!-- Grid Responsif 5x2 -->
      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <button
          v-for="item in HEURISTICS_DATA"
          :key="item.number"
          type="button"
          class="group flex h-full flex-col justify-between rounded-xl bg-[#FFFFFF] p-4 text-left transition-colors hover:bg-[#F4F4F5]"
          :class="
            item.isFocus
              ? 'border-2 border-zinc-900'
              : 'border border-[#E4E4E7] hover:border-zinc-400'
          "
          @click="openTheoryModal(item.number)"
        >
          <div>
            <div class="flex items-center justify-between gap-2">
              <span class="font-mono-tabular text-xs font-semibold text-[#71717A]">
                {{ item.number }}
              </span>
              <span
                v-if="item.isFocus"
                class="rounded bg-[#18181B] px-1.5 py-0.5 text-[10px] font-medium text-white"
              >
                Fokus
              </span>
            </div>

            <h3 class="mt-2.5 text-sm font-semibold leading-snug text-[#18181B]">
              {{ item.title }}
            </h3>
            <p class="mt-2 line-clamp-3 text-xs leading-relaxed text-[#71717A]">
              {{ item.shortSummary }}
            </p>
          </div>

          <div class="mt-4 flex items-center justify-between border-t border-[#E4E4E7] pt-3 text-xs">
            <span
              v-if="isHeuristicDone(item.missionCode)"
              class="inline-flex items-center gap-1 font-medium text-emerald-700"
            >
              <Check class="h-3.5 w-3.5" :stroke-width="2" />
              Selesai
            </span>
            <span
              v-else
              class="inline-flex items-center gap-1 text-[#71717A]"
            >
              <Circle class="h-3 w-3" :stroke-width="1.75" />
              Dalam Progres
            </span>

            <span class="text-[11px] font-medium text-[#18181B] opacity-0 transition-opacity group-hover:opacity-100">
              Detail →
            </span>
          </div>
        </button>
      </div>
    </section>

    <TheoryDetailModal
      :is-open="theoryModalOpen"
      :initial-heuristic-number="selectedHeuristicNumber"
      :allow-launch-simulation="true"
      @close="theoryModalOpen = false"
      @start-mission="handleStartMissionFromTheory"
    />
  </div>
</template>
