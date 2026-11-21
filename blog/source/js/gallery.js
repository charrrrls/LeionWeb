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

  const library = document.querySelector('.album-detail')
  if (!library) return
  const density = library.querySelector('.density-switch')
  if (density) {
    density.hidden = false
    density.addEventListener('click', event => {
      const choice = event.target.closest('button')
      if (!choice) return
      library.dataset.density = choice.dataset.density
      for (const button of density.children) button.setAttribute('aria-pressed', String(button === choice))
    })
  }
  const viewer = library.querySelector('.photo-viewer')
  if (!viewer || typeof viewer.showModal !== 'function') return

  const prints = Array.from(document.querySelectorAll('.photo-print'))
  const image = viewer.querySelector('.viewer-image')
  const counter = viewer.querySelector('.viewer-count')
  const original = viewer.querySelector('.viewer-original')
  const previous = viewer.querySelector('.viewer-prev')
  const next = viewer.querySelector('.viewer-next')
  const stage = viewer.querySelector('.viewer-stage')
  let current = 0
  let pendingImage
  let drag

  function show(index) {
    current = (index + prints.length) % prints.length
    const print = prints[current]
    const thumbnail = print.querySelector('img')
    image.alt = thumbnail.alt
    image.src = thumbnail.currentSrc || thumbnail.src
    pendingImage = null
    if (image.src !== print.href) {
      const large = new Image()
      pendingImage = large
      large.onload = () => { if (pendingImage === large) image.src = large.src }
      large.src = print.href
    }
    counter.textContent = (current + 1) + ' / ' + prints.length
    original.href = print.dataset.original
  }

  library.addEventListener('click', event => {
    const print = event.target.closest('.photo-print')
    if (!print || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    print.focus({ preventScroll: true })
    show(prints.indexOf(print))
    viewer.showModal()
  })

  previous.hidden = next.hidden = prints.length < 2
  previous.addEventListener('click', () => show(current - 1))
  next.addEventListener('click', () => show(current + 1))
  viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close())
  viewer.addEventListener('close', () => {
    pendingImage = null
    image.removeAttribute('src')
    resetDrag()
  })
  viewer.addEventListener('click', event => {
    if (event.target === viewer) viewer.close()
  })
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      show(current + (event.key === 'ArrowLeft' ? -1 : 1))
    }
  })

  function resetDrag() {
    drag = null
    image.style.transform = ''
  }
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' || prints.length < 2) return
    if (!event.isPrimary) return resetDrag()
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY }
  })
  stage.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return
    const dx = event.clientX - drag.x
    const dy = event.clientY - drag.y
    if (Math.abs(dx) + Math.abs(dy) < 10) return
    if (Math.abs(dy) > Math.abs(dx)) return resetDrag()
    stage.setPointerCapture(event.pointerId)
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) image.style.transform = 'translateX(' + dx + 'px)'
  })
  stage.addEventListener('pointerup', event => {
    if (!drag || event.pointerId !== drag.id) return
    const dx = event.clientX - drag.x
    if (Math.abs(dx) > Math.max(42, stage.clientWidth * .12) && Math.abs(dx) > Math.abs(event.clientY - drag.y)) {
      show(current + (dx < 0 ? 1 : -1))
    }
    resetDrag()
  })
  stage.addEventListener('pointercancel', resetDrag)
})()
