import { createContext } from "react";
import Settings from "~types/Settings";
import defaultSettings from "~data/defaultSettings";

export const SettingsContext = createContext<Settings>(defaultSettings);
