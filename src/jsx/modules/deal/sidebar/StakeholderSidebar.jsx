import React, { PropTypes } from "react"
import AddStakeholderButton from "AddStakeholderButton";
import Parse from "parse";
import Stakeholder from "Stakeholder"

const StakeholderSidebar = React.createClass({
    propTypes: {
        deal: PropTypes.instanceOf(Parse.Object),
        stakeholders: PropTypes.arrayOf(PropTypes.instanceOf(Parse.Object)),
    },
    getInitialState(){
        return {
            isEdit: false
        }
    },
    refreshStakeholders()
    {
        // this.refreshQueries(["stakeholders"]);
        console.warn("NO REFRESH STAKEHOLDERS IMPLEMENTED");
    },
    toggleEditStakeholders(){
        this.setState({isEdit: !this.state.isEdit});
    },
    render () {

        var {deal, stakeholders} = this.props;
        var isEdit = this.state.isEdit;
        var actionButton = <button className="btn btn-outline-secondary" onClick={this.toggleEditStakeholders}><i className="fa fa-minus"></i>&nbsp;Remove</button>
        if ( isEdit ){
            actionButton = <button className="btn btn-secondary" onClick={this.toggleEditStakeholders}><i className="fa fa-check"></i>&nbsp;Done</button>
        }

        return (
            <div className="StakeholderSidebar">
                <h3 className="title">Participants</h3>
                <div className="stakeholder-actions">
                    {actionButton}
                    <AddStakeholderButton deal={deal}
                        btnClassName={"btn-primary btn-block " + (isEdit ? "disabled" : null)}
                        onSuccess={this.refreshStakeholders}
                        disabled={isEdit}
                        />
                </div>
                <div>
                    {stakeholders.map(stakeholder => {
                        return <Stakeholder key={"stakeholder_" + stakeholder.id}
                            stakeholder={stakeholder}
                            deal={deal}
                            isEdit={isEdit}/>
                    })}
                </div>
            </div>
        )
    }
});

export default StakeholderSidebar
