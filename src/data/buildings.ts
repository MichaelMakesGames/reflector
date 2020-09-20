import { BuildingCategoryCode } from "./buildingCategories";
import { ResourceCode } from "./resources";

const buildings: {
  template: TemplateName;
  label: string;
  cost: {
    resource: ResourceCode;
    amount: number;
  };
  validitySelector?: string;
  category: BuildingCategoryCode;
}[] = [
  {
    template: "FARM",
    label: "Farm",
    cost: {
      resource: ResourceCode.Metal,
      amount: 10,
    },
    validitySelector: "canPlaceFarm",
    category: BuildingCategoryCode.Production,
  },
  {
    template: "MINING_SPOT",
    label: "Mining Spot",
    cost: {
      resource: ResourceCode.Metal,
      amount: 0,
    },
    validitySelector: "canPlaceMine",
    category: BuildingCategoryCode.Production,
  },
  {
    template: "MINE",
    label: "Mine",
    cost: {
      resource: ResourceCode.Metal,
      amount: 25,
    },
    validitySelector: "canPlaceMine",
    category: BuildingCategoryCode.Production,
  },
  {
    template: "FACTORY",
    label: "Factory",
    cost: {
      resource: ResourceCode.Metal,
      amount: 25,
    },
    category: BuildingCategoryCode.Production,
  },
  {
    template: "WINDMILL",
    label: "Windmill",
    cost: {
      resource: ResourceCode.Metal,
      amount: 20,
    },
    category: BuildingCategoryCode.Power,
  },
  {
    template: "SOLAR_PANEL",
    label: "Solar Panel",
    cost: {
      resource: ResourceCode.Machinery,
      amount: 5,
    },
    category: BuildingCategoryCode.Power,
  },
  {
    template: "REACTOR",
    label: "Reactor",
    cost: {
      resource: ResourceCode.Machinery,
      amount: 25,
    },
    category: BuildingCategoryCode.Power,
  },
  {
    template: "BASIC_PROJECTOR",
    label: "Projector",
    cost: {
      resource: ResourceCode.Metal,
      amount: 20,
    },
    category: BuildingCategoryCode.Laser,
  },
  {
    template: "SPLITTER_HORIZONTAL",
    label: "Splitter",
    cost: {
      resource: ResourceCode.Metal,
      amount: 25,
    },
    category: BuildingCategoryCode.Laser,
  },
  {
    template: "PROJECTOR",
    label: "Adv Projector",
    cost: {
      resource: ResourceCode.Machinery,
      amount: 15,
    },
    category: BuildingCategoryCode.Laser,
  },
  {
    template: "SPLITTER_ADVANCED",
    label: "Adv Splitter",
    cost: {
      resource: ResourceCode.Machinery,
      amount: 30,
    },
    category: BuildingCategoryCode.Laser,
  },
  {
    template: "RESIDENCE",
    label: "Residence",
    cost: {
      resource: ResourceCode.Metal,
      amount: 25,
    },
    category: BuildingCategoryCode.Misc,
  },
  {
    template: "WALL",
    label: "Wall",
    cost: {
      resource: ResourceCode.Metal,
      amount: 10,
    },
    category: BuildingCategoryCode.Misc,
  },
];
export default buildings;
