import React, { PropTypes } from "react"
import {connect} from "react-redux"
import {initialState, loadPage} from "ducks/companyPage"

const CustomCompanyPage = React.createClass({
    propTypes: {
        params: PropTypes.shape({
            companyName: PropTypes.string.isRequired
        }),
    },
    componentDidMount(){
        this.props.load();
    },
    render () {
        const {vanityUrl, isLoading, title, logoUrl} = this.props;
        return (
            <div>
                <div>Custom Company Page Container: {vanityUrl}</div>
                <div>is loading: {isLoading ? "Yep" : "Nope"}</div>
                <div>Title: {title}</div>
                <div>LogoUrl: {logoUrl}</div>
            </div>
        )
    }
})

const mapStateToProps = (state, ownProps) => {
    const {params} = ownProps;
    const vanityUrl = params.companyName
    const {companyPagesByUrl} = state;
    const companyPage = companyPagesByUrl.get(vanityUrl, initialState).toJS()
    return {
        vanityUrl,
        isLoading: companyPage.isLoading,
        title: companyPage.title,
        logoUrl: companyPage.logoUrl,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const vanityUrl = ownProps.params.companyName;
    return {
        load: () => {
            dispatch(loadPage(vanityUrl))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomCompanyPage)
