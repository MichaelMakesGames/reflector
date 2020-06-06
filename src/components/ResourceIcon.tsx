import React from "react";
import resources, { ResourceCode } from "~data/resources";
// @ts-ignore
import tiles from "../assets/tiles/*.png";

interface Props {
  resourceCode: ResourceCode;
}
export default function ResourceIcon({ resourceCode }: Props) {
  const resource = resources[resourceCode];
  return (
    <div
      style={{
        display: "inline-block",
        background: resource.color,
        height: 24,
        width: 24,
        mask: `url(#${resourceCode}_MASK)`,
        WebkitMaskImage: `url(${tiles[resource.icon]})`,
      }}
    />
  );
}
