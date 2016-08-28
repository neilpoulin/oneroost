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
    observe: function(props, state){
        var self = this;
        return {
            documents: (new Parse.Query("Document")).include("createdBy").equalTo( "deal", props.deal ).descending("createdAt")
        }
    },
    onDrop: function(files){
        console.log(files);
        var self = this;
        files.forEach(function(file){
            var fileName = file.name;
            var preview = file.preview;
            Parse.Cloud.run("getPresignedUploadUrl", {
                fileName: fileName,
                dealId: self.props.params.dealId
            }).then(function( result ) {
                console.log("recieved presignedurl", result);
                self.doUpload(file, result);
            });
        });

    },
    doUpload(file, s3info){
        var self = this;
        var formData = new FormData();
        formData.append(file.name, file)

        request.put(s3info.url)
            .end(function(err, response){
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
        var user = Parse.User.current();
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
        .dispatch({waitForServer: false})
        .then(function(){
            self.refreshQueries(["documents"]);
            var message = user.get("firstName") + " " + user.get("lastName") + " has uploaded " + info.fileName;
            var comment = {
                deal: deal,
                message: message,
                author: null,
                username: "OneRoost Bot",
                navLink: {type: "document", id: null}
            };
            ParseReact.Mutation.Create("DealComment", comment).dispatch({waitForServer: false});
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

        var sidebar =
        <div className="DocumentsSidebar">
            <h3 className="title">Documents</h3>

            <Dropzone onDrop={this.onDrop}
                multiple={false}
                className="DocumentDropzone">
                <div>Drag and drop here or click to choose from your computer.</div>
            </Dropzone>
            {documents}
        </div>;

        return sidebar;
    }
});

export default DocumentsSidebar;
