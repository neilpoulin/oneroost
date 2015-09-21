requirejs(['require-config'], function(){
  requirejs( ['jquery'], function(){
    requirejs(['bootstrap'], function(){
      requirejs(['parse'], function(){
        requirejs(['app/home-app']);
      });
    });
  });
});
