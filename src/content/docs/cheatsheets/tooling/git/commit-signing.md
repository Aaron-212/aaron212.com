---
title: "Commit signing"
---

Attach cryptographic signatures (SSH, OpenPGP/GPG, or S/MIME) to commits and tags so verifiers can confirm payload integrity and key ownership.

## What commit signing does and does not do

| Mechanism            | Flag / config                           | Purpose                                                            | Cryptographic proof of commit object?                                                             |
| -------------------- | --------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Commit signature     | `git commit -S` / `commit.gpgsign=true` | Signs the commit payload with your private SSH, GPG, or S/MIME key | **Yes** (proves the key holder signed that exact commit content; does **not** encrypt the commit) |
| Tag signature        | `git tag -s TAG_NAME`                   | Signs an annotated tag object                                      | **Yes** (signs the tag object; separate from signing the commit)                                  |
| SSH transport auth   | `~/.ssh/config` / `ssh-agent`           | Authenticates your network connection when pushing/fetching        | **No** (authenticates the session, not the commit objects)                                        |
| DCO sign-off trailer | `git commit -s`                         | Appends plain-text `Signed-off-by: Name <email>` to commit message | **No** (policy attestation for Developer Certificate of Origin, not a cryptographic signature)    |

For commit metadata and staging workflows, see [Git fundamentals](/docs/cheatsheets/tooling/git/git-fundamentals/) and [Staging and committing](/docs/cheatsheets/tooling/git/staging-and-committing/).

## Configure SSH commit signing (Git 2.34+)

1. Configure Git to sign commits with your SSH key (upload the public key to GitHub specifically as a **Signing Key**, which is registered separately from SSH authentication keys):

   ```bash
   git config --global gpg.format ssh
   git config --global user.signingkey ~/.ssh/id_ed25519.pub
   git config --global commit.gpgsign true
   ```

   If `user.signingkey` points to a `.pub` public key path, the matching private key must be loaded in `ssh-agent` (`ssh-add -l` to inspect, `ssh-add ~/.ssh/id_ed25519` to load).

2. Create an allowed-signers trust file (`~/.config/git/allowed_signers`) mapping each trusted principal email to its key type and public key material (without trailing comment):

   ```text
   ada@example.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIExamplePublicKeyMaterial
   ```

3. Register the allowed-signers file and verify a signed commit locally:

   ```bash
   git config --global gpg.ssh.allowedSignersFile ~/.config/git/allowed_signers
   git verify-commit HEAD
   git show --show-signature HEAD
   ```

- **Trust caveat:** SSH verification checks mathematical validity against keys listed in `allowedSignersFile`; only add public keys you actually trust for that email principal.

## Configure OpenPGP (GPG) signing

List your secret keys, configure Git with your GPG key ID, and upload the public key to your GitHub account:

```bash
gpg --list-secret-keys --keyid-format=long
git config --global gpg.format openpgp
git config --global user.signingkey KEY_ID
git config --global commit.gpgsign true
```

Replace `KEY_ID` with your long GPG key identifier.

- **Verify GPG signatures locally:**

  ```bash
  git verify-commit COMMIT_ID
  git verify-tag TAG_NAME
  git show --show-signature COMMIT_ID
  ```

- **Troubleshooting GPG failures:** Confirm `gpg` is installed, `gpg --list-secret-keys` shows an unexpired secret key matching `user.signingkey`, and your `gpg-agent` / Pinentry prompt is reachable in the current terminal (`GPG_TTY=$(tty)`).

## Per-commit overrides and history rewrites

| Task                                                        | Command                                           |
| ----------------------------------------------------------- | ------------------------------------------------- |
| Sign one commit when `commit.gpgsign` is `false`            | `git commit -S -m "Message"`                      |
| Skip signing for one commit when `commit.gpgsign` is `true` | `git -c commit.gpgsign=false commit -m "Message"` |
| Sign an annotated tag                                       | `git tag -s v1.2.0 -m "Release 1.2.0"`            |

- **History rewrites invalidate prior signatures:** `commit --amend`, `rebase`, and `cherry-pick` create brand-new commit objects. Prior signatures do not carry over; re-sign rewritten commits (`git rebase -S` or `commit.gpgsign=true`) and verify the new commit SHAs.

## GitHub `Verified` badge rules and gotchas

- **Requirements for `Verified`:**
  1. Valid cryptographic signature (SSH, GPG, or S/MIME).
  2. Public signing key uploaded to the signer's GitHub account as a signing key.
  3. Committer email address verified on that same GitHub account.
- **What `Verified` means (and does not mean):** Indicates GitHub verified the signature against a key registered to that account under GitHub's rules. It does not prove the code is free of bugs/backdoors, that a different listed `--author` approved the commit, or that external verifiers trust the key.
- **Badge states under Vigilant Mode:**
  - `Verified`: Signature verified and matched to the account.
  - `Partially verified`: Commit was created or rebased on behalf of another author who has vigilant mode enabled.
  - `Unverified`: Unsigned commit (when vigilant mode is enabled), unknown signing key, mismatched committer email, or unsupported rewrite method.

## References

- [Git documentation: `gitformat-signature`](https://git-scm.com/docs/gitformat-signature)
- [Git documentation: `git-commit`](https://git-scm.com/docs/git-commit)
- [Git documentation: `git-config`](https://git-scm.com/docs/git-config)
- [GitHub Docs: About commit signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification)
- [GitHub Docs: Displaying verification statuses for all of your commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/displaying-verification-statuses-for-all-of-your-commits)
- [GitHub Docs: Managing commit signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification)
