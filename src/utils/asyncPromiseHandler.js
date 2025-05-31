// For Detail description of the below code that we are using, please refer [src/utils/asyncTryCatchHandler.js] File

import { APIError } from "./apiError.js"

// NOTE : Here we have to return the function that return the async function with the promise
// We are using the block function, so have to return the function, it will not automatically return the function
// Either use bock function with return function or use the arrow function

// --------------------------------------------------------------------------------------------------------------------
// BLOCK FUNCTION WITH RETURN STATEMENT
// const asyncPromiseHandler = (requestHandler) => {
//     return (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next))
//             .catch((error) => {
//                 next(error)
//             })
//     }
// }

// --------------------------------------------------------------------------------------------------------------------
// ARROW FUNCTION (RETURN AUTOMATIC)
const asyncPromiseHandler = (requestHandler) =>
    (req, res, next) => {
        try {
            Promise.resolve(requestHandler(req, res, next))
                .catch((error) => {

                    // Checking the Error Object Values
                    // console.log("Error 1", typeof error)
                    // console.log("Error 1", Object.keys(error))
                    // console.log("Error stringValue : ", error.stringValue);
                    // console.log("Error messageFormat : ", error.messageFormat);
                    // console.log("Error kind : ", error.kind);
                    // console.log("Error value : ", error.value);
                    // console.log("Error path : ", error.path);
                    // console.log("Error reason : ", error.reason);
                    // console.log("Error valueType : ", error.valueType);

                    // Getting the Error File Name and Line Number For Developer Ease
                    var stack = error.stack;
                    var stackLines = stack.split('\n');
                    // console.log(stackLines)
                    var lineNumber;
                    for (var i = 0; i < stackLines.length; i++) {
                        if (stackLines[i].includes("CodersTube_Backend") && !stackLines[i].includes("node_modules")) {
                            var lineMatch = stackLines[i].match(/src/);
                            var matchIndex = lineMatch["index"]
                            // console.log("Line : ", lineMatch)
                            // console.log("Error : ", stackLines[i].slice(matchIndex))
                            console.log(`[${stackLines[i].slice(matchIndex)}] Error : ${stackLines[0]}`)
                            lineNumber = lineMatch ? lineMatch[1] : undefined;
                            break;
                        }
                    }

                    let msg = "";
                    if (error.kind === "ObjectId") {
                        msg = ", Invalid ID at Line " + lineNumber
                    }
                    return new APIError(400, `Something Went Wrong${msg}`).send(res)
                })
        } catch (error) {
            console.log("Error 2")
            return new APIError(400, "Error Message").send(res)
        }
    }

export { asyncPromiseHandler }