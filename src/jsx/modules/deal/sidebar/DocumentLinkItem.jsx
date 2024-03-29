import React from "react"
import PropTypes from "prop-types"
import Parse from "parse"
import * as RoostUtil from "RoostUtil"
import {formatDate} from "DateUtil"

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
        let {doc} = this.props
        Parse.Cloud.run("getPresignedGetUrl", {
            documentId: doc.objectId
        }).then(result => {
            self.setState({downloadUrl: result.url});
        });
    },
    getIconType(){
        //todo: figure out how to handle GSheets, etc.
        return "fa-external-link";
    },
    render () {
        var {doc} = this.props;
        let {externalLink, createdBy, createdAt, fileName} = doc;
        var link = externalLink
        if (link.indexOf("//") == -1){
            link = "http://" + link;
        }
        else if (link.indexOf("http") == -1){
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
                            <span className="fileName">{fileName}</span>
                        </div>
                        <div>
                            <span className="uploadedBy">{RoostUtil.getFullName(createdBy)}</span>
                            <span className="createdAt">{formatDate(createdAt)}</span>
                        </div>
                    </div>
                </a>
            </div>
        )
    }
})

export default DocumentLinkItem
