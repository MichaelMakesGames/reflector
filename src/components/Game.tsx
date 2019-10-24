/* global document */
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Map from "./Map";
import Controls from "./Controls";
import * as actions from "~/state/actions";
import Status from "./Status";
import MessageLog from "./MessageLog";
import Resources from "./Resources";
import colors from "~colors";

export default function Game() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.init());
    Object.entries(colors).forEach(([color, value]) =>
      document.body.style.setProperty(`--${color}`, value),
    );
  }, []);

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
