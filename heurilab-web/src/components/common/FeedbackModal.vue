<script setup>
import { CheckCircle2, XCircle, Heart, ArrowRight, RotateCcw, BarChart3 } from 'lucide-vue-next'

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
  pointsAwarded: {
    type: Number,
    default: 0,
  },
  alreadyCompletedBefore: {
    type: Boolean,
    default: false,
  },
  attempts: {
    type: Number,
    default: 1,
  },
  livesLeft: {
    type: Number,
    default: 3,
  },
  hintMessage: {
    type: String,
    default: '',
  },
  heuristicNumber: {
    type: String,
    default: '',
  },
  heuristicTitle: {
    type: String,
    default: '',
  },
  violatedTheory: {
    type: String,
    default: '',
  },
  designRecommendation: {
    type: String,
    default: '',
  },
  hasNextMission: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['retry', 'reset-lives', 'go-leaderboard', 'next-mission'])
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      <div class="w-full max-w-xl overflow-hidden rounded-xl border border-[#E4E4E7] bg-[#FFFFFF] shadow-sm">
        <!-- Kondisi 1: Jawaban Benar -->
        <template v-if="isCorrect">
          <div class="border-b border-emerald-200 bg-emerald-50/70 px-6 py-4">
            <div class="flex items-center gap-2.5">
              <CheckCircle2 class="h-5 w-5 text-emerald-700" :stroke-width="2" />
              <h2 id="feedback-modal-title" class="text-lg font-semibold text-emerald-950">
                {{
                  alreadyCompletedBefore
                    ? 'Jawaban Tepat! (Misi Sudah Terselesaikan)'
                    : `Jawaban Tepat! +${pointsAwarded} Poin`
                }}
              </h2>
            </div>
            <p class="mt-1 text-xs text-emerald-800">
              Diselesaikan dalam <span class="font-mono-tabular font-semibold">{{ attempts }}</span> kali percobaan.
            </p>
          </div>

          <div class="space-y-4 px-6 py-5">
            <!-- Bagian 1: Heuristik yang Dilanggar -->
            <div class="rounded-lg border border-[#E4E4E7] bg-[#F4F4F5] p-4">
              <p class="text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                HEURISTIK YANG DILANGGAR
              </p>
              <h3 class="mt-1 text-base font-semibold text-[#18181B]">
                #{{ heuristicNumber }} · {{ heuristicTitle }}
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-[#18181B]">
                {{ violatedTheory }}
              </p>
            </div>

            <!-- Bagian 2: Rekomendasi Perbaikan Desain -->
            <div class="rounded-lg border border-[#E4E4E7] bg-white p-4">
              <p class="text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                REKOMENDASI PERBAIKAN DESAIN
              </p>
              <p class="mt-2 text-sm leading-relaxed text-[#18181B]">
                {{ designRecommendation }}
              </p>
            </div>
          </div>

          <div class="flex flex-col-reverse gap-2.5 border-t border-[#E4E4E7] bg-[#FAFAFA] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E4E4E7] bg-white px-4 py-2 text-sm font-medium text-[#18181B] transition-colors hover:border-[#18181B]"
              @click="emit('go-leaderboard')"
            >
              <BarChart3 class="h-4 w-4" :stroke-width="1.75" />
              <span>Lihat Progres</span>
            </button>

            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#18181B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              @click="emit('next-mission')"
            >
              <span>{{ hasNextMission ? 'Lanjut ke Misi Berikutnya' : 'Selesai & Lihat Progres' }}</span>
              <ArrowRight class="h-4 w-4" :stroke-width="1.75" />
            </button>
          </div>
        </template>

        <!-- Kondisi 2: Jawaban Kurang Tepat -->
        <template v-else>
          <div class="border-b border-red-200 bg-red-50/70 px-6 py-4">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2.5">
                <XCircle class="h-5 w-5 text-red-700" :stroke-width="2" />
                <h2 id="feedback-modal-title" class="text-lg font-semibold text-red-950">
                  Evaluasi Belum Tepat
                </h2>
              </div>
              <div class="flex items-center gap-1 text-xs font-medium text-red-800">
                <Heart
                  v-for="n in 3"
                  :key="n"
                  class="h-4 w-4"
                  :class="n <= livesLeft ? 'fill-red-600 text-red-600' : 'text-red-200'"
                  :stroke-width="1.75"
                />
              </div>
            </div>
            <p class="mt-1 text-xs text-red-800">
              Nyawa berkurang 1 (sisa {{ livesLeft }} dari 3). Percobaan ke-{{ attempts }}.
            </p>
          </div>

          <div class="space-y-4 px-6 py-5">
            <div class="rounded-lg border border-[#E4E4E7] bg-[#F4F4F5] p-4">
              <p class="text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                PETUNJUK ANALISIS
              </p>
              <p class="mt-1.5 text-sm leading-relaxed text-[#18181B]">
                {{ hintMessage }}
              </p>
            </div>

            <p v-if="livesLeft <= 0" class="text-xs leading-relaxed text-red-700">
              Nyawa Anda pada misi ini telah habis. Anda dapat memulihkan nyawa dan mengulang observasi simulasi dari awal.
            </p>
          </div>

          <div class="flex items-center justify-end gap-3 border-t border-[#E4E4E7] bg-[#FAFAFA] px-6 py-4">
            <button
              v-if="livesLeft > 0"
              type="button"
              class="inline-flex items-center gap-2 rounded-lg bg-[#18181B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              @click="emit('retry')"
            >
              <RotateCcw class="h-4 w-4" :stroke-width="1.75" />
              <span>Coba Kembali</span>
            </button>

            <button
              v-else
              type="button"
              class="inline-flex items-center gap-2 rounded-lg bg-[#18181B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              @click="emit('reset-lives')"
            >
              <RotateCcw class="h-4 w-4" :stroke-width="1.75" />
              <span>Pulihkan Nyawa & Ulangi Misi</span>
            </button>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>
