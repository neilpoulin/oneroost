import React, { PropTypes } from "react"
import Parse from "parse"
import moment from "moment"

const DocumentItem = React.createClass({
    propTypes: {
        doc: PropTypes.object.isRequired
    },
    getInitialState(){
        return {
            downloadUrl: null
        }
    },
    doDownload(){
        var self = this;
        var doc = this.props.doc;
        Parse.Cloud.run("getPresignedGetUrl", {
            documentId: doc.objectId
        }).then(function( result ) {
            self.setState({downloadUrl: result.url});
        });
    },
    getIconType(){
        var doc = this.props.doc;
        var icon = "fa-file-o";
        var type = doc.type;
        if ( type.indexOf("image") == 0 ){
            return "fa-file-image-o";
        }
        if ( type.indexOf("audio") == 0 ) {
            return "fa-file-audio-o";
        }
        if ( type.indexOf("video") == 0 ) {
            return "fa-file-video-o";
        }
        if ( type.indexOf("text") == 0 ){
            var textType = type.split("/")[1];
            switch (textType) {
                case "html":
                case "css":
                    icon = "fa-file-code-o";
                    break;
                default:
                    icon = "fa-file-text-o";
                    break;
            }
            return icon;
        }
        if ( type.indexOf("application") != -1 ){
            var appType = type.split("/")[1];
            switch( appType ){
                case "pdf":
                    icon = "fa-file-pdf-o";
                    break;
                case "msword":
                case "vnd.openxmlformats-officedocument.wordprocessingml.document":
                    icon = "fa-file-word-o";
                    break;
                case "zip":
                case "x-gtar":
                case "x-gzip":
                    icon = "fa-file-archive-o";
                    break;
                case "vnd.ms-powerpoint":
                case "vnd.openxmlformats-officedocument.presentationml.presentation":
                    icon ="fa-file-powerpoint-o";
                    break;
                case "vnd.ms-excel":
                case "vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                    icon ="fa-file-excel-o";
                    break;
                default:
                    icon="fa-file-o";
                    break;
            }
            return icon;
        }

        return icon
    },
    formatDate(date){
        return moment(date).format("MMM D, YYYY");
    },
    render () {
        var doc = this.props.doc;

        return (
            <div className="DocumentItem pointer" onClick={this.doDownload}>
                <div>
                    <div className="fileIcon pull-left">
                        <i className={"fa fa-2x " + this.getIconType()}></i>
                    </div>
                    <div>
                        <div>
                            <span className="fileName">{doc.fileName}</span>
                        </div>
                        <div>
                            <span className="uploadedBy">{doc.createdBy.firstName + " " + doc.createdBy.lastName}</span>
                            <span className="createdAt">{this.formatDate(doc.createdAt)}</span>
                        </div>
                    </div>

                </div>
                <iframe width="1"
                        height="1"
                        frameBorder="0"
                        src={this.state.downloadUrl}></iframe>
            </div>
        )
    }
})

export default DocumentItem
