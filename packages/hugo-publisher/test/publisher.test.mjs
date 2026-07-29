import assert from 'node:assert/strict';
import test from 'node:test';
import {
  approvedLetterFromIssue,
  outputFilename,
  parseSubmission,
  renderHugoMarkdown,
} from '../src/index.mjs';

const submission = {
  schemaVersion: 1,
  submissionId: '726eaf37-f6ef-4d6f-8c64-44f98b62efb0',
  submittedAt: '2026-07-28T08:00:00.000Z',
  displayName: '纸飞机',
  email: 'private@example.com',
  message: '<script>alert(1)</script>\n{{< unsafe >}}\n---',
  publishConsent: true,
  sourcePath: '/posts/about-that-afternoon/',
  sourceUrl: 'https://example.com/guestbook/',
};

function marker(value = submission) {
  return `<!-- epistle-guestbook:v1:${Buffer.from(JSON.stringify(value)).toString('base64url')} -->`;
}

function event(body = marker()) {
  return {
    label: { name: 'publish' },
    issue: {
      body,
      labels: [{ name: 'guestbook' }, { name: 'publish' }],
    },
  };
}

const comments = [
  {
    id: 1,
    body: '/reply\n谢谢来信。\n愿你一切都好。',
    created_at: '2026-07-28T09:00:00Z',
    user: { login: 'owner' },
  },
];

test('parses a versioned private submission marker', () => {
  assert.deepEqual(parseSubmission(marker()), {
    schemaVersion: 1,
    submissionId: submission.submissionId,
    submittedAt: submission.submittedAt,
    displayName: submission.displayName,
    message: submission.message,
    sourcePath: submission.sourcePath,
  });
});

test('builds deterministic Hugo front matter without private email', () => {
  const letter = approvedLetterFromIssue(event(), comments, 'owner');
  const markdown = renderHugoMarkdown(letter);

  assert.equal(outputFilename(letter), `${submission.submissionId}.md`);
  assert.match(markdown, /message: \|-/);
  assert.match(markdown, /  <script>alert\(1\)<\/script>/);
  assert.match(markdown, /reply: \|-/);
  assert.match(markdown, /source_path: "\/posts\/about-that-afternoon\/"/);
  assert.doesNotMatch(markdown, /private@example\.com/);
  assert.equal(markdown.endsWith('---\n'), true);
});

test('keeps legacy v1 submissions publishable without an article source', () => {
  const { sourcePath, ...legacySubmission } = submission;
  const parsed = parseSubmission(marker(legacySubmission));

  assert.equal(sourcePath, '/posts/about-that-afternoon/');
  assert.equal(parsed.sourcePath, '');
});

test('rejects an untrusted issue marker with a non-site source path', () => {
  const invalidSubmission = { ...submission, sourcePath: '/posts/../admin/' };

  assert.throws(
    () => parseSubmission(marker(invalidSubmission)),
    /sourcePath must be a normalized site-relative path/,
  );
});

test('rejects publication without explicit consent', () => {
  const privateSubmission = { ...submission, publishConsent: false };
  assert.throws(
    () => approvedLetterFromIssue(event(marker(privateSubmission)), comments, 'owner'),
    /does not allow publication/,
  );
});

test('rejects replies from untrusted accounts', () => {
  assert.throws(
    () => approvedLetterFromIssue(event(), comments, 'someone-else'),
    /no \/reply comment/,
  );
});

test('uses the latest maintainer reply', () => {
  const later = {
    id: 2,
    body: '/reply\n这是最终公开版。',
    created_at: '2026-07-28T10:00:00Z',
    user: { login: 'OWNER' },
  };
  const letter = approvedLetterFromIssue(event(), [...comments, later], 'owner');
  assert.equal(letter.reply, '这是最终公开版。');
  assert.equal(letter.publishedAt, '2026-07-28T10:00:00.000Z');
});
