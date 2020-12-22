import React from "react";
import resources from "~data/resources";
import templates from "~data/templates";
import { createEntityFromTemplate } from "~utils/entities";
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
      {Object.keys(templates).map((templateId) => {
        const entity = createEntityFromTemplate(templateId as TemplateName);
        if (entity.display) {
          return (
            <mask id={`${templateId}_MASK`} key={templateId}>
              <image
                id="img"
                xlinkHref={
                  tiles[
                    Array.isArray(entity.display.tile)
                      ? entity.display.tile[0]
                      : entity.display.tile
                  ]
                }
                x="0"
                y="0"
                height="24px"
                width="24px"
              />
            </mask>
          );
        } else {
          return null;
        }
      })}
    </svg>
  );
}
