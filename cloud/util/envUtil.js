var appEnv = null;

exports.getEnv = function(){
    if ( appEnv == null )
    {
        var applicationId = Parse.applicationId;
        var javascriptKey = "";
        var isDev = true;
        switch (applicationId)
        {
            case "TFy4TyyJJGpG7gnOUWzOZNtMcCkqQlYTfa4mJWQq": //dev
                javascriptKey = "CZfXoAnHhHU46Id1GBZ0zB9LFKHZI0HZJt1GfTlo";
                isDev = true;
                break;
            case "lSNtmvBTimEY6VfOo5zvvOQkljcHeDIOQcjefNUu": //prod
                javascriptKey = "EZKlfRO9ydZrpO2fpLkIRNTp9dEJxF4IyTh4VkWT";
                isDev = false;
                break;
        }
        var props = {
                    "applicationId": applicationId,
                    "javascriptKey": javascriptKey,
                    "isDev": isDev
                };

        var json = JSON.stringify( props );
        props.json = {"env": json};
        appEnv = props;
    }

    return appEnv;
}
