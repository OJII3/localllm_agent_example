# OpenCode OpenRouter Free Model Example

OpenCode の TUI から OpenRouter に接続し、無料モデル `qwen/qwen3-coder:free` を選んで使うための手順です。

このリポジトリには OpenCode の設定ファイルを置いていません。API key の保存や provider / model の選択は、OpenCode の `/connect` 画面に任せます。

## 対象環境

- Windows + WSL Ubuntu
- macOS + Homebrew

Windows では OpenCode を WSL Ubuntu 側で動かします。PowerShell ではなく、Ubuntu のターミナル内で作業してください。この README では WSL Ubuntu 自体のセットアップは済んでいる前提にします。

## できること

- OpenRouter の無料モデル `qwen/qwen3-coder:free` を OpenCode から使う。
- ローカルモデルのダウンロードや GPU / メモリ調整なしで OpenCode を試す。
- API key を shell 設定ファイルやプロジェクトファイルに書かず、OpenCode の TUI で保存する。

`qwen/qwen3-coder:free` は OpenRouter 上の free variant です。API key は必要ですが、モデルの input / output token price は `0` です。無料枠には rate limit があり、未課金アカウントでは `:free` モデルは 50 requests/day、20 requests/minute が OpenRouter の公式上限です。

## 全体の流れ

1. OpenCode をインストールする。
2. OpenRouter の API key を作る。
3. このリポジトリへ移動する。
4. OpenCode を起動する。
5. `/connect` で OpenRouter に接続する。
6. `qwen/qwen3-coder:free` を選ぶ。

## WSL Ubuntu

### 1. Ubuntu 側の基本ツールを入れる

```sh
sudo apt update
sudo apt install -y curl git ca-certificates
```

### 2. OpenCode を入れる

```sh
curl -fsSL https://opencode.ai/install | bash
```

確認します。

```sh
opencode --version
```

インストール直後に `opencode: command not found` になる場合は、新しい Ubuntu ターミナルを開き直してください。

### 3. OpenRouter API key を作る

1. <https://openrouter.ai/keys> を開く。
2. OpenRouter アカウントでサインインする。
3. `Create Key` から API key を作る。
4. 作った key を控える。

API key は `sk-or-...` で始まります。README や Git に保存するファイルへ直接書かないでください。

## macOS + Homebrew

### 1. Homebrew を更新する

```sh
brew update
```

### 2. OpenCode を入れる

OpenCode は公式 docs で最新リリース用の tap が案内されています。

```sh
brew install anomalyco/tap/opencode
```

確認します。

```sh
opencode --version
```

### 3. OpenRouter API key を作る

1. <https://openrouter.ai/keys> を開く。
2. OpenRouter アカウントでサインインする。
3. `Create Key` から API key を作る。
4. 作った key を控える。

API key は `sk-or-...` で始まります。README や Git に保存するファイルへ直接書かないでください。

## 起動手順

以降の手順は WSL Ubuntu と macOS で共通です。

### 1. このリポジトリへ移動する

```sh
git clone https://github.com/OJII3/localllm_agent_example.git
cd localllm_agent_example
```

既にこのリポジトリを開いている場合は、リポジトリ直下にいることだけ確認してください。

```sh
pwd
```

### 2. OpenCode を起動する

```sh
opencode
```

### 3. `/connect` で OpenRouter に接続する

OpenCode の TUI が開いたら、入力欄に次を入れて Enter を押します。

```text
/connect
```

表示された provider 一覧から `OpenRouter` を選びます。

API key の入力欄が出たら、OpenRouter で作った API key を貼り付けます。入力した API key は OpenCode 側に保存されるため、`OPENROUTER_API_KEY` を shell に設定する必要はありません。

### 4. 無料モデルを選ぶ

モデル選択画面で `qwen/qwen3-coder:free` を選びます。

見つからない場合は、検索欄に次のどちらかを入力してください。

```text
qwen3-coder
```

```text
free
```

選択後、チャット欄で短く動作確認します。

```text
Reply with OK only.
```

`OK` と返れば、OpenCode から OpenRouter の `qwen/qwen3-coder:free` への通信は成功です。

## よくある確認コマンド

OpenCode に保存済みの認証情報を見る。

```sh
opencode auth list
```

OpenCode が認識している OpenRouter モデルを見る。

```sh
opencode models openrouter
```

## トラブルシュート

### `/connect` に OpenRouter が出ない

OpenCode が古い可能性があります。OpenCode を更新してからもう一度確認してください。

WSL Ubuntu の場合:

```sh
curl -fsSL https://opencode.ai/install | bash
```

macOS の場合:

```sh
brew update
brew upgrade opencode
```

### API key が通らない

API key が間違っているか、古い key を使っています。<https://openrouter.ai/keys> で新しい key を作り、`/connect` から OpenRouter に接続し直してください。

### `429 Too Many Requests` が返る

無料枠の rate limit に達しています。OpenRouter の公式制限では、未課金アカウントの `:free` モデルは 50 requests/day、20 requests/minute です。時間を置いてから再実行してください。

### `402` が返る

OpenRouter のアカウント残高がマイナスの場合、free model でも `402` が返ることがあります。OpenRouter の key / credit 状態を確認してください。

### モデルが一時的に使えない

OpenRouter の free model は availability が変わることがあります。`qwen/qwen3-coder:free` が使えない場合は、OpenRouter の free model 一覧から別の `:free` モデルを選んでください。

## 参考

- [OpenCode install docs](https://opencode.ai/docs/ja)
- [OpenCode provider docs](https://opencode.ai/docs/providers/)
- [OpenRouter Qwen3 Coder free model](https://openrouter.ai/qwen/qwen3-coder:free)
- [OpenRouter free models router](https://openrouter.ai/openrouter/free)
- [OpenRouter API key page](https://openrouter.ai/keys)
- [OpenRouter rate limits](https://openrouter.ai/docs/api/reference/limits)
