---
title: "Flex layout"
---

One-dimensional CSS Flexible Box layout (Flexbox) reference for sizing, aligning, wrapping, and ordering items along a main and cross axis, with Tailwind CSS equivalents.

## Container setup, axes, and defaults

Set `display: flex` (`flex`) or `display: inline-flex` (`inline-flex`) on a parent element to make its direct normal-flow children **flex items** (use [Grid layout](/docs/cheatsheets/web-development/css/grid-layout/) when items must align across both rows and columns simultaneously):

```css
.container {
  display: flex;
}
```

- **Default item behavior:** Single row (`nowrap`), can shrink (`flex-shrink: 1`), does not grow (`flex-grow: 0`), auto basis (`flex-basis: auto`), and stretches along the cross axis (`align-items: stretch`) when cross size is `auto`.
- **Main axis vs cross axis (in horizontal LTR writing mode):**

  `row` follows the **inline** writing direction (flips in RTL); `column` follows the **block** direction.

<div class="not-prose my-6 space-y-4 text-sm" role="group" aria-label="Main and cross axes in horizontal left-to-right writing">
  <div class="flex flex-col gap-4 sm:flex-row">
    <div class="min-w-0 flex-1">
      <div class="mb-2 font-mono font-semibold">flex-direction: row</div>
      <div class="flex h-40 items-start gap-2 rounded-lg bg-surface p-3 *:rounded *:border *:border-accent/40 *:bg-accent/15 *:px-3 *:py-2">
        <span>A</span>
        <span>B</span>
        <span>C</span>
      </div>
    </div>
    <div class="min-w-0 flex-1">
      <div class="mb-2 font-mono font-semibold">flex-direction: column</div>
      <div class="flex h-40 flex-col items-start gap-2 rounded-lg bg-surface p-3 *:rounded *:border *:border-accent/40 *:bg-accent/15 *:px-3 *:py-1">
        <span>A</span>
        <span>B</span>
        <span>C</span>
      </div>
    </div>
  </div>
</div>

### Direction and wrapping (container properties)

| CSS                              | Tailwind CSS         | Behavior                                             |
| -------------------------------- | -------------------- | ---------------------------------------------------- |
| `flex-direction: row`            | `flex-row`           | Lay out along inline direction (default)             |
| `flex-direction: row-reverse`    | `flex-row-reverse`   | Reverse inline direction                             |
| `flex-direction: column`         | `flex-col`           | Lay out along block direction                        |
| `flex-direction: column-reverse` | `flex-col-reverse`   | Reverse block direction                              |
| `flex-wrap: nowrap`              | `flex-nowrap`        | Single line (default)                                |
| `flex-wrap: wrap`                | `flex-wrap`          | Wrap overflow onto new flex lines                    |
| `flex-wrap: wrap-reverse`        | `flex-wrap-reverse`  | Wrap and stack lines in reverse cross-axis direction |
| `flex-flow: row wrap`            | `flex-row flex-wrap` | Shorthand for `flex-direction` + `flex-wrap`         |

- **Independent wrapped lines:** Each wrapped flex line distributes free main-axis space independently, so items on different lines are not forced into shared columns. Wrapping a `column` container requires a constrained height (`height` / `max-height`).

The source order in each diagram is A, B, C. Reversing direction moves main-start to the opposite edge:

<div class="not-prose my-6 space-y-4 text-sm" role="group" aria-label="Reversed flex directions; source order remains A, B, C">
  <div>
    <div class="mb-2 font-mono font-semibold text-sm">row-reverse · main axis ←</div>
    <div class="flex flex-row-reverse gap-2 rounded-lg bg-surface p-3 *:rounded *:border *:border-accent/40 *:bg-accent/15 *:px-3 *:py-2 *:text-center">
      <span>A</span>
      <span>B</span>
      <span>C</span>
    </div>
  </div>
  <div>
    <div class="mb-2 font-mono font-semibold text-sm">column-reverse · main axis ↑</div>
    <div class="flex h-40 flex-col-reverse items-start gap-2 rounded-lg bg-surface p-3 *:rounded *:border *:border-accent/40 *:bg-accent/15 *:px-3 *:py-1 *:text-center">
      <span>A</span>
      <span>B</span>
      <span>C</span>
    </div>
  </div>
