# OpenCode OpenRouter Free Model Example

OpenCode から OpenRouter の無料モデル `qwen/qwen3-coder:free` を使うための最小構成です。

このリポジトリには OpenCode のプロジェクト設定として [opencode.json](./opencode.json) が入っています。リポジトリ直下で `opencode` を起動すると、既定モデルとして `openrouter/qwen/qwen3-coder:free` が使われます。

## 対象環境

- Windows + WSL Ubuntu
- macOS + Homebrew

Windows では OpenCode を WSL Ubuntu 側で動かします。PowerShell ではなく、Ubuntu のターミナル内で作業してください。この README では WSL Ubuntu 自体のセットアップは済んでいる前提にします。

## できること

- OpenRouter の無料モデル `qwen/qwen3-coder:free` を OpenCode から使う。
- ローカルモデルのダウンロードや GPU / メモリ調整なしで OpenCode を試す。
- WSL Ubuntu と macOS で同じ `opencode.json` を使う。

`qwen/qwen3-coder:free` は OpenRouter 上の free variant です。API キーは必要ですが、モデルの input / output token price は `0` です。無料枠には rate limit があり、未課金アカウントでは `:free` モデルは 50 requests/day、20 requests/minute が OpenRouter の公式上限です。

## 全体の流れ

1. OpenCode をインストールする。
2. OpenRouter の API key を作る。
3. `OPENROUTER_API_KEY` を設定する。
4. このリポジトリへ移動する。
5. OpenCode から `openrouter/qwen/qwen3-coder:free` が見えることを確認する。
6. OpenCode を起動する。

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
4. 作った key を手元に控える。

API key は `sk-or-...` で始まります。`opencode.json` や README に直接書かないでください。

### 4. API key を設定する

今開いているターミナルだけで試す場合は、次を実行してから API key を貼り付けます。入力内容は画面に表示されません。

```sh
read -r -s OPENROUTER_API_KEY
export OPENROUTER_API_KEY
```

毎回設定したくない場合は、`~/.bashrc` に次の行を追加します。

```sh
export OPENROUTER_API_KEY="sk-or-..."
```

追加後、新しい Ubuntu ターミナルを開くか、次を実行します。

```sh
source ~/.bashrc
```

設定されているか確認します。

```sh
test -n "$OPENROUTER_API_KEY" && echo "OPENROUTER_API_KEY is set"
```

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
4. 作った key を手元に控える。

API key は `sk-or-...` で始まります。`opencode.json` や README に直接書かないでください。

### 4. API key を設定する

今開いているターミナルだけで試す場合は、次を実行してから API key を貼り付けます。入力内容は画面に表示されません。

```sh
read -r -s OPENROUTER_API_KEY
export OPENROUTER_API_KEY
```

毎回設定したくない場合は、`~/.zshrc` に次の行を追加します。

```sh
export OPENROUTER_API_KEY="sk-or-..."
```

追加後、新しいターミナルを開くか、次を実行します。

```sh
source ~/.zshrc
```

設定されているか確認します。

```sh
test -n "$OPENROUTER_API_KEY" && echo "OPENROUTER_API_KEY is set"
```

## 起動手順

以降の手順は WSL Ubuntu と macOS で共通です。

### 1. このリポジトリへ移動する

```sh
git clone <this-repository-url>
cd localllm_agent_example
```

既にこのリポジトリを開いている場合は、リポジトリ直下にいることだけ確認してください。

```sh
pwd
ls opencode.json
```

### 2. OpenRouter の API key が使えるか確認する

```sh
curl https://openrouter.ai/api/v1/key \
  -H "Authorization: Bearer $OPENROUTER_API_KEY"
```

JSON が返れば API key は読めています。`401` が返る場合は API key が間違っているか、環境変数が設定されていません。

### 3. OpenCode からモデルが見えるか確認する

```sh
opencode models openrouter
```

次のように表示されれば設定は読めています。

```text
openrouter/qwen/qwen3-coder:free
```

### 4. OpenCode の実行を確認する

