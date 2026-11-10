---
title: "Selectors"
---

Match HTML elements by type, class, ID, attribute, DOM relationship, state, structure, pseudo-element, and native nesting, and calculate cascade specificity.

## Basic and attribute selectors

### Elemental selectors

| Selector  | Example         | Matches                                                                                        | Specificity |
| --------- | --------------- | ---------------------------------------------------------------------------------------------- | ----------- |
| Type      | `button`        | Every `<button>` element                                                                       | `0-0-1`     |
| Class     | `.large`        | Elements containing `large` in their space-separated `class` attribute (case-sensitive)        | `0-1-0`     |
| ID        | `#login-button` | Element with `id="login-button"` (case-sensitive; keep unique per document)                    | `1-0-0`     |
| Universal | `*`             | Every element node (including `<html>`; excludes text nodes and pseudo-elements unless scoped) | `0-0-0`     |

### Attribute selectors (`0-1-0`)

| Syntax                 | Meaning                                              | Gotchas                                                                  |
| ---------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------ |
| `[disabled]`           | Attribute is present (regardless of value)           | Matches `disabled=""` and `disabled="false"`                             |
| `[type="email"]`       | Exact value match                                    | `[class="large"]` fails on `class="button large"` (use `.large` or `~=`) |
| `[class~="large"]`     | Whitespace-separated token match                     | Equivalent to `.large` without invalid-identifier syntax rules           |
| `[lang\|="en"]`        | Exact match `en` or hyphen-prefixed `en-*` (`en-US`) | Designed for BCP 47 language subtags                                     |
| `[href^="https://"]`   | Prefix match                                         | Literal string comparison on raw attribute                               |
| `[href$=".pdf"]`       | Suffix match                                         | Fails if URL has query string like `.pdf?dl=1`                           |
| `[data-name*="draft"]` | Substring match                                      | Matches anywhere inside the attribute string                             |
| `[href$=".pdf" i]`     | ASCII case-insensitive value match (`i` flag)        | Matches `.pdf`, `.PDF`, and `.Pdf`                                       |

## Compounds, combinators, and selector lists

### Compound vs descendant vs selector list

| Pattern                  | Example                | Meaning                                                                                     |
| ------------------------ | ---------------------- | ------------------------------------------------------------------------------------------- |
| Compound (no space)      | `button.primary.large` | Single `<button>` that has **both** `primary` and `large` classes                           |
| Descendant (space)       | `.card p`              | Any `<p>` nested at any depth inside `.card`                                                |
| Direct child (`>`)       | `.card > p`            | `<p>` whose immediate parent element is `.card`                                             |
| Next sibling (`+`)       | `h2 + p`               | `<p>` immediately following an `<h2>` under the same parent (ignores whitespace text nodes) |
| Subsequent sibling (`~`) | `h2 ~ p`               | Every `<p>` following an `<h2>` under the same parent                                       |
| Selector list (`,`)      | `.card h2, .card p`    | Independent alternatives (`⚠️ .card h2, p` matches **all** `<p>` elements on the page!)     |

- **Forgiving vs strict selector lists:** A single syntax error in an ordinary comma-separated selector list—or inside `:not()` or `:has()`—invalidates the **entire CSS rule**. Only `:is()` and `:where()` use forgiving selector lists that ignore invalid arguments and keep valid ones.

## Pseudo-classes (`:`)

### Interaction, form, and document state

