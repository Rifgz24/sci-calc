import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import type { AngleUnit, VariableScope } from './engine/evaluate'
import { evaluate, formatResult } from './engine/evaluate'
import Calculator from './components/Calculator'
import ModeSelector, { type CalculatorMode } from './components/ModeSelector'
const StatMode = lazy(() => import('./components/StatMode'))
const EqnMode = lazy(() => import('./components/EqnMode'))
const MatrixMode = lazy(() => import('./components/MatrixMode'))
const VectorMode = lazy(() => import('./components/VectorMode'))
const ComplexMode = lazy(() => import('./components/ComplexMode'))
const CalculusMode = lazy(() => import('./components/CalculusMode'))
const BaseNMode = lazy(() => import('./components/BaseNMode'))
const ConverterMode = lazy(() => import('./components/ConverterMode'))
const TableMode = lazy(() => import('./components/TableMode'))
const History = lazy(() => import('./components/History'))
const Settings = lazy(() => import('./components/Settings'))
import Topbar from './components/Topbar'
import SkipLink from './components/SkipLink'

type HistoryItem = { expression: string; result: string }
const readStorage = <T,>(key: string, fallback: T, validate?: (v: unknown) => boolean): T => {
  try {
    const stored = JSON.parse(localStorage.getItem(key) ?? '')
    return validate && !validate(stored) ? fallback : stored as T
  } catch {
    return fallback
  }
}

