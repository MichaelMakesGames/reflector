import colors from "~colors";
import { FOOD_PER_COLONIST } from "~constants";

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
  description: string;
}

const resources: Record<ResourceCode, Resource> = {
  [ResourceCode.Food]: {
    code: ResourceCode.Food,
    label: "Food",
    icon: "food",
    color: colors.food,
    description: `Food is grown on farms. Every night, each colonist needs to eat ${FOOD_PER_COLONIST} food, otherwise you lose morale.`,
  },
  [ResourceCode.Power]: {
    code: ResourceCode.Power,
    label: "Power",
    icon: "power",
    color: colors.power,
    description:
      "Power is used by many jobs and buildings. It can be produced automatically by some buildings, or by colonists working at a reactor.",
  },
  [ResourceCode.Metal]: {
    code: ResourceCode.Metal,
    label: "Metal",
    icon: "metal",
    color: colors.mineral,
    description:
      "Metal is used to build basic buildings, and can be turned into machinery at a factory.",
  },
  [ResourceCode.Machinery]: {
    code: ResourceCode.Machinery,
    label: "Machinery",
    icon: "machinery",
    color: colors.activeBuilding,
    description:
      "Machinery is used to build advanced buildings. It is produced from metal by colonists working at factories.",
  },
};

export default resources;
