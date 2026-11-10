---
title: "Tags"
---

Mark fixed points in Git history such as release commits (`v1.0.0`), while understanding that tag immutability is a hosting policy or convention rather than a local Git guarantee.

## Choose lightweight or annotated tags

| Tag type                | What it stores                                                       | When to use                                                                                                                            |
| ----------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Lightweight             | Direct ref pointing at a commit object                               | Temporary local labels                                                                                                                 |
| Annotated (`-a`)        | Dedicated tag object with target, tagger identity, date, and message | Releases and shared milestones                                                                                                         |
| Signed annotated (`-s`) | Annotated tag object with a cryptographic signature                  | Verified releases (separate from [commit signing](/docs/cheatsheets/tooling/git/commit-signing/); signing one does not sign the other) |

Create one tag type per tag name:

```bash
git tag scratch HEAD
git tag -a v1.0.0 -m "Release 1.0.0"
git tag -s v1.0.1 -m "Release 1.0.1"
```

## Inspect, verify, and publish tags

Run the following commands to list, inspect, verify, and push tags:

```bash
git tag --list 'v1.*'
git show v1.0.0
git verify-tag v1.0.1
git push origin v1.0.0
git push origin --follow-tags
```

- **Explicit push required:** Ordinary `git push` does not push tags automatically.
- **`--follow-tags` vs `--tags`:** `--follow-tags` pushes only missing **annotated** tags reachable from the commits being pushed. `--tags` pushes every local tag, including scratch and unrelated tags—avoid using `--tags` casually.

## Check out a tagged release

Inspect a tag in detached `HEAD` or start a maintenance branch from it (see [Branches](/docs/cheatsheets/tooling/git/branches/)):

```bash
git switch --detach v1.0.0
git switch -c fix/release-1.0 v1.0.0
```

## Delete or fix a mistaken tag

- **Unpublished tag:** Delete the local tag and recreate it on the right commit.
- **Published release tag:** Release a new version number instead of moving a tag that downstream users or lockfiles already reference.

To delete a tag locally and on the remote after coordinating:

```bash
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
```

## Gotchas and safety caveats

- **Local vs remote deletion:** `git tag -d` removes only your local ref; deleting on the remote does not remove copies already fetched by other clones.
- **Host protections:** Branch/tag rulesets or GitHub [Immutable Releases](/docs/cheatsheets/tooling/github/immutable-releases/) can block deleting or moving a release tag.
- **Git tags vs GitHub releases:** A Git tag lives in the Git repository; a GitHub release is hosting metadata (notes and binaries) attached to a tag. Pushing a tag does not create a GitHub release or trigger deployment unless CI automation is configured.

## Related notes and references

- [Remotes and synchronization](/docs/cheatsheets/tooling/git/remotes-and-synchronization/)
- [Pull request](/docs/cheatsheets/tooling/github/pull-request/)
- [Immutable Releases](/docs/cheatsheets/tooling/github/immutable-releases/)
- [Git documentation: `git-tag`](https://git-scm.com/docs/git-tag)
