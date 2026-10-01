import { Settings2 } from 'lucide-react'

export interface TopbarProps {
  onSettingsClick: () => void
}

export default function Topbar({ onSettingsClick }: TopbarProps) {
  return <header className="topbar">
    <div className="brand">
      <img className="brand-mark" src="/calc.png" alt="" />
      <div>
        <strong>Engineering</strong>
        <span>Scientific Calculator</span>
      </div>
    </div>
    <div className="topbar-actions"><button className="icon-button" aria-label="Open settings" onClick={onSettingsClick}><Settings2 size={20} /></button></div>
  </header>
}
