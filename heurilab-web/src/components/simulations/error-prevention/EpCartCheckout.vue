<script setup>
/**
 * EpCartCheckout.vue — Simulasi Interaktif #1 (Heuristik #05: Error Prevention)
 *
 * KONTRAK KOMPONEN SIMULASI HEURILAB (Standar untuk seluruh 10 simulasi tim):
 * - Props:
 *   @prop {Boolean} isFlagMode - false = Mode 1 (Coba Interaksi), true = Mode 2 (Tandai Elemen)
 *   @prop {Number} resetTrigger - Inkremen angka dari parent untuk mereset state simulasi
 *   @prop {String} selectedElementId - ID elemen yang sedang ditandai (menampilkan cincin seleksi tebal)
 *
 * - Events:
 *   @emit flag-element ({ elementId: string, elementLabel: string, anchorRect: { top, left, width, height, bottom } })
 *         Dipancarkan saat pengguna mengklik elemen yang dapat ditandai ketika isFlagMode === true.
 */
import { computed, ref, watch } from 'vue'
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight, RotateCcw } from 'lucide-vue-next'

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

const INITIAL_ITEMS = [
  {
    id: 'headphone',
    name: 'Headphone Wireless',
    variant: 'Matte Black · Garansi 1 Tahun',
    price: 350000,
    qty: 1,
  },
  {
    id: 'mouse',
    name: 'Mouse Nirkabel',
    variant: 'Minimalist Silent Click · USB-C',
    price: 150000,
    qty: 1,
  },
]

const cartItems = ref(INITIAL_ITEMS.map((item) => ({ ...item })))
const lastDeletedName = ref('')
const restoredForInspection = ref(false)
const checkoutMessage = ref('')

function resetSimulation() {
  cartItems.value = INITIAL_ITEMS.map((item) => ({ ...item }))
  lastDeletedName.value = ''
  restoredForInspection.value = false
  checkoutMessage.value = ''
}

watch(
  () => props.resetTrigger,
  () => {
    resetSimulation()
  }
)

// Pastikan item kembali terlihat saat Mode Tandai Elemen diaktifkan jika sempat terhapus di Mode 1
watch(
  () => props.isFlagMode,
  (flagActive) => {
    if (flagActive && cartItems.value.length < INITIAL_ITEMS.length) {
      cartItems.value = INITIAL_ITEMS.map((item) => ({ ...item }))
      restoredForInspection.value = true
      checkoutMessage.value = ''
    } else if (!flagActive) {
      restoredForInspection.value = false
    }
  }
)

const totalItemsCount = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.qty, 0)
)

const totalPrice = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.price * item.qty, 0)
)

function formatRupiah(amount) {
  return `Rp${amount.toLocaleString('id-ID')}`
}

function updateQty(itemId, delta) {
  if (props.isFlagMode) return
  checkoutMessage.value = ''
  const target = cartItems.value.find((item) => item.id === itemId)
  if (!target) return
  const nextQty = target.qty + delta
  if (nextQty >= 1 && nextQty <= 20) {
    target.qty = nextQty
  }
}

/**
 * CACAT DESAIN INTI (#05 Error Prevention):
 * Menghapus item langsung secara permanen tanpa modal konfirmasi atau tombol Undo.
 */
function handleDeleteItem(itemId, event) {
  if (props.isFlagMode) {
    handleFlagClick('delete-item-btn', 'Tombol "Hapus Item" (Hapus Permanen Tanpa Konfirmasi)', event)
    return
  }

  checkoutMessage.value = ''
  const target = cartItems.value.find((item) => item.id === itemId)
  if (!target) return
  lastDeletedName.value = target.name
  cartItems.value = cartItems.value.filter((item) => item.id !== itemId)
}

function handleCheckoutClick(event) {
  if (props.isFlagMode) {
    handleFlagClick('checkout-submit-btn', 'Tombol "Lanjut ke Pembayaran"', event)
    return
  }

  if (cartItems.value.length === 0) {
    checkoutMessage.value = 'Keranjang kosong. Tekan Reset Simulasi untuk memulihkan produk.'
    return
  }
  checkoutMessage.value = `Simulasi ringkasan siap dibayar: ${totalItemsCount.value} barang (${formatRupiah(totalPrice.value)}).`
}

