---
title: "Grid layout"
---

Two-dimensional CSS Grid layout reference for defining row and column tracks, placing items across lines and areas, auto-fitting responsive grids, and aligning subgrids, with Tailwind CSS equivalents.

## Container setup and grid anatomy

Set `display: grid` (`grid`) or `display: inline-grid` (`inline-grid`) on a parent to turn its direct normal-flow children into **grid items** (pair with [Flex layout](/docs/cheatsheets/web-development/css/flex-layout/) for one-dimensional toolbars inside grid cells):

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}
```

Tailwind equivalent: `grid grid-cols-3 gap-4`.

### Lines, tracks, cells, and areas

```text
column lines: 1       2       3       4
             +-------+-------+-------+  row line 1
             |   A   |   B   |   C   |
             +-------+-------+-------+  row line 2
             |   D   |   E   |   F   |
             +-------+-------+-------+  row line 3
```

- **Line:** 1-based boundary between tracks (`N` tracks have `N + 1` lines; negative numbers count back from the end of the **explicit** grid).
- **Track:** One row or column between two adjacent lines.
- **Cell:** Single intersection of one row and one column.
- **Area:** Rectangular region spanning one or more cells.

## Track sizing, `fr`, `minmax()`, and `auto-fit`

### Explicit track templates

| CSS                                                | Tailwind CSS                          | Result                                                          |
| -------------------------------------------------- | ------------------------------------- | --------------------------------------------------------------- |
| `grid-template-columns: repeat(3, minmax(0, 1fr))` | `grid-cols-3`                         | Three equal columns that can shrink to `0`                      |
| `grid-template-columns: 16rem minmax(0, 1fr)`      | `grid-cols-[16rem_minmax(0,1fr)]`     | Fixed `16rem` sidebar + flexible main column                    |
| `grid-template-rows: repeat(2, minmax(0, 1fr))`    | `grid-rows-2`                         | Two equal flexible rows (requires constrained container height) |
| `grid-template-rows: auto minmax(0, 1fr) auto`     | `grid-rows-[auto_minmax(0,1fr)_auto]` | Content-sized header/footer + flexible middle row               |

- **How `fr` distributes space:** Subtracts fixed tracks and `gap` gutters first, then divides the remaining space proportionally (`200px 1fr 2fr` in a `900px` grid with two `20px` gaps leaves `660px`, giving `220px` and `440px`).

### Intrinsic track sizes and `minmax(0, 1fr)`

| Track size           | Behavior                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| `auto`               | Sizes to content and stretches when content alignment distributes extra space                     |
| `min-content`        | Narrowest width possible taking all soft-wrap opportunities                                       |
| `max-content`        | Full intrinsic width with no soft wrapping                                                        |
| `minmax(12rem, 1fr)` | At least `12rem`, expanding into remaining free space (`fr` is invalid as the _minimum_ argument) |
| `minmax(0, 1fr)`     | Overrides bare `1fr`'s `auto` minimum so long content cannot force the track wider than its share |

### Responsive columns without breakpoints (`auto-fit` vs `auto-fill`)

Create a responsive card grid that wraps automatically and never overflows narrow viewports:

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: 1rem;
}
```

Tailwind equivalent: `grid grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-4`.

- **`auto-fill` vs `auto-fit`:** When fewer items exist than fit on one row, `auto-fill` preserves empty column tracks at their minimum size; `auto-fit` collapses empty tracks to `0px` so occupied `1fr` tracks expand to fill the row.
- **`min(100%, 16rem)`:** Prevents horizontal overflow when the container itself is narrower than `16rem`.

## Item placement: lines, spans, named lines, and areas

### Line numbers and spans

Place items across grid lines (end lines are exclusive boundary numbers):

```css
.featured {
  grid-column: 1 / 3; /* Column lines 1 to 3 (2 columns wide) */
  grid-row: 1 / span 2; /* Start at row line 1, span 2 rows */
}
```

| CSS                            | Tailwind CSS    | Result                                                         |
| ------------------------------ | --------------- | -------------------------------------------------------------- |
| `grid-column: span 2 / span 2` | `col-span-2`    | Span 2 columns from auto-placed position                       |
| `grid-column-start: 2`         | `col-start-2`   | Start at column line 2                                         |
| `grid-column-end: 4`           | `col-end-4`     | End at column line 4                                           |
| `grid-column: 1 / -1`          | `col-span-full` | Span all **explicit** columns (`-1` ignores implicit columns!) |
| `grid-row: span 2 / span 2`    | `row-span-2`    | Span 2 rows                                                    |

- **Overlapping items:** Multiple items placed in the same cell(s) stack on top of each other; control stacking order with `z-index`.

### Named lines and `grid-template-areas`

Name lines in brackets (`[sidebar-start] 16rem [content-start] minmax(0, 1fr) [content-end]`) or draw rectangular area maps with `grid-template-areas` (use `.` for an empty cell):

```css
.page {
  display: grid;
  grid-template-columns: 16rem minmax(0, 1fr);
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  gap: 1rem;
}

.header {
  grid-area: header;
}
.sidebar {
  grid-area: sidebar;
}
.main {
  grid-area: main;
}
.footer {
  grid-area: footer;
}
```

- **Strict area syntax rules:** Every row string must have the exact same number of cell tokens, and every named area must form a single valid rectangle (L-shaped or disconnected areas invalidate the entire property).

## Implicit grids and `grid-auto-flow`

