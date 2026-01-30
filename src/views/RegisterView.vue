<template>
  <div class="container">
    <div class="card">
      <h1 class="card-title">Регистрация</h1>
      <div v-if="message" :class="['message', message.type]">{{ message.text }}</div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group" :class="{ 'has-error': errors.last_name }">
          <label class="form-label" for="lastName">Фамилия</label>
          <input v-model="form.last_name" type="text" id="lastName" class="form-input" placeholder="Иванов" required />
          <div v-if="errors.last_name" class="form-error">{{ errors.last_name[0] }}</div>
        </div>

        <div class="form-group" :class="{ 'has-error': errors.first_name }">
          <label class="form-label" for="firstName">Имя</label>
          <input v-model="form.first_name" type="text" id="firstName" class="form-input" placeholder="Иван" required />
          <div v-if="errors.first_name" class="form-error">{{ errors.first_name[0] }}</div>
        </div>

        <div class="form-group" :class="{ 'has-error': errors.patronymic }">
          <label class="form-label" for="patronymic">Отчество</label>
          <input v-model="form.patronymic" type="text" id="patronymic" class="form-input" placeholder="Иванович" required />
          <div v-if="errors.patronymic" class="form-error">{{ errors.patronymic[0] }}</div>
        </div>

        <div class="form-group" :class="{ 'has-error': errors.email }">
          <label class="form-label" for="email">Email</label>
          <input v-model="form.email" type="email" id="email" class="form-input" placeholder="user@example.com" required />
          <div v-if="errors.email" class="form-error">{{ errors.email[0] }}</div>
        </div>

        <div class="form-group" :class="{ 'has-error': errors.birth_date }">
          <label class="form-label" for="birthDate">Дата рождения</label>
          <input v-model="form.birth_date" type="date" id="birthDate" class="form-input" required />
          <div v-if="errors.birth_date" class="form-error">{{ errors.birth_date[0] }}</div>
        </div>

        <div class="form-group" :class="{ 'has-error': errors.password }">
          <label class="form-label" for="password">Пароль</label>
          <input v-model="form.password" type="password" id="password" class="form-input" placeholder="Pass123" required />
          <div v-if="errors.password" class="form-error">{{ errors.password[0] }}</div>
        </div>

        <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
      </form>

      <div class="text-center mt-20">
        <span>Уже есть аккаунт? </span>
        <RouterLink to="/login" class="link">Войти</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '@/api/client'

const form = ref({
  last_name: '',
  first_name: '',
  patronymic: '',
  email: '',
  birth_date: '',
  password: ''
})

const errors = ref({})
const message = ref(null)
const loading = ref(false)
const router = useRouter()

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}
  message.value = null

  try {
    await registerUser(form.value)
    message.value = { text: 'Регистрация успешна!', type: 'success' }
    setTimeout(() => router.push('/login'), 1500)
  } catch (err) {
    if (err.errors) {
      errors.value = err.errors
    } else {
      message.value = { text: err.message || 'Ошибка регистрации', type: 'error' }
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-group.has-error .form-input {
  border-color: #e74c3c;
}
.message.success {
  color: #27ae60;
  background: #e6f7ee;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 16px;
}
.message.error {
  color: #e74c3c;
  background: #fdf2f2;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 16px;
}
</style>