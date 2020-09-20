import React, { PropsWithChildren, useContext } from "react";
import { SettingsContext } from "~contexts";
import { ControlCode } from "~types/ControlCode";
import Modal from "./Modal";

export default function KeyboardControls({ onClose }: { onClose: () => void }) {
  const settings = useContext(SettingsContext);
  return (
    <Modal isOpen onRequestClose={onClose}>
      <div className="flex flex-row">
        <h2 className="text-2xl flex-grow">Keyboard Shortcuts</h2>
        <button type="button" className="btn" onClick={onClose}>
          Close
        </button>
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
          <Kbd>2</Kbd>
          <Kbd>3</Kbd>
          <Kbd>4</Kbd>
          <Kbd>5</Kbd>
          <Kbd>6</Kbd>
          <Kbd>7</Kbd>
          <Kbd>8</Kbd>
          <Kbd>9</Kbd>
          <Kbd>0</Kbd>
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
        <h3 className="text-xl">Miscellaneous</h3>
        <div className="ml-3">
          Move Cursor: <Kbd>{settings.cursorModifierKey}</Kbd> + movement key
        </div>
        <Shortcut code={ControlCode.Wait} label="Wait" />
        <Shortcut code={ControlCode.Undo} label="Undo" />
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
        <Kbd key={key}>{key}</Kbd>
      ))}
    </div>
  );
}

function Kbd({ children }: PropsWithChildren<{}>) {
  return (
    <kbd className="bg-darkGray text-white font-mono ml-1 rounded px-1">
      {children}
    </kbd>
  );
}