export default function App() {
  const [expression, setExpression] = useState('')
  const [completedExpression, setCompletedExpression] = useState('')
  const [result, setResult] = useState('0')
  const [angle, setAngle] = useState<AngleUnit>('DEG')
  const [history, setHistory] = useState<HistoryItem[]>(() => readStorage('calculator-history', [], v => Array.isArray(v) && v.every(item => item && typeof item.expression === 'string' && typeof item.result === 'string')))
  const [error, setError] = useState('')
  const [lastAnswer, setLastAnswer] = useState(() => readStorage('calculator-ans', '0', v => typeof v === 'string' || typeof v === 'number'))
  const [memory, setMemory] = useState(() => readStorage('calculator-memory', 0, v => typeof v === 'number' && Number.isFinite(v)))
  const [variables, setVariables] = useState<VariableScope>(() => readStorage(
    'calculator-variables',
    {},
    (v: unknown): v is VariableScope => Boolean(
      v && typeof v === 'object' && !Array.isArray(v) && Object.values(v).every(val => typeof val === 'number' && Number.isFinite(val)),
    ),
  ))
  const [showFunctions, setShowFunctions] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState(() => readStorage(
    'calculator-settings',
    { precision: 12, notation: 'NORM', animations: true, haptic: false },
    (v: unknown): v is { precision: number; notation: string; animations: boolean; haptic: boolean } => Boolean(
      v && typeof v === 'object' && 'precision' in v && 'notation' in v && 'animations' in v && 'haptic' in v &&
      typeof v.precision === 'number' && Number.isInteger(v.precision) && v.precision >= 1 && v.precision <= 15 &&
      typeof v.notation === 'string' && ['NORM', 'SCI', 'ENG'].includes(v.notation) &&
      typeof v.animations === 'boolean' && typeof v.haptic === 'boolean',
    ),
  ))
  const [mode, setMode] = useState<CalculatorMode>(() => readStorage('calculator-mode', 'CALC', v => typeof v === 'string' && ['CALC', 'STAT', 'EQN', 'MATRIX', 'VECTOR', 'COMPLEX', 'CALCULUS', 'BASE', 'CONVERTER', 'TABLE'].includes(v)))

  useEffect(() => {
    try { localStorage.setItem('calculator-history', JSON.stringify(history)) } catch { /* storage full or unavailable */ }
    try { localStorage.setItem('calculator-ans', JSON.stringify(lastAnswer)) } catch { /* storage full or unavailable */ }
    try { localStorage.setItem('calculator-memory', JSON.stringify(memory)) } catch { /* storage full or unavailable */ }
    try { localStorage.setItem('calculator-variables', JSON.stringify(variables)) } catch { /* storage full or unavailable */ }
    try { localStorage.setItem('calculator-settings', JSON.stringify(settings)) } catch { /* storage full or unavailable */ }
    try { localStorage.setItem('calculator-mode', JSON.stringify(mode)) } catch { /* storage full or unavailable */ }
  }, [history, lastAnswer, memory, variables, settings, mode])

  const vibrate = () => { if (settings.haptic && 'vibrate' in navigator) navigator.vibrate(8) }
  const append = (key: string) => {
    vibrate()
    setError('')
    if (key === 'AC') return void (setExpression(''), setCompletedExpression(''), setResult('0'))
    if (key === '⌫') return void setExpression(value => value.slice(0, -1))
    if (key === '=') return calculate()
    if (key === 'Ans') return setExpression(value => value + lastAnswer)
    setExpression(value => value + key)
  }
  const calculate = () => {
    if (!expression.trim()) return
    try {
      const answer = formatResult(evaluate(expression, angle, { ...variables, M: memory, Ans: Number(lastAnswer) }), settings.precision, settings.notation)
      setResult(answer)
      setLastAnswer(answer)
      setHistory(items => [{ expression, result: answer }, ...items].slice(0, 8))
      setCompletedExpression(expression)
      setExpression('')
    } catch {
      setError('Math Error · Check expression')
      setResult('Error')
    }
  }
  const memoryAction = (action: 'add' | 'subtract' | 'read' | 'clear' | 'store') => {
    const value = Number(result)
    if (action === 'add' && Number.isFinite(value)) setMemory(memory + value)
    if (action === 'subtract' && Number.isFinite(value)) setMemory(memory - value)
    if (action === 'read') setExpression(value => value + String(memory))
    if (action === 'clear') setMemory(0)
    if (action === 'store' && Number.isFinite(value)) setMemory(value)
  }
  const storeVariable = (name: string) => { const value = Number(result); if (Number.isFinite(value)) setVariables(current => ({ ...current, [name]: value })) }
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target
      if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(target.tagName))) return
      if (showSettings || event.altKey || event.ctrlKey || event.metaKey) return
    if (event.key === 'Enter') { event.preventDefault(); calculate() }
      else if (event.key === 'Backspace') append('⌫')
      else if (/^[0-9.+\-*/^()]$/.test(event.key)) append(event.key.replace('*', '×').replace('/', '÷'))
    }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey)
  }, [expression, angle, variables, memory, lastAnswer, settings.precision, settings.notation, showSettings])

  const modeLoader = (children: ReactNode, label: string) => <Suspense fallback={<div className="mode-placeholder glass" role="status" aria-label={label}><span>{label}</span></div>}>{children}</Suspense>

  return <main className={`shell ${settings.animations ? '' : 'reduced-motion'}`} style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
    <SkipLink />
    <Topbar onSettingsClick={() => setShowSettings(true)} />
    <ModeSelector currentMode={mode} onModeChange={setMode} />
    <section className="workspace" id="main-content" tabIndex={-1} aria-label="Calculator workspace" aria-live="polite" aria-atomic="false">
      {mode === 'CALC' && <Calculator
        expression={expression}
        completedExpression={completedExpression}
        result={result}
        error={error}
        angle={angle}
        memory={memory}
        variables={variables}
        onExpressionChange={setExpression}
        onAppend={append}
        onAngleChange={setAngle}
        onMemoryAction={memoryAction}
        onStoreVariable={storeVariable}
        onShowFunctions={setShowFunctions}
        showFunctions={showFunctions}
      />}
      {mode === 'STAT' && modeLoader(<StatMode />, 'Loading Statistics…')}
      {mode === 'EQN' && modeLoader(<EqnMode />, 'Loading Equations…')}
      {mode === 'MATRIX' && modeLoader(<MatrixMode />, 'Loading Matrices…')}
      {mode === 'VECTOR' && modeLoader(<VectorMode />, 'Loading Vectors…')}
      {mode === 'COMPLEX' && modeLoader(<ComplexMode />, 'Loading Complex…')}
      {mode === 'CALC' && <Suspense fallback={<div className="mode-placeholder glass" role="status">Loading history…</div>}><History items={history} onSelect={setExpression} /></Suspense>}
      {mode === 'CALCULUS' && modeLoader(<CalculusMode />, 'Loading Calculus…')}
      {mode === 'BASE' && modeLoader(<BaseNMode />, 'Loading Base-N…')}
      {mode === 'CONVERTER' && modeLoader(<ConverterMode />, 'Loading Converter…')}
      {mode === 'TABLE' && modeLoader(<TableMode />, 'Loading Table…')}
    </section>
    {showSettings && <Suspense fallback={null}><Settings settings={settings} onSettingsChange={setSettings} onClose={() => setShowSettings(false)} /></Suspense>}
    <footer><span>Precision engine · offline ready</span><span><kbd>Enter</kbd> calculate <kbd>⌫</kbd> delete</span></footer>
  </main>
}
