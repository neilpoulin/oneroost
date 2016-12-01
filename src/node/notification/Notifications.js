import CommentNotification from "./Comment.js"
import NextStepNotification from "./NextStep.js"
import StakeholderNotification from "./Stakeholder.js"
import DocumentAddedNotification from "./DocumentAdded.js"

import envUtil from "./../util/envUtil.js"
import {Parse} from "parse-cloud-express"
Parse.serverURL = envUtil.serverURL;

exports.initialize = function(io)
{
    CommentNotification.afterSave(io);
    NextStepNotification.afterSave(io);
    StakeholderNotification.afterSave(io);
    DocumentAddedNotification.afterSave();
}
