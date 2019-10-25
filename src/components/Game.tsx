/* global document */
import React, { useEffect, useState } from "react";
import Map from "./Map";
import Controls from "./Controls";
import Status from "./Status";
import MessageLog from "./MessageLog";
import Resources from "./Resources";
import colors from "~colors";
import OpeningDialog from "./OpeningDialog";

export default function Game() {
  useEffect(() => {
    Object.entries(colors).forEach(([color, value]) =>
      document.body.style.setProperty(`--${color}`, value),
    );
  }, []);

  const [showOpeningDialog, setShowOpeningDialog] = useState(true);

  if (showOpeningDialog) {
    return <OpeningDialog onClose={() => setShowOpeningDialog(false)} />;
  }

  return (
    <main>
      <div className="row">
        <div className="left">
          <Status />
          <Resources />
          <Controls />
        </div>
        <div className="center">
          <MessageLog />
          <Map />
        </div>
      </div>
    </main>
  );
}
