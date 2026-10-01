import { describe, expect, it } from 'vitest'
import { convertCurrency, type CurrencyRates } from './currency'

const snapshot: CurrencyRates = { base: 'USD', rates: { USD: 1, EUR: 0.8, IDR: 16000 }, fetchedAt: '2026-10-01T00:00:00.000Z', rateDate: '2026-09-30', source: 'test' }

describe('currency conversion', () => {
  it('converts from base currency', () => {
    expect(convertCurrency(10, 'USD', 'EUR', snapshot)).toBe(8)
  })

  it('converts between non-base currencies', () => {
    expect(convertCurrency(16000, 'IDR', 'EUR', snapshot)).toBeCloseTo(0.8)
  })

  it('rejects unavailable currencies', () => {
    expect(() => convertCurrency(1, 'USD', 'JPY', snapshot)).toThrow('Currency unavailable')
  })
})
