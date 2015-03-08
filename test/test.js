var Tooltip = require('tooltip');
var $ = require('jquery');

// Movable test
(function () {
	var target = document.querySelector('.target.movable');
	var tip = window.tip = new Tooltip('Move the element toward window endges to test the automatic positioning.', { auto: 1 });
	var dragger = new DragAndReset(target);

	tip.attach(target).show();

	dragger.onMove = function reposition() {
		tip.position();
	};

	// Button actions
	$(document).on('mousedown', '[data-action]', function () {
		var action = $(this).data('action');
		var arg = $(this).data('arg');
		tip[action](arg);
	});
}());

// Focusable test
(function () {
	var $target = $('.focusable').eq(0);
	var tip = new Tooltip('', { place: 'right', typeClass: '', effectClass: 'slide' }).attach($target[0]);
	var toEnter = 'foo';
	var value, correct;

	function check() {
		value = $target.val();
		correct = value === toEnter;
		if (!value.length) {
			tip.content('Write "' + toEnter + '"');
			tip.type('');
			return;
		}
		tip.type(correct ? 'success' : 'error').content(correct ? 'Correct!' : 'Wrong!');
	}

	$target.on('focus blur', function (event) {
		if (event.type === 'blur' && !correct && value.length > 0) {
			return;
		}
		tip[event.type === 'focus' ? 'show' : 'hide']();
	});

	$target.on('keyup', check);

	check();
}());

// Helpers
var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) {
	return setTimeout(callback, 17);
};
var getProp = window.getComputedStyle ? function getProp(element, name) {
	return window.getComputedStyle(element, null)[name];
} : function getProp(element, name) {
	return element.currentStyle[name];
};
function parsePx(value) {
	return 0 | Math.round(String(value).replace(/[^\-0-9.]/g, ''));
}

/**
 * Dragging class
 *
 * @param {Element} element
 */
function DragAndReset(element) {
	if (!(this instanceof DragAndReset)) {
		return new DragAndReset(element);
	}

	var self = this;
	var $document = $(document);
	var frameID = 0;
	self.element = element;
	self.initialized = 0;
	self.path = {
		left: 0,
		top: 0
	};

	function move(event) {
		self.path.left = event.pageX - self.origin.left;
		self.path.top = event.pageY - self.origin.top;
		if (!self.initialized && (Math.abs(self.path.left) > 10 || Math.abs(self.path.top) > 10)) {
			self.initialized = 1;
		}
		if (self.initialized) {
			requestReposition();
		}
		return false;
	}

	function requestReposition() {
		if (!frameID) {
			frameID = rAF(reposition);
		}
	}

	function reposition() {
		frameID = 0;
		element.style.left = (self.originPos.left + self.path.left) + 'px';
		element.style.top = (self.originPos.top + self.path.top) + 'px';
		if (self.onMove) {
			self.onMove();
		}
	}

	function init(event) {
		self.origin = {
			left: event.pageX,
			top: event.pageY
		};
		self.originPos = {
			left: parsePx(getProp(element, 'left')),
			top: parsePx(getProp(element, 'top'))
		};
		$document.on('mousemove', move);
		$document.on('mouseup', self.end);
		return false;
	}

	self.end = function () {
		self.initialized = 0;
		self.path.top = self.path.left = 0;
		requestReposition();
		$document.off('mousemove', move);
		$document.off('mouseup', self.end);
	};

	(function () {
		$(element).on('mousedown', init);
	}());
}