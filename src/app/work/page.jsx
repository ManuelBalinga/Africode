import Work from '../../views/Work'
import { pageMetadata } from '../../lib/seo'

export const metadata = pageMetadata('work', '/work')

export default function Page() {
  return <Work />
}
