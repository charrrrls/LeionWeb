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
  const prints = Array.from(library.querySelectorAll('.photo-print'))
  function reveal(print) {
    const template = print.querySelector('template')
    if (template) template.replaceWith(template.content)
  }
  if ('IntersectionObserver' in window) {
    const nearby = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        reveal(entry.target)
        nearby.unobserve(entry.target)
      }
    }, { rootMargin: '280px 0px' })
    for (const print of prints) if (print.querySelector('template')) nearby.observe(print)
  } else prints.forEach(reveal)

  const viewer = library.querySelector('.photo-viewer')
  const firstImage = prints[0].querySelector('img')
  const toggle = library.querySelector('.motion-toggle')
  const dock = toggle.parentElement
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  let playing = !motion.matches
  let frame = 0, lastTick = 0, position = 0, drawn = 0, end = 0

  function tick(now) {
    if (lastTick) position += Math.min(now - lastTick, 64) * .015
    lastTick = now
    const next = Math.min(end, Math.round(position * devicePixelRatio) / devicePixelRatio)
    if (next !== drawn) window.scrollTo(0, next)
    drawn = next
    if (position >= end) return pause()
    frame = requestAnimationFrame(tick)
  }
  function syncMotion() {
    cancelAnimationFrame(frame)
    lastTick = 0
    position = drawn = window.scrollY
    end = Math.max(0, document.scrollingElement.scrollHeight - document.documentElement.clientHeight)
    toggle.hidden = end < 1
    toggle.setAttribute('aria-pressed', String(playing))
    toggle.title = playing ? toggle.dataset.pause : toggle.dataset.play
    toggle.setAttribute('aria-label', toggle.title)
    const moving = playing && firstImage.complete && !toggle.hidden && !document.hidden && !viewer.open
    dock.toggleAttribute('data-moving', moving)
    if (moving) frame = requestAnimationFrame(tick)
  }
  function pause() {
    if (!playing) return
    playing = false
    syncMotion()
  }
  toggle.addEventListener('click', () => {
    playing = !playing
    if (playing && window.scrollY >= end - 1) window.scrollTo(0, 0)
    syncMotion()
  })
  window.addEventListener('wheel', pause, { passive: true })
  window.addEventListener('pointerdown', event => { if (!toggle.contains(event.target)) pause() }, { passive: true })
  window.addEventListener('scroll', () => { if (Math.abs(window.scrollY - drawn) > 2) pause() }, { passive: true })
  window.addEventListener('keydown', event => {
    if (event.key === 'Tab' || (event.target !== toggle && [' ', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(event.key))) pause()
  })
  motion.addEventListener('change', () => { if (motion.matches) pause() })
  document.addEventListener('visibilitychange', syncMotion)
  window.addEventListener('resize', syncMotion)
  window.addEventListener('pageshow', syncMotion)
  window.addEventListener('pagehide', () => cancelAnimationFrame(frame))
  firstImage.addEventListener('load', syncMotion, { once: true })
  firstImage.addEventListener('error', syncMotion, { once: true })
  syncMotion()
  if (!viewer || typeof viewer.showModal !== 'function') return

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
    reveal(print)
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
    pause()
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
