import { load } from "@tauri-apps/plugin-store";

export const getSettingsStore = async () => {
  const settingsStore = await load("settings.json");

  return settingsStore;
};
