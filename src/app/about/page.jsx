import About from '../../views/About'
import { pageMetadata } from '../../lib/seo'

export const metadata = pageMetadata('about', '/about')

export default function Page() {
  return <About />
}
