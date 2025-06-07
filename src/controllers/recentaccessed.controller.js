import { validationResult } from "express-validator";
import RecentAccessed from "../models/recentaccessed.model.js";
import { APIError } from "../utils/apiError.js";
import { APIResponse } from "../utils/apiResponse.js";

// For Adding Recent Accessed - POST Request
// Full Route : /api/admin/recentaccessed/add
export const addRecentAccessed = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "";

    try {
        console.log("Here, You can Add Note Here !")

        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {
            // Setting up the parameters
            msg = "Recent Accessed Not Added Successfully"
            // sending the errors that are present
            return res.status(400).json(new APIError(400, msg, errors.array()));
        }

        // If no errors are present or found
        const RecentAccessedUser = await RecentAccessed.find({ user: req.user.id })
        const { link, description, timestamp } = req.body

        if (RecentAccessedUser.length != 0) {
            console.log("Data exists")

            // Getting the data from the record
            console.log(RecentAccessedUser)
            console.log(RecentAccessedUser[0].recentData)
            RecentAccessedUser[0].recentData.push({ link: link, description: description, timestamp: timestamp })

            console.log(RecentAccessedUser[0].recentData)

            const updatedRecentAccessed = await RecentAccessed.findByIdAndUpdate(
                RecentAccessedUser[0]._id,
                { $set: { "recentData": RecentAccessedUser[0].recentData } },
                { new: true }
            )

            if (updatedRecentAccessed) {
                console.log("Record Updated !")
                // Setting up the parameters
                msg = "Recent Accessed Updated Successfully"
                // returning the saved note Details
                return res.status(200).json(new APIResponse(200, updatedRecentAccessed, msg));
            }
        } else {
            console.log("Data Doesn't exists")

            // Destructing Data from body
            // TODO : Add user id through Middleware (student/faculty)
            // Creating a recentAccessed
            const recentAccessed = new RecentAccessed({ user: req.user.id, recentData: { link, description, timestamp } })

            // Saving recentAccessed in database
            const savedRecentAccessed = await recentAccessed.save();

            // Setting up the parameters
            msg = "Recent Accessed Added Successfully"
            // returning the saved note Details
            return res.status(200).json(new APIResponse(200, savedRecentAccessed, msg));
        }
        // If update failed and no else triggered
        msg = "Recent Accessed Not Added Successfully"
        return res.status(500).json(new APIError(500, msg));
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        // Setting up the parameters
        msg = "Recent Accessed Not Added Successfully"
        return res.status(500).json(new APIError(500, msg, error.message));
    }
}

// For Fetching Recent Accessed - POST Request
// Full Route : /api/admin/recentaccessed/fetch
export const fetchRecentAccessed = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "";

    try {
        console.log("Here, You can Add Note Here !")

        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {
            // Setting up the parameters
            msg = "Recent Accessed Not Added Successfully"
            // sending the errors that are present
            return res.status(400).json(new APIError(400, msg, errors.array()));
        }

        // If no errors are present or found
        const RecentAccessedUser = await RecentAccessed.find({ user: req.user.id })

        if (RecentAccessedUser.length > 0) {
            // Setting up the parameters
            msg = "Recent Accessed Fetched Successfully"
            // returning the saved note Details
            return res.status(200).json(new APIResponse(200, RecentAccessedUser, msg));
        } else {
            // Setting up the parameters
            msg = "Recent Accessed Not Fetched"
            // returning the saved note Details
            return res.status(404).json(new APIError(404, msg, "No Records Found !!"));
        }
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        // Setting up the parameters
        msg = "Recent Accessed NOT Fetched Successfully"
        return res.status(500).json(new APIError(500, msg, error.message));
    }
}