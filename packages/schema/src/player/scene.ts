import * as v from 'valibot';

// Event Types
export const EventTypeSchema = v.picklist([
  'choice',
  'narrative',
  'dialogue',
  'scene_transition',
  'exploration',
  'item_acquire',
  'skill_use',
  'condition',
]);

export const MVPEventTypeSchema = v.picklist([
  'choice',
  'narrative',
  'dialogue',
  'scene_transition',
  'exploration',
]);

// Choice Action Types
export const ChoiceActionTypeSchema = v.picklist([
  'action',
  'dialogue',
  'strategic',
  'creative',
]);

// Choice Schema
export const ChoiceSchema = v.object({
  id: v.string(),
  text: v.string(),
  description: v.optional(v.string()),
  nextEventId: v.string(),
  type: v.optional(ChoiceActionTypeSchema),
  isAvailable: v.optional(v.boolean()),
});

// Base Event Schema
export const BaseEventSchema = v.object({
  id: v.string(),
  type: EventTypeSchema,
  title: v.optional(v.string()),
  content: v.string(),
  nextEventId: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
});

// Choice Event Schema
export const ChoiceEventSchema = v.object({
  ...BaseEventSchema.entries,
  type: v.literal('choice'),
  data: v.object({
    choices: v.array(ChoiceSchema),
  }),
});

// Narrative Event Schema
export const NarrativeEventSchema = v.object({
  ...BaseEventSchema.entries,
  type: v.literal('narrative'),
  data: v.object({
    narrativeText: v.string(),
  }),
});

// Dialogue Event Schema
export const DialogueEventSchema = v.object({
  ...BaseEventSchema.entries,
  type: v.literal('dialogue'),
  data: v.object({
    npcName: v.string(),
    npcText: v.string(),
  }),
});

// Scene Transition Event Schema
export const SceneTransitionEventSchema = v.object({
  ...BaseEventSchema.entries,
  type: v.literal('scene_transition'),
  data: v.object({
    targetSceneId: v.string(),
    transitionText: v.optional(v.string()),
  }),
});

// Exploration Event Schema
export const ExplorationEventSchema = v.object({
  ...BaseEventSchema.entries,
  type: v.literal('exploration'),
  data: v.object({
    targetName: v.string(),
    resultText: v.string(),
  }),
});

// MVP Event Union Schema
export const MVPEventSchema = v.union([
  ChoiceEventSchema,
  NarrativeEventSchema,
  DialogueEventSchema,
  SceneTransitionEventSchema,
  ExplorationEventSchema,
]);

// Scene Schema
export const SceneSchema = v.object({
  id: v.string(),
  title: v.string(),
  description: v.optional(v.string()),
  backgroundImage: v.optional(v.string()),
  startingEventId: v.string(),
  events: v.array(MVPEventSchema),
});

// Session State Schema
export const SessionStateSchema = v.object({
  sessionId: v.string(),
  currentSceneId: v.string(),
  currentEventId: v.string(),
  playHistory: v.array(
    v.object({
      eventId: v.string(),
      eventType: EventTypeSchema,
      sceneId: v.string(),
      actionTaken: v.optional(v.string()),
      executedAt: v.string(),
    }),
  ),
  lastSavedAt: v.string(),
});

// Type exports
export type EventType = v.InferOutput<typeof EventTypeSchema>;
export type MVPEventType = v.InferOutput<typeof MVPEventTypeSchema>;
export type ChoiceActionType = v.InferOutput<typeof ChoiceActionTypeSchema>;
export type Choice = v.InferOutput<typeof ChoiceSchema>;
export type BaseEvent = v.InferOutput<typeof BaseEventSchema>;
export type ChoiceEvent = v.InferOutput<typeof ChoiceEventSchema>;
export type NarrativeEvent = v.InferOutput<typeof NarrativeEventSchema>;
export type DialogueEvent = v.InferOutput<typeof DialogueEventSchema>;
export type SceneTransitionEvent = v.InferOutput<
  typeof SceneTransitionEventSchema
>;
export type ExplorationEvent = v.InferOutput<typeof ExplorationEventSchema>;
export type MVPEvent = v.InferOutput<typeof MVPEventSchema>;
export type Scene = v.InferOutput<typeof SceneSchema>;
export type SessionState = v.InferOutput<typeof SessionStateSchema>;

// Validation functions
export const validateScene = (data: unknown): Scene =>
  v.parse(SceneSchema, data);

export const validateSessionState = (data: unknown): SessionState =>
  v.parse(SessionStateSchema, data);

export const validateMVPEvent = (data: unknown): MVPEvent =>
  v.parse(MVPEventSchema, data);

// Safe validation functions (returns null on error)
export const safeValidateScene = (data: unknown): Scene | null => {
  try {
    return validateScene(data);
  } catch {
    return null;
  }
};

export const safeValidateSessionState = (
  data: unknown,
): SessionState | null => {
  try {
    return validateSessionState(data);
  } catch {
    return null;
  }
};

export const safeValidateMVPEvent = (data: unknown): MVPEvent | null => {
  try {
    return validateMVPEvent(data);
  } catch {
    return null;
  }
};