</div>

Each item below takes two-fifths of the line width. The single-line example clips overflowing items without scrolling:

<div class="not-prose my-6 space-y-4 text-sm" role="group" aria-label="Wrapping four equal-width items in horizontal left-to-right writing">
  <div>
    <div class="mb-2 font-mono font-semibold text-sm">nowrap · one overflowing line</div>
    <div class="flex flex-nowrap overflow-clip w-full max-w-64 gap-2 rounded-lg bg-surface p-3 *:rounded *:border *:border-accent/40 *:bg-accent/15 *:px-3 *:py-2 *:text-center">
      <span class="basis-2/5 shrink-0">A</span>
      <span class="basis-2/5 shrink-0">B</span>
      <span class="basis-2/5 shrink-0">C</span>
      <span class="basis-2/5 shrink-0">D</span>
    </div>
  </div>
  <div>
    <div class="mb-2 font-mono font-semibold text-sm">wrap · lines stack downward</div>
    <div class="flex flex-wrap w-full max-w-64 gap-2 rounded-lg bg-surface p-3 *:rounded *:border *:border-accent/40 *:bg-accent/15 *:px-3 *:py-2 *:text-center">
      <span class="basis-2/5 shrink-0">A</span>
      <span class="basis-2/5 shrink-0">B</span>
      <span class="basis-2/5 shrink-0">C</span>
      <span class="basis-2/5 shrink-0">D</span>
    </div>
  </div>
  <div>
    <div class="mb-2 font-mono font-semibold text-sm">wrap-reverse · lines stack upward</div>
    <div class="flex flex-wrap-reverse w-full max-w-64 gap-2 rounded-lg bg-surface p-3 *:rounded *:border *:border-accent/40 *:bg-accent/15 *:px-3 *:py-2 *:text-center">
      <span class="basis-2/5 shrink-0">A</span>
      <span class="basis-2/5 shrink-0">B</span>
      <span class="basis-2/5 shrink-0">C</span>
      <span class="basis-2/5 shrink-0">D</span>
    </div>
  </div>
</div>

## Alignment, gaps, and auto margins

### Main-axis distribution (`justify-content` on container)

Distributes remaining free space along the main axis **after** item flexing and `auto` margins are resolved (`justify-items` and `justify-self` have no effect in Flexbox):

| CSS value       | Tailwind CSS      | Result                                                          |
| --------------- | ----------------- | --------------------------------------------------------------- |
| `flex-start`    | `justify-start`   | Pack items at main-start (default)                              |
| `flex-end`      | `justify-end`     | Pack items at main-end                                          |
| `center`        | `justify-center`  | Pack items around the center                                    |
| `space-between` | `justify-between` | Equal gaps between items; flush against both ends               |
| `space-around`  | `justify-around`  | Equal space around each item (end gaps are half the inner gaps) |
| `space-evenly`  | `justify-evenly`  | Identical gaps between items and at both ends                   |

These rows use fixed-size items, leaving free space for <code>justify-content</code>:

