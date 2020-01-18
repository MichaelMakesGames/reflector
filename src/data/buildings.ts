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
      resource: "METAL",
      amount: 25,
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
    template: "PROJECTOR",
    key: "p",
    label: "Projector",
    cost: {
      resource: "METAL",
      amount: 50,
    },
  },
];
export default buildings;
