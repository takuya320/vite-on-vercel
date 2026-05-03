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

- **Node.js `>=24.0.0`** (`.nvmrc` で `24` を指定 / Node 24 LTS、Vercel のデフォルトランタイムに整合)
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
│  │  ├─ ButtonTest.tsx     # ルートコンポーネント (PascalCase = 機能名)
│  │  └─ components/        # 機能内で閉じる UI 部品
│  ├─ component-test/
│  │  ├─ ComponentTest.tsx
│  │  └─ components/
│  └─ table-test/
│     └─ TableTest.tsx
├─ assets/
└─ test/                # Vitest 用ユーティリティ
```

## Conventions

ディレクトリ・命名規約は以下のとおりです。新規機能を追加するときも揃えてください。

- **`src/features/<kebab-case>/`** ─ 1 機能 1 ディレクトリ。機能間の依存は禁止し、共通化は `src/` 直下のレイヤ (将来的に `components/` `lib/` など) へ引き上げる
- **エントリは `<PascalCase>.tsx`** ─ ディレクトリ名と対応する 1 ファイル (例: `button-test/ButtonTest.tsx`) が `router.tsx` の `element` で参照される唯一の公開点
- **`components/` (複数形) を使用** ─ 機能内で閉じる UI 部品の置き場所。`component/` (単数) は使わない
- **テストは併置** ─ 対象ファイルの隣に `*.test.tsx` を置く方針 (現状は `src/test/` にサンプル 1 件のみ)

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

## CI / Dependency Management

- **CI**: `.github/workflows/test.yml` が PR トリガーで `pnpm lint` と `pnpm test` を実行
  - `actions/setup-node` で `.nvmrc` の Node バージョンに合わせ、pnpm キャッシュを有効化
  - `pnpm install --frozen-lockfile` により `pnpm-lock.yaml` を信頼の単一ソースとして扱う
- **Lockfile**: `pnpm-lock.yaml` は必ずコミット。Vercel ビルドおよび CI 双方が frozen install を期待するため、ローカルでの `pnpm install` 結果も含めて PR に乗せる
- **依存更新**: Dependabot (`.github/dependabot.yml`) が weekly で minor/patch を 1 グループ PR にまとめる。major は明示的に除外しており、人手で追従するポリシー
- **Actions ピン留め**: GitHub Actions は SHA で固定 (Dependabot が `github-actions` エコシステムでも weekly に追従)

## Lint / Formatting

- **`pnpm lint` は Prettier の `--write` を呼ぶフォーマッタコマンド**で、ESLint は現状未導入です。CI でも同コマンドを実行するため、フォーマット差分が残った PR は失敗します
- **ESLint 不在の理由**: 本リポジトリはコンポーネント検証用途で実装範囲が小さく、`tsc` の型チェックと Prettier の整形で実害が出ていないため。React/TS のリンターを入れるなら `typescript-eslint` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` の最小セットを想定 (今後の拡張時に検討)
- **コマンド名の注意**: `lint` という名前ですが静的解析は行いません。ルール違反検出ではなく整形目的です

## Testing Strategy

> 現状はサンプルテストのみ。以降は本セクションを **方針** として扱います。

### 何をテストするか / しないか

| 対象                                            | 方針                                                                                                  |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| ルート単位のレンダリング (`features/*/<Name>.tsx`) | ✅ 必須。`@testing-library/react` でユーザー視点の振る舞いをテスト                                    |
| 機能内ロジック (純関数 / カスタムフック)          | ✅ 必須。Vitest で単体テスト                                                                          |
| `components/` 配下の UI 部品                     | ⚠️ 振る舞いに分岐があるもののみ。見た目だけの薄いラッパーは対象外                                     |
| `router.tsx` のルーティング設定                  | ⚠️ パスとコンポーネントの対応を 1 件サニティチェック (e2e に任せても良い)                            |
| Chakra UI / TanStack Table 等のサードパーティ   | ❌ ライブラリ動作のテストはしない                                                                     |

### 階層と粒度

- **単体テスト (Vitest + jsdom)**: 純粋ロジック、フック、小さなコンポーネント。`pnpm test` で実行
- **コンポーネントテスト (Vitest + Testing Library)**: features のルートコンポーネントを中心に、ユーザー操作とレンダリング結果を検証
- **E2E**: 本リポジトリでは扱わない (必要になれば Playwright を別途導入)

### カバレッジ運用

- `pnpm coverage` で `@vitest/coverage-v8` を実行
- **数値目標は設定しない**（カバレッジ率を追うと「テスト価値の薄いコード」を量産しがち）。代わりに "新規 features 追加時にルートコンポーネントの振る舞いテストを必ず 1 本書く" という運用ルールを最低ラインとする
- カバレッジレポートは PR 内では確認用にとどめ、CI のゲート条件にはしない

### テスト配置規約

- 対象ファイルと **同一ディレクトリ** に `*.test.tsx` / `*.test.ts` を置く
- 共有のテストユーティリティ (factory, MSW handler 等) は `src/test/` に集約
- 統合的にレンダリングを行うヘルパー (`renderWithProviders` 等) を `src/test/` に追加することを推奨
