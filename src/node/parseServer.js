import * as envUtil from "./util/envUtil"
import {ParseServer} from "parse-server"
import ParseDashboard from "parse-dashboard"
import SESParseAdapter from "./email/SESParseAdapter.js"
import {S3Adapter} from "parse-server"

export function getParseDashboard(){
    const envName = envUtil.getEnvName()
    console.log(`envName = ${envName}`)
    let config
    switch (envName) {
        case "stage":
            config = require("./parse-dashboard-config-stage.json")
            break
        case "prod":
            config = require("./parse-dashboard-config-prod.json")
            break;
        case "dev":
        default:
            config = require("./parse-dashboard-config-dev.json")
            break;
    }
    return new ParseDashboard(config);
}

export function getLiveQueryServer(httpServer){
    ParseServer.createLiveQueryServer(httpServer, {
        appId: envUtil.getParseAppId(),
        masterKey: envUtil.getParseMasterKey(),
        serverURL: envUtil.getParseServerUrl(),
    });
}

export function getParseServer(){
    return new ParseServer({
        databaseURI: envUtil.getDatabaseUrl(),
        cloud: "main.js",
        appId: envUtil.getParseAppId(),
        fileKey: "myFileKey",
        masterKey: envUtil.getParseMasterKey(),
        push: {}, // See the Push wiki page
        liveQuery: {
            // classNames: ["User", "Account", "Deal", "DealComment", "NextStep", "Stakeholder"]
            classNames: ["DealComment", "Deal", "Stakeholder", "NextStep"]
        },
        serverURL: envUtil.getParseServerUrl(),
        publicServerURL: envUtil.getPublicServerUrl(),
        appName: "OneRoost",
        emailAdapter: SESParseAdapter({}),
        customPages: {
            verifyEmailSuccess: envUtil.getEmailVerifiedPageUrl()
        },
        filesAdapter: new S3Adapter(
            envUtil.getAwsId(),
            envUtil.getAwsSecretId(),
            "parse-direct-access",
            {directAccess: true}
        ),
        verifyUserEmails: true,
        emailVerifyTokenValidityDuration: 2 * 60 * 60, // in seconds, 2 hours
        preventLoginWithUnverifiedEmail: false,
        auth: {
            google: {
                client_id: envUtil.GOOGLE_CLIENT_ID
            },
            linkedin: {client_id: "78v10otstxnu8h"},
        }
    });
}
