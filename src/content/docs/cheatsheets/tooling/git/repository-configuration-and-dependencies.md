---
title: "Repository configuration and dependencies"
---

Configure file ignore rules, line-ending attributes, client hooks, submodules, Git LFS, and partial or shallow clones.

## Ignore untracked files

| Ignore source       | Scope                                  | Shared in repository |
| ------------------- | -------------------------------------- | -------------------- |
| `.gitignore`        | Repository and subdirectories          | Yes (committed)      |
| `.git/info/exclude` | Local clone only                       | No                   |
| `core.excludesFile` | All repositories for your user account | No                   |

Example `.gitignore` with an exception rule for a safe template file:

```gitignore
node_modules/
dist/
.env
.env.*
!.env.example
```

Diagnose ignore rules and stop tracking a previously committed file while keeping it on disk:

```bash
git check-ignore -v -- FILE_PATH
git ls-files -- FILE_PATH
git rm --cached -- FILE_PATH
```

Replace `FILE_PATH` with the target path, then commit both the index removal and the new `.gitignore` entry.

> **Warning:** `.gitignore` and `git rm --cached` do **not** affect files already tracked or purge secrets from historical commits. If a credential or secret was ever committed, revoke and rotate it immediately.

## Normalize line endings and diffs with `.gitattributes`

Commit `.gitattributes` to enforce consistent text normalization, line endings, and binary handling across platforms:

```gitattributes
* text=auto
*.sh text eol=lf
*.bat text eol=crlf
*.png binary
```

- **How normalization works:** Git stores normalized `LF` line endings in the object database and applies working-tree `eol` rules on checkout.
- **Applying to existing files:** Adding `.gitattributes` to an existing repo can require `git add --renormalize .`. Inspect the staged diff before committing, and avoid mixing bulk renormalization into unrelated feature changes.

## Client hooks

- **Lifecycle triggers:** Scripts such as `pre-commit`, `commit-msg`, and `pre-push` live in `.git/hooks/` or a custom `core.hooksPath`.
- **Distribution:** Cloning a repository does not install client hooks automatically; projects typically version hook scripts in a tracked directory and provide an explicit setup command.
- **Security and enforcement:**
  - Always inspect hook scripts before enabling them—they execute arbitrary shell commands on your machine.
  - Contributors can bypass client hooks (for example, `--no-verify`), so enforce mandatory checks in CI and server rulesets.

## Manage submodules

A submodule embeds an external Git repository at a fixed path by recording a **gitlink** (exact target commit SHA) in the parent tree and remote metadata in `.gitmodules`.

Initialize and inspect submodules in a new or existing clone:

```bash
git clone --recurse-submodules https://github.com/OWNER/PROJECT.git
git submodule update --init --recursive
git submodule status
```

Replace `OWNER/PROJECT` with the repository path.

- **Detached `HEAD`:** Submodules normally check out at a detached commit rather than a branch.
- **Updating a submodule safely:** Commit and push changes inside the submodule repository **first** (or verify the target commit exists on the submodule's remote), then stage and commit the updated submodule pointer in the parent repository. Pushing only the parent gitlink breaks checkouts for everyone else.

## Track large binary assets with Git LFS

Git Large File Storage (LFS) replaces matching large files in Git commits with lightweight pointer files and stores the underlying binary blobs on an LFS server.

Enable LFS and register file patterns before staging large files:

```bash
git lfs install
git lfs track '*.psd'
git add .gitattributes
```

- **Commit `.gitattributes`:** Always commit `.gitattributes` alongside the tracked files so collaborators and CI use the LFS filter.
- **Historical blobs:** `git lfs track` only applies to subsequent commits; removing existing large blobs from prior history requires a history-rewriting migration.
- **Operational requirements:** Every contributor and CI runner needs the `git-lfs` client installed and access to the host's LFS storage/bandwidth quota.

## Shallow vs partial clones

| Clone mode               | Example command                         | What is omitted                                       | Tradeoffs                                                                                           |
| ------------------------ | --------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Shallow clone            | `git clone --depth 1 REPO_URL`          | Older commit history beyond depth `1`                 | Breaks or limits `blame`, `log`, and merge-base resolution until deepened (`git fetch --unshallow`) |
| Partial clone (blobless) | `git clone --filter=blob:none REPO_URL` | Historical file blobs not needed for current checkout | Full commit/tree graph is local; missing blobs are fetched on demand from a supporting server       |

## Related notes and references

- [Staging and committing](/docs/cheatsheets/tooling/git/staging-and-committing/)
- [Remotes and synchronization](/docs/cheatsheets/tooling/git/remotes-and-synchronization/)
- [GitHub Actions](/docs/cheatsheets/tooling/github/actions/)
- [Git documentation: `gitignore`](https://git-scm.com/docs/gitignore)
- [Git documentation: `gitattributes`](https://git-scm.com/docs/gitattributes)
- [Git documentation: `githooks`](https://git-scm.com/docs/githooks)
- [Git documentation: `gitsubmodules`](https://git-scm.com/docs/gitsubmodules)
- [Git LFS documentation](https://git-lfs.com/)
- [Git documentation: `git-clone`](https://git-scm.com/docs/git-clone)
