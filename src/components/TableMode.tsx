import { useCallback, useState } from 'react'
import { generateFunctionTable } from '../engine/phase3'

const formatValue = (value: number) => Number.isInteger(value) ? String(value) : value.toPrecision(8)

export default function TableMode() {
  const [expression, setExpression] = useState('x^2 + 2*x + 1')
  const [variable, setVariable] = useState('x')
  const [start, setStart] = useState('-2')
  const [end, setEnd] = useState('2')
  const [step, setStep] = useState('1')
  const [rows, setRows] = useState<{ x: number; y: number }[]>([])
  const [error, setError] = useState('')

  const generate = useCallback(() => {
    setError('')
    try {
      const first = Number(start)
      const last = Number(end)
      const increment = Number(step)
      if (!expression.trim() || !variable.trim() || !Number.isFinite(first) || !Number.isFinite(last) || !Number.isFinite(increment) || increment <= 0 || last < first) throw new Error('Use valid range and positive step')
      const count = Math.min(500, Math.floor((last - first) / increment))
      setRows(generateFunctionTable(expression, variable.trim(), first, first + count * increment, count))
    } catch (caught) {
      setRows([])
      setError((caught as Error).message)
    }
  }, [end, expression, start, step, variable])

  return <div className="engineering-mode table-mode">
    <div className="tool-heading"><div><span className="eyebrow">FUNCTION EXPLORER</span><h2>Table</h2></div><span className="tool-badge">MAX 500 ROWS</span></div>
    <div className="tool-card stat-panel">
      <label>Function<input value={expression} onChange={event => setExpression(event.target.value)} placeholder="x^2 + 2*x + 1" /></label>
      <div className="field-grid field-grid-2"><label>Variable<input value={variable} onChange={event => setVariable(event.target.value)} maxLength={2} /></label><label>Step<input value={step} onChange={event => setStep(event.target.value)} inputMode="decimal" /></label></div>
      <div className="field-grid field-grid-2"><label>Start<input value={start} onChange={event => setStart(event.target.value)} inputMode="decimal" /></label><label>End<input value={end} onChange={event => setEnd(event.target.value)} inputMode="decimal" /></label></div>
      <button className="primary-action" onClick={generate}>Generate table</button>
    </div>
    {rows.length > 0 && <div className="table-card"><div className="table-scroll"><table><thead><tr><th>{variable}</th><th>f({variable})</th></tr></thead><tbody>{rows.map(row => <tr key={`${row.x}-${row.y}`}><td>{formatValue(row.x)}</td><td>{formatValue(row.y)}</td></tr>)}</tbody></table></div><p className="mode-hint">{rows.length} values generated from {start} to {end}.</p></div>}
    {error && <div className="stat-error" role="alert">{error}</div>}
  </div>
}
