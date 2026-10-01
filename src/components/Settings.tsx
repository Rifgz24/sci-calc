import { SlidersHorizontal, X } from 'lucide-react'
import ModalTrap from './ModalTrap'

export interface SettingsState {
  precision: number
  notation: string
  animations: boolean
  haptic: boolean
}

export interface SettingsProps {
  settings: SettingsState
  onSettingsChange: (settings: SettingsState) => void
  onClose: () => void
}

export default function Settings({ settings, onSettingsChange, onClose }: SettingsProps) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.currentTarget === event.target) onClose() }}>
    <ModalTrap className="settings glass" ariaLabel="Calculator settings" onClose={onClose}>
      <div className="side-heading">
        <div><span className="eyebrow">PREFERENCES</span><h2>Settings</h2></div>
        <button className="icon-button" data-modal-initial-focus onClick={onClose} aria-label="Close settings"><X size={18} /></button>
      </div>
      <label htmlFor="precision">Precision
        <select id="precision" value={settings.precision} onChange={event => onSettingsChange({ ...settings, precision: Number(event.target.value) })} aria-label="Select display precision">
          <option value="8">8 digits</option>
          <option value="12">12 digits</option>
          <option value="15">15 digits</option>
        </select>
      </label>
      <label htmlFor="notation">Number format
        <select id="notation" value={settings.notation} onChange={event => onSettingsChange({ ...settings, notation: event.target.value })} aria-label="Select number format">
          <option>NORM</option>
          <option>SCI</option>
          <option>FIX</option>
          <option>ENG</option>
        </select>
      </label>
      <label htmlFor="animations" className="check">
        <input id="animations" type="checkbox" checked={settings.animations} onChange={event => onSettingsChange({ ...settings, animations: event.target.checked })} aria-label="Toggle animations" /> Animations
      </label>
      <label htmlFor="haptic" className="check">
        <input id="haptic" type="checkbox" checked={settings.haptic} onChange={event => onSettingsChange({ ...settings, haptic: event.target.checked })} aria-label="Toggle haptic feedback" /> Haptic feedback
      </label>
      <div className="offline-status"><span className={navigator.onLine ? 'online' : 'offline'}>{navigator.onLine ? '● Online' : '○ Offline'}</span> · Currency rates {navigator.onLine ? 'can update' : 'use cache'}</div>
      <div className="saved-note"><SlidersHorizontal size={16} aria-hidden="true" /> Settings save automatically</div>
    </ModalTrap>
  </div>
}
