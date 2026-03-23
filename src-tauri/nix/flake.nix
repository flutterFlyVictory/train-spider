{
  description = "Matrix Rust client that has a familiar UI.";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs?ref=nixos-unstable";

  outputs =
    {
      self,
      nixpkgs,
    }:
    let
      systems = [
        "x86_64-linux"
        # "aarch64-linux" # might test on my rasp pi soon
      ];
      forAllSystem =
        set: nixpkgs.lib.genAttrs systems (system: set nixpkgs.legacyPackages.${system} system);
    in
    {
      packages = forAllSystem (
        pkgs: system: {
          default = self.packages.${system}.tauri-gui;
          tauri-gui = pkgs.callPackage ./nix/package.nix { };
        }
      );

      devShells = forAllSystem (
        pkgs: system: {
          default = pkgs.${system}.callPackage ./nix/shell.nix { };
        }
      );
    };
}
