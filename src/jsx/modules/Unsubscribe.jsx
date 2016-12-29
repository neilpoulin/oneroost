import React, { PropTypes } from "react"
import Parse from "parse";
import ParseReact from "parse-react";

const Unsubscribe = React.createClass({
    mixins: [ParseReact.Mixin],
    propTypes:{
        params: PropTypes.shape({
            emailRecipientId: PropTypes.string.isRequired
        })
    },
    getInitialState()
    {
        return {
            success: false
        }
    },
    observe(props, state){
        var recipientQuery = new Parse.Query("EmailRecipient");
        recipientQuery.equalTo("objectId", props.params.emailRecipientId);
        return {
            recipients: recipientQuery
        }
    },
    confirm(){
        console.log("will unsubscribe from all emails.");

        var recipient = this.data.recipients[0];

        ParseReact.Mutation.Set(recipient, {
            unsubscribe: true,
            unsubsribeDate: new Date()
        })
        .dispatch();
        this.setState({success: true});
    },
    render () {
        var content = null
        if ( this.state.success ){
            content =
            <div>
                You have successfully unsubscribed from OneRoost emails.
            </div>
        }
        else if ( this.pendingQueries().length > 0 ){
            content = "Loading..."
        }
        else if ( this.data.recipients.length == 0 ){
            content = <div>
                User not found, if this is in error, please conact info@oneroost.com
            </div>

        }
        else {
            var recipient = this.data.recipients[0];
            if ( recipient.unsubscribe )
            {
                content = <div>{recipient.email} is already unsubscribed from all OneRoost emails.</div>
            }
            else {
                content =
                <div>
                    <p>
                        Please confirm you would like to unsubscribe {recipient.email} from all emails from OneRoost.com
                    </p>
                    <button onClick={this.confirm} className="btn btn-primary btn-block" >Unsubscribe</button>
                </div>;
            }
        }

        return <div className="Unsubscribe container col-md-6 col-md-offset-3">
            <div>
                <h1 className="logo cursive">
                    OneRoost
                </h1>
            </div>
            {content}
        </div>;

    }
})

export default Unsubscribe;
