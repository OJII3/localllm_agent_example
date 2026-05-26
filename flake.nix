{
  description = "OpenCode OpenRouter Free Models Router example development environment";

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
          tools = [
            pkgs.curl
            pkgs.git
            pkgs.jq
            pkgs.opencode
          ];

          opencode-connect = pkgs.writeShellApplication {
            name = "opencode-connect";
            runtimeInputs = [ pkgs.opencode ];
            text = ''
              exec opencode "$@"
            '';
          };
        in
        {
          apps = {
            default = {
              type = "app";
              program = "${opencode-connect}/bin/opencode-connect";
            };

            opencode = {
              type = "app";
              program = "${pkgs.opencode}/bin/opencode";
            };
          };

          checks = {
            readme-openrouter-flow =
              pkgs.runCommand "readme-openrouter-flow" { nativeBuildInputs = [ pkgs.ripgrep ]; }
                ''
                  rg --fixed-strings "Free Models Router" ${./README.md}
                  rg --fixed-strings "/connect" ${./README.md}
                  touch "$out"
                '';

            tool-versions = pkgs.runCommand "tool-versions" { nativeBuildInputs = tools; } ''
              export HOME="$TMPDIR/home"
              export XDG_CACHE_HOME="$TMPDIR/cache"
              export XDG_CONFIG_HOME="$TMPDIR/config"
              export XDG_DATA_HOME="$TMPDIR/data"
              mkdir -p "$HOME" "$XDG_CACHE_HOME" "$XDG_CONFIG_HOME" "$XDG_DATA_HOME"

              opencode --version > "$out"
              git --version >> "$out"
              curl --version | head -n 1 >> "$out"
              jq --version >> "$out"
            '';
          };

          devShells.default = pkgs.mkShell {
            packages = tools ++ [ opencode-connect ];
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
              name = "opencode-openrouter-tools";
              paths = tools ++ [ opencode-connect ];
            };

            opencode-connect = opencode-connect;
          };
        };
    };
}
