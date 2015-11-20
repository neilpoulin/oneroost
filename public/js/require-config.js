requirejs.config({
  "baseUrl": "../out/js/components",
  "paths":{
    "examples": "../examples",
    "react": "//fb.me/react-with-addons-0.13.3.min",
    "jquery": "//code.jquery.com/jquery-2.1.4.min",
    "bootstrap": "//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min",
    "parse": "//www.parsecdn.com/js/parse-latest",
    "parse-react": "https://www.parsecdn.com/js/parse-react",
    "app": "../app",
    "models": "/js/models",
    "underscore": "../../../lib/underscore"
},
shim: {
        "underscore": {
            exports: "_"
        }
    }
});
