import React, { PropTypes } from "react"

const Confirmation = React.createClass({
    propTypes: {
        readyRoostUser: PropTypes.object.isRequired,
        currentUser: PropTypes.object,
        submit: PropTypes.func.isRequired,
        previousStep: PropTypes.func.isRequired,
        nextText: PropTypes.string.isRequired
    },
    getDefaultProps: function(){
        return {
            nextText: "Next"
        }
    },
    render () {
        let page =
        <div>
            <div>
                You're ready to start creating an opportunity
            </div>
            <div className="actions" >
                <button className="btn btn-outline-secondary" onClick={this.props.previousStep}>Previous Step</button>
                <button className="btn btn-primary" onClick={this.props.submit}>Submit</button>
            </div>
        </div>
        return page
    }
})

export default Confirmation
