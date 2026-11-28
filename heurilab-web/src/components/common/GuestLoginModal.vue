<script setup>
import { computed, ref } from 'vue'
import { ShieldCheck, ArrowRight, X, Eye, EyeOff, KeyRound } from 'lucide-vue-next'
import { useGameSession, sanitizeAlias, sanitizePin } from '@/composables/useGameSession'

const { showGuestLoginModal, registerGuest, loginWithPin, closeGuestModal } = useGameSession()

const activeTab = ref('register') // 'register' | 'login'
const rawAlias = ref('')
const rawPin = ref('')
const showPin = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

const cleanedPreview = computed(() => sanitizeAlias(rawAlias.value))
const cleanedPin = computed(() => sanitizePin(rawPin.value))
const isPinValid = computed(() => cleanedPin.value.length >= 4 && cleanedPin.value.length <= 6)

const wasSanitized = computed(() => {
  const trimmedRaw = rawAlias.value.trim()
  return trimmedRaw.length > 0 && trimmedRaw !== cleanedPreview.value
})

function switchTab(tab) {
  activeTab.value = tab
  errorMessage.value = ''
}

function handlePinInput(event) {
  const digitsOnly = sanitizePin(event.target.value)
  rawPin.value = digitsOnly
  event.target.value = digitsOnly
}

