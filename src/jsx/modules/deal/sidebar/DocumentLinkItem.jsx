import React, { PropTypes } from "react"
import Parse from "parse"
import moment from "moment"

const DocumentLinkItem = React.createClass({
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
        //todo: figure out how to handle GSheets, etc.
        return "fa-external-link";
    },
    formatDate(date){
        return moment(date).format("MMM D, YYYY");
    },
    render () {
        var doc = this.props.doc;
        var link = doc.externalLink;
        if ( link.indexOf("//") == -1 ){
            link = "http://" + link;
        }
        else if ( link.indexOf("http") == -1){
            link = "http:" + link;
        }

        return (
            <div className="DocumentItem pointer" onClick={this.doDownload}>
                <a href={link} target="_blank">
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
                </a>
            </div>
        )
    }
})

export default DocumentLinkItem
