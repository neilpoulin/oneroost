import React, { PropTypes } from "react"
import {connect} from "react-redux"
import {loadPages} from "ducks/brandSettingsAdmin"

const BrandPageSettings = React.createClass({
    propTypes: {
        loadPages: PropTypes.func.isRequired,
    },
    componentWillMount(){
        const {loadPages} = this.props
        loadPages()
    },
    render () {
        const {isLoading} = this.props
        return (
            <div className="BrandPageSettings">
                <h2>Brand Page Settings</h2>
                <div display-if={isLoading}>Loading....</div>
            </div>

        )
    }
})

const mapStateToProps = (state, ownProps) => {
    const brandSettingsAdmin = state.brandSettings;

    return {
        isLoading: brandSettingsAdmin.get("isLoading")
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadPages: () => dispatch(loadPages())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrandPageSettings)
