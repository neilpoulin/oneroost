import moment from "moment"

const Validation = function(check, level, message){
    this.check = check;
    this.level = level;
    this.message = message;
}

Validation.prototype.isValid = function(value){
    return this.check(value);
}

function isNullOrEmpty(value){
    if ( value === null ){
        return true
    }
    if ( typeof value === "string" && value.trim().length === 0 )
    {
        return true;
    }
    return false;
}

function isValidEmail(email){
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

exports.isNullOrEmpty = isNullOrEmpty;

exports.notNullOrEmpty = function(value){
    return !isNullOrEmpty(value);
}

exports.isValidEmail = isValidEmail

exports.isValidDate = function(input){
    //todo: make sure this is actually a date
    return !isNullOrEmpty(input);
}

exports.notBefore = function(input){
    var date = moment(input);
    return date.isSameOrAfter(moment(), "day")
}

exports.getErrors = function( data, validationMap )
{
    var errors = {};
    for (var [field, validations] of Object.entries(validationMap)){
        var value = data[field];
        if ( !(validations.constructor === Array ))
        {
            validations = [validations];
        }
        for ( let validation of validations ){
            if (!validation.isValid(value))
            {
                errors[field] = {
                    field: field,
                    level: validation.level,
                    message: validation.message
                }
                //note, this will take the validations in priority order in which they are passed
                break;
            }
        }

    }
    return errors;
}

exports.Validation = Validation;
