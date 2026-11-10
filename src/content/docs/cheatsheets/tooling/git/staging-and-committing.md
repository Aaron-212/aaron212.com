---
title: "Staging and committing"
---

Prepare exact snapshots in the Git index (staging area) and record them as commits on the current branch.

## Compare working tree, index, and `HEAD`

Inspect status and diffs across the three states before staging or committing (see [Git fundamentals](/docs/cheatsheets/tooling/git/git-fundamentals/)):

```bash
git status
git diff                 # Working tree vs index (unstaged changes)
git diff --cached        # Index vs HEAD (staged changes ready to commit)
git diff HEAD            # Working tree vs HEAD (all tracked changes)
```

- **Untracked files:** Brand-new untracked files appear in `git status` but not in `git diff` until staged.
- **Edits after staging:** The index captures file content at the moment you run `git add`. If you edit a file again after staging, re-run `git add` to include the newer changes.

## Stage, unstage, or discard changes

Stage whole files, interactive hunks, or all repository changes:

```bash
git add src/parser.ts README.md
git add -p src/parser.ts
git add -A
```

| Task                      | Command                            | Notes and caveats                                                                     |
| ------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------- |
| Stage specific hunks      | `git add -p FILE_PATH`             | Split unrelated edits in one file across commits; press `s` at prompt to split a hunk |
| Stage all changes         | `git add -A`                       | Stages new, modified, and deleted files across the repository                         |
| Stage a deletion          | `git rm FILE_PATH` or `git add -A` | Removes file from working tree and stages the deletion                                |
| Unstage file (keep edits) | `git restore --staged FILE_PATH`   | Equivalent to `git reset FILE_PATH`; preserves working-tree modifications             |
| Discard unstaged edits    | `git restore FILE_PATH`            | **Destructive:** overwrites working-tree file with the index version                  |

## Create a commit

Verify the staged snapshot and record the commit:

```bash
git diff --cached
git commit -m "Handle empty configuration files"
git show --stat --oneline HEAD
```

- **Commit message structure:** Write a clear, concise subject line; add a blank line followed by a body when explaining rationale or trade-offs. Keep commits atomic so they can be reviewed or reverted cleanly.
- **Avoid `git commit -a` and `git commit FILE_PATH...` pitfalls:**
  - `git commit -a` auto-stages all modified and deleted tracked files (ignoring untracked files) and commits immediately, which can sweep in unintended edits.
  - `git commit FILE_PATH...` commits only the named paths and bypasses other changes already staged in the index. Prefer explicit `git add` followed by plain `git commit`.

## Author vs committer metadata

- **Author:** Who originally wrote the change (`user.name` / `user.email`, or `--author`).
- **Committer:** Who created the commit object (updated during `commit --amend`, `rebase`, or `cherry-pick` while preserving the original author).
- **Attribution vs verification:** Author and committer fields are plain metadata, not proof of identity or approval. For cryptographic proof, see [Commit signing](/docs/cheatsheets/tooling/git/commit-signing/).

Override author attribution explicitly and inspect both fields:

```bash
git commit --author="Ada Example <ada@example.com>" -m "Document parser behavior"
git show -s --format=fuller HEAD
```

## Amend the latest commit

Fold newly staged changes into the tip commit or edit its commit message:

```bash
git add README.md
git commit --amend
git commit --amend --no-edit   # Keep the existing commit message
```

- **Rewrites history:** `--amend` replaces `HEAD` with a brand-new commit SHA (preserving the original author by default and updating the committer).
- **Shared branch caveat:** Do not amend commits already pushed to a shared branch unless you have coordinated a history rewrite with collaborators.
- **Signatures:** The replacement does not retain the old signature. Sign it with `-S` or enable `commit.gpgsign`; see [commit signing](/docs/cheatsheets/tooling/git/commit-signing/) config.

## Standard small-commit workflow

Run this sequence for predictable, atomic local commits:

```bash
git status
git add -p
git diff --cached
git commit -m "Describe the change"
git status
```

## References

- [Git documentation: `git-add`](https://git-scm.com/docs/git-add)
- [Git documentation: `git-diff`](https://git-scm.com/docs/git-diff)
- [Git documentation: `git-commit`](https://git-scm.com/docs/git-commit)
- [Git documentation: `git-restore`](https://git-scm.com/docs/git-restore)
- [Git documentation: `git-reset`](https://git-scm.com/docs/git-reset)
- [GitHub Docs: About commit signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification)
