<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Crosshair,
  Flag,
  Heart,
  HelpCircle,
  MousePointerClick,
  RotateCcw,
  X,
} from 'lucide-vue-next'
import { MISSIONS_DATA } from '@/data/missionsData'
import { useGameSession } from '@/composables/useGameSession'
import EpCartCheckout from '@/components/simulations/error-prevention/EpCartCheckout.vue'
import RrIconNav from '@/components/simulations/recognition-recall/RrIconNav.vue'
import TheoryDetailModal from '@/components/common/TheoryDetailModal.vue'
import FeedbackModal from '@/components/common/FeedbackModal.vue'

const route = useRoute()
const router = useRouter()
const { completedHeuristicCodes, submitMissionCompletion } = useGameSession()

const currentMissionIndex = ref(0)
const isFlagMode = ref(false)
const resetTrigger = ref(0)

// State Misi Aktif
const livesLeft = ref(3)
const attempts = ref(0)
const elapsedSeconds = ref(0)
let timerInterval = null

// State Seleksi Elemen & Quick-Tag Popover
const selectedElementId = ref('')
const selectedElementLabel = ref('')
const selectedReasonId = ref('')
const popoverVisible = ref(false)

// Blueprint Mode 1 State untuk Misi 3-10
const blueprintActionTriggered = ref(false)

// Modal State
const theoryModalOpen = ref(false)
const feedbackOpen = ref(false)
const feedbackData = ref({
  isCorrect: false,
  pointsAwarded: 0,
  alreadyCompletedBefore: false,
  hintMessage: '',
})

const simulationComponents = {
  EpCartCheckout,
  RrIconNav,
}

const activeMission = computed(() => MISSIONS_DATA[currentMissionIndex.value] || MISSIONS_DATA[0])
const activeSimComponent = computed(() => simulationComponents[activeMission.value.componentKey] || null)
const hasNextMission = computed(() => currentMissionIndex.value < MISSIONS_DATA.length - 1)

const formattedTime = computed(() => {
  const mins = Math.floor(elapsedSeconds.value / 60)
  const secs = elapsedSeconds.value % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})

const canConfirmViolation = computed(() => {
  return isFlagMode.value && Boolean(selectedElementId.value) && Boolean(selectedReasonId.value)
})

