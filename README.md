# tbh desktop

[![publish](https://github.com/artifishvr/tbhdesktop/actions/workflows/publish.yml/badge.svg)](https://github.com/artifishvr/tbhdesktop/actions/workflows/publish.yml)

tbh for your desktop

![screenshot of the default window for tbh desktop](screenshot.png)

## Usage

Builds for Windows 10/11, MacOS (ARM and x64), and Linux (AppImage, deb, rpm) can be downloaded via GitHub Releases

1. Install
2. Click (but not too much...)

## Build/Run it yourself

### Requirements

- [Tauri Prerequisites](https://tauri.app/start/prerequisites/)
- [pnpm](https://pnpm.io/)

```bash
git clone https://github.com/artifishvr/tbhdesktop.git
cd tbhdesktop
pnpm install
pnpm tauri dev # to build and run the app in development mode
pnpm tauri build # to build the app + installers for production
pnpm tauri ios build # to build the app for iOS
pnpm tauri android build # to build the app for Android (untested)
```

## License

[GPLv3](https://choosealicense.com/licenses/gpl-3.0/)
