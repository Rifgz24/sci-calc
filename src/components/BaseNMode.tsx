import { useCallback, useState } from 'react'
import { Base, bitShift, bitwiseNot, bitwiseOperation, convertBase } from '../engine/phase3'

type Operation = 'convert' | 'AND' | 'OR' | 'XOR' | 'NAND' | 'NOR' | 'XNOR' | 'NOT' | 'SHIFT'
const bases: Base[] = ['DEC', 'BIN', 'OCT', 'HEX']
const formatBase = (value: string, base: Base) => base === 'DEC' ? value : `${value} (${base})`

export default function BaseNMode() {
  const [base, setBase] = useState<Base>('DEC')
  const [operation, setOperation] = useState<Operation>('convert')
  const [first, setFirst] = useState('255')
  const [second, setSecond] = useState('15')
  const [target, setTarget] = useState<Base>('HEX')
  const [direction, setDirection] = useState<'left' | 'right'>('left')
  const [shift, setShift] = useState('1')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const calculate = useCallback(() => {
    setError('')
    try {
      const output = operation === 'convert'
        ? convertBase(first, base, target)
        : operation === 'NOT'
          ? bitwiseNot(first, base)
          : operation === 'SHIFT'
            ? bitShift(first, Number(shift), direction, base)
            : bitwiseOperation(first, second, operation, base)
      setResult(formatBase(output, operation === 'convert' ? target : base))
    } catch (caught) {
      setResult('')
      setError((caught as Error).message)
    }
  }, [base, direction, first, operation, second, shift, target])

  return <div className="engineering-mode base-mode">
    <div className="tool-heading"><div><span className="eyebrow">DIGITAL LOGIC</span><h2>Base-N</h2></div><span className="tool-badge">DEC · BIN · OCT · HEX</span></div>
    <div className="tool-card stat-panel">
      <div className="tool-tabs compact-tabs" role="tablist" aria-label="Base operation">
        <button className={operation === 'convert' ? 'active' : ''} onClick={() => setOperation('convert')} role="tab" aria-selected={operation === 'convert'}>Convert</button>
        <button className={operation !== 'convert' ? 'active' : ''} onClick={() => setOperation('AND')} role="tab" aria-selected={operation !== 'convert'}>Bitwise</button>
      </div>
      <div className="field-grid field-grid-2">
        <label>Input base<select value={base} onChange={event => setBase(event.target.value as Base)}>{bases.map(value => <option key={value}>{value}</option>)}</select></label>
        {operation === 'convert' ? <label>Output base<select value={target} onChange={event => setTarget(event.target.value as Base)}>{bases.map(value => <option key={value}>{value}</option>)}</select></label> : <label>Operation<select value={operation} onChange={event => setOperation(event.target.value as Operation)}>{['AND', 'OR', 'XOR', 'NAND', 'NOR', 'XNOR', 'NOT', 'SHIFT'].map(value => <option key={value}>{value}</option>)}</select></label>}
      </div>
      <label>{operation === 'convert' ? `Value (${base})` : `First value (${base})`}<input value={first} onChange={event => setFirst(event.target.value)} inputMode="numeric" /></label>
      {operation !== 'convert' && !['NOT', 'SHIFT'].includes(operation) && <label>Second value ({base})<input value={second} onChange={event => setSecond(event.target.value)} inputMode="numeric" /></label>}
      {operation === 'SHIFT' && <div className="field-grid field-grid-2"><label>Direction<select value={direction} onChange={event => setDirection(event.target.value as 'left' | 'right')}><option value="left">Left ←</option><option value="right">Right →</option></select></label><label>Bits<input value={shift} onChange={event => setShift(event.target.value)} inputMode="numeric" /></label></div>}
      <button className="primary-action" onClick={calculate}>Run operation</button>
    </div>
    {result && <div className="mode-result result-pop" aria-live="polite"><span className="result-kicker">RESULT</span><strong>{result}</strong></div>}
    {error && <div className="stat-error" role="alert">{error}</div>}
  </div>
}
