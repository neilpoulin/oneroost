import React, {PropTypes} from "react"
import OpportunityList from "account/OpportunityList"
import AddAccountButton from "account/AddAccountButton"

export default React.createClass({
    propTypes: {
        deals: PropTypes.arrayOf(PropTypes.object).isRequired,
        archivedDeals: PropTypes.arrayOf(PropTypes.object)
    },
    getDefaultProps: function(){
        return {
            isMobile: false,
            deals: [],
            archivedDeals: [],
        }
    },
    onSuccess: function(){

    },
    render () {
        var {deals} = this.props;

        return (
            <div id={"accountSidebar" + (this.props.isMobile ? "Mobile" : "")} className="container-fluid hidden-sm hidden-xs">
                <h3>Opportunities</h3>
                <OpportunityList deals={deals} />
                <AddAccountButton
                    btnClassName="btn-outline-secondary btn-block"
                    onSuccess={this.onSuccess}
                    >
                    <i className="fa fa-plus">Create Account</i>
                </AddAccountButton>

            </div>
        )
    }
})
