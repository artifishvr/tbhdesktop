import { load } from "@tauri-apps/plugin-store";

export const settingsStore = await load("settings.json");
