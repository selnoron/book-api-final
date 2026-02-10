const params = new URLSearchParams(window.location.search)
const bookId = params.get('id')

async function loadBook() {
  const book = await fetch(`/api/books/${bookId}`).then(r => r.json())
  document.getElementById('book').innerHTML = `
    <h1>${book.title}</h1>
    <img src="${book.imageUrl}" width="200">
    <p>${book.description}</p>
    <p>$${book.price}</p>
  `
}

async function loadComments() {
  const comments = await fetch(`/api/books/${bookId}/comments`).then(r => r.json())
  const el = document.getElementById('comments')
  el.innerHTML = ''
  comments.forEach(c => {
    el.innerHTML += `<p><b>${c.userId.email}</b>: ${c.text}</p>`
  })
}

async function addComment() {
  const token = getToken()
  if (!token) return alert('login first')

  const res = await fetch(`/api/books/${bookId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ text: text.value })
  })

  if (!res.ok) return alert('error')
  text.value = ''
  loadComments()
}

loadBook()
loadComments()
