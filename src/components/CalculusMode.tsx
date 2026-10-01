import { useCallback, useState } from 'react'
import { numericalDerivative, numericalIntegral } from '../engine/phase3'

type CalculusTask = 'derivative' | 'integral'

const formatNumber = (value: number) => Number.isInteger(value) ? String(value) : value.toPrecision(10)

export default function CalculusMode() {
  const [task, setTask] = useState<CalculusTask>('derivative')
  const [expression, setExpression] = useState('x^2 + 3*x')
  const [variable, setVariable] = useState('x')
  const [point, setPoint] = useState('2')
  const [lower, setLower] = useState('0')
  const [upper, setUpper] = useState('5')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const calculate = useCallback(() => {
    setError('')
    try {
      if (!expression.trim() || !variable.trim()) throw new Error('Function and variable are required')
      const value = task === 'derivative'
        ? numericalDerivative(expression, variable.trim(), Number(point))
        : numericalIntegral(expression, variable.trim(), Number(lower), Number(upper))
      if (!Number.isFinite(value)) throw new Error('Result is not finite')
      setResult(task === 'derivative' ? `f′(${point}) = ${formatNumber(value)}` : `∫${lower}→${upper} f(${variable}) d${variable} = ${formatNumber(value)}`)
    } catch (caught) {
      setResult('')
      setError((caught as Error).message)
    }
  }, [expression, lower, point, task, upper, variable])

  return <div className="engineering-mode calculus-mode">
    <div className="tool-heading"><div><span className="eyebrow">NUMERICAL TOOLS</span><h2>Calculus</h2></div><span className="tool-badge">PHASE 3</span></div>
    <div className="tool-tabs" role="tablist" aria-label="Calculus operation">
      <button className={task === 'derivative' ? 'active' : ''} onClick={() => setTask('derivative')} role="tab" aria-selected={task === 'derivative'}>Derivative</button>
      <button className={task === 'integral' ? 'active' : ''} onClick={() => setTask('integral')} role="tab" aria-selected={task === 'integral'}>Definite integral</button>
    </div>
    <div className="tool-card stat-panel">
      <label>Function<input value={expression} onChange={event => setExpression(event.target.value)} placeholder="x^2 + 3*x" /></label>
      <div className="field-grid field-grid-3">
        <label>Variable<input value={variable} onChange={event => setVariable(event.target.value)} maxLength={2} /></label>
        {task === 'derivative' ? <label>At x<input value={point} onChange={event => setPoint(event.target.value)} inputMode="decimal" /></label> : <label>Lower bound<input value={lower} onChange={event => setLower(event.target.value)} inputMode="decimal" /></label>}
        {task === 'integral' && <label>Upper bound<input value={upper} onChange={event => setUpper(event.target.value)} inputMode="decimal" /></label>}
      </div>
      <button className="primary-action" onClick={calculate}>Calculate {task}</button>
    </div>
    {result && <div className="mode-result result-pop" aria-live="polite">{result}</div>}
    {error && <div className="stat-error" role="alert">{error}</div>}
    <p className="mode-hint">Uses numerical methods. Write multiplication explicitly, for example <code>2*x + 3</code>.</p>
  </div>
}
