<template>
  <header class="header">
    <div class="container">
      <h1>Файловое хранилище</h1>
      <nav>
        <RouterLink to="/my-files">Мои файлы</RouterLink>
        <RouterLink to="/shared-files">Доступные</RouterLink>
        <RouterLink to="/upload">Загрузить</RouterLink>
        <a v-if="auth.isLoggedIn" @click="handleLogout" style="cursor: pointer; color: #ddd; margin-left: 20px;">Выйти</a>
        <RouterLink v-else to="/login">Войти</RouterLink>
        <RouterLink v-else to="/register">Регистрация</RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.header {
  background: #333;
  color: white;
  padding: 12px 0;
}
.header .container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header nav a {
  color: #ddd;
  margin-left: 20px;
  text-decoration: none;
}
.header nav a:hover {
  color: white;
}
</style>