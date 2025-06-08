// This file is used for Authentication Purpose when user login in the app

// Importing the express Package
import { Router } from 'express';

// Create a router of the express
const authRouter = Router()

// Importing the express-validator
import { body, validationResult } from 'express-validator';

// Importing dotenv for accessing the Environment Variables
import { config } from 'dotenv';

// Loads .env file contents into process.env by default
// dotenv.config(); ----> This will not work if Both Backend and Frontend are in same folder
// Because, it will search for the .env file outside the folder i.e, root (Here, ConnectWithGUNI)
// So, to specify from where to load the .env file, we will define the path in the config
config({ path: "../Backend/.env" });
// The default path is "/.env"

// Importing the Middleware File :
import { fetchUser } from "../middleware/auth.middleware.js"

// Creating JWT_SECRET :
// const JWT_SECRET = "Sanjayisagoodcoderok";
// This should be hidden and not be disclosed
// Putting it in .env.local
const JWT_SECRET = process.env.JWT_SECRET_KEY;
console.log(process.env.JWT_SECRET_KEY);

// Importing jsonwebtoken
import jwt from "jsonwebtoken";
import { loginUser, getUser } from '../controllers/auth.controller.js';

// Route 1 : Authenticate a user using POST Request. No Login Required
// Full Route : /api/v1/auth/login
// We are using POST as we are dealing with the passwords
authRouter.post('/login', [
    // exists() ==> Used to check that the field shoul not be undefined
    body("email", "Email is Empty").exists(),
    body("password", "Password is Empty").exists(),
    body("role", "Your Role is Empty").exists(),

    body("email", "Enter a valid Email").isEmail(),
    body("password", "Enter a valid Password").isLength({ min: 5, max: 20 })
], loginUser);


// Route 2 : Get Details of Loggedin User using POST Request. Login Required
// Full Route : /api/v1/auth/getuser
// For that one, thing is neccessary that the user should be logined in
// For that, we need the AuthToken to verfiy

// Adding the middleware
authRouter.post('/getuser', fetchUser, getUser);

export default authRouter;
