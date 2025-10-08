<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-blue-700 rounded-2xl shadow-2xl w-full max-w-md p-8 relative font-poppins"
      >
        <!-- Tombol Close -->
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-white hover:text-red-400 text-2xl"
        >
          ✖
        </button>

        <!-- Logo / Brand -->
        <div class="flex items-center justify-center mb-6">
          <span class="text-3xl font-extrabold text-white tracking-wide">
            📨 E-Lamaran
          </span>
        </div>

        <!-- Form Login -->
        <form @submit.prevent="handleLogin" class="space-y-5 text-white">
          <div>
            <label class="block font-semibold mb-1">Email</label>
            <input
              v-model.trim="email"
              type="email"
              placeholder="Masukkan email Anda"
              class="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label class="block font-semibold mb-1">Password</label>
            <input
              v-model.trim="password"
              type="password"
              placeholder="Masukkan password Anda"
              class="w-full bg-white text-black border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-[100px] bg-white text-blue-700 font-semibold py-2 rounded-lg transition transform hover:scale-105 hover:bg-gray-100 disabled:opacity-60"
          >
            {{ loading ? "Memproses..." : "Login" }}
          </button>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2"; // ✅ SweetAlert2

defineProps({
  show: Boolean,
});

const email = ref("");
const password = ref("");
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;

  try {
    const response = await axios.post("http://localhost:8000/login", {
      email: email.value,
      password: password.value,
    });

    console.log("RESPONS BACKEND:", response.data); // Debug untuk lihat format backend

    // Tangani login sukses
    if (response.data && (response.data.token || response.data.success)) {
      // Simpan token jika ada
      if (response.data.token) localStorage.setItem("token", response.data.token);
      // Simpan user jika ada
      if (response.data.user) localStorage.setItem("user", JSON.stringify(response.data.user));


      // SweetAlert sukses
      // SweetAlert sukses, pakai .then() untuk aksi setelah klik OK
  Swal.fire({
    icon: "success",
    title: "Login Berhasil!",
    text: response.data.message || "Selamat, Anda berhasil login!",
    confirmButtonText: "OK",
  }).then(() => {
    
    // Reload halaman setelah klik OK
    window.location.reload();
    // Tutup modal
    $emit("close");
  });
    } else {
      // Respons sukses tapi tidak lengkap
      Swal.fire({
        icon: "warning",
        title: "Login Tidak Lengkap",
        text: "Token atau data user tidak ditemukan.",
      });
    }
  } catch (error) {
    console.error("Login Error:", error);

    // Ambil pesan error dari backend
    const msg =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Periksa kembali kredensial Anda.";

    Swal.fire({
      icon: "error",
      title: "Login Gagal",
      text: msg,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
