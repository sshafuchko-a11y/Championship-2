import axios from 'axios'

const API_BASE_URL = 'https://chemp2026.hafn.ru'
const CLIENT_ID = 'YOUR_CLIENT_ID' // ← ЗАМЕНИТЕ НА РЕАЛЬНЫЙ!

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'ClientId': CLIENT_ID,
    'Content-Type': 'application/json'
  }
})

// Добавляем токен к авторизованным запросам
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Обработка ошибок
const parseError = (err) => {
  const res = err.response
  if (!res) throw err

  const data = res.data
  if (res.status === 422 && data?.error?.errors) {
    throw { status: 422, errors: data.error.errors }
  } else if (data?.error?.message) {
    throw { status: res.status, message: data.error.message }
  } else if (data?.message) {
    throw { status: res.status, message: data.message }
  } else {
    throw { status: res.status, message: 'Неизвестная ошибка' }
  }
}

// === Аутентификация ===
export const registerUser = async (data) => {
  try {
    const res = await api.post('/registration', data)
    return res.data.data
  } catch (err) {
    parseError(err)
  }
}

export const loginUser = async (data) => {
  try {
    const res = await api.post('/authorization', data)
    return res.data.data
  } catch (err) {
    parseError(err)
  }
}

export const logoutUser = async () => {
  try {
    await api.get('/logout')
  } catch (err) {
    parseError(err)
  }
}

// === Файлы ===
export const uploadFiles = async (files) => {
  const formData = new FormData()
  files.forEach(f => formData.append('files[]', f))

  try {
    const res = await api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data.data
  } catch (err) {
    parseError(err)
  }
}

export const getMyFiles = async () => {
  const res = await api.get('/files/my')
  return res.data.data
}

export const getSharedFiles = async () => {
  const res = await api.get('/files/shared')
  return res.data.data
}

export const renameFile = async (id, name) => {
  const res = await api.patch(`/files/${id}`, { name })
  return res.data.data
}

export const deleteFile = async (id) => {
  await api.delete(`/files/${id}`)
}

export const downloadFile = async (id) => {
  const res = await api.get(`/files/${id}/download`, {
    responseType: 'blob'
  })
  return res
}

// === Права доступа ===
export const getFilePermissions = async (id) => {
  const res = await api.get(`/files/${id}/permissions`)
  return res.data.data
}

export const addPermission = async (id, email) => {
  const res = await api.post(`/files/${id}/permissions`, { email })
  return res.data.data
}

export const removePermission = async (fileId, userId) => {
  await api.delete(`/files/${fileId}/permissions/${userId}`)
}