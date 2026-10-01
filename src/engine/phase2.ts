export type Fraction = { numerator: number; denominator: number }

const greatestCommonDivisor = (left: number, right: number): number => {
  let first = Math.abs(left)
  let second = Math.abs(right)
  while (second) [first, second] = [second, first % second]
  return first || 1
}

export function normalizeFraction(numerator: number, denominator: number): Fraction {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) throw new Error('Invalid fraction')
  const sign = denominator < 0 ? -1 : 1
  const divisor = greatestCommonDivisor(numerator, denominator)
  return { numerator: sign * numerator / divisor, denominator: sign * denominator / divisor }
}

export function parseFraction(input: string): Fraction {
  const value = input.trim()
  const mixedMatch = value.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixedMatch) {
    const whole = Number(mixedMatch[1])
    const numerator = Number(mixedMatch[2])
    const denominator = Number(mixedMatch[3])
    return normalizeFraction(whole < 0 ? whole * denominator - numerator : whole * denominator + numerator, denominator)
  }
  const fractionMatch = value.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (fractionMatch) return normalizeFraction(Number(fractionMatch[1]), Number(fractionMatch[2]))
  const decimal = Number(value)
  if (!Number.isFinite(decimal)) throw new Error('Invalid fraction')
  const decimals = value.includes('.') ? value.split('.')[1].replace(/^-/, '').length : 0
  return normalizeFraction(Math.round(decimal * 10 ** decimals), 10 ** decimals)
}

export function formatFraction(fraction: Fraction): string {
  const normalized = normalizeFraction(fraction.numerator, fraction.denominator)
  return normalized.denominator === 1 ? String(normalized.numerator) : `${normalized.numerator}/${normalized.denominator}`
}

export function formatMixedFraction(fraction: Fraction): string {
  const normalized = normalizeFraction(fraction.numerator, fraction.denominator)
  if (Math.abs(normalized.numerator) < normalized.denominator) return formatFraction(normalized)
  const whole = Math.trunc(normalized.numerator / normalized.denominator)
  const remainder = Math.abs(normalized.numerator % normalized.denominator)
  return remainder ? `${whole} ${remainder}/${normalized.denominator}` : String(whole)
}

export function fractionOperation(firstInput: string, secondInput: string, operation: '+' | '-' | '×' | '÷'): Fraction {
  const first = parseFraction(firstInput)
  const second = parseFraction(secondInput)
  if (operation === '÷' && second.numerator === 0) throw new Error('Cannot divide by zero')
  const numerator = operation === '+' ? first.numerator * second.denominator + second.numerator * first.denominator
    : operation === '-' ? first.numerator * second.denominator - second.numerator * first.denominator
      : operation === '×' ? first.numerator * second.numerator
        : first.numerator * second.denominator
  const denominator = operation === '+' || operation === '-' ? first.denominator * second.denominator
    : operation === '×' ? first.denominator * second.denominator
      : first.denominator * second.numerator
  return normalizeFraction(numerator, denominator)
}

export type StatisticsSummary = {
  count: number
  sum: number
  sumSquares: number
  mean: number
  variance: number
  sampleVariance: number
  standardDeviation: number
  sampleStandardDeviation: number
  minimum: number
  maximum: number
  range: number
}

export function parseNumberList(input: string): number[] {
  const values = input.split(/[,\s]+/).filter(Boolean).map(Number)
  if (!values.length || values.some(value => !Number.isFinite(value))) throw new Error('Enter valid numbers')
  return values
}

export function statistics(values: number[]): StatisticsSummary {
  if (!values.length) throw new Error('Enter data')
  const count = values.length
  const sum = values.reduce((total, value) => total + value, 0)
  const sumSquares = values.reduce((total, value) => total + value ** 2, 0)
  const mean = sum / count
  const variance = values.reduce((total, value) => total + (value - mean) ** 2, 0) / count
  const sampleVariance = count > 1 ? variance * count / (count - 1) : 0
  const minimum = Math.min(...values)
  const maximum = Math.max(...values)
  return { count, sum, sumSquares, mean, variance, sampleVariance, standardDeviation: Math.sqrt(variance), sampleStandardDeviation: Math.sqrt(sampleVariance), minimum, maximum, range: maximum - minimum }
}

export type Regression = { intercept: number; slope: number; correlation: number; rSquared: number; predictY: (x: number) => number; predictX: (y: number) => number }

export function linearRegression(xValues: number[], yValues: number[]): Regression {
  if (xValues.length < 2 || xValues.length !== yValues.length) throw new Error('X and Y need same length')
  const count = xValues.length
  const meanX = xValues.reduce((total, value) => total + value, 0) / count
  const meanY = yValues.reduce((total, value) => total + value, 0) / count
  const covariance = xValues.reduce((total, value, index) => total + (value - meanX) * (yValues[index] - meanY), 0)
  const varianceX = xValues.reduce((total, value) => total + (value - meanX) ** 2, 0)
  const varianceY = yValues.reduce((total, value) => total + (value - meanY) ** 2, 0)
  if (!varianceX) throw new Error('X values must vary')
  const slope = covariance / varianceX
  const intercept = meanY - slope * meanX
  const correlation = covariance / Math.sqrt(varianceX * varianceY || 1)
  return { intercept, slope, correlation, rSquared: correlation ** 2, predictY: value => intercept + slope * value, predictX: value => (value - intercept) / slope }
}

