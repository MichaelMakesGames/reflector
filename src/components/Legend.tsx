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
        <span className="legend__desc">The Player</span>
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
        <span className="legend__glyph" style={{ color: WHITE }}>
          ⬌
        </span>
        <span className="legend__desc">
          Splitter - splits beam into 2 less powerful beams
        </span>
      </div>
      <div className="legend__item">
        <span className="legend__glyph" style={{ color: WHITE }}>
          {"<"}
        </span>
        <span className="legend__desc">Stairs - descend to the next level</span>
      </div>
      <div className="legend__item">
        <span className="legend__glyph" style={{ color: GRAY }}>
          {"#"}
        </span>
        <span className="legend__desc">
          Wall - interior walls are destructible
        </span>
      </div>
      <div className="legend__item">
        <span className="legend__glyph" style={{ color: PURPLE }}>
          ◉
        </span>
        <span className="legend__desc">
          Teleporter - swap positions with the other teleporter
        </span>
      </div>
      <div className="legend__item">
        <span className="legend__glyph" style={{ color: RED }}>
          ✚
        </span>
        <span className="legend__desc">Med Kit - heals 1</span>
      </div>
      <div className="legend__item">
        <span className="legend__glyph" style={{ color: GREEN }}>
          ⇮
        </span>
        <span className="legend__desc">Recharge Kit - charges all weapons</span>
      </div>
      <div className="legend__item">
        <span className="legend__glyph" style={{ color: RED }}>
          w
        </span>
        <span className="legend__desc">Weapon</span>
      </div>
      <div className="legend__item">
        <span className="legend__glyph" style={{ color: BLUE }}>
          R
        </span>
        <span className="legend__desc">
          Rusher - takes the shortest path for you, destroying anything in its
          path (except other enemies)
        </span>
      </div>
      <div className="legend__item">
        <span className="legend__glyph" style={{ color: BLUE }}>
          A
        </span>
        <span className="legend__desc">
          Angler - attacks from a 45 degree angle at a range of up to{" "}
          {ANGLER_RANGE}
        </span>
      </div>
      <div className="legend__item">
        <span className="legend__glyph" style={{ color: BLUE }}>
          S
        </span>
        <span className="legend__desc">
          Smasher - targets you, your reflectors, or your splitters, whatever is
          closest.
        </span>
      </div>
      <div className="legend__item">
        <span className="legend__glyph" style={{ color: BLUE }}>
          B
        </span>
        <span className="legend__desc">
          Bomber - throws a bomb that damages everything adjacent, but cannot
          throw every turn.
        </span>
      </div>
      <div className="legend__item">
        <span className="legend__glyph" style={{ color: BRIGHT_RED }}>
          b
        </span>
        <span className="legend__desc">
          Bomb - explodes damages everything adjacent. Does not explode if
          destroyed.
        </span>
      </div>
      <div className="legend__item">
        <span
          className="legend__glyph"
          style={{ color: BLACK, background: BLUE }}
        >
          R
        </span>
        <span className="legend__desc">
          Factory - produces enemies. Destroy these to win!
        </span>
      </div>
    </div>
  );
}
