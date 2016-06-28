var canSend = false;
setupPermissions();


function checkPermission()
{
    if ( window.Notification )
    {
        return Notification.permission
    }
    else {
        return "none"
    }
}

function setupPermissions()
{
    if ( window.Notification )
    {
        switch (checkPermission()) {
            case "granted":
                console.log("granted permissions... continuing");
                canSend = true;
                break;
            case "default":
                console.log("default permissions, requesting then initializing");
                Notification.requestPermission().then(setupPermissions);
                break;
            case "none":
            case "denied":
            default:
                break;
        }
    }
}


exports.requestPermission = function()
{
    console.log("requesting permissions");
    if ( window.Notification )
    {
        Notification.requestPermission().then(setupPermissions);
    }
}

exports.sendNotification = function( opts )
{
    if ( document.hasFocus() )
    {
        console.log("not sending notification, window has focus.")
        return;
    }
    console.log("sending notification", opts);
    if ( canSend )
    {
        var notification = new Notification( opts.title, {
            tag: opts.tag,
            body: opts.body,
            iconUrl: opts.icon,
            icon: opts.icon
        } );
        notification.onclick = function(){
            notification.close()
            window.focus()
        };
    }
}
