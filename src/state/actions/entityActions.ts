import { Object } from "ts-toolbelt";
import { createStandardAction } from "typesafe-actions";
import { Entity } from "~/types/Entity";

export const addEntity = createStandardAction("ADD_ENTITY")<Entity>();

export const removeEntity = createStandardAction("REMOVE_ENTITY")<string>();

export const removeEntities = createStandardAction("REMOVE_ENTITIES")<
  string[]
>();

export const updateEntity = createStandardAction("UPDATE_ENTITY")<
  Object.Required<Partial<Entity>, "id">
>();
