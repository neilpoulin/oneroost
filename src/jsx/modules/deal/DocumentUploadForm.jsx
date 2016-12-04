import React, { PropTypes } from "react"
import FormUtil, {Validation} from "./../util/FormUtil"
import LinkedStateMixin from "react-addons-linked-state-mixin"
import Parse from "parse";
import ParseReact from "parse-react"
import Dropzone from "react-dropzone"
import request from "superagent"

const DocumentUploadForm = React.createClass({
    mixins: [LinkedStateMixin],
    propTypes: {
        deal: PropTypes.shape({
            objectId: PropTypes.string.isRequired
        })
    },
    getInitialState(){
        return {
            isFileUpload: true,
            uploading: false,
            uploadSuccess: false,
            dragover: false,
            fileName: null,
            deal: this.props.deal,
            externalLink: null,
            s3key: null,
            type: null,
            size: null,
            percent: 0,
            errors: {}
        }
    },
    doSubmit(){
        var self = this;
        var errors = this.getValidations();
        console.log(errors);
        if ( Object.keys(errors).length === 0 && errors.constructor === Object ){
            this.saveDocument();
            return true;
        }
        self.setState({errors: errors});
        return false;
    },
    saveDocument(){
        var self = this;
        var user = Parse.User.current().toPlainObject();
        var deal = self.state.deal;
        var upload = {
            createdBy: user,
            deal: deal,
            fileName: this.state.fileName,
            s3key: this.state.s3key,
            externalLink: this.state.externalLink,
            type: this.state.type,
            size: this.state.size
        }
        ParseReact.Mutation.Create("Document", upload)
        .dispatch()
        .then(function(){
            var message = user.firstName + " " + user.lastName + " has uploaded " + upload.fileName;
            var comment = {
                deal: deal,
                message: message,
                author: null,
                username: "OneRoost Bot",
                navLink: {type: "document", id: null}
            };
            ParseReact.Mutation.Create("DealComment", comment).dispatch();
        });
    },
    onDrop: function(files){
        console.log(files);
        var self = this;
        files.forEach(function(file){
            var fileName = file.name;
            Parse.Cloud.run("getPresignedUploadUrl", {
                fileName: fileName,
                dealId: self.props.deal.objectId,
                type: file.type
            }).then(function( result ) {
                console.log("recieved presignedurl", result);
                self.doUpload(file, result);
                self.setState({s3key: result.key});
            });
        });

    },
    onDragEnter(){
        this.setState({dragover: true})
    },
    onDragLeave(){
        this.setState({dragover: false});
    },
    doUpload(file, s3info){
        var self = this;
        var formData = new FormData();
        formData.append("file", file);
        self.setState({uploading: true, percent: 0});
        request.put(s3info.url)
        .set("Content-Type", file.type)
        .send(file)
        .on("progress", function(e) {
            console.log("Percentage done: ", e.percent);
            self.setState({uploading: true, percent: e.percent});
        })
        .end(function(err, response){
            if ( err ){
                console.error("something went wrong uploading the file", err);
                self.setState({uploadSuccess: false});
            } else{
                console.log("file uploaded successfully", response);
                s3info.type = file.type;
                s3info.size = file.size;
                self.setState({type: file.type,
                    size: file.size,
                    uploadSuccess: true,
                    uploading: false});
            }
        });
    },
    getValidations(){
        if ( this.state.isFileUpload ){
            return FormUtil.getErrors(this.state, this.uploadValidations);
        }
        return FormUtil.getErrors(this.state, this.linkValidations);
    },
    uploadValidations: {
        fileName: [
            new Validation(FormUtil.notNullOrEmpty, "error", "You must enter a file name.")
        ],
        uploading: new Validation(FormUtil.isFalsey, "warn", "The file must finish uploading before you can save the document."),
        uploadSuccess: new Validation(FormUtil.isTruthy, "error", "Something went wrong while uploading the document, please try again."),
    },
    linkValidations: {
        fileName: new Validation(FormUtil.notNullOrEmpty, "error", "You must enter a file name."),
        externalLink: new Validation(FormUtil.isValidHyperLink, "error", "The link provided must be a valid hyperlink.")
    },
    getErrorClass(field){
        var errors = this.state.errors;
        if (errors[field] )
        {
            return "has-" + errors[field].level
        }
        else return "";
    },
    getErrorHelpMessage(field){
        var errors = this.state.errors;
        if ( errors[field] )
        {
            var error = errors[field];
            return <span key={"document_error_" + field} className="help-block">{error.message}</span>
        }
        return null
    },
    setIsUpload(){
        this.setState({isFileUpload: true});
    },
    setIsLink(){
        this.setState({isFileUpload: false});
    },
    render () {
        var progress = null;
        var formAction =
        <div className={"form-group " + this.getErrorClass("externalLink")}>
            <label htmlFor="externalLinkInput">Link</label>
            <input id="externalLinkInput"
                type="text"
                className="form-control"
                valueLink={this.linkState("externalLink")} />
            {this.getErrorHelpMessage("externalLink")}
            {this.getErrorHelpMessage("uploadSuccess")}
        </div>

        if ( this.state.isFileUpload ){
            formAction =
            <Dropzone onDrop={this.onDrop}
                multiple={false}
                onDragEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave}
                className={"DocumentDropzone pointer " + (this.state.dragover ? " active" : "")}>
                <div className="DropZoneTarget">
                    <span>Drag and drop here or click to choose from your computer.</span>
                </div>
            </Dropzone>
            if ( this.state.uploading || this.state.uploadSuccess ){
                progress =
                <div className="progress">
                    <div className="progress-bar" role="progressbar"
                        aria-valuenow={this.state.percent}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{width: this.state.percent + "%"}}>
                        <span className="sr-only">{this.state.percent}</span>
                    </div>
                    {this.getErrorHelpMessage("uploadSuccess")}
                </div>
            }
        }

        var form =
        <div className="DocumentUploadForm">
            <div className={"form-group " + this.getErrorClass("fileName")}>
                <label htmlFor="fileNameInput">File Name</label>
                <input id="fileNameInput"
                    type="text"
                    className="form-control"
                    valueLink={this.linkState("fileName")} />
                {this.getErrorHelpMessage("fileName")}
            </div>
            <div>
                <ul className="nav nav-tabs nav-justified">
                    <li role="presentation" className={this.state.isFileUpload ? "active" : ""}>
                        <a onClick={this.setIsUpload}>Upload Document</a>
                    </li>
                    <li role="presentation" className={this.state.isFileUpload ? "" : "active"}>
                        <a onClick={this.setIsLink}>Add Link</a>
                    </li>
                </ul>

                {formAction}
                {progress}
            </div>

        </div>
        return form
    }
})

export default DocumentUploadForm
