import { useCallback, useState } from 'react'
import { solveLinear, solveSystem2, solveQuadratic, formatComplex, type ComplexNumber } from '../engine/phase2'

type EqnTab = 'linear' | 'system2' | 'quadratic'

export default function EqnMode() {
  const [tab, setTab] = useState<EqnTab>('linear')
  const [linearA, setLinearA] = useState('')
  const [linearB, setLinearB] = useState('')
  const [system2A1, setSystem2A1] = useState('')
  const [system2B1, setSystem2B1] = useState('')
  const [system2C1, setSystem2C1] = useState('')
  const [system2A2, setSystem2A2] = useState('')
  const [system2B2, setSystem2B2] = useState('')
  const [system2C2, setSystem2C2] = useState('')
  const [quadA, setQuadA] = useState('')
  const [quadB, setQuadB] = useState('')
  const [quadC, setQuadC] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const solveLinearEq = useCallback(() => {
    setError('')
    try {
      const a = Number(linearA)
      const b = Number(linearB)
      if (!Number.isFinite(a) || !Number.isFinite(b)) throw new Error('Enter valid coefficients')
      const x = solveLinear(a, b)
      setResult(`x = ${Number(x.toPrecision(12))}`)
    } catch (caught) {
      setError((caught as Error).message)
    }
  }, [linearA, linearB])

  const solveSystem2Eq = useCallback(() => {
    setError('')
    try {
      const a1 = Number(system2A1), b1 = Number(system2B1), c1 = Number(system2C1)
      const a2 = Number(system2A2), b2 = Number(system2B2), c2 = Number(system2C2)
      if (![a1, b1, c1, a2, b2, c2].every(Number.isFinite)) throw new Error('Enter valid coefficients')
      const [x, y] = solveSystem2([a1, b1, c1], [a2, b2, c2])
      setResult(`x = ${Number(x.toPrecision(12))}\ny = ${Number(y.toPrecision(12))}`)
    } catch (caught) {
      setError((caught as Error).message)
    }
  }, [system2A1, system2B1, system2C1, system2A2, system2B2, system2C2])

  const solveQuadraticEq = useCallback(() => {
    setError('')
    try {
      const a = Number(quadA), b = Number(quadB), c = Number(quadC)
      if (![a, b, c].every(Number.isFinite)) throw new Error('Enter valid coefficients')
      const roots = solveQuadratic(a, b, c)
      setResult(roots.map((root, index) => typeof root === 'number' ? `x${index + 1} = ${Number(root.toPrecision(12))}` : `x${index + 1} = ${formatComplex(root as ComplexNumber)}`).join('\n'))
    } catch (caught) {
      setError((caught as Error).message)
    }
  }, [quadA, quadB, quadC])

  return <div className="eqn-mode">
    <div className="stat-tabs">
      <button className={`stat-tab ${tab === 'linear' ? 'active' : ''}`} onClick={() => setTab('linear')}>Linear</button>
      <button className={`stat-tab ${tab === 'system2' ? 'active' : ''}`} onClick={() => setTab('system2')}>2-Var System</button>
      <button className={`stat-tab ${tab === 'quadratic' ? 'active' : ''}`} onClick={() => setTab('quadratic')}>Quadratic</button>
    </div>

    {tab === 'linear' && <div className="stat-panel">
      <p className="mode-hint">ax + b = 0</p>
      <label>a (coefficient)<input type="number" value={linearA} onChange={e => setLinearA(e.target.value)} placeholder="2" /></label>
      <label>b (constant)<input type="number" value={linearB} onChange={e => setLinearB(e.target.value)} placeholder="6" /></label>
      <button onClick={solveLinearEq}>Solve</button>
    </div>}

    {tab === 'system2' && <div className="stat-panel">
      <p className="mode-hint">a₁x + b₁y = c₁<br/>a₂x + b₂y = c₂</p>
      <div className="equation-row">
        <label>a₁<input type="number" value={system2A1} onChange={e => setSystem2A1(e.target.value)} placeholder="2" /></label>
        <label>b₁<input type="number" value={system2B1} onChange={e => setSystem2B1(e.target.value)} placeholder="3" /></label>
        <label>c₁<input type="number" value={system2C1} onChange={e => setSystem2C1(e.target.value)} placeholder="8" /></label>
      </div>
      <div className="equation-row">
        <label>a₂<input type="number" value={system2A2} onChange={e => setSystem2A2(e.target.value)} placeholder="1" /></label>
        <label>b₂<input type="number" value={system2B2} onChange={e => setSystem2B2(e.target.value)} placeholder="-1" /></label>
        <label>c₂<input type="number" value={system2C2} onChange={e => setSystem2C2(e.target.value)} placeholder="1" /></label>
      </div>
      <button onClick={solveSystem2Eq}>Solve</button>
    </div>}

    {tab === 'quadratic' && <div className="stat-panel">
      <p className="mode-hint">ax² + bx + c = 0</p>
      <label>a<input type="number" value={quadA} onChange={e => setQuadA(e.target.value)} placeholder="1" /></label>
      <label>b<input type="number" value={quadB} onChange={e => setQuadB(e.target.value)} placeholder="-5" /></label>
      <label>c<input type="number" value={quadC} onChange={e => setQuadC(e.target.value)} placeholder="6" /></label>
      <button onClick={solveQuadraticEq}>Solve</button>
    </div>}

    {result && <div className="mode-result"><pre>{result}</pre></div>}
    {error && <div className="stat-error">{error}</div>}
  </div>
}
