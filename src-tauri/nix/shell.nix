{
  mkShell,
  lib,
  cargo, # Added here
  cargo-mommy,
  clang,
  clippy,
  rustc,
  rustfmt,
  rust-analyzer-unwrapped,
  rustPlatform,
  webkitgtk_4_1,
  gtk3,
  cairo,
  gdk-pixbuf,
  glib,
  dbus,
  openssl,
  librsvg,
  gsettings-desktop-schemas,
  curl,
  sqlite,
  wget,
  pkg-config,
  libsoup_3,
}:
let
  runtimeLib = [
    webkitgtk_4_1
    gtk3
    cairo
    gdk-pixbuf
    glib
    dbus
    openssl
    librsvg
    sqlite
  ];
in
mkShell {
  name = "tauri-gui-devENV";
  strictDeps = true;

  nativeBuildInputs = [
    cargo
    cargo-mommy
    clang
    clippy
    rustc
    rustfmt
    rust-analyzer-unwrapped
    rustPlatform.bindgenHook
    pkg-config
    sqlite
  ];

  buildInputs = [
    curl
    dbus
    glib
    gtk3
    libsoup_3
    librsvg
    openssl
    webkitgtk_4_1
    wget
    sqlite
  ];
  env.RUST_SRC_PATH = "${rustPlatform.rustLibSrc}";
  env.LD_LIBRARY_PATH = "${lib.makeLibraryPath runtimeLib}:$LD_LIBRARY_PATH";
  env.XDG_DATA_DIRS = "${gsettings-desktop-schemas}/share/gsettings-schemas/${gsettings-desktop-schemas.name}:${gtk3}/share/gsettings-schemas/${gtk3.name}:$XDG_DATA_DIRS";
}
