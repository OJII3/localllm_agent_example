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
| Build | 使い方 / ToDoアプリを分割して作る / プロンプト / ローカルサーバーで確認 / コツ / 指示ファイル / レート制限 | 17–23 |
| Wrap up | 振り返り / 応用 / 参考リンク | 24–27 |

## ねらい・方針

- **コーディングエージェントの本質は「手元の PC を直接操作できる」こと**（ファイルの読み書き＋コマンド実行）。これが Web チャット（コピペ）との決定的な違いで、slide5「とは」で中心に据えている。複数ファイルを扱えるのはこの能力の一例であって、それ自体を本質として大きく扱わない。
- **ハンズオンは ToDo アプリ**を題材に、`index.html` / `styles.css` / `src/storage.js` / `src/todo.js` / `src/app.js` を **ES Modules** で作る。複数ファイル分割は「PC 上に実際にファイル群ができて、コマンドで動かせる」ことを手を動かして体験するための題材。
- **ブラウザ確認はローカルサーバー**（`python3 -m http.server` → `localhost:8000`）。ES Modules は `file://` では動かないため。Node は不要で、「サーバーを起動して」とエージェント自身に頼ませてもよい。
- **git は使わない**。`mkdir` で作業フォルダを作るだけ。
- **特定ツールに依存しすぎない**。実習は無料の OpenCode だが、「代表的なエージェント」「指示ファイル（AGENTS.md / CLAUDE.md）」「参考リンク」を横断的に扱い、Claude Code / Codex CLI ユーザーにも通用する内容にしている。

## 実機検証メモ

実際に opencode へスライドのプロンプトを投げて確認済み（`openrouter/free` ルーター経由）。得られた知見：

- TUI で「Free Models Router」を選ぶ前提なのでスライド本文に内部モデルIDは出さない（CLI で試す場合の ID は `openrouter/openrouter/free`）。
- 無料・軽量モデルは一度で全ファイルが揃わないことがある（最後の1ファイルを書かずに説明で終わる等）。slide21「うまくいかない時 → 続けて頼む」のとおり、もう一度頼めば補完される。

デザインは GitHub Dark 基調・ターミナルモチーフで統一。日本語は Hiragino Sans、コードは Menlo を前提にしているため、macOS で開くと最も綺麗に表示されます。
