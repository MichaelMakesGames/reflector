import React, { useEffect } from "react";
import { useDispatch } from "redux-react-hook";
import Map from "./Map";
import Controls from "./Controls";
import * as actions from "../actions";
import Weapons from "./Weapons";
import Status from "./Status";
import Legend from "./Legend";
import MessageLog from "./MessageLog";
import DamageFlash from "./DamageFlash";

export default function Game() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.init());
  }, []);

  return (
    <main>
      <div className="row">
        <div className="left">
          <Weapons />
        </div>
        <div className="center">
          <MessageLog />
          <Map />
          <Status />
        </div>
        <div className="right">
          <Legend />
        </div>
      </div>
      <div className="row">
        <Controls />
      </div>
      <DamageFlash />
    </main>
  );
}
