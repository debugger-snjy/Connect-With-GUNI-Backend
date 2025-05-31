// Importing the express-validator
import { body, validationResult } from 'express-validator';

// Importing the Admin schema from Admin Mongoose Model
import Admin from "../models/admin.model.js";

// Importing the Student schema from Student Mongoose Model
import Student from "../models/student.model.js";

// Importing the Faculty schema from Faculty Mongoose Model
import Faculty from "../models/faculty.model.js";
import pkg from 'jsonwebtoken';
const { sign } = pkg;

// Setting the JWT Secret
const JWT_SECRET = process.env.JWT_SECRET_KEY;

import { asyncPromiseHandler } from "../utils/asyncPromiseHandler.js";
import { APIResponse } from '../utils/apiResponse.js';
import { APIError } from '../utils/apiError.js';

const loginUser = asyncPromiseHandler(async (req, res) => {

    console.log("Here, you will have to login here !")

    // Making a Variable to track the success or not
    let msg = "";

    // Getting the Results after validations
    const errors = validationResult(req);

    // If we have errors, sending bad request with errors
    if (!errors.isEmpty()) {

        // Setting the Message
        msg = "Login Failed, Please Fill the Required Fields"

        // sending the errors that are present
        //return res.status(400).json({ status: status, msg: msg, errors: errors.array() });
        return res.status(400).json(new APIError(400, msg, errors.array()))
    }

    // Getting the Email and password :
    const { email, password, role } = req.body;

    // If no errors are present
    try {

        let userWithEmail;

        // Getting the user type or role :
        if (role === "student") {
            // Fetching the records with the email
            userWithEmail = await Student.findOne({ email });
        }
        else if (role === "faculty") {
            // Fetching the records with the email
            userWithEmail = await Faculty.findOne({ email });
        }
        else if (role === "admin") {
            // Fetching the records with the email
            userWithEmail = await Admin.findOne({ email });
        }
        else {
            console.log("Invalid User Role !!")

            msg = "Role Doesn't Exists"
            return res.status(404).json(new APIError(404, msg, "Please enter the correct role !"))
        }

        // If no record found in the database
        if (!userWithEmail) {

            // Setting the Message
            msg = "Account Doesn't Exists"

            console.log("No Email Found !");
            return res.status(404).json(new APIError(404, msg, "Please try to login with correct credentials !"))
        }

        console.log(userWithEmail)

        // If the code is here that means, user with the given email exists
        // and now we have to compare the passwords to give user a login
        const comparePassword = (password === userWithEmail.password)

        // if password doesn't matches
        if (!comparePassword) {

            // Setting the Message
            msg = "Incorrect Password"

            console.log("No Password Found !");
            return res.status(404).json(new APIError(404, msg, "Please try to login with correct credentials !"))
        }

        // if password is also same, then returning the authtoken
        const userID_Data = {
            user: {
                id: userWithEmail.id,
                role: role,
            }
        }

        // Signing the json web token
        const authToken = sign(userID_Data, JWT_SECRET);

        const cookieOptions = {
            httpOnly: true, // It will makes that the cookie will be modified by the server only
            secure: true
        }

        // return res.json(userData)
        // Setting the Message

        msg = "Login Successful"
        return res
            .status(200)
            .cookie("authToken", authToken, cookieOptions)
            .json(new APIResponse(200, { status: status, msg: msg, authToken }, "User Logged In Successfully"))

    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        
        // Setting the Message
        msg = "Login Failed, Internal Server Error"
        return res.status(500).json(new APIError(500, msg, error.message))
    }
});

const getUser = async (req, res) => {

    // To Start the code, first of all we have to check whether the user is logged in or not
    // After it is logged in, we will pass the authToken in the header and from the token we will get the id
    // If we write code here, then every time when we used the authentication, we have to paste code everytime
    // So, to make it easier we will use the middleware and that can be used anywhere

    // Making a Variable to track the success or not
    let msg = "";

    try {

        // Getting the Id and Role of the user to find ot from the database
        let userId = req.user.id;
        let userRole = req.user.role

        // Getting the User details from the id
        // To get all the data of the user from the id, we use the select() function 
        // If we don't want any field, we can write "-fieldname".
        // For not getting password, select("-password")
        let user;

        // Getting the user type or role :
        // Fetching the records from the ID that we got from the fetchUser Function ( MiddleWare )
        if (userRole === "student") {
            user = await Student.findById(userId).select("-password");
        }
        else if (userRole === "faculty") {
            user = await Faculty.findById(userId).select("-password");
        }
        else if (userRole === "admin") {
            user = await Admin.findById(userId).select("-password");
        }
        else {
            console.log("Invalid User Role !!")

            msg = "Role Doesn't Exists"
            return res.status(404).json(new APIError(404, msg, "Please enter the correct role !"))
        }

        // Setting the Message
        msg = "User Fetch Successful"

        return res.status(200).json(new APIResponse(200, { msg: msg, user }, "User Fetched Successfully"))
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        
        // Setting the Message
        msg = "User Fetch Failed, Internal Server Error"
        return res.status(500).json(new APIError(500, msg, error.message))
    }
}

export { loginUser, getUser };