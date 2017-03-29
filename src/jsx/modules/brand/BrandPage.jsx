import React, { PropTypes } from "react"
import {connect} from "react-redux"
import {initialState, loadPage} from "ducks/brand"
import LoadingTakeover from "LoadingTakeover"
import TemplateLink from "TemplateLink"
import {Link} from "react-router"
import FourOhFourPage from "FourOhFourPage"

const BrandPage = React.createClass({
    propTypes: {
        params: PropTypes.shape({
            vanityUrl: PropTypes.string.isRequired
        }),
    },
    componentDidMount(){
        this.props.load();
    },
    render () {
        const {isLoading, logoUrl, templates, pageTitle, error} = this.props;
        if (error){
            return <FourOhFourPage/>
        }

        if (isLoading){
            return <LoadingTakeover/>
        }
        let $title = null
        if (pageTitle){
            $title = <span className="title">{pageTitle}</span>
        }
        let $logo = null
        if (logoUrl){
            $logo = <img src={logoUrl} className="brandLogo"></img>
        }

        return (
            <div className="BrandPage container">
                <div className="header">
                    {$logo}
                    {$title}
                </div>

                <div className="intro lead">
                    <b>Marketing Vendor Categories:</b> Begin proposal process by clicking into a category
                </div>
                <div className="categories">
                    {templates.map((template, i) => {
                        return <TemplateLink key={`brand_template_${i}`} template={template} />
                    })}
                </div>
                <footer>
                    <Link to={"/"} className="roostLink">Powered By <span className="logo">OneRoost</span></Link>
                </footer>

            </div>
        )
    }
})

const mapStateToProps = (state, ownProps) => {
    const {params} = ownProps;
    const vanityUrl = params.vanityUrl
    const {brandsByUrl} = state;
    const brand = brandsByUrl.get(vanityUrl, initialState).toJS()
    return {
        vanityUrl,
        isLoading: brand.isLoading,
        logoUrl: brand.logoUrl,
        error: brand.error,
        templates: brand.templates,
        companyName: brand.companyName,
        pageTitle: brand.pageTitle,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const vanityUrl = ownProps.params.vanityUrl;
    return {
        load: () => {
            dispatch(loadPage(vanityUrl))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrandPage)
