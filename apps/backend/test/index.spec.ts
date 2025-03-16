import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
  SELF,
} from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

describe('Hello World worker', () => {
  it('responds with Hello World! (unit style)', async () => {
    const request = new Request<unknown, IncomingRequestCfProperties>(
      'http://example.com/api',
    );
    // Create an empty context to pass to `worker.fetch()`.
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    // Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
    await waitOnExecutionContext(ctx);
    expect(await response.text()).toMatchInlineSnapshot(
      `"Hello Cloudflare Workers!"`,
    );
  });

  it('responds with Hello World! (integration style)', async () => {
    const response = await SELF.fetch('https://example.com/api');
    expect(await response.text()).toMatchInlineSnapshot(
      `"Hello Cloudflare Workers!"`,
    );
  });
});

// DBを使ったテストをうまくする方法ができるまでスキップ。 課題： DBの初期設定（ユーザIDを固定でいれておかないとFKで死ぬ）
describe.todo('Scenario creation', () => {
  it('creates a new scenario successfully', async () => {
    const request = new Request<unknown, IncomingRequestCfProperties>(
      'http://example.com/api/user/123/scenario',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'b33ee6e9-8cd5-42a6-a049-41e24148ec8a',
          title: '冒険の始まり',
          overview: '初めての冒険を体験するシナリオ',
          tags: ['初心者向け'],
        }),
      },
    );
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Scenario created successfully');
  });

  it('fails to create a new scenario with missing fields', async () => {
    const request = new Request<unknown, IncomingRequestCfProperties>(
      'http://example.com/api/user/123/scenario',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'b33ee6e9-8cd5-42a6-a049-41e24148ec8a',
          title: '冒険の始まり',
          // Missing overview and tags
        }),
      },
    );
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Failed to create scenario');
  });
});
