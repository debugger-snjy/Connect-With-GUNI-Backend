// API Error Class Extending the Node JS Error Class
class APIError{

    // Constructor
    constructor(statusCode = 400, message = "Something Went Wrong") {

        // Status Code that we want to set for the Error
        this.statusCode = statusCode;

        // Used to store any extra data that we want to include with the error for debugging or logging
        this.data = null;

        // Error message that describes what went wrong
        this.message = message;

        // This is a variable for frontend to check whether the api is hit successfully or not
        this.success = false;
    }

    // Created the Class Method to Send the Error Response
    send(res) {
        return res
            .status(this.statusCode)
            .json({
                message: this.message,
                success: this.success,
                error: this.errors
            })
    }
}


// Exporting the APIError Class
export { APIError };