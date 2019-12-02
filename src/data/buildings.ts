export default [
  {
    template: "SPLITTER_HORIZONTAL" as TemplateName,
    key: "s",
    label: "Splitter",
    cost: {
      resource: "METAL",
      amount: 25,
    },
  },
  {
    template: "WALL" as TemplateName,
    key: "w",
    label: "Wall",
    cost: {
      resource: "METAL",
      amount: 10,
    },
  },
  {
    template: "RESIDENCE" as TemplateName,
    key: "r",
    label: "Residence",
    cost: {
      resource: "METAL",
      amount: 25,
    },
  },
  {
    template: "MINE" as TemplateName,
    key: "m",
    label: "Mine",
    cost: {
      resource: "METAL",
      amount: 25,
    },
    validitySelector: "canPlaceMine",
  },
  {
    template: "PROJECTOR" as TemplateName,
    key: "p",
    label: "Projector",
    cost: {
      resource: "METAL",
      amount: 50,
    },
  },
];
