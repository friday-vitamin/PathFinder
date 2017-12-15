// Let's create some sort of namespace for this
// I used "selector" for simplicity.
if (typeof selector === 'undefined') {
	selector = {};
}

// Make sure only one version is running
if (selector.addLibs === undefined) {
	selector.addLibs = function() {
		// run the magic code
		selector.nodeSelector();
	};

	selector.nodeSelector = function() {
		// Let's make sure we can use console.log
		if (window.console === undefined) {
			window.console = {
				log: function() {
				}
			};
		}
		// Create a function for mouse over to add an outline, or a custom background if an outline already exists
		// we save to HTML data the old outline/background information
		var mouseover = function(ev) {
			ev.stopPropagation();
			var e = $(ev.target);
			// we are over our own creation exit stage left
			if (e.is('.selectorTableBody-extension')) {
				return;
			}
			if (typeof e.css('outline') != 'undefined') {
				e.data('saved', {'outline': e.css('outline')});
				e.css('outline', 'blue solid medium');
			} else {
				e.data('saved', {'backgroundColor': e.css('backgroundColor')});
				e.css('backgroundColor', '#0cf');
			}
		};

		// Create a function for mout out to restore the old outline/background information from HTML data
		var mouseout = function(ev) {
			ev.stopPropagation();
			var e = $(ev.target);
			var save = e.data('saved');
			if (typeof(save) == 'undefined') {
				return;
			}
			e.css(save);
			e.removeData('saved');
		};

		// Create Click function to show information about the clicked element
		var click = function(ev) {
			ev.stopImmediatePropagation();
			ev.preventDefault();
			ev.stopPropagation();
			ev.cancelBubble = true;
			ev.returnValue = false;
			// get information about the clicked element
			var e = $(ev.target);
			var id = getId(ev.target);
			var name = getName(ev.target);
			var xpath = getXpath(ev.target);
			console.log('xpath=' + xpath);
			// get the hover node (let's home nobody will ever create a element with #hover as id... finger crossed)
			var node = $('#hover');
			if (node.size() === 0) {
				// no hover node? let's add a div to body
				$(document.body).append('<div id=\'hover\' .selectorTableBody-extension></div>');
				node = $('#hover');
				node
					.css('position', 'absolute')
					.css('display', 'inline')
					.css('backgroundColor', 'white')
					.css('padding', '4px')
					.css('width', '800px')
					.css('zIndex', 99999)
					.css('font-size', '14px')
					.click(function(ev) {
						ev.stopPropagation();
					});
			}
			// Update content of our div
			node.html('<table class=\'selectorTableBody-extension\' cellpadding="0" cellspacing="0" border="1" style="border-collapse:collapse;word-break:break-all; word-wrap:break-all;">' +
				'<tr class=\'selectorTableBody-extension\' >' +
				'<td class=\'selectorTableBody-extension\'  height="35" width="30%" style="border:1px solid black;vertical-align:center;color:black;">id</td>' +
				'<td  class=\'selectorTableBody-extension\' height="35" width="70%" style="border:1px solid black;vertical-align:center;color:black;">' + id + '</td>' +
				'</tr>' +
				'<tr class=\'selectorTableBody-extension\' >' +
				'<td  class=\'selectorTableBody-extension\' height="35" width="30%" style="border:1px solid black;vertical-align:center;color:black;">name</td>' +
				'<td  class=\'selectorTableBody-extension\' height="35" width="70%" style="border:1px solid black;vertical-align:center;color:black;">' + name + '</td>' +
				'</tr>' +
				'<tr class=\'selectorTableBody-extension\' >' +
				'<td  class=\'selectorTableBody-extension\' height="35" width="30%" style="border:1px solid black;vertical-align:center;color:black;">xpath</td>' +
				'<td  class=\'selectorTableBody-extension\' height="35" width="70%" style="border:1px solid black;vertical-align:center;color:black;">' + xpath + '</td>' +
				'</tr>' +
				'</table>');
			// Let's move the div where our clicked element is
			node.animate({
				'top': (e.offset().top) + 'px',
				'left': (e.offset().left) + 'px'
			}, 250);
		};

		// Get everything on the page and add events
		var all = $('*');
		all.each(function() {
			$(this)
				.mouseout(mouseout)
				.mouseover(mouseover)
				.click(click);
		});
		// We need a way to exit this Extension let's add the escape key for that.
		var keydown = function(e) {
			if (e.keyCode === undefined && e.charCode !== undefined) {
				e.keyCode = e.charCode;
			}
			if (e.keyCode == 27) {
				$('*').each(function() {
					$(this)
						.mouseout()
						.unbind('mouseover', mouseover)
						.unbind('mouseout', mouseout)
						.unbind('click', click)
						.mouseout();
				});
				$('#hover').remove();
				$(document).unbind('keydown', keydown);
				selector.addLibs = undefined;
			}
			$('#hover').remove();
			$(document).unbind('keydown', keydown);
			selector.addLibs = undefined;
		};

		$(document).keydown(keydown);

		// we need this simple methods to get information about the clicked element
		function getId(e) {
			return e.id;
		}

		function getName(e) {
			return e.name;
		}

		function getXpath(e) {
			var xpath = '';
			var oldE = e;
			while (e.nodeName.toLowerCase() != 'html') {
				var node = e.nodeName;
				node = node.toLowerCase();
				var id = e.id;
				if (id !== undefined && id !== null && id !== '') {
					xpath = '//' + node + '[@id=\'' + id + '\']' + xpath;
					break;
				}
				var parent = e.parentNode;
				var children = $(parent).children(node);
				if (children.size() > 1) {
					var good = false;
					children.each(function(i) {
						if (this == e) {
							node = node + '[' + (i + 1) + ']';
							good = true;
							return false;
						}
					});
					if (!good) {
						console.log('Can\'t find child, something is wrong with your dom : ' + node);
						return false;
					}
				}
				xpath = '/' + node + xpath;
				e = parent;
			}
			if (xpath.substring(0, 2) != '//') {
				xpath = '/html' + xpath;
			}
			return xpath;
		}
	};

	selector.addLibs();
}



