import React, { PropTypes } from "react"
import {connect} from "react-redux"

const CustomCompanyPage = React.createClass({
    propTypes: {
        params: PropTypes.shape({
            companyName: PropTypes.string.isRequired
        }),
    },
    render () {
        const {companyName} = this.props;
        return (
            <div>Custom Company Page Container: {companyName}</div>
        )
    }
})

const mapStateToProps = (state, ownProps) => {
    const {params} = ownProps;

    return {
        companyName: params.companyName
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomCompanyPage)
