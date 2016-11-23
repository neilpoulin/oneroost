import React from "react"

const EmailTemplates = React.createClass({
    render () {
        var page =
        <div>
            <div className="container">
                <h1>Email Templates</h1>
                <div className="adminNav">
                    <ul className="list-group">
                        {OneRoost.Config.emailTemplates.map(function(template){
                            return <li className="list-group-item" key={"tempalte_" + template}><a href={"/admin/emails/" + template}>{template}</a></li>
                        })}
                    </ul>
                </div>
            </div>
        </div>

        return page;
    }
})

export default EmailTemplates
