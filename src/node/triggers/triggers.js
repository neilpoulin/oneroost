import BeforeSave from "./BeforeSave"
import Subscription from "./../subscription/Subscription"
import Documents from "./../documents/Documents"
import ReadyRoost from "./../roost/ReadyRoost"
import Notifications from "./../notification/Notifications.js"
import Stakeholders from "./../stakeholders.js"

exports.initialize = function(io){
    try{
        BeforeSave.initialize();
        Notifications.initialize(io);
        Documents.initialize();
        Stakeholders.initialize();
        ReadyRoost.initialize();
        Subscription();
    }
    catch (e){
        console.error(e);
    }
}
