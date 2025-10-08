<template>
  <div class="min-h-screen p-4 md:p-6 bg-slate-50 font-sans">
    <!-- 🔝 Header -->
    <header class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h1 class="text-2xl font-semibold text-slate-800">
        📬 Monitor Lamaran
      </h1>

      <div class="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-3 w-full md:w-auto">
        <input
          v-model="q"
          @keyup.enter="fetchMessages"
          placeholder="Cari subject atau pengirim"
          class="px-3 py-2 rounded-md border bg-white flex-1 w-full md:w-auto"
        />
        <button
          @click="fetchMessages"
          class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition w-full md:w-auto"
        >
          🔄 Refresh
        </button>
      </div>
    </header>

    <!-- 📬 Daftar Pesan -->
    <main>
      <div class="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table class="w-full table-auto min-w-[600px]">
          <thead class="bg-slate-100">
            <tr class="text-left text-sm text-slate-600">
              <th class="px-4 py-3">#</th>
              <th class="px-4 py-3">Pengirim</th>
              <th class="px-4 py-3">Subject</th>
              <th class="px-4 py-3">Tanggal</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <!-- Loading -->
            <tr v-if="loading">
              <td colspan="6" class="px-4 py-6 text-center text-slate-500 animate-pulse">
                🔄 Memuat pesan dari Gmail...
              </td>
            </tr>

            <!-- Data Pesan -->
            <tr v-for="(m, i) in filteredMessages" :key="m.id"
              class="odd:bg-white even:bg-slate-50 hover:bg-slate-100 transition">
              <td class="px-4 py-3 text-sm">{{ i + 1 }}</td>
              <td class="px-4 py-3 text-sm truncate max-w-[20ch]">{{ m.from_email }}</td>
              <td class="px-4 py-3 text-sm truncate max-w-[40ch]">{{ m.subject }}</td>
              <td class="px-4 py-3 text-sm text-slate-600">{{ formatDate(m.received_at) }}</td>
              <td class="px-4 py-3 text-sm">
                <span :class="m.is_read ? 'text-green-600' : 'text-amber-600'" class="font-medium">
                  {{ m.is_read ? "Sudah dibaca" : "Belum dibaca" }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm flex gap-2 flex-wrap">
                <button
                  @click="openDetail(m)"
                  class="px-3 py-1 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition w-full sm:w-auto"
                >
                  📄 Lihat
                </button>
              </td>
            </tr>

            <!-- Jika kosong -->
            <tr v-if="!loading && filteredMessages.length === 0">
              <td colspan="6" class="px-4 py-6 text-center text-slate-500">
                📭 Tidak ada pesan ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- 📄 Modal Detail Pesan Gmail -->
    <div v-if="selected"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition">
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl sm:max-w-xl overflow-hidden transform transition-all scale-100 animate-fade-in">
        <!-- Header Modal -->
        <div class="flex justify-between items-start px-6 py-5 border-b bg-gradient-to-r from-blue-600 to-indigo-600">
          <div>
            <h2 class="text-xl font-semibold text-white mb-1">
              {{ selected.subject || "📬 (Tanpa Subjek)" }}
            </h2>
            <p class="text-sm text-blue-100">📧 {{ selected.from_email || "Tidak diketahui" }}</p>
            <p class="text-xs text-blue-200 mt-1">{{ formatDate(selected.received_at, true) }}</p>
          </div>
          <button
            @click="selected = null"
            class="px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition flex items-center gap-2"
          >
            ❌ <span class="hidden md:inline">Tutup</span>
          </button>
        </div>

        <!-- Konten Pesan -->
        <div class="px-6 py-6 bg-slate-50 text-slate-800 text-[15px] leading-relaxed max-h-[70vh] overflow-y-auto">
          <div class="bg-white rounded-xl shadow-inner p-5 border border-slate-200 whitespace-pre-line min-h-[200px]">
            {{ selected.body || "📭 Tidak ada isi pesan." }}
          </div>

          <!-- 📎 Lampiran -->
          <div v-if="selected.attachments && selected.attachments.length > 0" class="mt-6 overflow-x-auto">
            <h3 class="font-semibold text-slate-700 mb-3">📎 Lampiran:</h3>
            <ul class="space-y-2 min-w-[300px]">
              <li v-for="(file, idx) in selected.attachments" :key="idx"
                class="flex items-center justify-between bg-white p-3 rounded-lg border hover:shadow transition">
                <div class="flex items-center gap-3">
                  <span class="text-xl">📄</span>
                  <div>
                    <p class="font-medium text-slate-800">{{ file.filename }}</p>
                    <p class="text-sm text-slate-500">{{ file.mime_type }}</p>
                  </div>
                </div>
                <button
                  @click="downloadFile(file.url, file.filename)"
                  class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition flex items-center gap-2"
                >
                  ⬇️ Unduh
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Footer Modal -->
        <div class="px-6 py-4 border-t bg-slate-100 flex flex-col sm:flex-row justify-end gap-3">
          <button
            @click="selected = null"
            class="px-5 py-2.5 rounded-lg bg-slate-300 hover:bg-slate-400 text-slate-800 transition font-medium w-full sm:w-auto"
          >
            ✖ Tutup
          </button>
          <a
            v-if="selected.link"
            :href="selected.link"
            target="_blank"
            class="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition w-full sm:w-auto text-center"
          >
            📎 Buka di Gmail
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// 🔧 State
const messages = ref([]);
const loading = ref(false);
const q = ref("");
const selected = ref(null);
const API_URL = "http://localhost:8000/api/monitor/messages";

async function downloadFile(url, filename) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/pdf",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Gagal mengunduh: ${res.status} - ${text}`);
    }

    // ✅ Cek tipe konten
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/pdf")) {
      const text = await res.text();
      console.error("❌ Respons bukan PDF:", text);
      throw new Error("File yang diterima bukan PDF. Periksa backend.");
    }

    // ✅ Ambil blob PDF
    const blob = await res.blob();

    // ✅ Paksa nama file .pdf jika belum ada
    const finalName = filename?.endsWith(".pdf")
      ? filename
      : `${filename || "lampiran"}.pdf`;

    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = finalName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("❌ Unduh gagal:", error);
    alert("Gagal mengunduh file: " + error.message);
  }
}

// 📬 Ambil pesan Gmail dari backend
const fetchMessages = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token tidak ditemukan. Silakan login terlebih dahulu.");
      loading.value = false;
      return;
    }

    const res = await fetch(API_URL, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Gagal mengambil pesan: ${res.status} - ${errorText}`);
    }

    const json = await res.json();
    messages.value = json.data || [];

    console.log("📩 Data pesan:", messages.value); // 🔍 Debug data
  } catch (err) {
    console.error("❌", err);
    alert("Gagal memuat pesan: " + err.message);
  } finally {
    loading.value = false;
  }
};

// 🔎 Pencarian
const filteredMessages = computed(() => {
  return messages.value.filter(
    (m) =>
      m.from_email?.toLowerCase().includes(q.value.toLowerCase()) ||
      m.subject?.toLowerCase().includes(q.value.toLowerCase())
  );
});

// 📅 Format tanggal
function formatDate(dateStr, withTime = false) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return withTime ? d.toLocaleString() : d.toLocaleDateString();
}

// 📜 Buka detail pesan
function openDetail(m) {
  selected.value = m;
}

// 🚀 Ambil pesan saat halaman dibuka
onMounted(fetchMessages);
</script>

<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.animate-fade-in {
  animation: fadeIn 0.25s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