function startTimer() {
  stopTimer()
  timerInterval = setInterval(() => {
    elapsedSeconds.value += 1
  }, 1000)
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function resetMissionWorkspace({ keepTimer = false } = {}) {
  isFlagMode.value = false
  selectedElementId.value = ''
  selectedElementLabel.value = ''
  selectedReasonId.value = ''
  popoverVisible.value = false
  blueprintActionTriggered.value = false
  resetTrigger.value += 1
  if (!keepTimer) {
    livesLeft.value = 3
    attempts.value = 0
    elapsedSeconds.value = 0
    startTimer()
  }
}

function selectMissionByQuery() {
  const missionQuery = route.query.mission
  if (typeof missionQuery === 'string' && missionQuery) {
    const idx = MISSIONS_DATA.findIndex((m) => m.missionCode === missionQuery)
    if (idx !== -1) {
      currentMissionIndex.value = idx
    }
  }
}

watch(
  () => route.query.mission,
  () => {
    selectMissionByQuery()
    resetMissionWorkspace()
  }
)

onMounted(() => {
  selectMissionByQuery()
  resetMissionWorkspace()
})

onUnmounted(() => {
  stopTimer()
})

function switchMode(flagMode) {
  isFlagMode.value = flagMode
  if (!flagMode) {
    selectedElementId.value = ''
    selectedElementLabel.value = ''
    selectedReasonId.value = ''
    popoverVisible.value = false
  }
}

function handleElementFlagged({ elementId, elementLabel }) {
  if (!isFlagMode.value) return
  selectedElementId.value = elementId
  selectedElementLabel.value = elementLabel
  selectedReasonId.value = ''
  popoverVisible.value = true
}

function handleBlueprintElementClick(el) {
  if (!isFlagMode.value) return
  handleElementFlagged({
    elementId: el.id,
    elementLabel: el.label,
  })
}

function blueprintRingClass(elementId) {
  if (!isFlagMode.value) return ''
  if (selectedElementId.value === elementId) {
    return 'ring-2 ring-zinc-900 ring-offset-2 border-zinc-900 bg-zinc-50 cursor-pointer'
  }
  return 'hover:ring-2 hover:ring-zinc-400 hover:ring-offset-1 cursor-crosshair'
}

function clearSelectionPopover() {
  popoverVisible.value = false
}

async function handleConfirmViolation() {
  if (!canConfirmViolation.value) return

  attempts.value += 1
  const mission = activeMission.value
  const isElementCorrect = selectedElementId.value === mission.correctElementId
  const isReasonCorrect = selectedReasonId.value === mission.correctReasonId
  const isCorrect = isElementCorrect && isReasonCorrect

  if (isCorrect) {
    stopTimer()
    const result = await submitMissionCompletion({
      heuristicCode: mission.missionCode,
      isCorrect: true,
      attempts: attempts.value,
      timeSpentSeconds: elapsedSeconds.value,
    })

    feedbackData.value = {
      isCorrect: true,
      pointsAwarded: result.pointsEarned,
      alreadyCompletedBefore: result.alreadyCompleted,
      hintMessage: '',
    }
    feedbackOpen.value = true
  } else {
    livesLeft.value = Math.max(0, livesLeft.value - 1)
    await submitMissionCompletion({
      heuristicCode: mission.missionCode,
      isCorrect: false,
      attempts: attempts.value,
      timeSpentSeconds: elapsedSeconds.value,
    })

    const hintMessage = !isElementCorrect
      ? mission.wrongElementHint
      : mission.wrongReasonHint

    feedbackData.value = {
      isCorrect: false,
      pointsAwarded: 0,
      alreadyCompletedBefore: false,
      hintMessage,
    }
    feedbackOpen.value = true
  }
}

function handleRetryAfterWrong() {
  feedbackOpen.value = false
  selectedReasonId.value = ''
}

function handleResetLivesAndRetry() {
  feedbackOpen.value = false
  resetMissionWorkspace()
}

function handleNextMission() {
  feedbackOpen.value = false
  if (hasNextMission.value) {
    const nextMission = MISSIONS_DATA[currentMissionIndex.value + 1]
    currentMissionIndex.value += 1
    router.replace({ path: '/arena', query: { mission: nextMission.missionCode } })
    resetMissionWorkspace()
  } else {
    router.push('/leaderboard')
  }
}

function handleMissionSelectChange(event) {
  const nextIdx = Number(event.target.value)
  if (!Number.isNaN(nextIdx) && MISSIONS_DATA[nextIdx]) {
    currentMissionIndex.value = nextIdx
    router.replace({
      path: '/arena',
      query: { mission: MISSIONS_DATA[nextIdx].missionCode },
    })
    resetMissionWorkspace()
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA] pb-12">
    <!-- HUD Bar Atas -->
    <header class="sticky top-0 z-30 border-b border-[#E4E4E7] bg-[#FFFFFF]">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div class="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <RouterLink
            to="/"
            class="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E4E7] bg-white px-3 py-1.5 text-xs font-medium text-[#18181B] transition-colors hover:border-[#18181B]"
          >
            <ArrowLeft class="h-3.5 w-3.5" :stroke-width="1.75" />
            <span>Kembali</span>
          </RouterLink>

          <div class="flex items-center gap-2">
            <span class="font-mono-tabular rounded-md bg-[#18181B] px-2.5 py-1 text-xs font-medium text-white">
              Misi {{ currentMissionIndex + 1 }}/{{ MISSIONS_DATA.length }}
            </span>

            <select
              :value="currentMissionIndex"
              aria-label="Pilih kasus simulasi"
              class="rounded-md border border-[#E4E4E7] bg-[#F4F4F5] px-2.5 py-1 text-xs font-medium text-[#18181B] focus:border-[#18181B] focus:outline-none"
              @change="handleMissionSelectChange"
            >
              <option
                v-for="(m, idx) in MISSIONS_DATA"
                :key="m.missionCode"
                :value="idx"
              >
                Kasus #{{ m.stepNumber }}{{ completedHeuristicCodes.includes(m.missionCode) ? ' (Selesai)' : '' }}
              </option>
            </select>
          </div>

          <!-- Lencana Kategori Misteri (TIDAK membocorkan nama heuristik) -->
          <span class="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-1 text-xs font-medium text-[#18181B]">
            <HelpCircle class="h-3.5 w-3.5 text-[#71717A]" :stroke-width="1.75" />
            <span>Kategori: ??? (Tebak Prinsip)</span>
          </span>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Indikator Nyawa (3 Ikon Hati) -->
          <div
            class="flex items-center gap-1 rounded-lg border border-[#E4E4E7] bg-[#F4F4F5] px-2.5 py-1.5"
            aria-label="Sisa nyawa"
          >
            <Heart
              v-for="n in 3"
              :key="n"
              class="h-3.5 w-3.5 transition-colors"
              :class="n <= livesLeft ? 'fill-[#18181B] text-[#18181B]' : 'text-zinc-300'"
              :stroke-width="1.75"
            />
          </div>

          <!-- Timer Berjalan -->
          <div class="font-mono-tabular flex items-center gap-1.5 rounded-lg border border-[#E4E4E7] bg-[#F4F4F5] px-2.5 py-1.5 text-xs font-medium text-[#18181B]">
            <Clock class="h-3.5 w-3.5 text-[#71717A]" :stroke-width="1.75" />
            <span>Waktu {{ formattedTime }}</span>
          </div>

          <!-- Tombol Lihat Ringkasan Teori (Mode Referensi Netral 01-10) -->
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E4E7] bg-white px-3 py-1.5 text-xs font-medium text-[#18181B] transition-colors hover:border-[#18181B]"
            @click="theoryModalOpen = true"
          >
            <BookOpen class="h-3.5 w-3.5" :stroke-width="1.75" />
            <span>Lihat Ringkasan Teori</span>
          </button>
        </div>
      </div>
    </header>

    <div class="mx-auto mt-6 max-w-5xl space-y-5 px-4 sm:px-6">
      <!-- Kotak Instruksi (MISI ANDA) -->
      <section class="rounded-xl border border-[#E4E4E7] bg-[#FFFFFF] p-5">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="font-mono-tabular text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            MISI ANDA · {{ activeMission.title }}
          </span>
          <span
            v-if="completedHeuristicCodes.includes(activeMission.missionCode)"
            class="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
          >
            Sudah Diselesaikan
          </span>
        </div>
        <p class="mt-2 text-sm leading-relaxed text-[#18181B]">
          {{ activeMission.instruction }}
        </p>
      </section>

      <!-- Wadah Simulasi Interaktif -->
      <section class="overflow-hidden rounded-xl border border-[#E4E4E7] bg-[#FFFFFF]">
        <!-- Header Pengalih Mode 2 Tahap + Reset Simulasi -->
        <div class="flex flex-col gap-3 border-b border-[#E4E4E7] bg-[#F4F4F5] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <!-- Segmented Control 2 Tahap -->
          <div
            class="inline-flex rounded-lg border border-[#E4E4E7] bg-white p-1"
            role="tablist"
            aria-label="Mode Simulasi"
          >
            <button
              type="button"
              role="tab"
              :aria-selected="!isFlagMode"
              class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
              :class="
                !isFlagMode
                  ? 'bg-[#18181B] text-white'
                  : 'text-[#71717A] hover:text-[#18181B]'
              "
              @click="switchMode(false)"
            >
              <MousePointerClick class="h-3.5 w-3.5" :stroke-width="1.75" />
              <span>1. Mode Coba Interaksi</span>
            </button>

            <button
              type="button"
              role="tab"
              :aria-selected="isFlagMode"
              class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
              :class="
                isFlagMode
                  ? 'bg-[#18181B] text-white'
                  : 'text-[#71717A] hover:text-[#18181B]'
              "
              @click="switchMode(true)"
            >
              <Crosshair class="h-3.5 w-3.5" :stroke-width="1.75" />
              <span>2. Mode Tandai Elemen</span>
            </button>
          </div>

          <button
            type="button"
            class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E4E4E7] bg-white px-3 py-1.5 text-xs font-medium text-[#18181B] transition-colors hover:border-[#18181B]"
            @click="resetMissionWorkspace({ keepTimer: true })"
          >
            <RotateCcw class="h-3.5 w-3.5" :stroke-width="1.75" />
            <span>Reset Simulasi</span>
          </button>
        </div>

        <!-- Banner Bantuan Mode 2 -->
        <div
          v-if="isFlagMode"
          class="border-b border-[#E4E4E7] bg-zinc-900 px-4 py-2.5 text-xs font-medium text-white sm:px-6"
        >
          Mode Tandai Aktif: Klik elemen antarmuka yang bermasalah di bawah ini.
        </div>

        <!-- Area Kanvas Simulasi + Floating Quick-Tag Popover -->
        <div class="relative bg-[#FAFAFA] p-4 sm:p-6">
          <!-- Komponen Simulasi Khusus (EpCartCheckout / RrIconNav) -->
          <component
            :is="activeSimComponent"
            v-if="activeSimComponent"
            :is-flag-mode="isFlagMode"
            :reset-trigger="resetTrigger"
            :selected-element-id="selectedElementId"
            @flag-element="handleElementFlagged"
          />

          <!-- Blueprint Simulasi Interaktif untuk Misi 3-10 -->
          <div
            v-else-if="activeMission.blueprint"
            class="rounded-xl border border-[#E4E4E7] bg-[#FFFFFF] p-4 sm:p-6"
          >
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[#E4E4E7] pb-4">
              <div>
                <h3 class="text-sm font-semibold text-[#18181B]">
                  {{ activeMission.blueprint.panelTitle }}
                </h3>
                <p class="mt-0.5 text-xs text-[#71717A]">
                  {{ activeMission.blueprint.panelSubtitle }}
                </p>
              </div>
              <button
                type="button"
                class="rounded-lg border border-[#18181B] bg-[#18181B] px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
                :disabled="isFlagMode"
                @click="blueprintActionTriggered = true"
              >
                {{ activeMission.blueprint.actionLabel }}
              </button>
            </div>

            <div
              v-if="blueprintActionTriggered && !isFlagMode"
              class="mt-4 rounded-lg border border-[#E4E4E7] bg-[#F4F4F5] px-4 py-3 text-xs leading-relaxed text-[#18181B]"
            >
              <strong>Hasil Uji Interaksi:</strong> {{ activeMission.blueprint.actionFeedback }}
            </div>

            <div class="mt-4 space-y-3">
              <button
                v-for="el in activeMission.blueprint.elements"
                :key="el.id"
                type="button"
                class="flex w-full items-center justify-between gap-3 rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] px-4 py-3.5 text-left transition-all"
                :class="blueprintRingClass(el.id)"
                @click="handleBlueprintElementClick(el)"
              >
                <span class="text-sm font-medium text-[#18181B]">{{ el.label }}</span>
                <span class="font-mono-tabular shrink-0 rounded border border-[#E4E4E7] bg-white px-2 py-0.5 text-[11px] text-[#71717A]">
                  {{ el.tag }}
                </span>
              </button>
            </div>
          </div>

          <!-- Floating Quick-Tag Popover -->
          <div
            v-if="isFlagMode && popoverVisible && selectedElementId"
            class="mt-4 rounded-xl border-2 border-[#18181B] bg-[#FFFFFF] p-4 shadow-md sm:ml-auto sm:max-w-lg"
            role="region"
            aria-label="Pilih masalah pada elemen ini"
          >
            <div class="flex items-start justify-between gap-3 border-b border-[#E4E4E7] pb-3">
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                  Elemen Ditandai
                </p>
                <p class="mt-0.5 text-xs font-semibold text-[#18181B]">
                  {{ selectedElementLabel }}
                </p>
              </div>
              <button
                type="button"
                class="rounded p-1 text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B]"
                aria-label="Tutup popover pilihan masalah"
                @click="clearSelectionPopover"
              >
                <X class="h-4 w-4" :stroke-width="1.75" />
              </button>
            </div>

            <p class="mt-3 text-xs font-semibold text-[#18181B]">
              Pilih masalah pada elemen ini:
            </p>

            <div class="mt-2.5 space-y-2">
              <label
                v-for="option in activeMission.reasonOptions"
                :key="option.id"
                class="flex cursor-pointer items-start gap-2.5 rounded-lg border p-3 text-xs leading-relaxed transition-colors"
                :class="
                  selectedReasonId === option.id
                    ? 'border-[#18181B] bg-[#F4F4F5] font-medium text-[#18181B]'
                    : 'border-[#E4E4E7] bg-white text-[#71717A] hover:border-zinc-400 hover:text-[#18181B]'
                "
              >
                <input
                  v-model="selectedReasonId"
                  type="radio"
                  name="violation-reason"
                  :value="option.id"
                  class="mt-0.5 accent-[#18181B]"
                />
                <span>{{ option.label }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Footer CTA Utama -->
        <div class="flex flex-col gap-3 border-t border-[#E4E4E7] bg-[#FFFFFF] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p class="text-xs text-[#71717A]">
            <template v-if="!isFlagMode">
              Tahap 1 aktif: Cobalah berinteraksi dengan komponen simulasi terlebih dahulu.
            </template>
            <template v-else-if="!selectedElementId">
              Tahap 2 aktif: Klik salah satu elemen di dalam simulasi untuk menandainya.
            </template>
            <template v-else-if="!selectedReasonId">
              Elemen ditandai. Pilih salah satu alasan pelanggaran di kotak pilihan.
            </template>
            <template v-else>
              Siap dikonfirmasi: Elemen dan alasan pelanggaran sudah dipilih.
            </template>
          </p>

          <button
            type="button"
            :disabled="!canConfirmViolation"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#18181B] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500"
            @click="handleConfirmViolation"
          >
            <Flag class="h-4 w-4" :stroke-width="1.75" />
            <span>Tandai & Konfirmasi Pelanggaran</span>
          </button>
        </div>
      </section>
    </div>

    <!-- Modal Ringkasan Teori Netral (Tidak membocorkan jawaban misi) -->
    <TheoryDetailModal
      :is-open="theoryModalOpen"
      :initial-heuristic-number="null"
      :allow-launch-simulation="false"
      @close="theoryModalOpen = false"
    />

    <!-- Modal Evaluasi Jawaban -->
    <FeedbackModal
      :is-open="feedbackOpen"
      :is-correct="feedbackData.isCorrect"
      :points-awarded="feedbackData.pointsAwarded"
      :already-completed-before="feedbackData.alreadyCompletedBefore"
      :attempts="attempts"
      :lives-left="livesLeft"
      :hint-message="feedbackData.hintMessage"
      :heuristic-number="activeMission.heuristicNumber"
      :heuristic-title="activeMission.heuristicTitle"
      :violated-theory="activeMission.violatedTheory"
      :design-recommendation="activeMission.designRecommendation"
      :has-next-mission="hasNextMission"
      @retry="handleRetryAfterWrong"
      @reset-lives="handleResetLivesAndRetry"
      @go-leaderboard="() => { feedbackOpen = false; router.push('/leaderboard') }"
      @next-mission="handleNextMission"
    />
  </div>
</template>
