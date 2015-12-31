requirejs.config({
  "baseUrl": "../out/js/components",
  "paths":{
    "examples": "../examples",
    "react": "//fbcdn-dragon-a.akamaihd.net/hphotos-ak-xta1/t39.3284-6/12466404_195801880768159_1173196807_n",
    "jquery": "//code.jquery.com/jquery-2.1.4.min",
    "bootstrap": "//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min",
    "parse": "//www.parsecdn.com/js/parse-latest",
    "parse-react": "../../../lib/parse-react-mod.min",
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
