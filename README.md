# Local LLM Agent Example

## 目的

flake-parts を使って、OpenCode と Ollama を同じ Nix 環境から使えるようにする。

## 仕様

- `nix develop` で `opencode` と `ollama` を PATH に入れる。
- `nix run .#opencode` で OpenCode を起動する。
- `nix run .#ollama -- <args>` で Ollama CLI を実行する。
- `nix run .#ollama-serve` で OpenCode 向けの context length を設定して Ollama server を起動する。
- `nix run .#ollama-pull-qwen` で `qwen3.5:4b` を取得する。
- `nix run .#opencode-qwen` または `nix run .` で `qwen3.5:4b` を使う OpenCode を起動する。
- `nix run .#opencode-ollama` で `ollama launch opencode --model qwen3.5:4b` を実行する。
- `nix flake check` で両 CLI のバージョン取得を検証する。

## 使い方

```sh
nix develop
```

Ollama サーバーを起動する。OpenCode は長めの context window が必要なので、既定で `OLLAMA_CONTEXT_LENGTH=65536` を設定する。

```sh
nix run .#ollama-serve
```

別のシェルで `qwen3.5:4b` を取得してから OpenCode を起動する。

```sh
nix run .#ollama-pull-qwen
nix run .#opencode-qwen
```

Ollama の OpenCode integration から起動する場合は次を使う。

```sh
nix run .#opencode-ollama
```

context length を変えたい場合は環境変数で上書きする。

```sh
OLLAMA_CONTEXT_LENGTH=32768 nix run .#ollama-serve
```

## 計画

1. flake-parts で複数 system 向けの flake を定義する。
2. `opencode` と `ollama` を devShell と apps から使えるようにする。
3. `opencode.json` で Ollama provider と `qwen3.5:4b` を既定モデルにする。
4. バージョン確認と OpenCode 設定の JSON 検証を `checks` に追加して flake の基本動作を検証する。
