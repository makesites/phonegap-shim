/*
 * Phonegap Shim
 * A set of fallbacks for desktop usage
 * 
 * Created by: Makis Tracend (@tracend)
 * Source: https://gist.github.com/4301819
 *
 * Released under the MIT license
 *
 */

(function(){
  
	// we will be extending the PhoneGap object with two methods 
	// - if PhoneGap is not available just quit...
	if( !PhoneGap ) return;
	
	PhoneGap.init = function( fn ){
		// setup the environment
		this.env = {};
		this.env['mobile'] = !(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/) == null); 
		this.env['app'] = !(typeof navigator.notification == "undefined");
		// Phonegap support 
		window.plugins || (window.plugins = {});
		// 
		this.env['childbrowser'] = !(window.plugins.childBrowser == null);
		
		//check the right conditions...
		if (this.env['mobile'] && this.env['app']) {
			// use phonegap event
			document.addEventListener("deviceready", fn, false);
			// everything is normal :)
		} else { 
			// add window event - trigger the page as soon it's loaded (
			if (window.addEventListener) {  
				window.addEventListener('load', fn, false);
			} else {
				// IE...
				window.attachEvent('onload', fn);
			}
			// add the shim!
			this.shim();
		}
		
	}
	
	PhoneGap.shim = function(){
		
		// navigator fallbacks 
		// ...
		navigator.notification = {};
		navigator.notification.alert = function(msg, options, title){
			alert(msg);
		};
		// plugin fallbacks
		window.plugins || (window.plugins = {});
		
		if(window.plugins.childBrowser == null)
		{
			window.plugins.childBrowser = {};
			window.plugins.childBrowser.showWebPage = function(authorize_url){
				window.location = authorize_url;
			};
		}
	}

})();
