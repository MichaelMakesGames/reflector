import React, { useContext } from "react";
import { SettingsContext } from "~contexts";
import { ControlCode } from "~types/ControlCode";
import Kbd from "./Kbd";
import Modal from "./Modal";
import { useControl, HotkeyGroup } from "~components/HotkeysProvider";
import HotkeyButton from "./HotkeyButton";

export default function KeyboardControls({ onClose }: { onClose: () => void }) {
  const settings = useContext(SettingsContext);
  useControl({
    code: ControlCode.Back,
    group: HotkeyGroup.Help,
    callback: onClose,
  });

  return (
    <Modal isOpen onRequestClose={onClose}>
      <div className="flex flex-row">
        <h2 className="text-2xl flex-grow">Mouse Controls</h2>
        <HotkeyButton
          controlCode={ControlCode.Back}
          callback={onClose}
          hotkeyGroup={HotkeyGroup.Help}
          label="Close"
        />
      </div>
      <section className="my-3 pl-3">
        <p>Hover over a location to see contents and contextual actions.</p>
        <p>Click on map to move.</p>
        <p>
          While aiming laser, click within the blue borders to
          place/rotate/remove reflectors.
        </p>
        <p>While building, click to place, right click to cancel.</p>
        <p>Right click location for contextual actions.</p>
        <p>Scroll to zoom in or zoom out.</p>
        <p>Click and drag jobs to change priority.</p>
      </section>
      <div className="flex flex-row">
        <h2 className="text-2xl flex-grow">Keyboard Shortcuts</h2>
      </div>
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
          Aim Laser: <Kbd>{settings.aimingModifierKey}</Kbd> + movement key. If
          laser is active, <Kbd>{settings.aimingModifierKey}</Kbd> is optional
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
    </Modal>
  );
}

function Shortcut({ code, label }: { code: ControlCode; label: string }) {
  const settings = useContext(SettingsContext);
  return (
    <div className="ml-3">
      {label}:
      {settings.keyboardShortcuts[code].map((key) => (
        <Kbd className="ml-1" key={key}>
          {key}
        </Kbd>
      ))}
    </div>
  );
}
