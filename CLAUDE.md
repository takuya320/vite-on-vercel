# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

`README.md` の "Scripts" にユーザー向けのコマンド一覧があります。Claude が実行する際の注意点のみここに記載します。

- **pnpm のバージョンは `pnpm@10.33.2` に固定**（`package.json#packageManager`）。ローカルの pnpm が古いと `ERR_PNPM_BAD_PM_VERSION` で即失敗するため、その場合は `corepack pnpm <subcommand>` で実行する。`pnpm install` が通っていない状態でも検証は可能。
- **Node.js は `>=22.0.0`**（`.nvmrc` = `22`、Vite 8 の Node 20.19+ 要件に追従）。CI では `actions/setup-node` が `.nvmrc` を読むため、ローカルの Node とずれるとローカルでは通っても CI で落ちることがある。
- **単一テストの実行**: `pnpm vitest run <pathOrPattern>` または `pnpm vitest run -t '<test name pattern>'`。watch したいときは `pnpm vitest <path>`（`run` を外す）。
- **CI で必ず走る最終チェック**: `pnpm lint` → `pnpm test` の順。コード変更後は両方を必ず手元で通すこと。

## Architecture (big picture)

このリポジトリは **Vite SPA + Vercel ホスティング** の組み合わせを意図的に選んでいる構成（理由は README "Why Vite on Vercel"）。Next.js / Remix を使わない代わりに、SPA 起因の制約が複数の設定にまたがって表れます。これらは互いに整合する前提で組まれているため、片方だけ触るとサイレントに壊れます。

- `src/main.tsx` がエントリ。`<RouterProvider router={router} />` と `<Analytics />`（`@vercel/analytics/react`）をマウントする唯一の場所。Analytics は本番環境のみ計測、ローカル/プレビューでは no-op。
- `src/router.tsx` がルーティング定義の単一ソース。features を増やしたら必ずここに `path` と `element` を追加する。
- `vercel.json` の `rewrites` が **クライアントサイドルーティングと表裏一体**: `/component-test` のようなルートを直リンクで開いても 200 を返すために `/((?!assets/).*)` を `/index.html` にフォールバックしている。新しい "予約パス" が増えるなら正規表現の見直しが必要。
- `vercel.json#framework` は Vercel ダッシュボード設定より優先される。プロジェクト設定が想定と違う場合の真実は `vercel.json`。
- ビルドは `pnpm build` = `tsc && vite build`。`tsc` が型チェックゲート、`vite build` が `dist/` を出力。`dist/` がそのまま静的配信される。

## Conventions (絶対守る)

`src/features/` の規約は README "Conventions" にあるが、Claude が新規ファイルを生成するときに踏み外しやすい点を再掲。

- **1 機能 = 1 ディレクトリ**、`src/features/<kebab-case>/`。features 同士の相互 import は禁止。共通化したくなったら `src/` 直下のレイヤ（将来的に `src/components/` `src/lib/` 等）に引き上げる。
- **エントリは `<PascalCase>.tsx`**（ディレクトリ名と対応する 1 ファイル）。これだけが `router.tsx` から参照される公開点。例: `button-test/ButtonTest.tsx`。
- **機能内 UI 部品は `components/` (複数形)** に置く。`component/` (単数) を作らない（過去の揺れを統一済み）。
- **テスト併置**: 対象ファイルの隣に `*.test.tsx` を置く。共通ヘルパー（`renderWithProviders` 等）のみ `src/test/` に集約。

## Lint と「lint」の正体

- `pnpm lint` は **Prettier `--write` を呼ぶフォーマッタ**であり、ESLint は導入していない。コマンド名に騙されて静的解析を期待しない。
- CI も同コマンドを走らせるため、フォーマット差分が残った PR は CI で落ちる。コード変更後は必ず `pnpm lint` を実行してから `pnpm test`。
- ESLint を入れるべきかは将来課題。入れるなら `typescript-eslint` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` を想定（README 参照）。勝手に追加しない。

## TypeScript 設定の効くポイント

`tsconfig.json` は `strict` に加えて `noUnusedLocals` / `noUnusedParameters` / `noFallthroughCasesInSwitch` が有効。未使用 import / 未使用引数で **`pnpm build` がコケる**ので、コードを途中まで書いて保存→ビルド検証する流れだと頻繁に弾かれる。先頭からアンダースコアにすれば回避できる（`_unused`）が、本来は使わないなら消す。

## 環境変数

現状アプリケーションコードは環境変数に依存していないが、追加する際の制約:

- **クライアントへ露出する変数は必ず `VITE_` プレフィックス**。それ以外は `import.meta.env` から取れない（Vite の仕様）。秘匿値は絶対にクライアント側で参照させない。
- Vercel に追加した変数は `vercel env pull` でローカル `.env.local` に取得できる（`.env.local` は `*.local` で gitignore 済み）。

## テスト方針（運用ルール）

README "Testing Strategy" に詳細。Claude が新規 features を追加するときに従うべき最低ライン:

- **新規 features を追加するとき、ルートコンポーネント (`<Name>.tsx`) の振る舞いテストを最低 1 本書く**（カバレッジ率は追わない、価値の薄いテストを量産しない方針）。
- ライブラリ動作（Chakra UI / TanStack Table 等）のテストはしない。
- カバレッジ (`pnpm coverage`) は確認用、CI ゲートにはしない。

## CI / Dependabot との接点

- CI トリガは PR のみ（`.github/workflows/test.yml`）。`pnpm install --frozen-lockfile` のため、依存追加時は `pnpm-lock.yaml` を必ずコミット。
- Dependabot は weekly で minor/patch を 1 グループ PR に集約、major は除外。major 更新は人手で計画的に行う。
- GitHub Actions は SHA で pin 留めしている。新しいアクションを追加するときも SHA で固定する（Dependabot が `github-actions` エコシステム側で追従）。
