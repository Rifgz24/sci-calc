import { useCallback, useState } from 'react'
import { parseMatrix, matrixAdd, matrixMultiply, matrixTranspose, matrixDeterminant, matrixInverse, formatMatrix } from '../engine/phase2'

type MatrixOp = 'add' | 'subtract' | 'multiply' | 'transpose' | 'determinant' | 'inverse'

export default function MatrixMode() {
  const [matrixA, setMatrixA] = useState('')
  const [matrixB, setMatrixB] = useState('')
  const [operation, setOperation] = useState<MatrixOp>('add')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const calculate = useCallback(() => {
    setError('')
    try {
      const a = parseMatrix(matrixA)
      if (operation === 'transpose') return setResult(formatMatrix(matrixTranspose(a)))
      if (operation === 'determinant') return setResult(`det = ${matrixDeterminant(a)}`)
      if (operation === 'inverse') return setResult(formatMatrix(matrixInverse(a)))
      const b = parseMatrix(matrixB)
      if (operation === 'add') setResult(formatMatrix(matrixAdd(a, b)))
      else if (operation === 'subtract') setResult(formatMatrix(matrixAdd(a, b, -1)))
      else if (operation === 'multiply') setResult(formatMatrix(matrixMultiply(a, b)))
    } catch (caught) {
      setError((caught as Error).message)
    }
  }, [matrixA, matrixB, operation])

  return <div className="matrix-mode">
    <div className="stat-panel">
      <label>Matrix A (rows: 1,2;3,4)<textarea value={matrixA} onChange={e => setMatrixA(e.target.value)} placeholder="1,2;3,4" rows={2} /></label>
      <label>Operation<select value={operation} onChange={e => setOperation(e.target.value as MatrixOp)}>
        <option value="add">A + B</option>
        <option value="subtract">A − B</option>
        <option value="multiply">A × B</option>
        <option value="transpose">Transpose A</option>
        <option value="determinant">Determinant A</option>
        <option value="inverse">Inverse A</option>
      </select></label>
      {!['transpose', 'determinant', 'inverse'].includes(operation) && <label>Matrix B<textarea value={matrixB} onChange={e => setMatrixB(e.target.value)} placeholder="5,6;7,8" rows={2} /></label>}
      <button onClick={calculate}>Calculate</button>
    </div>
    {result && <div className="mode-result"><pre>{result}</pre></div>}
    {error && <div className="stat-error">{error}</div>}
  </div>
}
