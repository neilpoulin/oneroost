let selectedPermission
var defaultIconUrl = "/static/images/logo/OneRoostLogo.png";
import { browserHistory } from "react-router"

function getPermission()
{
    if ( selectedPermission ){
        return selectedPermission
    }
    if ( window.Notification )
    {
        selectedPermission = Notification.permission
    }
    else {
        selectedPermission = "none"
    }
    return selectedPermission
}

function checkPermissions()
{
    let canSend = false;
    if ( window.Notification )
    {
        switch (getPermission()) {
            case "granted":
                canSend = true;
                break;
            case "default":
                Notification.requestPermission().then(checkPermissions);
                break;
            case "none":
            case "denied":
            default:
                canSend = false;
                break;
        }
    }
    return canSend;
}


exports.requestPermission = function()
{
    if ( window.Notification )
    {
        Notification.requestPermission().then(checkPermissions);
    }
}

exports.sendNotification = function( opts )
{
    if ( document.hasFocus() )
    {
        return;
    }

    if ( checkPermissions() )
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
            browserHistory.push(opts.path)
        };
    }
}
