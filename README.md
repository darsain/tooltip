# [Tooltip](http://darsa.in/tooltip)

JavaScript library for basic tooltip implementation.

Tooltip doesn't provide bindings to user interaction (like displaying on hover). It is designed to be consumed by
wrappers like [`darsain/tooltips`](https://github.com/darsain/tooltips), form validation libraries, etc.

Supports typed classes, and effects via seamless CSS transitions (you don't have to define transition durations in JavaScript).

#### Support

Starts at IE8, but Tooltip arrows are styled for IE9+. If you care, just restyle the
`.tooltip:after` arrow with IE8 in mind.

Other browsers just work.

## Install

[Component](https://github.com/component/component):

```bash
component install darsain/tooltip
```

## Download

Standalone build of a latest stable version:

- [`tooltip.zip`](http://darsain.github.io/tooltip/dist/tooltip.zip) - combined archive
- [`tooltip.js`](http://darsain.github.io/tooltip/dist/tooltip.js) - 25 KB *sourcemapped*
- [`tooltip.min.js`](http://darsain.github.io/tooltip/dist/tooltip.min.js) - 10 KB, 2KB gzipped
- [`tooltip.css`](http://darsain.github.io/tooltip/dist/tooltip.css) - 4.5 KB *including transitions & types*

When isolating issues on jsfiddle, use the [`tooltip.js`](http://darsain.github.io/tooltip/dist/tooltip.js) URL above.

## Documentation

Can be found in the **[docs](docs)** directory.

## License

MIT