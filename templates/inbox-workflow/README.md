# Private inbox workflow

Keep the Hugo source and guestbook issues in one **private** repository, then
copy `publish-hugo.yml` to `.github/workflows/publish-hugo.yml` there.

Configure:

- Variable `BLOG_BASE_BRANCH`: optional, defaults to `main`.
- Variable `GUESTBOOK_CONTENT_DIR`: optional, defaults to `content/guestbook`.
- Variable `GUESTBOOK_MAINTAINERS`: comma-separated GitHub logins allowed to
  publish `/reply` comments.
- Variable `GUESTBOOK_SYSTEM_REF`: required 40-character commit SHA from a
  reviewed Epistle release.

The workflow uses the repository-scoped `GITHUB_TOKEN`; no publication PAT or
pull-request approval is needed. The source repository must also contain
`.github/workflows/deploy.yml` with a `workflow_dispatch` trigger. Keep its
credential for the generated public repository scoped to that repository only.

The maintainer may record an optional public response as an issue comment:

```text
/reply
这里写准备公开的回复。
```

Add the `publish` label when the visitor's message is ready to publish. It is
the final approval: the workflow commits directly to the private source
repository and dispatches deployment without a pull request. A `/reply` comment
is optional and must be written before adding `publish`. The current form
clearly states that submissions may be excerpted publicly and records that
notice in the v1 marker; legacy submissions without that record remain private.
The workflow never copies the private email field.
