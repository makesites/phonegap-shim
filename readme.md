# Phonegap Shim

Lightweight solution to debug Phonegap apps on the browser. 

The lib extends the PhoneGap namespace, so it requires the phonegap.js lib.


## Install

Using bower:
```
bower install phonegap.shim
```

## Usage 

In your application, set a callback to be called after Phonegap is initialized. 

```
PhoneGap.init(function(){
  
  // callback...

});
```

All other "shim" actions will be automatically executed if not in a phonegap environment... 

