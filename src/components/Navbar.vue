<template>
  <nav class="bg-white shadow-md fixed top-0 left-0 w-full z-50">
    <div class="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
      <!-- Logo / Brand -->
      <div class="flex items-center space-x-2">
        <span class="text-2xl font-bold text-blue-600">📨 E-Lamaran</span>
      </div>

      <!-- Menu Desktop -->
      <ul class="hidden md:flex space-x-8 text-gray-700 font-medium">
        <li><a href="#" class="hover:text-blue-600 transition">Beranda</a></li>
        <li><a href="#" class="hover:text-blue-600 transition">Monitor Lamaran</a></li>
      </ul>

      <!-- Tombol CTA + Login Desktop -->
      <div class="hidden md:flex items-center space-x-4">
        <template v-if="!isLoggedIn">
          <button
            @click="showLogin = true"
            class="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition"
          >
            Login
          </button>
        </template>
        <template v-else>
          <button
            @click="handleLogout"
            class="text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </template>

        <a
          href="#"
          class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          📤 Kirim Sekarang
        </a>
      </div>
      

      <!-- Tombol Mobile -->
      <div class="md:hidden">
        <button @click="toggleMenu" class="text-3xl focus:outline-none">
          ☰
        </button>
      </div>
    </div>

    <!-- Menu Mobile -->
    <div v-if="menuOpen" class="md:hidden bg-white border-t">
      <ul class="flex flex-col py-3 space-y-3 text-center text-gray-700 font-medium">
        <li><a href="#" class="hover:text-blue-600">Beranda</a></li>
        <li><a href="#" class="hover:text-blue-600">Monitor Lamaran</a></li>
      </ul>

      <!-- Tombol Login/Logout Mobile -->
      <div class="flex flex-col items-center space-y-3 pb-4">
        <template v-if="!isLoggedIn">
          <button
            @click="showLogin = true"
            class="w-11/12 text-center text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition"
          >
            🔐 Login
          </button>
        </template>
        <template v-else>
          <button
            @click="handleLogout"
            class="w-11/12 text-center text-white bg-red-600 px-4 py-2 rounded-lg transition hover:bg-red-700"
          >
            🚪 Logout
          </button>
        </template>

        <a
          href="#"
          class="w-11/12 text-center bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          📤 Kirim Sekarang
        </a>
      </div>
    </div>

    <!-- 🌐 Bar Media Sosial -->
    <div class="bg-blue-50 border-t border-blue-100">
      <div class="max-w-7xl mx-auto flex justify-center space-x-6 py-2">
  <a href="#" class="text-gray-600 hover:text-pink-600 text-xl transition">
    <i class="fab fa-instagram"></i>
  </a>
  <a href="#" class="text-gray-600 hover:text-blue-700 text-xl transition">
    <i class="fab fa-linkedin"></i>
  </a>
  <a href="#" class="text-gray-600 hover:text-blue-500 text-xl transition">
    <i class="fab fa-facebook"></i>
  </a>
  <a href="#" class="text-gray-600 hover:text-black text-xl transition">
    <i class="fab fa-tiktok"></i>
  </a>
</div>

    </div>
  </nav>

  <!-- 📦 Modal Login -->
  <LoginModal
    :show="showLogin"
    @close="showLogin = false"
    @loginSuccess="checkLoginStatus"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import LoginModal from "../pages/LoginModal.vue";
import Swal from "sweetalert2";


const menuOpen = ref(false);
const showLogin = ref(false);
const isLoggedIn = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const checkLoginStatus = () => {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  isLoggedIn.value = !!user && !!token;
};

const handleLogout = () => {
  Swal.fire({
    title: "Yakin ingin logout?",
    text: "Anda akan keluar dari akun ini.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, logout!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Hapus session / localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      isLoggedIn.value = false;

      Swal.fire({
        title: "Berhasil!",
        text: "Anda telah logout.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload();
      });
    }
  });
};


onMounted(() => {
  checkLoginStatus();
});
</script>

<style scoped>
body {
  padding-top: 80px;
}
</style>

