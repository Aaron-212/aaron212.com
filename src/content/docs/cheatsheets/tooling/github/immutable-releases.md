---
title: "Immutable Releases"
---

GitHub supply-chain security feature that locks a published release's assets and linked [Git tag](/docs/cheatsheets/tooling/git/tags/) against deletion or retargeting.

## Threat model: mutable Git tags

- Git tags cannot be edited in place, but standard Git permits deleting, recreating, or moving a tag to a different commit.
- A compromised maintainer account could otherwise push a malicious commit, point an existing release tag at it, and replace release assets under a trusted version name.

## What Immutable Releases enforce

| Target                        | Enforcement                                                     |
| ----------------------------- | --------------------------------------------------------------- |
| Release assets                | Locked permanently once the release is published                |
| Linked Git tag                | Cannot be modified, moved, or deleted while linked to a release |
| Deleted tag names             | Cannot be reused by newer Git tags                              |
| Release title and description | Remain editable for documentation updates                       |

## Reference

- [GitHub Docs: Immutable releases](https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases)
