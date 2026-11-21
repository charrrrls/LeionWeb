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
    for (const photo of album.photos) {
      const asset = '/gallery/media/' + photo.sha + '.webp'
      assert.ok(detail.includes(' src="' + asset + '"'), 'Missing native image source: ' + asset)
      assert.ok(fs.statSync(path.join(output, asset)).size > 0, 'Missing local image: ' + asset)
    }
  }
}
console.log('Verified both languages, album links, photo counts, image files, and lightbox scripts.')
