import React, { PropTypes } from "react"

export const BEST_VALUE = "BEST_VALUE"
export const MOST_POPULAR = "MOST_POPULAR"
const FREE_TRIAL_TEXT = "1 month FREE trial"

const PlanWidget = React.createClass({
    propTypes: {
        features: PropTypes.arrayOf(PropTypes.string),
        name: PropTypes.string,
        price: PropTypes.number,
        period: PropTypes.string,
        panelType: PropTypes.oneOf(["info", "primary", "secondary", "warning", "success"]),
        showCornerFlash: PropTypes.bool,
        cornerFlashType: PropTypes.oneOf([BEST_VALUE, MOST_POPULAR]),
        showFreeTrial: PropTypes.bool,
    },
    getDefaultProps(){
        return {
            features: [],
            period: "month",
            price: 0,
            panelType: "primary",
            showCornerFlash: false,
            cornerFlashType: BEST_VALUE,
            showFreeTrial: false,
        }
    },
    getCornerFlash(type){
        switch (type) {
            case BEST_VALUE:
                return <span>BEST <br/>VALUE</span>
            case MOST_POPULAR:
                return <span>MOST<br/>POPULAR</span>
            default:
                return null;
        }
    },
    render () {
        const {features, name, price, period, panelType, showCornerFlash, cornerFlashType, showFreeTrial} = this.props
        let priceLabel = <span>${price}<span className="subscript">/{period}</span></span>
        if ( price === 0 ){
            priceLabel = <span>Free!</span>
        }
        let cornerFlash = null;
        if ( showCornerFlash ){
            cornerFlash = <div className="cnrflash">
                    <div className="cnrflash-inner">
                        <span className="cnrflash-label">
                            {this.getCornerFlash(cornerFlashType)}
                        </span>
                    </div>
                </div>
        }
        let freeTrial = null
        if ( showFreeTrial){
            freeTrial = <small>{FREE_TRIAL_TEXT}</small>
        }

        return (
            <div className={`PlanWidget panel panel-${panelType}`}>
                {cornerFlash}
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
                        {freeTrial}
                    </div>
                    <table className="table">
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
                    <span className="btn btn-success" role="button">Sign Up</span>                    
                </div>
            </div>
        )
    }
})

export default PlanWidget
