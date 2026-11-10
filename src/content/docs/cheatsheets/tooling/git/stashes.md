---
title: "Stashes"
---

Temporarily shelve uncommitted local modifications and reset the working tree to `HEAD` without creating a branch commit.

## Save, inspect, and restore stashed work

Run the following commands to stash and recover local edits:

```bash
git stash push -m "work in progress"
git stash list
git stash show -p stash@{0}
git stash apply stash@{0}
git stash pop
```

## Options and decision rules

| Command or flag             | Behavior and when to use                                                    |
| --------------------------- | --------------------------------------------------------------------------- |
| `git stash apply stash@{0}` | Restores changes and **keeps** the stash entry until you confirm the result |
| `git stash pop`             | Applies the latest stash and **drops** the entry if application succeeds    |
| `git stash push -u`         | Includes untracked files alongside tracked modifications                    |
| `git stash push -a`         | Includes both untracked and ignored files                                   |
| `git stash apply --index`   | Restores both working-tree changes and the previous staged index state      |

## Gotchas and safety caveats

- **Pop conflicts retain the stash:** If `git stash pop` hits a merge conflict, Git keeps the stash entry. Resolve conflicts manually and drop the entry only after verifying the recovered files.
- **Not a backup:** Stashes are local, temporary storage and can conflict when applied onto a different commit. Commit on a temporary branch or back up important work rather than relying on a stash as the sole copy.
