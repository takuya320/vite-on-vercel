import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import React from 'react'

type Prefecture = {
  // 都道府県名
  name: string
  // 県庁所在地
  capital: string
  // 人口
  population: number
  // 面積
  area: number
  // 東京からの移動時間（分）
  timeFromTokyo: number
  // 東京からの移動費用（円）
  costFromTokyo: number
}

const prefectures: Prefecture[] = [
  {
    name: '北海道',
    capital: '札幌',
    population: 5381733,
    area: 83424.97,
    timeFromTokyo: 60,
    costFromTokyo: 22000,
  },
  {
    name: '愛知県',
    capital: '名古屋',
    population: 7483128,
    area: 5172.92,
    timeFromTokyo: 100,
    costFromTokyo: 10000,
  },
  {
    name: '京都府',
    capital: '京都',
    population: 2589816,
    area: 4612.19,
    timeFromTokyo: 140,
    costFromTokyo: 13000,
  },
  {
    name: '石川県',
    capital: '金沢',
    population: 1154008,
    area: 4186.09,
    timeFromTokyo: 150,
    costFromTokyo: 14000,
  },
  {
    name: '福岡県',
    capital: '福岡',
    population: 5101556,
    area: 4986.4,
    timeFromTokyo: 120,
    costFromTokyo: 12000,
  },
  {
    name: '静岡県',
    capital: '静岡',
    population: 3637998,
    area: 7777.63,
    timeFromTokyo: 60,
    costFromTokyo: 6000,
  },
]

const columns: ColumnDef<Prefecture>[] = [
  {
    accessorKey: 'name',
    header: '都道府県',
  },
  {
    accessorKey: 'capital',
    header: '県庁所在地',
  },
  {
    accessorKey: 'population',
    header: '人口',
  },
  {
    accessorKey: 'area',
    header: '面積',
  },
  {
    accessorKey: 'timeFromTokyo',
    header: '東京からの移動時間（分）',
  },
  {
    accessorKey: 'costFromTokyo',
    header: '東京からの移動費用（円）',
  },
]

const TableTest: React.FC = () => {
  const table = useReactTable<Prefecture>({
    data: prefectures,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <React.Fragment>
      <TableContainer overflowX="auto">
        <Table variant="striped" colorScheme="teal" size="md" boxShadow="md">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id} textTransform="uppercase" fontWeight="bold">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id} textAlign="center" padding="4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </React.Fragment>
  )
}
export default TableTest
