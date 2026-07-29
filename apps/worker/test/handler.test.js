import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createHandler } from "../src/index.js";

const ENV = {
  ALLOWED_ORIGINS: "https://example.com",
  TURNSTILE_SECRET_KEY: "turnstile-secret",
  TURNSTILE_EXPECTED_HOSTNAME: "example.com",
  TURNSTILE_EXPECTED_ACTION: "guestbook-submit",
  GITHUB_TOKEN: "github-token",
  GITHUB_INBOX_OWNER: "owner",
  GITHUB_INBOX_REPO: "inbox",
  GITHUB_ASSIGNEE: "maintainer",
};

describe("guestbook worker", () => {
  it("creates a private issue for a valid submission", async () => {
    const calls = [];
    const handler = createHandler({
      fetch: async (url, init) => {
        calls.push({ url, init });
        if (String(url).includes("siteverify")) {
          return Response.json({ success: true, hostname: "example.com", action: "guestbook-submit" });
        }
        return Response.json({ number: 42 }, { status: 201 });
      },
      crypto: { randomUUID: () => "726eaf37-f6ef-4d6f-8c64-44f98b62efb0" },
      now: () => new Date("2026-07-28T00:00:00.000Z"),
    });

    const response = await handler.fetch(request(formData({ message: "hello ```\n<!-- x -->", email: "a@example.com" })), ENV);

    assert.equal(response.status, 201);
    assert.equal(response.headers.get("access-control-allow-origin"), "https://example.com");

    const githubCall = calls.find((call) => String(call.url).includes("api.github.com"));
    assert.ok(githubCall);
    assert.equal(githubCall.init.headers.authorization, "Bearer github-token");

    const issue = JSON.parse(githubCall.init.body);
    assert.deepEqual(issue.labels, ["guestbook", "needs-review"]);
    assert.deepEqual(issue.assignees, ["maintainer"]);
    assert.equal(issue.body.includes("```text"), false);

    const marker = issue.body.match(/^<!-- epistle-guestbook:v1:([A-Za-z0-9_-]+) -->/);
    assert.ok(marker);
    const payload = JSON.parse(Buffer.from(marker[1], "base64url").toString("utf8"));
    assert.deepEqual(payload, {
      schemaVersion: 1,
      submissionId: "726eaf37-f6ef-4d6f-8c64-44f98b62efb0",
      submittedAt: "2026-07-28T00:00:00.000Z",
      displayName: "匿名读者",
      email: "a@example.com",
      message: "hello ```\n<!-- x -->",
      publishConsent: false,
      sourcePath: "/posts/example/",
      sourceUrl: "https://example.com/posts/example/",
    });
  });

  it("rejects origins outside the exact allowlist", async () => {
    let called = false;
    const handler = createHandler({
      fetch: async () => {
        called = true;
        return Response.json({});
      },
    });

    const response = await handler.fetch(request(formData({ message: "hello" }), "https://evil.example.com"), ENV);

    assert.equal(response.status, 403);
    assert.equal(called, false);
    assert.equal(response.headers.get("access-control-allow-origin"), null);
  });

  it("rejects invalid field lengths before creating an issue", async () => {
    const calls = [];
    const handler = createHandler({
      fetch: async (url) => {
        calls.push(url);
        return Response.json({ success: true, hostname: "example.com", action: "guestbook-submit" });
      },
    });

    const response = await handler.fetch(request(formData({ message: "" })), ENV);

    assert.equal(response.status, 400);
    assert.equal(calls.length, 0);
  });

  it("rejects a source path outside the current site", async () => {
    let called = false;
    const handler = createHandler({
      fetch: async () => {
        called = true;
        return Response.json({});
      },
    });

    const invalidPaths = [
      "https://evil.example/posts/stolen/",
      "//evil.example/posts/stolen/",
      "/posts/../admin/",
      "/posts/%2e%2e/admin/",
      "/posts/example/?preview=true",
    ];
    for (const sourcePath of invalidPaths) {
      const response = await handler.fetch(
        request(formData({ message: "hello", source_path: sourcePath })),
        ENV,
      );
      assert.equal(response.status, 400);
    }
    assert.equal(called, false);
  });

  it("rejects request bodies before parsing when they exceed the limit", async () => {
    let called = false;
    const handler = createHandler({
      fetch: async () => {
        called = true;
        return Response.json({});
      },
    });
    const response = await handler.fetch(
      new Request("https://worker.example/v1/submissions", {
        method: "POST",
        headers: {
          origin: "https://example.com",
          "content-type": "text/plain",
        },
        body: "x".repeat(16_385),
      }),
      ENV,
    );

    assert.equal(response.status, 413);
    assert.equal(called, false);
  });

  it("rejects turnstile hostname/action mismatches", async () => {
    const calls = [];
    const handler = createHandler({
      fetch: async (url) => {
        calls.push(url);
        return Response.json({ success: true, hostname: "wrong.example", action: "guestbook-submit" });
      },
    });

    const response = await handler.fetch(request(formData({ message: "hello" })), ENV);

    assert.equal(response.status, 400);
    assert.equal(calls.length, 1);
    assert.equal(String(calls[0]).includes("siteverify"), true);
  });

  it("does not create a second issue when a single-use Turnstile token is retried", async () => {
    let verified = false;
    let githubCalls = 0;
    const handler = createHandler({
      fetch: async (url) => {
        if (String(url).includes("siteverify")) {
          if (verified) return Response.json({ success: false, "error-codes": ["timeout-or-duplicate"] });
          verified = true;
          return Response.json({ success: true, hostname: "example.com", action: "guestbook-submit" });
        }
        githubCalls += 1;
        return Response.json({ number: 42 }, { status: 201 });
      },
      crypto: { randomUUID: () => "726eaf37-f6ef-4d6f-8c64-44f98b62efb0" },
      now: () => new Date("2026-07-28T00:00:00.000Z"),
    });

    const first = await handler.fetch(request(formData({ message: "hello" })), ENV);
    const retry = await handler.fetch(request(formData({ message: "hello" })), ENV);

    assert.equal(first.status, 201);
    assert.equal(retry.status, 400);
    assert.equal(githubCalls, 1);
  });

  it("returns a generic error when GitHub fails", async () => {
    const handler = createHandler({
      fetch: async (url) => {
        if (String(url).includes("siteverify")) {
          return Response.json({ success: true, hostname: "example.com", action: "guestbook-submit" });
        }
        return Response.json({ message: "bad credentials" }, { status: 401 });
      },
      crypto: { randomUUID: () => "726eaf37-f6ef-4d6f-8c64-44f98b62efb0" },
      now: () => new Date("2026-07-28T00:00:00.000Z"),
    });

    const response = await handler.fetch(request(formData({ message: "hello" })), ENV);
    const body = await response.json();

    assert.equal(response.status, 502);
    assert.deepEqual(body, { error: "request_failed" });
  });
});

function request(body, origin = "https://example.com") {
  return new Request("https://worker.example/v1/submissions", {
    method: "POST",
    headers: { origin },
    body,
  });
}

function formData(overrides = {}) {
  const data = new FormData();
  if (overrides.display_name !== undefined) data.set("display_name", overrides.display_name);
  if (overrides.email !== undefined) data.set("email", overrides.email);
  data.set("message", overrides.message ?? "hello");
  data.set("source_path", overrides.source_path ?? "/posts/example/");
  if (overrides.publish_consent !== undefined) data.set("publish_consent", overrides.publish_consent);
  data.set("cf-turnstile-response", overrides.token ?? "turnstile-token");
  return data;
}
