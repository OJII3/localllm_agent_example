# Local LLM Agent Example

OpenCode からローカルの Ollama モデル `qwen3.5:4b` を使うための最小構成です。

このリポジトリには OpenCode のプロジェクト設定として [opencode.json](./opencode.json) が入っています。リポジトリ直下で `opencode` を起動すると、既定モデルとして `ollama/qwen3.5:4b` が使われます。

## 対象環境

- Windows + WSL Ubuntu
- macOS + Homebrew

## できること

- Ollama で `qwen3.5:4b` をローカル実行する。
- OpenCode から Ollama の OpenAI-compatible API を使う。
- API キーなしで、手元の PC だけで OpenCode の基本動作を試す。

`qwen3.5:4b` は約 3.4 GB のモデルです。Ollama のモデルページでは 256K context window、Text / Image 入力として公開されています。OpenCode のような coding agent では長めの context window が必要になりやすいため、この README では `OLLAMA_CONTEXT_LENGTH=64000` を指定して Ollama server を起動します。

## 全体の流れ

1. OpenCode と Ollama をインストールする。
2. Ollama server を起動する。
3. `qwen3.5:4b` をダウンロードする。
4. OpenCode から `ollama/qwen3.5:4b` が見えることを確認する。
5. OpenCode を起動する。

## WSL Ubuntu

Windows では OpenCode を WSL Ubuntu 側で動かします。PowerShell ではなく、Ubuntu のターミナル内で作業してください。

### 1. WSL Ubuntu を用意する

まだ WSL を入れていない場合は、PowerShell を管理者として開いて実行します。

```powershell
wsl --install -d Ubuntu
```

インストール後、PC を再起動し、Ubuntu を起動してユーザー名とパスワードを作成します。既に WSL を使っている場合は、次で Ubuntu が WSL 2 になっていることを確認します。

```powershell
wsl -l -v
```

### 2. Ubuntu 側の基本ツールを入れる

ここから先は Ubuntu のターミナルで実行します。

```sh
sudo apt update
sudo apt install -y curl git ca-certificates
```

### 3. Ollama を入れる

```sh
curl -fsSL https://ollama.com/install.sh | sh
```

確認します。

```sh
ollama --version
```

### 4. OpenCode を入れる

```sh
curl -fsSL https://opencode.ai/install | bash
```

確認します。

```sh
opencode --version
```

インストール直後に `opencode: command not found` になる場合は、新しい Ubuntu ターミナルを開き直してください。

## macOS + Homebrew

macOS では Homebrew で Ollama と OpenCode を入れます。

### 1. Homebrew を更新する

```sh
brew update
```

### 2. Ollama を入れる

```sh
brew install ollama
```

確認します。

```sh
ollama --version
```

### 3. OpenCode を入れる

OpenCode は公式 docs で最新リリース用の tap が案内されています。

```sh
brew install anomalyco/tap/opencode
```

確認します。

```sh
opencode --version
```

## 起動手順

以降の手順は WSL Ubuntu と macOS で共通です。ターミナルを 2 つ使います。

### 1. ターミナル A で Ollama server を起動する

```sh
OLLAMA_CONTEXT_LENGTH=64000 ollama serve
```

このコマンドは起動し続けます。OpenCode を使っている間は、このターミナルを閉じないでください。

既に別の Ollama server が動いていて `address already in use` のようなエラーが出る場合は、先に止めます。

```sh
pkill ollama
```

macOS で Ollama アプリを起動している場合は、メニューバーの Ollama から終了してから、上の `ollama serve` を実行してください。

### 2. ターミナル B でモデルを取得する

```sh
ollama pull qwen3.5:4b
```

ダウンロード後、モデル情報を確認します。

```sh
ollama show qwen3.5:4b
```

`Capabilities` に `tools` が含まれていれば、OpenCode の tool calling 用途でも使いやすい状態です。

### 3. このリポジトリへ移動する

```sh
git clone <this-repository-url>
cd localllm_agent_example
```

既にこのリポジトリを開いている場合は、リポジトリ直下にいることだけ確認してください。

```sh
pwd
ls opencode.json
```

### 4. OpenCode からモデルが見えるか確認する

```sh
opencode models ollama
```

次のように表示されれば設定は読めています。

```text
ollama/qwen3.5:4b
```

### 5. OpenCode の実行を確認する

```sh
opencode run "Reply with OK only."
```

`OK` と返れば、OpenCode から Ollama の `qwen3.5:4b` への通信は成功です。

### 6. OpenCode を起動する

```sh
opencode
```

起動後、必要に応じて `/models` を開き、`ollama/qwen3.5:4b` が選ばれていることを確認してください。

## 設定ファイル

このリポジトリの [opencode.json](./opencode.json) は、Ollama を OpenAI-compatible provider として OpenCode に登録しています。

```json
{
  "model": "ollama/qwen3.5:4b",
  "small_model": "ollama/qwen3.5:4b",
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "http://127.0.0.1:11434/v1"
      }
    }
  }
}
```

別のプロジェクトでも同じ設定を使いたい場合は、そのプロジェクトのルートに `opencode.json` を置いてください。全プロジェクト共通にしたい場合は、OpenCode のユーザー設定ディレクトリに置く運用もできます。

## よくある確認コマンド

Ollama server が応答しているか確認する。

```sh
curl http://127.0.0.1:11434/api/tags
```

Ollama に入っているモデルを見る。

```sh
ollama list
```

Ollama が現在ロードしているモデルと context を見る。

```sh
ollama ps
```

OpenCode が認識している Ollama モデルを見る。

```sh
opencode models ollama
```

## トラブルシュート

### `opencode models ollama` に何も出ない

`opencode.json` があるディレクトリで実行しているか確認してください。

```sh
ls opencode.json
```

Ollama server が起動しているかも確認します。

```sh
curl http://127.0.0.1:11434/api/tags
```

### `could not connect to ollama server`

Ollama server が起動していません。ターミナル A で次を実行してください。

```sh
OLLAMA_CONTEXT_LENGTH=64000 ollama serve
```

### OpenCode の応答が遅い

初回実行時はモデルのロードに時間がかかります。`ollama ps` で `PROCESSOR` と `CONTEXT` を確認してください。CPU に大きく offload されている場合、応答は遅くなります。

### メモリが足りない

`OLLAMA_CONTEXT_LENGTH` を下げて起動し直してください。

```sh
OLLAMA_CONTEXT_LENGTH=32000 ollama serve
```

それでも厳しい場合は、より小さいモデルに変えてください。

## 参考

- [Ollama Linux install](https://docs.ollama.com/linux)
- [Ollama macOS install](https://docs.ollama.com/macos)
- [Ollama context length](https://docs.ollama.com/context-length)
- [Ollama OpenCode integration](https://docs.ollama.com/integrations/opencode)
- [Ollama qwen3.5 model page](https://ollama.com/library/qwen3.5)
- [OpenCode install docs](https://opencode.ai/docs/ja)
- [OpenCode Ollama provider docs](https://dev.opencode.ai/docs/providers/#ollama)
- [Microsoft WSL install docs](https://learn.microsoft.com/windows/wsl/install)
