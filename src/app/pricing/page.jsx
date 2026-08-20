import Pricing from '../../views/Pricing'
import { pageMetadata } from '../../lib/seo'

export const metadata = pageMetadata('pricing', '/pricing')

export default function Page() {
  return <Pricing />
}
