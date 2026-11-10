---
title: "GitHub Actions"
---

Continuous integration and deployment (CI/CD) service driven by workflow YAML files in `.github/workflows/`.

## Runner options and hosted images

- **Common workflow jobs:** Linting, type checking, building release or pre-release artifacts, and publishing packages to registries.
- **Self-hosted runners:** Register your own machines when GitHub-hosted runner specs are insufficient or jobs require private infrastructure you control.
- **GitHub-hosted runner families (6 types):**
  - Ubuntu `x86-64` (for example, Ubuntu 22.04, 24.04, and 26.04)
  - Ubuntu `arm64`
  - Windows `x86-64`
  - Windows `arm64`
  - macOS `x86-64` (nearing deprecation)
  - macOS `arm64`
- **Image lifecycle:** GitHub performs rolling image updates, adding newer OS releases and deprecating and removing older images over time. Check the [GitHub Actions runner-images inventory](https://github.com/actions/runner-images#available-images) for current image labels.

## Harden workflow dependencies

Mutable version tags in `uses:` steps are vulnerable to tag retargeting attacks similar to those mitigated by [Immutable Releases](/docs/cheatsheets/tooling/github/immutable-releases/):

- **Risky (mutable version tag):**

  ```yaml
  uses: actions/checkout@v7
  ```

- **Hardened (pinned full commit SHA with version comment):**

  ```yaml
  uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
  ```

- **Note:** Native GitHub Actions lockfile support may become publicly available in the future.
