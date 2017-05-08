import FormUtil, {Validation} from "FormUtil"

export const profileValidation = {
    company: [
        new Validation(FormUtil.notNullOrEmpty, "error", "Please enter a company name"),
    ],
    firstName: [
        new Validation(FormUtil.notNullOrEmpty, "error", "Please enter your first name"),
    ],
    lastName: [
        new Validation(FormUtil.notNullOrEmpty, "error", "Please enter your last name"),
    ],
    email: [
        new Validation(FormUtil.notNullOrEmpty, "error", "You must enter an email"),
        new Validation(FormUtil.isValidEmail, "error", "You must enter a valid email"),
    ],
}