export function combinations(total: number, selected: number): number {
  if (!Number.isInteger(total) || !Number.isInteger(selected) || total < 0 || selected < 0 || selected > total) throw new Error('Invalid n or r')
  let result = 1
  const reducedSelected = Math.min(selected, total - selected)
  for (let index = 1; index <= reducedSelected; index += 1) result = result * (total - reducedSelected + index) / index
  return result
}

export function permutations(total: number, selected: number): number {
  if (!Number.isInteger(total) || !Number.isInteger(selected) || total < 0 || selected < 0 || selected > total) throw new Error('Invalid n or r')
  let result = 1
  for (let index = 0; index < selected; index += 1) result *= total - index
  return result
}

export type ComplexNumber = { real: number; imaginary: number }

export function parseComplex(input: string): ComplexNumber {
  const value = input.replace(/\s/g, '').replace(/\*?i$/, 'i')
  if (!value) throw new Error('Enter complex number')
  if (!value.endsWith('i')) {
    const real = Number(value)
    if (!Number.isFinite(real)) throw new Error('Invalid complex number')
    return { real, imaginary: 0 }
  }
  const core = value.slice(0, -1)
  let splitIndex = -1
  for (let index = 1; index < core.length; index += 1) if (core[index] === '+' || core[index] === '-') splitIndex = index
  const realPart = splitIndex < 0 ? '0' : core.slice(0, splitIndex)
  const imaginaryPart = splitIndex < 0 ? core : core.slice(splitIndex)
  const real = Number(realPart)
  const imaginary = imaginaryPart === '' || imaginaryPart === '+' ? 1 : imaginaryPart === '-' ? -1 : Number(imaginaryPart)
  if (!Number.isFinite(real) || !Number.isFinite(imaginary)) throw new Error('Invalid complex number')
  return { real, imaginary }
}

export function formatComplex(value: ComplexNumber): string {
  const imaginary = Math.abs(value.imaginary) === 1 ? 'i' : `${Math.abs(value.imaginary)}i`
  if (!value.real) return value.imaginary ? `${value.imaginary < 0 ? '-' : ''}${imaginary}` : '0'
  if (!value.imaginary) return String(value.real)
  return `${value.real}${value.imaginary < 0 ? ' − ' : ' + '}${imaginary}`
}

export function complexOperation(first: ComplexNumber, second: ComplexNumber, operation: '+' | '-' | '×' | '÷'): ComplexNumber {
  if (operation === '+') return { real: first.real + second.real, imaginary: first.imaginary + second.imaginary }
  if (operation === '-') return { real: first.real - second.real, imaginary: first.imaginary - second.imaginary }
  if (operation === '×') return { real: first.real * second.real - first.imaginary * second.imaginary, imaginary: first.real * second.imaginary + first.imaginary * second.real }
  const denominator = second.real ** 2 + second.imaginary ** 2
  if (!denominator) throw new Error('Cannot divide by zero')
  return { real: (first.real * second.real + first.imaginary * second.imaginary) / denominator, imaginary: (first.imaginary * second.real - first.real * second.imaginary) / denominator }
}

export function complexMagnitude(value: ComplexNumber): number { return Math.hypot(value.real, value.imaginary) }
export function complexArgument(value: ComplexNumber): number { return Math.atan2(value.imaginary, value.real) }

export type Matrix = number[][]

export function parseMatrix(input: string): Matrix {
  const rows = input.split(';').map(row => row.split(/[,\s]+/).filter(Boolean).map(Number))
  if (!rows.length || rows.some(row => !row.length || row.some(value => !Number.isFinite(value)))) throw new Error('Use rows like 1,2;3,4')
  const width = rows[0].length
  if (rows.some(row => row.length !== width)) throw new Error('Matrix rows must match')
  if (rows.length > 4 || width > 4) throw new Error('Maximum matrix size is 4×4')
  return rows
}

export function matrixAdd(first: Matrix, second: Matrix, sign = 1): Matrix {
  if (first.length !== second.length || first[0].length !== second[0].length) throw new Error('Matrix sizes must match')
  return first.map((row, rowIndex) => row.map((value, columnIndex) => value + sign * second[rowIndex][columnIndex]))
}

export function matrixMultiply(first: Matrix, second: Matrix): Matrix {
  if (first[0].length !== second.length) throw new Error('Incompatible matrix sizes')
  return first.map((row, rowIndex) => second[0].map((_, columnIndex) => row.reduce((total, value, innerIndex) => total + value * second[innerIndex][columnIndex], 0)))
}

