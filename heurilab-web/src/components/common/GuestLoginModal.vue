<script setup>
import { computed, ref } from 'vue'
import { ShieldCheck, ArrowRight } from 'lucide-vue-next'
import { useGameSession, sanitizeAlias } from '@/composables/useGameSession'

const { showGuestLoginModal, registerGuest } = useGameSession()

const rawAlias = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

const cleanedPreview = computed(() => sanitizeAlias(rawAlias.value))
const wasSanitized = computed(() => {
  const trimmedRaw = rawAlias.value.trim()
  return trimmedRaw.length > 0 && trimmedRaw !== cleanedPreview.value
})

async function handleSubmit() {
  errorMessage.value = ''
  if (!cleanedPreview.value) {
    errorMessage.value = 'Masukkan nama panggilan yang valid (minimal 1 huruf atau angka).'
    return
  }

  isSubmitting.value = true
  try {
    const res = await registerGuest(rawAlias.value)
    if (!res.ok) {
      errorMessage.value = res.error || 'Gagal menyimpan sesi tamu.'
    } else {
      rawAlias.value = ''
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
    >
      <div class="w-full max-w-md rounded-xl border border-[#E4E4E7] bg-[#FFFFFF] p-6 shadow-sm">
        <div class="mb-4 flex items-center gap-2 text-xs font-medium text-[#71717A]">
          <ShieldCheck class="h-4 w-4 text-[#18181B]" :stroke-width="1.75" />
          <span>Sesi Tamu Instan · Tanpa Akun & Tanpa Password</span>
        </div>

        <h2 id="guest-login-title" class="text-xl font-semibold tracking-tight text-[#18181B]">
          Selamat Datang di HeuriLab
        </h2>
        <p class="mt-1.5 text-sm leading-relaxed text-[#71717A]">
          Masukkan nama panggilan atau alias singkat untuk mencatat progres penguasaan 10 Usability Heuristics dan peringkat kelas Anda.
        </p>

        <form class="mt-5 space-y-4" @submit.prevent="handleSubmit">
          <div>
            <div class="mb-1.5 flex items-center justify-between">
              <label for="guest-alias-input" class="text-sm font-medium text-[#18181B]">
                Nama Panggilan / Alias
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
              autocomplete="nickname"
              autofocus
              placeholder="Contoh: Nadia Putri"
              class="w-full rounded-lg border border-[#E4E4E7] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:border-[#18181B] focus:outline-none"
            />

            <p v-if="wasSanitized" class="mt-1.5 text-xs text-[#71717A]">
              Ditampilkan sebagai:
              <span class="font-medium text-[#18181B]">{{ cleanedPreview }}</span>
              (karakter HTML/simbol khusus dihapus otomatis)
            </p>
            <p v-if="errorMessage" class="mt-1.5 text-xs font-medium text-red-600">
              {{ errorMessage }}
            </p>
          </div>

          <div class="rounded-lg border border-[#E4E4E7] bg-[#F4F4F5] p-3 text-xs leading-relaxed text-[#71717A]">
            Privasi terjaga: Kami tidak meminta email, nomor telepon, maupun kata sandi. Nama alias hanya digunakan untuk papan peringkat kelas.
          </div>

          <button
            type="submit"
            :disabled="isSubmitting || !cleanedPreview"
            class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#18181B] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            <span>{{ isSubmitting ? 'Menyiapkan Sesi...' : 'Mulai Belajar' }}</span>
            <ArrowRight class="h-4 w-4" :stroke-width="1.75" />
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>
