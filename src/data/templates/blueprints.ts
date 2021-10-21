import colors from "../../colors";
import { BUILDING_RANGE, PRIORITY_BUILDING_HIGH } from "../../constants";
import { ResourceCode } from "../resources";
import { Description, Entity } from "../../types";
import buildings from "./buildings";
import { EffectId } from "../../types/Effect";
import { ConditionName } from "../../types/ConditionName";
import { TemplateName } from "../../types/TemplateName";

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

const DEFAULT_VALIDITY_CONDITIONS_NON_BLOCKING: {
  condition: ConditionName;
  invalidMessage: string;
}[] = DEFAULT_VALIDITY_CONDITIONS.filter((c) => c.condition !== "isNotBlocked");

interface MakeBlueprintConfig {
  builds: TemplateName;
  cost?: { resource: ResourceCode; amount: number };
  validityConditions?: { condition: ConditionName; invalidMessage: string }[];
  rotatesTo?: TemplateName;
  canReplace?: TemplateName[];
  onBuild?: EffectId;
}

function makeBlueprint({
  builds,
  cost = { resource: ResourceCode.Metal, amount: 0 },
  validityConditions = DEFAULT_VALIDITY_CONDITIONS,
  rotatesTo,
  canReplace,
  onBuild,
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
      canReplace: ["BUILDING_RUBBLE", ...(canReplace || [])],
      onBuild,
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
    ...DEFAULT_VALIDITY_CONDITIONS_NON_BLOCKING,
    { condition: "isOnFertile", invalidMessage: "Must build on fertile land." },
  ],
});
templates.BLUEPRINT_MINING_SPOT = makeBlueprint({
  builds: "BUILDING_MINING_SPOT",
  validityConditions: [
    ...DEFAULT_VALIDITY_CONDITIONS_NON_BLOCKING,
    { condition: "isOnOre", invalidMessage: "Must build on ore." },
  ],
});
templates.BLUEPRINT_MINE = makeBlueprint({
  builds: "BUILDING_MINE",
  cost: { resource: ResourceCode.Metal, amount: 10 },
  validityConditions: [
    ...DEFAULT_VALIDITY_CONDITIONS,
    { condition: "isOnOre", invalidMessage: "Must build on ore." },
  ],
  canReplace: ["BUILDING_MINING_SPOT"],
});
templates.BLUEPRINT_FACTORY = makeBlueprint({
  builds: "BUILDING_FACTORY",
  cost: { resource: ResourceCode.Metal, amount: 15 },
});
templates.BLUEPRINT_WINDMILL = makeBlueprint({
  builds: "BUILDING_WINDMILL",
  cost: { resource: ResourceCode.Metal, amount: 5 },
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
  cost: { resource: ResourceCode.Machinery, amount: 2 },
});
templates.BLUEPRINT_REACTOR = makeBlueprint({
  builds: "BUILDING_REACTOR",
  cost: { resource: ResourceCode.Machinery, amount: 10 },
});
templates.BLUEPRINT_ROAD = makeBlueprint({
  builds: "BUILDING_ROAD",
  cost: { resource: ResourceCode.Metal, amount: 1 },
  onBuild: "ON_ROAD_BUILD",
  validityConditions: DEFAULT_VALIDITY_CONDITIONS_NON_BLOCKING,
});
templates.BLUEPRINT_PROJECTOR_BASIC = makeBlueprint({
  builds: "BUILDING_PROJECTOR_BASIC",
  cost: { resource: ResourceCode.Metal, amount: 3 },
});
templates.BLUEPRINT_SPLITTER_HORIZONTAL = makeBlueprint({
  builds: "BUILDING_SPLITTER_HORIZONTAL",
  cost: { resource: ResourceCode.Metal, amount: 5 },
  rotatesTo: "BLUEPRINT_SPLITTER_VERTICAL",
});
templates.BLUEPRINT_SPLITTER_VERTICAL = makeBlueprint({
  builds: "BUILDING_SPLITTER_VERTICAL",
  cost: { resource: ResourceCode.Metal, amount: 5 },
  rotatesTo: "BLUEPRINT_SPLITTER_HORIZONTAL",
});
templates.BLUEPRINT_PROJECTOR_ADVANCED = makeBlueprint({
  builds: "BUILDING_PROJECTOR_ADVANCED",
  cost: { resource: ResourceCode.Machinery, amount: 5 },
  canReplace: ["BUILDING_PROJECTOR_BASIC"],
});
templates.BLUEPRINT_SPLITTER_ADVANCED = makeBlueprint({
  builds: "BUILDING_SPLITTER_ADVANCED",
  cost: { resource: ResourceCode.Machinery, amount: 8 },
  canReplace: ["BUILDING_SPLITTER_HORIZONTAL", "BUILDING_SPLITTER_VERTICAL"],
});
templates.BLUEPRINT_ABSORBER = makeBlueprint({
  builds: "BUILDING_ABSORBER",
  cost: { resource: ResourceCode.Machinery, amount: 3 },
});
templates.BLUEPRINT_SHIELD_GENERATOR = makeBlueprint({
  builds: "BUILDING_SHIELD_GENERATOR",
  cost: { resource: ResourceCode.Machinery, amount: 5 },
  validityConditions: [
    ...DEFAULT_VALIDITY_CONDITIONS,
    {
      condition: "willNotHaveAdjacentShields",
      invalidMessage: "Must be at 4 spaces from any other shield generators.",
    },
  ],
});
templates.BLUEPRINT_RESIDENCE = makeBlueprint({
  builds: "BUILDING_RESIDENCE",
  cost: { resource: ResourceCode.Metal, amount: 3 },
});
templates.BLUEPRINT_TENT = makeBlueprint({
  builds: "BUILDING_TENT",
});
templates.BLUEPRINT_WALL = makeBlueprint({
  builds: "BUILDING_WALL",
  cost: { resource: ResourceCode.Metal, amount: 1 },
  canReplace: ["BUILDING_WALL_CRACKED", "BUILDING_WALL_CRUMBLING"],
});
templates.BLUEPRINT_BATTERY = makeBlueprint({
  builds: "BUILDING_BATTERY",
  cost: { resource: ResourceCode.Metal, amount: 3 },
});
templates.BLUEPRINT_WAREHOUSE = makeBlueprint({
  builds: "BUILDING_WAREHOUSE",
  cost: { resource: ResourceCode.Metal, amount: 2 },
});

export default templates;
