import React from "react";
import resources from "~data/resources";
// @ts-ignore
import tiles from "../assets/tiles/*.png";

export default function IconMasks() {
  return (
    <svg width={0} height={0}>
      {Object.values(resources).map((resource) => (
        <mask id={`${resource.code}_MASK`} key={resource.code}>
          <image
            id="img"
            xlinkHref={tiles[resource.icon]}
            x="0"
            y="0"
            height="24px"
            width="24px"
          />
        </mask>
      ))}
    </svg>
  );
}