<div class="not-prose my-6 space-y-4 text-sm" role="group" aria-label="Comparison of all six justify-content values on a row">
  <div>
    <div class="mb-2 font-mono font-semibold text-sm">flex-start</div>
    <div class="flex justify-start gap-2 rounded-lg bg-surface p-3 *:rounded *:border *:border-accent/40 *:bg-accent/15 *:px-3 *:py-2 *:text-center">
      <span class="shrink-0">A</span>
      <span class="shrink-0">B</span>
      <span class="shrink-0">C</span>
    </div>
  </div>
  <div>
    <div class="mb-2 font-mono font-semibold text-sm">flex-end</div>
    <div class="flex justify-end gap-2 rounded-lg bg-surface p-3 *:rounded *:border *:border-accent/40 *:bg-accent/15 *:px-3 *:py-2 *:text-center">
      <span class="shrink-0">A</span>
      <span class="shrink-0">B</span>
      <span class="shrink-0">C</span>
    </div>
  </div>
  <div>
    <div class="mb-2 font-mono font-semibold text-sm">center</div>
    <div class="flex justify-center gap-2 rounded-lg bg-surface p-3 *:rounded *:border *:border-accent/40 *:bg-accent/15 *:px-3 *:py-2 *:text-center">
      <span class="shrink-0">A</span>
      <span class="shrink-0">B</span>
      <span class="shrink-0">C</span>
    </div>
  </div>
  <div>
    <div class="mb-2 font-mono font-semibold text-sm">space-between</div>
    <div class="flex justify-between rounded-lg bg-surface p-3 *:rounded *:border *:border-accent/40 *:bg-accent/15 *:px-3 *:py-2 *:text-center">
      <span class="shrink-0">A</span>
      <span class="shrink-0">B</span>
      <span class="shrink-0">C</span>
    </div>
  </div>
  <div>
    <div class="mb-2 font-mono font-semibold text-sm">space-around</div>
    <div class="flex justify-around rounded-lg bg-surface p-3 *:rounded *:border *:border-accent/40 *:bg-accent/15 *:px-3 *:py-2 *:text-center">
      <span class="shrink-0">A</span>
      <span class="shrink-0">B</span>
      <span class="shrink-0">C</span>
    </div>
  </div>
  <div>
    <div class="mb-2 font-mono font-semibold text-sm">space-evenly</div>
    <div class="flex justify-evenly rounded-lg bg-surface p-3 *:rounded *:border *:border-accent/40 *:bg-accent/15 *:px-3 *:py-2 *:text-center">
      <span class="shrink-0">A</span>
      <span class="shrink-0">B</span>
      <span class="shrink-0">C</span>
    </div>
  </div>
</div>

### Cross-axis alignment (`align-items`, `align-self`, `align-content`)

| CSS value       | Container (`align-items`) | Item (`align-self`) | Multi-line (`align-content`) | Result                                                              |
| --------------- | ------------------------- | ------------------- | ---------------------------- | ------------------------------------------------------------------- |
| `stretch`       | `items-stretch` (default) | `self-stretch`      | `content-stretch`            | Stretch to fill line/container cross size when cross size is `auto` |
| `flex-start`    | `items-start`             | `self-start`        | `content-start`              | Pack at cross-start                                                 |
| `flex-end`      | `items-end`               | `self-end`          | `content-end`                | Pack at cross-end                                                   |
| `center`        | `items-center`            | `self-center`       | `content-center`             | Center on cross axis                                                |
| `baseline`      | `items-baseline`          | `self-baseline`     | `content-baseline`           | Align first-line text baselines                                     |
| `space-between` | Not applicable            | Not applicable      | `content-between`            | Distribute wrapped flex lines across spare cross-axis space         |

- `align-self: auto` (`self-auto`) inherits the container's `align-items`.
- `align-content` has **zero effect** on single-line (`nowrap`) containers or when no spare cross-axis space exists.

The first three rows and the baseline example use different text sizes. Stretch leaves item heights automatic:

