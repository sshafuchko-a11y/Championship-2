<template>
  <div class="container">
    <div class="card">
      <h1 class="card-title">Вход</h1>
      <div v-if="message" :class="['message', message.type]">{{ message.text }}</div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group" :class="{ 'has-error': errors.email }">
          <label class="form-label" for="email">Email</label>
          <input v-model="form.email" type="email" id="email" class="form-input" placeholder="user@example.com" required />
          <div v-if="errors.email" class="form-error">{{ errors.email[0] }}</div>
        </div>

        <div class="form-group" :class="{ 'has-error': errors.password }">
          <label class="form-label" for="password">Пароль</label>
          <input v-model="form.password" type="password" id="password" class="form-input" placeholder="Pass123" required />
          <div v-if="errors.password" class="form-error">{{ errors.password[0] }}</div>
        </div>

        <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>
      </form>

      <div class="text-center mt-20">
        <span>Нет аккаунта? </span>
        <RouterLink to="/register" class="link">Зарегистрироваться</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '@/api/client'
import { useAuthStore } from '@/stores/auth'

const form = ref({ email: '', password: '' })
const errors = ref({})
const message = ref(null)
const loading = ref(false)
const router = useRouter()
const auth = useAuthStore()

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}
  message.value = null

  try {
    const data = await loginUser(form.value)
    auth.login(data.token, data.user)
    router.push('/my-files')
  } catch (err) {
    if (err.errors) {
      errors.value = err.errors
    } else {
      message.value = { text: err.message || 'Ошибка входа', type: 'error' }
    }
  } finally {
    loading.value = false
  }
}
</script>