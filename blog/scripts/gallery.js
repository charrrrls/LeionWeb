const fs = require('node:fs')
const sharp = require('sharp')
const { readCatalog, mediaPath } = require('../gallery/catalog')
const { albums: curatedAlbums } = require('../gallery/snapshot.json')

hexo.locals.set('photoGallery', readCatalog)

// Use the recorded dimensions so the masonry is in place before any image downloads.
function arrangeWall(album) {
  const opening = curatedAlbums.find(item => item.folder === album.folder)?.opening || [album.cover]
  const picks = opening.map(name => album.photos.find(photo => photo.file === name)).filter(Boolean)
  const tiles = Array.from(new Set([...picks, ...album.photos]), photo => ({
    photo, style: { 'aspect-ratio': photo.width + ' / ' + photo.height }, sizes: []
  }))
  const style = {}
  for (const count of [2, 3, 4]) {
    const gap = 0.025
    const columns = Math.min(count, tiles.length)
    const wallWidth = columns + (columns + 1) * gap
    const bottom = Array(columns).fill(gap)
    const tops = []
    for (const tile of tiles) {
      const { width, height } = tile.photo
      const top = Math.min(...bottom)
      const column = bottom.indexOf(top)
      const wide = width / height > 1.85 && columns > 2 && bottom[column + 1] === top
      const size = wide ? 2 + gap : 1
      const widthPercent = (100 * size / wallWidth).toFixed(4)
      tile.style['--x' + count] = (100 * (gap + column * (1 + gap)) / wallWidth).toFixed(4) + '%'
      tile.style['--w' + count] = widthPercent + '%'
      tile.sizes.unshift((count === 4 ? '(min-width: 1080px) ' : count === 3 ? '(min-width: 680px) ' : '') + widthPercent + 'vw')
      tops.push(top)
      bottom[column] = top + size * height / width + gap
      if (wide) bottom[column + 1] = bottom[column]
    }
    const wallHeight = Math.max(...bottom)
    style['--shape' + count] = wallWidth + ' / ' + wallHeight.toFixed(6)
    tiles.forEach((tile, i) => { tile.style['--y' + count] = (100 * tops[i] / wallHeight).toFixed(6) + '%' })
  }
  return { tiles, style }
}

hexo.extend.filter.register('template_locals', locals => {
  const { page, config, site } = locals
  if (page.type === 'gallery') {
    if (config.language === 'en' && page.title_en) page.title = page.title_en
    const canonical = page.random_gallery ? 'random-gallery/' : page.album ? 'gallery/' + page.album.slug + '/' : 'gallery/'
    locals.url = new URL(canonical, new URL(config.root, config.url)).href
    if (page.random_gallery) return locals
    const album = page.album || site.photoGallery.albums.find(item => !item.archive && item.photos.length)
    if (album) {
      const cover = album.photos.find(photo => photo.file === album.cover) || album.photos[0]
      page.cover = '/gallery/media/' + cover.sha + '.webp'
      page.cover_type = 'img'
    }
  }
  return locals
})

hexo.extend.generator.register('photo-albums', function ({ photoGallery }) {
  const routes = []
  const media = new Set()
  for (const album of photoGallery.albums) {
    if (!album.photos.length) continue
    routes.push({
      path: 'gallery/' + album.slug + '/index.html',
      layout: 'gallery-album',
      data: {
        layout: 'page', type: 'gallery', top_img: false, aside: false, comments: false,
        title: album.title, title_en: album.en, album, wall: arrangeWall(album), vercel: Boolean(process.env.VERCEL)
      }
    })
    for (const photo of album.photos) media.add(photo.sha)
  }
  // Both languages use the same first-party photographs in the root site.
  if (this.config.root === '/') {
    for (const sha of media) {
      routes.push({ path: 'gallery/media/' + sha + '.webp', data: () => fs.createReadStream(mediaPath(sha)) })
      routes.push({
        path: 'gallery/thumbs/' + sha + '.webp',
        data: () => sharp(mediaPath(sha)).resize({ width: 640, height: 640, fit: 'inside', withoutEnlargement: true }).webp({ quality: 72 })
      })
      routes.push({
        path: 'gallery/thumbs/small/' + sha + '.webp',
        data: () => sharp(mediaPath(sha)).resize({ width: 384, height: 384, fit: 'inside', withoutEnlargement: true }).webp({ quality: 70 })
      })
    }
  }
  return routes
})
