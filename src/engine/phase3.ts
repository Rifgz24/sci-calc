import { all, create, MathJsStatic, SymbolNode } from 'mathjs'

const math = create(all, {}) as MathJsStatic
math.config({ number: 'number', precision: 14 })

export function numericalDerivative(expression: string, variable: string, point: number, h = 1e-8): number {
  if (!expression.trim() || !variable.trim() || !Number.isFinite(point) || !Number.isFinite(h) || h <= 0) throw new Error('Use valid function and point')
  const compiled = math.compile(expression)
  const scope1 = { [variable]: point + h }
  const scope2 = { [variable]: point - h }
  const result = (compiled.evaluate(scope1) - compiled.evaluate(scope2)) / (2 * h)
  if (!Number.isFinite(result)) throw new Error('Derivative undefined at this point')
  return result
}

export function numericalIntegral(expression: string, variable: string, lower: number, upper: number, steps = 1000): number {
  if (!expression.trim() || !variable.trim() || !Number.isFinite(lower) || !Number.isFinite(upper) || !Number.isInteger(steps) || steps < 2 || steps % 2 !== 0) throw new Error('Use valid bounds and an even step count')
  const compiled = math.compile(expression)
  const width = (upper - lower) / steps
  let total = 0
  for (let index = 0; index <= steps; index += 1) {
    const x = lower + index * width
    const y = compiled.evaluate({ [variable]: x })
    if (!Number.isFinite(y)) throw new Error('Integral undefined in range')
    const weight = index === 0 || index === steps ? 1 : index % 2 === 0 ? 2 : 4
    total += weight * y
  }
  return total * width / 3
}

export type Base = 'DEC' | 'BIN' | 'OCT' | 'HEX'

const baseRadix: Record<Base, number> = { DEC: 10, BIN: 2, OCT: 8, HEX: 16 }
const basePattern: Record<Base, RegExp> = { DEC: /^[+-]?\d+$/, BIN: /^[+-]?[01]+$/, OCT: /^[+-]?[0-7]+$/, HEX: /^[+-]?[0-9a-f]+$/i }

function parseBaseInteger(value: string, base: Base): number {
  const normalized = value.trim()
  if (!basePattern[base].test(normalized)) throw new Error('Invalid number')
  const parsed = Number.parseInt(normalized, baseRadix[base])
  if (!Number.isSafeInteger(parsed)) throw new Error('Number is too large')
  return parsed
}

export function convertBase(value: string, from: Base, to: Base): string {
  return parseBaseInteger(value, from).toString(baseRadix[to]).toUpperCase()
}

export function bitwiseOperation(first: string, second: string, operation: 'AND' | 'OR' | 'XOR' | 'NAND' | 'NOR' | 'XNOR', base: Base): string {
  const a = parseBaseInteger(first, base)
  const b = parseBaseInteger(second, base)
  const result = operation === 'AND' ? a & b
    : operation === 'OR' ? a | b
    : operation === 'XOR' ? a ^ b
    : operation === 'NAND' ? ~(a & b)
    : operation === 'NOR' ? ~(a | b)
    : ~(a ^ b)
  return convertBase(result.toString(), 'DEC', base)
}

export function bitwiseNot(value: string, base: Base): string {
  const parsed = parseBaseInteger(value, base)
  return convertBase((~parsed >>> 0).toString(), 'DEC', base)
}

export function bitShift(value: string, shift: number, direction: 'left' | 'right', base: Base): string {
  const parsed = parseBaseInteger(value, base)
  if (!Number.isInteger(shift) || shift < 0 || shift > 31) throw new Error('Shift must be an integer from 0 to 31')
  const result = direction === 'left' ? parsed << shift : parsed >> shift
  return result.toString(baseRadix[base]).toUpperCase()
}

export type Constant = { name: string; symbol: string; value: number; unit: string; category: string }

