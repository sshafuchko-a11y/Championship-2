<template>
  <div class="container">
    <div class="card">
      <h1 class="card-title">Права доступа</h1>
      <div v-if="loading">Загрузка...</div>

      <!-- Список пользователей -->
      <div v-else>
        <h3>Текущие пользователи:</h3>
        <ul v-if="permissions.length">
          <li v-for="p in permissions" :key="p.user_id">
            {{ p.full_name }} ({{ p.email }})
            <button @click="removePerm(p.user_id)" class="btn btn-sm btn-danger ml-10">Удалить</button>
          </li>
        </ul>
        <p v-else>Нет пользователей с доступом</p>

        <!-- Добавление -->
        <form @submit.prevent="addUser" class="mt-20">
          <div class="form-group">
            <label class="form-label">Email пользователя</label>
            <input v-model="emailToAdd" type="email" class="form-input" placeholder="user@example.com" required />
          </div>
          <button type="submit" class="btn btn-primary btn-full" :disabled="adding">
            {{ adding ? 'Добавление...' : 'Добавить доступ' }}
          </button>
        </form>
      </div>

      <RouterLink to="/my-files" class="btn btn-secondary btn-full mt-20">Назад</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getFilePermissions, addPermission, removePermission } from '@/api/client'

const route = useRoute()
const router = useRouter()
const permissions = ref([])
const loading = ref(false)
const emailToAdd = ref('')
const adding = ref(false)

const loadPermissions = async () => {
  loading.value = true
  try {
    const data = await getFilePermissions(route.params.id)
    permissions.value = data.permissions
  } finally {
    loading.value = false
  }
}

const addUser = async () => {
  adding.value = true
  try {
    await addPermission(route.params.id, emailToAdd.value)
    emailToAdd.value = ''
    loadPermissions()
  } catch (err) {
    alert(err.message || 'Ошибка добавления')
  } finally {
    adding.value = false
  }
}

const removePerm = async (userId) => {
  if (confirm('Удалить доступ у пользователя?')) {
    await removePermission(route.params.id, userId)
    loadPermissions()
  }
}

onMounted(loadPermissions)
</script>

<style scoped>
.ml-10 {
  margin-left: 10px;
}
.mt-20 {
  margin-top: 20px;
}
.btn-sm {
  font-size: 0.8rem;
  padding: 3px 6px;
}
</style>