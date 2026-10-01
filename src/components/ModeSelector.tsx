import { BarChart3, Zap, Sigma, Grid3X3, ArrowRight, Hash, Table2, Binary, Ruler } from 'lucide-react'

export type CalculatorMode = 'CALC' | 'STAT' | 'EQN' | 'MATRIX' | 'VECTOR' | 'COMPLEX' | 'CALCULUS' | 'BASE' | 'CONVERTER' | 'TABLE'

export interface ModeSelectorProps {
  currentMode: CalculatorMode
  onModeChange: (mode: CalculatorMode) => void
}

const modes: { id: CalculatorMode; label: string; icon: React.ReactNode }[] = [
  { id: 'CALC', label: 'CALC', icon: <Zap size={16} /> },
  { id: 'STAT', label: 'STAT', icon: <BarChart3 size={16} /> },
  { id: 'EQN', label: 'EQN', icon: <Sigma size={16} /> },
  { id: 'MATRIX', label: 'MAT', icon: <Grid3X3 size={16} /> },
  { id: 'VECTOR', label: 'VEC', icon: <ArrowRight size={16} /> },
  { id: 'COMPLEX', label: 'CPLX', icon: <Hash size={16} /> },
  { id: 'CALCULUS', label: 'CALC', icon: <Sigma size={16} /> },
  { id: 'BASE', label: 'BASE', icon: <Binary size={16} /> },
  { id: 'CONVERTER', label: 'CONV', icon: <Ruler size={16} /> },
  { id: 'TABLE', label: 'TBL', icon: <Table2 size={16} /> },
]

export default function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  return <div className="mode-selector">
    {modes.map(mode => <button key={mode.id} className={`mode-button ${currentMode === mode.id ? 'active' : ''}`} onClick={() => onModeChange(mode.id)} aria-pressed={currentMode === mode.id} title={mode.label}>{mode.icon}<span>{mode.label}</span></button>)}
  </div>
}
