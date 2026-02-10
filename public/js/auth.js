const API = '/api'

function setToken(token) {
  localStorage.setItem('token', token)
}

function getToken() {
  return localStorage.getItem('token')
}

function logout() {
  localStorage.removeItem('token')
  window.location.href = '/login.html'
}

async function getMe() {
  const token = getToken()
  if (!token) return null

  const res = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (!res.ok) {
    logout()
    return null
  }

  const data = await res.json()
  return data.user
}
