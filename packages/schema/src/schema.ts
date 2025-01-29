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
export const userRequestSchema = v.object({
  name: v.string(),
});
export const scenarioRequestSchema = v.object({
  id: v.string(),
  title: v.string(),
  overview: v.string(),
});
