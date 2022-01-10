import React, { useContext, useEffect, useState } from "react";
import defaultSettings from "../data/defaultSettings";
import audio from "../lib/audio";
import { ControlCode } from "../types/ControlCode";
import Settings from "../types/Settings";

const SettingsContext = React.createContext<
  [Settings, React.Dispatch<React.SetStateAction<Settings>>]
>([defaultSettings, () => {}]);

export default function SettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useState<Settings>(() => {
    const savedSettingsOverrides = JSON.parse(
      localStorage.getItem("settings") ?? "null"
    );
    if (!savedSettingsOverrides) return defaultSettings;
    return {
      ...defaultSettings,
      ...(savedSettingsOverrides ?? {}),
      keybindings: {
        ...defaultSettings.keybindings,
        ...(savedSettingsOverrides?.keybindings ?? {}),
      },
    };
  });

  const [settings] = value;
  useEffect(() => {
    if (settings !== defaultSettings) {
      const overrides: any = {};
      for (const [settingKey, settingValue] of Object.entries(settings)) {
        if (settingKey === "keybindings") {
          overrides.keybindings = {};
          for (const [controlCode, bindings] of Object.entries(
            settings.keybindings
          )) {
            const defaultBindings =
              defaultSettings.keybindings[controlCode as ControlCode];
            const bindingsAreEquivalent =
              bindings.every((binding) => defaultBindings.includes(binding)) &&
              defaultBindings.every((binding) => bindings.includes(binding));
            if (!bindingsAreEquivalent) {
              overrides.keybindings[controlCode] = bindings;
            }
          }
        } else if (
          settingValue !== defaultSettings[settingKey as keyof Settings]
        ) {
          overrides[settingKey] = settingValue;
        }
      }
      localStorage.setItem("settings", JSON.stringify(overrides));
    }
  }, [settings]);

  useEffect(() => {
    audio.setMusicVolume(settings.musicVolume / 50);
  }, [settings.musicVolume]);

  useEffect(() => {
    audio.setSfxVolume(settings.sfxVolume / 50);
  }, [settings.sfxVolume]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
