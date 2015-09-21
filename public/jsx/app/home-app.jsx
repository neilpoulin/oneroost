define( ['parse', 'react', 'pages/HomePage'], function( Parse, React, HomePage){
    Parse.$ = jQuery;
    Parse.initialize("lSNtmvBTimEY6VfOo5zvvOQkljcHeDIOQcjefNUu", "EZKlfRO9ydZrpO2fpLkIRNTp9dEJxF4IyTh4VkWT");

    React.render(<HomePage />, document.getElementById('homePage'));
});
