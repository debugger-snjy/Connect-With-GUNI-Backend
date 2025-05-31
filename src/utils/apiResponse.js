// API Response Class for sending Response
class APIResponse {

    constructor(statusCode = 200, data, message = "Success") {

        // Status Code that we want to set for the Success
        this.statusCode = statusCode;

        // Used to store any extra data that we want to include with the success for displaying data like single record, lists etc . . .
        this.data = data;

        // Success message that describes what went wrong
        this.message = message;

        // This is a variable for frontend to check whether the api is hit successfully or not
        // Here we are checking that whether the status code is less than 400, this means that the API is hit properly and executed !
        this.success = statusCode < 400;

    }
}

// Exporting the API Response Class
export { APIResponse };