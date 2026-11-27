<script setup>
/**
 * RrIconNav.vue — Komponen Starter Simulasi #2 (Heuristik #06: Recognition Rather than Recall)
 *
 * Panduan untuk anggota tim pengembang:
 * Komponen ini sudah menerapkan kontrak standar (@flag-element, :is-flag-mode, :reset-trigger, :selected-element-id).
 * Tim dapat memperkaya skenario interaksi editor dokumen di bawah ini tanpa mengubah kontrak props/emit.
 */
import { ref, watch } from 'vue'
import {
  FileText,
  SlidersHorizontal,
  GitBranch,
  Layers,
  Bookmark,
  Share2,
  Cpu,
  Search,
  Save,
} from 'lucide-vue-next'

const props = defineProps({
  isFlagMode: {
    type: Boolean,
    default: false,
  },
  resetTrigger: {
    type: Number,
    default: 0,
  },
  selectedElementId: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['flag-element'])

const searchQuery = ref('')
const docTitle = ref('Laporan Evaluasi Antarmuka - Draf 2')
const actionNotice = ref('Coba klik salah satu tombol ikon di bilah alat atas untuk melihat perilakunya.')

watch(
  () => props.resetTrigger,
  () => {
    searchQuery.value = ''
    docTitle.value = 'Laporan Evaluasi Antarmuka - Draf 2'
    actionNotice.value = 'Coba klik salah satu tombol ikon di bilah alat atas untuk melihat perilakunya.'
  }
)

const abstractIcons = [
  { id: 'act-1', icon: SlidersHorizontal, feedback: 'Aksi ikon #1 dijalankan (tanpa label, pengguna harus menebak artinya).' },
  { id: 'act-2', icon: GitBranch, feedback: 'Aksi ikon #2 dijalankan (simbol cabang tanpa teks keterangan).' },
  { id: 'act-3', icon: Layers, feedback: 'Aksi ikon #3 dijalankan (ikon tumpukan tanpa tooltip).' },
  { id: 'act-4', icon: Bookmark, feedback: 'Aksi ikon #4 dijalankan (ikon penanda tanpa label fungsi).' },
  { id: 'act-5', icon: Share2, feedback: 'Aksi ikon #5 dijalankan (ikon jaringan tanpa konteks tindakan).' },
  { id: 'act-6', icon: Cpu, feedback: 'Aksi ikon #6 dijalankan (ikon prosesor abstrak tanpa deskripsi).' },
]

function handleIconClick(item) {
  if (props.isFlagMode) return
  actionNotice.value = item.feedback
}

function handleFlag(elementId, elementLabel, event) {
  if (!props.isFlagMode) return
  const rect = event.currentTarget.getBoundingClientRect()
  emit('flag-element', {
    elementId,
    elementLabel,
    anchorRect: {
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
    },
  })
}

function handleSaveClick(event) {
  if (props.isFlagMode) {
    handleFlag('doc-save-btn', 'Tombol "Simpan Draf" Berlabel Jelas', event)
    return
  }
  actionNotice.value = 'Draf dokumen disimpan secara lokal.'
}

function flagRingClass(elementId) {
  if (!props.isFlagMode) return ''
  if (props.selectedElementId === elementId) {
    return 'ring-2 ring-zinc-900 ring-offset-2 border-zinc-900 bg-zinc-50 cursor-pointer'
  }
  return 'hover:ring-2 hover:ring-zinc-400 hover:ring-offset-1 cursor-crosshair'
}
</script>

<template>
  <div class="rounded-xl border border-[#E4E4E7] bg-[#FFFFFF] p-4 sm:p-6">
    <!-- Top Workspace Bar -->
    <div class="flex flex-col gap-3 border-b border-[#E4E4E7] pb-4 lg:flex-row lg:items-center lg:justify-between">
      <div class="flex items-center gap-2.5">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E4E4E7] bg-[#F4F4F5] text-[#18181B]">
          <FileText class="h-4 w-4" :stroke-width="1.75" />
        </span>
        <div>
          <p class="text-sm font-semibold text-[#18181B]">{{ docTitle }}</p>
          <p class="text-xs text-[#71717A]">Workspace Kolaborasi Dokumen</p>
        </div>
      </div>

      <!-- CACAT DESAIN INTI (#06 Recognition Rather than Recall): Deretan ikon abstrak tanpa label & tanpa tooltip -->
      <div
        class="inline-flex flex-wrap items-center gap-1 rounded-lg border border-[#E4E4E7] bg-[#F4F4F5] p-1.5 transition-shadow"
        :class="flagRingClass('icon-only-toolbar')"
        @click="isFlagMode && handleFlag('icon-only-toolbar', 'Bilah Alat Ikon Abstrak Tanpa Label & Tooltip', $event)"
      >
        <button
          v-for="item in abstractIcons"
          :key="item.id"
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-md border border-transparent bg-white text-[#18181B] transition-colors hover:border-[#E4E4E7]"
          :class="{ 'pointer-events-none': isFlagMode }"
          @click.stop="handleIconClick(item)"
        >
          <component :is="item.icon" class="h-4 w-4" :stroke-width="1.75" />
        </button>
      </div>
    </div>

    <!-- Area Pencarian & Simpan (Elemen Pembanding yang Sudah Jelas) -->
    <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div
        class="relative flex-1 rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] transition-shadow"
        :class="flagRingClass('doc-search-bar')"
        @click="isFlagMode && handleFlag('doc-search-bar', 'Kolom Pencarian Dokumen', $event)"
      >
        <Search
          class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]"
          :stroke-width="1.75"
        />
        <input
          v-model="searchQuery"
          type="text"
          :disabled="isFlagMode"
          placeholder="Cari bagian atau catatan di dokumen..."
          class="w-full rounded-lg bg-transparent py-2 pl-9 pr-3 text-xs text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none"
        />
      </div>

      <button
        type="button"
        class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#18181B] bg-[#18181B] px-3.5 py-2 text-xs font-medium text-white transition-all hover:bg-zinc-800"
        :class="flagRingClass('doc-save-btn')"
        @click="handleSaveClick($event)"
      >
        <Save class="h-3.5 w-3.5" :stroke-width="1.75" />
        <span>Simpan Draf</span>
      </button>
    </div>

    <!-- Kanvas Dokumen Sederhana -->
    <div class="mt-4 rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] p-4">
      <p class="text-xs font-medium text-[#18181B]">Pratinjau Isi Dokumen</p>
      <p class="mt-1.5 text-xs leading-relaxed text-[#71717A]">
        {{ actionNotice }}
      </p>
    </div>
  </div>
</template>
