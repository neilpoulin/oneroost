import React from "react"
import moment from "moment"

const Validation = function(check, level, message){
    this.check = check;
    this.level = level;
    this.message = message;
}

Validation.prototype.isValid = function(value, data){
    return this.check(value, data);
}

exports.minimumLength = function(min){
    return function(value){
        if ( value === null ){
            return false
        }
        if ( typeof value === "string" && value.length >= min )
        {
            return true;
        }
        return false;
    }
}

exports.matchesValue = function(input){
    return function(value, data){
        return value === input;
    }
}


exports.matchesField = function(fieldName){
    return function(value, data){
        return data[fieldName] === value;
    }
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

exports.isValidHyperLink = function(input){
    var pattern = new RegExp("^(https?:\\/\\/)?"+ // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|"+ // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))"+ // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*"+ // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?"+ // query string
    "(\\#[-a-z\\d_]*)?$","i"); // fragment locater
    if(!pattern.test(input)) {
        return false;
    } else {
        return true;
    }
}

exports.isFalsey = function(value){
    return !value;
}

exports.isTruthy = function(value){
    return !!value;
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

exports.hasErrors = function( errors ){
    return errors && errors.constructor === Object && Object.keys(errors).length > 0
}

exports.getErrors = function( data, validationMap )
{
    var errors = {};
    for (let field of Object.keys(validationMap)){
        var value = data[field];
        var validations = validationMap[field];
        if ( !(validations.constructor === Array ))
        {
            validations = [validations];
        }
        for ( let validation of validations ){
            if (!validation.isValid(value, data))
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

exports.getErrorClass = function(field, errors){
    errors = errors || {};
    if (errors[field] )
    {
        return "has-" + errors[field].level
    }
    else return "";
}
exports.getErrorHelpMessage = function(field, errors){
    errors = errors || {};
    if ( errors[field] )
    {
        var error = errors[field];
        return <span key={"opportunitydetails_error_" + field} className="help-block">{error.message}</span>
    }
    return null
}
