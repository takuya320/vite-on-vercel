import { useToast } from '@chakra-ui/react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import {
  INTERVENTION_TYPE_LABEL,
  type Intervention,
  type InterventionImpact,
  type InterventionStatus,
} from '../data'
import StatusBadge from './StatusBadge'

type Props = {
  data: Intervention[]
}

const columns: ColumnDef<Intervention>[] = [
  {
    accessorKey: 'performedAt',
    header: '実施時刻',
    cell: ({ getValue }) => <span className="dash-table__time">{String(getValue() ?? '')}</span>,
  },
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ getValue }) => <span className="dash-table__id">{String(getValue() ?? '')}</span>,
    enableSorting: false,
  },
  {
    accessorKey: 'impact',
    header: '影響度',
    cell: ({ getValue }) => <StatusBadge kind="impact" value={getValue() as InterventionImpact} />,
  },
  {
    accessorKey: 'type',
    header: '種別',
    cell: ({ getValue }) => (
      <span className="dash-meta-pill">{INTERVENTION_TYPE_LABEL[getValue() as Intervention['type']]}</span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'target',
    header: '対象',
    cell: ({ getValue }) => <span className="dash-table__service">{String(getValue() ?? '')}</span>,
    enableSorting: false,
  },
  {
    accessorKey: 'summary',
    header: '内容',
    cell: ({ getValue }) => <p className="dash-table__summary">{String(getValue() ?? '')}</p>,
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: 'ステータス',
    cell: ({ getValue }) => <StatusBadge kind="status" value={getValue() as InterventionStatus} />,
  },
  {
    accessorKey: 'adminName',
    header: '実施者',
    cell: ({ getValue }) => <span className="dash-table__owner">{String(getValue() ?? '')}</span>,
    enableSorting: false,
  },
]

export default function DataTable({ data }: Props) {
  const toast = useToast()
  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable<Intervention>({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  function openIntervention(iv: Intervention) {
    toast({
      title: `${iv.id} の詳細を開きます`,
      description: `${INTERVENTION_TYPE_LABEL[iv.type]} · ${iv.summary}`,
      status: 'info',
      duration: 2200,
      position: 'top-right',
    })
  }

  return (
    <div className="dash-card dash-tablecard dash-reveal" data-i={5}>
      <div className="dash-card__head">
        <div>
          <h3 className="dash-card__title">最近の介入</h3>
          <div className="dash-card__sub">過去24時間 / Adminによるサービス操作</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="dash-btn dash-btn--ghost"
            type="button"
            onClick={() =>
              toast({
                title: 'フィルタはモックです',
                description: '本実装では impact / type / status による絞り込みを提供します。',
                status: 'info',
                duration: 1800,
                position: 'top-right',
              })
            }
          >
            フィルタ
          </button>
          <button
            className="dash-btn"
            type="button"
            onClick={() =>
              toast({
                title: '介入履歴一覧へ遷移（モック）',
                status: 'info',
                duration: 1500,
                position: 'top-right',
              })
            }
          >
            すべて表示 →
          </button>
        </div>
      </div>
      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => {
                  const canSort = h.column.getCanSort()
                  const sorted = h.column.getIsSorted()
                  return (
                    <th
                      key={h.id}
                      onClick={canSort ? h.column.getToggleSortingHandler() : undefined}
                      style={canSort ? { cursor: 'pointer', userSelect: 'none' } : undefined}
                      title={canSort ? 'クリックで並び替え' : undefined}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {sorted === 'asc' && ' ▲'}
                      {sorted === 'desc' && ' ▼'}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                tabIndex={0}
                onClick={() => openIntervention(row.original)}
                onKeyDown={(e) =>
                  (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), openIntervention(row.original))
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
