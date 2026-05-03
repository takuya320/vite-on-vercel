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
import type { Incident } from '../data'
import StatusBadge from './StatusBadge'

type Props = {
  data: Incident[]
}

const columns: ColumnDef<Incident>[] = [
  {
    accessorKey: 'occurredAt',
    header: '発生時刻',
    cell: ({ getValue }) => <span className="dash-table__time">{String(getValue() ?? '')}</span>,
  },
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ getValue }) => <span className="dash-table__id">{String(getValue() ?? '')}</span>,
    enableSorting: false,
  },
  {
    accessorKey: 'severity',
    header: '重要度',
    cell: ({ getValue }) => <StatusBadge kind="severity" value={getValue() as 'P1' | 'P2' | 'P3'} />,
  },
  {
    accessorKey: 'service',
    header: 'サービス',
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
    cell: ({ getValue }) => <StatusBadge kind="status" value={getValue() as Incident['status']} />,
  },
  {
    accessorKey: 'owner',
    header: '担当',
    cell: ({ getValue }) => <span className="dash-table__owner">{String(getValue() ?? '')}</span>,
    enableSorting: false,
  },
]

export default function DataTable({ data }: Props) {
  const toast = useToast()
  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable<Incident>({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  function openIncident(inc: Incident) {
    toast({
      title: `${inc.id} の詳細を開きます`,
      description: `${inc.service} · ${inc.severity} · ${inc.summary}`,
      status: 'info',
      duration: 2200,
      position: 'top-right',
    })
  }

  return (
    <div className="dash-card dash-tablecard dash-reveal" data-i={5}>
      <div className="dash-card__head">
        <div>
          <h3 className="dash-card__title">未対応インシデント</h3>
          <div className="dash-card__sub">過去24時間</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="dash-btn dash-btn--ghost"
            type="button"
            onClick={() =>
              toast({
                title: 'フィルタはモックです',
                description: '本実装では severity / status / service による絞り込みを提供します。',
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
                title: 'インシデント一覧へ遷移（モック）',
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
                onClick={() => openIncident(row.original)}
                onKeyDown={(e) =>
                  (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), openIncident(row.original))
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
