const fs = require('node:fs')
const { readCatalog, mediaPath } = require('../gallery/catalog')

hexo.locals.set('photoGallery', readCatalog)

hexo.extend.filter.register('template_locals', locals => {
  const { page, config, site } = locals
  if (page.type === 'gallery') {
    if (config.language === 'en' && page.title_en) page.title = page.title_en
    const canonical = page.album ? 'gallery/' + page.album.slug + '/' : 'gallery/'
    locals.url = new URL(canonical, new URL(config.root, config.url)).href
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
      layout: 'gallery',
      data: {
        layout: 'page', type: 'gallery', top_img: false, aside: false, comments: false,
        title: album.title, title_en: album.en, album
      }
    })
    for (const photo of album.photos) media.add(photo.sha)
  }
  // Both languages use the same first-party photographs in the root site.
  if (this.config.root === '/') {
    for (const sha of media) {
      routes.push({ path: 'gallery/media/' + sha + '.webp', data: () => fs.createReadStream(mediaPath(sha)) })
    }
  }
  return routes
})
