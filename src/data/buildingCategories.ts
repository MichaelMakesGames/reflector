export enum BuildingCategoryCode {
  Production = "PRODUCTION",
  Laser = "LASER",
  Misc = "MISC",
}

export interface BuildingCategory {
  code: BuildingCategoryCode;
  label: string;
  description: string;
  blueprints: TemplateName[];
}

const buildingCategories: BuildingCategory[] = [
  {
    code: BuildingCategoryCode.Production,
    label: "Production",
    description: "Buildings that produce resources.",
    blueprints: [
      "BLUEPRINT_FARM",
      "BLUEPRINT_MINING_SPOT",
      "BLUEPRINT_MINE",
      "BLUEPRINT_FACTORY",
      "BLUEPRINT_WINDMILL",
      "BLUEPRINT_SOLAR_PANEL",
      "BLUEPRINT_REACTOR",
    ],
  },
  {
    code: BuildingCategoryCode.Laser,
    label: "Laser",
    description: "Buildings that manipulate lasers.",
    blueprints: [
      "BLUEPRINT_PROJECTOR_BASIC",
      "BLUEPRINT_SPLITTER_HORIZONTAL",
      "BLUEPRINT_PROJECTOR_ADVANCED",
      "BLUEPRINT_SPLITTER_ADVANCED",
    ],
  },
  {
    code: BuildingCategoryCode.Misc,
    label: "Misc",
    description: "Miscellaneous buildings: walls and residences.",
    blueprints: ["BLUEPRINT_RESIDENCE", "BLUEPRINT_WALL"],
  },
];

export default buildingCategories;
