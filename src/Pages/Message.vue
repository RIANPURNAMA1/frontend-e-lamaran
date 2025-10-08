<template>
  <div
    class="min-h-screen bg-gray-100 flex justify-center items-start pt-[80px] font-sans"
  >
    <div class="container mx-auto px-6 py-10">
      <h1
        class="relative text-4xl font-extrabold text-blue-700 text-center mb-12 tracking-wide"
      >
        <span class="block text-5xl">📨 Kirim Lamaran / CV</span>
        <span
          class="block w-24 h-1 bg-blue-600 mx-auto mt-4 rounded-full"
        ></span>
        <span class="block text-sm text-gray-500 mt-2 font-medium">
          Lengkapi data dan kirim lamaran Anda secara profesional
        </span>
      </h1>

      <!-- Grid utama -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <!-- 📤 Form Kirim Email -->
        <div
          class="bg-white p-8 border border-gray-200 hover:shadow-xl transition"
        >
          <h2 class="text-2xl font-semibold mb-6 text-blue-600">
            📨 Form Lamaran
          </h2>
          <form
            @submit.prevent="checkLoginBeforeSend"
            class="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto space-y-6"
          >
            <h2 class="text-2xl font-bold text-gray-800 mb-6">
              📧 Kirim Email Lamaran
            </h2>

            <!-- Email Tujuan -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2"
                >📧 Email Perusahaan (Kepada)</label
              >
              <input
                v-model="to"
                type="email"
                required
                placeholder="contoh: hrd@perusahaan.com"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              <p class="text-xs text-gray-500 mt-1">
                * Masukkan email tujuan dengan benar
              </p>
            </div>

            <!-- Subjek -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2"
                >📌 Subjek</label
              >
              <input
                v-model="subject"
                type="text"
                required
                placeholder="Lamaran Kerja - Frontend Developer"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <!-- Upload CV -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2"
                >📄 Unggah CV (PDF)</label
              >
              <input
                type="file"
                accept="application/pdf"
                @change="handleFileUpload"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer transition"
              />
              <p class="text-xs text-gray-500 mt-1">* PDF maksimal 5MB</p>
            </div>

            <!-- Body Email -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2"
                >📝 Pesan (Body Email)</label
              >
              <textarea
                v-model="message"
                rows="8"
                placeholder="Tulis pesan lamaran Anda di sini..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition shadow-sm hover:shadow-md"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">
                * Anda dapat mengubah isi pesan sebelum mengirim
              </p>
            </div>

            <!-- Tombol Kirim -->
            <div class="flex justify-start mt-6">
              <button
                type="submit"
                :disabled="isLoading"
                class="px-10 py-3 w-[200px] bg-blue-600 text-white rounded-lg text-lg font-medium shadow-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span v-if="!isLoading">📤 Kirim Email</span>
                <span v-else class="flex items-center gap-2">
                  <svg
                    class="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                  Mengirim...
                </span>
              </button>
            </div>
          </form>
        </div>

        <!-- 📊 Status Email -->
        <div
          class="bg-white p-8 border border-gray-200 hover:shadow-xl transition"
        >
          <h2 class="text-2xl font-semibold mb-6 text-blue-600">
            📊 Status Pengiriman Email
          </h2>

          <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-200 rounded-lg text-sm">
              <thead class="bg-blue-600 text-white">
                <tr>
                  <th class="py-3 px-4 text-left">📧 Tujuan</th>
                  <th class="py-3 px-4 text-left">📌 Subjek</th>
                  <th class="py-3 px-4 text-left">📅 Tanggal</th>
                  <th class="py-3 px-4 text-center">📨 Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="email in emailStatusList"
                  :key="email.id"
                  class="border-b hover:bg-gray-50 transition"
                >
                  <td class="py-3 px-4">{{ email.to_email }}</td>
                  <td class="py-3 px-4">{{ email.subject }}</td>
                  <td class="py-3 px-4">
                    {{ new Date(email.created_at).toLocaleString() }}
                  </td>
                  <td class="py-3 px-4 text-center">
                    <span
                      :class="
                        email.status === 'Terkirim'
                          ? 'bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold'
                          : 'bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold'
                      "
                    >
                      {{ email.status }}
                    </span>
                  </td>
                </tr>
                <tr v-if="emailStatusList.length === 0">
                  <td colspan="4" class="text-center text-gray-500 py-6">
                    📭 Belum ada data pengiriman
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";

const to = ref("");
const subject = ref("Lamaran Pekerjaan");
const message = ref(
  "Dengan hormat,\n\nPerkenalkan, saya Rian Purnama merupakan lulusan S1 Teknik Informatika yang memiliki pengalaman magang selama 3 bulan di PT Griya Pratama sebagai Fullstack Developer. Bersama ini saya lampirkan CV sebagai bahan pertimbangan untuk posisi yang tersedia di perusahaan Anda.\n\nTerima kasih atas perhatian dan kesempatan yang diberikan.\n\nHormat saya,\n\nRian Purnama"
);
const file = ref(null);
const isLoading = ref(false);
const emailStatusList = ref([]);

// 📁 Upload file
const handleFileUpload = (e) => {
  file.value = e.target.files[0];
};

// 📊 Ambil data status email
const loadEmailStatus = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    const res = await fetch("http://localhost:8000/email-status", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    emailStatusList.value = data;
  } catch (err) {
    console.error("Gagal memuat status email:", err);
  }
};

// ✅ Cek login sebelum kirim
const checkLoginBeforeSend = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    Swal.fire({
      icon: "warning",
      title: "Login Diperlukan",
      text: "Silakan login terlebih dahulu untuk mengirim lamaran.",
      confirmButtonText: "OK",
    });
    return;
  }
  sendEmail(token);
};

// 📤 Kirim email + simpan ke DB
const sendEmail = async (token) => {
  isLoading.value = true;
  const formData = new FormData();
  formData.append("to", to.value);
  formData.append("subject", subject.value);
  formData.append("message", message.value);
  if (file.value) formData.append("file", file.value);

  try {
    const res = await fetch("http://localhost:8000/send-email", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const result = await res.json();

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "✅ Email Terkirim!",
        text: "Lamaran Anda berhasil dikirim.",
      });
      to.value = "";
      subject.value = "Lamaran Pekerjaan";
      file.value = null;
      await loadEmailStatus();
    } else {
      Swal.fire({
        icon: "error",
        title: "Gagal Mengirim",
        text: result.error || "Periksa kembali data Anda.",
      });
    }
  } catch {
    Swal.fire({
      icon: "error",
      title: "Kesalahan Jaringan",
      text: "Terjadi kesalahan jaringan. Silakan coba lagi.",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadEmailStatus);
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap");
body {
  font-family: "Poppins", sans-serif;
}
</style>
