requirejs(['require-config'], function(){
  requirejs( ['jquery'], function(){
    requirejs(['bootstrap'], function(){
      requirejs(['app/react-app']);
    });
  });
});
