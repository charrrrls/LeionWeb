/**
 * Butterfly
 * lazyload
 * replace src to data-lazy-src
 */

'use strict'

const urlFor = require('hexo-util').url_for.bind(hexo)

const lazyload = htmlContent => {
  const { native, placeholder } = hexo.theme.config.lazyload
  const bg = placeholder ? urlFor(placeholder) : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  // An image without a source must never consume the next element's src.
  return htmlContent.replace(/<img\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi, tag => {
    const attributes = tag.replace(/"[^"]*"|'[^']*'/g, '')
    if (/\s(?:loading|data-lazy-src)\s*=/i.test(attributes)) return tag
    const replacement = native ? ' loading="lazy" src=' : ` src="${bg}" data-lazy-src=`
    return tag.replace(/"[^"]*"|'[^']*'|(\ssrc\s*=)/gi, (token, src) => src ? replacement : token)
  })
}

hexo.extend.filter.register('after_render:html', data => {
  const { enable, field } = hexo.theme.config.lazyload
  if (!enable || field !== 'site') return
  return lazyload(data)
})

hexo.extend.filter.register('after_post_render', data => {
  const { enable, field } = hexo.theme.config.lazyload
  if (!enable || field !== 'post') return
  data.content = lazyload(data.content)
  return data
})
