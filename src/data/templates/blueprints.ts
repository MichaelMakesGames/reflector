import colors from "~colors";
import { BUILDING_RANGE, PRIORITY_BUILDING_HIGH } from "~constants";
import { ResourceCode } from "~data/resources";
import { Description, Entity } from "~types";
import buildings from "./buildings";

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

interface MakeBlueprintConfig {
  builds: TemplateName;
  cost?: { resource: ResourceCode; amount: number };
  validityConditions?: { condition: ConditionName; invalidMessage: string }[];
  rotatesTo?: TemplateName;
  canReplace?: TemplateName[];
}

function makeBlueprint({
  builds,
  cost = { resource: ResourceCode.Metal, amount: 0 },
  validityConditions = DEFAULT_VALIDITY_CONDITIONS,
  rotatesTo,
  canReplace,
}: MakeBlueprintConfig): Partial<Entity> {
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
      canReplace,
    },
    display:
      buildsTemplate && buildsTemplate.display
        ? {
            ...buildsTemplate.display,
            color: colors.blueprint,
            discreteMovement: true,
          }
        : {
            tile: "outline_solid",
            color: colors.blueprint,
            priority: PRIORITY_BUILDING_HIGH,
            discreteMovement: true,
          },
    description,
    ...(rotatesTo ? { rotatable: { rotatesTo } } : {}),
  };
}

const templates: Partial<Record<TemplateName, Partial<Entity>>> = {};

templates.BLUEPRINT_FARM = makeBlueprint({
  builds: "BUILDING_FARM",
  validityConditions: [
    ...DEFAULT_VALIDITY_CONDITIONS,
    { condition: "isOnFertile", invalidMessage: "Must build on fertile land." },
  ],
});
templates.BLUEPRINT_MINING_SPOT = makeBlueprint({
  builds: "BUILDING_MINING_SPOT",
  validityConditions: [
    ...DEFAULT_VALIDITY_CONDITIONS,
    { condition: "isOnOre", invalidMessage: "Must build on ore." },
  ],
});
templates.BLUEPRINT_MINE = makeBlueprint({
  builds: "BUILDING_MINE",
  cost: { resource: ResourceCode.Metal, amount: 30 },
  validityConditions: [
    ...DEFAULT_VALIDITY_CONDITIONS,
    { condition: "isOnOre", invalidMessage: "Must build on ore." },
  ],
  canReplace: ["BUILDING_MINING_SPOT"],
});
templates.BLUEPRINT_FACTORY = makeBlueprint({
  builds: "BUILDING_FACTORY",
  cost: { resource: ResourceCode.Metal, amount: 50 },
});
templates.BLUEPRINT_WINDMILL = makeBlueprint({
  builds: "BUILDING_WINDMILL",
  cost: { resource: ResourceCode.Metal, amount: 20 },
  validityConditions: [
    ...DEFAULT_VALIDITY_CONDITIONS,
    {
      condition: "doesNotHaveTallNeighbors",
      invalidMessage: "Windmills cannot be next to tall buildings or terrain.",
    },
  ],
});
templates.BLUEPRINT_SOLAR_PANEL = makeBlueprint({
  builds: "BUILDING_SOLAR_PANEL",
  cost: { resource: ResourceCode.Machinery, amount: 20 },
});
templates.BLUEPRINT_REACTOR = makeBlueprint({
  builds: "BUILDING_REACTOR",
  cost: { resource: ResourceCode.Machinery, amount: 80 },
});
templates.BLUEPRINT_PROJECTOR_BASIC = makeBlueprint({
  builds: "BUILDING_PROJECTOR_BASIC",
  cost: { resource: ResourceCode.Metal, amount: 50 },
});
templates.BLUEPRINT_SPLITTER_HORIZONTAL = makeBlueprint({
  builds: "BUILDING_SPLITTER_HORIZONTAL",
  cost: { resource: ResourceCode.Metal, amount: 80 },
  rotatesTo: "BLUEPRINT_SPLITTER_VERTICAL",
});
templates.BLUEPRINT_SPLITTER_VERTICAL = makeBlueprint({
  builds: "BUILDING_SPLITTER_VERTICAL",
  cost: { resource: ResourceCode.Metal, amount: 80 },
  rotatesTo: "BLUEPRINT_SPLITTER_HORIZONTAL",
});
templates.BLUEPRINT_PROJECTOR_ADVANCED = makeBlueprint({
  builds: "BUILDING_PROJECTOR_ADVANCED",
  cost: { resource: ResourceCode.Machinery, amount: 50 },
  canReplace: ["BUILDING_PROJECTOR_BASIC"],
});
templates.BLUEPRINT_SPLITTER_ADVANCED = makeBlueprint({
  builds: "BUILDING_SPLITTER_ADVANCED",
  cost: { resource: ResourceCode.Machinery, amount: 80 },
  canReplace: ["BUILDING_SPLITTER_HORIZONTAL", "BUILDING_SPLITTER_VERTICAL"],
});
templates.BLUEPRINT_RESIDENCE = makeBlueprint({
  builds: "BUILDING_RESIDENCE",
  cost: { resource: ResourceCode.Metal, amount: 30 },
});
templates.BLUEPRINT_WALL = makeBlueprint({
  builds: "BUILDING_WALL",
  cost: { resource: ResourceCode.Metal, amount: 20 },
  canReplace: ["BUILDING_WALL_DAMAGED"],
});

export default templates;
