import { useMemo, useState } from 'react'
import { constants, searchConstants } from '../engine/phase3'
import { convertUnit, units, type UnitCategory } from '../converter/units'
import CurrencyConverter from './CurrencyConverter'

const categories = Object.keys(units) as UnitCategory[]
const formatNumber = (value: number) => Number.isInteger(value) ? String(value) : value.toPrecision(10)

type ConverterTab = 'units' | 'currency' | 'constants'

export default function ConverterMode() {
  const [category, setCategory] = useState<UnitCategory>('length')
  const [from, setFrom] = useState(units.length[2])
  const [to, setTo] = useState(units.length[3])
  const [value, setValue] = useState('1')
  const [tab, setTab] = useState<ConverterTab>('units')
  const [query, setQuery] = useState('')
  const selectedUnits = units[category]
  const output = useMemo(() => {
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) return ''
    try { return formatNumber(convertUnit(parsed, category, from, to)) } catch { return '' }
  }, [category, from, to, value])
  const matches = useMemo(() => searchConstants(query).slice(0, 15), [query])
  const changeCategory = (next: UnitCategory) => { setCategory(next); setFrom(units[next][0]); setTo(units[next][1] ?? units[next][0]) }

  return <div className="engineering-mode converter-mode">
    <div className="tool-heading"><div><span className="eyebrow">GLOBAL CONVERSION</span><h2>Converter</h2></div><span className="tool-badge">UNITS + CURRENCY + CONSTANTS</span></div>
    <div className="tool-tabs" role="tablist" aria-label="Converter tools">{([['units', 'Units'], ['currency', 'Currency'], ['constants', 'Constants']] as const).map(([id, label]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)} role="tab" aria-selected={tab === id}>{label}</button>)}</div>
    {tab === 'units' && <div className="tool-card stat-panel">
      <label>Category<select value={category} onChange={event => changeCategory(event.target.value as UnitCategory)}>{categories.map(item => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}</select></label>
      <label>Value<input value={value} onChange={event => setValue(event.target.value)} inputMode="decimal" /></label>
      <div className="conversion-grid"><label>From<select value={from} onChange={event => setFrom(event.target.value)}>{selectedUnits.map(item => <option key={item}>{item}</option>)}</select></label><div className="swap-mark" aria-hidden="true">→</div><label>To<select value={to} onChange={event => setTo(event.target.value)}>{selectedUnits.map(item => <option key={item}>{item}</option>)}</select></label></div>
      {output && <div className="conversion-output" aria-live="polite"><span>{value} {from}</span><strong>{output}</strong><span>{to}</span></div>}
    </div>}
    {tab === 'currency' && <div className="tool-card"><CurrencyConverter /></div>}
    {tab === 'constants' && <div className="tool-card constants-panel"><label htmlFor="const-search" className="search-field">Search constants<input id="const-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="speed, π, avogadro…" aria-label="Search constants by name or symbol" /></label><div className="constant-list" role="list">{(query ? matches : constants.slice(0, 10)).map(item => <div className="constant-row" key={`${item.name}-${item.unit}`} role="listitem" tabIndex={0}><div><strong>{item.symbol}</strong><span>{item.name}</span><span className="const-category">{item.category}</span></div><code>{item.value.toPrecision(8)}{item.unit && ` ${item.unit}`}</code></div>)}{query && matches.length === 0 && <p className="mode-hint" role="status">No constants match "{query}". Try broader terms.</p>}{!query && <p className="mode-hint">Type to search by name, symbol, or category</p>}</div></div>}
  </div>
}
