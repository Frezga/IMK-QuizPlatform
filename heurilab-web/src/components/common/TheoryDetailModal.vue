<script setup>
import { computed, ref, watch } from 'vue'
import { X, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-vue-next'
import { HEURISTICS_DATA } from '@/data/missionsData'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  /**
   * Jika null, modal berjalan dalam mode Referensi Umum (menampilkan daftar 01-10)
   * agar tidak membocorkan heuristik yang sedang diuji pada ArenaView.
   */
  initialHeuristicNumber: {
    type: String,
    default: null,
  },
  allowLaunchSimulation: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['close', 'start-mission'])

const activeNumber = ref(props.initialHeuristicNumber || '01')

watch(
  () => [props.isOpen, props.initialHeuristicNumber],
  ([open, num]) => {
    if (open) {
      activeNumber.value = num || '01'
    }
  }
)

const activeHeuristic = computed(() => {
  return HEURISTICS_DATA.find((h) => h.number === activeNumber.value) || HEURISTICS_DATA[0]
})

const isReferenceDirectoryMode = computed(() => !props.initialHeuristicNumber)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="theory-modal-title"
      @click.self="emit('close')"
    >
      <div class="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-[#E4E4E7] bg-[#FFFFFF] shadow-sm">
        <!-- Header Modal -->
        <div class="flex items-start justify-between gap-4 border-b border-[#E4E4E7] px-6 py-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-mono-tabular rounded border border-[#E4E4E7] bg-[#F4F4F5] px-2 py-0.5 text-xs font-medium text-[#18181B]">
                #{{ activeHeuristic.number }}
              </span>
              <span
                v-if="activeHeuristic.isFocus"
                class="rounded border border-[#18181B] px-2 py-0.5 text-[11px] font-medium text-[#18181B]"
              >
                Fokus Simulasi Mendalam
              </span>
            </div>
            <h2 id="theory-modal-title" class="mt-2 text-lg font-semibold text-[#18181B]">
              {{ activeHeuristic.title }}
            </h2>
          </div>

          <button
            type="button"
            class="rounded-lg border border-[#E4E4E7] p-1.5 text-[#71717A] transition-colors hover:border-[#18181B] hover:text-[#18181B]"
            aria-label="Tutup ringkasan teori"
            @click="emit('close')"
          >
            <X class="h-4 w-4" :stroke-width="1.75" />
          </button>
        </div>

        <!-- Pemilih Daftar 10 Prinsip saat dibuka sebagai Referensi Umum di Arena -->
        <div
          v-if="isReferenceDirectoryMode"
          class="border-b border-[#E4E4E7] bg-[#F4F4F5] px-6 py-3"
        >
          <p class="mb-2 text-xs font-medium text-[#71717A]">
            Pilih prinsip heuristik untuk membaca ringkasan teori (01–10):
          </p>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="item in HEURISTICS_DATA"
              :key="item.number"
              type="button"
              class="font-mono-tabular rounded-md border px-2.5 py-1 text-xs font-medium transition-colors"
              :class="
                activeNumber === item.number
                  ? 'border-[#18181B] bg-[#18181B] text-white'
                  : 'border-[#E4E4E7] bg-white text-[#71717A] hover:border-[#18181B] hover:text-[#18181B]'
              "
              @click="activeNumber = item.number"
            >
              {{ item.number }}
            </button>
          </div>
        </div>

        <!-- Isi Konten -->
        <div class="space-y-5 overflow-y-auto px-6 py-5">
          <div>
            <p class="text-sm font-medium text-[#18181B]">
              {{ activeHeuristic.shortSummary }}
            </p>
            <p class="mt-2 text-sm leading-relaxed text-[#71717A]">
              {{ activeHeuristic.theoryExplanation }}
            </p>
          </div>

          <div class="rounded-lg border border-[#E4E4E7] bg-[#F4F4F5] p-4">
            <h3 class="text-xs font-semibold uppercase tracking-wide text-[#18181B]">
              Indikator Pemeriksaan di Antarmuka
            </h3>
            <ul class="mt-2.5 space-y-2">
              <li
                v-for="(indicator, idx) in activeHeuristic.uiIndicators"
                :key="idx"
                class="flex items-start gap-2 text-sm text-[#18181B]"
              >
                <span class="font-mono-tabular mt-0.5 text-xs text-[#71717A]">
                  0{{ idx + 1 }}
                </span>
                <span>{{ indicator }}</span>
              </li>
            </ul>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-lg border border-[#E4E4E7] bg-white p-4">
              <div class="flex items-center gap-1.5 text-xs font-semibold text-red-700">
                <AlertTriangle class="h-3.5 w-3.5" :stroke-width="1.75" />
                <span>Contoh Pelanggaran UI</span>
              </div>
              <p class="mt-2 text-xs leading-relaxed text-[#71717A]">
                {{ activeHeuristic.badExample }}
              </p>
            </div>

            <div class="rounded-lg border border-[#E4E4E7] bg-white p-4">
              <div class="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 class="h-3.5 w-3.5" :stroke-width="1.75" />
                <span>Penerapan UI yang Tepat</span>
              </div>
              <p class="mt-2 text-xs leading-relaxed text-[#71717A]">
                {{ activeHeuristic.goodExample }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-3 border-t border-[#E4E4E7] bg-[#FAFAFA] px-6 py-3.5">
          <button
            type="button"
            class="rounded-lg border border-[#E4E4E7] bg-white px-4 py-2 text-sm font-medium text-[#18181B] transition-colors hover:bg-[#F4F4F5]"
            @click="emit('close')"
          >
            Tutup
          </button>

          <button
            v-if="allowLaunchSimulation"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg bg-[#18181B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            @click="emit('start-mission', activeHeuristic.missionCode)"
          >
            <span>Coba Simulasi Terkait</span>
            <ArrowRight class="h-4 w-4" :stroke-width="1.75" />
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