<div class="not-prose my-6 space-y-4 text-sm" role="group" aria-label="Cross-axis alignment of row items with different text sizes">
  <div>
    <div class="mb-2 font-mono font-semibold text-sm">flex-start</div>
    <div class="flex h-32 items-start gap-2 rounded-lg bg-surface p-3 *:rounded *:border *:border-accent/40 *:bg-accent/15 *:px-3 *:py-2 *:text-center">
      <span class="text-sm">A</span>
      <span class="text-2xl">B</span>
      <span class="text-4xl">C</span>
    </div>
  </div>
  <div>
    <div class="mb-2 font-mono font-semibold text-sm">center</div>
    <div class="flex h-32 items-center gap-2 rounded-lg bg-surface p-3 *:rounded *:border *:border-accent/40 *:bg-accent/15 *:px-3 *:py-2 *:text-center">
      <span class="text-sm">A</span>
      <span class="text-2xl">B</span>
      <span class="text-4xl">C</span>
    </div>
  </div>
  <div>
    <div class="mb-2 font-mono font-semibold text-sm">flex-end</div>
    <div class="flex h-32 items-end gap-2 rounded-lg bg-surface p-3 *:rounded *:border *:border-accent/40 *:bg-accent/15 *:px-3 *:py-2 *:text-center">
      <span class="text-sm">A</span>
      <span class="text-2xl">B</span>
      <span class="text-4xl">C</span>
    </div>
  </div>
  <div>
    <div class="mb-2 font-mono font-semibold text-sm">stretch</div>
    <div class="flex h-32 items-stretch gap-2 rounded-lg bg-surface p-3 *:rounded *:border *:border-accent/40 *:bg-accent/15 *:px-3 *:py-2 *:text-center">
      <span>A</span>
      <span>B</span>
      <span>C</span>
    </div>
  </div>
  <div>
    <div class="mb-2 font-mono font-semibold text-sm">baseline</div>
    <div class="flex h-32 items-baseline gap-2 rounded-lg bg-surface p-3 *:rounded *:border *:border-accent/40 *:bg-accent/15 *:px-3 *:py-2 *:text-center">
      <span class="text-sm">A</span>
      <span class="text-2xl">B</span>
      <span class="text-4xl">C</span>
    </div>
  </div>
</div>

<div class="not-prose my-6 space-y-4 text-sm" role="group" aria-label="An individual item overrides cross-axis alignment">
  <div>
    <div class="mb-2 font-mono font-semibold text-sm">align-items: start · B has align-self: end</div>
    <div class="flex h-32 items-start gap-2 rounded-lg bg-surface p-3 *:rounded *:border *:border-accent/40 *:bg-accent/15 *:px-3 *:py-2 *:text-center">
      <span>A</span>
      <span class="self-end">B</span>
      <span>C</span>
    </div>
  </div>
</div>

With wrapping and a fixed container height, <code>align-content</code> positions the whole lines:

<div class="not-prose my-6 space-y-4 text-sm" role="group" aria-label="Packing two wrapped lines versus distributing lines across the container">
  <div>
    <div class="mb-2 font-mono font-semibold text-sm">align-content: start</div>
    <div class="flex h-48 max-w-64 flex-wrap content-start gap-2 rounded-lg bg-surface p-3 *:rounded *:border *:border-accent/40 *:bg-accent/15 *:px-3 *:py-2 *:text-center">
      <span class="basis-2/5">A</span>
      <span class="basis-2/5">B</span>
      <span class="basis-2/5">C</span>
      <span class="basis-2/5">D</span>
    </div>
  </div>
  <div>
    <div class="mb-2 font-mono font-semibold text-sm">align-content: space-between</div>
    <div class="flex h-48 max-w-64 flex-wrap content-between gap-2 rounded-lg bg-surface p-3 *:rounded *:border *:border-accent/40 *:bg-accent/15 *:px-3 *:py-2 *:text-center">
      <span class="basis-2/5">A</span>
      <span class="basis-2/5">B</span>
      <span class="basis-2/5">C</span>
      <span class="basis-2/5">D</span>
    </div>
  </div>
</div>

### Gaps and `auto` margins

Set inner gutters between items and wrapped lines without outer container spacing:

```css
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem; /* row-gap column-gap */
}
```

- **Tailwind gaps:** `gap-4` (`1rem`), `gap-x-4` (`column-gap`), `gap-y-2` (`row-gap`).
- **Auto margins (`margin-inline-start: auto` / `ms-auto`):** Absorb free main-axis space _before_ `justify-content` runs, pushing sibling groups to opposite ends of a toolbar.

<div class="not-prose my-6 space-y-4 text-sm" role="group" aria-label="Auto margin absorbs remaining space before the last item">
  <div>
    <div class="mb-2 font-mono font-semibold text-sm">gap: 0.5rem · C has margin-inline-start: auto</div>
    <div class="flex items-center gap-2 rounded-lg bg-surface p-3 *:rounded *:border *:border-accent/40 *:bg-accent/15 *:px-3 *:py-2 *:text-center">
      <span>A</span>
      <span>B</span>
      <span class="ms-auto">C</span>
    </div>
  </div>
