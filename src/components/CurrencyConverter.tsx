import { RefreshCw, ArrowLeftRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { convertCurrency } from '../converter/currency'
import { useCurrencyRates } from '../hooks/useCurrencyRates'

const formatAmount = (value: number, currency: string) => new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 4 }).format(value)

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('EUR')
  const { snapshot, loading, error, refresh, isStale } = useCurrencyRates('USD')
  const currencies = useMemo(() => snapshot ? Object.keys(snapshot.rates).sort() : ['USD', 'EUR'], [snapshot])
  const output = useMemo(() => {
    if (!snapshot || !amount.trim()) return ''
    try { return formatAmount(convertCurrency(Number(amount), from, to, snapshot), to) } catch { return '' }
  }, [amount, from, snapshot, to])
  const swap = () => { setFrom(to); setTo(from) }

  return <div className="currency-converter">
    <label>Amount<input value={amount} onChange={event => setAmount(event.target.value)} inputMode="decimal" /></label>
    <div className="conversion-grid">
      <label>From<select value={from} onChange={event => setFrom(event.target.value)}>{currencies.map(code => <option key={code}>{code}</option>)}</select></label>
      <button className="icon-button swap-icon" onClick={swap} aria-label="Swap"><ArrowLeftRight size={16} /></button>
      <label>To<select value={to} onChange={event => setTo(event.target.value)}>{currencies.map(code => <option key={code}>{code}</option>)}</select></label>
    </div>
    <button className="primary-action" onClick={() => void refresh()} disabled={loading}>
      <RefreshCw size={14} className={loading ? 'spin' : ''} style={{ marginRight: 8, verticalAlign: 'middle' }} />
      {loading ? 'Fetching rates…' : 'Refresh rates'}
    </button>
    {output && <div className="conversion-output" aria-live="polite"><span>{amount} {from}</span><strong>{output}</strong><span>{to}</span></div>}
    {error && <div className="stat-error" role="alert">{error}</div>}
    {snapshot && <div className="offline-status">
      <span className={isStale ? 'offline' : 'online'}>{isStale ? '○ Stale' : '● Live'}</span> · {snapshot.source} · {snapshot.rateDate}
    </div>}
  </div>
}
