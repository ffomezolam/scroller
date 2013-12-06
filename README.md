scroller
=======

A module for handling and reporting scroll events on DOM elements.

This module is self-contained and requires no dependencies, though I haven't tested the event handling on old Internet Explorer yet.

API
---

### Constructor
`Scroller(e)` Passed a DOM element
### Static

- `scroll.x(e, px)` Get or set X scroll of element `e`.
- `scroll.y(e, px)` Get or set Y scroll of element `e`.

### Instance

- `capture(callback)` Capture scroll events
- `release()` Release all scroll events
- `x(px)` Set or get X scroll
- `y(px)` Set or get Y scroll
