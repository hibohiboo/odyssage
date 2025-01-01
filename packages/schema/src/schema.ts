import * as v from 'valibot';

export const scenarioResponseSchema = v.object({
  id: v.string(),
  title: v.string(),
});
