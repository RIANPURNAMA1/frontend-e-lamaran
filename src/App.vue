<template>
   <Navbar />
  <div>
    <!-- Cek token -->
    <div v-if="!token" class="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-700">
      <h1 class="text-2xl font-bold mb-4">⚠ Harus login terlebih dahulu</h1>
      <p class="mb-4">Silakan login untuk mengakses halaman ini.</p>
     
    </div>
    <!-- Render halaman jika token ada -->
    <div v-else>
      <Navbar />
      <Message />
      <MonitorLamaran />
    </div>
  </div>
  <Footer />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import Message from './Pages/Message.vue'
import MonitorLamaran from './Pages/MonitorLamaran.vue'

const token = ref(null)

// Cek token di localStorage saat mounted
onMounted(() => {
  token.value = localStorage.getItem('token')
})

const goLogin = () => {
  // arahkan ke halaman login
  window.location.href = '/login' 
}
</script>
