<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Layers, Menu, X, User, LogOut } from 'lucide-vue-next'
import { useGameSession } from '@/composables/useGameSession'

const route = useRoute()
const { currentUser, totalScore, userBadges, openGuestModal, logoutSession } = useGameSession()
const mobileMenuOpen = ref(false)

function isActiveRoute(path) {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-[#E4E4E7] bg-[#FFFFFF]">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
      <!-- Logo -->
      <RouterLink
        to="/"
        class="flex items-center gap-2.5 text-[#18181B] focus:outline-none"
      >
        <span class="flex h-8 w-8 items-center justify-center rounded-lg border border-[#18181B] bg-[#18181B] text-white">
          <Layers class="h-4 w-4" :stroke-width="1.75" />
        </span>
        <span class="text-base font-semibold tracking-tight">HeuriLab</span>
      </RouterLink>

      <!-- Navigasi Desktop -->
      <nav class="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
        <RouterLink
          to="/"
          class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          :class="
            isActiveRoute('/')
              ? 'bg-[#F4F4F5] text-[#18181B]'
              : 'text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B]'
          "
        >
          Beranda
        </RouterLink>
        <RouterLink
          to="/materi"
          class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          :class="
            isActiveRoute('/materi')
              ? 'bg-[#F4F4F5] text-[#18181B]'
              : 'text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B]'
          "
        >
          Materi 10 Heuristik
        </RouterLink>
        <RouterLink
          to="/leaderboard"
          class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          :class="
            isActiveRoute('/leaderboard')
              ? 'bg-[#F4F4F5] text-[#18181B]'
              : 'text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B]'
          "
        >
          Leaderboard
        </RouterLink>
      </nav>

      <!-- Pill Status User -->
      <div class="flex items-center gap-2">
        <div
          v-if="currentUser"
          class="hidden items-center gap-2 rounded-full border border-[#E4E4E7] bg-[#F4F4F5] py-1 pl-3.5 pr-1.5 text-xs sm:flex"
        >
          <span class="max-w-[130px] truncate font-medium text-[#18181B]">
            {{ currentUser.name }}
          </span>
          <span class="text-[#D4D4D8]" aria-hidden="true">|</span>
          <span class="tabular-nums text-[#71717A]">
            <strong class="font-semibold text-[#18181B]">{{ totalScore }}</strong> Poin
            ·
            <strong class="font-semibold text-[#18181B]">{{ userBadges.length }}</strong> Badges
          </span>
          <button
            type="button"
            title="Keluar atau ganti akun"
            aria-label="Keluar dari akun"
            class="ml-1 rounded-full p-1 text-[#71717A] transition-colors hover:bg-white hover:text-[#18181B]"
            @click="logoutSession"
          >
            <LogOut class="h-3.5 w-3.5" :stroke-width="1.75" />
          </button>
        </div>

        <button
          v-else
          type="button"
          class="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-[#F4F4F5] px-3.5 py-1.5 text-xs font-medium text-[#18181B] transition-colors hover:border-[#18181B]"
          @click="openGuestModal"
        >
          <User class="h-3.5 w-3.5" :stroke-width="1.75" />
          Masuk Tamu
        </button>

        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E4E7] bg-white text-[#18181B] md:hidden"
          aria-label="Buka menu navigasi"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <X v-if="mobileMenuOpen" class="h-4 w-4" :stroke-width="1.75" />
          <Menu v-else class="h-4 w-4" :stroke-width="1.75" />
        </button>
      </div>
    </div>

    <!-- Menu Mobile -->
    <div
      v-if="mobileMenuOpen"
      class="border-t border-[#E4E4E7] bg-[#FFFFFF] px-4 py-3 md:hidden"
    >
      <div class="flex flex-col gap-1">
        <RouterLink
          to="/"
          class="rounded-lg px-3 py-2 text-sm font-medium text-[#18181B] hover:bg-[#F4F4F5]"
          @click="mobileMenuOpen = false"
        >
          Beranda
        </RouterLink>
        <RouterLink
          to="/materi"
          class="rounded-lg px-3 py-2 text-sm font-medium text-[#18181B] hover:bg-[#F4F4F5]"
          @click="mobileMenuOpen = false"
        >
          Materi 10 Heuristik
        </RouterLink>
        <RouterLink
          to="/leaderboard"
          class="rounded-lg px-3 py-2 text-sm font-medium text-[#18181B] hover:bg-[#F4F4F5]"
          @click="mobileMenuOpen = false"
        >
          Leaderboard
        </RouterLink>
      </div>
      <div
        v-if="currentUser"
        class="mt-3 flex items-center justify-between rounded-lg border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-2 text-xs"
      >
        <div>
          <span class="font-medium text-[#18181B]">{{ currentUser.name }}</span>
          <span class="ml-2 tabular-nums text-[#71717A]">
            {{ totalScore }} Poin · {{ userBadges.length }} Badges
          </span>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-1 rounded border border-[#E4E4E7] bg-white px-2 py-1 text-[11px] font-medium text-[#18181B]"
          @click="() => { mobileMenuOpen = false; logoutSession() }"
        >
          <LogOut class="h-3 w-3" :stroke-width="1.75" />
          Keluar
        </button>
      </div>
    </div>
  </header>
</template>
