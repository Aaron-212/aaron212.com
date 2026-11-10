---
title: "Pull request"
---

End-to-end GitHub workflow for proposing, reviewing, validating, merging, cleaning up, and reverting changes from a head branch into a base branch.

## Core model and prerequisites

- **PR vs commit:** A Git commit is an immutable repository snapshot; a pull request (called a Merge Request in GitLab) is GitHub's review and integration record comparing a **head branch** (your proposed changes) against a **base branch** (typically `main`).
- **Diff calculation:** GitHub displays changes introduced on the head branch since its **merge base** with the base branch (`git diff BASE...HEAD`). Choosing the wrong base branch skews the diff and timeline; changing the base branch later can orphan review comment context.
- **Repository policy first:** Always check `CONTRIBUTING.md`, branch naming rules, required [commit signing](/docs/cheatsheets/tooling/git/commit-signing/) or DCO sign-off rules, and branch protection settings before starting. See also [Branches](/docs/cheatsheets/tooling/git/branches/).

## 1. Branch from the latest base

### Shared repository workflow (push access to `origin`)

Fetch the latest base branch, fast-forward local `main`, and create a focused topic branch:

```bash
git remote -v
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c fix/clear-short-description
```

### Fork workflow (`origin` = your fork, `upstream` = source repo)

Register `upstream` if needed and branch directly from `upstream/main`:

```bash
git remote add upstream https://github.com/OWNER/REPOSITORY.git
git fetch upstream
git switch -c fix/clear-short-description upstream/main
```

Replace `OWNER/REPOSITORY` with the upstream repository path.

- **Scope discipline:** Keep one logical change per PR. Never commit directly to a protected base branch. If your change depends on an unmerged PR, use a stacked PR workflow or wait—branching off an unmerged branch silently includes its commits if targeted at `main`.

## 2. Implement, commit, and validate locally

Stage focused changes and run project checks (formatter, linter, typecheck, tests, build):

```bash
git status --short
git diff
git add FILE_PATH
git commit -m "Fix short description of the behavior"
```

Audit whitespace errors, the full PR diff against the merge base, and the commit list before pushing (use `upstream/main` in place of `origin/main` when working in a fork):

```bash
git diff --check
git diff origin/main...HEAD
git log --oneline origin/main..HEAD
```

- **Artifact and secret check:** Confirm build outputs, unrelated reformatting, and secrets are excluded.
- **Local vs required checks:** Passing checks locally does not satisfy GitHub branch protection until GitHub receives the required check status on the current PR head SHA (or `merge_group`).

## 3. Push and open the PR

Push the topic branch to the remote where you have write permissions (`origin`):

```bash
git push -u origin fix/clear-short-description
```

### Draft vs Ready for review

| State                | Behavior                                                                                                 |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| **Draft PR**         | Runs CI and allows early discussion; cannot be merged and does **not** auto-request `CODEOWNERS` reviews |
| **Ready for review** | Unlocks merging (once rules pass) and automatically requests review from applicable `CODEOWNERS`         |

### PR description checklist

Follow the repository's `.github/PULL_REQUEST_TEMPLATE.md` if present, and cover:

- **Why:** Problem statement, user impact, and closing issue keyword (for example, `Closes #123`).
- **What:** Key behavioral or architectural changes.
- **How to verify:** Automated checks run, manual reproduction steps, and screenshots for UI changes.
- **Risk and rollout:** Migrations, feature flags, backwards compatibility, or deployment ordering.
- **Known limits:** Follow-up work intentionally left out of scope.

## 4. Handle review feedback, checks, and merge queues

