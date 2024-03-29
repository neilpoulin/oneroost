import React from "react"
import PropTypes from "prop-types"
import RoostNav from "RoostNav";
import Parse from "parse"
import LoadingTakeover from "LoadingTakeover"
import FourOhFourPage from "FourOhFourPage"
import ReactGA from "react-ga"
import { withRouter } from "react-router"
import Onboarding from "readyroost/Onboarding"
import {connect} from "react-redux"
import {loadTemplate} from "ducks/template"
import * as RoostUtil from "RoostUtil"
import {denormalize} from "normalizr"
import * as Template from "models/Template"
import * as log from "LoggingUtil"
// import {createReadyRoost} from "ducks/roost/roost"

const ReadyRoostPage = React.createClass({
    propTypes: {
        params: PropTypes.shape({
            templateId: PropTypes.string.isRequired
        }).isRequired,
        template: PropTypes.object,
        currentUser: PropTypes.object,
        isLoading: PropTypes.bool,
        department: PropTypes.shape({
            displayText: PropTypes.string.isRequired,
            categories: PropTypes.arrayOf(PropTypes.shape({
                displayText: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
                subCategories: PropTypes.arrayOf(PropTypes.shape({
                    displayText: PropTypes.string.isRequired,
                    value: PropTypes.string.isRequired,
                })),
            })).isRequired,
        })
    },
    getInitialState(){
        return {
            currentUser: Parse.User.current(),
            roostName: null,
            canSubmit: false,
            error: null,
            readyRoostUser: null,
            loading: true
        }
    },
    componentWillMount(){
        // this.fetchData(this.props.params.userId);
    },
    componentDidMount() {
        this.props.loadData()
    },
    componentWillUpdate(nextProps, nextState){
        if (this.props.params.userId !== nextProps.params.userId){
            let userId = nextProps.params.userId;
            this.fetchData(userId);
        }
    },
    loginSuccess(){
        log.info("login success");

        ReactGA.event({
            category: "ReadyRoost",
            action: "Log in"
        });
        this.setState({currentUser: Parse.User.current()});
    },
    logoutSuccess(){
        log.info("logout success")
        this.setState({currentUser: null})
    },
    createReadyRoost(){
        const {template} = this.props
        var self = this;
        Parse.Cloud.run("createReadyRoost", {
            templateId: template.objectId,
            roostName: self.state.roostName
        }).then(function(result){
            let createdRoost = result.toJSON()
            log.info("created ready roost, so happy", result);
            ReactGA.set({ userId: self.state.currentUser.objectId });
            ReactGA.event({
                category: "ReadyRoost",
                action: "Created ReadyRoost"
            });
            self.props.router.replace("/roosts/" + createdRoost.objectId);
        },
            function(error){
                log.error("can not create roost, already have one for this user", error);
                self.setState({error: {message: "You have already created a Roost for this user."}})
            })
    },
    handleNameChange(val){
        if(this.state.roostName != null && this.state.roostName.length > 1 && this.state.currentUser) {
            this.setState({canSubmit: true})
        }
        else {
            this.setState({canSubmit: false})
        }
    },
    render () {
        let {currentUser, template, isLoading, createReadyRoost, error, department} = this.props;

        if (isLoading){
            return <LoadingTakeover messsage={"Loading Profile"}/>
        }
        if(!template || error) {
            return <FourOhFourPage/>
        }

        var readyRoostUser = template.ownedBy;

        var page =
        <div className="ReadyRoostPage">
            <RoostNav showHome={false}></RoostNav>
            <div className="container col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
                <Onboarding
                    readyRoostUser={readyRoostUser}
                    currentUser={currentUser}
                    template={template}
                    createReadyRoost={createReadyRoost}
                    department={department}
                    />
            </div>
        </div>

        return page
    }
})

const mapStateToProps = (state, ownProps) => {
    const templates = state.templates.toJS()
    const templateId = ownProps.params.templateId
    const currentUser = RoostUtil.getCurrentUser(state)
    const departmentMap = state.config.get("departmentMap")
    let templateState = templates[templateId]
    let isLoading = true
    let template = null
    let department = null
    let error = null
    if (templateState && departmentMap){
        isLoading = templateState.isLoading;
        error = templateState.error;
        if (templateState.hasLoaded && !templateState.error){
            const entities = state.entities.toJS()
            template = denormalize(templateId, Template.Schema, entities)
            department = departmentMap.get(template.department).toJS()
        }
    }
    return {
        isLoading,
        template,
        error,
        currentUser,
        department,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const templateId = ownProps.params.templateId

    return {
        loadData: () => {
            dispatch(loadTemplate(templateId))
        },
        createReadyRoost: (roostName, callback) => {
            //TODO: this isn't quite ready yet
            log.warn("This isn't quite implemented yet")
            // dispatch(createReadyRoost(templateId, roostName, callback))
        }
    }
}
const connectOpts = {
    withRef: true
}

export default connect(mapStateToProps, mapDispatchToProps, undefined, connectOpts)(withRouter(ReadyRoostPage))
