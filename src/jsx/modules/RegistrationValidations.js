import FormUtil, {Validation} from "FormUtil"

export const loginValidation = {
    email: [
        new Validation(FormUtil.notNullOrEmpty, "error", "You must enter an email"),
        new Validation(FormUtil.isValidEmail, "error", "You must enter a valid email"),
    ],
    password: new Validation(FormUtil.notNullOrEmpty, "error", "Please enter a password")
}


export const registerValidation = {
    email: [
        new Validation(FormUtil.notNullOrEmpty, "error", "You must enter an email"),
        new Validation(FormUtil.isValidEmail, "error", "You must enter a valid email"),
    ],
    password: [
        new Validation(FormUtil.notNullOrEmpty, "error", "Please enter a password"),
        new Validation(FormUtil.minimumLength(6), "error", "Your password must be at least 6 characters"),
    ],
    company: [
        new Validation(FormUtil.notNullOrEmpty, "error", "Please enter a company name"),
    ],
    firstName: [
        new Validation(FormUtil.notNullOrEmpty, "error", "Please enter your first name"),
    ],
    lastName: [
        new Validation(FormUtil.notNullOrEmpty, "error", "Please enter your last name"),
    ]
}
