import colors from "~colors";

export enum ResourceCode {
  Food = "FOOD",
  Power = "POWER",
  Metal = "METAL",
  Machinery = "MACHINERY",
}

export interface Resource {
  code: ResourceCode;
  label: string;
  icon: string;
  color: string;
}

const resources: Record<ResourceCode, Resource> = {
  [ResourceCode.Food]: {
    code: ResourceCode.Food,
    label: "Food",
    icon: "food",
    color: colors.food,
  },
  [ResourceCode.Power]: {
    code: ResourceCode.Power,
    label: "Power",
    icon: "power",
    color: colors.power,
  },
  [ResourceCode.Metal]: {
    code: ResourceCode.Metal,
    label: "Metal",
    icon: "metal",
    color: colors.mineral,
  },
  [ResourceCode.Machinery]: {
    code: ResourceCode.Machinery,
    label: "Machinery",
    icon: "machinery",
    color: colors.activeBuilding,
  },
};

export default resources;
