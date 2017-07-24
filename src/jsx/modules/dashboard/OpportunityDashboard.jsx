import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import RoostNav from "navigation/RoostNav"
import BetaUserWelcome from "BetaUserWelcome"
import {setShowArchived, searchOpportunities, setTemplateId, setExportCsvData, loadDashboard} from "ducks/dashboard"
import OpportunitiesTable from "OpportunitiesTable"
import ToggleButton from "ToggleButton"
import LoadingIndicator from "LoadingIndicator"
import SearchInput from "SearchInput"
import * as RoostUtil from "RoostUtil"
import {fetchUserPermissions} from "ducks/user"
import * as Template from "models/Template"
import * as Deal from "models/Deal"
import {denormalize} from "normalizr"
import DashboardPaywall from "DashboardPaywall"
import {loadSettings} from "ducks/accountSettings"

class OpportunityDashboard extends React.Component{
    static propTypes = {
        showTable: PropTypes.bool.isRequired,
        userId: PropTypes.string.isRequired,
        isLoading: PropTypes.bool.isRequired,
        currentUser: PropTypes.object,
        templates: PropTypes.arrayOf(PropTypes.object),
        templatesLoading: PropTypes.bool,
        archivedTemplates: PropTypes.arrayOf(PropTypes.object)
    }
    componentWillMount(){
        this.props.loadData()
        document.title = "Reporting | OneRoost"
    }
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
        if (isLoading){
            return <LoadingIndicator message="Loading Dashboard" size="large"/>
        }
        else if (!hasAccess){
            return <DashboardPaywall/>
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
                    let departmentText = departmentMap[template.department] ? departmentMap[template.department].displayText : ""
                    return <option key={"template_selector_" + template.objectId + "_" + i} value={template.objectId} >{departmentText}</option>
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
}

const mapStateToProps = (state, ownProps) => {
    let dashboard = state.dashboard.toJS()
    let currentUser = RoostUtil.getCurrentUser(state)
    const accountState = state.accountSettings.toJS()
    const {departmentMap} = accountState
    const payment = state.payment.toJS()
    const config = state.config.toJS()
    const entities = state.entities.toJS()

    let userId = currentUser.objectId

    let isLoading = dashboard.isLoading
    let showTable = false
    let hasArchivedDeals = false

    if (isLoading){
        return {
            isLoading,
            showTable,
            hasArchivedDeals,
            hasAccess: true,
            currentUser,
            userId,
        }
    }

    // TODO set up a wrapper component to check for payment status
    let hasAccess = payment.currentPlanId || currentUser.admin
    if (!config.paymentEnabled){
        hasAccess = true
    }

    let templatesLoading = false;
    let templateIds = dashboard.templateIds || [];
    let templates = denormalize(templateIds, [Template.Schema], entities)
    let archivedTemplates = []
    let selectedTemplateId = dashboard.selectedTemplateId
    templates.sort((t1, t2) => {
        return t1.department.localeCompare(t2.department)
    })

    Object.values(dashboard.roosts).forEach(roost => {
        if (roost.archived){
            hasArchivedDeals = true;
        }
    })
    
    showTable = Object.values(dashboard.roosts).length > 0

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
    // const currentUser = Parse.User.current()
    // const userId = currentUser.id
    return {
        loadData: () => {
            dispatch(loadSettings())
            dispatch(fetchUserPermissions())
            // dispatch(loadOpportunities(userId))
            // dispatch(subscribeOpportunities(userId))
            // dispatch(loadTemplates(userId))
            dispatch(loadDashboard())
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
