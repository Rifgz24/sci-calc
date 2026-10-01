export type CurrencyCode = string
export type CurrencyRates = { base: CurrencyCode; rates: Record<CurrencyCode, number>; fetchedAt: string; rateDate: string; source: string }

const endpoint = 'https://api.frankfurter.app/latest'
const cacheKey = 'calculator-currency-rates-v1'
export const currencyCacheTtl = 24 * 60 * 60 * 1000

export function convertCurrency(amount: number, from: CurrencyCode, to: CurrencyCode, snapshot: CurrencyRates): number {
  const fromRate = snapshot.rates[from]
  const toRate = snapshot.rates[to]
  if (!Number.isFinite(amount) || !Number.isFinite(fromRate) || fromRate <= 0 || !Number.isFinite(toRate) || toRate <= 0) throw new Error('Currency unavailable')
  const result = amount * toRate / fromRate
  if (!Number.isFinite(result)) throw new Error('Currency result is too large')
  return result
}

export function readCurrencyCache(base = 'USD'): CurrencyRates | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(`${cacheKey}:${base}`) ?? '') as CurrencyRates
    if (parsed.base !== base || !parsed.fetchedAt || !Number.isFinite(Date.parse(parsed.fetchedAt)) || !parsed.rates || !Object.values(parsed.rates).every(rate => Number.isFinite(rate) && rate > 0)) return null
    return parsed
  } catch { return null }
}

function writeCurrencyCache(snapshot: CurrencyRates) {
  localStorage.setItem(`${cacheKey}:${snapshot.base}`, JSON.stringify(snapshot))
}

export async function fetchCurrencyRates(base = 'USD', signal?: AbortSignal): Promise<CurrencyRates> {
  const response = await fetch(`${endpoint}?from=${encodeURIComponent(base)}`, { signal })
  if (!response.ok) throw new Error(`Currency service unavailable (${response.status})`)
  const payload = await response.json() as { base: string; date: string; rates: Record<string, number> }
  if (payload.base !== base || !payload.rates || !Object.values(payload.rates).every(rate => Number.isFinite(rate) && rate > 0)) throw new Error('Invalid currency data')
  if (Object.keys(payload.rates).length === 0) throw new Error('Invalid currency data')
  const snapshot: CurrencyRates = { base, rates: { [base]: 1, ...payload.rates }, fetchedAt: new Date().toISOString(), rateDate: payload.date, source: 'Frankfurter' }
  try { writeCurrencyCache(snapshot) } catch { /* Storage can be unavailable; live conversion still works. */ }
  return snapshot
}

export const isCurrencyStale = (snapshot: CurrencyRates) => {
  const fetchedAt = Date.parse(snapshot.fetchedAt)
  return !Number.isFinite(fetchedAt) || Date.now() - fetchedAt > currencyCacheTtl
}
