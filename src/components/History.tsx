import { History as HistoryIcon } from 'lucide-react'

export interface HistoryItem { expression: string; result: string }

export interface HistoryProps {
  items: HistoryItem[]
  onSelect: (expression: string) => void
}

export default function History({ items, onSelect }: HistoryProps) {
  return <aside className="side-panel glass" role="region" aria-label="Calculation history">
    <div className="side-heading"><div><span className="eyebrow">RECENT</span><h2>History</h2></div><HistoryIcon size={19} aria-hidden="true" /></div>
    {items.length ? items.map((item, index) => <button className="history-item" key={`${item.expression}-${index}`} onClick={() => onSelect(item.expression)} title={`${item.expression} = ${item.result}`} aria-label={`Calculation: ${item.expression} equals ${item.result}`}><span>{item.expression}</span><strong>= {item.result}</strong></button>) : <div className="empty"><HistoryIcon size={30} aria-hidden="true" /><p>Your calculations appear here.</p></div>}
  </aside>
}
