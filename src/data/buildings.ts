const buildings: {
  template: TemplateName;
  label: string;
  cost: {
    resource: Resource;
    amount: number;
  };
  validitySelector?: string;
  category?: string;
}[] = [
  {
    template: "SPLITTER_HORIZONTAL",
    label: "Splitter",
    cost: {
      resource: "REFINED_METAL",
      amount: 10,
    },
    category: "Defense",
  },
  {
    template: "SPLITTER_ADVANCED",
    label: "Advanced Splitter",
    cost: {
      resource: "REFINED_METAL",
      amount: 30,
    },
    category: "Defense",
  },
  {
    template: "WALL",
    label: "Wall",
    cost: {
      resource: "METAL",
      amount: 10,
    },
    category: "Defense",
  },
  {
    template: "RESIDENCE",
    label: "Residence",
    cost: {
      resource: "METAL",
      amount: 25,
    },
  },
  {
    template: "MINE",
    label: "Mine",
    cost: {
      resource: "METAL",
      amount: 25,
    },
    validitySelector: "canPlaceMine",
    category: "Production",
  },
  {
    template: "MINING_SPOT",
    label: "Mining Spot",
    cost: {
      resource: "METAL",
      amount: 0,
    },
    validitySelector: "canPlaceMine",
    category: "Production",
  },
  {
    template: "FARM",
    label: "Farm",
    cost: {
      resource: "METAL",
      amount: 10,
    },
    validitySelector: "canPlaceFarm",
    category: "Production",
  },
  {
    template: "POWER_PLANT",
    label: "Power Plant",
    cost: {
      resource: "METAL",
      amount: 15,
    },
    category: "Power",
  },
  {
    template: "SOLAR_PANEL",
    label: "Solar Panel",
    cost: {
      resource: "REFINED_METAL",
      amount: 5,
    },
    category: "Power",
  },
  {
    template: "WINDMILL",
    label: "Windmill",
    cost: {
      resource: "METAL",
      amount: 20,
    },
    category: "Power",
  },
  {
    template: "FURNACE",
    label: "Furnace",
    cost: {
      resource: "METAL",
      amount: 25,
    },
    category: "Production",
  },
  {
    template: "BASIC_PROJECTOR",
    label: "Basic Projector",
    cost: {
      resource: "METAL",
      amount: 20,
    },
    category: "Defense",
  },
  {
    template: "PROJECTOR",
    label: "Projector",
    cost: {
      resource: "REFINED_METAL",
      amount: 15,
    },
    category: "Defense",
  },
];
export default buildings;
