// The 20 categories the free-website promo can draw from. One business per
// category — the Apps Script marks a category as taken once someone has it.
// `template` is the base layout we re-skin for that niche.

export const NICHES = [
  { key: 'salon', label: 'Hair / salon / barber', template: 'gallery' },
  { key: 'cosmetics', label: 'Cosmetics / skincare', template: 'catalogue' },
  { key: 'perfume', label: 'Perfume / fragrance', template: 'catalogue' },
  { key: 'fashion', label: 'Fashion / tailoring', template: 'gallery' },
  { key: 'food', label: 'Food / catering', template: 'menu' },
  { key: 'photography', label: 'Photography / videography', template: 'gallery' },
  { key: 'events', label: 'Events / decor', template: 'gallery' },
  { key: 'jewellery', label: 'Jewellery / accessories', template: 'catalogue' },
  { key: 'auto', label: 'Car wash / detailing / mechanic', template: 'services' },
  { key: 'cleaning', label: 'Cleaning / laundry', template: 'services' },
  { key: 'fitness', label: 'Fitness / coach / wellness', template: 'services' },
  { key: 'kids', label: 'Baby and kids’ products', template: 'catalogue' },
  { key: 'music', label: 'Music / DJ / entertainment', template: 'gallery' },
  { key: 'artists', label: 'Artist / craftsperson', template: 'gallery' },
  { key: 'furniture', label: 'Furniture / interior design', template: 'catalogue' },
  { key: 'electronics', label: 'Electronics / phone accessories', template: 'catalogue' },
  { key: 'farm', label: 'Agriculture / farm produce', template: 'catalogue' },
  { key: 'tutoring', label: 'Tutoring / education', template: 'services' },
  { key: 'printing', label: 'Printing / branding / design studio', template: 'services' },
  { key: 'church', label: 'Church / ministry', template: 'services' },
]

export const GOALS = [
  { value: 'whatsapp-orders', label: 'Get orders on WhatsApp' },
  { value: 'bookings', label: 'Get bookings / appointments' },
  { value: 'calls', label: 'Get phone calls' },
  { value: 'showcase', label: 'Show off my work' },
]

export const FEELS = [
  { value: 'luxury', label: 'Luxury and elegant' },
  { value: 'bold', label: 'Bold and colourful' },
  { value: 'minimal', label: 'Clean and minimal' },
  { value: 'warm', label: 'Warm and friendly' },
]

export const COLOURS = [
  { value: 'match-logo', label: 'Match my logo' },
  { value: 'black-gold', label: 'Black and gold' },
  { value: 'white-clean', label: 'White and clean' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'red', label: 'Red' },
  { value: 'pink-purple', label: 'Pink / purple' },
  { value: 'earth', label: 'Earth tones' },
  { value: 'you-decide', label: 'You decide' },
]
