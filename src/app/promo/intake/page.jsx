import PromoIntake from '../../../views/PromoIntake'

// Private promo page: shared by link only, kept out of search results.
export const metadata = {
  title: 'Claim your free website | Africode Studios',
  description: 'Tell us about your business and we will build your website.',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <PromoIntake />
}
