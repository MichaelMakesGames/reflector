import React from "react";
import resources, { ResourceCode } from "~data/resources";
// @ts-ignore
import tiles from "../assets/tiles/*.png";

interface Props {
  resourceCode: ResourceCode;
  style?: React.CSSProperties;
}
export default function ResourceIcon({ resourceCode, style = {} }: Props) {
  const resource = resources[resourceCode];
  return (
    <div
      style={{
        display: "inline-block",
        position: "relative",
        bottom: "8px",
        margin: "-12px 0",
        background: resource.color,
        height: 24,
        width: 24,
        mask: `url(#${resourceCode}_MASK)`,
        WebkitMaskImage: `url(${tiles[resource.icon]})`,
        ...style,
      }}
    />
  );
}
