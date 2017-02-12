import React, { PropTypes } from "react"
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

const ReadyRoostPage = React.createClass({
    propTypes: {
        params: PropTypes.shape({
            templateId: PropTypes.string.isRequired
        }).isRequired,
        template: PropTypes.object,
        currentUser: PropTypes.object,
        isLoading: PropTypes.bool,
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
        if ( this.props.params.userId !== nextProps.params.userId ){
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
        if( this.state.roostName != null && this.state.roostName.length > 1 && this.state.currentUser)
        {
            this.setState({canSubmit: true})
        }
        else {
            this.setState({canSubmit: false})
        }
    },
    render () {
        let {currentUser, template, isLoading} = this.props;

        if ( isLoading ){
            return <LoadingTakeover messsage={"Loading Profile"}/>
        }
        if( !template )
        {
            return <FourOhFourPage/>
        }

        var readyRoostUser = template.createdBy;

        var page =
        <div className="ReadyRoostPage">
            <RoostNav showHome={false}></RoostNav>
            <div className="container col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
                <Onboarding readyRoostUser={readyRoostUser} currentUser={currentUser} template={template}/>
            </div>
        </div>

        return page
    }
})

const mapStateToProps = (state, ownProps) => {
    const templates = state.templates.toJS()
    const templateId = ownProps.params.templateId
    const currentUser = RoostUtil.getCurrentUser(state)
    const entities = state.entities.toJS()
    let template = templates[templateId]
    let isLoading = true
    if ( template && template.hasLoaded ){
        isLoading = template.isLoading;
        template = denormalize(templateId, Template.Schema, entities)
    }
    return {
        isLoading,
        template,
        currentUser
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const templateId = ownProps.params.templateId
    return {
        loadData: () => {
            dispatch(loadTemplate(templateId))
        }
    }
}
const connectOpts = {
    withRef: true
}

export default connect(mapStateToProps, mapDispatchToProps, undefined, connectOpts)(withRouter(ReadyRoostPage))
