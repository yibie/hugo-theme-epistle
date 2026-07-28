const MARKER_PATTERN = /<!-- epistle-guestbook:v1:([A-Za-z0-9_-]+) -->/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const UNSAFE_CONTROL_PATTERN = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

function assertText(value, name, maxLength, { optional = false } = {}) {
  if (typeof value !== 'string') {
    throw new Error(`${name} must be a string`);
  }

  const text = value.replace(/\r\n?/g, '\n').trim();
  if (!optional && text.length === 0) {
    throw new Error(`${name} is required`);
  }
  if (text.length > maxLength) {
    throw new Error(`${name} exceeds ${maxLength} characters`);
  }
  if (UNSAFE_CONTROL_PATTERN.test(text)) {
    throw new Error(`${name} contains control characters`);
  }
  return text;
}

function decodeBase64Url(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function labelsOf(issue) {
  return new Set(
    (issue.labels || []).map((label) => (typeof label === 'string' ? label : label.name)),
  );
}

function replyFrom(comments, maintainers) {
  const allowed = new Set(
    maintainers
      .split(',')
      .map((name) => name.trim().toLowerCase())
      .filter(Boolean),
  );
  if (allowed.size === 0) {
    throw new Error('at least one maintainer is required');
  }

  const replies = comments
    .filter((comment) => allowed.has(comment.user?.login?.toLowerCase()))
    .map((comment) => {
      const match = comment.body?.replace(/\r\n?/g, '\n').match(/^\/reply(?:[ \t]*\n|[ \t]+)([\s\S]+)$/);
      return match ? { body: match[1], createdAt: comment.created_at, id: comment.id } : null;
    })
    .filter(Boolean)
    .sort((a, b) => {
      const byDate = Date.parse(a.createdAt) - Date.parse(b.createdAt);
      return byDate || a.id - b.id;
    });

  const reply = replies.at(-1);
  if (!reply) {
    throw new Error('no /reply comment from an allowed maintainer');
  }

  return {
    body: assertText(reply.body, 'reply', 5000),
    createdAt: assertIsoDate(reply.createdAt, 'reply created_at'),
  };
}

function assertIsoDate(value, name) {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) {
    throw new Error(`${name} must be an ISO date`);
  }
  return new Date(value).toISOString();
}

function yamlString(value) {
  return JSON.stringify(value);
}

function yamlBlock(value) {
  return value
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n');
}

export function parseSubmission(issueBody) {
  if (typeof issueBody !== 'string') {
    throw new Error('issue body is required');
  }

  const match = issueBody.match(MARKER_PATTERN);
  if (!match) {
    throw new Error('guestbook v1 marker is missing');
  }

  let submission;
  try {
    submission = JSON.parse(decodeBase64Url(match[1]));
  } catch {
    throw new Error('guestbook v1 marker is invalid');
  }

  if (submission.schemaVersion !== 1) {
    throw new Error('unsupported submission schema');
  }
  if (!UUID_PATTERN.test(submission.submissionId || '')) {
    throw new Error('submissionId must be a UUID');
  }
  if (submission.publishConsent !== true) {
    throw new Error('submission does not allow publication');
  }

  return {
    schemaVersion: 1,
    submissionId: submission.submissionId,
    submittedAt: assertIsoDate(submission.submittedAt, 'submittedAt'),
    displayName: assertText(submission.displayName || '匿名读者', 'displayName', 80),
    message: assertText(submission.message, 'message', 5000),
  };
}

export function approvedLetterFromIssue(event, comments, maintainers) {
  if (event.label?.name !== 'publish') {
    throw new Error('event label must be publish');
  }

  const labels = labelsOf(event.issue || {});
  if (!labels.has('guestbook') || !labels.has('publish')) {
    throw new Error('issue must have guestbook and publish labels');
  }

  const submission = parseSubmission(event.issue.body);
  const reply = replyFrom(comments, maintainers);

  return {
    ...submission,
    publishedAt: reply.createdAt,
    reply: reply.body,
  };
}

export function renderHugoMarkdown(letter) {
  const title = `来信 · ${letter.displayName}`;

  return [
    '---',
    `title: ${yamlString(title)}`,
    `date: ${yamlString(letter.submittedAt)}`,
    `lastmod: ${yamlString(letter.publishedAt)}`,
    'draft: false',
    `submission_id: ${yamlString(letter.submissionId)}`,
    `display_name: ${yamlString(letter.displayName)}`,
    'message: |-',
    yamlBlock(letter.message),
    'reply: |-',
    yamlBlock(letter.reply),
    '---',
    '',
  ].join('\n');
}

export function outputFilename(letter) {
  if (!UUID_PATTERN.test(letter.submissionId || '')) {
    throw new Error('submissionId must be a UUID');
  }
  return `${letter.submissionId}.md`;
}
