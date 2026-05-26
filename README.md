# OpenCode OpenRouter Free Models Router Example

OpenCode の TUI から OpenRouter に接続し、`Free Models Router` を選んで使うための手順です。

このリポジトリには OpenCode の設定ファイルを置いていません。API key の保存や provider / model の選択は、OpenCode の `/connect` 画面に任せます。

## 対象環境

- Windows + WSL Ubuntu
- macOS + Homebrew

Windows では OpenCode を WSL Ubuntu 側で動かします。PowerShell ではなく、Ubuntu のターミナル内で作業してください。この README では WSL Ubuntu 自体のセットアップは済んでいる前提にします。

## OpenRouter を使う理由

この README では、OpenRouter の `Free Models Router` を使います。モデル ID は `openrouter/free` です。

OpenRouter を選ぶ理由は、想定ユーザーに OpenRouter を日常利用している人が少なそうで、無料枠の quota を消費しても困る人が少ないと見込めるためです。OpenAI、Anthropic、GitHub Copilot など、普段の作業で使っている可能性が高い quota は消費しません。

また、特定の無料モデルを直接選ぶとアクセス集中で使えないことがあります。`Free Models Router` を選ぶと、OpenRouter 側が利用可能な無料モデルへルーティングします。

API key は必要ですが、モデルの input / output token price は `0` です。無料枠には rate limit があり、未課金アカウントでは free model は 50 requests/day、20 requests/minute が OpenRouter の公式上限です。

## 全体の流れ

1. OpenCode をインストールする。
2. OpenRouter の API key を作る。
3. このリポジトリへ移動する。
4. OpenCode を起動する。
5. `/connect` で OpenRouter に接続する。
6. `Free Models Router` を選ぶ。

## 1. OpenCode をインストールする

OS ごとに違うのはこのインストール手順だけです。インストール後の OpenRouter 接続手順は、WSL Ubuntu と macOS で共通です。

### WSL Ubuntu

Ubuntu 側の基本ツールを入れます。

```sh
sudo apt update
sudo apt install -y curl git ca-certificates
```

OpenCode を入れます。

```sh
curl -fsSL https://opencode.ai/install | bash
```

確認します。

```sh
opencode --version
```

インストール直後に `opencode: command not found` になる場合は、新しい Ubuntu ターミナルを開き直してください。

### macOS + Homebrew

Homebrew を更新します。

```sh
brew update
```

OpenCode を入れます。

```sh
brew install anomalyco/tap/opencode
```

確認します。

```sh
opencode --version
```

## 2. OpenRouter API key を作る

1. <https://openrouter.ai/keys> を開く。
2. OpenRouter アカウントでサインインする。
3. `Create Key` から API key を作る。
4. 作った key を控える。

API key は `sk-or-...` で始まります。README や Git に保存するファイルへ直接書かないでください。

## 3. このリポジトリへ移動する

```sh
git clone https://github.com/OJII3/localllm_agent_example.git
cd localllm_agent_example
```

既にこのリポジトリを開いている場合は、リポジトリ直下にいることだけ確認してください。

```sh
pwd
```

## 4. OpenCode を起動する

```sh
opencode
```

## 5. `/connect` で OpenRouter に接続する

OpenCode の TUI が開いたら、入力欄に次を入れて Enter を押します。

```text
/connect
```

表示された provider 一覧から `OpenRouter` を選びます。

API key の入力欄が出たら、OpenRouter で作った API key を貼り付けます。入力した API key は OpenCode 側に保存されるため、`OPENROUTER_API_KEY` を shell に設定する必要はありません。

## 6. Free Models Router を選ぶ

モデル選択画面で `Free Models Router` を選びます。

見つからない場合は、検索欄に次のどちらかを入力してください。

```text
Free Models Router
```

```text
openrouter/free
```

選択後、チャット欄で短く動作確認します。

```text
Reply with OK only.
```

`OK` と返れば、OpenCode から OpenRouter の `Free Models Router` への通信は成功です。

## 確認コマンド

OpenCode に保存済みの認証情報を見る。

```sh
opencode auth list
```

OpenCode が認識している OpenRouter モデルを見る。

```sh
opencode models openrouter
```

## 参考

- [OpenCode install docs](https://opencode.ai/docs/ja)
- [OpenCode provider docs](https://opencode.ai/docs/providers/)
- [OpenRouter free models router](https://openrouter.ai/openrouter/free)
- [OpenRouter API key page](https://openrouter.ai/keys)
- [OpenRouter rate limits](https://openrouter.ai/docs/api/reference/limits)
