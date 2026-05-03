import { useToast } from '@chakra-ui/react'
import type { RankingItem } from '../data'

type Props = {
  items: RankingItem[]
}

export default function RankingList({ items }: Props) {
  const toast = useToast()

  function open(item: RankingItem) {
    toast({
      title: `${item.name} の詳細`,
      description: `${item.meta} · 売上 ${item.value}（前週比 ${item.delta >= 0 ? '+' : ''}${item.delta.toFixed(1)}%）`,
      status: 'info',
      duration: 2000,
      position: 'top-right',
    })
  }

  return (
    <div className="dash-card dash-rank dash-reveal" data-i={4}>
      <div className="dash-card__head">
        <div>
          <h3 className="dash-card__title">売上上位顧客</h3>
          <div className="dash-card__sub">過去7日 / 売上順</div>
        </div>
        <button
          className="dash-btn dash-btn--ghost"
          type="button"
          onClick={() =>
            toast({
              title: '顧客一覧ページへ遷移します（モック）',
              status: 'info',
              duration: 1600,
              position: 'top-right',
            })
          }
        >
          全件表示
        </button>
      </div>
      <ol className="dash-rank__list" aria-label="GMV 上位顧客">
        {items.map((item) => (
          <li
            key={item.rank}
            className="dash-rank__item"
            tabIndex={0}
            role="button"
            aria-label={`${item.name} ${item.value}`}
            onClick={() => open(item)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open(item))}
          >
            <span className="dash-rank__num">{String(item.rank).padStart(2, '0')}</span>
            <div>
              <p className="dash-rank__name">{item.name}</p>
              <span className="dash-rank__meta">{item.meta}</span>
            </div>
            <div className="dash-rank__right">
              <div className="dash-rank__value">{item.value}</div>
              <span className={`dash-rank__delta dash-rank__delta--${item.delta >= 0 ? 'up' : 'down'}`}>
                <span aria-hidden>{item.delta >= 0 ? '▲' : '▼'}</span>
                {item.delta >= 0 ? '+' : ''}
                {item.delta.toFixed(1)}%
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
