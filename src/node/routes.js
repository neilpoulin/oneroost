import express from "express";
import TemplateUtil from"./util/TemplateUtil"
import envUtil from "./util/envUtil.js"

const app = express.Router();

app.get("/admin/emails/:templateName", function(req, resp){
    TemplateUtil.renderSample(req.params.templateName).then(templates => {
        resp.render("emailSample.ejs", templates);
    });
});

app.get("/admin/emails/:templateName/:number", function(req, resp){
    TemplateUtil.renderSample(req.params.templateName, req.params.number).then(function(templates){
        resp.render("emailSample.ejs", templates);
    });
});

app.get("*", function(request, response){
    var env = envUtil.getEnv();
    var homePage = "index.ejs";
    var params = env.json;
    response.render(homePage, params);
});

module.exports = app;