- **Resolved threads vs review state:** Resolving a comment thread does **not** clear a **Changes requested** review blocker; the reviewer must approve or a maintainer must dismiss the stale review.
- **New pushes and stale approvals:** When "Dismiss stale pull request approvals when new commits are pushed" is enabled, any commit or force-push that alters the diff invalidates existing approvals and requires fresh review and CI runs on the new head SHA.
- **Required checks and skipped workflows:** If a path filter causes a workflow containing a required check to be skipped, the required check stays pending and blocks merging.
- **Merge queue (`merge_group`):** Queue-protected branches batch approved PRs onto the latest base and run CI before merging. Workflows required by a merge queue **must** trigger on the `merge_group` event in addition to `pull_request`.
- **Auto-merge:** Enabling auto-merge only schedules the PR to merge _after_ all branch protection rules, reviews, and checks pass—it does not mean checks have already succeeded.

## 5. Resolve conflicts and update the branch

Prefer resolving non-trivial conflicts locally rather than in GitHub's web conflict editor (the web editor always merges the entire base branch into your head branch):

```bash
git fetch origin
git switch fix/clear-short-description
git merge origin/main
# Resolve conflicts in each file, run checks, then stage and commit:
git add FILE_PATH
git commit
git push
```

- **Rebase alternative:** If project policy prefers linear history and no one else shares your head branch, run `git rebase origin/main`, validate, and push with `git push --force-with-lease`. Never mix unrelated feature edits into a conflict-resolution commit or rebase.

## 6. Choose the right PR merge method

All three GitHub merge buttons execute server-side on GitHub (a local `git merge` or `git rebase` does not close or merge a PR unless pushed directly to the base branch):

| Merge method              | Server-side behavior                                                         | History and reuse caveats                                                                                            |
| ------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Create a merge commit** | Preserves all topic branch commits and adds a two-parent merge commit        | Incompatible with rules requiring linear history                                                                     |
| **Squash and merge**      | Condenses all PR commits into a single new commit on the base branch         | Original topic commits are **not** ancestors of base; never reuse a squash-merged branch for future work             |
| **Rebase and merge**      | Replays each PR commit individually onto the base tip without a merge commit | Assigns new commit SHAs and rewrites committer metadata to GitHub/the merging user (differs from local `git rebase`) |

After merging, verify any triggered deployment separately—a completed merge does not guarantee a healthy production rollout.

## 7. Clean up branches and revert safely

Prune remote-tracking refs, fast-forward local `main`, and delete the merged local branch:

```bash
git fetch origin --prune
git switch main
git pull --ff-only origin main
git branch -d fix/clear-short-description
```

- **`git branch -d` after squash/rebase merge:** Because squash and rebase merges create new commit SHAs on `main`, `git branch -d` reports the local topic branch as unmerged. Verify your PR changes landed on `main` and no unpushed local commits remain before running `git branch -D fix/clear-short-description`.
- **Fork cleanup:** `git fetch upstream` only updates your local `upstream/*` refs; push `upstream/main` to `origin/main` (or use GitHub's **Sync fork** button) to update your hosted fork.
- **Reverting a merged PR:** Use GitHub's **Revert** button or `git revert` in a new PR to create an inverse commit that preserves history and audit trail. Coordinate production rollbacks separately when the PR included database migrations, state changes, or external service updates.

## References

- [GitHub Docs: About pull requests](https://docs.github.com/en/pull-requests/get-started/about-pull-requests)
- [GitHub Docs: Pull requests reference](https://docs.github.com/en/pull-requests/reference/pull-requests)
- [GitHub Docs: Writing code for a project](https://docs.github.com/en/pull-requests/concepts/writing-code-for-a-project)
- [GitHub Docs: Creating a pull request from a fork](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request-from-a-fork)
- [GitHub Docs: About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Docs: Pull request merges](https://docs.github.com/en/pull-requests/reference/pull-request-merges)
- [GitHub Docs: Managing a merge queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue)
- [GitHub Docs: Troubleshooting required status checks](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks)
- [GitHub Docs: Resolving a merge conflict using the command line](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/resolving-a-merge-conflict-using-the-command-line)
- [GitHub Docs: Reverting a pull request](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/reverting-a-pull-request)
