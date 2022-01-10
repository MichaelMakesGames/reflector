import React from "react";
import { ControlCode } from "../../types/ControlCode";
import Kbd from "../Kbd";
import Menu from "../Menu";
import MenuTitle from "../MenuTitle";
import { RouterPageProps } from "../Router";
import { useSettings } from "../SettingsProvider";

export default function Keybindings({ goBack }: RouterPageProps) {
  const [settings] = useSettings();

  return (
    <Menu wide>
      <MenuTitle goBack={goBack}>Keybindings</MenuTitle>
      <section className="my-3">
        <h3 className="text-xl">Movement</h3>
        <Shortcut code={ControlCode.Up} label="Up" />
        <Shortcut code={ControlCode.Down} label="Down" />
        <Shortcut code={ControlCode.Left} label="Left" />
        <Shortcut code={ControlCode.Right} label="Right" />
      </section>
      <section className="my-3">
        <h3 className="text-xl">Lasers</h3>
        <Shortcut code={ControlCode.Fire} label="Activate/Fire Laser" />
        <div className="ml-3">
          Aim Laser: movement keys while laser is active
        </div>
        <Shortcut code={ControlCode.Back} label="Cancel/Deactivate" />
      </section>
      <section className="my-3">
        <h3 className="text-xl">Building</h3>
        <div className="ml-3">
          Select Category/Building: <Kbd>1</Kbd>
          <Kbd className="ml-1">2</Kbd>
          <Kbd className="ml-1">3</Kbd>
          <Kbd className="ml-1">4</Kbd>
          <Kbd className="ml-1">5</Kbd>
          <Kbd className="ml-1">6</Kbd>
          <Kbd className="ml-1">7</Kbd>
          <Kbd className="ml-1">8</Kbd>
          <Kbd className="ml-1">9</Kbd>
          <Kbd className="ml-1">0</Kbd>
        </div>
        <div className="ml-3">
          Move Blueprint: <Kbd>{settings.cursorModifierKey}</Kbd> + movement key
        </div>
        <Shortcut code={ControlCode.RotateBuilding} label="Rotate Blueprint" />
        <Shortcut code={ControlCode.Back} label="Cancel" />
      </section>
      <section className="my-3">
        <h3 className="text-xl">Contextual Actions</h3>
        <p>
          The availability of these actions is determined by the cursor&apos;s
          location.
        </p>
        <Shortcut code={ControlCode.QuickAction} label="Cycle Reflector" />
        <Shortcut
          code={ControlCode.PlaceReflectorA}
          label="Place / Reflector"
        />
        <Shortcut
          code={ControlCode.PlaceReflectorB}
          label="Place \ Reflector"
        />
        <Shortcut code={ControlCode.RemoveReflector} label="Remove Reflector" />
        <Shortcut code={ControlCode.RemoveBuilding} label="Remove Building" />
        <Shortcut code={ControlCode.ToggleJobs} label="Toggle Jobs" />
      </section>
      <section className="my-3">
        <h3 className="text-xl">Job Priorities</h3>
        <Shortcut
          code={ControlCode.FocusJobPriorities}
          label="Enter Job Priority Mode"
        />
        <Shortcut code={ControlCode.Back} label="Exit Job Priority Mode" />
        <Shortcut
          code={ControlCode.QuickAction}
          label="Select or Unselect Job"
        />
        <Shortcut
          code={ControlCode.Down}
          label="Focus Next Job, or Decrease Selected Job Priority"
        />
        <Shortcut
          code={ControlCode.Up}
          label="Focus Previous Job, or Increase Selected Job Priority"
        />
      </section>
      <section className="my-3">
        <h3 className="text-xl">Tutorial</h3>
        <Shortcut
          code={ControlCode.ToggleTutorials}
          label="Minimize/Expand Tutorial Window"
        />
        <Shortcut
          code={ControlCode.FocusTutorials}
          label="Focus Tutorial Controls"
        />
        <Shortcut
          code={ControlCode.DismissTutorial}
          label="Dismiss Selected Tutorial"
        />
        <Shortcut
          code={ControlCode.QuickAction}
          label="Complete Selected Tutorial Step (if able)"
        />
        <Shortcut code={ControlCode.Up} label="Select Previous Tutorial" />
        <Shortcut code={ControlCode.Down} label="Select Next Tutorial" />
        <Shortcut code={ControlCode.Left} label="View Previous Step" />
        <Shortcut code={ControlCode.Right} label="View Next Step" />
      </section>
      <section className="my-3">
        <h3 className="text-xl">Miscellaneous</h3>
        <div className="ml-3">
          Move Cursor: <Kbd>{settings.cursorModifierKey}</Kbd> + movement key
        </div>
        <Shortcut code={ControlCode.Wait} label="Wait" />
        <Shortcut code={ControlCode.Undo} label="Undo" />
        <Shortcut code={ControlCode.ZoomIn} label="Zoom In" />
        <Shortcut code={ControlCode.ZoomOut} label="Zoom Out" />
        <Shortcut code={ControlCode.Help} label="Open This Menu" />
        <Shortcut code={ControlCode.Back} label="Close This Menu" />
      </section>
    </Menu>
  );
}

function Shortcut({ code, label }: { code: ControlCode; label: string }) {
  const [settings] = useSettings();
  return (
    <div className="ml-3" tabIndex={-1} data-menu-control>
      {label}:
      {settings.keybindings[code].map((key) => (
        <Kbd className="ml-1" key={key}>
          {key}
        </Kbd>
      ))}
    </div>
  );
}