async function handleSubmit() {
  errorMessage.value = ''
  if (!cleanedPreview.value) {
    errorMessage.value = 'Masukkan username yang valid (minimal 1 huruf atau angka).'
    return
  }
  if (!isPinValid.value) {
    errorMessage.value = 'PIN keamanan harus terdiri dari 4 sampai 6 angka.'
    return
  }

  isSubmitting.value = true
  try {
    const res =
      activeTab.value === 'register'
        ? await registerGuest(rawAlias.value, cleanedPin.value)
        : await loginWithPin(rawAlias.value, cleanedPin.value)

    if (!res.ok) {
      errorMessage.value = res.error || 'Gagal memproses akun.'
    } else {
      rawAlias.value = ''
      rawPin.value = ''
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="showGuestLoginModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guest-login-title"
      @click.self="closeGuestModal"
    >
      <div class="relative w-full max-w-md rounded-xl border border-[#E4E4E7] bg-[#FFFFFF] p-6 shadow-sm">
        <button
          type="button"
          class="absolute right-4 top-4 rounded-lg border border-[#E4E4E7] p-1.5 text-[#71717A] transition-colors hover:border-[#18181B] hover:text-[#18181B]"
          aria-label="Tutup modal masuk"
          @click="closeGuestModal"
        >
          <X class="h-4 w-4" :stroke-width="1.75" />
        </button>

        <div class="mb-3 flex items-center gap-2 pr-8 text-xs font-medium text-[#71717A]">
          <ShieldCheck class="h-4 w-4 text-[#18181B]" :stroke-width="1.75" />
          <span>Akun Ringan · Tanpa Email &amp; Tanpa Password</span>
        </div>

        <h2 id="guest-login-title" class="text-xl font-semibold tracking-tight text-[#18181B]">
          {{ activeTab === 'register' ? 'Buat Akun HeuriLab' : 'Masuk ke Akun Anda' }}
        </h2>
        <p class="mt-1 text-sm leading-relaxed text-[#71717A]">
          {{
            activeTab === 'register'
              ? 'Daftarkan username unik dan PIN 4–6 angka untuk menyimpan progres, skor, serta peringkat kelas.'
              : 'Masukkan username dan PIN Anda untuk melanjutkan progres dari perangkat mana saja.'
          }}
        </p>

        <!-- Tab Daftar Baru / Masuk Akun -->
        <div
          class="mt-4 grid grid-cols-2 rounded-lg border border-[#E4E4E7] bg-[#F4F4F5] p-1"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            :aria-selected="activeTab === 'register'"
            class="rounded-md py-1.5 text-xs font-medium transition-colors"
            :class="
              activeTab === 'register'
                ? 'bg-[#18181B] text-white'
                : 'text-[#71717A] hover:text-[#18181B]'
            "
            @click="switchTab('register')"
          >
            Daftar Baru
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="activeTab === 'login'"
            class="rounded-md py-1.5 text-xs font-medium transition-colors"
            :class="
              activeTab === 'login'
                ? 'bg-[#18181B] text-white'
                : 'text-[#71717A] hover:text-[#18181B]'
            "
            @click="switchTab('login')"
          >
            Masuk Akun
          </button>
        </div>

        <form class="mt-4 space-y-4" @submit.prevent="handleSubmit">
          <!-- Input Username -->
          <div>
            <div class="mb-1.5 flex items-center justify-between">
              <label for="guest-alias-input" class="text-sm font-medium text-[#18181B]">
                Username / Nama Panggilan
              </label>
              <span class="font-mono-tabular text-xs text-[#71717A]">
                {{ cleanedPreview.length }}/25
              </span>
            </div>

            <input
              id="guest-alias-input"
              v-model="rawAlias"
              type="text"
              maxlength="25"
              autocomplete="username"
              autofocus
              placeholder="Contoh: frezga"
              class="w-full rounded-lg border border-[#E4E4E7] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:border-[#18181B] focus:outline-none"
            />

            <p v-if="wasSanitized" class="mt-1.5 text-xs text-[#71717A]">
              Disimpan sebagai:
              <span class="font-medium text-[#18181B]">{{ cleanedPreview }}</span>
              (karakter HTML/simbol khusus dihapus otomatis)
            </p>
          </div>

          <!-- Input PIN 4-6 Angka -->
          <div>
            <div class="mb-1.5 flex items-center justify-between">
              <label for="guest-pin-input" class="flex items-center gap-1.5 text-sm font-medium text-[#18181B]">
                <KeyRound class="h-3.5 w-3.5 text-[#71717A]" :stroke-width="1.75" />
                <span>PIN Keamanan (4–6 angka)</span>
              </label>
              <span class="font-mono-tabular text-xs text-[#71717A]">
                {{ cleanedPin.length }}/6
              </span>
            </div>

            <div class="relative">
              <input
                id="guest-pin-input"
                :value="rawPin"
                :type="showPin ? 'text' : 'password'"
                inputmode="numeric"
                maxlength="6"
                autocomplete="off"
                placeholder="Masukkan 4–6 digit angka"
                class="font-mono-tabular w-full rounded-lg border border-[#E4E4E7] bg-[#FFFFFF] py-2.5 pl-3.5 pr-10 text-sm tracking-widest text-[#18181B] placeholder:tracking-normal placeholder:text-[#A1A1AA] focus:border-[#18181B] focus:outline-none"
                @input="handlePinInput"
              />
              <button
                type="button"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-[#71717A] hover:text-[#18181B]"
                :aria-label="showPin ? 'Sembunyikan PIN' : 'Lihat PIN'"
                @click="showPin = !showPin"
              >
                <EyeOff v-if="showPin" class="h-4 w-4" :stroke-width="1.75" />
                <Eye v-else class="h-4 w-4" :stroke-width="1.75" />
              </button>
            </div>
          </div>

          <p v-if="errorMessage" class="text-xs font-medium text-red-600">
            {{ errorMessage }}
          </p>

          <div class="rounded-lg border border-[#E4E4E7] bg-[#F4F4F5] p-3 text-xs leading-relaxed text-[#71717A]">
            Privasi terjaga: Tidak ada email, nomor HP, atau data pribadi lain. PIN di-hash di server agar orang lain tidak bisa memakai username Anda.
          </div>

          <div class="space-y-2">
            <button
              type="submit"
              :disabled="isSubmitting || !cleanedPreview || !isPinValid"
              class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#18181B] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
            >
              <span>
                {{
                  isSubmitting
                    ? 'Memproses...'
                    : activeTab === 'register'
                      ? 'Buat Akun & Mulai'
                      : 'Masuk & Lanjutkan'
                }}
              </span>
              <ArrowRight class="h-4 w-4" :stroke-width="1.75" />
            </button>

            <button
              type="button"
              class="inline-flex w-full items-center justify-center rounded-lg border border-[#E4E4E7] bg-white px-4 py-2.5 text-sm font-medium text-[#71717A] transition-colors hover:border-[#18181B] hover:text-[#18181B]"
              @click="closeGuestModal"
            >
              Lewati &amp; Coba Tanpa Masuk
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
