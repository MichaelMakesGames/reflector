export enum BuildingCategoryCode {
  Production = "PRODUCTION",
  Power = "POWER",
  Laser = "LASER",
  Misc = "MISC",
}

export interface BuildingCategory {
  code: BuildingCategoryCode;
  label: string;
  description: string;
}

const buildingCategories: BuildingCategory[] = [
  {
    code: BuildingCategoryCode.Production,
    label: "Production",
    description: "Buildings that produce resources other than power.",
  },
  {
    code: BuildingCategoryCode.Power,
    label: "Power",
    description: "Buildings that produce power.",
  },
  {
    code: BuildingCategoryCode.Laser,
    label: "Laser",
    description: "Buildings that manipulate lasers.",
  },
  {
    code: BuildingCategoryCode.Misc,
    label: "Misc",
    description: "Miscellaneous buildings: walls and residences.",
  },
];

export default buildingCategories;
