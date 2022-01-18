import React, { useState } from "react";
import { RNG } from "rot-js";
import mapTypes from "../../data/mapTypes";
import actions from "../../state/actions";
import { useDispatch } from "../GameProvider";
import Menu from "../Menu";
import MenuButton from "../MenuButton";
import MenuOptionSelector from "../MenuOptionSelector";
import MenuTitle from "../MenuTitle";
import { RouterPageProps } from "../Router";

export default function NewGame({ goBack, navigateTo }: RouterPageProps) {
  const dispatch = useDispatch();
  const [mapType, setMapType] = useState("standard");

  return (
    <div className="mt-10">
      <Menu>
        <MenuTitle goBack={goBack}>New Game</MenuTitle>
        <MenuOptionSelector
          label="Map Type"
          value={mapType}
          onChange={setMapType}
          options={[
            "standard",
            "marsh",
            "badlands",
            "plains",
            "mesa",
            "lakes",
            "random",
          ].map((type) => ({ id: type, name: type }))}
        />
        <MenuButton
          onClick={() => {
            dispatch(
              actions.newGame({
                mapType:
                  mapType === "random"
                    ? RNG.getItem(Object.keys(mapTypes)) ?? "standard"
                    : mapType,
              })
            );
            navigateTo("Game");
          }}
        >
          Begin
        </MenuButton>
      </Menu>
    </div>
  );
}
