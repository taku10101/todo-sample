# Tech Select

フルスタック技術選定アプリケーション（モノレポ構成）

## 📁 プロジェクト構成

```
tech-select/
├── frontend/          # React + TypeScript + Vite
├── backend/           # Express + TypeScript + Prisma
├── package.json       # ルート設定（ワークスペース管理）
└── README.md
```

## 🚀 セットアップ

### 前提条件

- Node.js >= 18.0.0
- npm >= 8.0.0

### インストール

```bash
# プロジェクト全体の依存関係をインストール
npm install
```

## 📝 利用可能なコマンド

### 開発

```bash
# フロントエンド・バックエンドを同時起動
npm run dev

# フロントエンドのみ起動
npm run dev:frontend

# バックエンドのみ起動
npm run dev:backend
```

### ビルド

```bash
# 全体ビルド
npm run build

# フロントエンドのみビルド
npm run build:frontend

# バックエンドのみビルド
npm run build:backend
```

### データベース管理

```bash
# マイグレーション実行
npm run db:migrate

# シードデータ投入
npm run db:seed

# Prisma Studio起動
npm run db:studio

# データベースリセット
npm run db:reset
```

### その他

```bash
# 本番環境でバックエンド起動
npm run start

# 各プロジェクトのclean実行
npm run clean

# フロントエンドのLint実行
npm run lint

# テスト実行
npm run test
```

## 🏗️ 技術スタック

### フロントエンド

- **React 18** - UI ライブラリ
- **TypeScript** - 型安全性
- **Vite** - 高速ビルドツール

### バックエンド

- **Express** - Web アプリケーションフレームワーク
- **TypeScript** - 型安全性
- **Prisma** - モダンな ORM
- **SQLite** - 開発用データベース

### 開発ツール

- **npm workspaces** - モノレポ管理
- **concurrently** - 並行プロセス実行
- **nodemon** - 開発サーバー自動再起動

## 🔗 API エンドポイント

```
GET    /                    - サーバー状態確認
GET    /health              - ヘルスチェック
GET    /api/users           - 全ユーザー取得
POST   /api/users           - ユーザー作成
GET    /api/users/:id       - ユーザー詳細取得
PUT    /api/users/:id       - ユーザー更新
DELETE /api/users/:id       - ユーザー削除
```

## 🗃️ データベース

開発環境では SQLite を使用しており、`backend/dev.db`にデータが保存されます。

### スキーマ

- **User** - ユーザー情報
- **Post** - 投稿情報
- **Category** - カテゴリ情報

## 🎯 開発フロー

1. **初期セットアップ**

   ```bash
   npm install
   npm run db:migrate
   npm run db:seed
   ```

2. **開発開始**

   ```bash
   npm run dev
   ```

   - フロントエンド: http://localhost:5173
   - バックエンド: http://localhost:3001

3. **新機能開発**
   - フロントエンド: `frontend/src/` で作業
   - バックエンド: `backend/src/` で作業
   - データベース変更: `backend/prisma/schema.prisma` を編集後 `npm run db:migrate`

## 📦 ワークスペース

このプロジェクトは npm workspaces を使用してモノレポとして管理されています。

- **ルート**: 全体の設定とスクリプト管理
- **frontend**: React アプリケーション
- **backend**: Express API サーバー

各ワークスペースは独立して作業可能で、共通の依存関係はルートで管理されます。
