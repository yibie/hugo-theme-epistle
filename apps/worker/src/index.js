const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };
const MAX_DISPLAY_NAME = 80;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;
const MAX_SOURCE_PATH = 1024;
const MAX_REQUEST_BYTES = 16_384;
const MAX_TURNSTILE_TOKEN = 2048;

class HttpError extends Error {
  constructor(status) {
    super(`request failed with ${status}`);
    this.status = status;
  }
}

export function createHandler(deps = {}) {
  const fetchImpl = deps.fetch ?? globalThis.fetch;
  const cryptoImpl = deps.crypto ?? globalThis.crypto;
  const now = deps.now ?? (() => new Date());

  return {
    async fetch(request, env) {
      return handleRequest(request, env, { fetch: fetchImpl, crypto: cryptoImpl, now });
    },
  };
}

export default {
  async fetch(request, env) {
    return createHandler().fetch(request, env);
  },
};

async function handleRequest(request, env, deps) {
  const url = new URL(request.url);

  if (url.pathname === "/health" && request.method === "GET") {
    return json({ ok: true }, 200, corsHeaders(request, env));
  }

  if (url.pathname !== "/v1/submissions") {
    return json({ error: "not_found" }, 404, corsHeaders(request, env));
  }

  if (request.method === "OPTIONS") {
    return optionsResponse(request, env);
  }

  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405, corsHeaders(request, env));
  }

  const cors = corsHeaders(request, env);
  if (!cors["access-control-allow-origin"]) {
    return json({ error: "request_failed" }, 403, cors);
  }

  try {
    const form = await readFormData(request);
    const input = readSubmissionForm(form);
    await verifyTurnstile(input.turnstileToken, request, env, deps.fetch);

    const submission = {
      schemaVersion: 1,
      submissionId: deps.crypto.randomUUID(),
      submittedAt: deps.now().toISOString(),
      displayName: input.displayName,
      email: input.email,
      message: input.message,
      publishConsent: input.publishConsent,
      sourcePath: input.sourcePath,
      sourceUrl: new URL(input.sourcePath, request.headers.get("origin")).href,
    };

    await createIssue(submission, env, deps.fetch);
    return json({ ok: true, submissionId: submission.submissionId }, 201, cors);
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    return json({ error: "request_failed" }, status, cors);
  }
}

async function readFormData(request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_REQUEST_BYTES) throw new HttpError(413);

  const body = await request.arrayBuffer();
  if (body.byteLength > MAX_REQUEST_BYTES) throw new HttpError(413);

  try {
    return await new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body,
    }).formData();
  } catch {
    throw new HttpError(400);
  }
}

function readSubmissionForm(form) {
  const displayName = normalizeSingleLine(form.get("display_name") ?? form.get("displayName") ?? "") || "匿名读者";
  const email = normalizeSingleLine(form.get("email") ?? "");
  const message = normalizeMultiline(form.get("message") ?? "");
  const publishConsent = parseBoolean(form.get("publish_consent") ?? form.get("publishConsent"));
  const sourcePath = normalizeSourcePath(form.get("source_path") ?? form.get("sourcePath") ?? "/guestbook/");
  const turnstileToken = normalizeSingleLine(form.get("cf-turnstile-response") ?? form.get("turnstileToken") ?? "");

  if (displayName.length > MAX_DISPLAY_NAME) throw new HttpError(400);
  if (email.length > MAX_EMAIL) throw new HttpError(400);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400);
  if (message.length < 1 || message.length > MAX_MESSAGE) throw new HttpError(400);
  if (!turnstileToken || turnstileToken.length > MAX_TURNSTILE_TOKEN) throw new HttpError(400);

  return { displayName, email, message, publishConsent, sourcePath, turnstileToken };
}

function normalizeMultiline(value) {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim();
}

function normalizeSingleLine(value) {
  return normalizeMultiline(value).replace(/\s+/g, " ");
}

function normalizeSourcePath(value) {
  const path = normalizeSingleLine(value);
  if (
    !path ||
    path.length > MAX_SOURCE_PATH ||
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.includes("\\") ||
    path.includes("?") ||
    path.includes("#")
  ) {
    throw new HttpError(400);
  }

  let parsed;
  try {
    parsed = new URL(path, "https://epistle.invalid");
  } catch {
    throw new HttpError(400);
  }
  if (parsed.origin !== "https://epistle.invalid" || parsed.pathname !== path) {
    throw new HttpError(400);
  }
  return path;
}

function parseBoolean(value) {
  return value === "true" || value === "1" || value === "on" || value === "yes";
}

async function verifyTurnstile(token, request, env, fetchImpl) {
  requireEnv(env, ["TURNSTILE_SECRET_KEY", "TURNSTILE_EXPECTED_HOSTNAME", "TURNSTILE_EXPECTED_ACTION"]);

  // Turnstile tokens are single-use, so Siteverify is also the retry boundary.
  const body = new FormData();
  body.set("secret", env.TURNSTILE_SECRET_KEY);
  body.set("response", token);
  body.set("remoteip", request.headers.get("cf-connecting-ip") ?? "");

  const response = await fetchImpl("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  if (!response.ok) throw new HttpError(502);
  const result = await response.json();

  if (
    !result.success ||
    result.hostname !== env.TURNSTILE_EXPECTED_HOSTNAME ||
    result.action !== env.TURNSTILE_EXPECTED_ACTION
  ) {
    throw new HttpError(400);
  }
}

async function createIssue(submission, env, fetchImpl) {
  requireEnv(env, ["GITHUB_TOKEN", "GITHUB_INBOX_OWNER", "GITHUB_INBOX_REPO"]);

  const owner = env.GITHUB_INBOX_OWNER;
  const repo = env.GITHUB_INBOX_REPO;
  const response = await fetchImpl(
    `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues`,
    {
      method: "POST",
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${env.GITHUB_TOKEN}`,
        "content-type": "application/json",
        "user-agent": "epistle-guestbook-worker",
        "x-github-api-version": "2022-11-28",
      },
      body: JSON.stringify({
        title: `Guestbook submission from ${submission.displayName}`,
        body: issueBody(submission),
        labels: ["guestbook", "needs-review"],
        assignees: env.GITHUB_ASSIGNEE ? [env.GITHUB_ASSIGNEE] : [],
      }),
    },
  );

  if (!response.ok) throw new HttpError(502);
}

function issueBody(submission) {
  const marker = `<!-- epistle-guestbook:v1:${base64urlJson(submission)} -->`;

  return `${marker}

## Private preview

Display name: <code>${escapeHtml(submission.displayName)}</code>
Email: <code>${escapeHtml(submission.email || "(none)")}</code>
Publish consent: ${submission.publishConsent ? "yes" : "no"}
Submitted at: ${submission.submittedAt}
Source: ${submission.sourceUrl}

<pre>${escapeHtml(submission.message)}</pre>
`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function base64urlJson(value) {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function requireEnv(env, names) {
  for (const name of names) {
    if (!env?.[name]) throw new HttpError(500);
  }
}

function optionsResponse(request, env) {
  const cors = corsHeaders(request, env);
  return new Response(null, {
    status: cors["access-control-allow-origin"] ? 204 : 403,
    headers: cors,
  });
}

function corsHeaders(request, env) {
  const origin = request.headers.get("origin");
  const headers = {
    "vary": "Origin",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
  };

  if (origin && allowedOrigins(env).includes(origin)) {
    headers["access-control-allow-origin"] = origin;
  }

  return headers;
}

function allowedOrigins(env) {
  return String(env?.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function json(value, status, headers = {}) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { ...JSON_HEADERS, ...headers },
  });
}