When items overflow the explicit grid, the browser generates **implicit tracks** sized by `grid-auto-rows` (`auto-rows-*`) and `grid-auto-columns` (`auto-cols-*`):

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: minmax(8rem, auto);
}
```

| CSS                            | Tailwind CSS          | Behavior                                                                   |
| ------------------------------ | --------------------- | -------------------------------------------------------------------------- |
| `grid-auto-flow: row`          | `grid-flow-row`       | Fill row by row, adding implicit rows as needed (default)                  |
| `grid-auto-flow: column`       | `grid-flow-col`       | Fill column by column (define `grid-template-rows` to bound column height) |
| `grid-auto-flow: row dense`    | `grid-flow-row-dense` | Backfill earlier empty cells when smaller items appear later               |
| `grid-auto-flow: column dense` | `grid-flow-col-dense` | Fill columns and backfill earlier gaps                                     |

- **Accessibility and masonry caveat:** `dense` flow and explicit line placement reorder items visually without changing DOM tab/reading order, and `dense` still snaps items to rigid row tracks (it is not CSS masonry).

## Box alignment and `subgrid`

Grid aligns along the **inline** (row) and **block** (column) axes:

| Property          | Target                               | Axis   | Shorthand                              | Tailwind examples                           |
| ----------------- | ------------------------------------ | ------ | -------------------------------------- | ------------------------------------------- |
| `justify-items`   | All items inside their grid areas    | Inline | `place-items` (`align` then `justify`) | `justify-items-start`, `place-items-center` |
| `align-items`     | All items inside their grid areas    | Block  | `place-items`                          | `items-start`, `items-center`               |
| `justify-self`    | Single item inside its grid area     | Inline | `place-self`                           | `justify-self-end`, `place-self-center`     |
| `align-self`      | Single item inside its grid area     | Block  | `place-self`                           | `self-end`                                  |
| `justify-content` | All tracks inside the grid container | Inline | `place-content`                        | `justify-center`, `justify-between`         |
| `align-content`   | All tracks inside the grid container | Block  | `place-content`                        | `content-center`, `content-between`         |

### Share parent tracks across nested elements with `subgrid`

Adopt the parent grid's spanned tracks (`grid-cols-subgrid` or `grid-rows-subgrid`) so nested children align with outer columns or rows:

```html
<div class="grid grid-cols-3 gap-4">
  <section class="col-span-3 grid grid-cols-subgrid">
    <h2 class="col-span-full">Account</h2>
    <div>Name</div>
    <div>Email</div>
    <div>Status</div>
  </section>
</div>
```

- A subgrid inherits the parent's `gap` on the subgridded axis unless you override `gap` on the subgrid element.

## Layout recipes

### Breakpoint-driven responsive cards and sidebar

```html
<!-- 1 → 2 → 3 columns across breakpoints -->
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <article class="min-w-0">First card</article>
  <article class="min-w-0">Second card</article>
  <article class="min-w-0">Third card</article>
</div>

<!-- Stacked mobile layout → 16rem sidebar on md+ -->
<div class="grid grid-cols-1 gap-4 md:grid-cols-[16rem_minmax(0,1fr)]">
  <aside>Navigation</aside>
  <main class="min-w-0">Main content</main>
</div>
```

### App shell with sticky header/footer and scrollable main area

```css
.app {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  height: 100dvh;
}

.app-main {
  min-height: 0;
  overflow-y: auto;
}
```

## Troubleshooting

| Symptom                                                                  | Cause and fix                                                                                                                            |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| A `1fr` column expands past its share when holding `<pre>` or long text  | Replace bare `1fr` with `minmax(0, 1fr)` (Tailwind `grid-cols-*` does this) and add `min-w-0` to the item                                |
| Percentage columns (`50% 50%`) overflow horizontally when `gap` is added | Percentages ignore `gap` gutters; replace percentages with `1fr` tracks                                                                  |
| `col-span-full` (`1 / -1`) stops short of rightmost columns              | `-1` targets the end of the **explicit** grid; define explicit columns instead of relying on implicit ones                               |
| `grid-template-areas` declaration is completely ignored                  | Check that every row string has the exact same column count and every named region is rectangular                                        |
| `justify-content` / `align-content` has no visible effect                | `fr` tracks already consumed all container space; size tracks smaller than the container if distributing tracks                          |
| Middle `1fr` row pushes footer off-screen instead of scrolling           | Set a definite height (`100dvh`) on the grid container, use `minmax(0, 1fr)` for the row, and set `min-height: 0` on the scrolling child |
| Card titles/footers inside adjacent cards don't align horizontally       | Make each card span the rows and use `grid-rows-subgrid` on the cards                                                                    |

## References

- [MDN: CSS Grid layout introduction](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Grids)
- [MDN: Basic concepts of Grid layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Basic_concepts)
- [MDN: Grid template areas](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Grid_template_areas)
- [MDN: Box alignment in Grid layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Box_alignment)
- [MDN: Subgrid](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Subgrid)
- [MDN: `minmax()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/minmax) and [`repeat()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/repeat)
- [Tailwind CSS: `grid-template-columns`](https://tailwindcss.com/docs/grid-template-columns), [`grid-column`](https://tailwindcss.com/docs/grid-column), [`grid-auto-flow`](https://tailwindcss.com/docs/grid-auto-flow), [`place-items`](https://tailwindcss.com/docs/place-items)
