import React from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import FormUtil from "FormUtil"
import Parse from "parse";
import Dropzone from "react-dropzone"
import request from "superagent"
import numeral from "numeral"
import {linkValidation, fileValidation} from "DocumentValidation"
import FormInputGroup from "FormInputGroup"
import FormGroup from "FormGroup"
import {createDocument} from "ducks/roost/documents"
import * as log from "LoggingUtil"

const re = /(?:\.([^.]+))?$/;

const DocumentUploadForm = React.createClass({
    propTypes: {
        deal: PropTypes.object,
    },
    getInitialState(){
        return {
            isFileUpload: true,
            uploading: false,
            uploadSuccess: false,
            dragover: false,
            fileName: "",
            externalLink: "",
            s3key: "",
            type: "",
            size: null,
            percent: 0,
            errors: {},
            fileExtension: null
        }
    },
    doSubmit(){
        var self = this;
        var errors = this.getValidations();
        log.info(errors);
        if (Object.keys(errors).length === 0 && errors.constructor === Object){
            this.saveDocument();
            return true;
        }
        self.setState({errors: errors});
        return false;
    },
    saveDocument(){
        let data = {
            fileName: this.state.fileName,
            s3key: this.state.s3key,
            externalLink: this.state.externalLink,
            type: this.state.type,
            size: this.state.size,
            fileExtension: this.state.fileExtension
        };
        this.props.createDocument(data);
    },
    onDrop: function(files){
        log.info(files);
        var self = this;
        let {deal} = this.props;
        files.forEach(function(file){
            var fileName = file.name;
            Parse.Cloud.run("getPresignedUploadUrl", {
                fileName: fileName,
                dealId: deal.objectId,
                type: file.type
            }).then(function(result) {
                log.info("recieved presignedurl", result);
                self.doUpload(file, result);

                self.setState({
                    s3key: result.key,
                    fileExtension: re.exec(fileName)[1]
                });
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
                log.info("Percentage done: ", numeral(e.percent).format("0,0"));
                self.setState({uploading: true, percent: e.percent});
            })
            .end(function(err, response){
                if (err){
                    log.error("something went wrong uploading the file", err);
                    self.setState({uploadSuccess: false});
                }
                else{
                    log.info("file uploaded successfully", response);
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
        if (this.state.isFileUpload){
            return FormUtil.getErrors(this.state, fileValidation);
        }
        return FormUtil.getErrors(this.state, linkValidation);
    },
    setIsUpload(){
        this.setState({isFileUpload: true});
    },
    setIsLink(){
        this.setState({isFileUpload: false});
    },
    render () {
        var errors = this.state.errors;
        var progress = null;
        var formAction =
        <FormInputGroup
            fieldName="externalLink"
            value={this.state.externalLink}
            onChange={val => this.setState({externalLink: val})}
            label="URL"
            errors={this.state.errors}
            placeholder=""
            required={true} />

        if (this.state.isFileUpload){
            formAction =
            <FormGroup
                fieldName="uploadSuccess"
                errors={errors} >
                <Dropzone onDrop={this.onDrop}
                    multiple={false}
                    onDragEnter={this.onDragEnter}
                    onDragLeave={this.onDragLeave}
                    className={"DocumentDropzone pointer " + (this.state.dragover ? " active" : "")}>
                    <div className="DropZoneTarget">
                        <span>Drag and drop here or click to choose from your computer.</span>
                    </div>
                </Dropzone>
            </FormGroup>

            var progressLabel = numeral(this.state.percent).format("0,0") + "%";
            if (this.state.uploadSuccess){
                progressLabel = "Upload Completed"
            }

            if (this.state.uploading || this.state.uploadSuccess){
                progress =
                <div className="upload-info">
                    <div className="progress">
                        <div className="progress-bar" role="progressbar"
                            aria-valuenow={this.state.percent}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{width: this.state.percent + "%"}}>
                            {progressLabel}
                        </div>
                    </div>
                </div>
            }
        }

        var form =
        <div className="DocumentUploadForm">
            <div>
                <ul className="nav nav-tabs">
                    <li role="presentation" className={this.state.isFileUpload ? "active" : ""}>
                        <a onClick={this.setIsUpload}>Upload Document</a>
                    </li>
                    <li role="presentation" className={this.state.isFileUpload ? "" : "active"}>
                        <a onClick={this.setIsLink}>Add Link</a>
                    </li>
                </ul>

                <FormInputGroup
                    fieldName="fileName"
                    value={this.state.fileName}
                    onChange={val => this.setState({fileName: val})}
                    label="File Name"
                    errors={this.state.errors}
                    required={true}
                    />

                {formAction}
                {progress}
            </div>
        </div>
        return form
    }
})

const mapStateToProps = (state, ownProps) => {
    return {

    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    let {deal} = ownProps
    let dealId = deal.objectId
    return {
        createDocument: (doc) => dispatch(createDocument(dealId, doc))
    }
}

const connectOpts = {
    withRef: true
}

export default connect(mapStateToProps, mapDispatchToProps, undefined, connectOpts)(DocumentUploadForm)
