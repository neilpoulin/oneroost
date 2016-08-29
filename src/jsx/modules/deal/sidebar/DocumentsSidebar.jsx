import React, { PropTypes } from "react"
import Dropzone from "react-dropzone"
import Parse from "parse"
import ParseReact from "parse-react"
import request from "superagent"
import DocumentItem from "./DocumentItem"

const DocumentsSidebar = React.createClass({
    mixins: [ParseReact.Mixin],
    propTypes: {
        params: PropTypes.shape({
            dealId: PropTypes.any.isRequired
        }),
        deal: PropTypes.object
    },
    getInitialState: function(){
        return {
            uploading: false,
            percent: 0,
            dragover: false
        }
    },
    observe: function(props, state){
        return {
            documents: (new Parse.Query("Document")).include("createdBy").equalTo( "deal", props.deal ).descending("createdAt")
        }
    },
    onDrop: function(files){
        console.log(files);
        var self = this;
        files.forEach(function(file){
            var fileName = file.name;
            Parse.Cloud.run("getPresignedUploadUrl", {
                fileName: fileName,
                dealId: self.props.params.dealId,
                type: file.type
            }).then(function( result ) {
                console.log("recieved presignedurl", result);
                self.doUpload(file, result);
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

        request.put(s3info.url)
            .set("Content-Type", file.type)
            .send(file)
            .on('progress', function(e) {
                console.log('Percentage done: ', e.percent);
                self.setState({uploading: true, percent: e.percent});
            })
            .end(function(err, response){
                self.setState({uploading: false, percent: 0});
                if ( err ){
                    console.error("something went wrong uploading the file", err);
                } else{
                    console.log("file uploaded successfully", response);
                    s3info.type = file.type;
                    s3info.size = file.size;
                    self.saveDocument(s3info);
                }
            });

    },
    saveDocument(info){
        var self = this;
        var user = Parse.User.current().toPlainObject();
        var deal = self.props.deal;
        var upload = {
            createdBy: user,
            deal: deal,
            fileName: info.fileName,
            s3key: info.key,
            type: info.type,
            size: info.size
        }
        ParseReact.Mutation.Create("Document", upload)
        .dispatch()
        .then(function(){
            var message = user.firstName + " " + user.lastName + " has uploaded " + info.fileName;
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
    render () {
        var self = this;
        var dealId = self.props.params.dealId;
        var documents = null;
        if ( this.pendingQueries().length > 0 ){
            documents = <div><i className="fa fa-spinner fa-spin"></i> Loading documents</div>
        }
        else{
            documents =
            <div className="documentContainer">
                {this.data.documents.map(function(doc){
                    return <DocumentItem
                            key={"deal_" + dealId + "_doc_" + doc.objectId}
                            doc={doc}
                         />
                })}
            </div>
        }

        var progress = null;
        if ( this.state.uploading ){
            progress =
            <div className="progress">
                <div className="progress-bar" role="progressbar"
                    aria-valuenow={this.state.percent}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{width: this.state.percent + "%"}}>
                    <span className="sr-only">{this.state.percent}</span>
                </div>
            </div>
        }

        var sidebar =
        <div className="DocumentsSidebar">
            <h3 className="title">Documents</h3>

            <Dropzone onDrop={this.onDrop}
                multiple={false}
                onDragEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave}
                className={"DocumentDropzone pointer " + (this.state.dragover ? " active" : "")}>
                <div className="">
                    Drag and drop here or click to choose from your computer.
                </div>
            </Dropzone>
            {progress}
            {documents}
        </div>;

        return sidebar;
    }
});

export default DocumentsSidebar;
