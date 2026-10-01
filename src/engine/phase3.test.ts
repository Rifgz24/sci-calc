import { describe, it, expect } from 'vitest'
import { numericalDerivative, numericalIntegral, convertBase, bitwiseOperation, searchConstants, generateFunctionTable } from './phase3'
import { convertUnit } from '../converter/units'

describe('Calculus', () => {
  it('calculates derivative of x^2 at x=3', () => {
    expect(numericalDerivative('x^2', 'x', 3)).toBeCloseTo(6, 3)
  })
  
  it('calculates integral of 2x from 0 to 5', () => {
    expect(numericalIntegral('2*x', 'x', 0, 5)).toBeCloseTo(25, 2)
  })
})

describe('Base-N', () => {
  it('converts binary to decimal', () => {
    expect(convertBase('1010', 'BIN', 'DEC')).toBe('10')
  })
  
  it('converts decimal to hexadecimal', () => {
    expect(convertBase('255', 'DEC', 'HEX')).toBe('FF')
  })
  
  it('performs bitwise AND', () => {
    expect(bitwiseOperation('5', '3', 'AND', 'DEC')).toBe('1')
  })
  
  it('performs bit shift left', () => {
    expect(bitShift('5', 2, 'left', 'DEC')).toBe('20')
  })
})

describe('Unit Converter', () => {
  it('converts meters to feet', () => {
    expect(convertUnit(1, 'length', 'm', 'ft')).toBeCloseTo(3.28084, 3)
  })
  
  it('converts Celsius to Kelvin', () => {
    expect(convertUnit(0, 'temperature', 'C', 'K')).toBeCloseTo(273.15, 2)
  })
  
  it('converts km/h to m/s', () => {
    expect(convertUnit(100, 'speed', 'km/h', 'm/s')).toBeCloseTo(27.7778, 3)
  })
})

describe('Constants', () => {
  it('searches constants', () => {
    const results = searchConstants('light')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].symbol).toBe('c')
  })
})

describe('Function Table', () => {
  it('generates table for x^2', () => {
    const table = generateFunctionTable('x^2', 'x', -2, 2, 4)
    expect(table.length).toBe(5)
    expect(table[0].x).toBe(-2)
    expect(table[0].y).toBe(4)
  })
})

function bitShift(value: string, shift: number, direction: 'left' | 'right', base: 'DEC' | 'BIN' | 'OCT' | 'HEX'): string {
  const parsed = parseInt(value, { DEC: 10, BIN: 2, OCT: 8, HEX: 16 }[base])
  if (!Number.isFinite(parsed)) throw new Error('Invalid number')
  const result = direction === 'left' ? parsed << shift : parsed >> shift
  return result.toString(base === 'DEC' ? 10 : base === 'BIN' ? 2 : base === 'OCT' ? 8 : 16).toUpperCase()
}
