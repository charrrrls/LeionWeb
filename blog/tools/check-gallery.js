// Run after the bilingual build: node tools/check-gallery.js
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { readCatalog } = require('../gallery/catalog')

const output = path.resolve(process.argv[2] || path.join(__dirname, '../public'))
const albums = readCatalog().albums.filter(album => album.photos.length)
for (const language of ['', 'en/']) {
  const root = path.join(output, language, 'gallery')
  const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
  const legacy = fs.readFileSync(path.join(root, 'view/index.html'), 'utf8')
  const script = ' src="/' + language + 'js/gallery.js"'
  assert.ok(legacy.includes(script), 'Old album links must run the local resolver')
  for (const album of albums) {
    const route = '/' + language + 'gallery/' + album.slug + '/'
    assert.ok(index.includes('href="' + route + '"'), 'Missing album link: ' + route)
    const detail = fs.readFileSync(path.join(root, album.slug, 'index.html'), 'utf8')
    assert.equal((detail.match(/class="photo-print"/g) || []).length, album.photos.length)
    assert.ok(detail.includes(script), 'The image filter must preserve the lightbox script')
    assert.ok(detail.includes('class="motion-toggle control"') && detail.includes('class="photo-viewer"'))
    assert.ok(!detail.includes('id="page-header"') && !detail.includes('id="footer"'), 'Album chrome must not take space on the photo wall')
    for (const columns of [2, 3, 4]) {
      assert.equal(detail.split('--y' + columns + ':').length - 1, album.photos.length, 'Each tile needs a masonry position before images load')
    }
    if (album.photos.length > 5) assert.ok(detail.includes('<template><picture>') && detail.includes('<noscript><img'), 'Offscreen photos need deferred and script-free thumbnails')
    for (const photo of album.photos) {
      const asset = '/gallery/media/' + photo.sha + '.webp'
      const preview = asset.replace('/media/', '/thumbs/')
      assert.ok(detail.includes(' src="' + preview + '"'), 'Missing wall thumbnail: ' + preview)
      assert.ok(!detail.includes(' src="' + asset + '"'), 'The wall must request a large image only on opening')
      assert.ok(detail.includes('href="' + asset + '"'), 'Missing large photograph: ' + asset)
      assert.ok(fs.statSync(path.join(output, preview)).size > 0)
      assert.ok(fs.statSync(path.join(output, preview.replace('/thumbs/', '/thumbs/small/'))).size > 0)
      assert.ok(fs.statSync(path.join(output, asset)).size > 0, 'Missing local image: ' + asset)
    }
  }
  const random = fs.readFileSync(path.join(output, language, 'random-gallery/index.html'), 'utf8')
  const card = random.match(/<template id="wall-card">([\s\S]*?)<\/template>/)
  assert.ok(card && random.includes('<noscript>'))
  assert.match(card[1], /<img\b[^>]*loading="lazy"/)
  assert.doesNotMatch(card[1], /<img\b[^>]*\ssrc=/, 'Only a live draw may assign the wallpaper thumbnail')
  assert.ok(!random.includes('/random-gallery/thumbs/'), 'The random page must not ship a fixed image pool')
  assert.ok(random.includes(' src="/' + language + 'js/random-gallery.js"'))
  assert.ok(random.includes('https://leion.ssatop.top/' + language + 'random-gallery/'))
}
console.log('Verified both languages, live wallpaper templates, album thumbnails, original links, counts and viewers.')
