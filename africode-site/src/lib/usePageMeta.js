import { useEffect } from 'react'

// Sets the document title + description (and their Open Graph twins) per page,
// so each route has its own SEO metadata and share preview text.
function setMeta(selector, attr, value) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    const [k, v] = selector.replace(/meta\[|\]/g, '').split('=')
    el.setAttribute(k, v.replace(/["']/g, ''))
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

export function usePageMeta(title, description) {
  useEffect(() => {
    if (title) {
      document.title = title
      setMeta('meta[property="og:title"]', 'content', title)
    }
    if (description) {
      setMeta('meta[name="description"]', 'content', description)
      setMeta('meta[property="og:description"]', 'content', description)
    }
  }, [title, description])
}
