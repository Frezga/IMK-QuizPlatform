<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/common/Navbar.vue'
import GuestLoginModal from '@/components/common/GuestLoginModal.vue'
import { useGameSession } from '@/composables/useGameSession'

const route = useRoute()
const { initSession } = useGameSession()

const showTopNavbar = computed(() => route.name !== 'arena')

onMounted(() => {
  initSession()
})
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA] text-[#18181B]">
    <Navbar v-if="showTopNavbar" />
    <main>
      <RouterView />
    </main>
    <GuestLoginModal />
  </div>
</template>
