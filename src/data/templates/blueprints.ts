import { ResourceCode } from "~data/resources";
import colors from "~colors";
import { Rotatable, Entity, Description } from "~types";
import buildings from "./buildings";
import { PRIORITY_BUILDING_HIGH, BUILDING_RANGE } from "~constants";

const DEFAULT_VALIDITY_CONDITIONS: {
  condition: ConditionName;
  invalidMessage: string;
}[] = [
  {
    condition: "isNotOnEdgeOfMap",
    invalidMessage: "Cannot build on edge of map.",
  },
  {
    condition: "isNotOnOtherBuilding",
    invalidMessage: "There is already another building here.",
  },
  {
    condition: "isNotBlocked",
    invalidMessage: "This position is blocked by a building, unit, or terrain.",
  },
  {
    condition: "isInBuildRange",
    invalidMessage: `Cannot build more than ${BUILDING_RANGE} spaces away.`,
  },
];

function makeBlueprint(
  builds: TemplateName,
  cost: { resource: ResourceCode; amount: number },
  validityConditions: { condition: ConditionName; invalidMessage: string }[],
  rotatable?: Rotatable,
): Partial<Entity> {
  const buildsTemplate = buildings[builds];
  const buildsTemplateParent =
    buildings[
      buildsTemplate && buildsTemplate.parentTemplate
        ? buildsTemplate.parentTemplate
        : "NONE"
    ];
  let description: Description = { name: builds, description: "" };
  if (buildsTemplate && buildsTemplate.description) {
    description = buildsTemplate.description;
  } else if (buildsTemplateParent && buildsTemplateParent.description) {
    description = buildsTemplateParent.description;
  }
  return {
    blueprint: {
      builds,
      cost,
      validityConditions,
    },
    display:
      buildsTemplate && buildsTemplate.display
        ? {
            ...buildsTemplate.display,
            color: colors.blueprint,
          }
        : {
            tile: "outline_solid",
            color: colors.blueprint,
            priority: PRIORITY_BUILDING_HIGH,
          },
    description,
    rotatable,
  };
}

const templates: Partial<Record<TemplateName, Partial<Entity>>> = {};

templates.BLUEPRINT_FARM = makeBlueprint(
  "BUILDING_FARM",
  { resource: ResourceCode.Metal, amount: 0 },
  [
    ...DEFAULT_VALIDITY_CONDITIONS,
    { condition: "isOnFertile", invalidMessage: "Must build on fertile land." },
  ],
);
templates.BLUEPRINT_MINING_SPOT = makeBlueprint(
  "BUILDING_MINING_SPOT",
  { resource: ResourceCode.Metal, amount: 0 },
  [
    ...DEFAULT_VALIDITY_CONDITIONS,
    { condition: "isOnOre", invalidMessage: "Must build on ore." },
  ],
);
templates.BLUEPRINT_MINE = makeBlueprint(
  "BUILDING_MINE",
  { resource: ResourceCode.Metal, amount: 30 },
  [
    ...DEFAULT_VALIDITY_CONDITIONS,
    { condition: "isOnOre", invalidMessage: "Must build on ore." },
  ],
);
templates.BLUEPRINT_FACTORY = makeBlueprint(
  "BUILDING_FACTORY",
  { resource: ResourceCode.Metal, amount: 50 },
  DEFAULT_VALIDITY_CONDITIONS,
);
templates.BLUEPRINT_WINDMILL = makeBlueprint(
  "BUILDING_WINDMILL",
  { resource: ResourceCode.Metal, amount: 20 },
  [
    ...DEFAULT_VALIDITY_CONDITIONS,
    {
      condition: "doesNotHaveTallNeighbors",
      invalidMessage: "Windmills cannot be next to tall buildings or terrain.",
    },
  ],
);
templates.BLUEPRINT_SOLAR_PANEL = makeBlueprint(
  "BUILDING_SOLAR_PANEL",
  { resource: ResourceCode.Machinery, amount: 20 },
  DEFAULT_VALIDITY_CONDITIONS,
);
templates.BLUEPRINT_REACTOR = makeBlueprint(
  "BUILDING_REACTOR",
  { resource: ResourceCode.Machinery, amount: 80 },
  DEFAULT_VALIDITY_CONDITIONS,
);
templates.BLUEPRINT_PROJECTOR_BASIC = makeBlueprint(
  "BUILDING_PROJECTOR_BASIC",
  { resource: ResourceCode.Metal, amount: 50 },
  DEFAULT_VALIDITY_CONDITIONS,
);
templates.BLUEPRINT_SPLITTER_HORIZONTAL = makeBlueprint(
  "BUILDING_SPLITTER_HORIZONTAL",
  { resource: ResourceCode.Metal, amount: 80 },
  DEFAULT_VALIDITY_CONDITIONS,
  { rotatesTo: "BLUEPRINT_SPLITTER_VERTICAL" },
);
templates.BLUEPRINT_SPLITTER_VERTICAL = makeBlueprint(
  "BUILDING_SPLITTER_VERTICAL",
  { resource: ResourceCode.Metal, amount: 80 },
  DEFAULT_VALIDITY_CONDITIONS,
  { rotatesTo: "BLUEPRINT_SPLITTER_HORIZONTAL" },
);
templates.BLUEPRINT_PROJECTOR_ADVANCED = makeBlueprint(
  "BUILDING_PROJECTOR_ADVANCED",
  { resource: ResourceCode.Machinery, amount: 50 },
  DEFAULT_VALIDITY_CONDITIONS,
);
templates.BLUEPRINT_SPLITTER_ADVANCED = makeBlueprint(
  "BUILDING_SPLITTER_ADVANCED",
  { resource: ResourceCode.Machinery, amount: 80 },
  DEFAULT_VALIDITY_CONDITIONS,
);
templates.BLUEPRINT_RESIDENCE = makeBlueprint(
  "BUILDING_RESIDENCE",
  { resource: ResourceCode.Metal, amount: 30 },
  DEFAULT_VALIDITY_CONDITIONS,
);
templates.BLUEPRINT_WALL = makeBlueprint(
  "BUILDING_WALL",
  { resource: ResourceCode.Metal, amount: 20 },
  DEFAULT_VALIDITY_CONDITIONS,
);

export default templates;
