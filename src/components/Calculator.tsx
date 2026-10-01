import { Delete } from 'lucide-react'
import { AngleUnit, VariableScope } from '../engine/evaluate'

export interface CalculatorProps {
  expression: string
  completedExpression: string
  result: string
  error: string
  angle: AngleUnit
  memory: number
  variables: VariableScope
  onExpressionChange: (value: string) => void
  onAppend: (key: string) => void
  onAngleChange: (unit: AngleUnit) => void
  onMemoryAction: (action: 'add' | 'subtract' | 'read' | 'clear' | 'store') => void
  onStoreVariable: (name: string) => void
  onShowFunctions: (show: boolean) => void
  showFunctions: boolean
}

const keys = [['sin(', 'cos(', 'tan(', 'ln(', 'log('], ['(', ')', 'π', '^', '√('], ['7', '8', '9', '÷', '⌫'], ['4', '5', '6', '×', '−'], ['1', '2', '3', '+', '='], ['0', '.', 'Ans', 'AC', 'ƒ']]
const functions = ['asin(', 'acos(', 'atan(', 'sinh(', 'cosh(', 'tanh(', 'sqrt(', 'abs(', 'factorial(', 'nPr(', 'nCr(', 'e']
const variableNames = ['A', 'B', 'C', 'D', 'E', 'F', 'X', 'Y']

export default function Calculator({ expression, completedExpression, result, error, angle, memory, variables, onExpressionChange, onAppend, onAngleChange, onMemoryAction, onStoreVariable, onShowFunctions, showFunctions }: CalculatorProps) {
  const handleKeyPress = (key: string) => {
    if (key === 'ƒ') onShowFunctions(!showFunctions)
    else onAppend(key)
  }

  return <div className="calculator glass">
    <div className="mode-row"><div><span className="eyebrow">CALCULATION MODE</span><h1>Scientific</h1></div><div className="angle-switch">{(['DEG', 'RAD', 'GRAD'] as AngleUnit[]).map(unit => <button key={unit} className={angle === unit ? 'active' : ''} onClick={() => onAngleChange(unit)} aria-pressed={angle === unit}>{unit}</button>)}</div></div>
    <div className={`display ${expression ? 'editing' : 'calculated'}`} aria-live="polite" aria-atomic="true">
      {expression ? (
        <>
          <span className="display-label">INPUT</span>
          <strong key={`input-${expression}`} className="input-active" aria-label={`Input: ${expression}`}>{expression}</strong>
          {result !== '0' && <span className="preview"><span>PREVIEW</span>{result}</span>}
        </>
      ) : (
        <>
          <span className="expression-dim">{error ? 'Error' : completedExpression || 'Ready'}</span>
          <strong key={`result-${result}-${completedExpression}`} className="result-active" aria-label={`Result: ${result}`}>{result}</strong>
        </>
      )}
      {error && <span className="error" role="alert">{error}</span>}
    </div>
    <div className="memory-row">{[['M+', 'add'], ['M−', 'subtract'], ['MR', 'read'], ['MC', 'clear'], ['MS', 'store']].map(([label, action]) => <button key={label} onClick={() => onMemoryAction(action as 'add')} title={`Memory ${label}`} aria-label={`Memory ${label}`}>{label}</button>)}<span className="memory-value" aria-label={`Memory: ${memory}`}>M {memory.toFixed(2)}</span></div>
    <div className="keypad" role="group" aria-label="Calculator keypad">{keys.flat().map(key => <button key={key} className={`key ${key === '=' ? 'equals' : ''} ${['AC', '⌫', '÷', '×', '−', '+', '^'].includes(key) ? 'operator' : ''}`} onClick={() => handleKeyPress(key)} aria-label={key === '⌫' ? 'Delete' : key === '=' ? 'Calculate' : key === 'AC' ? 'All Clear' : key === 'Ans' ? 'Use last answer' : key === 'ƒ' ? 'Function drawer' : key} aria-expanded={key === 'ƒ' ? showFunctions : undefined}>{key === '⌫' ? <Delete size={19} aria-hidden="true" /> : key}</button>)}</div>
    {showFunctions && <div className="function-drawer" role="group" aria-label="Advanced functions">{functions.map(key => <button key={key} onClick={() => onAppend(key)} title={key}>{key}</button>)}</div>}
    <div className="variables-row" role="group" aria-label="Variable slots"><span className="eyebrow">VARIABLES</span>{variableNames.map(name => <button key={name} className="var-btn" onClick={() => variables[name] !== undefined ? onExpressionChange(expression + name) : onStoreVariable(name)} aria-label={variables[name] !== undefined ? `Append variable ${name}, value ${variables[name]}` : `Store result as ${name}`} title={variables[name] !== undefined ? `${name}=${variables[name]}` : ''}>{name}</button>)}</div>
  </div>
}
