var appEnv = null;

exports.getEnv = function(){
    if ( appEnv == null )
    {
        var applicationId = Parse.applicationId;
        var javascriptKey = "";
        var isDev = true;
        var envName;
        var mandrillAppId = 'dmCF3Rb55CIbJVvnzB4uzw';
        switch (applicationId)
        {
            case "TFy4TyyJJGpG7gnOUWzOZNtMcCkqQlYTfa4mJWQq": //dev
                javascriptKey = "CZfXoAnHhHU46Id1GBZ0zB9LFKHZI0HZJt1GfTlo";
                isDev = true;
                envName = "dev";
                break;
            case "lSNtmvBTimEY6VfOo5zvvOQkljcHeDIOQcjefNUu": //prod
                javascriptKey = "EZKlfRO9ydZrpO2fpLkIRNTp9dEJxF4IyTh4VkWT";
                isDev = false;
                envName = "prod";
                break;
            case "llcq2KXGOGoOQMO9W1rvgFcramBjAMgZEVRhNagb": //stage
                javascriptKey = "y6EMasJca2ez13ff88AW6XEFaIEHaqi0xTejTpFP";
                isDev = true;
                envName = "stage";
                break;
        }
        var props = {
                    "applicationId": applicationId,
                    "javascriptKey": javascriptKey,
                    "isDev": isDev,
                    "envName": envName,
                    "mandrillAppId": mandrillAppId
                };

        var json = JSON.stringify( props );
        props.json = {"env": json};
        appEnv = props;
    }

    return appEnv;
}
