import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import UploadView from '@/views/UploadView.vue'
import MyFilesView from '@/views/MyFilesView.vue'
import SharedFilesView from '@/views/SharedFilesView.vue'
import EditFileView from '@/views/EditFileView.vue'
import FilePermissionsView from '@/views/FilePermissionsView.vue'

const routes = [
  { path: '/', redirect: '/my-files' },
  { path: '/register', component: RegisterView },
  { path: '/login', component: LoginView },
  { path: '/upload', component: UploadView },
  { path: '/my-files', component: MyFilesView },
  { path: '/shared-files', component: SharedFilesView },
  { path: '/edit/:id', component: EditFileView, props: true },
  { path: '/permissions/:id', component: FilePermissionsView, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const publicPages = ['/register', '/login']
  const authRequired = !publicPages.includes(to.path)
  const { isLoggedIn } = await import('@/stores/auth').then(m => m.useAuthStore())

  if (authRequired && !isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router