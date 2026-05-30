# 登壇スライド

コーディングエージェント入門セミナー（OpenCode × OpenRouter ハンズオン）の登壇資料です。

- 成果物: [`seminar.pptx`](./seminar.pptx)（全28枚 / 16:9 ワイド）
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
| Intro | コーディングエージェントとは / OpenCode・OpenRouter の紹介 | 1–10 |
| Setup | ターミナル準備 / OpenCode インストール | 11–12 |
| Connect | API キー作成 / `/connect` / Free Models Router | 13–17 |
| Build | ミニアプリ生成 / プロンプト例 / AGENTS.md / レート制限 | 18–24 |
| Wrap up | 振り返り / 応用 / 参考リンク | 25–28 |

デザインは GitHub Dark 基調・ターミナルモチーフで統一しています。日本語は Hiragino Sans、コードは Menlo を前提にしているため、macOS で開くと最も綺麗に表示されます。
