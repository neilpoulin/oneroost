requirejs(['require-config'], function(){
  requirejs( ['jquery'], function(){
    requirejs(['parse'], function(Parse){
      Parse.initialize(OneRoost.Config.applicationId, OneRoost.Config.javascriptKey);
      window.Parse = Parse;

      var config = Parse.Config.current();
      Parse.Config.get().then(function(newConfig){
        config = newConfig;
      },
      function(error){
        console.log(error);
      });

      var info = config.get("landing_info");
      if ( !info )
      {
        info = "Keep up with OneRoost";
      }

      var motto = config.get("landing_motto");
      if ( !motto )
      {
        motto = "Adding transparancy to your sales process";
      }

      var cta = config.get("landing_btn_cta");
      if ( !cta )
      {
        cta = "Notify Me";
      }

      $("#mottoText").html( motto );
      $("#infoText").html( info );
      $("#mc-embedded-subscribe").html( cta ).removeClass("hidden");
    });
  });
});
