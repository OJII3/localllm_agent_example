{
  description = "OpenCode and Ollama local LLM agent environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs =
    inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [
        "aarch64-darwin"
        "aarch64-linux"
        "x86_64-darwin"
        "x86_64-linux"
      ];

      perSystem =
        { pkgs, ... }:
        let
          model = "qwen3.5:4b";

          tools = [
            pkgs.ollama
            pkgs.opencode
          ];

          ollama-serve = pkgs.writeShellApplication {
            name = "ollama-serve";
            runtimeInputs = [ pkgs.ollama ];
            text = ''
              export OLLAMA_HOST="''${OLLAMA_HOST:-127.0.0.1:11434}"
              export OLLAMA_CONTEXT_LENGTH="''${OLLAMA_CONTEXT_LENGTH:-65536}"

              exec ollama serve
            '';
          };

          ollama-pull-qwen = pkgs.writeShellApplication {
            name = "ollama-pull-qwen";
            runtimeInputs = [ pkgs.ollama ];
            text = ''
              exec ollama pull ${model}
            '';
          };

          opencode-qwen = pkgs.writeShellApplication {
            name = "opencode-qwen";
            runtimeInputs = tools;
            text = ''
              if ! ollama list >/dev/null 2>&1; then
                echo "Ollama server is not running. Start it with: nix run .#ollama-serve" >&2
                exit 1
              fi

              if ! ollama show ${model} >/dev/null 2>&1; then
                echo "Model ${model} is not installed. Pull it with: nix run .#ollama-pull-qwen" >&2
                exit 1
              fi

              exec opencode "$@"
            '';
          };

          opencode-ollama = pkgs.writeShellApplication {
            name = "opencode-ollama";
            runtimeInputs = tools;
            text = ''
              exec ollama launch opencode --model ${model} "$@"
            '';
          };
        in
        {
          apps = {
            default = {
              type = "app";
              program = "${opencode-qwen}/bin/opencode-qwen";
            };

            ollama = {
              type = "app";
              program = "${pkgs.ollama}/bin/ollama";
            };

            ollama-pull-qwen = {
              type = "app";
              program = "${ollama-pull-qwen}/bin/ollama-pull-qwen";
            };

            ollama-serve = {
              type = "app";
              program = "${ollama-serve}/bin/ollama-serve";
            };

            opencode = {
              type = "app";
              program = "${pkgs.opencode}/bin/opencode";
            };

            opencode-ollama = {
              type = "app";
              program = "${opencode-ollama}/bin/opencode-ollama";
            };

            opencode-qwen = {
              type = "app";
              program = "${opencode-qwen}/bin/opencode-qwen";
            };
          };

          checks.tool-versions =
            pkgs.runCommand "tool-versions" { nativeBuildInputs = tools ++ [ pkgs.jq ]; }
              ''
                export HOME="$TMPDIR/home"
                export XDG_CACHE_HOME="$TMPDIR/cache"
                export XDG_CONFIG_HOME="$TMPDIR/config"
                export XDG_DATA_HOME="$TMPDIR/data"
                mkdir -p "$HOME" "$XDG_CACHE_HOME" "$XDG_CONFIG_HOME" "$XDG_DATA_HOME"

                opencode --version > "$out"
                ollama --version >> "$out"
                jq --exit-status '.model == "ollama/${model}" and .provider.ollama.models."${model}" != null' ${./opencode.json} >> "$out"
              '';

          devShells.default = pkgs.mkShell {
            packages = tools ++ [
              ollama-pull-qwen
              ollama-serve
              opencode-ollama
              opencode-qwen
            ];
          };

          formatter = pkgs.writeShellApplication {
            name = "format-nix";
            runtimeInputs = [
              pkgs.findutils
              pkgs.nixfmt
            ];
            text = ''
              if [ "$#" -eq 0 ]; then
                find . -type f -name '*.nix' -print0 | xargs -0 -r nixfmt
              else
                exec nixfmt "$@"
              fi
            '';
          };

          packages = {
            default = pkgs.symlinkJoin {
              name = "local-llm-agent-tools";
              paths = tools ++ [
                ollama-pull-qwen
                ollama-serve
                opencode-ollama
                opencode-qwen
              ];
            };

            ollama-pull-qwen = ollama-pull-qwen;
            ollama-serve = ollama-serve;
            opencode-ollama = opencode-ollama;
            opencode-qwen = opencode-qwen;
          };
        };
    };
}
