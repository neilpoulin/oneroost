import FormUtil, {Validation} from "FormUtil"

const validations = {
    dealName: new Validation(FormUtil.notNullOrEmpty, "error", "You must provide a Problem Summary.") ,
}
export default validations;
