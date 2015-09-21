requirejs.config({
  "baseUrl": "../out/js/components",
  "paths":{
    "examples": "../examples",
    "react": "//fb.me/react-0.13.3",
    "jquery": "//code.jquery.com/jquery-2.1.4.min",
    "bootstrap": "//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min",
    "parse": "//www.parsecdn.com/js/parse-1.6.2.min",
    "parse-react": "https://www.parsecdn.com/js/parse-react"
  },
  waitSeconds: 30
});
requirejs( ['jquery',], function(){
  requirejs(['bootstrap']);
});
requirejs(['../out/js/react-app.js']);
