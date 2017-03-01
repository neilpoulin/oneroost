import React, { PropTypes } from "react"
import PlanWidget from "PlanWidget"

const features = ["Yearly 1", "yearly 2"]
const planName = "Yearly"

const YearlyWidget = React.createClass({
    render () {

        const oldWidget = <div className="panel panel-info">
            <div className="panel-heading">
                <h3 className="panel-title">
                    Gold</h3>
            </div>
            <div className="panel-body">
                <div className="the-price">
                    <h1>
                        $35<span className="subscript">/mo</span></h1>
                    <small>1 month FREE trial</small>
                </div>
                <table className="table">
                    <tr>
                        <td>
                            5 Account
                        </td>
                    </tr>
                    <tr className="active">
                        <td>
                            20 Project
                        </td>
                    </tr>
                    <tr>
                        <td>
                            300K API Access
                        </td>
                    </tr>
                    <tr className="active">
                        <td>
                            500MB Storage
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Custom Cloud Services
                        </td>
                    </tr>
                    <tr className="active">
                        <td>
                            Weekly Reports
                        </td>
                    </tr>
                </table>
            </div>
            <div className="panel-footer">
                <a href="http://www.jquery2dotnet.com" className="btn btn-success" role="button">Sign Up</a> 1 month FREE trial</div>
        </div>

        return <PlanWidget name={planName} features={features} price={150} period="year" panelType="success"/>

    }
})

export default YearlyWidget
