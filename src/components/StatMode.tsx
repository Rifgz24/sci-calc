import { useCallback, useState } from 'react'
import { statistics, linearRegression, parseNumberList, type StatisticsSummary, type Regression } from '../engine/phase2'

export interface StatModeProps { }

type StatTab = 'data' | 'univariate' | 'regression'

export default function StatMode({  }: StatModeProps) {
  const [dataInput, setDataInput] = useState('')
  const [regressionX, setRegressionX] = useState('')
  const [regressionY, setRegressionY] = useState('')
  const [tab, setTab] = useState<StatTab>('data')
  const [univariateStat, setUnivariateStat] = useState<StatisticsSummary | null>(null)
  const [regressionStat, setRegressionStat] = useState<Regression | null>(null)
  const [error, setError] = useState('')

  const calculateUnivariate = useCallback(() => {
    setError('')
    try {
      const values = parseNumberList(dataInput)
      setUnivariateStat(statistics(values))
    } catch (caught) {
      setError((caught as Error).message)
    }
  }, [dataInput])

  const calculateRegression = useCallback(() => {
    setError('')
    try {
      const xValues = parseNumberList(regressionX)
      const yValues = parseNumberList(regressionY)
      setRegressionStat(linearRegression(xValues, yValues))
    } catch (caught) {
      setError((caught as Error).message)
    }
  }, [regressionX, regressionY])

  return <div className="stat-mode">
    <div className="stat-tabs">
      <button className={`stat-tab ${tab === 'data' ? 'active' : ''}`} onClick={() => setTab('data')}>Data Input</button>
      <button className={`stat-tab ${tab === 'univariate' ? 'active' : ''}`} onClick={() => setTab('univariate')}>1-Var Stats</button>
      <button className={`stat-tab ${tab === 'regression' ? 'active' : ''}`} onClick={() => setTab('regression')}>Regression</button>
    </div>

    {tab === 'data' && <div className="stat-panel">
      <label>Enter data (comma or space separated)<textarea value={dataInput} onChange={e => setDataInput(e.target.value)} placeholder="1 2 3 4 5" rows={3} /></label>
      <button onClick={calculateUnivariate}>Calculate Stats</button>
    </div>}

    {tab === 'univariate' && univariateStat && <div className="stat-results">
      <div className="stat-row"><span>n</span><strong>{univariateStat.count}</strong></div>
      <div className="stat-row"><span>Σx</span><strong>{univariateStat.sum.toFixed(6)}</strong></div>
      <div className="stat-row"><span>Σx²</span><strong>{univariateStat.sumSquares.toFixed(6)}</strong></div>
      <div className="stat-row"><span>Mean</span><strong>{univariateStat.mean.toFixed(6)}</strong></div>
      <div className="stat-row"><span>σ (pop)</span><strong>{univariateStat.standardDeviation.toFixed(6)}</strong></div>
      <div className="stat-row"><span>σ (sample)</span><strong>{univariateStat.sampleStandardDeviation.toFixed(6)}</strong></div>
      <div className="stat-row"><span>Min</span><strong>{univariateStat.minimum.toFixed(6)}</strong></div>
      <div className="stat-row"><span>Max</span><strong>{univariateStat.maximum.toFixed(6)}</strong></div>
      <div className="stat-row"><span>Range</span><strong>{univariateStat.range.toFixed(6)}</strong></div>
    </div>}

    {tab === 'regression' && <div className="stat-panel">
      <label>X values<textarea value={regressionX} onChange={e => setRegressionX(e.target.value)} placeholder="1 2 3 4 5" rows={2} /></label>
      <label>Y values<textarea value={regressionY} onChange={e => setRegressionY(e.target.value)} placeholder="2 4 6 8 10" rows={2} /></label>
      <button onClick={calculateRegression}>Calculate Regression</button>
    </div>}

    {tab === 'regression' && regressionStat && <div className="stat-results">
      <div className="stat-row"><span>y = a + bx</span></div>
      <div className="stat-row"><span>a (intercept)</span><strong>{regressionStat.intercept.toFixed(6)}</strong></div>
      <div className="stat-row"><span>b (slope)</span><strong>{regressionStat.slope.toFixed(6)}</strong></div>
      <div className="stat-row"><span>r</span><strong>{regressionStat.correlation.toFixed(6)}</strong></div>
      <div className="stat-row"><span>r²</span><strong>{regressionStat.rSquared.toFixed(6)}</strong></div>
    </div>}

    {error && <div className="stat-error">{error}</div>}
  </div>
}
