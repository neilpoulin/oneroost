import React, { PropTypes } from "react"
import {connect} from "react-redux"
import {loadPages} from "ducks/brandSettingsAdmin"
import {denormalize} from "normalizr"
import * as BrandPage from "models/BrandPage"
import * as Template from "models/Template"
import BrandPageForm from "settings/BrandPageForm"
import {loadSettings} from "ducks/accountSettings"
import {Set} from "immutable"

const BrandPageSettings = React.createClass({
    propTypes: {
        loadPages: PropTypes.func.isRequired,
    },
    componentWillMount(){
        const {loadPages} = this.props
        loadPages()
    },
    render () {
        const {isLoading, brands, templateOptions} = this.props
        return (
            <div className="BrandPageSettings">
                <h2>Brand Page Settings</h2>
                <div display-if={isLoading}>Loading....</div>
                <div display-if={!isLoading && brands}>
                    {brands.map((brand, i) => <BrandPageForm key={`brand_${i}`} brand={brand} templateOptions={templateOptions}/>)}
                </div>
            </div>

        )
    }
})

const mapStateToProps = (state, ownProps) => {
    const brandSettingsAdmin = state.brandSettings
    const accountSettings = state.accountSettings

    if (brandSettingsAdmin.get("isLoading") || accountSettings.get("isLoading")){
        return {
            isLoading: true
        }
    }

    const entities = state.entities.toJS()
    const brandsById = brandSettingsAdmin.get("brandPageSettingsById")
    const [...brandIds] = brandsById.keys()
    const brands = denormalize(brandIds, [BrandPage.Schema], entities)
    const templates = denormalize(accountSettings.get("templateIds", Set()).toJS(), [Template.Schema], entities)
    const templateOptions = templates.map(({objectId, title}) => ({value: objectId, displayText: title})).sort((opt1, opt2) => opt1.displayText.localeCompare(opt2.displayText))
    return {
        isLoading: false,
        brands,
        templateOptions,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadPages: () => {
            dispatch(loadPages())
            dispatch(loadSettings())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrandPageSettings)