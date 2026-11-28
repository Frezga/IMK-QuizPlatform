<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Check, Circle } from 'lucide-vue-next'
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
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
    <!-- Header Halaman Materi -->
    <div class="border-b border-[#E4E4E7] pb-6">
      <p class="font-mono-tabular text-xs font-medium uppercase tracking-wider text-[#71717A]">
        MODUL PEMBELAJARAN
      </p>
      <h1 class="mt-1 text-2xl font-semibold tracking-tight text-[#18181B]">
        Materi 10 Heuristik
      </h1>
      <p class="mt-1.5 text-sm text-[#71717A]">
        <span class="font-mono-tabular font-medium text-[#18181B]">{{ completedCount }}/10 materi selesai</span>
        · Pilih salah satu kartu materi untuk membaca teori dan memulai simulasi kuisnya.
      </p>
    </div>

    <!-- Grid Responsif 5x2 -->
    <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <button
        v-for="item in HEURISTICS_DATA"
        :key="item.number"
        type="button"
        class="group flex h-full flex-col justify-between rounded-xl border border-[#E4E4E7] bg-[#FFFFFF] p-4 text-left transition-colors hover:border-zinc-400 hover:bg-[#F4F4F5]"
        @click="openTheoryModal(item.number)"
      >
        <div>
          <div class="flex items-center justify-between gap-2">
            <span class="font-mono-tabular text-xs font-semibold text-[#71717A]">
              {{ item.number }}
            </span>
          </div>

          <h2 class="mt-2.5 text-sm font-semibold leading-snug text-[#18181B]">
            {{ item.title }}
          </h2>
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
            Buka →
          </span>
        </div>
      </button>
    </div>

    <TheoryDetailModal
      :is-open="theoryModalOpen"
      :initial-heuristic-number="selectedHeuristicNumber"
      :allow-launch-simulation="true"
      @close="theoryModalOpen = false"
      @start-mission="handleStartMissionFromTheory"
    />
  </div>
</template>
