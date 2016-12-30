import FormUtil, {Validation} from "FormUtil"

const validations = {
    accountName: new Validation(FormUtil.notNullOrEmpty, "error", "You must provide a company name.") ,
    dealName: new Validation(FormUtil.notNullOrEmpty, "error", "You must enter a Problem Summary.")
}

export default validations