function handleFlagClick(elementId, elementLabel, event) {
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
    <!-- Header Simulasi Mini E-Commerce -->
    <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E4E7] pb-4">
      <div class="flex items-center gap-2.5">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E4E4E7] bg-[#F4F4F5] text-[#18181B]">
          <ShoppingBag class="h-4 w-4" :stroke-width="1.75" />
        </span>
        <div>
          <h3 class="text-sm font-semibold text-[#18181B]">Keranjang Belanja</h3>
          <p class="text-xs text-[#71717A]">Toko Perangkat Kerja Minimalis</p>
        </div>
      </div>

      <span class="font-mono-tabular rounded-md border border-[#E4E4E7] bg-[#F4F4F5] px-2.5 py-1 text-xs font-medium text-[#18181B]">
        {{ totalItemsCount }} Item
      </span>
    </div>

    <!-- Pemberitahuan saat item terhapus pada Mode 1 -->
    <div
      v-if="lastDeletedName && !isFlagMode"
      class="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-red-200 bg-red-50/70 px-3.5 py-2.5 text-xs text-red-900"
    >
      <span>
        <strong>{{ lastDeletedName }}</strong> langsung terhapus permanen tanpa konfirmasi atau tombol batal.
      </span>
      <button
        type="button"
        class="inline-flex items-center gap-1 font-medium underline underline-offset-2"
        @click="resetSimulation"
      >
        <RotateCcw class="h-3 w-3" :stroke-width="1.75" />
        Pulihkan Item
      </button>
    </div>

    <!-- Catatan pemulihan otomatis saat masuk Mode 2 -->
    <div
      v-if="restoredForInspection && isFlagMode"
      class="mt-4 rounded-lg border border-[#E4E4E7] bg-[#F4F4F5] px-3.5 py-2 text-xs text-[#71717A]"
    >
      Produk dipulihkan otomatis ke tampilan inspeksi agar tombol <strong class="text-[#18181B]">Hapus Item</strong> dapat ditandai.
    </div>

    <!-- Daftar Produk -->
    <div class="mt-4 space-y-3">
      <div
        v-if="cartItems.length === 0"
        class="rounded-lg border border-dashed border-[#E4E4E7] bg-[#FAFAFA] px-4 py-8 text-center"
      >
        <p class="text-sm font-medium text-[#18181B]">Keranjang belanja Anda kosong</p>
        <p class="mt-1 text-xs text-[#71717A]">
          Klik "Reset Simulasi" di atas untuk mengulang skenario atau pindah ke Mode Tandai Elemen.
        </p>
      </div>

      <div
        v-for="(item, idx) in cartItems"
        :key="item.id"
        class="flex flex-col gap-3 rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex items-start gap-3">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#E4E4E7] bg-white text-xs font-medium text-[#71717A]">
            0{{ idx + 1 }}
          </div>
          <div>
            <p class="text-sm font-semibold text-[#18181B]">{{ item.name }}</p>
            <p class="text-xs text-[#71717A]">{{ item.variant }}</p>
            <p class="font-mono-tabular mt-1 text-sm font-medium text-[#18181B]">
              {{ formatRupiah(item.price) }}
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
          <!-- Pengatur Jumlah Barang (Dapat ditandai sebagai pengecoh) -->
          <div
            class="inline-flex items-center rounded-lg border border-[#E4E4E7] bg-white p-0.5 transition-shadow"
            :class="flagRingClass('qty-stepper')"
            @click="isFlagMode && handleFlagClick('qty-stepper', 'Pengatur Jumlah Barang (- / +)', $event)"
          >
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center rounded-md text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B]"
              :class="{ 'pointer-events-none': isFlagMode }"
              aria-label="Kurangi jumlah"
              @click.stop="updateQty(item.id, -1)"
            >
              <Minus class="h-3.5 w-3.5" :stroke-width="1.75" />
            </button>
            <span class="font-mono-tabular w-8 text-center text-xs font-semibold text-[#18181B]">
              {{ item.qty }}
            </span>
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center rounded-md text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B]"
              :class="{ 'pointer-events-none': isFlagMode }"
              aria-label="Tambah jumlah"
              @click.stop="updateQty(item.id, 1)"
            >
              <Plus class="h-3.5 w-3.5" :stroke-width="1.75" />
            </button>
          </div>

          <!-- Tombol Hapus Item (Target Cacat Desain Utama) -->
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E4E7] bg-white px-3 py-1.5 text-xs font-medium text-[#18181B] transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700"
            :class="idx === 0 ? flagRingClass('delete-item-btn') : flagRingClass('delete-item-btn')"
            @click="handleDeleteItem(item.id, $event)"
          >
            <Trash2 class="h-3.5 w-3.5" :stroke-width="1.75" />
            <span>Hapus Item</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Ringkasan Total & Checkout -->
    <div class="mt-5 flex flex-col gap-3 border-t border-[#E4E4E7] pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div
        class="rounded-lg border border-transparent px-2 py-1 transition-shadow"
        :class="flagRingClass('cart-total-box')"
        @click="isFlagMode && handleFlagClick('cart-total-box', 'Ringkasan Total Harga Belanja', $event)"
      >
        <p class="text-xs text-[#71717A]">Total Harga ({{ totalItemsCount }} barang)</p>
        <p class="font-mono-tabular text-lg font-semibold text-[#18181B]">
          {{ formatRupiah(totalPrice) }}
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 rounded-lg border border-[#18181B] bg-[#18181B] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-zinc-800"
        :class="flagRingClass('checkout-submit-btn')"
        @click="handleCheckoutClick($event)"
      >
        <span>Lanjut ke Pembayaran</span>
        <ArrowRight class="h-4 w-4" :stroke-width="1.75" />
      </button>
    </div>

    <p v-if="checkoutMessage && !isFlagMode" class="mt-3 text-xs text-[#71717A]">
      {{ checkoutMessage }}
    </p>
  </div>
</template>
