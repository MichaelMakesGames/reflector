import React from "react";
// @ts-ignore
import tiles from "url:../assets/tiles/*.png";
import resources, { ResourceCode } from "../data/resources";

interface Props {
  resourceCode: ResourceCode;
  style?: React.CSSProperties;
}
export default function ResourceIcon({ resourceCode, style = {} }: Props) {
  const resource = resources[resourceCode];
  const maskImage = `url(${tiles[resource.icon]})`;
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
        WebkitMaskImage: maskImage,
        maskImage,
        ...style,
      }}
    />
  );
}