| Pseudo-class              | Matches when                                                                      | Practical gotcha                                                                    |
| ------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `:hover`                  | Pointer hovers over element                                                       | Unreliable/sticky on touch screens; never hide essential actions behind hover alone |
| `:active`                 | Element is being activated (mouse press / key activation)                         | Applies during press                                                                |
| `:focus`                  | Element has input focus                                                           | Always applies on focus                                                             |
| `:focus-visible`          | Element has focus and browser heuristics indicate keyboard/visible ring is needed | Never remove `:focus` outlines without keeping a clear `:focus-visible` indicator   |
| `:focus-within`           | Element itself or any descendant has focus                                        | Useful for highlighting form field wrappers (`.field:focus-within`)                 |
| `:checked`                | Checkbox/radio is checked or `<option>` is selected                               | Pair with `+` or `:has()` for CSS state styling                                     |
| `:disabled` / `:enabled`  | Native form control supports and has disabled/enabled state                       | Does **not** match `aria-disabled="true"` on non-disabled elements                  |
| `:required` / `:optional` | Form control has / lacks `required` attribute                                     | Applies only to form elements supporting `required`                                 |
| `:valid` / `:invalid`     | Control value passes / fails HTML constraint validation                           | `:invalid` matches empty `required` fields immediately on page load                 |
| `:link` / `:visited`      | Unvisited / visited `<a href>`                                                    | `:visited` restricts allowed CSS properties and `getComputedStyle` for user privacy |
| `:target`                 | Element's `id` matches current URL `#fragment`                                    | Updates on hash navigation                                                          |
| `:root`                   | Document root (`<html>` in HTML)                                                  | Higher specificity (`0-1-0`) than `html` (`0-0-1`)                                  |

### Structural indexing (`:nth-child` vs `:nth-of-type`)

All structural indices are **1-based** (`An+B` evaluates for integer `n = 0, 1, 2, ...`):

| Selector                                             | What it counts and matches                                                   |
| ---------------------------------------------------- | ---------------------------------------------------------------------------- |
| `:first-child` / `:last-child` / `:only-child`       | Element that is the first, last, or sole element child of its parent         |
| `:first-of-type` / `:last-of-type` / `:only-of-type` | First, last, or sole sibling of its **HTML tag name** (ignores class names!) |
| `li:nth-child(odd)` / `li:nth-child(2n + 1)`         | Odd element children (`1, 3, 5, ...`) if they are `<li>`                     |
| `li:nth-child(3n + 1)`                               | Every 3rd child starting at 1 (`1, 4, 7, ...`)                               |
| `li:nth-child(-n + 3)`                               | First 3 element children (`1, 2, 3`) if they are `<li>`                      |
| `.item:nth-child(2)`                                 | Matches only if the **2nd child overall** happens to have `.item`            |
| `:nth-child(2 of .item)`                             | Filters siblings to `.item` **first**, then matches the 2nd `.item`          |

### Logical and relational pseudo-classes (`:is`, `:where`, `:not`, `:has`)

| Function                        | Behavior                                                                                  | Specificity weight                                                                                  |
| ------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `:is(article, section) > h2`    | Matches any listed branch (forgiving list)                                                | **Highest** argument in the list (`:is(.card, #app)` counts as `1-0-0` even when matching `.card`!) |
| `:where(article, section) > h2` | Matches any listed branch (forgiving list)                                                | Always **`0-0-0`** (ideal for reset/default styles that are easy to override)                       |
| `button:not(:disabled)`         | Matches elements not matching argument list (strict list)                                 | **Highest** argument in the list                                                                    |
| `.card:has(> img)`              | Relational selector: styles `.card` when it contains a direct `<img>` child (strict list) | **Highest** argument in the list                                                                    |

Combine `:has()` conditions carefully:

```css
/* OR: contains an image or video */
.card:has(img, video) {
  border: 1px solid;
}

/* AND: contains both an image and video */
.card:has(img):has(video) {
  padding: 1rem;
}

/* Heading immediately followed by a paragraph */
h2:has(+ p) {
  margin-block-end: 0;
}
```

- **`:has()` restrictions:** Cannot nest `:has()` inside `:has()`, and cannot match pseudo-elements inside `:has()`.

## Pseudo-elements (`::`)

Use double colons (`::`) to target generated boxes or sub-parts of an element (specificity `0-0-1`):

