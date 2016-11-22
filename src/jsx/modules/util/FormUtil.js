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
    return !isNullOrEmpty(input);
}

exports.getErrors = function( data, validations )
{
    var errors = {};
    for (var [field, validation] of Object.entries(validations)){
        var value = data[field];
        if (!validation.isValid(value))
        {
            errors[field] = {
                field: field,
                level: validation.level,
                message: validation.message
            }
        }
    }
    return errors;
}

exports.Validation = Validation;
