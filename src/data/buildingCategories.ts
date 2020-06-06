export enum BuildingCategoryCode {
  Production = "PRODUCTION",
  Power = "POWER",
  Laser = "LASER",
  Misc = "MISC",
}

export interface BuildingCategory {
  code: BuildingCategoryCode;
  label: string;
}

const buildingCategories: BuildingCategory[] = [
  { code: BuildingCategoryCode.Production, label: "Production" },
  { code: BuildingCategoryCode.Power, label: "Power" },
  { code: BuildingCategoryCode.Laser, label: "Laser" },
  { code: BuildingCategoryCode.Misc, label: "Misc" },
];

export default buildingCategories;
