# Vite on Vercel

Vite + React で構築した SPA を Vercel にデプロイするサンプルプロジェクトです。Chakra UI / TanStack Table / React Router を組み合わせた UI コンポーネントの動作確認用ページを含みます。

デプロイ先: <https://vite-on-vercel.vercel.app/>

## Why Vite on Vercel

Next.js / Remix のような SSR フレームワークではなく、あえて **Vite による SPA + Vercel ホスティング** という構成を選択しています。

- **対象ユースケース**: 認証後の管理画面・社内ツールなど、SEO や初回 LCP より「コンポーネント検証速度」と「ビルド時間」を優先したいケース
- **トレードオフ**:
  - ✅ ビルド・HMR が高速、フロントの自由度が高い、デプロイ設定が単純
  - ❌ SSR / ISR / RSC が使えない、SEO・OGP は別途対応が必要、Edge での動的処理は別途関数で実装
- **代替案**: SEO・SSR が必要になった場合は Next.js (App Router) への移行を想定

## Tech Stack

- [Vite](https://vitejs.dev/) 8 + [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)
- [React](https://react.dev/) 18
- [React Router](https://reactrouter.com/) v6 (Browser Router)
- [Chakra UI](https://chakra-ui.com/) v2
- [TanStack Table](https://tanstack.com/table) v8
- [Vitest](https://vitest.dev/) 4 + v8 coverage
- [@vercel/analytics](https://vercel.com/docs/analytics)
- TypeScript 5 / Prettier

## Requirements

- **Node.js `>=22.0.0`** (`.nvmrc` で `22` を指定 / Vite 8 が Node 20.19+ を要求するため LTS の 22 を採用)
- **pnpm 10** (`package.json` の `packageManager` で固定)

`nvm` 利用者は `nvm use` で `.nvmrc` のバージョンに切り替わります。

## Getting Started

```sh
nvm use            # .nvmrc に従い Node 22 を有効化
pnpm install
pnpm dev
```

開発サーバー起動後、ブラウザで <http://localhost:5173> を開きます。

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
├─ main.tsx             # エントリポイント (RouterProvider + Analytics)
├─ router.tsx           # React Router 定義
├─ features/            # 機能単位のページ
│  ├─ button-test/
│  ├─ component-test/
│  └─ table-test/
├─ assets/
└─ test/                # Vitest 用ユーティリティ
```

## Vercel Configuration

`vercel.json` でフレームワークプリセットと SPA フォールバックを明示しています。

```json
{
  "framework": "vite",
  "rewrites": [
    { "source": "/((?!assets/).*)", "destination": "/index.html" }
  ]
}
```

- **`framework: "vite"`**: Vercel のビルドコマンド・出力ディレクトリ (`dist/`) を Vite プリセットに揃える
- **`rewrites`**: クライアントサイドルーティング (`/component-test` など) を直リンクで開いたときに 404 にならないよう、`/assets/*` 以外を `index.html` にフォールバック

### Analytics

`@vercel/analytics/react` の `<Analytics />` を `src/main.tsx` でマウントしています。Vercel にデプロイされた環境でのみ自動的に計測が有効化され、ローカル開発・プレビューでは no-op として動作します。無効化したい場合はそのコンポーネントを外してください。

## Environment Variables

現状、本リポジトリのアプリケーションコードは環境変数に依存していません。今後 API キーなどを利用する場合は次の運用を推奨します。

- `.env.local` (gitignore 済み) にローカル値を記述
- 公開可能なテンプレートとして `.env.example` をリポジトリに追加
- Vite 経由でクライアントへ露出する変数は **必ず `VITE_` プレフィックス** を付ける（それ以外は Vite が露出させない）
- Vercel のシークレットは `vercel env pull` で `.env.local` に取得

## Deployment

`main` ブランチへの push でプロダクションデプロイ、それ以外のブランチ・PR ではプレビューデプロイが自動生成されます。

- ビルドコマンド: `pnpm build` (`tsc` による型チェック → `vite build`)
- 出力ディレクトリ: `dist/`
- フレームワークプリセット: Vite (`vercel.json` で固定)

## Testing

- ランナー: Vitest 4
- 実行範囲: `src/**/*.{test,spec}.{ts,tsx,...}` (`vite.config.ts` で設定)
- カバレッジ: `@vitest/coverage-v8` (`pnpm coverage`)

現状はサンプルテストのみ。今後は features ごとの振る舞いテストを追加していく方針。
