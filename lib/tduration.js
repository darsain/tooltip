var style = require('computed-style');

/**
 * Returns transition duration of an element in ms.
 *
 * @param {Element} element
 *
 * @return {Int}
 */
module.exports = function transitionDuration(element) {
	var computed = style(element);
	var duration = String(computed.transitionDuration || computed.webkitTransitionDuration);
	var match = duration.match(/([0-9.]+)([ms]{1,2})/);
	if (match) {
		duration = Number(match[1]);
		if (match[2] === 's') duration *= 1000;
	}
	return duration | 0;
};