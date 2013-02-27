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
            // childBrowser polyfil
            window.plugins.childBrowser = {
                
                url : false,
                
                popup : false, 
                
                monitor : function(){
                    //
                    var self = this;
                    //var onLocationChange = this.onLocationChange || false;
                    // exit now if there's noting to monitor (or nothing to do_)
                    //if( !this.popup || !onLocationChange ) return;
                    if( !this.popup || this.popup.location == null ) return;
                    // get url of other window
                    var url = this.popup.location.href || false;
                    //stop monitoring if the window was closed
                    if( !url ){
                        // wait for it...
                        
                        // reset
                        //this.popup = false;
                        //this.url = false;
                        //return;
                    }
                    
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
                    //window.location = url;
                    //start monitoring the URL
                    this.monitor();
                },
                
                close : function(){
                    this.popup.close();
                }
            };
            
		};
	};

})();
