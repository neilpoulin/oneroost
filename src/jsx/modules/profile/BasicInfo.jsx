import React, { PropTypes } from "react"
import BasicInfoDisplay from "profile/BasicInfoDisplay"
import BasicInfoForm from "profile/BasicInfoForm"

const BasicInfo = React.createClass({
    propTypes: {
        user: PropTypes.object.isRequired
    },
    getInitialState(){
        return{
            isEdit: false
        }
    },
    doEdit(){
        this.setState({isEdit: true});
    },
    doDisplay(){
        this.setState({isEdit: false});
    },
    render () {
        if ( this.state.isEdit ){
            return <BasicInfoForm user={this.props.user} doCancel={this.doDisplay} doSave={this.doDisplay}/>
        }
        return <BasicInfoDisplay user={this.props.user} doEdit={this.doEdit}/>
    }
})

export default BasicInfo
