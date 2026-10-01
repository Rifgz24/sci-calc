import { useEffect, useRef, type ReactNode } from 'react'

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface ModalTrapProps {
  ariaLabel: string
  children: ReactNode
  className: string
  onClose: () => void
}

export default function ModalTrap({ ariaLabel, children, className, onClose }: ModalTrapProps) {
  const dialogRef = useRef<HTMLElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const dialog = dialogRef.current
    const focusFirst = () => (dialog?.querySelector<HTMLElement>('[data-modal-initial-focus], ' + focusableSelector) ?? dialog)?.focus()
    const frame = requestAnimationFrame(focusFirst)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab' || !dialog) return

      const controls = [...dialog.querySelectorAll<HTMLElement>(focusableSelector)].filter(control => !control.hasAttribute('disabled'))
      if (controls.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown)
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [])

  return <section ref={dialogRef} className={className} role="dialog" aria-modal="true" aria-label={ariaLabel} tabIndex={-1}>{children}</section>
}
