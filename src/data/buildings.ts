export default [
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
    template: "PROJECTOR",
    key: "p",
    label: "Projector",
    cost: {
      resource: "METAL",
      amount: 50,
    },
  },
];
