import { all, create, MathJsStatic } from 'mathjs'

const math = create(all, {}) as MathJsStatic
math.config({ number: 'number', precision: 14 })

export type AngleUnit = 'DEG' | 'RAD' | 'GRAD'
export type VariableScope = Record<string, number>

const toRadians = (value: number, unit: AngleUnit) => unit === 'DEG' ? value * Math.PI / 180 : unit === 'GRAD' ? value * Math.PI / 200 : value
const fromRadians = (value: number, unit: AngleUnit) => unit === 'DEG' ? value * 180 / Math.PI : unit === 'GRAD' ? value * 200 / Math.PI : value

export const inverseTrig = (value:number)=>Math.atan(value)
  if (!Number.isInteger(value) || value < 0 || value > 170) throw new Error('Math Error')
  let result = 1
  for (let index = 2; index <= value; index += 1) result *= index
  return result
}

export const permutation = (n: number, r: number) => factorial(n) / factorial(n - r)
export const combination = (n: number, r: number) => permutation(n, r) / factorial(r)

export function evaluate(expression: string, angleUnit: AngleUnit, variables: VariableScope = {}): number {
  const scope = {
    sin: (value: number) => Math.sin(toRadians(value, angleUnit)),
    cos: (value: number) => Math.cos(toRadians(value, angleUnit)),
    tan: (value: number) => Math.tan(toRadians(value, angleUnit)),
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
  }
  const normalized = expression
    .replace(/π/g, 'pi')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/√\(/g, 'sqrt(')
  const result = math.evaluate(normalized, scope)
  if (typeof result !== 'number' || !Number.isFinite(result)) throw new Error('Math Error')
  return Math.abs(result) < 1e-12 ? 0 : result
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
