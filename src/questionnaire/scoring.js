// Turns collected answers into a recommended package, with custom-project
// detection so complex builds (logins, booking systems, marketplaces, live
// tracking, multi-role apps — like ALG Transport) aren't given a generic price.

import { buildQuestions } from './questions'

const COMPLEX_FLAGS = ['login', 'marketplace', 'inventory', 'multirole', 'tracking', 'booking', 'customtool']

// Collect every flag from the options the user chose.
export function collectFlags(module, answers) {
  const questions = buildQuestions(module)
  const flags = new Set()
  const optionMap = {}
  for (const q of questions) {
    if (!q.options) continue
    for (const o of q.options) optionMap[`${q.id}:${o.value}`] = o
  }
  for (const q of questions) {
    const a = answers[q.id]
    if (a == null) continue
    const values = Array.isArray(a) ? a : [a]
    for (const v of values) {
      const opt = optionMap[`${q.id}:${v}`]
      if (opt?.flags) opt.flags.forEach((f) => flags.add(f))
    }
  }
  return flags
}

export function recommend(module, answers) {
  const flags = collectFlags(module, answers)
  const isComplex = COMPLEX_FLAGS.some((f) => flags.has(f)) || module === 'custom'

  let pkg
  if (isComplex) pkg = 'custom'
  else if (flags.has('sell')) pkg = 'store'
  else if (flags.has('bookings') || flags.has('leads') || countGoals(answers) >= 2) pkg = 'business'
  else pkg = 'starter'

  return { pkg, flags: [...flags], isComplex }
}

function countGoals(answers) {
  const g = answers.goals
  return Array.isArray(g) ? g.length : 0
}
