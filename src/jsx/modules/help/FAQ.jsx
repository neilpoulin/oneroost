import React from "react"

const FAQ = React.createClass({
    render () {
        let faq =
        <div className="FAQ">
            <section>
                <label className="question">
                    {"What is OneRoost?"}
                </label>
                <p className="answer">
                    {"OneRoost was created to get buyers and sellers on the same page (literally) regarding B2B opportunities."}
                </p>
            </section>
            <section>
                <label className="question">
                    {"What is a Roost?"}
                </label>
                <p className="answer">
                    {"A Roost is where a seller can present their offering in a thorough and straightforward manner.  Think of a Roost as the opportunity’s headquarters, where a seller can do the following: start a conversation with the buyer, submit documents, create next steps, and invite the appropriate stakeholders."}
                </p>
            </section>
            <section>
                <label className="question">
                    {"What is a Ready Roost?"}
                </label>
                <p className="answer">
                    {"Ready Roost’s are preconfigured Roosts set up by the buyer who will review the opportunity.  "}
                </p>
            </section>
            <section>
                <label className="question">
                    {"Who should be invited to a Roost in the “Participants” section?"}
                </label>
                <p className="answer">
                    {"Anyone who needs to be involved in the decision process.  There is no limit to how many participants you invite."}
                </p>
            </section>
            <section>
                <label className="question">
                    {"Is there a limit on how many “Next Steps” I can create? "}
                </label>
                <p className="answer">
                    {"Nope.  But we recommend capping Next Steps at 5 to not overwhelm the buyer and to keep things moving.  You can always add more Next Steps and all completed Next Steps are accessible by clicking the check mark.  "}
                </p>
            </section>
            <section>
                <label className="question">
                    {"Do I really need to put the price of my offering in the “Investment” section? "}
                </label>
                <p className="answer">
                    {"We recommend you do but it is totally up to the seller."}
                </p>
            </section>
            <section>
                <label className="question">
                    {"How do you know which Opportunity Stage a particular Roost is currently in?"}
                </label>
                <p className="answer">
                    {"Opportunity Exploration – Introductions, need assessments, offering overviews"}<br/>
                    {"Diving into the Details – Evaluating offering/need fit, investment discussions, KPIs"}<br/>
                    {"Business Approvals – Budget confirmation, decision maker approval, legal review"}
                </p>
            </section>
            <section>
                <label className="question">
                    {"Can I create Opportunities (Roosts) for other companies? "}
                </label>
                <p className="answer">
                    {"Yes!  On the left side of every Roost, you have the ability to create an entirely new Opportunity (Roost) – this goes for buyers and sellers.  All you need to do is click “+Create Opportunity” and input the client and Opportunity name."}
                </p>
            </section>
            <section>
                <label className="question">
                    {"What kind of documents can I upload? "}
                </label>
                <p className="answer">
                    {"Excel spreadsheets, Power Points, Word documents, PDFs, and PNGs."}
                </p>
            </section>
            <section>
                <label className="question">
                    {"Are Roosts secure and hidden from the public? "}
                </label>
                <p className="answer">
                    {"Yes!  Only invited participants can see a Roost.  All passwords are encrypted and the links are randomized.  "}
                </p>
            </section>
        </div>
        return faq;
    }
})

export default FAQ
