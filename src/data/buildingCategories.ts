import { TemplateName } from "../types/TemplateName";

export enum BuildingCategoryCode {
  Work = "WORK",
  Power = "POWER",
  Defense = "DEFENSE",
  Housing = "HOUSING",
  Infrastructure = "Infrastructure",
}

export interface BuildingCategory {
  code: BuildingCategoryCode;
  label: string;
  description: string;
  blueprints: TemplateName[];
}

const buildingCategories: BuildingCategory[] = [
  {
    code: BuildingCategoryCode.Work,
    label: "Work",
    description: "Buildings that provide jobs for your colonists.",
    blueprints: [
      "BLUEPRINT_FARM",
      "BLUEPRINT_MINING_SPOT",
      "BLUEPRINT_MINE",
      "BLUEPRINT_FACTORY",
    ],
  },
  {
    code: BuildingCategoryCode.Power,
    label: "Power",
    description: "Buildings that produce power.",
    blueprints: [
      "BLUEPRINT_WINDMILL",
      "BLUEPRINT_SOLAR_PANEL",
      "BLUEPRINT_REACTOR",
    ],
  },
  {
    code: BuildingCategoryCode.Defense,
    label: "Defense",
    description: "Defense and laser-manipulating buildings.",
    blueprints: [
      "BLUEPRINT_WALL",
      "BLUEPRINT_PROJECTOR_BASIC",
      "BLUEPRINT_PROJECTOR_ADVANCED",
      "BLUEPRINT_SPLITTER_HORIZONTAL",
      "BLUEPRINT_SPLITTER_ADVANCED",
      "BLUEPRINT_ABSORBER",
      "BLUEPRINT_SHIELD_GENERATOR",
    ],
  },
  {
    code: BuildingCategoryCode.Housing,
    label: "Housing",
    description: "Places for your colonists to sleep.",
    blueprints: ["BLUEPRINT_TENT", "BLUEPRINT_RESIDENCE"],
  },
  {
    code: BuildingCategoryCode.Infrastructure,
    label: "Infrastructure",
    description: "Roads and storage.",
    blueprints: ["BLUEPRINT_ROAD", "BLUEPRINT_BATTERY", "BLUEPRINT_WAREHOUSE"],
  },
];

export default buildingCategories;
