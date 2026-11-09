---
name: sync-translations
description: Maintain this portfolio's English and Simplified Chinese translations in localized pages and component-scoped dictionaries. Use when comparing, auditing, or synchronizing localized pages or messages; exclude src/content/blog/, distinguish missing or entirely different text from equivalent wording, and respect intentional exceptions.
---

# Maintain English and Simplified Chinese translations

Use English as the source of truth by default. When synchronizing, update Simplified Chinese to match English only
where text is completely missing or entirely different in meaning. Follow an explicit user request for another source
language or an audit without edits.

Focus on `src/pages/` and the message dictionaries in `src/components/` and `src/layouts/`.
Exclude all of `src/content/blog/` from inspection, comparison, edits, and discrepancy reports, including blog content
rendered by page routes.

## Find corresponding content

- Pair English pages in `src/pages/` with the same relative paths under `src/pages/zh-cn/`.
- Pair the `en` and `"zh-cn"` entries in each component or layout by message key. The English dictionary is defined
  as `const en`, and `messages` contains both locales. Include the shared dictionary in
  `src/components/TableOfContents/messages.ts`.
- Inspect message usage when needed to understand titles, descriptions, accessibility labels, or interpolation.
- Compare corresponding headings and paragraphs by their role and meaning, not line numbers or literal wording.
  Preserve locale-specific links, routes, placeholders, markup, and formatting conventions.

## Honor intentional differences first

A preceding HTML comment containing a reason for an intentional difference, or simply `<!--Keep-->`, exempts the
associated paragraph or heading. Honor a marker in either language and ignore the corresponding difference entirely:
do not edit it or include it in the discrepancy report.

Associate the comment with the paragraph or heading that follows, allowing intervening whitespace. A heading marker
applies to the heading itself, not automatically to the entire section. Use a reason's explicit scope when it identifies
multiple paragraphs. Ordinary comments unrelated to translation intent do not grant an exemption. Do not add exception
markers yourself to avoid resolving a mismatch, remove existing markers, or treat quoted comments in code examples as
active markers.

For example, both of these mark intentional differences:

```html
<!--Keep-->
<h2>Local title</h2>

<!-- The Chinese paragraph intentionally uses a local example. -->
<p>Localized example.</p>
```

For component-scoped messages, check for an applicable marker at the rendered usage. A marker on one usage does not
exempt unrelated usages of the same message.

## Decide what to change

| Comparison                                                                             | Action                                                                              |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Chinese text or its corresponding block/key is completely missing                      | Add a Simplified Chinese translation of the English text in the matching location.  |
| Corresponding text conveys entirely different meaning                                  | Replace the Chinese text with a faithful Simplified Chinese translation of English. |
| Meaning is similar or equivalent but wording, phrasing, or emphasis differs            | Report the wording difference; leave both versions unchanged.                       |
| Meaning agrees and there is no meaningful wording difference to flag                   | Leave unchanged.                                                                    |
| Intentional difference marked as above                                                 | Ignore entirely.                                                                    |
| Relationship or semantic difference is uncertain, partial, or outside these categories | Report for review; do not edit.                                                     |

Do not broaden "mismatch" to include stylistic preferences, minor inaccuracies, partial omissions, or small factual
differences. Only completely missing or entirely different text qualifies for automatic synchronization. If English is
missing but Chinese exists, report it for review; do not delete Chinese content or write English from it by default.

When adding a missing counterpart page within the requested scope, follow neighboring localized pages and translate its
English content. For all edits, retain technical identifiers and interpolation placeholders and use existing Chinese
terminology. Do not rewrite the English source as part of synchronization.

## Validate and report

Review the diff to confirm that edits affect only qualifying Chinese translations and preserve intentional exceptions.
Follow repository validation instructions for the files changed. Do not run builds or tests unless requested or required
by the applicable repository workflow.

Report corrections separately from wording-only differences and unresolved cases. For reported differences, include
file locations or message keys, brief English and Chinese excerpts, and why the text was left unchanged. Omit exempted
differences completely. Keep the final report in English unless working on a Chinese document or instructed otherwise.
