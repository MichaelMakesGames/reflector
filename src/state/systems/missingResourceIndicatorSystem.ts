import WrappedState from "~types/WrappedState";
import { Entity } from "~types";
import { createEntityFromTemplate } from "~lib/entities";
import { ColonistStatusCode } from "~data/colonistStatuses";
import { ResourceCode } from "~data/resources";

export default function missingResourceIndicatorSystem(
  state: WrappedState,
): void {
  const missingResourceIndicators = state.select.entitiesWithComps(
    "missingResourceIndicator",
  );
  state.act.removeEntities(missingResourceIndicators.map((e) => e.id));

  const entitiesToAdd: Entity[] = [];
  const unpoweredEntities = state.select
    .entitiesWithComps("pos", "powered")
    .filter((e) => !e.powered.hasPower);
  entitiesToAdd.push(
    ...unpoweredEntities.map(({ pos }) =>
      createEntityFromTemplate("UI_NO_POWER", { pos }),
    ),
  );

  const colonistsWithMissingResources = state.select
    .colonists()
    .filter(
      ({ colonist }) => colonist.status === ColonistStatusCode.MissingResources,
    );
  colonistsWithMissingResources.forEach(({ colonist, pos }) => {
    colonist.missingResources.forEach((resource) => {
      if (resource === ResourceCode.Power) {
        entitiesToAdd.push(createEntityFromTemplate("UI_NO_POWER", { pos }));
      } else if (resource === ResourceCode.Metal) {
        entitiesToAdd.push(createEntityFromTemplate("UI_NO_METAL", { pos }));
      } else {
        console.error("Unhandled missing resource indicator:", resource);
      }
    });
  });

  entitiesToAdd.forEach((entity) => state.act.addEntity(entity));
}
