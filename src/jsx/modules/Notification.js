var canSend = false;
setupPermissions();

var defaultIconUrl = "/static/images/logo/OneRoostLogo.png";

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
                canSend = true;
                break;
            case "default":
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
    if ( window.Notification )
    {
        Notification.requestPermission().then(setupPermissions);
    }
}

exports.sendNotification = function( opts )
{
    if ( document.hasFocus() )
    {
        return;
    }
    if ( canSend )
    {
        var notification = new Notification( opts.title, {
            tag: opts.tag,
            body: opts.body,
            iconUrl: opts.icon || defaultIconUrl,
            icon: opts.icon || defaultIconUrl,
            requireInteraction: true
        } );
        notification.onclick = function(){
            notification.close()
            window.focus()
        };
    }
}
