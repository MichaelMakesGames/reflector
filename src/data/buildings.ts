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
  invalidMessage?: string;
  category: BuildingCategoryCode;
}[] = [
  {
    template: "FARM",
    label: "Farm",
    cost: {
      resource: ResourceCode.Metal,
      amount: 0,
    },
    validitySelector: "canPlaceFarm",
    invalidMessage: "Must place on fertile land without other buildings.",
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
    invalidMessage: "Must place on ore without other buildings.",
    category: BuildingCategoryCode.Production,
  },
  {
    template: "MINE",
    label: "Mine",
    cost: {
      resource: ResourceCode.Metal,
      amount: 30,
    },
    validitySelector: "canPlaceMine",
    invalidMessage: "Must place on ore without other buildings.",
    category: BuildingCategoryCode.Production,
  },
  {
    template: "FACTORY",
    label: "Factory",
    cost: {
      resource: ResourceCode.Metal,
      amount: 50,
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
    category: BuildingCategoryCode.Production,
    invalidMessage:
      "Must place in location without neighboring buildings or mountains.",
    validitySelector: "canPlaceWindmill",
  },
  {
    template: "SOLAR_PANEL",
    label: "Solar Panel",
    cost: {
      resource: ResourceCode.Machinery,
      amount: 20,
    },
    category: BuildingCategoryCode.Production,
  },
  {
    template: "REACTOR",
    label: "Reactor",
    cost: {
      resource: ResourceCode.Machinery,
      amount: 80,
    },
    category: BuildingCategoryCode.Production,
  },
  {
    template: "BASIC_PROJECTOR",
    label: "Projector",
    cost: {
      resource: ResourceCode.Metal,
      amount: 50,
    },
    category: BuildingCategoryCode.Laser,
  },
  {
    template: "SPLITTER_HORIZONTAL",
    label: "Splitter",
    cost: {
      resource: ResourceCode.Metal,
      amount: 80,
    },
    category: BuildingCategoryCode.Laser,
  },
  {
    template: "PROJECTOR",
    label: "Adv Projector",
    cost: {
      resource: ResourceCode.Machinery,
      amount: 50,
    },
    category: BuildingCategoryCode.Laser,
  },
  {
    template: "SPLITTER_ADVANCED",
    label: "Adv Splitter",
    cost: {
      resource: ResourceCode.Machinery,
      amount: 80,
    },
    category: BuildingCategoryCode.Laser,
  },
  {
    template: "RESIDENCE",
    label: "Residence",
    cost: {
      resource: ResourceCode.Metal,
      amount: 30,
    },
    category: BuildingCategoryCode.Misc,
  },
  {
    template: "WALL",
    label: "Wall",
    cost: {
      resource: ResourceCode.Metal,
      amount: 20,
    },
    category: BuildingCategoryCode.Misc,
  },
];
export default buildings;
