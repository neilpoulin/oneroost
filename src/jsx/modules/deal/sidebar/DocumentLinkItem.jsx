import React, { PropTypes } from "react"
import Parse from "parse"
import moment from "moment"
import RoostUtil from "RoostUtil"

const DocumentLinkItem = React.createClass({
    propTypes: {
        doc: PropTypes.instanceOf(Parse.Object).isRequired
    },
    getInitialState(){
        return {
            downloadUrl: null
        }
    },
    doDownload(){
        var self = this;
        let {doc} = this.props
        Parse.Cloud.run("getPresignedGetUrl", {
            documentId: doc.id
        }).then(result => {
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
        var {doc} = this.props;
        var link = doc.get("externalLink");
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
                            <span className="fileName">{doc.get("fileName")}</span>
                        </div>
                        <div>
                            <span className="uploadedBy">{RoostUtil.getFullName(doc.get("createdBy"))}</span>
                            <span className="createdAt">{this.formatDate(doc.createdAt)}</span>
                        </div>
                    </div>
                </a>
            </div>
        )
    }
})

export default DocumentLinkItem