</div>

## Item sizing: `flex-grow`, `flex-shrink`, and `flex-basis`

Apply sizing properties to **flex items**, not the container:

| Property      | Initial value | Purpose                                                          | Tailwind examples                                |
| ------------- | ------------- | ---------------------------------------------------------------- | ------------------------------------------------ |
| `flex-grow`   | `0`           | Share of **positive free space** added to `flex-basis`           | `grow`, `grow-0`, `grow-2`                       |
| `flex-shrink` | `1`           | Share of **negative overflow** removed, weighted by `flex-basis` | `shrink`, `shrink-0`                             |
| `flex-basis`  | `auto`        | Starting main-axis size before growing or shrinking              | `basis-auto`, `basis-0`, `basis-1/2`, `basis-64` |

- **How `grow` and `shrink` math works:**
  - `flex-grow` divides **spare space**, not total width: two `100px`-basis items with `grow: 1` and `grow: 2` in a `500px` container split the `300px` remainder (`+100px` and `+200px`) into `200px` and `300px`.
  - `flex-shrink` scales by **basis × shrink factor**: `200px` and `100px` bases with `shrink: 1` in a `240px` container (`60px` overflow) lose `40px` (`2/3`) and `20px` (`1/3`), landing at `160px` and `80px`.

The bars show the final proportions of those examples, scaled to the page width. Both calculations assume no gaps, padding, borders, or min/max-size constraints:

<div class="not-prose my-6 space-y-4 text-sm" role="group" aria-label="Final item proportions for the growth and shrinkage calculations">
  <div class="font-mono font-semibold">Growth · 100px + 100px → 200px + 300px</div>
  <div class="flex rounded-lg bg-surface text-center">
    <div class="w-2/5 min-w-0 rounded-s-lg bg-accent/15 p-3">A · 200px<br>grow: 1</div>
    <div class="w-3/5 min-w-0 rounded-e-lg bg-accent/30 p-3">B · 300px<br>grow: 2</div>
  </div>
  <div class="font-mono font-semibold">Shrinkage · 200px + 100px → 160px + 80px</div>
  <div class="flex rounded-lg bg-surface text-center">
    <div class="w-2/3 min-w-0 rounded-s-lg bg-accent/15 p-3">A · 160px<br>−40px</div>
    <div class="w-1/3 min-w-0 rounded-e-lg bg-accent/30 p-3">B · 80px<br>−20px</div>
  </div>
</div>

### `flex` shorthand presets

```css
.item {
  flex: 1 1 0; /* flex-grow flex-shrink flex-basis */
}
```

| CSS shorthand   | Expansion  | Tailwind CSS   | Behavior                                                     |
| --------------- | ---------- | -------------- | ------------------------------------------------------------ |
| `flex: initial` | `0 1 auto` | `flex-initial` | Default: size from width/content; can shrink, won't grow     |
| `flex: auto`    | `1 1 auto` | `flex-auto`    | Grow and shrink starting from intrinsic/declared size        |
| `flex: none`    | `0 0 auto` | `flex-none`    | Rigid: never grow or shrink                                  |
| `flex: 1`       | `1 1 0%`   | `flex-1`       | Ignore intrinsic size; share space equally from a zero basis |

- **`0%` vs `0` basis gotcha:** `flex: 1` expands basis to `0%`, which can resolve differently from unitless `0` (`0px`) when the container's main size is indefinite. Use `flex: 1 1 0` (`flex-[1_1_0]`) when an explicit zero length is required.

### Minimum size (`min-w-0` / `min-h-0`) and visual `order`

- **Automatic minimum size (`min-width: auto` / `min-height: auto`):** Flex items refuse to shrink below their minimum content size by default, causing long unwrapped text or nested scroll areas to overflow. Set `min-width: 0` (`min-w-0`) on row items or `min-height: 0` (`min-h-0`) on column items so they can shrink and truncate/scroll.
- **Visual reordering (`order`):** Lower `order` values render earlier (default `0`; ties follow DOM order; Tailwind `order-1`, `order-none`). **Accessibility caveat:** `order` and `*-reverse` directions change visual layout only—screen readers and `Tab` focus still follow DOM order.

