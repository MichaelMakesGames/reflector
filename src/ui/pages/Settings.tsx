import React from "react";
import { useDispatch } from "../GameProvider";
import audio from "../../lib/audio";
import actions from "../../state/actions";
import Menu from "../Menu";
import MenuButton from "../MenuButton";
import MenuSectionHeader from "../MenuSectionHeader";
import MenuSlider from "../MenuSlider";
import MenuTitle from "../MenuTitle";
import { RouterPageProps } from "../Router";
import { useSettings } from "../SettingsProvider";
import MenuOptionSelector from "../MenuOptionSelector";

export default function Settings({ navigateTo, goBack }: RouterPageProps) {
  const [settings, updateSettings] = useSettings();
  const dispatch = useDispatch();

  return (
    <Menu>
      <MenuTitle goBack={goBack}>Settings</MenuTitle>
      <MenuSectionHeader>Controls</MenuSectionHeader>
      <MenuButton onClick={() => navigateTo("Keybindings")}>
        View Keybindings
      </MenuButton>
      <MenuOptionSelector
        label="Click to Move"
        value={settings.clickToMove}
        onChange={(value) =>
          updateSettings((prev) => ({ ...prev, clickToMove: value as any }))
        }
        options={[
          { id: "ADJACENT", name: "Adjacent" },
          { id: "ALWAYS", name: "Always" },
          { id: "NEVER", name: "Never" },
        ]}
      />
      <MenuSectionHeader>Volume</MenuSectionHeader>
      <MenuSlider
        value={settings.musicVolume}
        onChange={(musicVolume) =>
          updateSettings((prev) => ({ ...prev, musicVolume }))
        }
        min={0}
        max={100}
        step={10}
        label="Music"
      />
      <MenuSlider
        value={settings.sfxVolume}
        onChange={(sfxVolume) => {
          updateSettings((prev) => ({ ...prev, sfxVolume }));
          audio.play("ui_successful_valid");
        }}
        min={0}
        max={100}
        step={10}
        label="Effects"
      />
      <MenuSectionHeader>Miscellaneous</MenuSectionHeader>
      <MenuButton onClick={() => dispatch(actions.resetTutorials())}>
        Reset Tutorials
      </MenuButton>
    </Menu>
  );
}
