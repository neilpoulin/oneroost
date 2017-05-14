import Parse from "parse"
import React, {PropTypes} from "react"
import { connect } from "react-redux"
import RoostNav from "navigation/RoostNav"
import BetaUserWelcome from "BetaUserWelcome"
import {loadOpportunities, subscribeOpportunities} from "ducks/opportunities"
import {setShowArchived, searchOpportunities, setTemplateId, setExportCsvData} from "ducks/dashboard"
import OpportunitiesTable from "OpportunitiesTable"
import ToggleButton from "ToggleButton"
import LoadingIndicator from "LoadingIndicator"
import SearchInput from "SearchInput"
import * as RoostUtil from "RoostUtil"
import {loadTemplates} from "ducks/userTemplates"
import {fetchUserPermissions} from "ducks/user"
import * as Template from "models/Template"
import * as Deal from "models/Deal"
import {denormalize} from "normalizr"
import DashboardPaywall from "DashboardPaywall"
import {loadSettings} from "ducks/accountSettings"

const OpportunityDashboard = React.createClass({
    propTypes: {
        showTable: PropTypes.bool.isRequired,
        userId: PropTypes.string.isRequired,
        isLoading: PropTypes.bool.isRequired,
        currentUser: PropTypes.object,
        templates: PropTypes.arrayOf(PropTypes.object),
        templatesLoading: PropTypes.bool,
        archivedTemplates: PropTypes.arrayOf(PropTypes.object)
    },
    componentDidMount(){
        this.props.loadData()
        document.title = "Reporting | OneRoost"
    },
    render () {
        const {showTable,
            userId,
            isLoading,
            setShowArchived,
            showArchived,
            hasArchivedDeals,
            currentUser,
            templates,
            templatesLoading,
            archivedTemplates,
            selectedTemplateId,
            doSearch,
            csvData,
            setExportCsvData,
            hasAccess,
            setTemplateId,
            departmentMap,
            } = this.props
        let contents = null
        if (!hasAccess){
            return <DashboardPaywall/>
        }
        else if (isLoading){
            contents = <LoadingIndicator message="Loading Dashboard" size="large"/>
        }
        else if (!showTable){
            contents = <BetaUserWelcome emailVerified={currentUser.emailVerified} userId={userId} templates={templates} templatesLoading={templatesLoading} archivedTemplates={archivedTemplates}/>
        }
        else{
            contents = <OpportunitiesTable userId={userId} currentUser={currentUser} exportCsvData={setExportCsvData}/>
        }

        let toggleArchivedButton = null
        if (hasArchivedDeals){
            toggleArchivedButton =
            <ToggleButton
                label={"Show Archived: " + (showArchived ? "on" : "off")}
                onClick={setShowArchived}
                activeType="link"
                className="btn-sm"
                inactiveType={"link"}
                block={false}
                active={showArchived} />
        }
        let templateSelector = null
        let selectedTemplate = templates.find(temp => temp.objectId === selectedTemplateId)
        let exportButton = null;
        if (selectedTemplate && csvData){
            exportButton = <a href={encodeURI(csvData)} download={selectedTemplate.title + ".csv"} className="btn btn-success">Export</a>
        }

        if (templates){
            templateSelector =
            <select className="TemplateSelector" onChange={e => {
                setTemplateId(e.target.value)
            }} value={selectedTemplateId || ""}>
                <option value="">-- Show All --</option>
                {templates.map((template, i) => {
                    return <option key={"template_selector_" + template.objectId + "_" + i} value={template.objectId} >{departmentMap[template.department].displayText}</option>
                })}
            </select>
        }
        return (
            <div className="OpportunityDashboard">
                <RoostNav showHome={false}/>
                <div className="secondaryNav container">
                    <h2 className="hidden-sm hidden-xs">Dashboard</h2>
                    <div className="actions">
                        <SearchInput
                            onKeyUp={doSearch}
                            onSearch={doSearch}
                            />
                        {templateSelector}
                        {exportButton}
                        {toggleArchivedButton}
                    </div>

                </div>
                <div className="dashboard-body container table-responsive">
                    {contents}
               </div>
            </div>
        )
    }
})

const mapStateToProps = (state, ownProps) => {
    let dashboard = state.dashboard.toJS()
    let currentUser = RoostUtil.getCurrentUser(state)
    const accountState = state.accountSettings.toJS()
    const {departmentMap} = accountState
    const payment = state.payment.toJS()
    const config = state.config.toJS()

    let hasAccess = payment.currentPlanId || currentUser.admin
    if (!config.paymentEnabled){
        hasAccess = true
    }
    let userId = currentUser.objectId
    let myOpportunities = state.opportunitiesByUser.get(userId)
    const entities = state.entities.toJS()
    let isLoading = accountState.isLoading
    let showTable = false
    let hasArchivedDeals = false
    let templates = []

    if (myOpportunities && !accountState.isLoading){
        myOpportunities = myOpportunities.toJS()
        isLoading = myOpportunities.isLoading
        showTable = myOpportunities.deals.length > 0 || myOpportunities.archivedDeals.length > 0
        hasArchivedDeals = myOpportunities.archivedDeals.length > 0
        let deals = denormalize(myOpportunities.deals, [Deal.Schema], entities)
        let dealTemplates = deals.filter(deal => !!deal.template).map(deal => deal.template)
        dealTemplates.forEach(dealTempalte => {
            let existing = templates.find(t => {
                return t.objectId === dealTempalte.objectId
            })
            if (!existing){
                templates.push(dealTempalte)
            }
        })
    }

    let templatesLoading = false;

    let archivedTemplates = []
    let selectedTemplateId = dashboard.selectedTemplateId
    if (!accountState.isLoading){
        let myTemplateIds = accountState.templateIds.filter(id => {
            return !templates.find(t => {
                return t.objectId === id
            })
        })
        templates = templates.concat(denormalize(myTemplateIds, [Template.Schema], entities))
        templates.sort((t1, t2) => {
            return t1.department.localeCompare(t2.department)
        })

        archivedTemplates = denormalize(accountState.archivedTemplateIds, [Template.Schema], entities)
    }

    return {
        showTable,
        currentUser,
        userId,
        isLoading: isLoading || !currentUser,
        showArchived: dashboard.showArchived,
        selectedTemplateId,
        hasArchivedDeals,
        templates,
        templatesLoading,
        archivedTemplates,
        csvData: dashboard.csvData,
        hasAccess,
        departmentMap,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const currentUser = Parse.User.current()
    const userId = currentUser.id
    return {
        loadData: () => {
            dispatch(loadSettings())
            dispatch(fetchUserPermissions())
            dispatch(loadOpportunities(userId))
            dispatch(subscribeOpportunities(userId))
            dispatch(loadTemplates(userId))
        },
        setShowArchived: (show) => {
            dispatch(setShowArchived(show))
        },
        doSearch: (query) => {
            dispatch(searchOpportunities(query))
        },
        setTemplateId: (templateId) => {
            dispatch(setTemplateId(templateId))
        },
        setExportCsvData: (data) => {
            dispatch(setExportCsvData(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OpportunityDashboard)
