import React, { PropTypes } from "react"
import {connect} from "react-redux"
import {selectPlan} from "ducks/payment"
import StripeCheckout from "react-stripe-checkout"

export const BEST_VALUE = "BEST_VALUE"
export const MOST_POPULAR = "MOST_POPULAR"

const PlanWidget = React.createClass({
    propTypes: {
        features: PropTypes.arrayOf(PropTypes.string),
        name: PropTypes.string,
        price: PropTypes.number,
        period: PropTypes.string,
        panelType: PropTypes.oneOf(["info", "primary", "secondary", "warning", "success"]),
        showCornerFlash: PropTypes.bool,
        cornerFlashType: PropTypes.oneOf([BEST_VALUE, MOST_POPULAR]),
        freeTrial: PropTypes.shape({
            duration: PropTypes.number,
            period: PropTypes.string
        }),
        stripePlanId: PropTypes.string,
    },
    getDefaultProps(){
        return {
            features: [],
            period: "month",
            price: 0,
            panelType: "primary",
            showCornerFlash: false,
            cornerFlashType: BEST_VALUE,
            freeTrial: null,
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
    getFreeTrialText(){
        const {freeTrial} = this.props

        return `${freeTrial.duration} ${freeTrial.period.toLowerCase()} FREE trial`
    },
    choosePlan(){
        const {stripePlanId, selectPlan} = this.props;
        selectPlan(stripePlanId);
    },
    onToken(token){
        const {stripePlanId, selectPlan} = this.props;
        selectPlan(stripePlanId, token)
    },
    render () {
        const {features,
            name,
            price,
            period,
            panelType,
            showCornerFlash,
            cornerFlashType,
            freeTrial,
            isSelected,
            isCurrentPlan,
            isLoggedIn,
            canSelectPlan} = this.props
            let priceLabel = <span>${price}<span className="subscript">/{period.toLowerCase()}</span></span>
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
            let freeTrialInfo = null
            if (freeTrial){
                freeTrialInfo = <small>{this.getFreeTrialText()}</small>
            }

            let stripe = <StripeCheckout
                name={"OneRoost"}
                description={name}
                ComponentClass="div"
                panelLabel="Submit"
                amount={price * 100}
                currency="USD"
                stripeKey={OneRoost.Config.stripePublishKey}
                locale="auto"
                zipCode={false}
                allowRememberMe
                token={this.onToken}
                reconfigureOnUpdate={false}
                >
                <button className="btn btn-primary">
                    Choose {name}
                </button>
            </StripeCheckout>

            let footerCta = canSelectPlan ? stripe : null
            if ( isCurrentPlan ){
                let changePlanMessage = null
                if (!canSelectPlan){
                    changePlanMessage = <p>If you would like to change your plan, please contact <a href="support@oneroost.com">support@oneroost.com</a></p>
                }
                footerCta =
                <div className="currentPlanLabel">
                    <p className="lead">This is your current plan</p>
                    {changePlanMessage}
                </div>
            }

            let footer = null
            if ( footerCta && isLoggedIn ){
                footer =
                <div className="panel-footer">
                    {footerCta}
                </div>
            }
            const activeClass = isSelected ? "active" : ""

            return (
                <div className={`PlanWidget panel panel-${panelType} ${activeClass}`}>
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
                            {freeTrialInfo}
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
                    {footer}
                </div>
            )
        }
    })

    const mapStateToProps = (state, ownProps) => {
        const payment = state.payment.toJS();
        const user = state.user.toJS()
        const isSelected = payment.selectedPlanId == ownProps.stripePlanId && ownProps.stripePlanId != null
        const isCurrentPlan = payment.currentPlanId == ownProps.stripePlanId;
        const isLoggedIn = user.isLoggedIn
        return {
            isSelected,
            isCurrentPlan,
            canSelectPlan: !payment.currentPlanId && isLoggedIn,
            isLoggedIn,
        }
    }

    const mapDispatchToProps = (dispatch, ownProps) => {
        return {
            selectPlan: (planId, token) => {
                dispatch(selectPlan(planId, token))
            },
        }
    }

    export default connect(mapStateToProps, mapDispatchToProps)(PlanWidget)