export function matrixTranspose(matrix: Matrix): Matrix { return matrix[0].map((_, columnIndex) => matrix.map(row => row[columnIndex])) }

export function matrixDeterminant(matrix: Matrix): number {
  if (matrix.length !== matrix[0].length) throw new Error('Matrix must be square')
  if (matrix.length === 1) return matrix[0][0]
  if (matrix.length === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
  return matrix[0].reduce((total, value, columnIndex) => total + value * ((columnIndex % 2 ? -1 : 1) * matrixDeterminant(matrix.slice(1).map(row => row.filter((_, index) => index !== columnIndex)))), 0)
}

export function matrixInverse(matrix: Matrix): Matrix {
  if (matrix.length !== matrix[0].length) throw new Error('Matrix must be square')
  const size = matrix.length
  const augmented = matrix.map((row, rowIndex) => [...row, ...Array.from({ length: size }, (_, columnIndex) => rowIndex === columnIndex ? 1 : 0)])
  for (let columnIndex = 0; columnIndex < size; columnIndex += 1) {
    let pivot = columnIndex
    for (let rowIndex = columnIndex + 1; rowIndex < size; rowIndex += 1) if (Math.abs(augmented[rowIndex][columnIndex]) > Math.abs(augmented[pivot][columnIndex])) pivot = rowIndex
    if (Math.abs(augmented[pivot][columnIndex]) < 1e-12) throw new Error('Matrix is singular')
    ;[augmented[columnIndex], augmented[pivot]] = [augmented[pivot], augmented[columnIndex]]
    const divisor = augmented[columnIndex][columnIndex]
    augmented[columnIndex] = augmented[columnIndex].map(value => value / divisor)
    for (let rowIndex = 0; rowIndex < size; rowIndex += 1) if (rowIndex !== columnIndex) {
      const factor = augmented[rowIndex][columnIndex]
      augmented[rowIndex] = augmented[rowIndex].map((value, valueIndex) => value - factor * augmented[columnIndex][valueIndex])
    }
  }
  return augmented.map(row => row.slice(size))
}

export function formatMatrix(matrix: Matrix): string { return matrix.map(row => `[ ${row.map(value => Number(value.toPrecision(10))).join(', ')} ]`).join('\n') }

export function parseVector(input: string): number[] {
  const vector = input.split(/[,\s]+/).filter(Boolean).map(Number)
  if (!vector.length || vector.some(value => !Number.isFinite(value)) || (vector.length !== 2 && vector.length !== 3)) throw new Error('Use 2D or 3D vector')
  return vector
}

export function vectorOperation(first: number[], second: number[], operation: 'add' | 'subtract' | 'dot' | 'cross' | 'angle' | 'magnitude'): number | number[] {
  if (operation === 'magnitude') return Math.hypot(...first)
  if (first.length !== second.length) throw new Error('Vector dimensions must match')
  if (operation === 'add') return first.map((value, index) => value + second[index])
  if (operation === 'subtract') return first.map((value, index) => value - second[index])
  if (operation === 'dot') return first.reduce((total, value, index) => total + value * second[index], 0)
  if (operation === 'angle') return Math.acos((first.reduce((total, value, index) => total + value * second[index], 0)) / (Math.hypot(...first) * Math.hypot(...second))) * 180 / Math.PI
  if (first.length !== 3) throw new Error('Cross product needs 3D vectors')
  return [first[1] * second[2] - first[2] * second[1], first[2] * second[0] - first[0] * second[2], first[0] * second[1] - first[1] * second[0]]
}

export function solveLinear(coefficient: number, constant: number): number {
  if (!coefficient) throw new Error('Coefficient cannot be zero')
  return -constant / coefficient
}

export function solveSystem2(first: [number, number, number], second: [number, number, number]): [number, number] {
  const determinant = first[0] * second[1] - second[0] * first[1]
  if (!determinant) throw new Error('System has no unique solution')
  return [(first[2] * second[1] - second[2] * first[1]) / determinant, (first[0] * second[2] - second[0] * first[2]) / determinant]
}

export function solveQuadratic(coefficientA: number, coefficientB: number, coefficientC: number): (number | ComplexNumber)[] {
  if (!coefficientA) return [solveLinear(coefficientB, coefficientC)]
  const discriminant = coefficientB ** 2 - 4 * coefficientA * coefficientC
  if (discriminant >= 0) return [(-coefficientB + Math.sqrt(discriminant)) / (2 * coefficientA), (-coefficientB - Math.sqrt(discriminant)) / (2 * coefficientA)]
  const imaginary = Math.sqrt(-discriminant) / (2 * coefficientA)
  return [{ real: -coefficientB / (2 * coefficientA), imaginary }, { real: -coefficientB / (2 * coefficientA), imaginary: -imaginary }]
}
