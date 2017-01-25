import React, { PropTypes } from "react"
import InvestmentForm from "InvestmentForm"
import {connect} from "react-redux"
import {updateDeal} from "ducks/roost"


const InvestmentSidebar = React.createClass({
  propTypes: {
    deal: PropTypes.object
  },
  render(){
    var {deal} = this.props;
    return (
      <div className="InvestmentSidebar">
        <h3 className="title">Investment</h3>
        <InvestmentForm deal={deal} updateDeal={this.props.updateDeal}/>
      </div>
    )
  }
});

const mapStateToProps = (state, ownprops) => {
    return {

    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        updateDeal: (changes, message) => dispatch(updateDeal(ownProps.deal, changes, message))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InvestmentSidebar)
