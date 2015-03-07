# API

## Tooltip(content, [options]);


### content

Type: `String|Element`

Tooltip content. Can be a text, an HTML string, or a DOM element. Will be used as `innerHTML` when a string, and `.appendChild()` when an element.

If you are inserting image elements, they need to have their dimensions defined (either with `width` & `height` attributes, or in CSS), otherwise the Tooltip will work with dimensions before the image load. You can also bind a load event to the image, and when it triggers call `.updateSize()` method.

### [options]

Type: `Object`

Tooltip options object. Default options are stored in `Tooltip.defaults`.

```js
Tooltip.defaults = {
	baseClass:   'tooltip', // Base Tooltip class name.
	typeClass:   null,      // Type Tooltip class name.
	effectClass: null,      // Effect Tooltip class name.
	inClass:     'in',      // Class used to transition stuff in.
	place:       'top',     // Default place.
	spacing:     null,      // Gap between target and Tooltip.
	auto:        0          // Whether to automatically adjust place to fit into window.
};
```

##### baseClass

Type `String` Default `tooltip`

Base Tooltip class that will be applied to Tooltip element upon creation. This class should define Tooltip's layout & dimensions, and shouldn't be changed.

##### typeClass

Type `String` Default `null`

Tooltip's type class that will be applied to Tooltip element upon creation. This class should define only visual changes that don't affect layout & dimensions.

Can be changed dynamically with `#type()` method.

##### effectClass

Type `String` Default `null`

Tooltip's effect class that will be applied to Tooltip element upon creation. This class - in a correlation with **inClass** - should define only Tooltip transitions. Example fade transition:

```css
.tooltip.fade { opacity: 0; transition: opacity 200ms ease-out; }
.tooltip.fade.in { opacity: 1; transition-duration: 100ms; }
```

Can be changed dynamically with `#effect()` method.

##### inClass

Type `String` Default `in`

Tooltip's class for "transitioning in" state. It is applied to Tooltip when it is being shown. This class doesn't have to declare anything, it functions mostly as a helper selector for effect classes.

##### place

Type `String` Default `top`

This options specifies Tooltip's growth direction. Tooltip supports this places:

- `top`, `top-left`, `top right`
- `bottom`, `bottom-left`, `bottom-right`
- `left`, `left-top`, `left-bottom`
- `right`, `right-top`, `right-bottom`

##### spacing

Type `Integer` Default `null`

Defines the gap between Tooltip and target position, used mainly to properly display Tooltip arrow. This gap is defined with a `top` property in Tooltip's base class:

```css
.tooltip {
	top: 10px; /* Defines the spacing between Tooltip and target position */
}
```

But can be overridden with this option.

##### auto

Type `Boolean` Default `false`

When set to `true`, Tooltip will check whether the current requested place is possible to display within window borders, and if not, it'll try to pick a better one.

Unless stated otherwise, all methods return Tooltip object, making them chainable.

## #content(content)

Change Tooltip's content. If Tooltip is visible, it'll automatically readjust it's dimensions and position.

- **content** `String|Element` Can be a text, escaped HTML string, or DOM element.

## #position(x, y)

Position the Tooltip on a specific coordinates.

## #position(element)

Position the Tooltip while using an element as position target.

## #show([element / x, y])

Show the Tooltip, and optionally position it. When arguments are present, they are directly relayed to `#position()` method.

## #hide()

Hide Tooltip.

## #toggle()

Hide when shown, show when hidden.

## #attach(element)

Attach Tooltip to DOM element. When Tooltip is attached, `#position()` arguments are ignored and attached element is always used as a Tooltip target position. When attached Tooltip is visible, it is automatically repositioned on window resize.

## #detach()

Detach Tooltip from element.

## #type(name)

Change type class. Pass falsy or no value to remove type class.

## #effect(name)

Change effect class. Pass falsy or no value to remove effect class.

## #changeClassType(type, name)

The underlying method wrapped by `#type()` & `#effect()`. For example, the `#type()` method is basically just a:

```js
Tooltip.prototype.type = function (name) {
	return this.changeClassType('type', name);
};
```

You can use this to create your own class types.

## #place(name)

Change the Tooltip place. When Tooltip is visible, it is automatically repositioned to the requested place.

Supported places are:

- `top`, `top-left`, `top-right`
- `bottom`, `bottom-left`, `bottom-right`
- `left`, `left-top`, `left-bottom`
- `right`, `right-top`, `right-bottom`

## #updateSize()

Updates `#width` & `#height` properties to be in sync with the actual size of a Tooltip element. It's run on Tooltip creation and automatically on `#content()` changes.

You'd want to use this when you are inserting a DOM element as a Tooltip content, and than manipulating this element from outside without re-applying it via `#content()`. Whenever some layout change happens to that element, `#updateSize()` should be called.

In other words, if you change the Tooltip content without using `#content()`, call this afterwards.

## #element

Tooltip element. This element is detached from DOM when Tooltip is hidden.

## #classes

A [`component/classes`](https://github.com/component/classes) object handling Tooltip element classes. You can do:

```js
tip.classes.add('foo');
tip.classes.remove('foo');
tip.classes.toggle('foo');
tip.classes.has('foo');
tip.classes.array(); // returns an array of all current classes
```

## #hidden

Type `Boolean`

True when Tooltip is hidden, false otherwise.

## #options

Tooltip options object.

## #spacing

Type `Integer`

Tooltip spacing - the additional gap between Tooltip and it's target position. It is used to create a gap between Tooltip and its target position so the Tooltip arrow would not overlap the target. This value is a mirror of `#options.spacing` when defined, or retrieved from `baseClass`'s `top` style otherwise. For example, to have a 10px gap between Tooltip and its target:

```css
.tooltip {
	top: 10px;
}
```

You can also set it manually in options:

```js
var tip = new Tooltip('foo', { spacing: 10 });
tip.show();
```

The purpose of the `.tooltip:top` weirdness is to have all layout declarations in CSS and out of JavaScript. As the arrow size is declared 100% in CSS, so should be the gap needed for its proper display.

## #width

Width of Tooltip element. Updated by `#updateSize()` method.

## #height

Height of Tooltip element. Updated by `#updateSize()` method.

## #attachedTo

Element the Tooltip is attached to, otherwise `null`.