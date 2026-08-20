import Services from '../../views/Services'
import { pageMetadata } from '../../lib/seo'

export const metadata = pageMetadata('services', '/what-we-build')

export default function Page() {
  return <Services />
}
