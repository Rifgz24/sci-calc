import { describe, expect, it } from 'vitest'
import { evaluate } from './evaluate'

describe('evaluate', () => {
  it('applies operator precedence', () => expect(evaluate('2 + 3 * 4', 'DEG')).toBe(14))
  it('handles required scientific calculations', () => {
    expect(evaluate('sin(30)', 'DEG')).toBeCloseTo(0.5)
    expect(evaluate('cos(60)', 'DEG')).toBeCloseTo(0.5)
    expect(evaluate('tan(45)', 'DEG')).toBeCloseTo(1)
    expect(evaluate('5!', 'DEG')).toBe(120)
    expect(evaluate('2^10', 'DEG')).toBe(1024)
  })
  it('uses radians and calculator variables', () => {
    expect(evaluate('sin(pi / 2)', 'RAD')).toBeCloseTo(1)
    expect(evaluate('A * 2', 'DEG', { A: 21 })).toBe(42)
  })
  it('supports logs and combinatorics', () => {
    expect(evaluate('log(1000)', 'DEG')).toBe(3)
    expect(evaluate('nCr(5, 2)', 'DEG')).toBe(10)
  })
  it('rejects invalid mathematics', () => expect(() => evaluate('1 / 0', 'DEG')).toThrow('Math Error'))
})
