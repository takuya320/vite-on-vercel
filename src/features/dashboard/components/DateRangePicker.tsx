import { useEffect, useMemo, useRef, useState } from 'react'

type Range = { start: Date; end: Date }

type Props = {
  value: Range
  onChange: (next: Range) => void
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

export function formatDate(d: Date): string {
  return `${d.getFullYear()} / ${pad2(d.getMonth() + 1)} / ${pad2(d.getDate())}`
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1)
}

function buildGrid(year: number, month: number): Date[] {
  const firstWeekday = new Date(year, month, 1).getDay()
  return Array.from({ length: 42 }, (_, i) => new Date(year, month, i - firstWeekday + 1))
}

export default function DateRangePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [pickStart, setPickStart] = useState<Date | null>(null)
  const [pickEnd, setPickEnd] = useState<Date | null>(null)
  const [hover, setHover] = useState<Date | null>(null)
  const [view, setView] = useState<Date>(() => new Date(value.end.getFullYear(), value.end.getMonth(), 1))
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    setPickStart(value.start)
    setPickEnd(value.end)
    setView(new Date(value.end.getFullYear(), value.end.getMonth(), 1))
    setHover(null)
  }, [open, value.start, value.end])

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function handleClickDay(day: Date) {
    if (!pickStart || (pickStart && pickEnd)) {
      setPickStart(day)
      setPickEnd(null)
      return
    }
    let s = pickStart
    let e = day
    if (e < s) [s, e] = [e, s]
    setPickStart(s)
    setPickEnd(e)
    onChange({ start: s, end: e })
    window.setTimeout(() => setOpen(false), 140)
  }

  function applyPreset(days: number) {
    const today = startOfDay(new Date())
    const past = new Date(today)
    past.setDate(today.getDate() - (days - 1))
    onChange({ start: past, end: today })
    setOpen(false)
  }

  const months = useMemo(() => {
    const prev = addMonths(view, -1)
    return [
      { y: prev.getFullYear(), m: prev.getMonth(), days: buildGrid(prev.getFullYear(), prev.getMonth()) },
      { y: view.getFullYear(), m: view.getMonth(), days: buildGrid(view.getFullYear(), view.getMonth()) },
    ]
  }, [view])

  const today = startOfDay(new Date())
  const lo =
    pickStart && (pickEnd ?? hover) ? (pickStart < (pickEnd ?? hover)! ? pickStart : (pickEnd ?? hover!)) : null
  const hi =
    pickStart && (pickEnd ?? hover) ? (pickStart < (pickEnd ?? hover)! ? (pickEnd ?? hover!) : pickStart) : null

  return (
    <div className="dash-daterange-wrap" ref={wrap}>
      <div className="dash-daterange">
        <button
          type="button"
          className="dash-daterange__date dash-daterange__btn"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M2 6.5h12M6 1.5v3M10 1.5v3" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          {formatDate(value.start)}
        </button>
        <span className="dash-daterange__sep" />
        <button
          type="button"
          className="dash-daterange__date dash-daterange__btn"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          {formatDate(value.end)}
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ marginLeft: 4, opacity: 0.55 }}>
            <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="dash-cal" role="dialog" aria-label="期間を選択">
          <div className="dash-cal__head">
            <button
              type="button"
              className="dash-cal__nav"
              onClick={() => setView((v) => addMonths(v, -1))}
              aria-label="前月へ"
            >
              ‹
            </button>
            <div className="dash-cal__head-spacer" />
            <button
              type="button"
              className="dash-cal__nav"
              onClick={() => setView((v) => addMonths(v, 1))}
              aria-label="翌月へ"
            >
              ›
            </button>
          </div>

          <div className="dash-cal__months">
            {months.map((g, gi) => (
              <div key={gi} className="dash-cal__month" data-side={gi === 0 ? 'left' : 'right'}>
                <div className="dash-cal__month-title">
                  {g.y}年 {g.m + 1}月
                </div>
                <div className="dash-cal__weekdays">
                  {WEEKDAYS.map((w, wi) => (
                    <span key={w} data-wi={wi}>
                      {w}
                    </span>
                  ))}
                </div>
                <div className="dash-cal__grid">
                  {g.days.map((d) => {
                    const outside = d.getMonth() !== g.m
                    const isStart = pickStart && isSameDay(d, pickStart)
                    const isEnd = pickEnd && isSameDay(d, pickEnd)
                    const inRange = lo && hi && d >= lo && d <= hi
                    const isToday = isSameDay(d, today)
                    const cls = [
                      'dash-cal__day',
                      outside && 'dash-cal__day--outside',
                      isToday && 'dash-cal__day--today',
                      inRange && 'dash-cal__day--in-range',
                      isStart && 'dash-cal__day--start',
                      isEnd && 'dash-cal__day--end',
                    ]
                      .filter(Boolean)
                      .join(' ')
                    return (
                      <button
                        key={`${gi}-${d.getTime()}`}
                        className={cls}
                        type="button"
                        tabIndex={outside ? -1 : 0}
                        onClick={() => !outside && handleClickDay(d)}
                        onMouseEnter={() => !outside && setHover(d)}
                        onMouseLeave={() => setHover(null)}
                        aria-label={`${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`}
                      >
                        {d.getDate()}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="dash-cal__foot">
            <span className="dash-cal__foot-label">クイック選択</span>
            <button type="button" className="dash-cal__preset" onClick={() => applyPreset(1)}>
              今日
            </button>
            <button type="button" className="dash-cal__preset" onClick={() => applyPreset(7)}>
              過去7日
            </button>
            <button type="button" className="dash-cal__preset" onClick={() => applyPreset(30)}>
              過去30日
            </button>
            <button type="button" className="dash-cal__preset" onClick={() => applyPreset(90)}>
              過去90日
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
