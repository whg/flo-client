import { vocab } from '@/vocab'

export const vocabMap = Object.fromEntries(Object.entries(vocab).map(([k, v]) => [v, k]))

export function camelToKebab(s) {
  return s.replace(/([A-Za-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

export function sameRequest(a, b) {
  return ['method', 'address', 'param'].every(k => a[k] === b[k])
}

export function randomID() {
  return (Math.random() * 1e18).toString(16)
}
