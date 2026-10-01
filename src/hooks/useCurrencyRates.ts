import { useCallback, useEffect, useState } from 'react'
import { fetchCurrencyRates, isCurrencyStale, readCurrencyCache, type CurrencyRates } from '../converter/currency'

export function useCurrencyRates(base = 'USD') {
  const [snapshot, setSnapshot] = useState<CurrencyRates | null>(() => readCurrencyCache(base))
  const [loading, setLoading] = useState(!snapshot)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try { setSnapshot(await fetchCurrencyRates(base)) } catch (caught) { setError((caught as Error).message) } finally { setLoading(false) }
  }, [base])

  useEffect(() => {
    const cached = readCurrencyCache(base)
    setSnapshot(cached)
    if (!cached || isCurrencyStale(cached)) void refresh()
  }, [base, refresh])

  return { snapshot, loading, error, refresh, isStale: snapshot ? isCurrencyStale(snapshot) : false }
}
