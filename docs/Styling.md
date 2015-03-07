# Styling

Every tooltip's layout (what defines tooltip's margins, paddings, and overall dimensions) should be defined in `baseClass`.

Arrow is styled with `:after` pseudo element.

The gap between tooltip and its target position (so arrow won't overlap the target) is defined as a `top` property of `baseClass`, but can be overridden with `#options.spacing` property.

The `baseClass` with minimum required styles will than look like this:

```css
.tooltip {
	position: absolute;
	padding: .8em 1em;
	top: 15px; /* Defines the spacing between tooltip and target position */
	max-width: 200px;
	color: #fff;
	background: #222;
}
```

## Place classes

The current place is always attached to a tooltip as a class name. For example, when current tooltip place is `left-top`, the tooltip element will have a `left-top` class.

## Type class

Type class should define only visual/color changes from the `baseClass`. This is what you'd use for states like `success`, `error`, ...

## In class

The `inClass` doesn't have to be styled at all. It is used mainly as a "transitioning in" state selector for effect classes.

## Effect class

The `effectClass` is attached to a tooltip at all times, and transitions are styled based on a presence of `inClass`.

Example fade transition:

```css
.tooltip.fade { opacity: 0; transition: opacity 200ms ease-out; }
.tooltip.fade.in { opacity: 1; transition-duration: 100ms; }
```

When Tooltip is hiding the tip, it detects the presence of `transition-duration` and delays the tooltip DOM removal until the transition is over.

Some transitions, like slide in, are dependent on toooltip position, in which case you'll leverage the place classes.

Example slide transition class:

```css
.tooltip.slide {
	opacity: 0;
	transition: -webkit-transform 200ms ease-out;
	transition: transform 200ms ease-out;
	transition-property: -webkit-transform, opacity;
	transition-property: transform, opacity;
}
.tooltip.slide.top,
.tooltip.slide.top-left,
.tooltip.slide.top-right {
	-webkit-transform: translateY(15px);
	transform: translateY(15px);
}
.tooltip.slide.bottom,
.tooltip.slide.bottom-left,
.tooltip.slide.bottom-right {
	-webkit-transform: translateY(-15px);
	transform: translateY(-15px);
}
.tooltip.slide.left,
.tooltip.slide.left-top,
.tooltip.slide.left-bottom {
	-webkit-transform: translateX(15px);
	transform: translateX(15px);
}
.tooltip.slide.right,
.tooltip.slide.right-top,
.tooltip.slide.right-bottom {
	-webkit-transform: translateX(-15px);
	transform: translateX(-15px);
}
.tooltip.slide.in {
	opacity: 1;
	-webkit-transform: none;
	transform: none;
	transition-duration: 100ms;
}
```

## Custom class types

You can define custom class types by pushing their names into a `Tooltip.classTypes` array. By default this array looks like this:

```js
Tooltip.classTypes = ['type', 'effect'];
```

It specifies the dynamic class types, that's why `base` & `in` are not in it, as those are core classes used for other purposes.

To add a new dynamic class type `state`, you can do:

```js
Tooltip.classTypes.push('state');
```

You can than define this class in options like so:

```js
var tip = new Tip('Foo bar', {
	stateClass: 'not-good'
})
```

And use in runtime:

```js
tip.changeClassType('state', 'bit-better');
```

Or you can extend `Tooltip` and define a `.state()` method:

```js
Tooltip.prototype.state = function (name) {
	return this.changeClassType('state', name);
};
```