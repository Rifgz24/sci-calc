import { all, create, MathJsStatic } from 'mathjs'

const math = create(all, {}) as MathJsStatic
math.config({ number: 'number', precision: 14 })

export type AngleUnit = 'DEG' | 'RAD' | 'GRAD'
export type VariableScope = Record<string, number>

const toRadians = (value: number, unit: AngleUnit) => unit === 'DEG' ? value * Math.PI / 180 : unit === 'GRAD' ? value * Math.PI / 200 : value
const fromRadians = (value: number, unit: AngleUnit) => unit === 'DEG' ? value * 180 / Math.PI : unit === 'GRAD' ? value * 200 / Math.PI : value

export const factorial = (value: number): number => {
  if (!Number.isInteger(value) || value < 0 || value > 170) throw new Error('Math Error')
  let result = 1
  for (let index = 2; index <= value; index += 1) result *= index
  return result
}

const getExactTrig = (func: string, angle: number, unit: AngleUnit): string | null => {
  if (unit !== 'DEG') return null
  const normalized = ((angle % 360) + 360) % 360
  const table: Record<string, Record<number, string>> = {
    sin: { 0: '0', 30: '1/2', 45: '√2/2', 60: '√3/2', 90: '1', 120: '√3/2', 135: '√2/2', 150: '1/2', 180: '0', 210: '-1/2', 225: '-√2/2', 240: '-√3/2', 270: '-1', 300: '-√3/2', 315: '-√2/2', 330: '-1/2' },
    cos: { 0: '1', 30: '√3/2', 45: '√2/2', 60: '1/2', 90: '0', 120: '-1/2', 135: '-√2/2', 150: '-√3/2', 180: '-1', 210: '-√3/2', 225: '-√2/2', 240: '-1/2', 270: '0', 300: '1/2', 315: '√2/2', 330: '√3/2' },
    tan: { 0: '0', 30: '√3/3', 45: '1', 60: '√3', 120: '-√3', 135: '-1', 150: '-√3/3', 180: '0', 210: '√3/3', 225: '1', 240: '√3', 300: '-√3', 315: '-1', 330: '-√3/3' }
  }
  return table[func]?.[normalized] || null
}

export interface EvalResult {
  value: number
  exact?: string
}

export const permutation = (n: number, r: number) => factorial(n) / factorial(n - r)
export const combination = (n: number, r: number) => permutation(n, r) / factorial(r)

export function evaluate(expression: string, angleUnit: AngleUnit, variables: VariableScope = {}): EvalResult {
  let exactValue: string | undefined
  const scope = {
    sin: (value: number) => {
      const ex = getExactTrig('sin', value, angleUnit)
      if (ex) exactValue = ex
      return Math.sin(toRadians(value, angleUnit))
    },
    cos: (value: number) => {
      const ex = getExactTrig('cos', value, angleUnit)
      if (ex) exactValue = ex
      return Math.cos(toRadians(value, angleUnit))
    },
    tan: (value: number) => {
      const ex = getExactTrig('tan', value, angleUnit)
      if (ex) exactValue = ex
      return Math.tan(toRadians(value, angleUnit))
    },
    asin: (value: number) => fromRadians(Math.asin(value), angleUnit),
    acos: (value: number) => fromRadians(Math.acos(value), angleUnit),
    atan: (value: number) => fromRadians(Math.atan(value), angleUnit),
    sinh: Math.sinh,
    cosh: Math.cosh,
    tanh: Math.tanh,
    asinh: Math.asinh,
    acosh: Math.acosh,
    atanh: Math.atanh,
    ln: Math.log,
    log: Math.log10,
    sqrt: Math.sqrt,
    abs: Math.abs,
    factorial,
    nPr: permutation,
    nCr: combination,
    ...variables,
    pi: Math.PI,
    e: Math.E,
    ans: variables.ans || 0
  }
  const normalized = expression
    .replace(/π/g, 'pi')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/√\(/g, 'sqrt(')
  const result = math.evaluate(normalized, scope)
  if (typeof result !== 'number' || !Number.isFinite(result)) throw new Error('Math Error')
  const val = Math.abs(result) < 1e-12 ? 0 : result
  return { value: val, exact: exactValue }
}

export const formatResult = (value: number, precision = 12, notation = 'NORM') => {
  if (notation === 'SCI') return value.toExponential(Math.max(0, precision - 1))
  if (notation === 'FIX') return Number(value.toFixed(precision)).toString()
  if (notation === 'ENG' && value !== 0) {
    const exponent = Math.floor(Math.log10(Math.abs(value)) / 3) * 3
    return `${Number((value / 10 ** exponent).toPrecision(precision))}e${exponent}`
  }
  return Number(value.toPrecision(precision)).toString()
}