export const constants: Constant[] = [
  { name: 'Pi', symbol: 'π', value: Math.PI, unit: '', category: 'Mathematical' },
  { name: 'Euler\'s number', symbol: 'e', value: Math.E, unit: '', category: 'Mathematical' },
  { name: 'Golden ratio', symbol: 'φ', value: 1.618033988749, unit: '', category: 'Mathematical' },
  { name: 'Speed of light', symbol: 'c', value: 299792458, unit: 'm/s', category: 'Physics' },
  { name: 'Standard gravity', symbol: 'g', value: 9.80665, unit: 'm/s²', category: 'Physics' },
  { name: 'Gravitational constant', symbol: 'G', value: 6.67430e-11, unit: 'm³/(kg·s²)', category: 'Physics' },
  { name: 'Planck constant', symbol: 'h', value: 6.62607015e-34, unit: 'J·s', category: 'Physics' },
  { name: 'Reduced Planck constant', symbol: 'ℏ', value: 1.054571817e-34, unit: 'J·s', category: 'Physics' },
  { name: 'Elementary charge', symbol: 'e', value: 1.602176634e-19, unit: 'C', category: 'Physics' },
  { name: 'Boltzmann constant', symbol: 'k', value: 1.380649e-23, unit: 'J/K', category: 'Physics' },
  { name: 'Avogadro constant', symbol: 'NA', value: 6.02214076e23, unit: 'mol⁻¹', category: 'Physics' },
  { name: 'Gas constant', symbol: 'R', value: 8.314462618, unit: 'J/(mol·K)', category: 'Physics' },
  { name: 'Electron mass', symbol: 'me', value: 9.1093837015e-31, unit: 'kg', category: 'Physics' },
  { name: 'Proton mass', symbol: 'mp', value: 1.67262192369e-27, unit: 'kg', category: 'Physics' },
  { name: 'Neutron mass', symbol: 'mn', value: 1.67492749804e-27, unit: 'kg', category: 'Physics' },
  { name: 'Vacuum permittivity', symbol: 'ε₀', value: 8.8541878128e-12, unit: 'F/m', category: 'Electromagnetic' },
  { name: 'Vacuum permeability', symbol: 'μ₀', value: 1.25663706212e-6, unit: 'H/m', category: 'Electromagnetic' },
  { name: 'Impedance of free space', symbol: 'Z₀', value: 376.730313668, unit: 'Ω', category: 'Electromagnetic' },
  { name: 'Stefan-Boltzmann constant', symbol: 'σ', value: 5.670374419e-8, unit: 'W/(m²·K⁴)', category: 'Physics' },
  { name: 'Wien displacement constant', symbol: 'b', value: 2.897771955e-3, unit: 'm·K', category: 'Physics' }
]

export function searchConstants(query: string, category?: string): Constant[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return constants
    .filter(constant => !category || constant.category === category)
    .map(constant => {
      const name = constant.name.toLowerCase()
      const symbol = constant.symbol.toLowerCase()
      const haystack = `${name} ${symbol} ${constant.category.toLowerCase()}`
      const matches = terms.every(term => haystack.includes(term))
      const score = !terms.length ? 0 : terms.reduce((total, term) => total + (name.startsWith(term) ? 3 : symbol.startsWith(term) ? 2 : haystack.includes(term) ? 1 : 0), 0)
      return { constant, matches, score }
    })
    .filter(item => item.matches)
    .sort((left, right) => right.score - left.score || left.constant.name.localeCompare(right.constant.name))
    .map(item => item.constant)
}

export function generateFunctionTable(expression: string, variable: string, start: number, end: number, steps: number): { x: number; y: number }[] {
  const compiled = math.compile(expression)
  const results: { x: number; y: number }[] = []
  const stepSize = (end - start) / Math.max(1, steps)
  for (let index = 0; index <= steps; index += 1) {
    const x = start + index * stepSize
    const y = compiled.evaluate({ [variable]: x })
    if (Number.isFinite(y)) results.push({ x: Number(x.toFixed(6)), y: Number(y.toPrecision(10)) })
  }
  return results
}