```sh
opencode run "Reply with OK only."
```

`OK` と返れば、OpenCode から OpenRouter の `qwen/qwen3-coder:free` への通信は成功です。

### 5. OpenCode を起動する

```sh
opencode
```

起動後、必要に応じて `/models` を開き、`openrouter/qwen/qwen3-coder:free` が選ばれていることを確認してください。

## 設定ファイル

このリポジトリの [opencode.json](./opencode.json) は、OpenRouter を OpenAI-compatible provider として OpenCode に登録しています。

```json
{
  "model": "openrouter/qwen/qwen3-coder:free",
  "small_model": "openrouter/qwen/qwen3-coder:free",
  "provider": {
    "openrouter": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "OpenRouter",
      "options": {
        "baseURL": "https://openrouter.ai/api/v1",
        "apiKey": "{env:OPENROUTER_API_KEY}",
        "timeout": 600000,
        "chunkTimeout": 300000
      },
      "models": {
        "qwen/qwen3-coder:free": {
          "name": "Qwen3 Coder 480B A35B (free)",
          "limit": {
            "context": 1048576,
            "output": 65536
          }
        }
      }
    }
  }
}
```

`apiKey` は環境変数 `OPENROUTER_API_KEY` から読みます。API key を `opencode.json` に直接書く運用は避けてください。

別のプロジェクトでも同じ設定を使いたい場合は、そのプロジェクトのルートに `opencode.json` を置いてください。全プロジェクト共通にしたい場合は、OpenCode のユーザー設定ディレクトリに置く運用もできます。

## よくある確認コマンド

OpenRouter の API key 情報を見る。

```sh
curl https://openrouter.ai/api/v1/key \
  -H "Authorization: Bearer $OPENROUTER_API_KEY"
```

OpenCode が認識している OpenRouter モデルを見る。

```sh
opencode models openrouter
```

OpenCode に保存済みの認証情報を見る。

```sh
opencode auth list
```

この README の構成では `OPENROUTER_API_KEY` を使うため、`opencode auth list` に OpenRouter が出ていなくても問題ありません。

## トラブルシュート

### `opencode models openrouter` に目的のモデルが出ない

`opencode.json` があるディレクトリで実行しているか確認してください。

```sh
ls opencode.json
```

それでも出ない場合は、OpenCode が古い可能性があります。OpenCode を更新してからもう一度確認してください。

### `OPENROUTER_API_KEY` が設定されていない

次で確認します。

```sh
test -n "$OPENROUTER_API_KEY" && echo "OPENROUTER_API_KEY is set"
```

何も表示されない場合は、API key を設定し直してください。

### `401 Unauthorized` が返る

API key が間違っているか、古い key を使っています。<https://openrouter.ai/keys> で新しい key を作り、`OPENROUTER_API_KEY` を設定し直してください。

### `429 Too Many Requests` が返る

無料枠の rate limit に達しています。OpenRouter の公式制限では、未課金アカウントの `:free` モデルは 50 requests/day、20 requests/minute です。時間を置いてから再実行してください。

### `402` が返る

OpenRouter のアカウント残高がマイナスの場合、free model でも `402` が返ることがあります。OpenRouter の key / credit 状態を確認してください。

### モデルが一時的に使えない

OpenRouter の free model は availability が変わることがあります。`qwen/qwen3-coder:free` が使えない場合は、OpenRouter の free model 一覧から別の `:free` モデル ID を選び、[opencode.json](./opencode.json) の `model`、`small_model`、`provider.openrouter.models` を同じ ID に差し替えてください。

## 参考

- [OpenCode install docs](https://opencode.ai/docs/ja)
- [OpenCode provider docs](https://opencode.ai/docs/providers/)
- [OpenRouter Qwen3 Coder free model](https://openrouter.ai/qwen/qwen3-coder:free)
- [OpenRouter free models router](https://openrouter.ai/openrouter/free)
- [OpenRouter API key page](https://openrouter.ai/keys)
- [OpenRouter rate limits](https://openrouter.ai/docs/api/reference/limits)
