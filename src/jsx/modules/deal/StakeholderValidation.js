import FormUtil, {Validation} from "FormUtil"

const validations = {
    email: new Validation(FormUtil.isValidEmail, "error", "A valid email is required"),
    firstName: new Validation(FormUtil.notNullOrEmpty, "error", "A first name is required"),
    lastName: new Validation(FormUtil.notNullOrEmpty, "error", "A last name is required"),
    company: new Validation(FormUtil.notNullOrEmpty, "error", "A company name is required")
}

export default validations;
