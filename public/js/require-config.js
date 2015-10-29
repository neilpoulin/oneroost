requirejs.config({
  "baseUrl": "../out/js/components",
  "paths":{
    "examples": "../examples",
    "react": "//fb.me/react-with-addons-0.13.3.min",
    "jquery": "//code.jquery.com/jquery-2.1.4.min",
    "bootstrap": "//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min",
    "parse": "//www.parsecdn.com/js/parse-1.6.2.min",
    "parse-react": "https://www.parsecdn.com/js/parse-react",
    "app": "../app",
    "models": "/js/models",
    "underscore": "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min"
},
shim: {
        "underscore": {
            exports: "_"
        }
    }
});
