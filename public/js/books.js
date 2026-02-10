async function init() {
  const user = await getMe()
  if (!user) return window.location.href = '/login.html'

  document.getElementById('userInfo').innerText = user.email + ' (' + user.role + ')'

  if (user.role === 'admin') {
    document.getElementById('adminBlock').innerHTML = `
      <h3>add book (admin)</h3>
      <input id="title" placeholder="title" />
      <input id="author" placeholder="author" />
      <input id="price" type="number" step="0.01" placeholder="price" />
      <input id="image" type="file" accept="image/*" />
      <textarea id="description" placeholder="description"></textarea>
      <input id="genre" placeholder="genre (optional)" />
      <input id="year" type="number" placeholder="year (optional)" />
      <button id="createBtn">create</button>
      <hr />
    `
  }

  loadBooks()
}

async function loadBooks() {
  const res = await fetch('/api/books')
  const books = await res.json()

  const el = document.getElementById('books')
  el.innerHTML = ''

  books.forEach(b => {
    el.innerHTML += `
      <div class="book">
        <h3>${b.title}</h3>
        <p>${b.author} — $${b.price}</p>
        <a href="/book.html?id=${b._id}">view</a>
      </div>
    `
  })
}

async function createBook() {
  const token = getToken()
  if (!token) {
    alert('please login first')
    window.location.href = '/login.html'
    return
  }

  const file = document.getElementById('image').files[0]
  if (!file) {
    alert('please choose an image')
    return
  }

  const formData = new FormData()
  formData.append('title', document.getElementById('title').value.trim())
  formData.append('author', document.getElementById('author').value.trim())
  formData.append('price', document.getElementById('price').value)
  formData.append('description', document.getElementById('description').value.trim())

  const genreVal = document.getElementById('genre').value.trim()
  const yearVal = document.getElementById('year').value.trim()

  if (genreVal) formData.append('genre', genreVal)
  if (yearVal) formData.append('year', yearVal)

  formData.append('image', file)

  const res = await fetch('/api/books', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  })

  const data = await res.json()
  if (!res.ok) {
    alert(data.message || 'cannot create book')
    return
  }

  document.getElementById('title').value = ''
  document.getElementById('author').value = ''
  document.getElementById('price').value = ''
  document.getElementById('description').value = ''
  document.getElementById('genre').value = ''
  document.getElementById('year').value = ''
  document.getElementById('image').value = ''

  alert('book created')
  loadBooks()
}


init()
