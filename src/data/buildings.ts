const buildings: {
  template: TemplateName;
  key: string;
  label: string;
  cost: {
    resource: Resource;
    amount: number;
  };
  validitySelector?: string;
}[] = [
  {
    template: "SPLITTER_HORIZONTAL",
    key: "s",
    label: "Splitter",
    cost: {
      resource: "REFINED_METAL",
      amount: 10,
    },
  },
  {
    template: "WALL",
    key: "w",
    label: "Wall",
    cost: {
      resource: "METAL",
      amount: 10,
    },
  },
  {
    template: "RESIDENCE",
    key: "r",
    label: "Residence",
    cost: {
      resource: "METAL",
      amount: 25,
    },
  },
  {
    template: "MINE",
    key: "m",
    label: "Mine",
    cost: {
      resource: "METAL",
      amount: 25,
    },
    validitySelector: "canPlaceMine",
  },
  {
    template: "FARM",
    key: "f",
    label: "Farm",
    cost: {
      resource: "METAL",
      amount: 10,
    },
    validitySelector: "canPlaceFarm",
  },
  {
    template: "POWER_PLANT",
    key: "o",
    label: "Power Plant",
    cost: {
      resource: "METAL",
      amount: 15,
    },
  },
  {
    template: "SOLAR_PANEL",
    key: "l",
    label: "Solar Panel",
    cost: {
      resource: "REFINED_METAL",
      amount: 5,
    },
  },
  {
    template: "WINDMILL",
    key: "n",
    label: "Windmill",
    cost: {
      resource: "METAL",
      amount: 20,
    },
  },
  {
    template: "FURNACE",
    key: "u",
    label: "Furnace",
    cost: {
      resource: "METAL",
      amount: 25,
    },
  },
  {
    template: "BASIC_PROJECTOR",
    key: "b",
    label: "Basic Projector",
    cost: {
      resource: "METAL",
      amount: 20,
    },
  },
  {
    template: "PROJECTOR",
    key: "p",
    label: "Projector",
    cost: {
      resource: "REFINED_METAL",
      amount: 15,
    },
  },
];
export default buildings;
