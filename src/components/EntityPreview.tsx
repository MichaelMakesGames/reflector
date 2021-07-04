import React from "react";
import templates from "~data/templates";
import { createEntityFromTemplate } from "~lib/entities";
// @ts-ignore
import tiles from "../assets/tiles/*.png";
import colors from "../data/colors.json";

interface Props {
  templateName: TemplateName;
  style?: React.CSSProperties;
}
export default function EntityPreview({ templateName, style = {} }: Props) {
  if (!Object.keys(templates).includes(templateName)) return null;
  const entity = createEntityFromTemplate(templateName);
  if (!entity.display) return null;
  const maskImage = `url(${
    tiles[
      Array.isArray(entity.display.tile)
        ? entity.display.tile[0]
        : entity.display.tile
    ]
  })`;
  return (
    <div
      style={{
        display: "inline-block",
        position: "relative",
        bottom: "8px",
        margin: "-12px 0",
        background:
          entity.display.color === colors.darkGray
            ? colors.gray
            : entity.display.color,
        height: 24,
        width: 24,
        WebkitMaskImage: maskImage,
        maskImage,
        ...style,
      }}
    >
      <img
        width={24}
        height={24}
        alt={entity.description ? entity.description.name : templateName}
        style={{ mixBlendMode: "multiply" }}
        src={
          tiles[
            Array.isArray(entity.display.tile)
              ? entity.display.tile[0]
              : entity.display.tile
          ]
        }
      />
    </div>
  );
}
