/*! LazyLoad and ViewPort Checker */
(function(root, factory) {
	// AMD
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return factory(root);
		});
	} else if (typeof exports === 'object') {
		// Node.js or CommonJS
		module.exports = factory;
	} else {
		// Browser globals
		root.emergence = factory(root);
	}
})(this, function(root) {

	'use strict';

	var emergence = {};
	var poll, container, throttle, handheld, elemCushion, offsetTop, offsetRight, offsetBottom, offsetLeft;
	var callback = function() {};

	// Browser feature test to include any browser APIs required for >= IE8
	// @return {bool} true if supported, otherwise false
	var cutsTheMustard = function() {
		return 'querySelectorAll' in document ? true : false;
	};

	// Checks if user is on a handheld
	// @return {bool} true if it's a handheld, otherwise false
	var isHandheld = function() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|playbook|silk/i.test(
			navigator.userAgent
		);
	};

	// Get the offset of a DOM Element
	// @param {DOMElement} elem the container or element
	// @return {int} the top, left, width and height values in pixels
	var getElemOffset = function(elem) {

		// Width and height of container or element
		var w = elem.offsetWidth;
		var h = elem.offsetHeight;

		// Default top and left position of container or element
		var topPos = 0;
		var leftPos = 0;

		// Get total distance of container or element to document's top and left origin
		do {
			if (!isNaN(elem.offsetTop)) {
				topPos += elem.offsetTop;
			}
			if (!isNaN(elem.offsetLeft)) {
				leftPos += elem.offsetLeft;
			}
		} while ((elem = elem.offsetParent) !== null);

		// Return dimensions and position
		return {
			width: w,
			height: h,
			top: topPos,
			left: leftPos
		};
	};

	// Get the custom container size if provided, otherwise the documents
	// @return {int} the width and height in pixels
	var getContainerSize = function(container) {
		var w, h;

		// If custom container is provided in options
		// Else use window or document
		if (container !== window) {
			w = container.clientWidth;
			h = container.clientHeight;
		} else {
			w = window.innerWidth  || document.documentElement.clientWidth;
			h = window.innerHeight || document.documentElement.clientHeight;
		}

		return {
			width: w,
			height: h
		};
	};

	// Get the X and Y scroll positions
	// @return {int} the X and Y values in pixels
	var getContainerScroll = function(container) {

		// If custom container is provided in options
		// Else use window or document
		if (container !== window) {
			return {
				x: container.scrollLeft + getElemOffset(container).left,
				y: container.scrollTop + getElemOffset(container).top
			};
		} else {
			return {
				x: window.pageXOffset || document.documentElement.scrollLeft,
				y: window.pageYOffset || document.documentElement.scrollTop
			};
		}
	};

	// Check if element's closest parent is hidden (display: none)
	// @param {DOMElement} elem the element
	// @return {bool} true if hidden, false otherwise
	var isHidden = function(elem) {
		return elem.offsetParent === null;
	};

	// Check if element is visible
	// @param {DOMElement} elem the element
	var isVisible = function(elem) {

		// Discontinue if element's closest parent is hidden
		if (isHidden(elem)) {
			return false;
		}

		// Get information from element and container
		var elemOffset      = getElemOffset(elem);
		var containerSize   = getContainerSize(container);
		var containerScroll = getContainerScroll(container);

		// Determine element size
		var elemWidth  = elemOffset.width;
		var elemHeight = elemOffset.height;

		// Determine element position from rect points
		var elemTop    = elemOffset.top;
		var elemLeft   = elemOffset.left;
		var elemBottom = elemTop + elemHeight;
		var elemRight  = elemLeft + elemWidth;

		// Determine boundaries of container and element
		// @return {bool} true if element is found within boundaries, otherwise false
		var checkBoundaries = function() {

			// Determine element boundaries including custom cushion
			var eTop    = elemTop + elemHeight * elemCushion;
			//var eRight  = elemRight - elemWidth * elemCushion;
			var eBottom = elemBottom - elemHeight * elemCushion;
			//var eLeft   = elemLeft + elemWidth * elemCushion;

			// Determine container boundaries including custom offset
			var cTop    = containerScroll.y + offsetTop;
			//var cRight  = containerScroll.x - offsetRight + containerSize.width;
			var cBottom = containerScroll.y - offsetBottom + containerSize.height;
			//var cLeft   = containerScroll.x + offsetLeft;

			// return (eTop < cBottom && eBottom > cTop && eLeft < cRight && eRight > cLeft);
			return (eTop < cBottom && eBottom > cTop );
		};

		return checkBoundaries();
	};

	// Engage emergence through a throttling method for performance
	var emergenceThrottle = function() {
		if (!!poll) {
			return;
		}
		clearTimeout(poll);
		poll = setTimeout(function() {
			emergence.engage();
			poll = null;
		}, throttle);
	};

	// Initialize emergence with options, do feature test and create event listeners
	// @param {Object} options Custom settings
	emergence.init = function(options) {
		options = options || {};

		// Function to return an integer
		var optionInt = function(option, fallback) {
			return parseInt(option || fallback, 10);
		};

		// Function to return a floating point number
		var optionFloat = function(option, fallback) {
			return parseFloat(option || fallback);
		};

		// Default options
		container    = options.container || window;  // window or document by default
		handheld     = typeof options.handheld !== 'undefined' ? options.handheld : true; // true by default
		throttle     = optionInt(options.throttle, 250);        // 250 by default
		elemCushion  = optionFloat(options.elemCushion, 0.1);   // 0.15 by default
		offsetTop    = optionInt(options.offsetTop, 0);         // 0 by default
		offsetRight  = optionInt(options.offsetRight, 0);       // 0 by default
		offsetBottom = optionInt(options.offsetBottom, 0);      // 0 by default
		offsetLeft   = optionInt(options.offsetLeft, 0);        // 0 by default
		callback     = options.callback || callback;

		// If browser doesn't pass feature test
		if (!cutsTheMustard()) {

			// Provide message in console.log
			console.log('Emergence.js is not supported in this browser.');

		}
		// If this is handheld device AND handheld option is true
		// OR not a handheld device
		else if ((isHandheld() && handheld) || !isHandheld()) {

			// Add '.emergence' class to document for conditional CSS
			// document.documentElement.className += ' emergence'; // No usage for this now // TieLabs

			// If browser supports addEventListener
			// Else use attachEvent
			if (window.addEventListener) {

				// Add event listeners for load, scroll and resize events
				window.addEventListener('load', emergenceThrottle, false);
				container.addEventListener('scroll', emergenceThrottle, false);
				container.addEventListener('resize', emergenceThrottle, false);

			} else {

				// Attach events for legacy load method, scroll and resize events
				document.attachEvent('onreadystatechange', function() {
						if (document.readyState === 'complete') { emergenceThrottle(); }
				});
				container.attachEvent('onscroll', emergenceThrottle);
				container.attachEvent('onresize', emergenceThrottle);

			}
		}
	};

	// Engage emergence
	emergence.engage = function() {

		if( tie.lazyload ){ // to be added

			// Images ------
			if ('loading' in HTMLImageElement.prototype) {
				//console.log( 'Native LazyLoad' );
			}
			else {

				var nodes  = document.querySelectorAll('[data-src]');
				var length = nodes.length;
				var elem;

				// Loop through objects with data-emergence attribute
				for (var i = 0; i < length; i++) {
					elem = nodes[i];

					// If element is visible
					if (isVisible(elem)) {

						elem.setAttribute('src', elem.getAttribute('data-src') );
						elem.removeAttribute('data-src');

						// Hack to repaint attribute in IE8
						//elem.className += ' lazy-done';

						// Callback for when element is visible
						callback(elem, 'tie_img_visible');

						if( jQuery.fn.masonry ){
							jQuery( '#masonry-grid' ).masonry( 'layout' );
						}

					}
				}
			}

			// BG ------
			var nodes    = document.querySelectorAll('[data-lazy-bg]');
			var bgLength = nodes.length;
			var elem;

			// Loop through objects with data-emergence attribute
			for (var i = 0; i < bgLength; i++) {
				elem = nodes[i];

				// If element is visible
				if (isVisible(elem)) {

					var currentStyles = '';
					if( elem.getAttribute( 'style' ) !== null ){
						currentStyles = elem.getAttribute( 'style' );
					}

					elem.setAttribute( 'style', currentStyles + 'background-image:url(' + elem.getAttribute('data-lazy-bg') + ')' );
					elem.removeAttribute('data-lazy-bg');

					// Hack to repaint attribute in IE8
					//elem.className = elem.className;

					// Callback for when element is visible
					callback(elem, 'tie_bg_visible');
				}
			}
		}

		// Lets check if Taqyeem plugin is active
		if( tie.is_taqyeem_active ){

			// Pie
			var nodes    = document.querySelectorAll('[data-lazy-pie]');
			var piLength = nodes.length;
			var elem;

			// Loop through objects with data-emergence attribute
			for (var i = 0; i < piLength; i++) {
				elem = nodes[i];

				// If element is visible
				if (isVisible(elem)) {

					var pctVal  = parseInt( elem.getAttribute('data-pct') ),
					    $circle = elem.getElementsByClassName('circle_bar')[0],
					    pctNew  = ((100-pctVal)/100) * Math.PI*(19*2); // 19 == $circle.getAttribute('r')

					$circle.setAttribute('style', 'stroke-dashoffset:'+ pctNew +'px' );
					elem.removeAttribute('data-lazy-pie');

					// Hack to repaint attribute in IE8
					//elem.className = elem.className;

					// Callback for when element is visible
					callback(elem, 'tie_pie_visible');
				}
			}


			// Star
			var nodes      = document.querySelectorAll('[data-lazy-percent]');
			var starLength = nodes.length;
			var elem;

			// Loop through objects with data-emergence attribute
			for (var i = 0; i < starLength; i++) {
				elem = nodes[i];

				// If element is visible
				if (isVisible(elem)) {

					elem.setAttribute('style', 'width:'+ elem.getAttribute('data-rate-val') );
					elem.removeAttribute('data-lazy-percent');

					// Hack to repaint attribute in IE8
					//elem.className = elem.className;

					// Callback for when element is visible
					callback(elem, 'tie_rate_visible');
				}
			}
		} // Taqyeem check

		// If no data-emergence attributes are found
		// Disengage emergence
		if ( ! length && ! piLength && ! starLength && ! bgLength ) {
			emergence.disengage();
		}
	};

	// Disengage emergence
	emergence.disengage = function() {

		// If browser supports removeEventListener
		// Else use detachEvent
		if (window.removeEventListener) {

			// Remove event listeners scroll and resize events
			container.removeEventListener('scroll', emergenceThrottle, false);
			container.removeEventListener('resize', emergenceThrottle, false);

		} else {

			// Detach scroll and resize events
			container.detachEvent('onscroll', emergenceThrottle);
			container.detachEvent('onresize', emergenceThrottle);
		}

		// Clear timeout from throttle
		clearTimeout(poll);
	};

	return emergence;
});