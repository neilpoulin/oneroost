import FormUtil, {Validation} from "FormUtil"

export const validations = {
    "title": new Validation(FormUtil.notNullOrEmpty, "error", "A title is reqired"),
    "dueDate": [
        new Validation(FormUtil.isValidDate, "error", "A due date is required"),
        new Validation(FormUtil.notBefore, "error", "The due date can not be in the past")
    ],
    "assignedUser": [
        new Validation(FormUtil.isPointer, "error", "A step must be assigned")
    ]
}
