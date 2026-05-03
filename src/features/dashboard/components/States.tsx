type CommonProps = {
  title: string
  description?: string
}

const I_CHECK = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const I_DOT = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="6" cy="12" r="1.5" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="18" cy="12" r="1.5" fill="currentColor" />
  </svg>
)
const I_BANG = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 8v5M12 16v.01M3 20h18L12 4 3 20z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export function EmptyState({ title, description }: CommonProps) {
  return (
    <div className="dash-state" role="status">
      <div className="dash-state__icon" style={{ color: 'var(--dash-positive)' }}>
        {I_CHECK}
      </div>
      <p className="dash-state__title">{title}</p>
      {description && <p className="dash-state__desc">{description}</p>}
    </div>
  )
}

export function LoadingState({ title, description }: CommonProps) {
  return (
    <div className="dash-state" role="status" aria-live="polite">
      <div className="dash-state__icon">{I_DOT}</div>
      <p className="dash-state__title">{title}</p>
      {description && <p className="dash-state__desc">{description}</p>}
      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
        <span className="dash-skel" style={{ width: 60, height: 8 }} />
        <span className="dash-skel" style={{ width: 40, height: 8 }} />
        <span className="dash-skel" style={{ width: 80, height: 8 }} />
      </div>
    </div>
  )
}

export function ErrorState({ title, description, onRetry }: CommonProps & { onRetry?: () => void }) {
  return (
    <div className="dash-state" role="alert">
      <div className="dash-state__icon" style={{ color: 'var(--dash-negative)' }}>
        {I_BANG}
      </div>
      <p className="dash-state__title">{title}</p>
      {description && <p className="dash-state__desc">{description}</p>}
      {onRetry && (
        <button className="dash-btn" type="button" onClick={onRetry} style={{ marginTop: 8 }}>
          再試行
        </button>
      )}
    </div>
  )
}
