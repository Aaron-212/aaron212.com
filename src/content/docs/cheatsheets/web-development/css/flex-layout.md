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

  ```text
  row:                         column:
  main axis →                  cross axis →
  [ A ][ B ][ C ]               [ A ]
  cross axis ↓                  [ B ]
                                [ C ]
                               main axis ↓
  ```

  `row` follows the **inline** writing direction (flips in RTL); `column` follows the **block** direction.

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
