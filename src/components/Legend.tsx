import React from "react";
import { useMappedState } from "redux-react-hook";
import * as selectors from "../selectors";
import {
  WHITE,
  RED,
  GREEN,
  BLUE,
  BLACK,
  GRAY,
  BRIGHT_RED,
  ANGLER_RANGE,
  PURPLE,
} from "../constants";

export default function Legend() {
  const entities = useMappedState(selectors.entityList);
  return (
    <div className="box legend">
      <div className="box__label">Legend</div>
      <div className="legend__item">
        <span className="legend__glyph" style={{ color: WHITE }}>
          @
        </span>
        <span className="legend__desc">Player</span>
      </div>
      <div className="legend__item legend__item--half">
        <span className="legend__glyph" style={{ color: WHITE }}>
          {"<"}
        </span>
        <span className="legend__desc">Stairs</span>
      </div>
      <div className="legend__item legend__item--half">
        <span className="legend__glyph" style={{ color: GRAY }}>
          {"#"}
        </span>
        <span className="legend__desc">Wall</span>
      </div>
      <div className="legend__item legend__item--half">
        <span className="legend__glyph" style={{ color: PURPLE }}>
          ◉
        </span>
        <span className="legend__desc">Teleporter</span>
      </div>
      <div className="legend__item legend__item--half">
        <span className="legend__glyph" style={{ color: RED }}>
          ✚
        </span>
        <span className="legend__desc">Med Kit </span>
      </div>
      <div className="legend__item legend__item--half">
        <span className="legend__glyph" style={{ color: GREEN }}>
          ⇮
        </span>
        <span className="legend__desc">Recharge Kit</span>
      </div>
      <div className="legend__item legend__item--half">
        <span className="legend__glyph" style={{ color: RED }}>
          w
        </span>
        <span className="legend__desc">Weapon</span>
      </div>
      <div className="legend__item">
        <span className="legend__glyph" style={{ color: WHITE }}>
          ⬌
        </span>
        <span className="legend__desc">Splitter - splits beam</span>
      </div>
      <div className="legend__item">
        <span className="legend__glyph" style={{ color: WHITE }}>
          /
        </span>
        <span className="legend__desc">
          Reflector - reflects beam 90 degrees
        </span>
      </div>
      <div className="legend__item">
        <span className="legend__glyph" style={{ color: BLUE }}>
          R
        </span>
        <span className="legend__desc">
          Rusher - melees you or anything in the way
        </span>
      </div>
      <div className="legend__item">
        <span className="legend__glyph" style={{ color: BLUE }}>
          A
        </span>
        <span className="legend__desc">
          Angler - attacks at range from angle
        </span>
      </div>
      <div className="legend__item">
        <span className="legend__glyph" style={{ color: BLUE }}>
          S
        </span>
        <span className="legend__desc">
          Smasher - melees you, reflectors, or splitters
        </span>
      </div>
      <div className="legend__item">
        <span className="legend__glyph" style={{ color: BLUE }}>
          B
        </span>
        <span className="legend__desc">Bomber - throws bombs</span>
      </div>
      <div className="legend__item">
        <span className="legend__glyph" style={{ color: BRIGHT_RED }}>
          b
        </span>
        <span className="legend__desc">Bomb - explodes if not destroyed</span>
      </div>
      <div className="legend__item">
        <span
          className="legend__glyph"
          style={{ color: BLACK, background: BLUE }}
        >
          R
        </span>
        <span className="legend__desc">Enemy Factory - Destroy to win!</span>
      </div>
    </div>
  );
}
