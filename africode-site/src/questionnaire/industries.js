// The 15 industries from the Africode survey, each mapped to a question
// "module" that decides which tailored questions follow the shared ones.
// modules: product | food | services | custom | general

export const industries = [
  { key: 'retail',       module: 'product',  icon: 'ti-building-store',   en: 'Retail',                 fr: 'Commerce de détail' },
  { key: 'food',         module: 'food',     icon: 'ti-tools-kitchen-2',  en: 'Restaurant / Food',      fr: 'Restauration / Alimentation' },
  { key: 'fashion',      module: 'product',  icon: 'ti-shirt',            en: 'Fashion',                fr: 'Mode' },
  { key: 'beauty',       module: 'product',  icon: 'ti-sparkles',         en: 'Beauty & Cosmetics',     fr: 'Beauté & Cosmétiques' },
  { key: 'construction', module: 'services', icon: 'ti-tool',             en: 'Construction',           fr: 'Construction' },
  { key: 'healthcare',   module: 'services', icon: 'ti-stethoscope',      en: 'Healthcare',             fr: 'Santé' },
  { key: 'education',    module: 'services', icon: 'ti-school',           en: 'Education',              fr: 'Éducation' },
  { key: 'transport',    module: 'services', icon: 'ti-truck-delivery',   en: 'Transportation',         fr: 'Transport' },
  { key: 'agriculture',  module: 'product',  icon: 'ti-plant-2',          en: 'Agriculture',            fr: 'Agriculture' },
  { key: 'realestate',   module: 'services', icon: 'ti-building-community',en: 'Real Estate',            fr: 'Immobilier' },
  { key: 'manufacturing',module: 'product',  icon: 'ti-building-factory-2',en: 'Manufacturing',         fr: 'Fabrication / Industrie' },
  { key: 'hospitality',  module: 'food',     icon: 'ti-bed',              en: 'Hospitality',            fr: 'Hôtellerie' },
  { key: 'technology',   module: 'custom',   icon: 'ti-device-laptop',    en: 'Technology',             fr: 'Technologie' },
  { key: 'professional', module: 'services', icon: 'ti-briefcase',        en: 'Professional Services',  fr: 'Services professionnels' },
  { key: 'other',        module: 'general',  icon: 'ti-dots',             en: 'Something else',         fr: 'Autre chose' },
]

export function getIndustry(key) {
  return industries.find((i) => i.key === key)
}
