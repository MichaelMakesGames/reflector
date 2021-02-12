import React from "react";
import templates from "~data/templates";
import { createEntityFromTemplate } from "~utils/entities";
// @ts-ignore
import tiles from "../assets/tiles/*.png";

interface Props {
  templateName: TemplateName;
  style?: React.CSSProperties;
}
export default function EntityPreview({ templateName, style = {} }: Props) {
  if (!Object.keys(templates).includes(templateName)) return null;
  const entity = createEntityFromTemplate(templateName);
  if (!entity.display) return null;
  return (
    <div
      style={{
        display: "inline-block",
        position: "relative",
        bottom: "8px",
        margin: "-12px 0",
        background: entity.display.color,
        height: 24,
        width: 24,
        mask: `url(#${templateName}_MASK)`,
        WebkitMaskImage: `url(${
          tiles[
            Array.isArray(entity.display.tile)
              ? entity.display.tile[0]
              : entity.display.tile
          ]
        })`,
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
