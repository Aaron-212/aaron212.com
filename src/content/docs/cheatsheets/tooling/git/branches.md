---
title: "Branches"
---

Create, switch, track, delete, and isolate Git branch references (`refs/heads/*`) and worktrees.

## Core concepts: `HEAD`, branches, and remote-tracking refs

- **Branch:** A lightweight movable pointer (`refs/heads/BRANCH_NAME`) to a commit, not a separate copy of files.
- **`HEAD`:** Symbolic ref to your current checked-out branch. Committing advances that branch.
- **Detached `HEAD`:** `HEAD` points directly to a commit SHA rather than a branch ref. New commits made in detached `HEAD` are orphaned once you switch away unless you create a branch to retain them (`git switch -c NEW_BRANCH`).
- **Remote-tracking ref (`origin/main`):** Local cached bookmark of where the remote branch stood at your last fetch or push—not a live network link.
- **Tags vs branches:** Tags stay fixed on one commit; see [Tags](/docs/cheatsheets/tooling/git/tags/).

## Inspect branches and refs

Run the following commands to inspect local branches, upstream mappings, and the commit graph:

```bash
git branch                     # Local branches (* marks current)
git branch -avv                # All local + remote-tracking branches, upstreams, and tip commits
git status -sb                 # Short status with current branch and ahead/behind counts
git log --oneline --decorate --graph --all
git show-ref --heads --tags    # Raw local branch and tag refs
```

## Create, switch, and rename branches

Manage local branches and detached checkouts:

```bash
git switch -c feature/login       # Create from HEAD and switch
git switch main                   # Switch to an existing local branch
git branch feature/docs main      # Create at main without switching
git branch -m feature/login feature/auth
git switch --detach COMMIT_ID     # Inspect a commit without moving a branch
git switch -c experiment          # Save detached HEAD work onto a named branch
```

Replace `COMMIT_ID` with the target commit hash or ref.

- **Uncommitted changes when switching:** `git switch` updates the index and working tree, and aborts if local modifications conflict with the target commit. Commit or stash valuable work before switching branches.

## Track and synchronize with remote branches

Create a local branch tracking a fetched remote branch, configure an existing branch's upstream, or publish a new branch:

```bash
git fetch origin
git switch --track origin/feature/login
git branch --set-upstream-to=origin/feature/login feature/login
git push --set-upstream origin feature/login
```

- **Upstream role:** Configures the default target for `git status`, `git pull`, and `git push`.
- **`git fetch` vs `git pull`:** `git pull` runs `git fetch` and immediately merges or rebases according to repo settings. When unsure how branches diverged, run `git fetch` first, inspect `git log --oneline --graph --all`, and then explicitly run `git merge` or `git rebase` (see [Merging and rebasing](/docs/cheatsheets/tooling/git/merging-and-rebasing/)).

## Delete branches safely

Check merge status before removing local or remote branch refs:

```bash
git branch --merged main       # Branches fully integrated into main
git branch --no-merged main    # Branches with commits not reachable from main
git log --oneline main..feature/login
git branch -d feature/login   # Safe delete: refuses if unmerged
git branch -D experiment      # Force delete: drops ref even if unmerged
git push origin --delete feature/login
```

- **`-d` vs `-D` safety caveat:** `-d` protects unmerged commits; `-D` deletes the local pointer unconditionally, leaving unmerged commits reachable only through the reflog until garbage collection prunes them (see [Undoing changes and recovery](/docs/cheatsheets/tooling/git/undoing-changes-and-recovery/)). Note that squash-merged or rebase-merged PR branches appear unmerged to `-d` because commit SHAs changed—verify with `git log` or diff before running `-D`.
- **Scope:** Deleting a local branch does not delete the remote branch, and `git push origin --delete` does not delete local branches in other clones.

## Check out multiple branches simultaneously with worktrees

Create a linked working directory backed by the same Git object database and refs:

```bash
git worktree add ../repo-hotfix -b hotfix origin/main
git worktree list
git worktree remove ../repo-hotfix
```

- **Single-checkout lock:** Git prevents checking out the same branch in two worktrees at the same time so commits cannot silently diverge.
- **Cleanup caveat:** Preserve or commit any modified/untracked files inside the linked worktree before running `git worktree remove`, which deletes that checkout directory.

## Related notes and references

- [Merging and rebasing](/docs/cheatsheets/tooling/git/merging-and-rebasing/)
- [Undoing changes and recovery](/docs/cheatsheets/tooling/git/undoing-changes-and-recovery/)
- [Tags](/docs/cheatsheets/tooling/git/tags/)
- [Git documentation: `git-branch`](https://git-scm.com/docs/git-branch)
- [Git documentation: `git-switch`](https://git-scm.com/docs/git-switch)
- [Git documentation: `git-worktree`](https://git-scm.com/docs/git-worktree)
- [Pro Git: Branches in a Nutshell](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)
- [Pro Git: Remote Branches](https://git-scm.com/book/en/v2/Git-Branching-Remote-Branches)
