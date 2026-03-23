{
  mkShell,
  lib,
  cargo-mommy,
  clang,
  clippy,
  rustc,
  rustfmt,
  rust-analyzer-unwrapped,
  rustPlatform,
  # gdk-pixbuf,
  # glib,
  # gio-sharp,
  # gobject-instropection-unwrapped,

  # Tauri documentration
  # Lib
  webkitgtk,
  gtk3,
  cairo,
  gdk-pixbuf,
  glib,
  dbus,
  openssl_3,
  librsvg,
  gsettings-desktop-schemas,

  # Packages
  curl,
  wget,
  pkg-config,
  libsoup,
}:
mkShell {
  name = "tauri-gui-devENV";
  strictDeps = true;
  nativeBuildInputs = [
    cargo-mommy
    clang
    clippy
    rustc
    rustfmt
    rust-analyzer-unwrapped
    rustPlatform.bindgenHook
  ];
  buildInputs = [
    curl
    dbus
    glib
    gtk3
    libsoup
    librsvg
    pkg-config
    openssl_3
    webkitgtk
    wget
  ];
  lib = [
    webkitgtk
    gtk3
    cairo
    gdk-pixbuf
    glib
    dbus
    openssl_3
    librsvg
  ];
  env.RUST_SRC_PATH = "${rustPlatform.rustLibSrc}";
  env.LD_LIBRARY_PATH = "${lib.makeLibraryPath lib}:$LD_LIBRARY_PATH";
  env.XDG_DATA_DIRS = "${gsettings-desktop-schemas}/share/gsettings-schemas/${gsettings-desktop-schemas.name}:${gtk3}/share/gsettings-schemas/${gtk3.name}:$XDG_DATA_DIRS";
}
