---
title: "Undoing changes and recovery"
---

Select the right undo tool (`restore`, `clean`, `reset`, `revert`, or `reflog`) based on whether changes are untracked, staged, committed locally, or already pushed to a shared branch.

## Decision matrix: which undo tool to use

| Where the change lives               | Shared with others? | Command                                                      | Effect on history and working tree                                        |
| ------------------------------------ | ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Unstaged edits in tracked file       | No                  | `git restore -- FILE_PATH`                                   | **Destructive:** overwrites working-tree file from index                  |
| Staged file in index                 | No                  | `git restore --staged -- FILE_PATH`                          | Unstages file; keeps working-tree modifications intact                    |
| Both staged and unstaged edits       | No                  | `git restore --source=HEAD --staged --worktree -- FILE_PATH` | **Destructive:** resets both index and working tree to `HEAD`             |
| Untracked files/directories          | No                  | `git clean -nd` then `git clean -fd`                         | **Destructive:** permanently deletes untracked files/dirs                 |
| Local commit (keep changes staged)   | No                  | `git reset --soft HEAD~1`                                    | Moves branch pointer back; keeps changes staged                           |
| Local commit (keep changes unstaged) | No                  | `git reset --mixed HEAD~1`                                   | Moves branch pointer back; keeps changes in working tree                  |
| Local commit (discard all changes)   | No                  | `git reset --hard HEAD~1`                                    | **Destructive:** moves branch back and wipes tracked index/worktree edits |
| Pushed / shared commit               | Yes                 | `git revert COMMIT_ID`                                       | Non-destructive: creates a new inverse commit preserving history          |
| Lost commit after reset/rebase       | Local               | `git reflog` + `git branch rescue COMMIT_ID`                 | Restores branch ref to a previously recorded local commit SHA             |

## Inspect and back up before destructive commands

Always inspect current diffs and save uncertain work (via a temporary branch, copy, or [stash](/docs/cheatsheets/tooling/git/stashes/)) before running `--hard`, `--force`, `restore`, or `clean`:

```bash
git status --short
git diff
git diff --cached
git log --oneline --decorate -10
```

> **Warning:** Git's reflog only records **reference movements** (`HEAD`, branches), never uncommitted working-tree edits or untracked files. Edits never stored as Git objects cannot be recovered by Git. Previously staged content might remain as unreachable blobs, but recovery is uncertain and reflogs do not track it.

## Undo working-tree, staged, and untracked changes

Restore tracked files or remove untracked files:

```bash
git restore -- FILE_PATH
git restore --staged -- FILE_PATH
git restore --source=HEAD --staged --worktree -- FILE_PATH
git clean -nd                 # Dry run: preview untracked files/dirs that would be deleted
git clean -fd                 # Permanently delete untracked files and directories
```

Replace `FILE_PATH` with the target file path. Prefer `git restore --staged FILE_PATH` over legacy `git reset FILE_PATH` when unstaging.

## Move branch history with `git reset`

Rewind the current attached branch and optionally reset the index and working tree:

```bash
git reset --soft HEAD~1       # Rewind branch; keep changes staged in index
git reset --mixed HEAD~1      # Rewind branch; keep changes unstaged in worktree (default)
git reset --hard HEAD~1       # Rewind branch; overwrite index and tracked worktree files
```

- **Untracked file collision caveat with `--hard`:** While `git reset --hard` normally leaves untracked files alone, any untracked file or directory that sits at a path occupied by a tracked file in the target commit **will be overwritten/deleted**.
- **Do not reset shared history:** Resetting commits already pushed to a shared branch causes history divergence; use `git revert` instead unless your team explicitly coordinates a force-push.

## Reverse shared commits with `git revert`

Create a new commit that applies the inverse patch of an existing commit:

```bash
git revert COMMIT_ID
git show --summary MERGE_COMMIT_ID
git revert -m 1 MERGE_COMMIT_ID
```

Replace `COMMIT_ID` and `MERGE_COMMIT_ID` with the target commit hashes.

- **Reverting merge commits (`-m`):** Because a merge commit has two or more parents, you must pass `-m PARENT_NUMBER` (typically `-m 1` for the mainline branch into which the feature was merged) to specify which parent line to keep. Inspect parent order with `git show --summary MERGE_COMMIT_ID` first.

## Recover unreachable commits with `git reflog`

Locate commits orphaned by a reset, rebase, branch deletion, or detached `HEAD` and anchor them to a rescue branch:

```bash
git reflog --date=local
git show COMMIT_ID
git branch rescue COMMIT_ID
```

Replace `COMMIT_ID` with the commit hash from the reflog output.

- **Reflog limits:** Reflogs are strictly local to your clone, expire based on `gc.reflogExpire` configuration, and do not act as a remote backup. Recover lost commits immediately before `git gc` prunes unreachable objects.

## Abort an in-progress merge, rebase, or cherry-pick

Check `git status` to identify the active operation and return to the pre-operation state (see [Merging and rebasing](/docs/cheatsheets/tooling/git/merging-and-rebasing/)):

```bash
git merge --abort
git rebase --abort
git cherry-pick --abort
```

- **Dirty worktree caveat:** Always start merges, rebases, and cherry-picks with a clean working tree; `--abort` may not cleanly reconstruct uncommitted edits that existed before the operation began.

## Related notes and references

- [Branches](/docs/cheatsheets/tooling/git/branches/)
- [Merging and rebasing](/docs/cheatsheets/tooling/git/merging-and-rebasing/)
- [Stashes](/docs/cheatsheets/tooling/git/stashes/)
- [Git documentation: `git-restore`](https://git-scm.com/docs/git-restore)
- [Git documentation: `git-reset`](https://git-scm.com/docs/git-reset)
- [Git documentation: `git-revert`](https://git-scm.com/docs/git-revert)
- [Git documentation: `git-reflog`](https://git-scm.com/docs/git-reflog)
- [Git documentation: `git-stash`](https://git-scm.com/docs/git-stash)
- [Git documentation: `git-clean`](https://git-scm.com/docs/git-clean)
- [Pro Git: Undoing Things](https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things)
