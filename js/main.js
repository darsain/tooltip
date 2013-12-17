/*global Tooltip */
'use strict';

var $ = jQuery;

// Movable test
(function () {
	var target = document.querySelector('.target.movable');
	var tip = window.tip = new Tooltip('Move me toward edges!', {
		auto: 1,
		typeClass: 'light',
		effectClass: 'slide'
	});
	var dragger = new DragAndReset(target);

	tip.attachTo(target).show();

	dragger.onMove = function reposition() {
		tip.position();
	};

	// Button actions
	$(document).on('mousedown', '[data-action]', function () {
		var $el = $(this);
		var action = $el.data('action');
		var arg = $el.data('arg');
		tip[action](arg);
		$('[data-action=' + action + ']').removeClass('active');
		$el.addClass('active');
	});
}());

// Focusable test
(function () {
	var $target = $('.focusable').eq(0);
	var toEnter = 'foo';
	var tip = new Tooltip('Write "' + toEnter + '"', {
		place: 'right',
		typeClass: 'light',
		effectClass: 'slide'
	}).attachTo($target[0]);
	var value = '';
	var correct;

	function check() {
		value = $target.val();
		correct = value === toEnter;
		if (!value.length) {
			tip.content('Write "' + toEnter + '"');
			tip.type('light');
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