# Project moved: [https://github.com/makesites/phonegap-shim](https://github.com/makesites/phonegap-shim)

## Phonegap Shim

Lightweight solution to debug web apps before compiling with phonegap. 

The lib extends the PhoneGap namespace, so it needs to be included after phonegpa.js

## Usage 

In your application, set a callback to be called after Phonegap is initialized. 

```
PhoneGap.init(function(){
  
  // callback...

});
```

All other "shim" actions will be automatically executed if not in a phonegap environment... 

