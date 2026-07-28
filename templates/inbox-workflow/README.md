# Private inbox workflow

Copy `publish-hugo.yml` to `.github/workflows/publish-hugo.yml` in the **private**
repository that receives guestbook issues.

Configure:

- Secret `BLOG_PUBLISH_TOKEN`: fine-grained token scoped to the Hugo source
  repository with Contents and Pull requests write permission.
- Variable `BLOG_REPOSITORY`: `owner/repository` of the Hugo source.
- Variable `BLOG_BASE_BRANCH`: optional, defaults to `main`.
- Variable `GUESTBOOK_CONTENT_DIR`: optional, defaults to `content/guestbook`.
- Variable `GUESTBOOK_MAINTAINERS`: comma-separated GitHub logins allowed to
  publish `/reply` comments.
- Variable `GUESTBOOK_SYSTEM_REF`: required 40-character commit SHA from a
  reviewed Epistle release.

The maintainer records the public response as an issue comment:

```text
/reply
这里写准备公开的回复。
```

Only then add the `publish` label. The workflow refuses submissions without
explicit publication consent and never copies the private email field.
