(() => {
  const library = document.querySelector('.wall-library')
  if (!library) return
  const en = library.dataset.english === 'true'
  const template = library.querySelector('#wall-card')
  const grid = library.querySelector('#wall-results')
  const placeholders = library.querySelector('.wall-placeholders')
  const shuffle = library.querySelector('.wall-shuffle')
  const more = library.querySelector('.wall-more')
  const status = library.querySelector('.wall-status')
  const batch = 6
  let category = Math.random() < .5 ? 'pc' : 'fj'

  async function draw(replace) {
    if (shuffle.disabled) return
    shuffle.disabled = more.disabled = true
    grid.setAttribute('aria-busy', 'true')
    placeholders.hidden = grid.childElementCount > 0
    status.textContent = en ? 'Finding images…' : '正在抽取图片…'
    const request = new AbortController()
    const timeout = setTimeout(() => request.abort(), 9000)
    try {
      // Only the draw is uncached. Each thumbnail keeps its stable cacheable URL.
      const response = await fetch('https://t.alcy.cc/json?' + category + '=' + batch * 2, {
        signal: request.signal, cache: 'no-store'
      })
      if (!response.ok) throw new Error('Image source unavailable')
      const { data } = await response.json()
      if (!Array.isArray(data)) throw new Error('Missing image list')

      const seen = new Set([...grid.querySelectorAll('.wall-image')].map(link => link.href))
      const cards = document.createDocumentFragment()
      for (const item of data) {
        const original = item?.link
        if (typeof original !== 'string' || !/^https:\/\/t\.alcy\.cc\/pic\/(pc|fj)\/[^/?#]+\.(webp|jpe?g|png|avif)$/i.test(original) || seen.has(original)) continue
        seen.add(original)
        const card = template.content.firstElementChild.cloneNode(true)
        const image = card.querySelector('img')
        card.querySelector('.wall-source').href = card.querySelector('.wall-image').href = original
        const position = (replace ? 0 : grid.childElementCount) + cards.childElementCount + 1
        image.alt = en ? 'Wallpaper ' + position : '第 ' + position + ' 张壁纸'
        if (replace && !cards.childElementCount) {
          image.loading = 'eager'
          image.fetchPriority = 'high'
        }
        image.src = original + '?w=480'
        cards.append(card)
        if (cards.childElementCount === batch) break
      }
      if (!cards.childElementCount) throw new Error('No new images')
      if (replace) grid.replaceChildren(cards)
      else grid.append(cards)
      category = category === 'pc' ? 'fj' : 'pc'
      more.hidden = false
      status.textContent = ''
    } catch {
      status.textContent = en ? 'No new images this time. Try again.' : '这次没取到新图，可以再试一次。'
    } finally {
      clearTimeout(timeout)
      grid.setAttribute('aria-busy', 'false')
      placeholders.hidden = true
      shuffle.disabled = more.disabled = false
    }
  }

  shuffle.hidden = false
  shuffle.addEventListener('click', () => draw(true))
  more.addEventListener('click', () => draw(false))
  grid.addEventListener('error', event => {
    if (event.target.tagName !== 'IMG') return
    event.target.hidden = true
    event.target.nextElementSibling.hidden = false
  }, true)
  grid.addEventListener('click', async event => {
    const button = event.target.closest('.wall-copy')
    if (!button) return
    const url = button.closest('.wall-card').querySelector('.wall-image').href
    try {
      if (navigator.clipboard) await navigator.clipboard.writeText(url)
      else {
        const field = document.createElement('textarea')
        field.value = url
        library.append(field)
        field.select()
        const copied = document.execCommand('copy')
        field.remove()
        button.focus()
        if (!copied) throw new Error('Clipboard unavailable')
      }
      button.textContent = en ? 'Copied' : '已复制'
      setTimeout(() => { button.textContent = en ? 'Copy link' : '复制链接' }, 1600)
    } catch {
      status.textContent = en ? 'Use the image link to copy its address.' : '可以通过图片链接复制原图地址。'
    }
  })
  draw(true)
})()
