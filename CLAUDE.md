# CLAUDE.md — portfolio-site

## 言語 / Language

**このリポジトリに関するすべての質問・フィードバックには日本語で回答すること。**

---

## プロジェクト概要

菱沼 遼（理学療法士 × AIエンジニア）のポートフォリオサイト。  
React + Vite で構築されたシングルページアプリケーション。日本語表記。

---

## 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | React 18 (JSX、TypeScript なし) |
| ビルドツール | Vite 5 |
| アニメーション | Framer Motion 12、GSAP 3 |
| スタイリング | バニラ CSS（Tailwind・CSS Modules なし） |
| デプロイ | Netlify（`dist/` を公開） |
| テスト | なし |
| Git フック | なし |
| CI/CD | なし |

---

## 重要ファイル

| ファイル | 役割 |
|----------|------|
| `src/App.jsx` | アプリ全体（全コンポーネント・フック・静的データを含む） |
| `src/App.css` | コンポーネントスタイル |
| `src/index.css` | グローバルスタイル・CSS カスタムプロパティ |
| `src/main.jsx` | エントリーポイント |
| `index.html` | HTML シェル（Google Fonts 読み込み、`lang="ja"`） |
| `vite.config.js` | Vite 設定（最小構成） |
| `eslint.config.js` | ESLint 9 フラット設定 |
| `.netlify/netlify.toml` | Netlify ビルド設定 |

---

## 開発コマンド

```bash
npm run dev       # 開発サーバー起動（localhost:5173、HMR 有効）
npm run build     # 本番ビルド → dist/
npm run lint      # ESLint 実行
npm run preview   # 本番ビルドのプレビュー
```

---

## アーキテクチャ

### 単一ファイルコンポーネント構成

**すべてのコンポーネントは `src/App.jsx` 一ファイルに集約されている。**  
コンポーネントをファイル分割しないこと。

`App.jsx` に含まれるコンポーネント:

| コンポーネント | 役割 |
|----------------|------|
| `Marquee` | 無限スクロールテキストマーキー |
| `FadeUp` | スクロール連動フェードアップラッパー |
| `M` | マーカーハイライトスパン |
| `useTypewriterLines` | タイプライター効果カスタムフック |
| `Nav` | 固定ナビゲーションバー |
| `Hero` | フルスクリーンヒーローセクション |
| `Intro` | タイプライター付きイントロセクション |
| `Works` | ポートフォリオグリッド（6プロジェクト） |
| `SkillCircle` | 円形スキルバッジ |
| `Skills` | スキルセクション |
| `Contact` | コンタクトフォーム |
| `Footer` | フッター |
| `StickyCTA` | 右下固定フローティングボタン |
| `SectionNav` | 現在セクション表示ナビ |
| `App` | メインオーケストレーター |

### 静的データ

モジュールレベルの定数として管理:

- `WORKS` — ポートフォリオプロジェクト配列（6件）
- `SKILLS` — スキルカテゴリ配列（3件: AI/ML・医療・Web/API）
- `INTRO_LINES` — タイプライターアニメーション用コンテンツ
- `*_MARQUEE` — マーキーテキスト定数

---

## コーディング規約

- **関数コンポーネントのみ**（クラスコンポーネント不使用）
- **アロー関数構文**で統一
- **TypeScript 不使用**（純粋な JSX）
- フック: `useState`、`useRef`、`useEffect`、`useInView`（Framer Motion）を多用
- 外部 UI コンポーネントライブラリ不使用（完全カスタムビルド）
- API コール・動的データ取得なし（静的サイト）
- コメントは最小限（`/* ─── セクション名 ─── */` 形式のセクション区切りのみ）

---

## デザインシステム

### カラーパレット（CSS カスタムプロパティ）

```css
--black : #000000
--green : #00FF88   /* ネオングリーン、アクセントカラー */
--white : #FFFFFF
```

### フォント

```css
--font-en : 'Montserrat', sans-serif   /* 英字：400/500/800/900 */
--font-ja : 'M PLUS 1p', sans-serif    /* 日本語：400/700/800 */
```

Google Fonts 経由で `index.html` に読み込み済み。

### ブレークポイント

| ブレークポイント | 対象 |
|-----------------|------|
| `max-width: 1024px` | タブレット |
| `max-width: 767px` | モバイル |

---

## アニメーションパターン

### Framer Motion（スクロールトリガー）

```jsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-60px' }}
  transition={{ duration: 0.6 }}
/>
```

### CSS キーフレーム

- マーキースクロール: 25〜30s linear ループ
- パルス: 2.4s infinite 不透明度アニメーション
- カーソル点滅: 0.8s step-end

### カスタムフック

- `useTypewriterLines` — Intersection Observer でビューポート進入を検知し、タイプライター効果を制御

---

## スタイリングルール

- グローバル変数・リセット → `src/index.css`
- コンポーネントスタイル → `src/App.css`
- クラス命名: BEM 風（例: `.work-card`、`.work-card-black`、`.hero-name-first`）
- Prettier 設定なし → 既存コードのフォーマットに従うこと
- ユーティリティクラス不使用

---

## デプロイ

- **Netlify** による自動デプロイ
- ビルドコマンド: `npm run build`
- 公開ディレクトリ: `dist/`
- 環境変数・シークレット管理不要

---

## 注意事項

- テストインフラなし（Jest・Vitest・Cypress 等、いずれも未設定）
- `.netlify/netlify.toml` の `publish` パスがローカルの絶対パスになっているが、Netlify 側では正しく設定されているため変更不要
- `public/iguana.png` は約 4.6MB と大きいため、取り扱いに注意