| Pseudo-element                    | Target and caveats                                                                                                                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `::before` / `::after`            | Generated child box before/after element content; requires `content` (such as `content: ""`), fails on replaced elements like `<img>`, and should not hold essential accessible text |
| `::first-letter` / `::first-line` | First letter or first formatted line of a block container                                                                                                                            |
| `::selection`                     | User-highlighted text selection                                                                                                                                                      |
| `::marker`                        | Bullet or number box of a `display: list-item` element                                                                                                                               |
| `::placeholder`                   | Placeholder text inside `<input>` or `<textarea>` (distinct from `:placeholder-shown` state)                                                                                         |

## Cascade precedence and specificity (`A-B-C`)

Before comparing selector specificity, the CSS cascade resolves declarations in this order:

1. **Origin and `!important`** (transition → important user-agent → important user → important author → animations → normal author → normal user → normal user-agent).
2. **Inline `style=""` attribute** (outranks stylesheet declarations of the same author origin and importance, including layered declarations).
3. **Cascade `@layer` order** (unlayered author styles outrank layered styles for normal declarations; reversed for `!important`).
4. **Specificity (`ID - Class/Attr/Pseudo-class - Type/Pseudo-element`)**, compared column by column from left to right:
   - `#app .card p` → `1-1-1` (beats `0-99-99`).
   - `.card > p::before` → `0-1-2` (`>` combinator adds `0-0-0`).
   - `:nth-child(2 of .item)` → `0-1-0` (`:nth-child`) + `0-1-0` (highest in `S`) = `0-2-0`.
5. **Scoping proximity** (`@scope`), then **source order** (last declaration wins).

## Native CSS nesting (`&`)

Nest child, state, or modifier rules directly inside a parent rule using `&` to reference the parent selector:

```css
.card {
  padding: 1rem;

  & > h2 {
    margin-block-start: 0; /* Equivalent to .card > h2 */
  }

  &:hover {
    border-color: royalblue; /* Equivalent to .card:hover */
  }

  &.featured {
    border-width: 2px; /* Equivalent to .card.featured */
  }
}
```

- **Space after `&` gotcha:** `&:hover` targets the hovered `.card` itself; `& :hover` (with a space) targets **descendants** hovered inside `.card`.
- **Specificity and Sass difference:** Native nesting wraps parent selector lists with `:is()` semantics (taking the highest parent branch specificity) and **cannot** concatenate strings like Sass `&-title` to form `.card-title`.

## Troubleshooting

| Symptom                                                    | Cause and fix                                                                                                             |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `.btn.active` vs `.btn .active` mismatch                   | Removing the space requires both classes on the **same** element; adding a space searches for `.active` **inside** `.btn` |
| `.card h2, p` styles every `<p>` on the site               | Commas split full selectors; write `.card :is(h2, p)` or `.card h2, .card p`                                              |
| `p:first-child` fails to match the first paragraph         | An `<h2>` sits before `<p>`, making `<p>` the 2nd child; use `p:first-of-type`                                            |
| `.item:nth-child(2)` fails when non-`.item` siblings exist | Use `:nth-child(2 of .item)` to filter before counting                                                                    |
| Entire rule block is ignored by the browser                | One selector in a comma list (or inside `:not()`/`:has()`) has invalid syntax                                             |
| `::before` decoration never renders                        | Add `content: ""` and confirm the target is not a void/replaced element like `<img>` or `<input>`                         |
| `:disabled` fails on a custom button                       | Use a native `disabled` attribute on a form control or explicitly match `[aria-disabled="true"]`                          |

## References

- [MDN: CSS selectors guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Selectors)
- [MDN: Attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Attribute_selectors), [Pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Pseudo-classes), [Pseudo-elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Pseudo-elements)
- [MDN: `:nth-child()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:nth-child) and [`:has()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:has)
- [MDN: Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Specificity)
- [MDN: Using CSS nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Nesting/Using)
- [W3C: Cascade sorting order](https://www.w3.org/TR/css-cascade-5/#cascade-sort)
- [W3C Selectors Level 4 Specification](https://www.w3.org/TR/selectors-4/)
