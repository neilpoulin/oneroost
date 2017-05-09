import FormUtil, {Validation} from "FormUtil"

const validations = {
    department: new Validation(FormUtil.notNullOrEmpty, "error", "You must choose a department"),    
}

export default validations;
