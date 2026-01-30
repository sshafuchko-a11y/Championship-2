<template>
  <div class="container">
    <div class="card">
      <h1 class="card-title">Мои файлы</h1>
      <div v-if="loading">Загрузка...</div>
      <div v-else-if="files.length === 0">Нет файлов</div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>Имя</th>
            <th>Размер</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="f in files" :key="f.id">
            <td>{{ f.name }}</td>
            <td>{{ (f.size / 1024).toFixed(1) }} КБ</td>
            <td>{{ new Date(f.created_at).toLocaleDateString() }}</td>
            <td>
              <button @click="download(f.id)" class="btn btn-sm">Скачать</button>
              <RouterLink :to="`/edit/${f.id}`" class="btn btn-sm">Переименовать</RouterLink>
              <RouterLink :to="`/permissions/${f.id}`" class="btn btn-sm">Права</RouterLink>
              <button @click="remove(f.id)" class="btn btn-sm btn-danger">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMyFiles, downloadFile, deleteFile } from '@/api/client'

const files = ref([])
const loading = ref(false)

const loadFiles = async () => {
  loading.value = true
  try {
    const data = await getMyFiles()
    files.value = data.files
  } finally {
    loading.value = false
  }
}

const download = async (id) => {
  const res = await downloadFile(id)
  const url = window.URL.createObjectURL(res.data)
  const a = document.createElement('a')
  a.href = url
  a.download = res.headers['content-disposition']?.split('filename=')[1]?.replace(/"/g, '') || 'file'
  a.click()
  window.URL.revokeObjectURL(url)
}

const remove = async (id) => {
  if (confirm('Удалить файл?')) {
    await deleteFile(id)
    loadFiles()
  }
}

onMounted(loadFiles)
</script>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th, .table td {
  padding: 8px;
  border: 1px solid #ddd;
}
.btn-sm {
  font-size: 0.85rem;
  padding: 4px 8px;
  margin: 2px;
}
.btn-danger {
  background: #e74c3c;
}
</style>