---
title: "Package publishing"
---

Publish new and updated packages to the npm registry (`npmjs.com`).

## Publish a package manually (first release)

Build the package artifacts before running the publish steps:

1. Authenticate and verify your npm account identity:

   ```bash
   npm login
   npm whoami
   ```

2. Inspect the tarball contents and simulate publishing without uploading:

   ```bash
   npm pack --dry-run
   npm publish --dry-run
   ```

3. Publish the package publicly:

   ```bash
   npm publish --access public
   ```

## Automate subsequent releases

- Manual publishing requires interactive two-factor authentication (2FA) on every release.
- Automate subsequent releases with a CI workflow such as [GitHub Actions](/docs/cheatsheets/tooling/github/actions/) rather than publishing manually on each version bump.
