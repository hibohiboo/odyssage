import * as v from 'valibot';

export const { parse } = v;
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
export const idUidSchema = v.object({
  id: v.string(),
  uid: v.string(),
});
export const userRequestSchema = v.object({
  name: v.string(),
});

export enum VisibilityEnum {
  Private = 'private',
  Draft = 'draft',
  Public = 'public',
}
export const scenarioRequestSchema = v.object({
  id: v.string(),
  title: v.string(),
  overview: v.string(),
  visibility: v.optional(v.string()),
});

export const userScenarioParamSchema = v.object({
  uid: v.string(),
  id: v.string(),
});
export const scenarioUpdateRequestSchema = v.object({
  title: v.string(),
  overview: v.string(),
  visibility: v.optional(v.string()),
});
export const scenarioListItemSchema = v.object({
  id: v.string(),
  title: v.string(),
  visibility: v.optional(v.string()),
  status: v.optional(v.string()),
});
export type ScnearioListItem = v.InferOutput<typeof scenarioListItemSchema>;

// セッション関連のスキーマ

export const sessionStatuSchema = v.picklist([
  '準備中',
  '進行中',
  '終了',
] as const);
export type SessionStatuSchema = v.InferOutput<typeof sessionStatuSchema>;

export const sessionRequestSchema = v.object({
  gmId: v.string(),
  scenarioId: v.string(),
  title: v.string(),
});

export const sessionStatusUpdateSchema = v.object({
  status: sessionStatuSchema,
});
export type SessionStatusUpdate = v.InferOutput<
  typeof sessionStatusUpdateSchema
>;

export const sessionResponseSchema = v.object({
  id: v.string(),
  gmId: v.string(),
  scenarioId: v.string(),
  title: v.string(),
  status: v.string(),
  createdAt: v.string(),
});

export type SessionRequest = v.InferInput<typeof sessionRequestSchema>;
export type SessionResponse = v.InferOutput<typeof sessionResponseSchema>;

// GraphDB Scenario schemas
export const graphScenarioRequestSchema = v.object({
  title: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
  overview: v.pipe(v.string(), v.minLength(1), v.maxLength(1000)),
});

export const graphScenarioResponseSchema = v.object({
  id: v.string(),
  title: v.string(),
  overview: v.string(),
});

export type GraphScenarioRequest = v.InferInput<typeof graphScenarioRequestSchema>;
export type GraphScenarioResponse = v.InferOutput<typeof graphScenarioResponseSchema>;

// GraphDB Scene schemas
export const graphSceneRequestSchema = v.object({
  title: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
  overview: v.pipe(v.string(), v.minLength(1), v.maxLength(1000)),
  scenarioId: v.pipe(v.string(), v.uuid()),
  order: v.pipe(v.number(), v.minValue(0), v.integer()),
});

export const graphSceneResponseSchema = v.object({
  id: v.string(),
  title: v.string(),
  overview: v.string(),
  scenarioId: v.string(),
  order: v.pipe(v.number(), v.integer()),
});

export type GraphSceneRequest = v.InferInput<typeof graphSceneRequestSchema>;
export type GraphSceneResponse = v.InferOutput<typeof graphSceneResponseSchema>;
