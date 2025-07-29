import { object, array, string, number, minLength, maxLength, minValue } from 'valibot';

export const messageDetailSchema = object({
  id: string(),
  content: string([minLength(1), maxLength(2000)]),
  messageType: string(),
  order: number([minValue(0)]),
  speaker: string([maxLength(100)]),
  metadata: object({}, []),
});

export const eventDetailSchema = object({
  id: string(),
  title: string([minLength(1), maxLength(100)]),
  description: string([maxLength(1000)]),
  eventType: string(),
  order: number([minValue(0)]),
  trigger: string([maxLength(500)]),
  messages: array(messageDetailSchema),
});

export const sceneDetailSchema = object({
  id: string(),
  title: string([minLength(1), maxLength(100)]),
  description: string([maxLength(1000)]),
  sceneType: string(),
  order: number([minValue(0)]),
  events: array(eventDetailSchema),
});

export const saveScenarioDetailsSchema = object({
  scenes: array(sceneDetailSchema),
});