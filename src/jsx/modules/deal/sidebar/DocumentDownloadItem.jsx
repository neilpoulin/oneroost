import React, { PropTypes } from "react"
import Parse from "parse"
import moment from "moment"
import RoostUtil from "RoostUtil"

const DocumentDownloadItem = React.createClass({
    propTypes: {
        doc: PropTypes.object.isRequired
    },
    urlAttempts: 0,
    getInitialState(){
        return {
            downloadUrl: null,
        }
    },
    getPresignedGetUrl(){
        let self = this;
        let {doc} = this.props;
        if ( this.state.downloadUrl ){
            console.log("already has a download url, not fetching it again");
            return
        }
        Parse.Cloud.run("getPresignedGetUrl", {
            documentId: doc.objectId
        }).then(result => {
            console.log(result);
            if (result.url.indexOf( "https://s3.amazonaws.com") != -1 ){
                console.warn("Failed to get a valid S3 url, trying again.", result.url)
                if ( self.urlAttempts < 3 ){
                    self.getPresignedGetUrl();
                    self.urlAttempts = self.urlAttempts + 1;
                } else{
                    self.urlAttempts = 0
                }
            } else {
                self.setState({downloadUrl: result.url});
                self.urlAttempts = 0
            }
        });
    },
    getIconType(){
        var {doc} = this.props;
        var icon = "fa-file-o";
        var {type} = doc;
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
        var {doc} = this.props;
        let {fileName, createdBy, createdAt} = doc
        let {downloadUrl} = this.state;
        var actions = null;
        if ( downloadUrl ){
            actions =
            <div className="downloadActions">
                <a href={downloadUrl} download={fileName} className="btn btn-primary btn-block" target="_blank">
                    <i className="fa fa-download"></i> Download {"\"" + fileName + "\""}
                </a>
            </div>
        }

        return (
            <div className="DocumentItem pointer" onClick={this.getPresignedGetUrl}>
                <div>
                    <div className="fileIcon pull-left">
                        <i className={"fa fa-2x " + this.getIconType()}></i>
                    </div>
                    <div>
                        <div>
                            <span className="fileName">{fileName}</span>
                        </div>
                        <div>
                            <span className="uploadedBy">{RoostUtil.getFullName(createdBy)}</span>
                            <span className="createdAt">{this.formatDate(createdAt)}</span>
                        </div>
                    </div>
                    {actions}
                </div>
            </div>
        )
    }
})

export default DocumentDownloadItem
