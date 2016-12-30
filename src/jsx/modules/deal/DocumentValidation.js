import FormUtil, {Validation} from "FormUtil"

export const linkValidation = {
    fileName: new Validation(FormUtil.notNullOrEmpty, "error", "You must enter a file name."),
    externalLink: new Validation(FormUtil.isValidHyperLink, "error", "The link provided must be a valid hyperlink.")
}

export const fileValidation = {
    fileName: [
        new Validation(FormUtil.notNullOrEmpty, "error", "You must enter a file name.")
    ],
    uploading: new Validation(FormUtil.isFalsey, "warn", "The file must finish uploading before you can save the document."),
    uploadSuccess: new Validation(FormUtil.isTruthy, "error", "You must upload a file."),
    s3key: new Validation(FormUtil.notNullOrEmpty, "error", "You must upload a file.")
}
