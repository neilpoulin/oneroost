import React from "react"
import PropTypes from "prop-types"

const Confirmation = React.createClass({
    propTypes: {
        readyRoostUser: PropTypes.object.isRequired,
        currentUser: PropTypes.object,
        submit: PropTypes.func.isRequired,
        previousStep: PropTypes.func.isRequired,
        nextText: PropTypes.string.isRequired,
        error: PropTypes.any,
    },
    getDefaultProps: function(){
        return {
            nextText: "Next"
        }
    },
    render () {
        const {error, previousStep, submit} = this.props;
        let page =
        <div>
            <div display-if={error}>
                {error.message}
            </div>
            <div className="lead">
                You're ready to start creating an opportunity
            </div>
            <div className="actions" >
                <button className="btn btn-outline-secondary" onClick={previousStep}>Previous Step</button>
                <button className="btn btn-primary" onClick={submit}>Submit</button>
            </div>
        </div>
        return page
    }
})

export default Confirmation
