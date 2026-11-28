<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Award,
  Crown,
  Eye,
  Lock,
  SearchCheck,
  ShieldAlert,
  Trophy,
  Zap,
  ArrowRight,
} from 'lucide-vue-next'
import { BADGES_CATALOG, HEURISTICS_DATA } from '@/data/missionsData'
import { useGameSession } from '@/composables/useGameSession'

const router = useRouter()
const {
  currentUser,
  completedCount,
  heuristicMasteryMap,
  userBadges,
  totalScore,
  recommendedNextHeuristic,
  fetchClassLeaderboard,
} = useGameSession()

const leaderboardRows = ref([])
const isLoadingLeaderboard = ref(true)

const badgeIcons = {
  SearchCheck,
  ShieldAlert,
  Award,
  Eye,
  Zap,
  Crown,
}

async function loadLeaderboard() {
  isLoadingLeaderboard.value = true
  try {
    leaderboardRows.value = await fetchClassLeaderboard()
  } finally {
    isLoadingLeaderboard.value = false
  }
}

onMounted(() => {
  loadLeaderboard()
})

function isBadgeUnlocked(badgeId) {
  return userBadges.value.includes(badgeId)
}

function goToRecommendedMission() {
  const target = recommendedNextHeuristic.value
  router.push({
    path: '/arena',
    query: { mission: target.missionCode },
  })
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <!-- Header Halaman -->
    <div class="flex flex-col gap-4 border-b border-[#E4E4E7] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="font-mono-tabular text-xs font-medium uppercase tracking-wider text-[#71717A]">
          RINGKASAN CAPAIAN
        </p>
        <h1 class="mt-1 text-2xl font-semibold tracking-tight text-[#18181B]">
          Progres Penguasaan & Papan Peringkat
        </h1>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div class="rounded-lg border border-[#E4E4E7] bg-white px-4 py-2 text-xs">
          <span class="text-[#71717A]">Total Poin Anda: </span>
          <strong class="font-mono-tabular text-sm font-semibold text-[#18181B]">
            {{ totalScore }}
          </strong>
        </div>
        <div class="rounded-lg border border-[#E4E4E7] bg-white px-4 py-2 text-xs">
          <span class="text-[#71717A]">Materi Dikuasai: </span>
          <strong class="font-mono-tabular text-sm font-semibold text-[#18181B]">
            {{ completedCount }}/10
          </strong>
        </div>
      </div>
    </div>

    <!-- Layout 2 Kolom -->
    <div class="mt-8 grid gap-6 lg:grid-cols-12">
      <!-- Kolom Kiri -->
      <div class="space-y-6 lg:col-span-5">
        <!-- Progres Penguasaan 10 Heuristik -->
        <section class="rounded-xl border border-[#E4E4E7] bg-[#FFFFFF] p-5">
          <div class="flex items-center justify-between border-b border-[#E4E4E7] pb-3.5">
            <h2 class="text-sm font-semibold text-[#18181B]">
              Progres Penguasaan 10 Heuristik
            </h2>
            <span class="font-mono-tabular text-xs text-[#71717A]">0%–100%</span>
          </div>

          <div class="mt-4 space-y-3">
            <div
              v-for="item in HEURISTICS_DATA"
              :key="item.number"
              class="rounded-lg border border-[#E4E4E7] bg-white p-2.5"
            >
              <div class="flex items-center justify-between gap-2 text-xs">
                <div class="flex min-w-0 items-center gap-2">
                  <span class="font-mono-tabular font-semibold text-[#18181B]">
                    #{{ item.number }}
                  </span>
                  <span class="truncate font-medium text-[#18181B]">
                    {{ item.title }}
                  </span>
                </div>
                <span class="font-mono-tabular shrink-0 font-semibold text-[#18181B]">
                  {{ heuristicMasteryMap[item.missionCode] ?? 0 }}%
                </span>
              </div>

              <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E4E4E7]">
                <div
                  class="h-full rounded-full bg-[#18181B] transition-[width] duration-300"
                  :style="{ width: `${heuristicMasteryMap[item.missionCode] ?? 0}%` }"
                ></div>
              </div>
            </div>
          </div>
        </section>

        <!-- Badges Pencapaian (6 Slot) -->
        <section class="rounded-xl border border-[#E4E4E7] bg-[#FFFFFF] p-5">
          <div class="flex items-center justify-between border-b border-[#E4E4E7] pb-3.5">
            <h2 class="text-sm font-semibold text-[#18181B]">Badges Pencapaian</h2>
            <span class="font-mono-tabular text-xs text-[#71717A]">
              {{ userBadges.length }}/{{ BADGES_CATALOG.length }} Terbuka
            </span>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div
              v-for="badge in BADGES_CATALOG"
              :key="badge.id"
              class="flex flex-col justify-between rounded-lg border p-3 transition-colors"
              :class="
                isBadgeUnlocked(badge.id)
                  ? 'border-[#18181B] bg-[#FFFFFF]'
                  : 'border-dashed border-[#E4E4E7] bg-[#F4F4F5] opacity-75'
              "
            >
              <div class="flex items-center justify-between">
                <span
                  class="flex h-8 w-8 items-center justify-center rounded-md border"
                  :class="
                    isBadgeUnlocked(badge.id)
                      ? 'border-[#18181B] bg-[#18181B] text-white'
                      : 'border-[#E4E4E7] bg-white text-[#71717A]'
                  "
                >
                  <component
                    :is="isBadgeUnlocked(badge.id) ? badgeIcons[badge.icon] : Lock"
                    class="h-4 w-4"
                    :stroke-width="1.75"
                  />
                </span>
              </div>

              <div class="mt-3">
                <p class="text-xs font-semibold text-[#18181B]">
                  {{ badge.name }}
                </p>
                <p class="mt-1 text-[11px] leading-snug text-[#71717A]">
                  {{ isBadgeUnlocked(badge.id) ? badge.description : badge.unlockHint }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Kolom Kanan -->
      <div class="space-y-6 lg:col-span-7">
        <!-- Leaderboard Kelas IMK -->
        <section class="overflow-hidden rounded-xl border border-[#E4E4E7] bg-[#FFFFFF]">
          <div class="flex items-center justify-between border-b border-[#E4E4E7] px-5 py-4">
            <div class="flex items-center gap-2">
              <Trophy class="h-4 w-4 text-[#18181B]" :stroke-width="1.75" />
              <h2 class="text-sm font-semibold text-[#18181B]">Leaderboard Kelas IMK</h2>
            </div>
            <span class="text-xs text-[#71717A]">Urutan Poin Tertinggi</span>
          </div>

          <div v-if="isLoadingLeaderboard" class="p-6 text-center text-xs text-[#71717A]">
            Memuat data peringkat kelas...
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full border-collapse text-left text-sm">
              <thead>
                <tr class="border-b border-[#E4E4E7] bg-[#F4F4F5] text-xs font-medium text-[#71717A]">
                  <th class="px-5 py-3">Peringkat</th>
                  <th class="px-5 py-3">Nama mahasiswa</th>
                  <th class="px-5 py-3 text-right">Kuasai %</th>
                  <th class="px-5 py-3 text-right">Total poin</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#E4E4E7]">
                <tr
                  v-for="row in leaderboardRows"
                  :key="row.id"
                  :class="
                    row.isCurrentUser
                      ? 'bg-[#F4F4F5] font-semibold'
                      : 'bg-white hover:bg-[#FAFAFA]'
                  "
                >
                  <td class="font-mono-tabular px-5 py-3.5 text-xs text-[#18181B]">
                    #{{ row.rank }}
                  </td>
                  <td class="px-5 py-3.5 text-sm text-[#18181B]">
                    <div class="flex items-center gap-2">
                      <span>{{ row.name }}</span>
                      <span
                        v-if="row.isCurrentUser"
                        class="rounded bg-[#18181B] px-1.5 py-0.5 text-[10px] font-medium text-white"
                      >
                        Anda
                      </span>
                    </div>
                  </td>
                  <td class="font-mono-tabular px-5 py-3.5 text-right text-xs text-[#71717A]">
                    {{ row.masteryPercent }}%
                  </td>
                  <td class="font-mono-tabular px-5 py-3.5 text-right text-sm font-semibold text-[#18181B]">
                    {{ row.total_score }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Kartu Rekomendasi Latihan Berikutnya -->
        <section class="rounded-xl border-2 border-[#18181B] bg-[#FFFFFF] p-6">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="font-mono-tabular text-xs font-semibold uppercase tracking-wider text-[#71717A]">
                LATIHAN BERIKUTNYA
              </p>
              <h2 class="mt-1.5 text-lg font-semibold text-[#18181B]">
                #{{ recommendedNextHeuristic.number }} · {{ recommendedNextHeuristic.title }}
              </h2>
              <p class="mt-1 text-sm text-[#71717A]">
                {{
                  completedCount >= 10
                    ? 'Seluruh 10 heuristik telah Anda kuasai. Ulangi studi kasus mana saja untuk memantapkan pemahaman.'
                    : `Penguasaan prinsip ini masih ${heuristicMasteryMap[recommendedNextHeuristic.missionCode] ?? 0}%. Selesaikan simulasinya untuk menambah +100 poin.`
                }}
              </p>
            </div>

            <button
              type="button"
              class="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#18181B] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              @click="goToRecommendedMission"
            >
              <span>Mulai Latihan Ini</span>
              <ArrowRight class="h-4 w-4" :stroke-width="1.75" />
            </button>
          </div>
        </section>

        <p v-if="currentUser" class="text-xs text-[#71717A]">
          Masuk sebagai tamu <strong class="text-[#18181B]">{{ currentUser.name }}</strong> · Progres otomatis tersimpan.
        </p>
      </div>
    </div>
  </div>
</template>
