export default function SkipLink({ targetId = 'main-content' }: { targetId?: string }) {
  return <a className="skip-link" href={`#${targetId}`}>Skip to calculator</a>
}
