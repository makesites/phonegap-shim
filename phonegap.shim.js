/*
 * Phonegap Shim
 * Lightweight solution to debug Phonegap apps on the browser
 *
 * Created by: Makis Tracend (@tracend)
 * Source: https://github.com/makesites/phonegap-shim
 *
 * Released under the MIT license
 * http:// makesites.org/licenses/MIT
 */

(function( window ){
	// we will be extending the PhoneGap object with two methods
	// - if PhoneGap is not available...
	if(typeof PhoneGap == "undefined") PhoneGap = {};
	// setup the environment
	var env = {
		mobile : /ios|iphone|ipod|ipad|android|webos|blackberry|windows/i.test(navigator.userAgent),
		browser : /safari|chrome|firefox|opera|msie/i.test(navigator.userAgent),
		app : false
	}
	// app state still unclear...
	env.app = env.mobile && !(env.browser);

	PhoneGap.init = function( fn ){
		// local variables
		this.env = env;
		// Phonegap support
		window.plugins || (window.plugins = {});
		//
		this.env['childbrowser'] = !(window.plugins.childBrowser == null);
		//check the right conditions...
		//if (this.env['mobile'] && this.env['app']) {
		if (/loaded|complete/.test(document.readyState)) {
			fn(); // call the onload handler
		} else if (this.env['app']) {
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
		}

		// add the shim!
		this.shim();
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
			// childBrowser polyfil
			window.plugins.childBrowser = {

				url : false,

				popup : false,

				monitor : function(){
					//
					var self = this;
					//var onLocationChange = this.onLocationChange || false;
					// exit now if there's noting to monitor (or the window was closed)
					//if( !this.popup || !onLocationChange ) return;
					if( !this.popup || this.popup.location == null ) return;
					// get url of other window
					var url = this.findURL();
					// if url is null (not valid) quit the cycle
					if( url == null ) return;
					// first reset for free ??
					if( !this.url ) {
						this.url = url;
					}
					// at this point there should have both urls
					if( url != this.url && this.onLocationChange ){
						this.onLocationChange( url );
						// reset URL
						this.url = url;
					}
					// loop...
					setTimeout(function(){
						self.monitor();
					}, 500);
				},

				onLocationChange : false,
				//onLocationChange : function(loc){self.onLocationChange(loc);};

				showWebPage : function( url ){
					// load in a popup
					this.popup = window.open(url, "_blank");
				   //start monitoring the URL
					this.monitor();
				},

				findURL : function(){
					 // if we can't read the location of the popup
					// we will have to fallback to postMessage
					if(typeof this.popup.location.href == "undefined"){
						this.postMessage();
						return null;
					}
					// if not a valid url...
					return ( this.popup.location.href.search(/^http/) === 0 ) ? this.popup.location.href : false;
				},

				postMessage : function(){
					var self = this;
					var target = this.target || window.location.href;
					window.addEventListener("message", function(e){ self.receiveMessage(e) }, false);
					this.popup.postMessage("location", target);
				},

				receiveMessage : function(event){
					// Convention: when using postMessage pass the full url in the data
					var url = event.data;
					if( this.onLocationChange ){
						this.onLocationChange( url );
					}
					// reset URL
					this.url = url;
				},

				close : function(){
					this.popup.close();
				}

			};

		};
	};

})( window );
