---
title: "Inspecting history"
---

Query Git's commit graph to trace changes, compare branches, inspect file evolution, and isolate regressions.

## Inspect commits, patches, and file history

Run the following read-only commands to inspect commit history and search diffs:

```bash
git log --oneline --decorate --graph --all
git log -p -- FILE_PATH
git log --follow -- FILE_PATH
git show HEAD
git show HEAD:FILE_PATH
git log -S 'SEARCH_TEXT' -- FILE_PATH
git log -G 'REGEX_PATTERN' -- FILE_PATH
```

Replace `FILE_PATH`, `SEARCH_TEXT`, and `REGEX_PATTERN` with your target path and search terms.

- **`--follow`:** Tracks inferred file renames for a single path (Git computes renames heuristically rather than storing explicit rename records).
- **`-S` (pickaxe) vs `-G` (regex):** `-S` matches commits that change the **number of occurrences** of a literal string; `-G` matches commits whose added or removed patch lines match a regular expression.

## Revision selectors and range syntax

| Expression                       | Meaning                                                                                  |
| -------------------------------- | ---------------------------------------------------------------------------------------- |
| `HEAD`                           | Current checked-out commit                                                               |
| `HEAD~2`                         | Two commits back along first-parent ancestry                                             |
| `HEAD^2`                         | Second parent of a merge commit (the merged branch)                                      |
| `v1.0.0^{commit}`                | Underlying commit object peeled from an annotated tag                                    |
| `git log A..B`                   | Commits reachable from `B` but not from `A`                                              |
| `git log A...B`                  | Symmetric difference: commits reachable from either `A` or `B`, excluding shared history |
| `git diff A B` / `git diff A..B` | Direct snapshot diff between commit `A` and commit `B`                                   |
| `git diff A...B`                 | Diff from the merge base of `A` and `B` to `B` (matches what a GitHub PR diff shows)     |

> **Caution:** Three-dot syntax (`A...B`) means **symmetric difference** in `git log`, but **changes since merge base** in `git diff`.

## Trace line history with `git blame`

Inspect which commits last touched specific lines and view the full commit context:

```bash
git blame -L 10,30 -- FILE_PATH
git show COMMIT_ID
```

Replace `FILE_PATH` and `COMMIT_ID` with the file path and commit hash. `git blame` shows the commit that last modified each line (including formatting or code movement), not necessarily the commit that introduced the original logic or bug.

## Locate a regression with `git bisect`

Binary-search between a known good revision and a known bad revision from a clean working tree:

```bash
git bisect start
git bisect bad HEAD
git bisect good v1.0.0
# Test the checked-out commit, then mark it:
git bisect good
# Or mark it as broken or untestable:
git bisect bad
git bisect skip
# Return to your original branch when finished:
git bisect reset
```

- **Side effects:** Unlike `log` and `show`, `git bisect` checks out historical commits into your working tree. Only build or execute historical commits that are safe to run in your environment.
- **Automated bisect (`git bisect run COMMAND`):** Exit code `0` marks the commit `good`, `1`–`127` (except `125`) marks it `bad`, and `125` marks it `skip`. Skipping commits around the boundary can leave multiple candidate culprits.

## Related notes and references

- [Git fundamentals](/docs/cheatsheets/tooling/git/git-fundamentals/)
- [Merging and rebasing](/docs/cheatsheets/tooling/git/merging-and-rebasing/)
- [Undoing changes and recovery](/docs/cheatsheets/tooling/git/undoing-changes-and-recovery/)
- [Git documentation: `git-log`](https://git-scm.com/docs/git-log)
- [Git documentation: `gitrevisions`](https://git-scm.com/docs/gitrevisions)
- [Git documentation: `git-diff`](https://git-scm.com/docs/git-diff)
- [Git documentation: `git-blame`](https://git-scm.com/docs/git-blame)
- [Git documentation: `git-bisect`](https://git-scm.com/docs/git-bisect)
