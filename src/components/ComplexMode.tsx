import { useCallback, useState } from 'react'
import { parseComplex, complexOperation, complexMagnitude, complexArgument, formatComplex } from '../engine/phase2'

type ComplexOp = 'add' | 'subtract' | 'multiply' | 'divide' | 'magnitude' | 'argument'

export default function ComplexMode() {
  const [complexA, setComplexA] = useState('')
  const [complexB, setComplexB] = useState('')
  const [operation, setOperation] = useState<ComplexOp>('add')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const calculate = useCallback(() => {
    setError('')
    try {
      const a = parseComplex(complexA)
      if (operation === 'magnitude') return setResult(`|z| = ${complexMagnitude(a).toFixed(6)}`)
      if (operation === 'argument') return setResult(`arg(z) = ${(complexArgument(a) * 180 / Math.PI).toFixed(6)}°`)
      const b = parseComplex(complexB)
      const output = complexOperation(a, b, operation === 'add' ? '+' : operation === 'subtract' ? '-' : operation === 'multiply' ? '×' : '÷')
      setResult(formatComplex(output))
    } catch (caught) {
      setError((caught as Error).message)
    }
  }, [complexA, complexB, operation])

  return <div className="complex-mode">
    <div className="stat-panel">
      <label>z₁ (a + bi)<input value={complexA} onChange={e => setComplexA(e.target.value)} placeholder="3+4i" /></label>
      <label>Operation<select value={operation} onChange={e => setOperation(e.target.value as ComplexOp)}>
        <option value="add">z₁ + z₂</option>
        <option value="subtract">z₁ − z₂</option>
        <option value="multiply">z₁ × z₂</option>
        <option value="divide">z₁ ÷ z₂</option>
        <option value="magnitude">|z₁|</option>
        <option value="argument">arg(z₁)</option>
      </select></label>
      {!['magnitude', 'argument'].includes(operation) && <label>z₂<input value={complexB} onChange={e => setComplexB(e.target.value)} placeholder="1+2i" /></label>}
      <button onClick={calculate}>Calculate</button>
    </div>
    {result && <div className="mode-result">{result}</div>}
    {error && <div className="stat-error">{error}</div>}
  </div>
}