<div class="not-prose my-6 space-y-4 text-sm" role="group" aria-label="Visual order differs from the unchanged source order">
  <div>
    <div class="mb-2 font-mono font-semibold text-sm">Source: A, B, C · visual: B, A, C</div>
    <div class="flex gap-2 rounded-lg bg-surface p-3 *:rounded *:border *:border-accent/40 *:bg-accent/15 *:px-3 *:py-2 *:text-center">
      <span class="order-1">A · 1</span>
      <span class="order-0">B · 0</span>
      <span class="order-2">C · 2</span>
    </div>
  </div>
</div>

## Layout recipes

### Center an element on both axes

Requires a definite height or `min-height` on the container for vertical centering:

```html
<div class="flex min-h-64 items-center justify-center">
  <button type="button">Continue</button>
</div>
```

### Truncating toolbar title with pinned end action

`min-w-0 flex-1 truncate` lets the title shrink below its text length while `shrink-0` protects the button width:

```html
<div class="flex items-center gap-4">
  <span class="min-w-0 flex-1 truncate">A potentially long document title</span>
  <button class="shrink-0" type="button">Save</button>
</div>
```

### Responsive wrapping cards

Stack vertically on mobile and wrap with a `16rem` basis from `sm` upward:

```html
<div class="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
  <article class="min-w-0 sm:flex-[1_1_16rem]">First card</article>
  <article class="min-w-0 sm:flex-[1_1_16rem]">Second card</article>
  <article class="min-w-0 sm:flex-[1_1_16rem]">Third card</article>
</div>
```

### Fixed-height panel with scrollable body

Give the panel a constrained height and put `min-height: 0` on the scrolling flex child:

```css
.panel {
  display: flex;
  flex-direction: column;
  height: 24rem;
}

.panel-header {
  flex: none;
}

.panel-body {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
}
```

## Troubleshooting

| Symptom                                                        | Cause and fix                                                                                                                                             |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `justify-content` or `align-items` does nothing                | No free space remains on that axis (consumed by `flex-grow`, `auto` margins, or unconstrained container height)                                           |
| Items overflow in a single line instead of wrapping            | Add `flex-wrap: wrap` (`flex-wrap`) and ensure the container's main size is constrained                                                                   |
| Long text or nested code block blows out a `flex-1` item       | Add `min-width: 0` (`min-w-0`) on the flex item so it can shrink past its intrinsic content width                                                         |
| Scrollable column body expands the parent instead of scrolling | Constrain the container height (`height` / `max-height`) and add `min-height: 0` (`min-h-0`) to the scrolling child                                       |
| Item with explicit `width` still shrinks                       | `width` sets the starting size when `flex-basis: auto`, but `flex-shrink: 1` remains active—add `flex-shrink: 0` (`shrink-0`)                             |
| Items on the last wrapped row stretch wider than earlier rows  | Each flex line distributes space independently; switch to [Grid layout](/docs/cheatsheets/web-development/css/grid-layout/) for aligned multi-row columns |
| `align-content` has no effect                                  | Only applies when `flex-wrap` is `wrap`/`wrap-reverse` and spare cross-axis space exists                                                                  |

## References

- [MDN: Flexbox introduction](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Flexbox)
- [MDN: Basic concepts of Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Basic_concepts)
- [MDN: Controlling flex item ratios](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Controlling_flex_item_ratios)
- [MDN: `flex` shorthand](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/flex)
- [MDN: `flex-basis`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/flex-basis)
- [W3C CSS Flexible Box Layout Level 1 Specification](https://www.w3.org/TR/css-flexbox-1/)
- [Tailwind CSS: `flex`](https://tailwindcss.com/docs/flex), [`flex-direction`](https://tailwindcss.com/docs/flex-direction), [`flex-wrap`](https://tailwindcss.com/docs/flex-wrap), [`justify-content`](https://tailwindcss.com/docs/justify-content), [`align-items`](https://tailwindcss.com/docs/align-items), [`gap`](https://tailwindcss.com/docs/gap)
