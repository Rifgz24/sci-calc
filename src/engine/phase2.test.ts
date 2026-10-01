import { describe, it, expect } from 'vitest'
import { normalizeFraction, parseFraction, formatFraction, fractionOperation, statistics, linearRegression, combinations, parseComplex, complexOperation, complexMagnitude, matrixDeterminant, parseVector, vectorOperation, solveQuadratic } from './phase2'

describe('Fractions', () => {
  it('normalizes fractions', () => {
    expect(normalizeFraction(4, 8)).toEqual({ numerator: 1, denominator: 2 })
    expect(normalizeFraction(-3, 6)).toEqual({ numerator: -1, denominator: 2 })
  })
  
  it('parses fractions', () => {
    expect(parseFraction('1/2')).toEqual({ numerator: 1, denominator: 2 })
    expect(parseFraction('2 1/2')).toEqual({ numerator: 5, denominator: 2 })
    expect(parseFraction('0.5')).toEqual({ numerator: 1, denominator: 2 })
  })
  
  it('adds fractions', () => {
    const result = fractionOperation('1/2', '1/3', '+')
    expect(result.numerator).toEqual(5)
    expect(result.denominator).toEqual(6)
  })
  
  it('formats fractions', () => {
    expect(formatFraction({ numerator: 1, denominator: 2 })).toEqual('1/2')
    expect(formatFraction({ numerator: 3, denominator: 1 })).toEqual('3')
  })
})

describe('Statistics', () => {
  it('calculates statistics', () => {
    const data = [1, 2, 3, 4, 5]
    const stats = statistics(data)
    expect(stats.count).toEqual(5)
    expect(stats.mean).toEqual(3)
    expect(stats.minimum).toEqual(1)
    expect(stats.maximum).toEqual(5)
    expect(stats.range).toEqual(4)
  })
})

describe('Regression', () => {
  it('calculates linear regression', () => {
    const x = [1, 2, 3, 4, 5]
    const y = [2, 4, 6, 8, 10]
    const regression = linearRegression(x, y)
    expect(regression.slope).toBeCloseTo(2, 5)
    expect(regression.intercept).toBeCloseTo(0, 5)
    expect(regression.rSquared).toBeCloseTo(1, 5)
  })
})

describe('Probability', () => {
  it('calculates combinations', () => {
    expect(combinations(5, 2)).toEqual(10)
    expect(combinations(4, 4)).toEqual(1)
  })
})

describe('Complex Numbers', () => {
  it('parses complex numbers', () => {
    expect(parseComplex('3+4i')).toEqual({ real: 3, imaginary: 4 })
    expect(parseComplex('5i')).toEqual({ real: 0, imaginary: 5 })
  })
  
  it('multiplies complex numbers', () => {
    const result = complexOperation({ real: 2, imaginary: 3 }, { real: 1, imaginary: 1 }, '×')
    expect(result.real).toEqual(-1)
    expect(result.imaginary).toEqual(5)
  })
  
  it('calculates magnitude', () => {
    expect(complexMagnitude({ real: 3, imaginary: 4 })).toBeCloseTo(5, 5)
  })
})

describe('Matrices', () => {
  it('calculates determinant', () => {
    expect(matrixDeterminant([[1, 2], [3, 4]])).toEqual(-2)
  })
})

describe('Vectors', () => {
  it('calculates magnitude', () => {
    expect(vectorOperation([3, 4], [], 'magnitude')).toBeCloseTo(5, 5)
  })
  
  it('calculates dot product', () => {
    expect(vectorOperation([1, 2], [3, 4], 'dot')).toEqual(11)
  })
})

describe('Equation Solving', () => {
  it('solves quadratic equations', () => {
    const roots = solveQuadratic(1, -5, 6)
    expect(roots).toContainEqual(3)
    expect(roots).toContainEqual(2)
  })
})
