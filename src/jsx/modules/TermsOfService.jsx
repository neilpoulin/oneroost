import React from "react"

const TermsOfService = React.createClass({
    render () {
        const domain = "https://www.oneroost.com";
        const privacyUrl = `${domain}/privacy`
        const contactEmail = "info@oneroost.com"

        const terms = <div className="TermsOfService">
            <section>
                <p>
                    {"PLEASE READ THESE TERMS OF USE CAREFULLY BEFORE USING THE SERVICES OFFERED BY ONEROOST, LLC (“ONEROOST,” “WE,” “US,” “OUR”). BY VISITING THE WEBSITE OR USING THE SERVICES IN ANY MANNER, YOU AGREE THAT YOU HAVE READ AND AGREE TO BE BOUND BY AND A PARTY TO THE TERMS AND CONDITIONS OF THIS AGREEMENT AND SUCH SUPPLEMENTAL TERMS NOTIFIED TO YOU FROM TIME TO TIME THAT APPLY TO SPECIFIC SERVICES SELECTED BY YOU (TOGETHER THE “AGREEMENT”) TO THE EXCLUSION OF ALL OTHER TERMS. IF THE TERMS OF THIS AGREEMENT ARE CONSIDERED AN OFFER, ACCEPTANCE IS EXPRESSLY LIMITED TO SUCH TERMS. IF YOU DO NOT UNCONDITIONALLY AGREE TO ALL THE TERMS AND CONDITIONS OF THIS AGREEMENT, YOU HAVE NO RIGHT TO USE THE WEBSITE OR SERVICES. USE OF ONEROOST’S SERVICES IS EXPRESSLY CONDITIONED UPON YOUR ASSENT TO ALL THE TERMS AND CONDITIONS OF THIS AGREEMENT, TO THE EXCLUSION OF ALL OTHER TERMS."}
                </p>
            </section>
            <section>
                <p>
                    <span className="number">{"1."}</span>
                    <span className="heading">CONTRACTING PARTY.</span>
                    {"Effective December 1, 2016, OneRoost, and its successors and assigns, is the sole contracting party liable for any obligations to you under this Agreement if you are a customer outside the United States or outside the states of Alabama, Georgia, Maryland, Michigan, Missouri, New Jersey, North Carolina, Ohio and Pennsylvania. By continuing visiting the Website, using the Services, and/or making payments for the use of the Website and/or the Services, you agree that the only party liable to you under this Agreement is OneRoost, its successors and assigns. For avoidance of doubt and subject to Section 2, OneRoost, LLC is not a party to this agreement."}
                </p>
            </section>
            <section>
                <p>
                    <span className="number">{"2."}</span>
                    <span className="heading">{"IF YOU ARE FROM ALABAMA, GEORGIA, MARYLAND, MICHIGAN, MISSOURI, NEW JERSEY, NORTH CAROLINA, OHIO, OR PENNSYLVANIA."}</span>
                    {"If you are from Alabama, Georgia, Maryland, Michigan, Missouri, New Jersey North Carolina, Ohio, or Pennsylvania, you are contracting with OneRoost, LLC and agree that the only contracting party liable to you under this Agreement is OneRoost, LLC, and its successors and assigns. For avoidance of any doubt, OneRoost, LLC, and its successors and assigns, is not liable to you under this Agreement. If this Section 2 applies to you, any reference to “ONEROOST”, “WE”, “US”, or “OUR” shall mean OneRoost, LLC. and its successors and assigns."}
                </p>

            </section>
            <section>
                <p>
                    <span className="number">{"3."}</span>
                    <span className="heading">DESCRIPTION OF THE SERVICES.</span>
                    {"The services provided by OneRoost consist of a business-to-business communication and engagement tool for web app owners and include other services and tools offered by OneRoost from time to time which you have selected and which are subject to supplemental terms (together the “Services”). The Services enable you as a customer to do the following with respect to your end user customers (“End User Customers”): browse your End User Customer contacts in a database, message your End User Customers on the web app and via email, and track your relationships with such End User Customers, including the characteristics and activities of visitors to your OneRoost profile. Other services and tools made available by OneRoost have the properties and capabilities set out in the associated supplemental terms."}
                </p>
            </section>
            <section>
                <p>
                    <span className="number">{"4."}</span>
                    <span className="heading">ACCESS TO THE SERVICES.</span>
                    {"The Services, together with the "}<a href={domain}>{domain}</a>{" website and domain name and any other linked pages, features, content, or application services offered from time to time by OneRoost (collectively, the “Website”), are owned and operated by OneRoost. Subject to the terms and conditions of this Agreement, OneRoost hereby grants you a non-exclusive license, with no right to sublicense, to copy and install certain OneRoost code on a website you own, control or operate, for the sole purpose of using the Services in connection with such websites. OneRoost may change, suspend or discontinue the Services at any time, including the availability of any feature, database, or OneRoost Content (as defined below). OneRoost may also impose limits on certain features and services or restrict your access to parts or all of the Services without notice or liability. OneRoost reserves the right, in its sole discretion, to modify this Agreement at any time by posting a notice on the Website, or by sending you a notice via email or postal mail. You shall be responsible for reviewing and becoming familiar with any such modifications. Your use of the Services following such notification constitutes your acceptance of the terms and conditions of this Agreement as modified. You represent and warrant to OneRoost that: (i) you are of legal age to form a binding contract, and you are at least 13 years or age or older; (ii) all registration information you submit is accurate and truthful; and (iii) you will maintain the accuracy of such information. You also certify that you are legally permitted to use and access the Services and take full responsibility for the selection and use of and access to the Services. This Agreement is void where prohibited by law, and the right to access the Services is revoked in such jurisdictions."}
                </p>
            </section>
            <section>
                <p>
                    <span className="number">{"5."}</span>
                    <span className="heading">ONEROOST CONTENT.</span>
                    {"The Website, the Services, and their contents may only be used in accordance with the terms of this Agreement. All materials displayed or performed on the Website or in the Services, including, but not limited to text, graphics, articles, photographs, images, illustrations (also known as the “OneRoost Content,”) are protected by copyright. You shall abide by all copyright notices, trademark rules, information, and restrictions contained in any OneRoost Content accessed through the Services, and shall not use, copy, reproduce, modify, translate, publish, broadcast, transmit, distribute, perform, upload, display, license, sell or otherwise exploit for any purposes whatsoever any OneRoost Content or other proprietary rights not owned by you: (i) without the express prior written consent of the respective owners, and (ii) in any way that violates any third party right. You may download or copy the OneRoost Content (and other items displayed on the Website or Services for download) for personal noncommercial use only (unless provided for otherwise in supplemental terms), provided that you maintain all copyright and other notices contained in such OneRoost Content. You shall not store any significant portion of any OneRoost Content in any form. Copying or storing of any OneRoost Content other than personal, noncommercial use is expressly prohibited without prior written permission from OneRoost or from the copyright holder identified in such OneRoost Content’s copyright notice. If you link to the Website, OneRoost may revoke your right to so link at any time, at OneRoost’s sole discretion."}
                </p>
            </section>
            <section>
                <p>
                    <span className="number">{"6."}</span>
                    <span className="heading">YOUR CONTENT.</span>
                    {"In the course of using the Services, you may provide information which may be used by OneRoost in connection with the Services. You understand that by providing content, materials or information (including without limitation information relating to your end user customers) to OneRoost or in connection with the Services (collectively, “Your Content”), OneRoost hereby is and shall be granted a nonexclusive, worldwide, royalty free, perpetual, irrevocable, sublicenseable and transferable right to use, process, store, copy, reproduce, reformat, translate, modify and create derivative works of Your Content (including all related intellectual property rights) in connection with OneRoost’s provision of the Services. For clarity, the foregoing license grant to OneRoost does not affect your ownership of or right to grant additional licenses to the material in Your Content. You also acknowledge and agree that OneRoost may use Your Content internally for improving the Services, and on an anonymized and aggregate basis for the purposes of marketing and improving the Services. However, OneRoost will only share your personally identifiable information in accordance with OneRoost’s privacy policy in effect from time to time and located at "}<a href={privacyUrl}>{privacyUrl}</a>{", and OneRoost will never contact your end user customers directly except as expressly authorized by you in connection with OneRoost’s provision of the Services."}
                </p>
            </section>
            <section>
                <p>
                    <span className="number">{"7."}</span>
                    <span className="heading">YOUR WARRANTY.</span>
                    {"If you provide any personally identifiable information, including personally identifiable information relating to your end user customers, to OneRoost, you represent and warrant that (i) you will comply with all applicable laws relating to the collection, use and disclosure of personally identifiable information, (ii) you have posted a privacy policy on each website on which you use the Services, which clearly and conspicuously states that (a) you use third party service providers to provide certain services to you in connection with such website, and (b) you may disclose personally identifiable information to such third party service providers for the sole purpose of the provision of services to you, and (iii) you have made all required notifications and obtained all required consents and authorizations from your website visitors and end user customers relating to the disclosure of personally identifiable information to a third party service provider like OneRoost. You also warrant, represent and agree that you will not contribute any content or otherwise use the Services in a manner that (i) infringes or violates the intellectual property rights or proprietary rights, rights of publicity or privacy, or other rights of any third party, (ii) violates any law, statute, ordinance or regulation, (iii) is harmful, fraudulent, deceptive, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, or otherwise objectionable, (iv) impersonates any person or entity, including without limitation any employee or representative of OneRoost, or (v) contains a virus, trojan horse, worm, time bomb, or other harmful computer code, file, or program. OneRoost reserves the right to remove any content from the Services at any time, for any reason (including, but not limited to, upon receipt of claims or allegations from third parties or authorities relating to such content or if OneRoost is concerned that you may have breached the immediately preceding sentence), or for no reason at all."}
                </p>
            </section>
            <section>
                <p>
                    <span className="number">{"8."}</span>
                    <span className="heading">RESTRICTIONS.</span>
                    {"You are responsible for all of your activity in connection with the Services. Any fraudulent, abusive, or otherwise illegal activity may be grounds for termination of your right to access or use the Services. You may not post or transmit, or cause to be posted or transmitted, any communication or solicitation designed or intended to obtain password, account, or private information from any other user of the Services. Use of the Services to violate the security of any computer network, crack passwords or security encryption codes, transfer or store illegal material (including material that may be considered threatening or obscene), or engage in any kind of illegal activity is expressly prohibited. You will not run Maillist, Listserv, any form of auto-responder, or “spam” on the Services, or any processes that run or are activated while you are not logged on to the Website, or that otherwise interfere with the proper working of or place an unreasonable load on the Services’ infrastructure. Further, the use of manual or automated software, devices, or other processes to “crawl,” “scrape,” or “spider” any page of the Website is strictly prohibited. You will not decompile, reverse engineer, or otherwise attempt to obtain the source code of the Services. You will be responsible for withholding, filing, and reporting all taxes, duties and other governmental assessments associated with your activity in connection with the Services."}
                </p>
                <p>
                    {"You acknowledge that all OneRoost Content and Your Content (together, “Content”) accessed by you using the Services is at your own risk and you will be solely responsible for any damage or loss to any party resulting therefrom. Under no circumstances will OneRoost be liable in any way for any Content, including, but not limited to, any errors or omissions in any Content, including without limitation reports generated by the Services, or any loss or damage of any kind incurred in connection with use of or exposure to any Content posted, emailed, accessed, transmitted, or otherwise made available via the Services. You, not OneRoost, remain solely responsible for all Content, including messages, that you upload, post, email, transmit, or otherwise disseminate using, or in connection with, the Services. You acknowledge and agree that your indemnity obligation in Section 12 also applies to any third party claims relating to your disclosure of any third party personally identifiable information or the tracking of visitors (including without limitation your end user customers) on your website."}
                </p>
            </section>
            <section>
                <p>
                    <span className="number">{"9."}</span>
                    <span className="heading">WARRANTY DISCLAIMER.</span>
                    {"You acknowledge that OneRoost has no control over, and no duty to take any action regarding: which users gain access to the Services; what Content you access via the Services; what effects the Content may have on you; how you may interpret or use the Content; or what actions you may take as a result of having been exposed to the Content. You release OneRoost from all liability for you having acquired or not acquired Content through the Services. The Services may contain, or direct you to websites or applications containing information that some people may find offensive or inappropriate. OneRoost makes no representations concerning any content contained in or accessed through the Services, and OneRoost will not be responsible or liable for the accuracy, copyright compliance, legality or decency of material contained in or accessed through the Services. OneRoost makes no representations or warranties regarding suggestions or recommendations of services or products offered or purchased through the Services. THE SERVICES CONTENT, WEBSITE AND ANY SOFTWARE ARE PROVIDED ON AN “AS IS” BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, WITHOUT LIMITATION, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR THAT USE OF THE SERVICES WILL BE UNINTERRUPTED, SECURE OR ERROR-FREE. NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED FROM ONEROOST OR THROUGH THE WEBSITE WILL CREATE ANY WARRANTY NOT EXPRESSLY MADE HEREIN. SOME STATES DO NOT ALLOW LIMITATIONS ON HOW LONG AN IMPLIED WARRANTY LASTS, SO THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU."}
                </p>
            </section>
            <section>
                <p>
                    <span className="number">{"10."}</span>
                    <span className="heading">PRIVACY POLICY.</span>
                    {"For information regarding OneRoost’s treatment of personally identifiable information, please review OneRoost’s current Privacy Policy at "}
                    <a href={privacyUrl}>{privacyUrl}</a>
                    {", which is hereby incorporated by reference; your acceptance of this Agreement constitutes your acceptance and agreement to be bound by OneRoost’s Privacy Policy."}
                </p>
            </section>
            <section>
                <p>
                    <span className="number">{"11."}</span>
                    <span className="heading">REGISTRATION AND SECURITY.</span>
                    {"As a condition to using some aspects of the Services, you may be required to register with OneRoost and set a password and user name (“User ID”). You shall provide OneRoost with accurate, complete, and updated registration information. Failure to do so shall constitute a breach of this Agreement, which may result in immediate termination of your account. You may not (i) select or use as a User ID a name of another person with the intent to impersonate that person; or (ii) use as a User ID a name subject to any rights of a person other than you without appropriate authorization. OneRoost reserves the right to refuse registration of or cancel a User ID in its discretion. You shall be responsible for maintaining the confidentiality of your password."}
                </p>
            </section>
            <section>
                <p>
                    <span className="number">{"12."}</span>
                    <span className="heading">IDENTITY.</span>
                    {"You will indemnify and hold OneRoost, its parents, subsidiaries, affiliates, officers, and employees harmless (including, without limitation, from all damages, liabilities, settlements, costs and attorneys’ fees) from any claim or demand made by any third party due to or arising out of your access to the Services, use of the Services, your violation of this Agreement or applicable laws, rules or regulations in connection with your use of the Services, or the infringement by you or any third party using your account of any intellectual property or other right of any person or entity."}
                </p>
            </section>
            <section>
                <p>
                    <span className="number">{"13."}</span>
                    <span className="heading">LIMITATION OF LIABILITY.</span>
                    {"IN NO EVENT SHALL ONEROOST OR ITS SUPPLIERS, OR THEIR RESPECTIVE OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE WITH RESPECT TO THE WEBSITE OR THE SERVICES OR THE SUBJECT MATTER OF THIS AGREEMENT UNDER ANY CONTRACT, NEGLIGENCE, TORT, STRICT LIABILITY OR OTHER LEGAL OR EQUITABLE THEORY (I) FOR ANY AMOUNT IN THE AGGREGATE IN EXCESS OF THE GREATER OF $100 OR THE FEES PAID BY YOU FOR THE SERVICES DURING THE 6- MONTH PERIOD PRECEDING THE APPLICABLE CLAIM; (II) FOR ANY INDIRECT, INCIDENTAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES OF ANY KIND WHATSOEVER; (III) FOR DATA LOSS OR COST OF PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; OR (IV) FOR ANY MATTER BEYOND ONEROOST’S REASONABLE CONTROL. SOME STATES DO NOT ALLOW THE EXCLUSION OR LIMITATION OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE ABOVE LIMITATIONS AND EXCLUSIONS MAY NOT APPLY TO YOU."}
                </p>
            </section>
            <section>
                <p>
                    <span className="number">{"14."}</span>
                    <span className="heading">FEES AND PAYMENT.</span>
                    {"OneRoost reserves the right to require payment of fees for certain or all Services. You shall pay all applicable fees, as described on the Website in connection with such Services selected by you. OneRoost reserves the right to change its price list and to institute new charges at any time, upon notice to you, which may be sent by email or posted on the Website. Your use of the Services following such notification constitutes your acceptance of any new or increased charges. Any fees paid hereunder are non-refundable."}
                </p>
            </section>
            <section>
                <p>
                    <span className="number">{"15."}</span>
                    <span className="heading">TAXES.</span>
                    {"“Taxes” means all taxes, levies, imposts, duties, fines or similar governmental assessments imposed by any jurisdiction, country or any subdivision or authority thereof including, but not limited to federal, state or local sales, VAT, GST, use, property, excise, service, transaction, privilege, occupation, gross receipts or similar taxes, in any way connected with this Agreement or agreement required hereunder, and all interest, penalties or similar liabilities with respect thereto, except such taxes imposed on or measured by a party’s net income. All prices, fees and other charges payable under this Agreement or agreement ancillary to or referenced by this Agreement, shall not include any Taxes. You agree to bear and be responsible for all such Taxes. You shall make all payments required without deduction of any Taxes, except as required by law, in which case the amount payable shall be increased as necessary so that after making any required deductions and withholdings, OneRoost receives and retains (free from any liability for payment of Taxes) an amount equal to the amount it would have received had no such deductions or withholdings been made. If you are a tax-exempt entity or claims exemption from any Taxes under this Agreement, you shall provide a certificate of exemption upon execution of this Agreement and, after receipt of valid evidence of exemption, OneRoost shall not charge you any Taxes from which it is exempt. Without limiting the foregoing, all references to payments made in this Agreement are exclusive of any VAT, GST or other consumption taxes (collectively, “VAT”) chargeable and where required by law, VAT shall be itemized at the rate applicable, if any, and paid in addition thereto. You shall communicate to OneRoost your VAT identification number(s) attributed by (i) the country where you have established your business, and/or (ii) any other country where you have established a fixed establishment, to which the Services under this Agreement are provided. OneRoost shall consider the Services under this Agreement to be for your business use and provided to the location(s) of you in accordance with the provided VAT identification number(s). You shall comply with all applicable tax laws and regulations, and you shall provide OneRoost all necessary assistance to facilitate the recovery or refund of any VAT paid by OneRoost in relation to the Services to the respective government or authority. You hereby agree to indemnify OneRoost for any Taxes and related costs paid or payable by OneRoost attributable to Taxes that would have been your responsibility under this section if invoiced to you. You shall promptly pay or reimburse OneRoost for all costs and damages related to any liability incurred by OneRoost as a result of your non-compliance or delay with its responsibilities herein. Your obligation under this section shall survive the termination or expiration of this Agreement."}
                </p>
            </section>
            <section>
                <p>
                    <span className="number">{"16."}</span>
                    <span className="heading">THIRD PARTY WEBSITES.</span>
                    {"The Services may contain links to third party websites or services (“Third Party Websites”) that are not owned or controlled by OneRoost. When you access Third Party Websites, you do so at your own risk."}
                </p>
            </section>
            <section>
                <p>
                    <span className="number">{"17."}</span>
                    <span className="heading">TERMINATION.</span>
                    {"This Agreement shall remain in full force and effect while you use the Services. You may terminate your use of the Services at any time. OneRoost may terminate or suspend your access to the Services or your membership at any time, for any reason, and without warning, which may result in the forfeiture and destruction of all information associated with your membership. OneRoost may also terminate or suspend any and all Services and access to the Website immediately, without prior notice or liability, if you breach any of the terms or conditions of this Agreement. Upon termination of your account, your right to use the Services, access the Website, and any Content will immediately cease. All provisions of this Agreement which, by their nature, should survive termination, shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, and limitations of liability."}
                </p>
            </section>
            <section>
                <p>
                    <span className="number">{"18."}</span>
                    <span className="heading">MISCELLANEOUS.</span>
                    {"The failure of either party to exercise, in any respect, any right provided for herein shall not be deemed a waiver of any further rights hereunder. If any provision of this Agreement is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that this Agreement shall otherwise remain in full force and effect and enforceable. This Agreement is not assignable, transferable or sublicensable by you except with OneRoost’s prior written consent. OneRoost may transfer, assign or delegate this Agreement and its rights and obligations without consent. No agency, partnership, joint venture, or employment is created as a result of this Agreement and you do not have any authority of any kind to bind OneRoost in any respect whatsoever. Headings for each section have been included above for your convenience, but such headings do not have any legal meaning, and may not accurately reflect the content of the provisions they precede."}
                </p>
            </section>
            <section>
                <p>
                    <span className="number">{"1."}</span>
                    <span className="heading">ARBITRATION; GOVERNING LAW.</span>
                    {"This Agreement shall be governed by and construed in accordance with the laws of the State of Colorado without regard to the conflict of laws provisions thereof. Any dispute arising from or relating to the subject matter of this Agreement shall be finally settled by arbitration in Denver County, Colorado, using the English language in accordance with the Streamlined Arbitration Rules and Procedures of Judicial Arbitration and Mediation Services, Inc. (“JAMS”) then in effect, by one commercial arbitrator with substantial experience in resolving intellectual property and commercial contract disputes, who shall be selected from the appropriate list of JAMS arbitrators in accordance with the Streamlined Arbitration Rules and Procedures of JAMS. Judgment upon the award so rendered may be entered in a court having jurisdiction, or application may be made to such court for judicial acceptance of any award and an order of enforcement, as the case may be. Notwithstanding the foregoing, each party shall have the right to institute an action in a court of proper jurisdiction for injunctive or other equitable relief pending a final decision by the arbitrator. Any arbitration under this Agreement will take place on an individual basis: class arbitrations and class actions are not permitted. YOU"}
                </p>
                <p>
                    {"UNDERSTAND AND AGREE THAT BY ENTERING INTO THIS AGREEMENT, YOU AND ONEROOST ARE EACH WAIVING THE RIGHT TO TRIAL BY JURY OR TO PARTICIPATE IN A CLASS ACTION."}
                </p>
            </section>
            <section>
                <p>
                    <span className="number">{"20."}</span>
                    <span className="heading">CONTACT.</span>
                    {"If you have any questions, complaints, or claims with respect to the Services, you may contact us at"} <a href={`mailto:${contactEmail}`}>{contactEmail}</a>{"."}
                </p>
            </section>
            <footer>
                {"Effective: December 1, 2016"}
            </footer>
        </div>

        return terms;
    }
})

export default TermsOfService
