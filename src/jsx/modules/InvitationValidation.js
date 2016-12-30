import FormUtil, {Validation} from "FormUtil"

let passwordValidation = [
    new Validation(FormUtil.notNullOrEmpty, "error", "Please enter a password (Minimum 6 characters)"),
    new Validation(FormUtil.minimumLength(6), "error", "A password must be at least 6 characters")
]


export const confirmValidation = {
    "password": passwordValidation,
    "confirmPassword": new Validation(FormUtil.matchesField("password"), "error", "Your passwords must match.")

}
export const loginValidatoin = {
    "password": passwordValidation
}
