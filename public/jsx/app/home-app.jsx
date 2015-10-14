define( ['parse', 'react', 'pages/HomePage'], function( Parse, React, HomePage){
    Parse.$ = jQuery;
    Parse.initialize(OneRoost.Config.applicationId, OneRoost.Config.javascriptKey);

    React.render(<HomePage />, document.getElementById('homePage'));
});
