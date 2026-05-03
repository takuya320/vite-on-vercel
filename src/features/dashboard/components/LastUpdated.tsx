type Props = {
  at: string
}

export default function LastUpdated({ at }: Props) {
  return (
    <span className="dash-lastupdated">
      <span className="dash-lastupdated__dot" aria-hidden />
      <span>
        Last sync <b>{at}</b>
      </span>
    </span>
  )
}
