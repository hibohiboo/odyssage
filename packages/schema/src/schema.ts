import * as v from 'valibot';

export const scenarioResponseSchema = v.object({
  id: v.string(),
  title: v.string(),
});
export const userParamSchema = v.object({
  uid: v.string(),
});
export const userSchema = v.object({
  id: v.string(),
});
export const idSchema = v.object({
  id: v.string(),
});
export const userRequestSchema = v.object({
  name: v.string(),
});

export enum VisibilityEnum {
  Private = 'private',
  Draft = 'draft',
  Public = 'public',
}
export const visibilityEnum = v.enum_(VisibilityEnum);
export type Visibility = v.InferOutput<typeof visibilityEnum>;

export const scenarioRequestSchema = v.object({
  id: v.string(),
  title: v.string(),
  overview: v.string(),
  visibility: v.optional(visibilityEnum, VisibilityEnum.Private),
});

export const userScenarioParamSchema = v.object({
  uid: v.string(),
  id: v.string(),
});
export const scenarioUpdateRequestSchema = v.object({
  title: v.string(),
  overview: v.string(),
  visibility: v.optional(visibilityEnum),
});
export const scenarioListItemSchema = v.object({
  id: v.string(),
  title: v.string(),
  visibility: v.optional(visibilityEnum, VisibilityEnum.Private),
  status: v.optional(v.enum_(['published', 'draft', 'private']), 'private'),
});
export type ScnearioListItem = v.InferOutput<typeof scenarioListItemSchema>;
