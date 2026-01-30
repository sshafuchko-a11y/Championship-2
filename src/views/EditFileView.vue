<template>
  <div class="container">
    <div class="card">
      <h1 class="card-title">Переименовать файл</h1>
      <div v-if="message" :class="['message', message.type]">{{ message.text }}</div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label">Новое имя</label>
          <input v-model="newName" type="text" class="form-input" required />
        </div>
        <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
          {{ loading ? 'Сохранение...' : 'Сохранить' }}
        </button>
        <RouterLink to="/my-files" class="btn btn-secondary btn-full mt-10">Отмена</RouterLink>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { renameFile } from '@/api/client'

const route = useRoute()
const router = useRouter()
const newName = ref('')
const loading = ref(false)
const message = ref(null)

onMounted(() => {
})

const handleSubmit = async () => {
  loading.value = true
  message.value = null

  try {
    await renameFile(route.params.id, newName.value)
    router.push('/my-files')
  } catch (err) {
    message.value = { text: err.message || 'Ошибка переименования', type: 'error' }
  } finally {
    loading.value = false
  }
}
</script>