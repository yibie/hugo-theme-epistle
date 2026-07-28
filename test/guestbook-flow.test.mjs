import assert from 'node:assert/strict';
import test from 'node:test';
import { createHandler } from '../apps/worker/src/index.js';
import {
  approvedLetterFromIssue,
  renderHugoMarkdown,
} from '../packages/hugo-publisher/src/index.mjs';

test('moves an approved private submission from Worker issue to public Hugo data', async () => {
  let privateIssue;
  const handler = createHandler({
    fetch: async (url, init) => {
      if (String(url).includes('siteverify')) {
        return Response.json({
          success: true,
          hostname: 'letters.example.com',
          action: 'guestbook-submit',
        });
      }
      privateIssue = JSON.parse(init.body);
      return Response.json({ number: 7 }, { status: 201 });
    },
    crypto: {
      randomUUID: () => '726eaf37-f6ef-4d6f-8c64-44f98b62efb0',
    },
    now: () => new Date('2026-07-28T08:00:00Z'),
  });

  const form = new FormData();
  form.set('display_name', '纸飞机');
  form.set('email', 'private@example.com');
  form.set('message', '<script>alert(1)</script>\n{{< unsafe >}}');
  form.set('publish_consent', 'on');
  form.set('cf-turnstile-response', 'valid-token');

  const response = await handler.fetch(
    new Request('https://worker.example/v1/submissions', {
      method: 'POST',
      headers: { origin: 'https://letters.example.com' },
      body: form,
    }),
    {
      ALLOWED_ORIGINS: 'https://letters.example.com',
      TURNSTILE_SECRET_KEY: 'secret',
      TURNSTILE_EXPECTED_HOSTNAME: 'letters.example.com',
      TURNSTILE_EXPECTED_ACTION: 'guestbook-submit',
      GITHUB_TOKEN: 'private-token',
      GITHUB_INBOX_OWNER: 'owner',
      GITHUB_INBOX_REPO: 'private-inbox',
      GITHUB_ASSIGNEE: 'owner',
    },
  );

  assert.equal(response.status, 201);
  assert.ok(privateIssue.body.includes('private@example.com'));

  const letter = approvedLetterFromIssue(
    {
      label: { name: 'publish' },
      issue: {
        body: privateIssue.body,
        labels: [{ name: 'guestbook' }, { name: 'publish' }],
      },
    },
    [
      {
        id: 1,
        body: '/reply\n谢谢你的来信。',
        created_at: '2026-07-28T09:00:00Z',
        user: { login: 'owner' },
      },
    ],
    'owner',
  );
  const markdown = renderHugoMarkdown(letter);

  assert.match(markdown, /  <script>alert\(1\)<\/script>/);
  assert.match(markdown, /  \{\{< unsafe >\}\}/);
  assert.doesNotMatch(markdown, /private@example\.com/);
});
