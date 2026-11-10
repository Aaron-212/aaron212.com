---
title: "Remotes and synchronization"
---

Configure remote repositories, fetch and inspect upstream changes, integrate updates explicitly, and publish branches safely.

## Distinguish local, remote-tracking, and remote branches

| Reference                                  | Location               | How it updates                                                         |
| ------------------------------------------ | ---------------------- | ---------------------------------------------------------------------- |
| `main` (`refs/heads/main`)                 | Local repository       | Advances when you commit, merge, rebase, or reset locally              |
| `origin/main` (`refs/remotes/origin/main`) | Local repository cache | Moves only when you `git fetch`, `git pull`, or `git push` to `origin` |
| `main` on the remote host                  | Remote server          | Advances when someone pushes or merges a PR on the host                |

- **Conventions:** `origin` is the default remote name created by `git clone`; in a fork workflow, `origin` typically points to your fork and `upstream` points to the canonical repository.
- **`upstream` remote vs upstream tracking branch:** A remote named `upstream` is a server URL alias; a local branch's configured _upstream_ (`@{u}`) is the remote-tracking branch (such as `origin/main`) it compares against by default (see [Branches](/docs/cheatsheets/tooling/git/branches/)).

## Configure remotes

Inspect, add, or update remote URLs (`git remote add` does not fetch objects automatically):

```bash
git remote -v
git remote add upstream https://github.com/OWNER/PROJECT.git
git remote get-url origin
git remote set-url origin git@github.com:ACCOUNT_NAME/PROJECT.git
git remote show origin
```

Replace `OWNER`, `ACCOUNT_NAME`, and `PROJECT` with the target GitHub user/organization and repository names.

- **Transport authentication:** HTTPS authenticates via a credential helper or personal access token; SSH authenticates via a registered SSH key. Both are completely separate from cryptographic [commit signing](/docs/cheatsheets/tooling/git/commit-signing/). Never embed tokens or passwords in remote URLs or `.git/config`.

## Fetch, inspect divergence, and integrate

Download remote objects and prune deleted remote-tracking branches before integrating:

```bash
git fetch --prune origin
git log --oneline --left-right main...origin/main
git diff main origin/main
git switch main
git merge --ff-only origin/main
```

- **`--prune`:** Removes stale local `origin/*` refs whose remote branches were deleted on the server. It never deletes your local `refs/heads/*` branches. Avoid passing `--prune-tags` unless you intend to overwrite or delete local tags.
- **`--ff-only`:** Advances the branch only if no local commits have diverged; if it fails, inspect `git log --left-right` before deciding whether to merge or rebase.
- **Explicit `git pull` modes:** Always specify how `git pull` should integrate rather than relying on environment defaults:

  ```bash
  git pull --ff-only            # Fast-forward only; abort if diverged
  git pull --rebase             # Fetch and replay local commits on top of upstream
  git pull --no-rebase          # Fetch and merge (creates merge commit if diverged)
  ```

## Push branches and handle rejections

Publish a local branch and set its upstream, or push `HEAD` to an explicit remote branch name:

```bash
git push -u origin feature/search
git push origin HEAD:feature/search
```

- **Scope:** Pushing a branch does not push other local branches or tags (see [Tags](/docs/cheatsheets/tooling/git/tags/)).
- **Non-fast-forward rejections:** Happen when the remote branch has commits you do not have locally, or when you amended/rebased already pushed commits. Always `git fetch` and inspect before acting—never reflexively force-push.

## Force-push a rewritten branch safely with `--force-with-lease`

When updating a private PR branch after an agreed rebase or amend, use an explicit expected-commit lease so background fetches cannot mask someone else's push:

```bash
git fetch origin
expected_tip=$(git rev-parse origin/feature/search)
git log --oneline HEAD..origin/feature/search
# Confirm no unexpected remote commits exist, perform your rebase/amend, then push:
git push --force-with-lease="refs/heads/feature/search:$expected_tip" origin HEAD:feature/search
```

- **Why explicit `$expected_tip` matters:** Plain `--force-with-lease` compares the server ref against your local `origin/feature/search`. If an editor or background task ran `git fetch` automatically, `origin/feature/search` updates silently and a plain lease check will still overwrite a teammate's commits.
- **Limitations:** `--force-with-lease` only verifies the remote tip hash; it does not check whether your rewritten history kept every collaborator's changes, and protected branch rules can block force-pushes entirely.

## Synchronize a fork with `upstream`

Fast-forward your fork's `main` branch from `upstream/main`, push to your fork (`origin`), and branch from there (see [Pull request](/docs/cheatsheets/tooling/github/pull-request/)):

```bash
git fetch upstream
git switch main
git merge --ff-only upstream/main
git push origin main
git switch -c feature/search
```

## Related notes and references

- [Git fundamentals](/docs/cheatsheets/tooling/git/git-fundamentals/)
- [Branches](/docs/cheatsheets/tooling/git/branches/)
- [Merging and rebasing](/docs/cheatsheets/tooling/git/merging-and-rebasing/)
- [Git documentation: `git-remote`](https://git-scm.com/docs/git-remote)
- [Git documentation: `git-fetch`](https://git-scm.com/docs/git-fetch)
- [Git documentation: `git-pull`](https://git-scm.com/docs/git-pull)
- [Git documentation: `git-push`](https://git-scm.com/docs/git-push)
