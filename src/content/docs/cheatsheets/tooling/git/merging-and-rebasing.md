---
title: "Merging and rebasing"
---

Integrate changes across branches using merge, squash merge, rebase, or cherry-pick while preserving history integrity.

## Compare strategies before integrating

| Method                                  | Effect on commit graph                                | Creates replacement commits?        | Best used when                                                                               |
| --------------------------------------- | ----------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------- |
| Fast-forward merge (`--ff`)             | Moves target branch pointer forward; no new commit    | No                                  | Target branch has not diverged from the incoming branch                                      |
| Three-way merge (`--no-ff` or diverged) | Creates a merge commit with two parents               | No                                  | Integrating shared branches or preserving explicit branch topology                           |
| Squash merge (`git merge --squash`)     | Stages combined diff for one new single-parent commit | One new commit; originals unchanged | Condensing noisy WIP history into one commit (does **not** record source branch ancestry)    |
| Rebase (`git rebase BASE`)              | Replays commits one by one onto `BASE`                | Yes (every replayed commit)         | Updating a **private** topic branch onto the latest base or cleaning up local commits (`-i`) |
| Cherry-pick (`git cherry-pick SHA`)     | Applies selected commit patch(es) as new commit(s)    | Usually; fast-forward is possible   | Backporting a targeted fix to a release branch without merging the full branch               |

## Inspect branch divergence first

Fetch remote refs and compare what each branch introduces from a clean working tree:

```bash
git fetch origin
git status
git log --oneline --graph --decorate --all
git log --oneline main..feature/login       # Commits on feature/login not in main
git log --oneline feature/login..main       # Commits on main not in feature/login
git diff main...feature/login               # Changes on feature/login since its merge base with main
```

## Merge a branch

Switch to the receiving branch and merge the source branch:

```bash
git switch main
git merge feature/login
git merge --no-ff feature/login             # Force a merge commit even if fast-forward is possible
```

To squash-merge all changes from a branch into a single commit:

```bash
git switch main
git merge --squash feature/login
git commit
```

- **Squash ancestry gotcha:** `git merge --squash` updates the index and working tree without recording `feature/login` as a parent commit. Start subsequent work on a fresh branch from the updated base. Reusing the old branch can reintroduce old commits into comparisons and cause repeated conflicts.

## Rebase and clean up private history interactively

Replay a private topic branch onto the latest `origin/main` or edit the commit series interactively:

```bash
git fetch origin
git switch feature/login
git rebase origin/main
git rebase -i origin/main
```

### Interactive rebase (`git rebase -i`) todo actions

| Action   | Effect                                                                     |
| -------- | -------------------------------------------------------------------------- |
| `pick`   | Keep the commit as is                                                      |
| `reword` | Keep the commit changes, but edit its commit message                       |
| `edit`   | Pause after applying the commit so you can amend files or split the commit |
| `squash` | Fold commit into the preceding commit and combine messages                 |
| `fixup`  | Fold commit into the preceding commit and discard this commit's message    |
| `drop`   | Remove the commit (and its changes) entirely                               |

> **Warning:** Rebasing assigns new commit SHAs to every replayed commit, and `drop` or bad conflict resolutions can discard changes. Never rebase commits that teammates have already based work upon without coordinating. If a rebase goes wrong, recover the pre-rebase branch tip via `git reflog` (see [Undoing changes and recovery](/docs/cheatsheets/tooling/git/undoing-changes-and-recovery/)).

## Cherry-pick specific commits

Copy one or more individual commits onto the current branch:

```bash
git switch release
git cherry-pick COMMIT_ID
```

Replace `COMMIT_ID` with the commit hash to backport. Avoid cherry-picking an entire branch when normal merge ancestry is needed.

## Resolve merge, rebase, or cherry-pick conflicts

When Git halts on a conflict, edit the conflicted files to remove `<<<<<<<`, `=======`, and `>>>>>>>` markers, stage each resolved file, and either continue or abort:

```bash
git status
git add FILE_PATH
git diff --cached
```

Replace `FILE_PATH` with each resolved path, then finish or abort according to the active operation:

| Operation         | Complete / continue          | Abort and restore pre-operation state | Skip current commit                         |
| ----------------- | ---------------------------- | ------------------------------------- | ------------------------------------------- |
| `git merge`       | `git commit`                 | `git merge --abort`                   | Not applicable                              |
| `git rebase`      | `git rebase --continue`      | `git rebase --abort`                  | `git rebase --skip` (drops current commit!) |
| `git cherry-pick` | `git cherry-pick --continue` | `git cherry-pick --abort`             | `git cherry-pick --skip`                    |

- **Clean working tree caveat:** Start merges and rebases with a clean working tree—`--abort` may fail to restore pre-existing uncommitted modifications.
- **`--skip` caveat:** Only run `--skip` when a replayed patch is already present upstream or you intentionally want to omit that commit's changes.

## Publish rewritten private branches safely

- If you rebase a branch that was already pushed to a PR, coordinate with reviewers and publish with `git push --force-with-lease` after fetching and checking remote history (never routine `--force`).
- Remember that GitHub's PR merge buttons (**Create a merge commit**, **Squash and merge**, **Rebase and merge**) run server-side and can produce different commit SHAs and committer metadata than local commands.

## Related notes and references

- [Branches](/docs/cheatsheets/tooling/git/branches/)
- [Undoing changes and recovery](/docs/cheatsheets/tooling/git/undoing-changes-and-recovery/)
- [Git documentation: `git-merge`](https://git-scm.com/docs/git-merge)
- [Git documentation: `git-rebase`](https://git-scm.com/docs/git-rebase)
- [Git documentation: `git-cherry-pick`](https://git-scm.com/docs/git-cherry-pick)
- [Git documentation: `git-push`](https://git-scm.com/docs/git-push)
- [Pro Git: Basic Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
- [Pro Git: Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)
