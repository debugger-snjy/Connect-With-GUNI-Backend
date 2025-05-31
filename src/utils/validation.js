/**
 * Function to Check For Validation for all Fields Empty or not
 *
 * @param {object} allFields Object that have key-value pair, key will be fieldname and the value will be the value of that field
 * @returns {boolean} if all the fields are not empty, returns false
 * @returns {Array} else returns true and all empty fields [true,[emptyFields]]
 */
const isAllFieldsEmpty = (allFields) => {

    let emptyFields = [];
    let isEmpty = false;

    Object.keys(allFields).forEach((field) => {

        if (allFields[field].trim() === "" || allFields[field] === "") {
            emptyFields.push(field);
            isEmpty = true;
        }

    })

    return isEmpty ? [isEmpty, emptyFields] : isEmpty;
}


/**
* Function to Check for Email Validation
 *
 * @param {string} email String to be Checked for the Email
 * @returns {boolean} Returns a Boolean Value
 */
const isEmailValid = (email) => {

    let emailRegexp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

    return emailRegexp.test(email);

}


/**
 * Function to Check whether the text have a Valid range
 *
 * @param {string} [text=""] String to be Check
 * @param {number} [minLen=5] Minimum Length of the String
 * @param {number} [maxLen=100] Maximum Length of the String
 * @returns {boolean} Returns a Boolean Value
 */
const isMinMaxLengthValid = (text = "", minLen = 3, maxLen = 100) => {
    return (text.length >= minLen && text.length <= maxLen)
}


/**
 * Function to Check Whether the Password is Valid or not
 *
 * @param {text} password Password String
 * @param {number} [minLen=8] Minimum Length of the Password String
 * @param {number} [maxLen=25] Maximum Length of the Password String
 * @param {boolean} [specialAllowed=true] Whether Special Characters are Allowed
 * @param {boolean} [numberAllowed=true] Whether Numbers are Allowed
 * @param {boolean} [lowercase=true] Whether lowercase is Allowed
 * @param {boolean} [uppercase=true] Whether uppercase is Allowed
 * @returns {boolean} Returns a Boolean Value
 */
const isValidPassword = (password, minLen = 8, maxLen = 25, specialAllowed = true, numberAllowed = true, lowercase = true, uppercase = true) => {

    let passwordRegexp;
    let allowedChars = "";

    if (lowercase) {
        allowedChars += `a-z`
    }

    if (uppercase) {
        allowedChars += `A-Z`
    }

    if (numberAllowed) {
        allowedChars += `0-9`
    }

    if (specialAllowed) {
        allowedChars += ` !"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`
    }

    passwordRegexp = RegExp(`^[${allowedChars}]{${minLen},${maxLen}}$`)
    console.log(passwordRegexp.source);

    return passwordRegexp.test(password)
}


/**
 * Function to Check whether the given value is valid name or not (Alphabet and space allowed)
 *
 * @param {string} value String Value that we want to check
 * @returns {boolean} Returns true if the name is valid, else returns false
 */
const isValidName = (value) => {
    const nameRegexp = /^[a-zA-Z ]+$/;
    return nameRegexp.test(value);
}


/**
 * Function that will check whether the value is Empty or not
 *
 * @param {string} value String that we want to check
 * @returns {boolean} Returns true if it is empty, else return false
 */
const isEmptyField = (value) => {
    return !(value?.trim() !== "" && value !== undefined)
}


/**
 * Function to check for valid username or not
 *
 * @param {string} value String that have the username
 * @returns {boolean} Returns true if valid username else Returns false
 */
const isValidUsername = (value) => {
    const usernameRegexp = /^[a-zA-Z_-]+[0-9a-zA-Z_-]+$/;
    console.log("[src/utils/validation.js] Username : ", value);
    console.log("[src/utils/validation.js] Username : ", usernameRegexp.test(value));
    return usernameRegexp.test(value);
}


// Exporting all Functions
export {
    isAllFieldsEmpty,
    isEmailValid,
    isMinMaxLengthValid,
    isValidPassword,
    isValidName,
    isEmptyField,
    isValidUsername
}

// Testing :
// console.log("Input : ''", isEmptyField(""));
// console.log("Input : '    '", isEmptyField("     "));
// console.log("Input : '  Sanjay   '", isEmptyField("  Sanjay   "));
// console.log("Input : 'undefined'", isEmptyField("undefined"));
// console.log("Input : undefined", isEmptyField(undefined));