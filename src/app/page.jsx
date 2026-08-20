import Home from '../views/Home'
import { pageMetadata } from '../lib/seo'

export const metadata = pageMetadata('home', '/')

export default function Page() {
  return <Home />
}
