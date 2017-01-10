import React, { PropTypes } from "react"
import Parse from "parse"
import RoostNav from "RoostNav"
import Logo from "Logo"

const Unsubscribe = React.createClass({
    propTypes:{
        params: PropTypes.shape({
            emailRecipientId: PropTypes.string.isRequired
        })
    },
    getInitialState()
    {
        return {
            success: false,
            loading: true,
            recipient: null,
        }
    },
    fetchData(recipientId){
        let self = this;
        let recipientQuery = new Parse.Query("EmailRecipient");
        recipientQuery.get(recipientId).then(recipient => {
            self.setState({
                loading: false,
                recipient: recipient,
                success: recipient.get("unsubscribe")
            });
        }).catch(error => {
            console.log("failed to get a recipient", error);
            self.setState({
                loading: false,
                recipient: null
            });
        })
    },
    componentWillMount(){
        this.fetchData(this.props.params.emailRecipientId);
    },
    componentWillUpdate(nextProps, nextState){
        if ( this.props.params.emailRecipientId !== nextProps.params.emailRecipientId ){
            let emailRecipientId = nextProps.params.emailRecipientId;
            this.setState({
                loading: true,
                recipient: null
            });
            this.fetchData(emailRecipientId)
        }
    },
    confirm(){
        console.log("will unsubscribe from all emails.");
        let self = this;
        var recipient = this.state.recipient;
        this.setState({loading: true});
        recipient.set({
            unsubscribe: true,
            unsubscribeDate: new Date()
        });
        recipient.save().then(success => {
            self.setState({
                success: true,
                loading: false,
            });
        }).catch(error => console.error("failed to save recipient", error));
    },
    render () {
        var content = null;
        let {recipient, loading, success} = this.state;
        if ( success ){
            content =
            <div className="lead text-center">
                {"You have successfully unsubscribed from OneRoost emails."}
            </div>
        }
        else if (loading){
            content = "Loading..."
        }
        else if ( !recipient ){
            content =
            <div>
                {"User not found, if this is in error, please conact "} <a href="mailto:info@oneroost.com">info@oneroost.com</a>
            </div>
        }
        else {
            let email = recipient.get("email");
            if ( recipient.unsubscribe )
            {
                content = <div>{`${email} is already unsubscribed from all OneRoost emails.`}</div>
            }
            else {
                content =
                <div>
                    <p className="lead text-center">
                        {"Please confirm you would like to unsubscribe "}<b>{email}</b>{" from all OneRoost emails"}
                    </p>
                    <button onClick={this.confirm} className="btn btn-primary btn-block" >Unsubscribe</button>
                </div>;
            }
        }
        let page =
        <div className="Unsubscribe container col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3">
            <RoostNav/>
            <Logo className="header"/>
            {content}
        </div>
        return page;

    }
})

export default Unsubscribe;
