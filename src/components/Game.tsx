import React, { useEffect } from "react";
import { useDispatch } from "redux-react-hook";
import Map from "./Map";
import Controls from "./Controls";
import * as actions from "../redux/actions";

export default function Game() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.init());
  }, []);

  return (
    <div>
      <Map />
      <Controls />
    </div>
  );
}
