# 登壇スライド

コーディングエージェント入門セミナー（今日は無料の OpenCode × OpenRouter で体験）の登壇資料です。

- 成果物: [`seminar.pptx`](./seminar.pptx)（全27枚 / 16:9 ワイド）
- 生成元: [`generate.js`](./generate.js)（[PptxGenJS](https://gitbrent.github.io/PptxGenJS/) でコードから生成）

## 再生成する

Node.js が必要です。

```sh
cd slides
npm install
npm run build   # generate.js を実行して seminar.pptx を出力
```

このリポジトリは Nix を使うため、Node.js が無い場合は次でも実行できます。

```sh
nix shell nixpkgs#nodejs_22 --command bash -c 'npm install && npm run build'
```

## 構成

| 章 | 内容 | スライド |
|----|------|----------|
| Intro | コーディングエージェントとは / 代表的なエージェント / なぜターミナル・OpenCode・OpenRouter / 全体図 | 1–10 |
| Setup | ターミナル準備 / OpenCode インストール | 11–12 |
| Connect | API キー作成 / フォルダを作って起動 / `/connect` / Free Models Router | 13–16 |
| Build | 使い方 / ToDoアプリ（完成形）/ 段階的プロンプト / ブラウザ確認 / コツ / 指示ファイル / レート制限 | 17–23 |
| Wrap up | 振り返り / 応用 / 参考リンク | 24–27 |

## ねらい・方針

- **題材は ToDo アプリ**に固定。完成形（追加・チェック・削除・localStorage 保存）を示し、`①骨組み → ②機能 → ③仕上げ` の段階的プロンプトで作らせる。
- **git は使わない**。`mkdir` で作業フォルダを作るだけ。clone もしない。
- **特定ツールに依存しすぎない**。実習は無料の OpenCode だが、「代表的なエージェント」「指示ファイル（AGENTS.md / CLAUDE.md）」を横断的に扱い、Claude Code / Codex CLI ユーザーにも通用する内容にしている。

デザインは GitHub Dark 基調・ターミナルモチーフで統一。日本語は Hiragino Sans、コードは Menlo を前提にしているため、macOS で開くと最も綺麗に表示されます。
