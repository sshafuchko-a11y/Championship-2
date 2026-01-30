<template>
  <div class="container">
    <div class="card">
      <h1 class="card-title">Загрузка файлов</h1>
      <div v-if="message" :class="['message', message.type]">{{ message.text }}</div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label">Выберите файлы (до 1 МБ каждый)</label>
          <input type="file" multiple @change="onFileChange" class="form-input" />
          <div v-if="fileError" class="form-error">{{ fileError }}</div>
        </div>

        <button type="submit" class="btn btn-primary btn-full" :disabled="loading || !selectedFiles.length">
          {{ loading ? 'Загрузка...' : 'Загрузить' }}
        </button>
      </form>

      <div v-if="uploadedFiles.length" class="mt-20">
        <h3>Загружено:</h3>
        <ul>
          <li v-for="f in uploadedFiles" :key="f.id">
            {{ f.name }} ({{ (f.size / 1024).toFixed(1) }} КБ)
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { uploadFiles } from '@/api/client'

const selectedFiles = ref([])
const uploadedFiles = ref([])
const fileError = ref('')
const message = ref(null)
const loading = ref(false)

const onFileChange = (e) => {
  const files = Array.from(e.target.files)
  fileError.value = ''
  for (const file of files) {
    if (file.size > 1_000_000) {
      fileError.value = 'Файл ' + file.name + ' больше 1 МБ!'
      selectedFiles.value = []
      return
    }
  }
  selectedFiles.value = files
}

const handleSubmit = async () => {
  if (!selectedFiles.value.length) return

  loading.value = true
  message.value = null

  try {
    const data = await uploadFiles(selectedFiles.value)
    uploadedFiles.value = data.files
    message.value = { text: 'Файлы загружены!', type: 'success' }
    selectedFiles.value = []
  } catch (err) {
    message.value = { text: err.message || 'Ошибка загрузки', type: 'error' }
  } finally {
    loading.value = false
  }
}
</script>