// Add click listener on the chrome toolbar button(icon)
// https://developer.chrome.com/extensions/browserAction
chrome.browserAction.onClicked.addListener(function(tab) {
	// When clicked exectue the script in the current tab
	// https://developer.chrome.com/extensions/tabs
	chrome.tabs.executeScript(null, {file: 'js/background/selector.js'});
});