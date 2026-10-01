import { useCallback, useState } from 'react'
import { parseVector, vectorOperation } from '../engine/phase2'

type VectorOp = 'add' | 'subtract' | 'dot' | 'cross' | 'angle' | 'magnitude'

export default function VectorMode() {
  const [vectorA, setVectorA] = useState('')
  const [vectorB, setVectorB] = useState('')
  const [operation, setOperation] = useState<VectorOp>('add')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const calculate = useCallback(() => {
    setError('')
    try {
      const a = parseVector(vectorA)
      if (operation === 'magnitude') return setResult(`|A| = ${(vectorOperation(a, [], 'magnitude') as number).toFixed(6)}`)
      const b = parseVector(vectorB)
      const output = vectorOperation(a, b, operation)
      if (typeof output === 'number') setResult(`${operation === 'dot' ? 'A · B' : operation === 'angle' ? '∠(A,B)'  : ''} = ${output.toFixed(6)}`)
      else setResult(`${operation === 'add' ? 'A + B' : operation === 'subtract' ? 'A − B' : 'A × B'} = [ ${(output as number[]).map(value => value.toFixed(6)).join(', ')} ]`)
    } catch (caught) {
      setError((caught as Error).message)
    }
  }, [vectorA, vectorB, operation])

  return <div className="vector-mode">
    <div className="stat-panel">
      <label>Vector A (2D or 3D)<input value={vectorA} onChange={e => setVectorA(e.target.value)} placeholder="1, 2, 3" /></label>
      <label>Operation<select value={operation} onChange={e => setOperation(e.target.value as VectorOp)}>
        <option value="add">A + B</option>
        <option value="subtract">A − B</option>
        <option value="dot">A · B (dot)</option>
        <option value="cross">A × B (cross)</option>
        <option value="angle">Angle</option>
        <option value="magnitude">|A|</option>
      </select></label>
      {operation !== 'magnitude' && <label>Vector B<input value={vectorB} onChange={e => setVectorB(e.target.value)} placeholder="4, 5, 6" /></label>}
      <button onClick={calculate}>Calculate</button>
    </div>
    {result && <div className="mode-result">{result}</div>}
    {error && <div className="stat-error">{error}</div>}
  </div>
}
