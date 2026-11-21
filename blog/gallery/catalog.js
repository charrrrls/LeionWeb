const fs = require('node:fs')
const path = require('node:path')
const { createHash } = require('node:crypto')
const snapshot = require('./snapshot.json')

const cache = path.join(__dirname, '../.gallery-cache')
const cachedIndex = path.join(cache, 'catalog.json')
const api = 'https://api.github.com/repos/charrrrls/mypic'

function readCatalog() {
  if (fs.existsSync(cachedIndex)) {
    try {
      const saved = JSON.parse(fs.readFileSync(cachedIndex, 'utf8'))
      if (saved.baseRevision === snapshot.revision &&
          saved.albums.every(album => album.photos.every(photo => fs.existsSync(mediaPath(photo.sha))))) return saved
    } catch (error) {
      console.warn('Gallery could not read the cached photo collection:', error.message)
    }
  }
  return snapshot
}

function mediaPath(sha) {
  const bundled = path.join(__dirname, 'media', sha + '.webp')
  return fs.existsSync(bundled) ? bundled : path.join(cache, sha + '.webp')
}

async function request(url, timeout) {
  const response = await fetch(url, { signal: AbortSignal.timeout(timeout) })
  if (!response.ok) throw new Error(new URL(url).hostname + ' returned HTTP ' + response.status)
  return response
}

function atomicWrite(file, contents) {
  const temporary = file + '.' + process.pid + '.tmp'
  fs.writeFileSync(temporary, contents)
  fs.renameSync(temporary, file)
}

async function preparePhoto(file, revision) {
  const original = 'https://raw.githubusercontent.com/charrrrls/mypic/' + revision + '/' +
    file.path.split('/').map(encodeURIComponent).join('/')
  const params = new URLSearchParams({ url: original, w: 1280, h: 1280, fit: 'inside', we: '1', output: 'webp', q: 78 })
  const response = await request('https://images.weserv.nl/?' + params, 20000)
  const bytes = Buffer.from(await response.arrayBuffer())
  if (bytes.length < 30 || bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error('Invalid WebP preview for ' + file.path)
  }
  let width, height
  switch (bytes.toString('ascii', 12, 16)) {
    case 'VP8 ':
      width = bytes.readUInt16LE(26) & 0x3fff
      height = bytes.readUInt16LE(28) & 0x3fff
      break
    case 'VP8L': {
      const bits = bytes.readUInt32LE(21)
      width = 1 + (bits & 0x3fff)
      height = 1 + ((bits >>> 14) & 0x3fff)
      break
    }
    case 'VP8X':
      width = 1 + bytes.readUIntLE(24, 3)
      height = 1 + bytes.readUIntLE(27, 3)
      break
    default:
      throw new Error('Unknown WebP header for ' + file.path)
  }
  if (!width || !height || Math.max(width, height) > 1280) throw new Error('Invalid image dimensions for ' + file.path)
  atomicWrite(path.join(cache, file.sha + '.webp'), bytes)
  return { sha: file.sha, width, height }
}

async function refresh() {
  const previous = readCatalog()
  const commit = await (await request(api + '/commits/main', 6000)).json()
  if (!/^[a-f0-9]{40}$/.test(commit.sha)) throw new Error('Invalid photo repository revision')
  if (commit.sha === previous.revision) return
  const tree = await (await request(api + '/git/trees/' + commit.sha + '?recursive=1', 10000)).json()
  if (tree.truncated || !Array.isArray(tree.tree)) throw new Error('Incomplete photo directory listing')

  const known = new Map()
  const albums = new Map()
  for (const album of previous.albums) {
    albums.set(album.folder, { ...album, photos: [] })
    for (const photo of album.photos) known.set(photo.sha, photo)
  }
  fs.mkdirSync(cache, { recursive: true })
  for (const file of tree.tree) {
    const parts = file.path.split('/')
    if (file.type !== 'blob' || parts.length !== 2 || parts[0].startsWith('.') || !/\.(jpe?g|png|webp|gif)$/i.test(parts[1])) continue
    if (!/^[a-f0-9]{40}$/.test(file.sha)) throw new Error('Invalid photo hash')
    const [folder, name] = parts
    if (!albums.has(folder)) {
      const slug = 'album-' + createHash('sha256').update(folder).digest('hex').slice(0, 12)
      albums.set(folder, { folder, slug, title: folder, en: folder, photos: [] })
    }
    let photo = known.get(file.sha)
    if (!photo || !fs.existsSync(mediaPath(file.sha))) {
      photo = await preparePhoto(file, commit.sha)
      known.set(file.sha, photo)
    }
    albums.get(folder).photos.push({ ...photo, file: name })
  }
  const updated = { baseRevision: snapshot.revision, revision: commit.sha, albums: Array.from(albums.values()) }
  atomicWrite(cachedIndex, JSON.stringify(updated))
}

module.exports = { readCatalog, mediaPath }

if (require.main === module) {
  refresh().catch(error => console.warn('Gallery uses the last complete local photo collection:', error.message))
}
