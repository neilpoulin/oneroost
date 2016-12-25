import React from "react"
import Parse from "parse"

const FAQ = React.createClass({
    getInitialState(){
        return {
            loading: true,
            faqs: []
        }
    },
    componentWillMount(){
        let self = this;
        Parse.Config.get().then((config) => {
            self.setState({
                loading: false,
                faqs: config.get("faqs")
            });
        });
    },
    render () {
        let sections = this.state.faqs.map((faq, index) =>{
            return (
                <section key={faq + "_" + index}>
                    <label className="question">
                        {faq.question}
                    </label>
                    <p className="answer">
                        {faq.answer}
                    </p>
                </section>)
            }
        )
        if ( this.state.loading ){
            sections =
            <div>
                <i className="fa fa-spin fa-spinner"></i> Loading FAQs
            </div>
        }

        let faq =
        <div className="FAQ">
            {sections}
        </div>
        return faq;
    }
})

export default FAQ
