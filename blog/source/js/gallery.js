(() => {
  const missing = document.querySelector('.gallery-missing')
  if (missing) {
    const folder = new URLSearchParams(location.search).get('folder')
    if (folder) {
      const link = Array.from(document.querySelectorAll('[data-folder]'))
        .find(album => album.dataset.folder === folder)
      if (link) location.replace(link.href)
      else missing.hidden = false
    }
    return
  }

  const viewer = document.querySelector('.photo-viewer')
  if (!viewer || typeof viewer.showModal !== 'function') return

  const prints = Array.from(document.querySelectorAll('.photo-print'))
  const image = viewer.querySelector('.viewer-image')
  const counter = viewer.querySelector('.viewer-count')
  const original = viewer.querySelector('.viewer-original')
  const previous = viewer.querySelector('.viewer-prev')
  const next = viewer.querySelector('.viewer-next')
  let current = 0

  function show(index) {
    current = (index + prints.length) % prints.length
    const print = prints[current]
    image.src = print.href
    image.alt = print.querySelector('img').alt
    counter.textContent = (current + 1) + ' / ' + prints.length
    original.href = print.dataset.original
  }

  document.querySelector('.photo-grid').addEventListener('click', event => {
    const print = event.target.closest('.photo-print')
    if (!print || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    show(prints.indexOf(print))
    viewer.showModal()
  })

  previous.hidden = next.hidden = prints.length < 2
  previous.addEventListener('click', () => show(current - 1))
  next.addEventListener('click', () => show(current + 1))
  viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close())
  viewer.addEventListener('click', event => {
    if (event.target === viewer) viewer.close()
  })
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      show(current + (event.key === 'ArrowLeft' ? -1 : 1))
    }
  })
})()
