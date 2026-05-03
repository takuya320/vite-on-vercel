# Vite on Vercel

Vite + React を Vercel にデプロイするサンプルプロジェクトです。Chakra UI や TanStack Table、React Router などを組み合わせた UI コンポーネントの動作確認用ページを含みます。

デプロイ先: <https://vite-on-vercel.vercel.app/>

## Tech Stack

- [Vite](https://vitejs.dev/) 8 + [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)
- [React](https://react.dev/) 18
- [React Router](https://reactrouter.com/) v6
- [Chakra UI](https://chakra-ui.com/) v2
- [TanStack Table](https://tanstack.com/table) v8
- [Vitest](https://vitest.dev/) 4 (+ v8 coverage)
- [@vercel/analytics](https://vercel.com/docs/analytics)
- TypeScript 5 / Prettier

## Requirements

- Node.js (推奨: 最新 LTS)
- pnpm 10 (`packageManager` で固定)

## Getting Started

```sh
pnpm install
pnpm dev
```

開発サーバーが起動したらブラウザで <http://localhost:5173> を開きます。

## Scripts

| コマンド          | 内容                                                       |
| ----------------- | ---------------------------------------------------------- |
| `pnpm dev`        | 開発サーバーを起動                                         |
| `pnpm build`      | 型チェック (`tsc`) と本番ビルド (`vite build`)             |
| `pnpm preview`    | ビルド結果をローカルでプレビュー                           |
| `pnpm test`       | Vitest をワンショット実行                                  |
| `pnpm coverage`   | Vitest をカバレッジ付きで実行                              |
| `pnpm lint`       | `src` 配下を Prettier でフォーマット                       |

## Routes

| Path              | コンポーネント                            |
| ----------------- | ----------------------------------------- |
| `/`               | `src/App.tsx`                             |
| `/component-test` | `src/features/component-test/...`         |
| `/table-test`     | `src/features/table-test/...`             |
| `/button-test`    | `src/features/button-test/...`            |

ルーティング定義は `src/router.tsx` にあります。

## Project Structure

```
src/
├─ App.tsx              # トップページ
├─ main.tsx             # エントリポイント
├─ router.tsx           # React Router 定義
├─ features/            # 機能単位のページ
│  ├─ button-test/
│  ├─ component-test/
│  └─ table-test/
├─ assets/
└─ test/                # Vitest 用ユーティリティ
```

## Deployment

Vercel にそのままデプロイできます。`main` ブランチへの push でプロダクションデプロイされます。
