import React, { PropTypes } from "react"

const PlanWidget = React.createClass({
    propTypes: {
        features: PropTypes.arrayOf(PropTypes.string),
        name: PropTypes.string,
        price: PropTypes.number,
        period: PropTypes.string,
        panelType: PropTypes.oneOf(["info", "primary", "secondary", "warning", "success"])
    },
    getDefaultProps(){
        return {
            features: [],
            period: "month",
            price: 0,
            panelType: "primary"
        }
    },
    render () {
        const {features, name, price, period, panelType} = this.props
        let priceLabel = <span>${price}<span className="subscript">/{period}</span></span>
        if ( price === 0 ){
            priceLabel = <span>Free!</span>
        }
        return (
            <div className={`PlanWidget panel panel-${panelType}`}>
                <div className="panel-heading">
                    <h3 className="panel-title">
                        {name}
                    </h3>
                </div>
                <div className="panel-body">
                    <div className="the-price">
                        <h1>
                            {priceLabel}
                        </h1>
                        <small>1 month FREE trial</small>
                    </div>
                    <table className="table table-striped">
                        <tbody>
                            {features.map((feature, i) =>
                                <tr key={`${name}_row_${i}`}>
                                    <td>
                                        {feature}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="panel-footer">
                    <span className="btn btn-success" role="button">Sign Up</span> 1 month FREE trial</div>
            </div>
        )
    }
})

export default PlanWidget
