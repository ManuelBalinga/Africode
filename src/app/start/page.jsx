import Start from '../../views/Start'
import { pageMetadata } from '../../lib/seo'

export const metadata = pageMetadata('start', '/start')

export default function Page() {
  return <Start />
}
